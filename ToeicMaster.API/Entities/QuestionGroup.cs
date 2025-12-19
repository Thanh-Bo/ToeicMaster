using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
namespace ToeicMaster.API.Entities;

public partial class QuestionGroup
{
    public int Id { get; set; }

    public int PartId { get; set; }

    [Column(TypeName = "nvarchar(max)")]
    public string? TextContent { get; set; }

    public string? AudioUrl { get; set; }

    [Column(TypeName = "nvarchar(max)")]
    public string? ImageUrl { get; set; }

    public string? Transcript { get; set; }

    public virtual Part Part { get; set; } = null!;

    public virtual ICollection<Question> Questions { get; set; } = new List<Question>();
}
