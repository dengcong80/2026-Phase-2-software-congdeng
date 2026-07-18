namespace Backend.Models.Dtos
{
    // ─── Auth ───────────────────────────────────────────────────────────────────

    public record RegisterRequest(
        string Username,
        string Email,
        string Password
    );

    public record LoginRequest(
        string Email,
        string Password
    );

    public record AuthResponse(
        string Token,
        string Username,
        string Role,
        int TotalXp
    );

    // ─── Quest ──────────────────────────────────────────────────────────────────

    public record CreateQuestRequest(
        string Title,
        string Description,
        double Latitude,
        double Longitude,
        int RewardXp
    );

    public record UpdateQuestRequest(
        string? Title,
        string? Description,
        double? Latitude,
        double? Longitude,
        int? RewardXp,
        string? Status
    );

    public record QuestResponse(
        Guid Id,
        string Title,
        string Description,
        double Latitude,
        double Longitude,
        int RewardXp,
        string Status,
        int LikesCount,
        bool CompletedByMe,
        DateTime CreatedAt
    );

    public record CompleteQuestResponse(
        int EarnedXp,
        int TotalXp,
        List<string> NewBadges
    );

    // ─── Leaderboard ────────────────────────────────────────────────────────────

    public record LeaderboardEntryResponse(
        int Rank,
        string Username,
        int TotalXp,
        int QuestsCompleted
    );

    // ─── Shared ─────────────────────────────────────────────────────────────────

    public record ApiResponse<T>(bool Success, string? Message, T? Data);
}
