using Backend.Models.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    /// <summary>
    /// Handles user registration and login.
    /// POST /api/auth/register
    /// POST /api/auth/login
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserService _userService;

        public AuthController(UserService userService) => _userService = userService;

        // POST /api/auth/register
        [HttpPost("register")]
        [ProducesResponseType(typeof(ApiResponse<AuthResponse>), 201)]
        [ProducesResponseType(typeof(ApiResponse<object>), 409)]
        public async Task<IActionResult> Register([FromBody] RegisterRequest req)
        {
            var result = await _userService.RegisterAsync(req);
            if (result is null)
                return Conflict(new ApiResponse<object>(false, "Email or username already in use.", null));

            return CreatedAtAction(nameof(Register),
                new ApiResponse<AuthResponse>(true, "Registration successful.", result));
        }

        // POST /api/auth/login
        [HttpPost("login")]
        [ProducesResponseType(typeof(ApiResponse<AuthResponse>), 200)]
        [ProducesResponseType(typeof(ApiResponse<object>), 401)]
        public async Task<IActionResult> Login([FromBody] LoginRequest req)
        {
            var result = await _userService.LoginAsync(req);
            if (result is null)
                return Unauthorized(new ApiResponse<object>(false, "Invalid email or password.", null));

            return Ok(new ApiResponse<AuthResponse>(true, "Login successful.", result));
        }
    }
}
