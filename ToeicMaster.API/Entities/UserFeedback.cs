using System;

namespace ToeicMaster.API.Entities;

public partial class UserFeedback
{
    public int Id { get; set; }

    public int? UserId { get; set; }

    public string FeedbackType { get; set; } = null!; // "bug", "feature", "ui_ux", "other"

    public string Title { get; set; } = null!;

    public string Content { get; set; } = null!;

    public string? Email { get; set; }

    public string? CurrentPage { get; set; }

    public string? UserAgent { get; set; }

    public string? ScreenshotUrl { get; set; }

    public string Status { get; set; } = "pending"; // "pending", "reviewing", "resolved", "rejected"

    public int Priority { get; set; } = 2; // 1=low, 2=medium, 3=high

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public DateTime? RespondedAt { get; set; }

    public string? AdminResponse { get; set; }

    public int? RespondedBy { get; set; }

    public virtual User? User { get; set; }

    public virtual User? RespondedByUser { get; set; }
}
