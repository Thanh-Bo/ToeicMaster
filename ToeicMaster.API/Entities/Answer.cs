using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
namespace ToeicMaster.API.Entities;

public partial class Answer
{
    
    public int Id { get; set; }

    public int QuestionId { get; set; }

    public string? Label { get; set; }

    [Column(TypeName = "nvarchar(max)")]
    public string? Content { get; set; }

    public virtual Question Question { get; set; } = null!;
}
