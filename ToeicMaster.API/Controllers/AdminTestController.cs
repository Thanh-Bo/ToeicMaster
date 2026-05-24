using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ToeicMaster.API.Data;

namespace ToeicMaster.API.Controllers;

public class AdminTestController : AdminBaseController
{
    public AdminTestController(AppDbContext context) : base(context) { }

    [HttpGet("tests")]
    public async Task<IActionResult> GetTests(
        [FromQuery] string? search, [FromQuery] string? type, [FromQuery] bool? isActive,
        [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        if (!await IsAdminAsync()) return Forbid();

        var query = _context.Tests.AsQueryable();
        if (!string.IsNullOrEmpty(search)) query = query.Where(t => t.Title.Contains(search));
        if (!string.IsNullOrEmpty(type)) query = query.Where(t => t.Type == type);
        if (isActive.HasValue) query = query.Where(t => t.IsActive == isActive.Value);

        var total = await query.CountAsync();
        var tests = await query.OrderByDescending(t => t.CreatedAt)
            .Skip((page - 1) * pageSize).Take(pageSize)
            .Select(t => new { t.Id, t.Title, t.Type, t.Duration, t.TotalQuestions, t.TotalParticipants, t.IsActive, t.IsExplanationPremiumRequired, t.CreatedAt, PartsCount = t.Parts.Count })
            .ToListAsync();

        return Ok(new { items = tests, total, page, pageSize, totalPages = (int)Math.Ceiling(total / (double)pageSize) });
    }

    [HttpPost("tests/{testId}/toggle-status")]
    public async Task<IActionResult> ToggleTestStatus(int testId)
    {
        if (!await IsAdminAsync()) return Forbid();
        var test = await _context.Tests.FindAsync(testId);
        if (test == null) return NotFound("Không tìm thấy bài test");
        test.IsActive = !test.IsActive;
        await _context.SaveChangesAsync();
        return Ok(new { testId = test.Id, isActive = test.IsActive, message = test.IsActive ?? false ? "Đã kích hoạt bài test" : "Đã ẩn bài test" });
    }

    [HttpPut("tests/{testId}/explanation-access")]
    public async Task<IActionResult> UpdateTestExplanationAccess(int testId, [FromBody] UpdateExplanationAccessRequest request)
    {
        if (!await IsAdminAsync()) return Forbid();
        var test = await _context.Tests.FindAsync(testId);
        if (test == null) return NotFound("Không tìm thấy bài test");
        test.IsExplanationPremiumRequired = request.IsExplanationPremiumRequired;
        await _context.SaveChangesAsync();
        return Ok(new { testId = test.Id, isExplanationPremiumRequired = test.IsExplanationPremiumRequired });
    }

    [HttpDelete("tests/{testId}")]
    public async Task<IActionResult> DeleteTest(int testId)
    {
        if (!await IsAdminAsync()) return Forbid();
        var test = await _context.Tests.FindAsync(testId);
        if (test == null) return NotFound("Không tìm thấy bài test");
        test.IsActive = false;
        await _context.SaveChangesAsync();
        return Ok(new { message = "Đã xóa bài test thành công", testId = test.Id });
    }

    [HttpGet("tests/{testId}/questions")]
    public async Task<IActionResult> GetTestQuestions(int testId, [FromQuery] int? partNumber, [FromQuery] int page = 1, [FromQuery] int pageSize = 50)
    {
        if (!await IsAdminAsync()) return Forbid();
        var test = await _context.Tests.FindAsync(testId);
        if (test == null) return NotFound("Không tìm thấy bài test");

        var query = _context.Questions.Include(q => q.Group).ThenInclude(g => g.Part)
            .Where(q => q.Group.Part.TestId == testId);
        if (partNumber.HasValue) query = query.Where(q => q.Group.Part.PartNumber == partNumber.Value);

        var total = await query.CountAsync();
        var questions = await query.OrderBy(q => q.Group.Part.PartNumber).ThenBy(q => q.QuestionNo)
            .Skip((page - 1) * pageSize).Take(pageSize)
            .Select(q => new { q.Id, TestId = testId, PartNumber = q.Group.Part.PartNumber, q.QuestionNo, Content = q.Content ?? "", q.CorrectOption, Explanation = q.ShortExplanation ?? q.FullExplanation, GroupId = q.GroupId, GroupContent = q.Group.TextContent ?? q.Group.AudioUrl })
            .ToListAsync();

        return Ok(new { items = questions, total, page, pageSize, totalPages = (int)Math.Ceiling(total / (double)pageSize), testTitle = test.Title });
    }

    [HttpPut("questions/{questionId}")]
    public async Task<IActionResult> UpdateQuestion(int questionId, [FromBody] UpdateQuestionRequest request)
    {
        if (!await IsAdminAsync()) return Forbid();
        var question = await _context.Questions.FindAsync(questionId);
        if (question == null) return NotFound("Không tìm thấy câu hỏi");
        if (!string.IsNullOrEmpty(request.Content)) question.Content = request.Content;
        if (!string.IsNullOrEmpty(request.CorrectOption)) question.CorrectOption = request.CorrectOption;
        if (!string.IsNullOrEmpty(request.Explanation)) question.ShortExplanation = request.Explanation;
        await _context.SaveChangesAsync();
        return Ok(new { message = "Đã cập nhật câu hỏi thành công", questionId = question.Id });
    }
}

public class UpdateQuestionRequest
{
    public string? Content { get; set; }
    public string? CorrectOption { get; set; }
    public string? Explanation { get; set; }
}

public class UpdateExplanationAccessRequest
{
    public bool IsExplanationPremiumRequired { get; set; }
}
