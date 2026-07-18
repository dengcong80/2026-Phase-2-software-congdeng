using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Backend.Models
{
    public enum QuestStatus
    {
        Official,
        Pending,
        Approved
    }

    [Index(nameof(Title), IsUnique = true)]
    public class Quest
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(200)]
        public string Title { get; set; }

        [Required]
        public string Description { get; set; }

        // Geographic coordinates (latitude, longitude)
        [Column(TypeName = "double precision")]
        public double Latitude { get; set; }

        [Column(TypeName = "double precision")]
        public double Longitude { get; set; }

        [Required]
        public int RewardXp { get; set; }

        [Required]
        public QuestStatus Status { get; set; } = QuestStatus.Official;

        // Creator (optional for community quests)
        public Guid? CreatedByUserId { get; set; }
        [ForeignKey(nameof(CreatedByUserId))]
        public User CreatedBy { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation collections
        public ICollection<UserQuest> UserQuests { get; set; }
        public ICollection<Like> Likes { get; set; }
    }
}
