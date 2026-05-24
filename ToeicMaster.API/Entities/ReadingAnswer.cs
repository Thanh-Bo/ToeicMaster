namespace ToeicMaster.API.Entities;

public partial class ReadingAnswer
{
    public int Id { get; set; }

    public int ReadingQuestionId { get; set; }

    public string? Label { get; set; }

    public string? Content { get; set; }

    public virtual ReadingQuestion ReadingQuestion { get; set; } = null!;
}
