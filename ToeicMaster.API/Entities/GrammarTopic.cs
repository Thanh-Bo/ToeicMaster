using System.ComponentModel.DataAnnotations;

namespace ToeicMaster.API.Entities;

public class GrammarTopic
{
    public int Id { get; set; }

    public Guid TopicGuid { get; set; } = Guid.NewGuid();

    public int GroupId { get; set; } // Foreign Key to GrammarGroup

    [Required]
    public string Title { get; set; } = null!; // Ví dụ: "Present Perfect Tense"

    public string? Description { get; set; }

    public string? ImageUrl { get; set; } // Thumbnail cho Grammar Topic Card

    // Level: "Basic", "Intermediate", "Advanced"
    public string Level { get; set; } = "Basic"; 

    // Level Range: "0-450"
    public string LevelRange { get; set; } = "0-450";

    // Category: "Tenses", "Voice", "Mood", "Clauses", etc.
    public string Category { get; set; } = null!;

    public bool IsExplanationPremiumRequired { get; set; } = true;

    // Navigation Properties
    public virtual GrammarGroup? Group { get; set; }

    // Quan hệ 1-n với Grammars
    public virtual ICollection<Grammar> Grammars { get; set; } = new List<Grammar>();
}
