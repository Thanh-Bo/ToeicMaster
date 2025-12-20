namespace ToeicMaster.API.Models.Comment;

public class CreateCommentRequest
{
    public string Content { get; set; } = null!;
    public int? ParentCommentId { get; set; }
}

public class UpdateCommentRequest
{
    public string Content { get; set; } = null!;
}

public class CommentResponse
{
    public int Id { get; set; }
    public int TestId { get; set; }
    public int UserId { get; set; }
    public string UserName { get; set; } = null!;
    public string? UserAvatar { get; set; }
    public int? ParentCommentId { get; set; }
    public string Content { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public int LikeCount { get; set; }
    public bool IsLikedByCurrentUser { get; set; }
    public List<CommentResponse> Replies { get; set; } = new();
}

public class CommentListResponse
{
    public List<CommentResponse> Items { get; set; } = new();
    public int Total { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages { get; set; }
}
