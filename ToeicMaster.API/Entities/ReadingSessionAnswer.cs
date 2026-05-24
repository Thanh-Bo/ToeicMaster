using System;

namespace ToeicMaster.API.Entities;

public partial class ReadingSessionAnswer
{
    public int Id { get; set; }

    public int SessionId { get; set; }

    public int ReadingQuestionId { get; set; }

    public string? SelectedOption { get; set; }

    public bool IsCorrect { get; set; }

    public DateTime AnsweredAt { get; set; }

    public virtual ReadingSession Session { get; set; } = null!;

    public virtual ReadingQuestion ReadingQuestion { get; set; } = null!;
}
