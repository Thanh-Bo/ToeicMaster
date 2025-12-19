using System;

namespace ToeicMaster.API.Entities;

public class Bookmark
{
    public int Id { get; set; }
    
    public int UserId { get; set; }
    
    public int QuestionId { get; set; }
    
    public string? Note { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation properties
    public virtual User User { get; set; } = null!;
    public virtual Question Question { get; set; } = null!;
}
