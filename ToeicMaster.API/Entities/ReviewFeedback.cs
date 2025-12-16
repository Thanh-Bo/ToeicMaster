using System;
using System.Collections.Generic;

namespace ToeicMaster.API.Entities;

public partial class ReviewFeedback
{
    public int Id { get; set; }

    public int UserAnswerId { get; set; }

    public decimal? Score { get; set; }

    public string? FeedbackJson { get; set; }

    public DateTime? EvaluatedAt { get; set; }

    public virtual UserAnswer UserAnswer { get; set; } = null!;
}
