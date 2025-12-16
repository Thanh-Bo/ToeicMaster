using System;
using System.Collections.Generic;

namespace ToeicMaster.API.Entities;

public partial class Test
{
    public int Id { get; set; }

    public string Title { get; set; } = null!;

    public string? Slug { get; set; }

    public string? Type { get; set; }

    public int? Duration { get; set; }

    public int? TotalQuestions { get; set; }

    public int? TotalParticipants { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual ICollection<Part> Parts { get; set; } = new List<Part>();

    public virtual ICollection<TestAttempt> TestAttempts { get; set; } = new List<TestAttempt>();
}
