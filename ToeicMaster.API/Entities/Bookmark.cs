using System;
using System.Collections.Generic;

namespace ToeicMaster.API.Entities;

public partial class Bookmark
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public int QuestionId { get; set; }

    public string? Note { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual Question Question { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
