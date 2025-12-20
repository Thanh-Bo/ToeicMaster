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

    public string? ShortExplanation { get; set; }

    public string? FullExplanation { get; set; }

    public string? AudioUrl { get; set; }

    public string? Transcript { get; set; }

    public virtual ICollection<Answer> Answers { get; set; } = new List<Answer>();

    public virtual ICollection<Bookmark> Bookmarks { get; set; } = new List<Bookmark>();

    public virtual QuestionGroup Group { get; set; } = null!;

    public virtual ICollection<PracticeAnswer> PracticeAnswers { get; set; } = new List<PracticeAnswer>();

    public virtual ICollection<UserAnswer> UserAnswers { get; set; } = new List<UserAnswer>();

    public virtual ICollection<Vocabulary> Vocabularies { get; set; } = new List<Vocabulary>();

    public virtual ICollection<Tag> Tags { get; set; } = new List<Tag>();
}
