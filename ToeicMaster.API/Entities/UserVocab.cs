using System;
using System.Collections.Generic;

namespace ToeicMaster.API.Entities;

public partial class UserVocab
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public int TopicId { get; set; }  // Per-topic tracking

    public int Status { get; set; }

    public int ReviewCount { get; set; }

    public int Level { get; set; }

    public DateTime? NextReviewAt { get; set; }

    public DateTime? LastReviewedAt { get; set; }

    public int TotalQuestionsAnswered { get; set; }  // Total vocab test questions answered

    public int TotalCorrectAnswers { get; set; }       // Total correct answers

    public DateTime CreatedAt { get; set; }

    public virtual User User { get; set; } = null!;

    public virtual Topic Topic { get; set; } = null!;
}
