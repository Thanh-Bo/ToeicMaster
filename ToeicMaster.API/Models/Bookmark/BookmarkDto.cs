namespace ToeicMaster.API.Models.Bookmark;


public class GetBookmarksRequest
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;

    // Lọc theo Part (1, 2, 3... 7). Nếu null = Lấy tất cả (Tab "Gần đây")
    public int? PartNumber { get; set; }

    // Sắp xếp: "newest" (mặc định), "oldest"
    public string? Sort { get; set; } = "newest";

    // Lọc theo khoảng thời gian (Optional)
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
}

public class AddBookmarkRequest
{
    public int QuestionId { get; set; }
    public string? Note { get; set; }
}
