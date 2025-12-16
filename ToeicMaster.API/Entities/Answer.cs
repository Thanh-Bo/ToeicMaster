using System;
using System.Collections.Generic;

namespace ToeicMaster.API.Entities;

public partial class Answer
{
    public int Id { get; set; }

    public int QuestionId { get; set; }

    public string? Label { get; set; }

    public string? Content { get; set; }

    public virtual Question Question { get; set; } = null!;
}
