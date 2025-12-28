// Models/ImportDtos.cs
namespace ToeicMaster.API.Models
{
    public class ImportFullTestRequest
    {
        public string Title { get; set; } // Tên đề thi (VD: ETS 2024 Test 1)
        public List<ImportPartDto> Parts { get; set; }
    }

    public class ImportPartDto
    {
        public int PartNumber { get; set; } // 1, 2... 7
        public List<ImportGroupDto> Groups { get; set; }
    }

    public class ImportGroupDto
    {
        // Tên file (VD: "ets_t1_p1_01.mp3"), Backend tự thêm đường dẫn "/uploads/..."
        public string? AudioName { get; set; }
        public string? ImageName { get; set; }
        public string? Transcript { get; set; }
        public string? TextContent { get; set; } // Dành cho Part 6, 7
        public List<ImportQuestionDto> Questions { get; set; }
    }

    public class ImportQuestionDto
    {
        public int QuestionNo { get; set; }
        public string? Content { get; set; }
        public string CorrectOption { get; set; } // A, B, C, D
        public string? Explanation { get; set; }
        public List<ImportAnswerDto> Answers { get; set; }
    }

    public class ImportAnswerDto
    {
        public string Label { get; set; } // A, B, C, D
        public string Content { get; set; }
    }
}