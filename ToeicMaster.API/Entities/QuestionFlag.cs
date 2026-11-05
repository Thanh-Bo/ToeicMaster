using System;

namespace ToeicMaster.API.Entities;

/// <summary>
/// Câu hỏi người dùng đã đánh dấu "Lưu lại để xem sau" (flag).
/// Khác với Bookmark: bookmark có ghi chú và hiển thị trong tab "Đã lưu",
/// còn flag dùng để đánh dấu nhanh trong lúc làm bài / xem lại.
/// </summary>
public partial class QuestionFlag
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public int QuestionId { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual User User { get; set; } = null!;

    public virtual Question Question { get; set; } = null!;
}
