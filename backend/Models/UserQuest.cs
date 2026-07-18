using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class UserQuest
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid UserId { get; set; }
        [ForeignKey(nameof(UserId))]
        public User User { get; set; }

        [Required]
        public Guid QuestId { get; set; }
        [ForeignKey(nameof(QuestId))]
        public Quest Quest { get; set; }

        // When the user started the quest
        public DateTime StartedAt { get; set; } = DateTime.UtcNow;

        // When the quest was completed (null if not yet completed)
        public DateTime? CompletedAt { get; set; }

        // XP earned for this quest instance
        public int EarnedXp { get; set; }
    }
}
