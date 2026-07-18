using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class Like
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid UserId { get; set; }
        [ForeignKey(nameof(UserId))]
        public User User { get; set; }

        [Required]
        public Guid QuestId { get; set; }
        [ForeignKey(nameof(QuestId))]
        public Quest Quest { get; set; }

        public DateTime LikedAt { get; set; } = DateTime.UtcNow;

        // Alias used by QuestService for consistency
        [NotMapped]
        public DateTime CreatedAt { get => LikedAt; set => LikedAt = value; }
    }
}
