using Backend.Models.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    /// <summary>
    /// Real-time leaderboard REST endpoint (the hub pushes live updates; this endpoint serves
    /// initial data on page load).
    /// GET /api/leaderboard?top=20
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class LeaderboardController : ControllerBase
    {
        private readonly QuestService _questService;

        public LeaderboardController(QuestService questService) => _questService = questService;

        // GET /api/leaderboard?top=20
        [HttpGet]
        [ProducesResponseType(typeof(ApiResponse<List<LeaderboardEntryResponse>>), 200)]
        public async Task<IActionResult> GetLeaderboard([FromQuery] int top = 20)
        {
            top = Math.Clamp(top, 1, 100);
            var board = await _questService.GetLeaderboardAsync(top);
            return Ok(new ApiResponse<List<LeaderboardEntryResponse>>(true, null, board));
        }
    }
}
