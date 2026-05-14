using System;

namespace ToeicMaster.API.Entities;

public class UserActivityVocabSession
{
    public int Id { get; set; }
    
    public int UserId { get; set; }
    
    public DateTime StartTime { get; set; }
    
    public DateTime? EndTime { get; set; }
    
    public int? DurationSeconds { get; set; }
    
    public DateTime Date { get; set; }
    
    public virtual User User { get; set; } = null!;
}
