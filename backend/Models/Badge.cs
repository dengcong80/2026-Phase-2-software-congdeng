using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Backend.Models
{
    [Index(nameof(Name), IsUnique = true)]
    public class Badge
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(100)]
        public string Name { get; set; }

        [Required]
        public string Description { get; set; }

        // Optional URL for badge icon image
        public string ImageUrl { get; set; }

        // XP threshold required to earn the badge
        public int RequiredXp { get; set; }

        // Users that own this badge (many‑to‑many via a join table not shown here)
        public ICollection<User> Users { get; set; }
    }
}
