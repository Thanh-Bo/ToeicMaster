using System.ComponentModel.DataAnnotations;

namespace ToeicMaster.API.Entities;

public class WordFamily
{
    public int Id { get; set; }

    public int VocabularyId { get; set; } // FK

    [Required]
    public string Word { get; set; } = null!; // Ví dụ: "competition"

    public string PartOfSpeech { get; set; } = null!; // n, v, adj...

    public string? Meaning { get; set; } // Nghĩa ngắn gọn

    public virtual Vocabulary Vocabulary { get; set; } = null!;
}