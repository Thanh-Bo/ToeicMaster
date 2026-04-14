using System.ComponentModel.DataAnnotations;

namespace ToeicMaster.API.Entities;

public class GrammarExample
{
    public int Id { get; set; }

    public int GrammarId { get; set; } // FK

    [Required]
    public string Sentence { get; set; } = null!; // Example sentence

    public string? Translation { get; set; } // Vietnamese translation

    public string? Context { get; set; } // When this example is used

    public string? AudioUrl { get; set; } // Audio for this specific example

    public virtual Grammar Grammar { get; set; } = null!;
}
