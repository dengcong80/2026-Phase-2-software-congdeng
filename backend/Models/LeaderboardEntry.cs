using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class LeaderboardEntry
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid UserId { get; set; }
        [ForeignKey(nameof(UserId))]
        public User User { get; set; }

        // Total XP accumulated by the user (used for ranking)
        public int TotalXp { get; set; }

        // Current rank position – recomputed by a background service
        public int Rank { get; set; }

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
