using System;
using System.Collections.Generic;

namespace ToeicMaster.API.Entities;

public partial class QuestionGroup
{
    public int Id { get; set; }

    public int PartId { get; set; }

    public string? TextContent { get; set; }

    public string? AudioUrl { get; set; }

    public int? AudioDuration { get; set; } // Duration in seconds

    public string? ImageUrl { get; set; }

    public string? Transcript { get; set; }

    public string? TextContentTranslation { get; set; } // Cached AI translation of TextContent (Part 6/7)

    public string? TranscriptTranslation { get; set; } // Cached AI translation of Transcript (Part 3/4)

    public virtual Part Part { get; set; } = null!;

    public virtual ICollection<Question> Questions { get; set; } = new List<Question>();
}
