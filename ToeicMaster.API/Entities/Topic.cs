using System.ComponentModel.DataAnnotations;

namespace ToeicMaster.API.Entities;

public class Topic
{
    public int Id { get; set; }

    public Guid TopicGuid { get; set; } = Guid.NewGuid();

    [Required]
    public string Title { get; set; } = null!; // Ví dụ: "Contracts"

    public string? Description { get; set; }

    public string? ImageUrl { get; set; } // Thumbnail cho Topic Card

    // Level: "Basic", "Intermediate", "Advanced"
    public string Level { get; set; } = "Basic"; 

    // Level Range: "0-450"
    public string LevelRange { get; set; } = "0-450";

    public bool IsExplanationPremiumRequired { get; set; } = true;

    // Quan hệ 1-n với Vocabulary
    public virtual ICollection<Vocabulary> Vocabularies { get; set; } = new List<Vocabulary>();

    // Quan hệ 1-n với UserVocab (per-topic tracking)
    public virtual ICollection<UserVocab> UserVocabs { get; set; } = new List<UserVocab>();
}
