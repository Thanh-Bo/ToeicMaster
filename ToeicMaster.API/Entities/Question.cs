using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
namespace ToeicMaster.API.Entities;

public partial class Question
{
    public int Id { get; set; }

    public int GroupId { get; set; }

    public int QuestionNo { get; set; }

    [Column(TypeName = "nvarchar(max)")]
    public string? Content { get; set; }

    public string? QuestionType { get; set; }

    [Column(TypeName = "nvarchar(max)")]
    public string? CorrectOption { get; set; }

    public decimal? ScoreWeight { get; set; }
    [Column(TypeName = "nvarchar(max)")]
    public string? ShortExplanation { get; set; } // Giải thích ngắn
    public string? FullExplanation { get; set; }  // Giải thích chi tiết

    public virtual ICollection<Answer> Answers { get; set; } = new List<Answer>();

    public virtual QuestionGroup Group { get; set; } = null!;

    public virtual ICollection<UserAnswer> UserAnswers { get; set; } = new List<UserAnswer>();

    public virtual ICollection<Tag> Tags { get; set; } = new List<Tag>();

    public string? AudioUrl { get; set; }

    // Lời thoại (Dành cho lúc xem kết quả)
    public string? Transcript { get; set; }
    
    public virtual ICollection<Bookmark> Bookmarks { get; set; } = new List<Bookmark>();
    
    public virtual ICollection<Vocabulary> Vocabularies { get; set; } = new List<Vocabulary>();
    
    public virtual ICollection<PracticeAnswer> PracticeAnswers { get; set; } = new List<PracticeAnswer>();
}
