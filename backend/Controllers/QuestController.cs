using System.Security.Claims;
using Backend.Models.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    /// <summary>
    /// Full Quest CRUD plus completion and like endpoints.
    /// GET    /api/quests            – list all (public)
    /// GET    /api/quests/{id}       – get one  (public)
    /// POST   /api/quests            – create   (auth required)
    /// PUT    /api/quests/{id}       – update   (auth required, owner or admin)
    /// DELETE /api/quests/{id}       – delete   (auth required, owner or admin)
    /// POST   /api/quests/{id}/complete – complete quest (auth)
    /// POST   /api/quests/{id}/like    – toggle like    (auth)
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class QuestController : ControllerBase
    {
        private readonly QuestService _questService;

        public QuestController(QuestService questService) => _questService = questService;

        // GET /api/quests
        [HttpGet]
        [ProducesResponseType(typeof(ApiResponse<List<QuestResponse>>), 200)]
        public async Task<IActionResult> GetAll()
        {
            var uid = GetUserId();
            var result = await _questService.GetAllAsync(uid);
            return Ok(new ApiResponse<List<QuestResponse>>(true, null, result));
        }

        // GET /api/quests/{id}
        [HttpGet("{id:guid}")]
        [ProducesResponseType(typeof(ApiResponse<QuestResponse>), 200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetById(Guid id)
        {
            var uid    = GetUserId();
            var result = await _questService.GetByIdAsync(id, uid);
            if (result is null)
                return NotFound(new ApiResponse<object>(false, "Quest not found.", null));

            return Ok(new ApiResponse<QuestResponse>(true, null, result));
        }

        // POST /api/quests
        [HttpPost]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse<QuestResponse>), 201)]
        public async Task<IActionResult> Create([FromBody] CreateQuestRequest req)
        {
            var uid     = GetUserId()!.Value;
            var isAdmin = IsAdmin();
            var result  = await _questService.CreateAsync(req, uid, isAdmin);

            return CreatedAtAction(nameof(GetById), new { id = result.Id },
                new ApiResponse<QuestResponse>(true, "Quest created.", result));
        }

        // PUT /api/quests/{id}
        [HttpPut("{id:guid}")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse<QuestResponse>), 200)]
        [ProducesResponseType(403)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateQuestRequest req)
        {
            var uid = GetUserId()!.Value;
            try
            {
                var result = await _questService.UpdateAsync(id, req, uid, IsAdmin());
                if (result is null)
                    return NotFound(new ApiResponse<object>(false, "Quest not found.", null));

                return Ok(new ApiResponse<QuestResponse>(true, "Quest updated.", result));
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid();
            }
        }

        // DELETE /api/quests/{id}
        [HttpDelete("{id:guid}")]
        [Authorize]
        [ProducesResponseType(204)]
        [ProducesResponseType(403)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> Delete(Guid id)
        {
            var uid = GetUserId()!.Value;
            try
            {
                var deleted = await _questService.DeleteAsync(id, uid, IsAdmin());
                if (!deleted)
                    return NotFound(new ApiResponse<object>(false, "Quest not found.", null));

                return NoContent();
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
        }

        // POST /api/quests/{id}/complete
        [HttpPost("{id:guid}/complete")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse<CompleteQuestResponse>), 200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> Complete(Guid id)
        {
            var uid = GetUserId()!.Value;
            try
            {
                var result = await _questService.CompleteQuestAsync(id, uid);
                if (result is null)
                    return NotFound(new ApiResponse<object>(false, "Quest not found.", null));

                return Ok(new ApiResponse<CompleteQuestResponse>(true, "Quest completed!", result));
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new ApiResponse<object>(false, ex.Message, null));
            }
        }

        // POST /api/quests/{id}/like
        [HttpPost("{id:guid}/like")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse<int>), 200)]
        public async Task<IActionResult> Like(Guid id)
        {
            var uid = GetUserId()!.Value;
            try
            {
                int count = await _questService.ToggleLikeAsync(id, uid);
                return Ok(new ApiResponse<int>(true, "Like toggled.", count));
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new ApiResponse<object>(false, ex.Message, null));
            }
        }

        // GET /api/quests/{id}/comments
        [HttpGet("{id:guid}/comments")]
        [ProducesResponseType(typeof(ApiResponse<List<CommentResponse>>), 200)]
        public async Task<IActionResult> GetComments(Guid id)
        {
            var uid = GetUserId();
            var comments = await _questService.GetCommentsAsync(id, uid);
            return Ok(new ApiResponse<List<CommentResponse>>(true, null, comments));
        }

        // POST /api/quests/{id}/comments
        [HttpPost("{id:guid}/comments")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse<CommentResponse>), 201)]
        public async Task<IActionResult> CreateComment(Guid id, [FromBody] CreateCommentRequest req)
        {
            var uid = GetUserId()!.Value;
            try
            {
                var comment = await _questService.AddCommentAsync(id, uid, req.Text);
                return CreatedAtAction(nameof(GetComments), new { id }, 
                    new ApiResponse<CommentResponse>(true, "Comment created.", comment));
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new ApiResponse<object>(false, ex.Message, null));
            }
        }

        // POST /api/quests/comments/{commentId}/like
        [HttpPost("comments/{commentId:guid}/like")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse<int>), 200)]
        public async Task<IActionResult> LikeComment(Guid commentId)
        {
            var uid = GetUserId()!.Value;
            try
            {
                int count = await _questService.ToggleCommentLikeAsync(commentId, uid);
                return Ok(new ApiResponse<int>(true, "Comment like toggled.", count));
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new ApiResponse<object>(false, ex.Message, null));
            }
        }

        // ─── Helpers ─────────────────────────────────────────────────────────────

        private Guid? GetUserId()
        {
            var raw = User.FindFirstValue(ClaimTypes.NameIdentifier)
                   ?? User.FindFirstValue("sub");
            return Guid.TryParse(raw, out var id) ? id : null;
        }

        private bool IsAdmin() =>
            User.IsInRole("Administrator");
    }
}
