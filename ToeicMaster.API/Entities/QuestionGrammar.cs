using System;
using System.Collections.Generic;

namespace ToeicMaster.API.Entities;

public partial class QuestionGrammar
{
    public int Id { get; set; }

    public int? GrammarId { get; set; }  // nullable: flow mới dùng TopicId thay GrammarId

    public int? TopicId { get; set; }   // ← ĐỔI: thành nullable

    public int QuestionNo { get; set; }

    public string? Content { get; set; }

    public string? CorrectOption { get; set; }

    public string? ShortExplanation { get; set; }

    public string? LongExplanation { get; set; }

    public string Mode { get; set; } = "medium"; // easy, medium, hard

    public virtual Grammar? Grammar { get; set; }  // ← MỚI: Navigation property đến Grammar

    public virtual GrammarTopic? Topic { get; set; }

    public virtual ICollection<QuestionGrammarAnswer> Answers { get; set; } = new List<QuestionGrammarAnswer>();
}
