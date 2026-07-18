using Backend.Data;
using Backend.Models;
using Backend.Models.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    /// <summary>
    /// Admin-only endpoints (RBAC policy: "AdminOnly").
    /// GET    /api/admin/users              – list all users
    /// DELETE /api/admin/users/{id}         – delete user
    /// GET    /api/admin/quests/pending     – list quests awaiting moderation
    /// PUT    /api/admin/quests/{id}/approve – approve a pending quest
    /// PUT    /api/admin/quests/{id}/reject  – reject (delete) a pending quest
    /// POST   /api/admin/badges/seed        – seed default badges
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Policy = "AdminOnly")]
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly BadgeService _badgeService;

        public AdminController(AppDbContext db, BadgeService badgeService)
        {
            _db          = db;
            _badgeService = badgeService;
        }

        // GET /api/admin/users
        [HttpGet("users")]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _db.Users
                .Select(u => new
                {
                    u.Id,
                    u.Username,
                    u.Email,
                    Role    = u.Role.ToString(),
                    Created = u.CreatedAt
                })
                .ToListAsync();

            return Ok(new ApiResponse<object>(true, null, users));
        }

        // DELETE /api/admin/users/{id}
        [HttpDelete("users/{id:guid}")]
        public async Task<IActionResult> DeleteUser(Guid id)
        {
            var user = await _db.Users.FindAsync(id);
            if (user is null)
                return NotFound(new ApiResponse<object>(false, "User not found.", null));

            _db.Users.Remove(user);
            await _db.SaveChangesAsync();
            return NoContent();
        }

        // GET /api/admin/quests/pending
        [HttpGet("quests/pending")]
        public async Task<IActionResult> GetPendingQuests()
        {
            var quests = await _db.Quests
                .Include(q => q.Likes)
                .Include(q => q.UserQuests)
                .Where(q => q.Status == QuestStatus.Pending)
                .OrderBy(q => q.CreatedAt)
                .ToListAsync();

            return Ok(new ApiResponse<object>(true, null, quests.Select(q => new
            {
                q.Id,
                q.Title,
                q.Description,
                q.Latitude,
                q.Longitude,
                q.RewardXp,
                q.CreatedByUserId,
                q.CreatedAt
            })));
        }

        // PUT /api/admin/quests/{id}/approve
        [HttpPut("quests/{id:guid}/approve")]
        public async Task<IActionResult> ApproveQuest(Guid id)
        {
            var quest = await _db.Quests.FindAsync(id);
            if (quest is null)
                return NotFound(new ApiResponse<object>(false, "Quest not found.", null));

            quest.Status = QuestStatus.Approved;
            await _db.SaveChangesAsync();

            return Ok(new ApiResponse<object>(true, "Quest approved.", new { quest.Id, quest.Title }));
        }

        // PUT /api/admin/quests/{id}/reject
        [HttpPut("quests/{id:guid}/reject")]
        public async Task<IActionResult> RejectQuest(Guid id)
        {
            var quest = await _db.Quests.FindAsync(id);
            if (quest is null)
                return NotFound(new ApiResponse<object>(false, "Quest not found.", null));

            _db.Quests.Remove(quest);
            await _db.SaveChangesAsync();

            return Ok(new ApiResponse<object>(true, "Quest rejected and removed.", null));
        }

        // POST /api/admin/badges/seed
        [HttpPost("badges/seed")]
        public async Task<IActionResult> SeedBadges()
        {
            await _badgeService.SeedDefaultBadgesAsync();
            return Ok(new ApiResponse<object>(true, "Default badges seeded.", null));
        }
    }
}
