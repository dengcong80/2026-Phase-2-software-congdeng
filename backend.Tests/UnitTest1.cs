using System;
using System.Collections.Generic;
using Backend.Data;
using Backend.Models;
using Backend.Models.Dtos;
using Backend.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace backend.Tests;

public class UserServiceTests
{
    private static AppDbContext GetInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        return new AppDbContext(options);
    }

    private static IConfiguration BuildConfiguration() =>
        new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Jwt:Key"] = "supersecretkey12345678901234567890",
                ["Jwt:Issuer"] = "https://localhost",
                ["Jwt:Audience"] = "backend"
            })
            .Build();

    [Fact]
    public async Task RegisterAsync_ShouldCreateUserAndLeaderboardEntry()
    {
        var dbContext = GetInMemoryDbContext();
        var userService = new UserService(dbContext, BuildConfiguration());

        var request = new RegisterRequest("alice", "alice@example.com", "Password123!");

        var result = await userService.RegisterAsync(request);

        Assert.NotNull(result);
        Assert.Equal("alice", result!.Username);
        Assert.Equal("Standard", result.Role);
        Assert.Equal(0, result.TotalXp);

        var createdUser = await dbContext.Users.FirstAsync(u => u.Email == request.Email);
        Assert.Equal("alice", createdUser.Username);

        var leaderboardEntry = await dbContext.LeaderboardEntries.FirstAsync(entry => entry.UserId == createdUser.Id);
        Assert.Equal(0, leaderboardEntry.TotalXp);
    }

    [Fact]
    public async Task LoginAsync_ShouldReturnNull_WhenCredentialsAreInvalid()
    {
        var dbContext = GetInMemoryDbContext();
        var userService = new UserService(dbContext, BuildConfiguration());

        var user = new User
        {
            Username = "bob",
            Email = "bob@example.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("CorrectPassword!"),
            Role = UserRole.Standard,
            UserQuests = new List<UserQuest>(),
            Badges = new List<Badge>(),
            Likes = new List<Like>(),
            CreatedQuests = new List<Quest>()
        };

        dbContext.Users.Add(user);
        await dbContext.SaveChangesAsync();

        var result = await userService.LoginAsync(new LoginRequest("bob@example.com", "WrongPassword!"));

        Assert.Null(result);
    }
}
