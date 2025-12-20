using System;
using System.Collections.Generic;

namespace ToeicMaster.API.Entities;

public partial class Tag
{
    public int Id { get; set; }

    public string? Name { get; set; }

    public virtual ICollection<Question> Questions { get; set; } = new List<Question>();
}
