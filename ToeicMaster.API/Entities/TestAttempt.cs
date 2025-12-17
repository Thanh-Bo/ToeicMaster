using System;
using System.Collections.Generic;

namespace ToeicMaster.API.Entities;

public partial class TestAttempt
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public int TestId { get; set; }

    public DateTime StartedAt { get; set; }

    public DateTime CompletedAt { get; set; }

    public int TotalScore { get; set; }

    public int? ListeningScore { get; set; }

    public int? ReadingScore { get; set; }

    public string? Status { get; set; }

    public virtual Test Test { get; set; } = null!;

    public virtual User User { get; set; } = null!;

    public virtual ICollection<UserAnswer> UserAnswers { get; set; } = new List<UserAnswer>();
}
