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
        public DbSet<Comment> Comments { get; set; }
        public DbSet<CommentLike> CommentLikes { get; set; }

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

            // Comment relationships
            modelBuilder.Entity<Comment>()
                .HasOne(c => c.Quest)
                .WithMany()
                .HasForeignKey(c => c.QuestId);
            modelBuilder.Entity<Comment>()
                .HasOne(c => c.User)
                .WithMany()
                .HasForeignKey(c => c.UserId);

            // CommentLike relationships
            modelBuilder.Entity<CommentLike>()
                .HasOne(cl => cl.Comment)
                .WithMany(c => c.CommentLikes)
                .HasForeignKey(cl => cl.CommentId);
            modelBuilder.Entity<CommentLike>()
                .HasOne(cl => cl.User)
                .WithMany()
                .HasForeignKey(cl => cl.UserId);

            // Seed official quests
            var createdDate = new DateTime(2026, 7, 20, 0, 0, 0, DateTimeKind.Utc);
            modelBuilder.Entity<Quest>().HasData(
                new Quest { Id = Guid.Parse("de000000-0000-0000-0000-000000000001"), Title = "Mission Bay Explorer", Description = "Visit Mission Bay and upload a photo of the beach.", Latitude = -36.8523, Longitude = 174.8313, RewardXp = 80, Status = Backend.Models.QuestStatus.Official, CreatedAt = createdDate },
                new Quest { Id = Guid.Parse("de000000-0000-0000-0000-000000000002"), Title = "Auckland Waterfront Walk", Description = "Walk along Viaduct Harbour and check in.", Latitude = -36.8435, Longitude = 174.7615, RewardXp = 70, Status = Backend.Models.QuestStatus.Official, CreatedAt = createdDate },
                new Quest { Id = Guid.Parse("de000000-0000-0000-0000-000000000003"), Title = "Britomart Discovery", Description = "Find the Britomart Clock Tower and take a photo.", Latitude = -36.8441, Longitude = 174.7677, RewardXp = 60, Status = Backend.Models.QuestStatus.Official, CreatedAt = createdDate },
                new Quest { Id = Guid.Parse("de000000-0000-0000-0000-000000000004"), Title = "Wynyard Quarter Explorer", Description = "Visit the public art installations in Wynyard Quarter.", Latitude = -36.8395, Longitude = 174.7575, RewardXp = 90, Status = Backend.Models.QuestStatus.Official, CreatedAt = createdDate },
                new Quest { Id = Guid.Parse("de000000-0000-0000-0000-000000000005"), Title = "Auckland Night Lights", Description = "Share your favourite Auckland skyline photo after sunset.", Latitude = -36.8406, Longitude = 174.7400, RewardXp = 120, Status = Backend.Models.QuestStatus.Official, CreatedAt = createdDate },

                new Quest { Id = Guid.Parse("da000000-0000-0000-0000-000000000001"), Title = "Mt Eden Summit", Description = "Climb to the summit of Mt Eden and enjoy the panoramic views.", Latitude = -36.8760, Longitude = 174.7644, RewardXp = 120, Status = Backend.Models.QuestStatus.Official, CreatedAt = createdDate },
                new Quest { Id = Guid.Parse("da000000-0000-0000-0000-000000000002"), Title = "Cornwall Park Picnic", Description = "Have a relaxing picnic at Cornwall Park.", Latitude = -36.9005, Longitude = 174.7830, RewardXp = 70, Status = Backend.Models.QuestStatus.Official, CreatedAt = createdDate },
                new Quest { Id = Guid.Parse("da000000-0000-0000-0000-000000000003"), Title = "One Tree Hill Explorer", Description = "Visit One Tree Hill and learn about its history.", Latitude = -36.9026, Longitude = 174.7850, RewardXp = 100, Status = Backend.Models.QuestStatus.Official, CreatedAt = createdDate },
                new Quest { Id = Guid.Parse("da000000-0000-0000-0000-000000000004"), Title = "Auckland Domain Adventure", Description = "Explore the beautiful Auckland Domain gardens.", Latitude = -36.8606, Longitude = 174.7762, RewardXp = 80, Status = Backend.Models.QuestStatus.Official, CreatedAt = createdDate },
                new Quest { Id = Guid.Parse("da000000-0000-0000-0000-000000000005"), Title = "Western Springs Wildlife", Description = "Spot native birds at Western Springs Park.", Latitude = -36.8670, Longitude = 174.7185, RewardXp = 100, Status = Backend.Models.QuestStatus.Official, CreatedAt = createdDate },

                new Quest { Id = Guid.Parse("dc000000-0000-0000-0000-000000000001"), Title = "Auckland War Memorial Museum", Description = "Visit the Auckland War Memorial Museum and explore NZ history.", Latitude = -36.8606, Longitude = 174.7778, RewardXp = 120, Status = Backend.Models.QuestStatus.Official, CreatedAt = createdDate },
                new Quest { Id = Guid.Parse("dc000000-0000-0000-0000-000000000002"), Title = "Auckland Art Gallery", Description = "Explore contemporary and traditional art at Auckland Art Gallery.", Latitude = -36.8506, Longitude = 174.7655, RewardXp = 80, Status = Backend.Models.QuestStatus.Official, CreatedAt = createdDate },
                new Quest { Id = Guid.Parse("dc000000-0000-0000-0000-000000000003"), Title = "Albert Park History Walk", Description = "Take a walk through historic Albert Park.", Latitude = -36.8515, Longitude = 174.7671, RewardXp = 70, Status = Backend.Models.QuestStatus.Official, CreatedAt = createdDate },
                new Quest { Id = Guid.Parse("dc000000-0000-0000-0000-000000000004"), Title = "High Street Heritage Hunt", Description = "Discover the heritage buildings along High Street.", Latitude = -36.8475, Longitude = 174.7650, RewardXp = 90, Status = Backend.Models.QuestStatus.Official, CreatedAt = createdDate },
                new Quest { Id = Guid.Parse("dc000000-0000-0000-0000-000000000005"), Title = "Learn a Māori Greeting", Description = "Learn and use a traditional Māori greeting. Type \"Kia ora\" to complete!", Latitude = -36.8485, Longitude = 174.7633, RewardXp = 60, Status = Backend.Models.QuestStatus.Official, CreatedAt = createdDate },

                new Quest { Id = Guid.Parse("df000000-0000-0000-0000-000000000001"), Title = "Hidden Café Hunt", Description = "Find and visit a hidden café in Auckland CBD.", Latitude = -36.8465, Longitude = 174.7645, RewardXp = 80, Status = Backend.Models.QuestStatus.Official, CreatedAt = createdDate },
                new Quest { Id = Guid.Parse("df000000-0000-0000-0000-000000000002"), Title = "Best Flat White Challenge", Description = "Try the best flat white in Auckland and share your review.", Latitude = -36.8445, Longitude = 174.7635, RewardXp = 90, Status = Backend.Models.QuestStatus.Official, CreatedAt = createdDate },
                new Quest { Id = Guid.Parse("df000000-0000-0000-0000-000000000003"), Title = "Auckland Night Market", Description = "Visit a night market and try international street food.", Latitude = -36.8700, Longitude = 174.7850, RewardXp = 110, Status = Backend.Models.QuestStatus.Official, CreatedAt = createdDate },
                new Quest { Id = Guid.Parse("df000000-0000-0000-0000-000000000004"), Title = "Eat Fish & Chips by the Sea", Description = "Enjoy classic Kiwi fish and chips with an ocean view.", Latitude = -36.8523, Longitude = 174.8313, RewardXp = 70, Status = Backend.Models.QuestStatus.Official, CreatedAt = createdDate },
                new Quest { Id = Guid.Parse("df000000-0000-0000-0000-000000000005"), Title = "Try a Kiwi Pie", Description = "Try an authentic New Zealand meat pie.", Latitude = -36.8480, Longitude = 174.7625, RewardXp = 60, Status = Backend.Models.QuestStatus.Official, CreatedAt = createdDate },

                new Quest { Id = Guid.Parse("db000000-0000-0000-0000-000000000001"), Title = "Old Arts Building - UoA", Description = "Visit the iconic Old Arts Building at University of Auckland.", Latitude = -36.8523, Longitude = 174.7691, RewardXp = 60, Status = Backend.Models.QuestStatus.Official, CreatedAt = createdDate },
                new Quest { Id = Guid.Parse("db000000-0000-0000-0000-000000000002"), Title = "General Library - UoA", Description = "Check in at the General Library, UoA.", Latitude = -36.8520, Longitude = 174.7680, RewardXp = 70, Status = Backend.Models.QuestStatus.Official, CreatedAt = createdDate },
                new Quest { Id = Guid.Parse("db000000-0000-0000-0000-000000000003"), Title = "Clock Tower - UoA", Description = "Find the famous Clock Tower at University of Auckland.", Latitude = -36.8525, Longitude = 174.7685, RewardXp = 80, Status = Backend.Models.QuestStatus.Official, CreatedAt = createdDate },
                new Quest { Id = Guid.Parse("db000000-0000-0000-0000-000000000004"), Title = "AUT City Campus", Description = "Explore AUT City Campus and check in.", Latitude = -36.8515, Longitude = 174.7595, RewardXp = 60, Status = Backend.Models.QuestStatus.Official, CreatedAt = createdDate },
                new Quest { Id = Guid.Parse("db000000-0000-0000-0000-000000000005"), Title = "Massey Albany Explorer", Description = "Visit Massey University Albany Campus.", Latitude = -36.7295, Longitude = 174.7020, RewardXp = 100, Status = Backend.Models.QuestStatus.Official, CreatedAt = createdDate },

                new Quest { Id = Guid.Parse("dd000000-0000-0000-0000-000000000001"), Title = "Recommend Your Favourite Study Spot", Description = "Share your go-to study spot with the community.", Latitude = -36.8485, Longitude = 174.7633, RewardXp = 80, Status = Backend.Models.QuestStatus.Official, CreatedAt = createdDate },
                new Quest { Id = Guid.Parse("dd000000-0000-0000-0000-000000000002"), Title = "Hidden Street Art", Description = "Discover and photograph hidden street art in Auckland.", Latitude = -36.8490, Longitude = 174.7620, RewardXp = 100, Status = Backend.Models.QuestStatus.Official, CreatedAt = createdDate },
                new Quest { Id = Guid.Parse("dd000000-0000-0000-0000-000000000003"), Title = "Sunset Photo Challenge", Description = "Capture the most beautiful Auckland sunset.", Latitude = -36.8485, Longitude = 174.7633, RewardXp = 120, Status = Backend.Models.QuestStatus.Official, CreatedAt = createdDate },
                new Quest { Id = Guid.Parse("dd000000-0000-0000-0000-000000000004"), Title = "Favourite Weekend Walk", Description = "Share your favourite weekend walking route.", Latitude = -36.8485, Longitude = 174.7633, RewardXp = 90, Status = Backend.Models.QuestStatus.Official, CreatedAt = createdDate },
                new Quest { Id = Guid.Parse("dd000000-0000-0000-0000-000000000005"), Title = "Local Secret Challenge", Description = "Share a local secret spot that tourists don't know about.", Latitude = -36.8485, Longitude = 174.7633, RewardXp = 150, Status = Backend.Models.QuestStatus.Official, CreatedAt = createdDate }
            );
        }
    }
}
