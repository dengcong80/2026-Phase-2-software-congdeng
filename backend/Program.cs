using System.Text;
using Backend.Data;
using Backend.Hubs;
using Backend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// ─── Database ─────────────────────────────────────────────────────────────────
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("Default")));

// ─── Services ────────────────────────────────────────────────────────────────
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<QuestService>();
builder.Services.AddScoped<BadgeService>();

// ─── JWT Authentication ───────────────────────────────────────────────────────
var jwtKey    = builder.Configuration["Jwt:Key"]!;
var jwtIssuer = builder.Configuration["Jwt:Issuer"]!;
var jwtAud    = builder.Configuration["Jwt:Audience"]!;

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer           = true,
            ValidateAudience         = true,
            ValidateLifetime         = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer              = jwtIssuer,
            ValidAudience            = jwtAud,
            IssuerSigningKey         = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };

        // Support SignalR JWT via query string (WebSocket doesn't support headers)
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = ctx =>
            {
                var token = ctx.Request.Query["access_token"];
                if (!string.IsNullOrEmpty(token) &&
                    ctx.HttpContext.Request.Path.StartsWithSegments("/hubs"))
                {
                    ctx.Token = token;
                }
                return Task.CompletedTask;
            }
        };
    });

// ─── RBAC Authorization ───────────────────────────────────────────────────────
builder.Services.AddAuthorizationBuilder()
    .AddPolicy("AdminOnly",         p => p.RequireRole("Administrator"))
    .AddPolicy("EditorOrAdmin",     p => p.RequireRole("Administrator", "CommunityEditor"))
    .AddPolicy("AuthenticatedUser", p => p.RequireAuthenticatedUser());

// ─── Controllers ─────────────────────────────────────────────────────────────
builder.Services.AddControllers();

// ─── SignalR ──────────────────────────────────────────────────────────────────
builder.Services.AddSignalR();

// ─── OpenAPI / Scalar ─────────────────────────────────────────────────────────
builder.Services.AddOpenApi();

// ─── CORS (allow React dev server) ───────────────────────────────────────────
builder.Services.AddCors(options =>
    options.AddDefaultPolicy(policy =>
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials()));

// ─────────────────────────────────────────────────────────────────────────────
var app = builder.Build();

// ─── Auto-apply EF migrations on startup ─────────────────────────────────────
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

// ─── Middleware pipeline ──────────────────────────────────────────────────────
app.UseCors();

if (app.Environment.IsDevelopment())
{
    // OpenAPI spec at /openapi/v1.json
    app.MapOpenApi();
    // Scalar UI at /scalar
    app.MapScalarApiReference(options =>
    {
        options.Title  = "Auckland Quest API";
        options.Theme  = ScalarTheme.DeepSpace;
        options.WithDefaultHttpClient(ScalarTarget.JavaScript, ScalarClient.Fetch);
    });
}

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// ─── SignalR Hub ──────────────────────────────────────────────────────────────
app.MapHub<LeaderboardHub>("/hubs/leaderboard");

app.Run();
