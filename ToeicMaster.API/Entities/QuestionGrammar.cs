using System;
using System.Collections.Generic;

namespace ToeicMaster.API.Entities;

public partial class QuestionGrammar
{
    public int Id { get; set; }

    public int TopicId { get; set; }

    public int QuestionNo { get; set; }

    public string? Content { get; set; }

    public string? CorrectOption { get; set; }

    public string? ShortExplanation { get; set; }

    public string? LongExplanation { get; set; }

    public virtual GrammarTopic? Topic { get; set; }

    public virtual ICollection<QuestionGrammarAnswer> Answers { get; set; } = new List<QuestionGrammarAnswer>();
}
