using System;
using System.Collections.Generic;

namespace ToeicMaster.API.Entities;

public partial class PracticeAnswer
{
    public int Id { get; set; }

    public int SessionId { get; set; }

    public int QuestionId { get; set; }

    public string? SelectedOption { get; set; }

    public bool IsCorrect { get; set; }

    public DateTime AnsweredAt { get; set; }

    public virtual Question Question { get; set; } = null!;

    public virtual PracticeSession Session { get; set; } = null!;
}
