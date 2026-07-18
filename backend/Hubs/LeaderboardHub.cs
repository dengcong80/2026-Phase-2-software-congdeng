using Backend.Models.Dtos;
using Microsoft.AspNetCore.SignalR;

namespace Backend.Hubs
{
    /// <summary>
    /// SignalR Hub for real-time leaderboard, online count, and quest like updates.
    /// Clients connect to: /hubs/leaderboard
    /// </summary>
    public class LeaderboardHub : Hub
    {
        private static int _connectedCount;

        /// <summary>Called when a new client connects.</summary>
        public override async Task OnConnectedAsync()
        {
            _connectedCount++;
            // Notify all clients of updated online count
            await Clients.All.SendAsync("OnlineCountUpdated", _connectedCount);
            await base.OnConnectedAsync();
        }

        /// <summary>Called when a client disconnects.</summary>
        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            _connectedCount = Math.Max(0, _connectedCount - 1);
            await Clients.All.SendAsync("OnlineCountUpdated", _connectedCount);
            await base.OnDisconnectedAsync(exception);
        }

        // ─── Server-callable methods (invoked from client) ────────────────────────

        /// <summary>Allows a client to request the current online count.</summary>
        public Task GetOnlineCount() =>
            Clients.Caller.SendAsync("OnlineCountUpdated", _connectedCount);

        // ─── Events pushed from server (via IHubContext<LeaderboardHub>) ──────────
        //
        // "LeaderboardUpdated" – List<LeaderboardEntryResponse>  (after quest completion)
        // "QuestLikeUpdated"   – Guid questId, int newCount       (after like toggle)
        // "OnlineCountUpdated" – int count                        (on connect / disconnect)
    }
}
