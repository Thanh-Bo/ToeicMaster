using System;
using System.Collections.Generic;

namespace ToeicMaster.API.Entities;

public partial class QuestionVocabAnswer
{
    public int Id { get; set; }

    public int QuestionVocabId { get; set; }

    public string? Label { get; set; }

    public string? Content { get; set; }

    public bool IsCorrect { get; set; }

    public virtual QuestionVocab? QuestionVocab { get; set; }
}
