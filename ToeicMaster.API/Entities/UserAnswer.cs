using System;
using System.Collections.Generic;

namespace ToeicMaster.API.Entities;

public partial class UserAnswer
{
    public int Id { get; set; }

    public int AttemptId { get; set; }

    public int QuestionId { get; set; }

    public string SelectedOption { get; set; } = null!;

    public bool IsCorrect { get; set; }

    public string? TextResponse { get; set; }

    public string? AudioResponseUrl { get; set; }

    public virtual TestAttempt Attempt { get; set; } = null!;

    public virtual Question Question { get; set; } = null!;

    public virtual ReviewFeedback? ReviewFeedback { get; set; }
}
