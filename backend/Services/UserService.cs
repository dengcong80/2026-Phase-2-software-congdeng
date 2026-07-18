using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Backend.Data;
using Backend.Models;
using Backend.Models.Dtos;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace Backend.Services
{
    /// <summary>Handles user registration, login, and JWT generation.</summary>
    public class UserService
    {
        private readonly AppDbContext _db;
        private readonly IConfiguration _config;

        public UserService(AppDbContext db, IConfiguration config)
        {
            _db = db;
            _config = config;
        }

        // ─── Register ────────────────────────────────────────────────────────────

        public async Task<AuthResponse?> RegisterAsync(RegisterRequest req)
        {
            // Prevent duplicate email / username
            if (await _db.Users.AnyAsync(u => u.Email == req.Email || u.Username == req.Username))
                return null;

            var user = new User
            {
                Username     = req.Username,
                Email        = req.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.Password),
                Role         = UserRole.Standard,
                UserQuests   = new List<UserQuest>(),
                Badges       = new List<Badge>(),
                Likes        = new List<Like>(),
                CreatedQuests = new List<Quest>()
            };

            _db.Users.Add(user);

            // Create an initial leaderboard entry for the user
            _db.LeaderboardEntries.Add(new LeaderboardEntry
            {
                UserId    = user.Id,
                TotalXp   = 0,
                Rank      = 0,
                UpdatedAt = DateTime.UtcNow
            });

            await _db.SaveChangesAsync();

            return new AuthResponse(
                Token:    GenerateJwt(user),
                Username: user.Username,
                Role:     user.Role.ToString(),
                TotalXp:  0
            );
        }

        // ─── Login ───────────────────────────────────────────────────────────────

        public async Task<AuthResponse?> LoginAsync(LoginRequest req)
        {
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == req.Email);
            if (user is null || !BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash))
                return null;

            var entry = await _db.LeaderboardEntries.FirstOrDefaultAsync(e => e.UserId == user.Id);
            int totalXp = entry?.TotalXp ?? 0;

            return new AuthResponse(
                Token:    GenerateJwt(user),
                Username: user.Username,
                Role:     user.Role.ToString(),
                TotalXp:  totalXp
            );
        }

        // ─── JWT Generator ───────────────────────────────────────────────────────

        public string GenerateJwt(User user)
        {
            var key     = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var creds   = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.UtcNow.AddHours(8);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub,   user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(ClaimTypes.Name,               user.Username),
                new Claim(ClaimTypes.Role,               user.Role.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti,   Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer:    _config["Jwt:Issuer"],
                audience:  _config["Jwt:Audience"],
                claims:    claims,
                expires:   expires,
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        // ─── Helpers ─────────────────────────────────────────────────────────────

        public async Task<User?> GetByIdAsync(Guid id) =>
            await _db.Users
                     .Include(u => u.Badges)
                     .Include(u => u.UserQuests)
                     .FirstOrDefaultAsync(u => u.Id == id);
    }
}
