using System;
using System.Collections.Generic;

namespace ToeicMaster.API.Entities;

public partial class Part
{
    public int Id { get; set; }

    public int TestId { get; set; }

    public string? Name { get; set; }

    public int? PartNumber { get; set; }

    public string? Description { get; set; }

    public virtual ICollection<QuestionGroup> QuestionGroups { get; set; } = new List<QuestionGroup>();

    public virtual Test Test { get; set; } = null!;
}
