using System;

namespace ToeicMaster.API.Entities;

/// <summary>
/// Practice mode sessions (không tính điểm, luyện từng Part)
/// </summary>
public class PracticeSession
{
    public int Id { get; set; }
    
    public int UserId { get; set; }
    
    public int PartNumber { get; set; } // 1-7
    
    public int TotalQuestions { get; set; }
    
    public int CorrectAnswers { get; set; }
    
    public int TimeSpentSeconds { get; set; }
    
    public DateTime StartedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime? CompletedAt { get; set; }
    
    public string Status { get; set; } = "in_progress"; // in_progress, completed, abandoned
    
    // Navigation
    public virtual User User { get; set; } = null!;
    public virtual ICollection<PracticeAnswer> PracticeAnswers { get; set; } = new List<PracticeAnswer>();
}
