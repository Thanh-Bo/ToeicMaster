using System;

namespace ToeicMaster.API.Entities;

public class UserVocabStreak
{
    public int Id { get; set; }
    
    public int UserId { get; set; }
    
    public int CurrentStreak { get; set; } = 0;
    
    public int LongestStreak { get; set; } = 0;
    
    public DateTime? LastActivityDate { get; set; }
    
    public virtual User User { get; set; } = null!;
}
