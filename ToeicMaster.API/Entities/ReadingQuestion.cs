using System;
using System.Collections.Generic;

namespace ToeicMaster.API.Entities;

public partial class ReadingQuestion
{
    public int Id { get; set; }

    public int PassageId { get; set; }

    public int QuestionNo { get; set; }

    public string? Content { get; set; }

    public string? CorrectOption { get; set; }

    public string? ShortExplanation { get; set; }

    public string? FullExplanation { get; set; }

    public string? QuestionType { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual ReadingPassage Passage { get; set; } = null!;

    public virtual ICollection<ReadingAnswer> Answers { get; set; } = new List<ReadingAnswer>();

    public virtual ICollection<ReadingSessionAnswer> ReadingSessionAnswers { get; set; } = new List<ReadingSessionAnswer>();
}
