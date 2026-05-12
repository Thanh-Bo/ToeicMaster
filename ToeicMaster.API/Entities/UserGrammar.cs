using System;
using System.Collections.Generic;

namespace ToeicMaster.API.Entities;

public partial class UserGrammar
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public int GrammarId { get; set; }

    public int Status { get; set; } // 0: New, 1: Learning, 2: Reviewing, 3: Mastered

    public int CorrectStreak { get; set; }

    public int ReviewCount { get; set; }

    public int Level { get; set; } = 0; // Mastery level 0-5

    public DateTime? FirstLearnedAt { get; set; }

    public DateTime? NextReviewAt { get; set; }

    public DateTime? LastReviewedAt { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.Now;

    // Practice tracking fields (real-time updates)
    public int TotalQuestionsAnswered { get; set; } = 0;

    public int TotalCorrectAnswers { get; set; } = 0;

    public int TotalStudyTimeSeconds { get; set; } = 0;

    public virtual User User { get; set; } = null!;

    public virtual Grammar Grammar { get; set; } = null!;
}
