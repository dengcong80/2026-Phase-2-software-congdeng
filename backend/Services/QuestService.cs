using Backend.Data;
using Backend.Hubs;
using Backend.Models;
using Backend.Models.Dtos;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    /// <summary>
    /// Encapsulates all Quest business logic:
    ///   – CRUD operations
    ///   – Quest completion with XP calculation
    ///   – Badge evaluation (via BadgeService)
    ///   – Leaderboard update + SignalR broadcast
    /// </summary>
    public class QuestService
    {
        private readonly AppDbContext _db;
        private readonly BadgeService _badgeService;
        private readonly IHubContext<LeaderboardHub> _hub;

        public QuestService(AppDbContext db, BadgeService badgeService, IHubContext<LeaderboardHub> hub)
        {
            _db           = db;
            _badgeService = badgeService;
            _hub          = hub;
        }

        // ─── CRUD ─────────────────────────────────────────────────────────────────

        public async Task<List<QuestResponse>> GetAllAsync(Guid? requestingUserId)
        {
            var quests = await _db.Quests
                .Include(q => q.Likes)
                .Include(q => q.UserQuests)
                .Where(q => q.Status == QuestStatus.Official || q.Status == QuestStatus.Approved)
                .OrderByDescending(q => q.CreatedAt)
                .ToListAsync();

            return quests.Select(q => MapToResponse(q, requestingUserId)).ToList();
        }

        public async Task<QuestResponse?> GetByIdAsync(Guid id, Guid? requestingUserId)
        {
            var quest = await _db.Quests
                .Include(q => q.Likes)
                .Include(q => q.UserQuests)
                .FirstOrDefaultAsync(q => q.Id == id);

            return quest is null ? null : MapToResponse(quest, requestingUserId);
        }

        public async Task<QuestResponse> CreateAsync(CreateQuestRequest req, Guid creatorId, bool isAdmin)
        {
            var quest = new Quest
            {
                Title         = req.Title,
                Description   = req.Description,
                Latitude      = req.Latitude,
                Longitude     = req.Longitude,
                RewardXp      = req.RewardXp,
                // Admins/CommunityEditors create Approved quests directly;
                // Standard users submit Pending for moderation
                Status        = isAdmin ? QuestStatus.Approved : QuestStatus.Pending,
                CreatedByUserId = creatorId,
                CreatedAt     = DateTime.UtcNow,
                UserQuests    = new List<UserQuest>(),
                Likes         = new List<Like>()
            };

            _db.Quests.Add(quest);
            await _db.SaveChangesAsync();

            return MapToResponse(quest, creatorId);
        }

        public async Task<QuestResponse?> UpdateAsync(Guid id, UpdateQuestRequest req, Guid requestingUserId, bool isAdmin)
        {
            var quest = await _db.Quests.FindAsync(id);
            if (quest is null)
                return null;

            // Only admin or the quest creator may update
            if (!isAdmin && quest.CreatedByUserId != requestingUserId)
                throw new UnauthorizedAccessException("You do not own this quest.");

            if (req.Title is not null)       quest.Title       = req.Title;
            if (req.Description is not null) quest.Description = req.Description;
            if (req.Latitude.HasValue)       quest.Latitude    = req.Latitude.Value;
            if (req.Longitude.HasValue)      quest.Longitude   = req.Longitude.Value;
            if (req.RewardXp.HasValue)       quest.RewardXp    = req.RewardXp.Value;
            if (req.Status is not null && Enum.TryParse<QuestStatus>(req.Status, out var parsed))
                quest.Status = parsed;

            await _db.SaveChangesAsync();

            await _db.Entry(quest).Collection(q => q.Likes!).LoadAsync();
            await _db.Entry(quest).Collection(q => q.UserQuests!).LoadAsync();

            return MapToResponse(quest, requestingUserId);
        }

        public async Task<bool> DeleteAsync(Guid id, Guid requestingUserId, bool isAdmin)
        {
            var quest = await _db.Quests.FindAsync(id);
            if (quest is null) return false;

            if (!isAdmin && quest.CreatedByUserId != requestingUserId)
                throw new UnauthorizedAccessException("You do not own this quest.");

            _db.Quests.Remove(quest);
            await _db.SaveChangesAsync();
            return true;
        }

        // ─── Complete Quest ───────────────────────────────────────────────────────

        public async Task<CompleteQuestResponse?> CompleteQuestAsync(Guid questId, Guid userId)
        {
            var quest = await _db.Quests.FindAsync(questId);
            if (quest is null) return null;

            // Prevent double-completion
            var existing = await _db.UserQuests
                .FirstOrDefaultAsync(uq => uq.QuestId == questId && uq.UserId == userId && uq.CompletedAt != null);
            if (existing is not null)
                throw new InvalidOperationException("Quest already completed.");

            var user = await _db.Users
                .Include(u => u.Badges)
                .Include(u => u.UserQuests)
                .FirstOrDefaultAsync(u => u.Id == userId)
                ?? throw new KeyNotFoundException("User not found.");

            // Mark existing in-progress entry or create new
            var userQuest = await _db.UserQuests
                .FirstOrDefaultAsync(uq => uq.QuestId == questId && uq.UserId == userId)
                ?? new UserQuest { UserId = userId, QuestId = questId, StartedAt = DateTime.UtcNow };

            userQuest.CompletedAt = DateTime.UtcNow;
            userQuest.EarnedXp    = quest.RewardXp;

            if (userQuest.Id == Guid.Empty)
            {
                userQuest.Id = Guid.NewGuid();
                _db.UserQuests.Add(userQuest);
            }

            // Update or create leaderboard entry
            var entry = await _db.LeaderboardEntries.FirstOrDefaultAsync(e => e.UserId == userId);
            if (entry is null)
            {
                entry = new LeaderboardEntry { UserId = userId, TotalXp = 0 };
                _db.LeaderboardEntries.Add(entry);
            }

            entry.TotalXp   += quest.RewardXp;
            entry.UpdatedAt  = DateTime.UtcNow;

            await _db.SaveChangesAsync();

            // Recompute ranks for all entries
            await RecomputeRanksAsync();

            // Check for new badges
            var newBadges = await _badgeService.AwardBadgesAsync(user, entry.TotalXp);

            // Broadcast updated leaderboard via SignalR
            await BroadcastLeaderboardAsync();

            return new CompleteQuestResponse(quest.RewardXp, entry.TotalXp, newBadges);
        }

        // ─── Like ─────────────────────────────────────────────────────────────────

        public async Task<int> ToggleLikeAsync(Guid questId, Guid userId)
        {
            var quest = await _db.Quests.FindAsync(questId)
                ?? throw new KeyNotFoundException("Quest not found.");

            var like = await _db.Likes.FirstOrDefaultAsync(l => l.QuestId == questId && l.UserId == userId);
            if (like is null)
                _db.Likes.Add(new Like { QuestId = questId, UserId = userId, CreatedAt = DateTime.UtcNow });
            else
                _db.Likes.Remove(like);

            await _db.SaveChangesAsync();

            int likeCount = await _db.Likes.CountAsync(l => l.QuestId == questId);

            // Broadcast updated like count for this quest
            await _hub.Clients.All.SendAsync("QuestLikeUpdated", questId, likeCount);

            return likeCount;
        }

        // ─── Comments ─────────────────────────────────────────────────────────────

        public async Task<List<CommentResponse>> GetCommentsAsync(Guid questId, Guid? userId)
        {
            var comments = await _db.Comments
                .Include(c => c.User)
                .Include(c => c.CommentLikes)
                .Where(c => c.QuestId == questId)
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();

            return comments.Select(c => new CommentResponse(
                c.Id,
                c.User.Username,
                c.Text,
                c.CommentLikes?.Count ?? 0,
                userId.HasValue && (c.CommentLikes?.Any(l => l.UserId == userId) ?? false),
                c.CreatedAt
            )).ToList();
        }

        public async Task<CommentResponse> AddCommentAsync(Guid questId, Guid userId, string text)
        {
            var quest = await _db.Quests.FindAsync(questId) ?? throw new KeyNotFoundException("Quest not found.");
            
            var comment = new Comment
            {
                QuestId = questId,
                UserId = userId,
                Text = text,
                CreatedAt = DateTime.UtcNow,
                CommentLikes = new List<CommentLike>()
            };

            _db.Comments.Add(comment);
            await _db.SaveChangesAsync();

            await _db.Entry(comment).Reference(c => c.User).LoadAsync();

            return new CommentResponse(
                comment.Id,
                comment.User.Username,
                comment.Text,
                0,
                false,
                comment.CreatedAt
            );
        }

        public async Task<int> ToggleCommentLikeAsync(Guid commentId, Guid userId)
        {
            var comment = await _db.Comments.FindAsync(commentId)
                ?? throw new KeyNotFoundException("Comment not found.");

            var like = await _db.CommentLikes.FirstOrDefaultAsync(l => l.CommentId == commentId && l.UserId == userId);
            if (like is null)
                _db.CommentLikes.Add(new CommentLike { CommentId = commentId, UserId = userId, CreatedAt = DateTime.UtcNow });
            else
                _db.CommentLikes.Remove(like);

            await _db.SaveChangesAsync();

            return await _db.CommentLikes.CountAsync(l => l.CommentId == commentId);
        }

        // ─── Leaderboard ─────────────────────────────────────────────────────────

        public async Task<List<LeaderboardEntryResponse>> GetLeaderboardAsync(int top = 20)
        {
            return await _db.LeaderboardEntries
                .Include(e => e.User)
                .OrderByDescending(e => e.TotalXp)
                .Take(top)
                .Select(e => new LeaderboardEntryResponse(
                    e.Rank,
                    e.User.Username,
                    e.TotalXp,
                    _db.UserQuests.Count(uq => uq.UserId == e.UserId && uq.CompletedAt != null)
                ))
                .ToListAsync();
        }

        // ─── Private helpers ──────────────────────────────────────────────────────

        private static QuestResponse MapToResponse(Quest q, Guid? uid) => new(
            q.Id,
            q.Title,
            q.Description,
            q.Latitude,
            q.Longitude,
            q.RewardXp,
            q.Status.ToString(),
            q.Likes?.Count ?? 0,
            uid.HasValue && (q.UserQuests?.Any(uq => uq.UserId == uid && uq.CompletedAt != null) ?? false),
            uid.HasValue && (q.Likes?.Any(l => l.UserId == uid) ?? false),
            q.CreatedAt
        );

        private async Task RecomputeRanksAsync()
        {
            var entries = await _db.LeaderboardEntries
                .OrderByDescending(e => e.TotalXp)
                .ToListAsync();

            for (int i = 0; i < entries.Count; i++)
            {
                entries[i].Rank       = i + 1;
                entries[i].UpdatedAt  = DateTime.UtcNow;
            }

            await _db.SaveChangesAsync();
        }

        private async Task BroadcastLeaderboardAsync()
        {
            var board = await GetLeaderboardAsync(20);
            await _hub.Clients.All.SendAsync("LeaderboardUpdated", board);
        }
    }
}
