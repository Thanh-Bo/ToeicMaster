using System;
using System.Collections.Generic;

namespace ToeicMaster.API.Entities;

public partial class ReadingPassage
{
    public int Id { get; set; }

    public Guid PublicId { get; set; } = Guid.NewGuid();

    public int? TopicId { get; set; }

    public string? Title { get; set; }

    public string? TextContent { get; set; }

    public string? ImageUrl { get; set; }

    public string? TextContentTranslation { get; set; }

    public string? PassageType { get; set; }

    public int PartType { get; set; }

    public string? Difficulty { get; set; }

    public int DisplayOrder { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; }

    public virtual ReadingTopic? Topic { get; set; }

    public virtual ICollection<ReadingQuestion> Questions { get; set; } = new List<ReadingQuestion>();

    public virtual ICollection<ReadingSessionPassage> ReadingSessionPassages { get; set; } = new List<ReadingSessionPassage>();
}
