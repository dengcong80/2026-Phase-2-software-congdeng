using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Backend.Data;
using Backend.Hubs;
using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Moq;

namespace backend.Tests
{
    public class QuestServiceTests
    {
        private static AppDbContext GetInMemoryDbContext()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            return new AppDbContext(options);
        }

        private static Mock<IHubContext<LeaderboardHub>> CreateHubContext()
        {
            var hubContext = new Mock<IHubContext<LeaderboardHub>>();
            var clients = new Mock<IHubClients>();
            var clientProxy = new Mock<IClientProxy>();

            clientProxy
                .Setup(x => x.SendCoreAsync(It.IsAny<string>(), It.IsAny<object?[]>(), It.IsAny<CancellationToken>()))
                .Returns(Task.CompletedTask);

            clients.Setup(x => x.All).Returns(clientProxy.Object);
            hubContext.Setup(x => x.Clients).Returns(clients.Object);

            return hubContext;
        }

        [Fact]
        public async Task CompleteQuestAsync_Should_AwardXp_And_Badge_And_RecordCompletion()
        {
            var dbContext = GetInMemoryDbContext();

            var user = new User
            {
                Id = Guid.NewGuid(),
                Username = "TestUser",
                Email = "test@example.com",
                PasswordHash = "hash",
                UserQuests = new List<UserQuest>(),
                Badges = new List<Badge>(),
                Likes = new List<Like>(),
                CreatedQuests = new List<Quest>()
            };

            var quest = new Quest
            {
                Id = Guid.NewGuid(),
                Title = "Test Quest",
                Description = "Test",
                RewardXp = 100,
                CreatedByUserId = user.Id,
                UserQuests = new List<UserQuest>(),
                Likes = new List<Like>()
            };

            var badge1 = new Badge { Id = Guid.NewGuid(), Name = "Explorer", Description = "Earned for exploring", RequiredXp = 50, ImageUrl = "icon.png", Users = new List<User>() };
            var badge2 = new Badge { Id = Guid.NewGuid(), Name = "Master", Description = "Earned for mastery", RequiredXp = 150, ImageUrl = "icon2.png", Users = new List<User>() };

            dbContext.Users.Add(user);
            dbContext.Quests.Add(quest);
            dbContext.Badges.AddRange(badge1, badge2);
            await dbContext.SaveChangesAsync();

            var badgeService = new BadgeService(dbContext);
            var questService = new QuestService(dbContext, badgeService, CreateHubContext().Object);

            var result = await questService.CompleteQuestAsync(quest.Id, user.Id);

            Assert.NotNull(result);
            Assert.Equal(100, result!.EarnedXp);
            Assert.Equal(100, result.TotalXp);
            Assert.Contains(result.NewBadges, badge => badge == "Explorer");
            Assert.DoesNotContain(result.NewBadges, badge => badge == "Master");

            var updatedUser = await dbContext.Users.Include(u => u.Badges).FirstAsync(u => u.Id == user.Id);
            Assert.Contains(updatedUser.Badges, badge => badge.Id == badge1.Id);
            Assert.DoesNotContain(updatedUser.Badges, badge => badge.Id == badge2.Id);

            var leaderboardEntry = await dbContext.LeaderboardEntries.FirstAsync(entry => entry.UserId == user.Id);
            Assert.Equal(100, leaderboardEntry.TotalXp);

            var userQuest = await dbContext.UserQuests.FirstAsync(entry => entry.UserId == user.Id && entry.QuestId == quest.Id);
            Assert.NotNull(userQuest.CompletedAt);
            Assert.Equal(100, userQuest.EarnedXp);
        }

        [Fact]
        public async Task CompleteQuestAsync_WhenQuestAlreadyCompleted_ThrowsInvalidOperationException()
        {
            var dbContext = GetInMemoryDbContext();

            var user = new User
            {
                Id = Guid.NewGuid(),
                Username = "TestUser",
                Email = "test@example.com",
                PasswordHash = "hash",
                UserQuests = new List<UserQuest>(),
                Badges = new List<Badge>(),
                Likes = new List<Like>(),
                CreatedQuests = new List<Quest>()
            };

            var quest = new Quest
            {
                Id = Guid.NewGuid(),
                Title = "Completed Quest",
                Description = "Already done",
                RewardXp = 50,
                UserQuests = new List<UserQuest>(),
                Likes = new List<Like>()
            };

            dbContext.Users.Add(user);
            dbContext.Quests.Add(quest);
            dbContext.UserQuests.Add(new UserQuest
            {
                UserId = user.Id,
                QuestId = quest.Id,
                CompletedAt = DateTime.UtcNow,
                EarnedXp = 50,
                StartedAt = DateTime.UtcNow.AddMinutes(-5)
            });
            await dbContext.SaveChangesAsync();

            var questService = new QuestService(dbContext, new BadgeService(dbContext), CreateHubContext().Object);

            await Assert.ThrowsAsync<InvalidOperationException>(() => questService.CompleteQuestAsync(quest.Id, user.Id));
        }

        [Fact]
        public async Task AwardBadgesAsync_ShouldAwardOnlyBadgesMatchingThreshold()
        {
            var dbContext = GetInMemoryDbContext();

            var user = new User
            {
                Id = Guid.NewGuid(),
                Username = "BadgeUser",
                Email = "badge@example.com",
                PasswordHash = "hash",
                UserQuests = new List<UserQuest>(),
                Badges = new List<Badge>(),
                Likes = new List<Like>(),
                CreatedQuests = new List<Quest>()
            };

            var lowBadge = new Badge { Id = Guid.NewGuid(), Name = "Explorer", Description = "Earned for exploring", RequiredXp = 25, ImageUrl = "icon.png", Users = new List<User>() };
            var highBadge = new Badge { Id = Guid.NewGuid(), Name = "Master", Description = "Earned for mastery", RequiredXp = 80, ImageUrl = "icon2.png", Users = new List<User>() };

            dbContext.Users.Add(user);
            dbContext.Badges.AddRange(lowBadge, highBadge);
            await dbContext.SaveChangesAsync();

            var badgeService = new BadgeService(dbContext);

            var awarded = await badgeService.AwardBadgesAsync(user, 50);

            Assert.Contains("Explorer", awarded);
            Assert.DoesNotContain("Master", awarded);

            var updatedBadge = await dbContext.Badges.Include(b => b.Users).FirstAsync(b => b.Id == lowBadge.Id);
            Assert.Contains(updatedBadge.Users, badgeUser => badgeUser.Id == user.Id);
        }

        [Fact]
        public async Task AwardBadgesAsync_ShouldNotDuplicateExistingBadges()
        {
            var dbContext = GetInMemoryDbContext();

            var user = new User
            {
                Id = Guid.NewGuid(),
                Username = "BadgeUser2",
                Email = "badge2@example.com",
                PasswordHash = "hash",
                UserQuests = new List<UserQuest>(),
                Badges = new List<Badge>(),
                Likes = new List<Like>(),
                CreatedQuests = new List<Quest>()
            };

            var existingBadge = new Badge { Id = Guid.NewGuid(), Name = "Explorer", Description = "Earned for exploring", RequiredXp = 10, ImageUrl = "icon.png", Users = new List<User>() };
            existingBadge.Users.Add(user);
            user.Badges.Add(existingBadge);

            dbContext.Users.Add(user);
            dbContext.Badges.Add(existingBadge);
            await dbContext.SaveChangesAsync();

            var badgeService = new BadgeService(dbContext);

            var awarded = await badgeService.AwardBadgesAsync(user, 20);

            Assert.Empty(awarded);
        }
    }
}
