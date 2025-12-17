using System;
using System.Collections.Generic;

namespace ToeicMaster.API.Entities;

public partial class Question
{
    public int Id { get; set; }

    public int GroupId { get; set; }

    public int QuestionNo { get; set; }

    public string? Content { get; set; }

    public string? QuestionType { get; set; }

    public string? CorrectOption { get; set; }

    public decimal? ScoreWeight { get; set; }

    public string? ShortExplanation { get; set; } // Giải thích ngắn
    public string? FullExplanation { get; set; }  // Giải thích chi tiết

    public virtual ICollection<Answer> Answers { get; set; } = new List<Answer>();

    public virtual QuestionGroup Group { get; set; } = null!;

    public virtual ICollection<UserAnswer> UserAnswers { get; set; } = new List<UserAnswer>();

    public virtual ICollection<Tag> Tags { get; set; } = new List<Tag>();
}
