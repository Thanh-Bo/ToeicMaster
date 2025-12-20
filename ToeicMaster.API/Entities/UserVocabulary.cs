using System;
using System.Collections.Generic;

namespace ToeicMaster.API.Entities;

public partial class UserVocabulary
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public int VocabularyId { get; set; }

    public int Status { get; set; }

    public int CorrectStreak { get; set; }

    public int ReviewCount { get; set; }

    public DateTime? NextReviewAt { get; set; }

    public DateTime? LastReviewedAt { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual User User { get; set; } = null!;

    public virtual Vocabulary Vocabulary { get; set; } = null!;
}
