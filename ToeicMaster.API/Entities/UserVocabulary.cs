using System;

namespace ToeicMaster.API.Entities;

/// <summary>
/// Tracks user's vocabulary learning progress (Flashcard progress)
/// </summary>
public class UserVocabulary
{
    public int Id { get; set; }
    
    public int UserId { get; set; }
    
    public int VocabularyId { get; set; }
    
    /// <summary>
    /// Spaced Repetition: 0=New, 1=Learning, 2=Review, 3=Mastered
    /// </summary>
    public int Status { get; set; } = 0;
    
    /// <summary>
    /// Number of correct reviews in a row
    /// </summary>
    public int CorrectStreak { get; set; } = 0;
    
    /// <summary>
    /// Total times reviewed
    /// </summary>
    public int ReviewCount { get; set; } = 0;
    
    /// <summary>
    /// Next review date (for spaced repetition)
    /// </summary>
    public DateTime? NextReviewAt { get; set; }
    
    public DateTime? LastReviewedAt { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation
    public virtual User User { get; set; } = null!;
    public virtual Vocabulary Vocabulary { get; set; } = null!;
}
