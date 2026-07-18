using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    /// <summary>
    /// Evaluates XP milestones and awards badges to users automatically.
    /// Badge definitions are seeded in the database; this service queries and assigns them.
    /// </summary>
    public class BadgeService
    {
        private readonly AppDbContext _db;

        public BadgeService(AppDbContext db) => _db = db;

        /// <summary>
        /// Checks whether the user has crossed any new XP-threshold badges after earning XP.
        /// Returns the names of any newly awarded badges.
        /// </summary>
        public async Task<List<string>> AwardBadgesAsync(User user, int newTotalXp)
        {
            // Load badges the user does not yet own
            var allBadges = await _db.Badges
                .Include(b => b.Users)
                .Where(b => b.RequiredXp <= newTotalXp)
                .ToListAsync();

            var awarded = new List<string>();

            foreach (var badge in allBadges)
            {
                // Skip if already owned
                if (badge.Users != null && badge.Users.Any(u => u.Id == user.Id))
                    continue;

                // Attach badge to user
                badge.Users ??= new List<User>();
                badge.Users.Add(user);
                awarded.Add(badge.Name);
            }

            if (awarded.Count > 0)
                await _db.SaveChangesAsync();

            return awarded;
        }

        /// <summary>Seeds default badge definitions if the Badges table is empty.</summary>
        public async Task SeedDefaultBadgesAsync()
        {
            if (await _db.Badges.AnyAsync())
                return;

            var defaults = new List<Badge>
            {
                new() { Name = "Explorer",       Description = "Complete your first quest.",        RequiredXp = 10,   ImageUrl = "/badges/explorer.svg"   },
                new() { Name = "Pathfinder",     Description = "Earn 100 XP in total.",             RequiredXp = 100,  ImageUrl = "/badges/pathfinder.svg" },
                new() { Name = "Trailblazer",    Description = "Earn 500 XP in total.",             RequiredXp = 500,  ImageUrl = "/badges/trailblazer.svg"},
                new() { Name = "City Champion",  Description = "Earn 1000 XP in total.",            RequiredXp = 1000, ImageUrl = "/badges/champion.svg"   },
                new() { Name = "Local Legend",   Description = "Earn 2500 XP – a true local!",     RequiredXp = 2500, ImageUrl = "/badges/legend.svg"     }
            };

            _db.Badges.AddRange(defaults);
            await _db.SaveChangesAsync();
        }
    }
}
