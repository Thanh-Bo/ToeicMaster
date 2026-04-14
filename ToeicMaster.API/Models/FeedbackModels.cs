namespace ToeicMaster.API.Models;

public class CreateFeedbackRequest
{
    public string FeedbackType { get; set; } = null!; // "bug", "feature", "ui_ux", "other"

    public string Title { get; set; } = null!;

    public string Content { get; set; } = null!;

    public string? Email { get; set; }

    public string? CurrentPage { get; set; }

    public int? Priority { get; set; } = 2; // 1=low, 2=medium, 3=high
}

public class UpdateFeedbackStatusRequest
{
    public string Status { get; set; } = null!; // "pending", "reviewing", "resolved", "rejected"

    public string? AdminResponse { get; set; }

    public int? Priority { get; set; }
}

public class FeedbackResponse
{
    public int Id { get; set; }

    public int? UserId { get; set; }

    public string? UserName { get; set; }

    public string? UserEmail { get; set; }

    public string FeedbackType { get; set; } = null!;

    public string Title { get; set; } = null!;

    public string Content { get; set; } = null!;

    public string? Email { get; set; }

    public string? CurrentPage { get; set; }

    public string Status { get; set; } = null!;

    public int Priority { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public DateTime? RespondedAt { get; set; }

    public string? AdminResponse { get; set; }

    public int? RespondedBy { get; set; }

    public string? RespondedByName { get; set; }
}

public class FeedbackListResponse
{
    public int Id { get; set; }

    public string? UserName { get; set; }

    public string? UserEmail { get; set; }

    public string FeedbackType { get; set; } = null!;

    public string Title { get; set; } = null!;

    public string Status { get; set; } = null!;

    public int Priority { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? RespondedAt { get; set; }
}
