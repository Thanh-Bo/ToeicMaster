using System;
using System.Collections.Generic;

namespace ToeicMaster.API.Entities;

public partial class Comment
{
    public int Id { get; set; }

    public int TestId { get; set; }

    public int UserId { get; set; }

    public int? ParentCommentId { get; set; }

    public string Content { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public bool IsDeleted { get; set; }

    public virtual Test Test { get; set; } = null!;

    public virtual User User { get; set; } = null!;

    public virtual Comment? ParentComment { get; set; }

    public virtual ICollection<Comment> Replies { get; set; } = new List<Comment>();

    public virtual ICollection<CommentLike> CommentLikes { get; set; } = new List<CommentLike>();
}
