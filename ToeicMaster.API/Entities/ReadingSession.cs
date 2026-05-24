using System;
using System.Collections.Generic;

namespace ToeicMaster.API.Entities;

public partial class ReadingSession
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public int TotalPassages { get; set; }

    public int TotalQuestions { get; set; }

    public int CorrectAnswers { get; set; }

    public int TimeSpentSeconds { get; set; }

    public DateTime StartedAt { get; set; }

    public DateTime? CompletedAt { get; set; }

    public string Status { get; set; } = "in_progress";

    public virtual User User { get; set; } = null!;

    public virtual ICollection<ReadingSessionPassage> ReadingSessionPassages { get; set; } = new List<ReadingSessionPassage>();

    public virtual ICollection<ReadingSessionAnswer> ReadingSessionAnswers { get; set; } = new List<ReadingSessionAnswer>();
}
