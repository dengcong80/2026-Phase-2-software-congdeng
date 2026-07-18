using Microsoft.EntityFrameworkCore;
using Backend.Models;

namespace Backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        // DbSets
        public DbSet<User> Users { get; set; }
        public DbSet<Quest> Quests { get; set; }
        public DbSet<UserQuest> UserQuests { get; set; }
        public DbSet<Badge> Badges { get; set; }
        public DbSet<Like> Likes { get; set; }
        public DbSet<LeaderboardEntry> LeaderboardEntries { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Ensure indexes defined via attributes are applied; add any composite indexes if needed.
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Username)
                .IsUnique();
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<Quest>()
                .HasIndex(q => q.Title)
                .IsUnique();

            modelBuilder.Entity<Badge>()
                .HasIndex(b => b.Name)
                .IsUnique();

            // Configure many‑to‑many via join entity UserQuest
            modelBuilder.Entity<UserQuest>()
                .HasOne(uq => uq.User)
                .WithMany(u => u.UserQuests)
                .HasForeignKey(uq => uq.UserId);
            modelBuilder.Entity<UserQuest>()
                .HasOne(uq => uq.Quest)
                .WithMany(q => q.UserQuests)
                .HasForeignKey(uq => uq.QuestId);

            // Like relationships
            modelBuilder.Entity<Like>()
                .HasOne(l => l.User)
                .WithMany(u => u.Likes)
                .HasForeignKey(l => l.UserId);
            modelBuilder.Entity<Like>()
                .HasOne(l => l.Quest)
                .WithMany(q => q.Likes)
                .HasForeignKey(l => l.QuestId);
        }
    }
}
