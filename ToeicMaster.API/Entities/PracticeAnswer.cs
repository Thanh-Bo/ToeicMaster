using System;

namespace ToeicMaster.API.Entities;

/// <summary>
/// Answers in practice mode
/// </summary>
public class PracticeAnswer
{
    public int Id { get; set; }
    
    public int SessionId { get; set; }
    
    public int QuestionId { get; set; }
    
    public string? SelectedOption { get; set; }
    
    public bool IsCorrect { get; set; }
    
    public DateTime AnsweredAt { get; set; } = DateTime.UtcNow;
    
    // Navigation
    public virtual PracticeSession Session { get; set; } = null!;
    public virtual Question Question { get; set; } = null!;
}
