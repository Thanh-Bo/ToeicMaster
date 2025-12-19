using System;

namespace ToeicMaster.API.Entities;

public class Vocabulary
{
    public int Id { get; set; }
    
    public string Word { get; set; } = null!;
    
    public string? Pronunciation { get; set; }
    
    public string? PartOfSpeech { get; set; } // noun, verb, adj, adv, etc.
    
    public string Meaning { get; set; } = null!; // Vietnamese meaning
    
    public string? Example { get; set; }
    
    public string? ExampleTranslation { get; set; }
    
    public string? AudioUrl { get; set; }
    
    public string? ImageUrl { get; set; }
    
    public int? QuestionId { get; set; } // Từ vựng trích từ câu hỏi nào (nullable)
    
    public string? Category { get; set; } // business, travel, technology, etc.
    
    public int Difficulty { get; set; } = 1; // 1-5
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation
    public virtual Question? Question { get; set; }
    public virtual ICollection<UserVocabulary> UserVocabularies { get; set; } = new List<UserVocabulary>();
}
