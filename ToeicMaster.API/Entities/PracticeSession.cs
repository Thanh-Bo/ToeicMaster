using System;
using System.Collections.Generic;

namespace ToeicMaster.API.Entities;

public partial class PracticeSession
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public int PartNumber { get; set; }

    public int TotalQuestions { get; set; }

    public int CorrectAnswers { get; set; }

    public int TimeSpentSeconds { get; set; }

    public DateTime StartedAt { get; set; }

    public DateTime? CompletedAt { get; set; }

    public string Status { get; set; } = null!;

    public virtual ICollection<PracticeAnswer> PracticeAnswers { get; set; } = new List<PracticeAnswer>();

    public virtual User User { get; set; } = null!;
}
