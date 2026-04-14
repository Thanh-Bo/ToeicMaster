using System;
using System.Collections.Generic;

namespace ToeicMaster.API.Entities;

public partial class QuestionGrammarAnswer
{
    public int Id { get; set; }

    public int QuestionGrammarId { get; set; }

    public string? Label { get; set; } // A/B/C/D

    public string? Content { get; set; }

    public bool IsCorrect { get; set; }

    public virtual QuestionGrammar? QuestionGrammar { get; set; }
}
