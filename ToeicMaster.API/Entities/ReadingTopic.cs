using System;
using System.Collections.Generic;

namespace ToeicMaster.API.Entities;

public partial class ReadingTopic
{
    public int Id { get; set; }

    public Guid PublicId { get; set; } = Guid.NewGuid();

    public string Title { get; set; } = null!;

    public string? Description { get; set; }

    public int PartType { get; set; }

    public string? Difficulty { get; set; }

    public int DisplayOrder { get; set; }

    public bool IsActive { get; set; } = true;

    public bool IsPremiumRequired { get; set; } = false;

    public DateTime CreatedAt { get; set; }

    public virtual ICollection<ReadingPassage> Passages { get; set; } = new List<ReadingPassage>();
}
