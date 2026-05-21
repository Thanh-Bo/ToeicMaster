using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using ToeicMaster.API.Data;
using ToeicMaster.API.Entities;
using ToeicMaster.API.Models;
using ToeicMaster.API.Services;

namespace ToeicMaster.API.Controllers;

[ApiController]
[Route("api/v1/grammar/grammars/{grammarId}/questions")]
[Authorize]
public class QuestionGrammarController : ControllerBase
{
    private readonly IGrammarService _grammarService;
    private readonly ILogger<QuestionGrammarController> _logger;
    private readonly AppDbContext _context;
    private readonly IPremiumService _premiumService;

    public QuestionGrammarController(
        IGrammarService grammarService, 
        ILogger<QuestionGrammarController> logger,
        AppDbContext context,
        IPremiumService premiumService)
    {
        _grammarService = grammarService;
        _logger = logger;
        _context = context;
        _premiumService = premiumService;
    }

    private int? GetUserIdOrNull()
    {
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return int.TryParse(userIdStr, out var userId) ? userId : null;
    }

    private async Task<bool> IsPremiumUserAsync(int? userId)
    {
        return await _premiumService.IsPremiumUserAsync(userId);
    }

    private async Task<bool> CanViewTopicExplanationAsync(int topicId)
    {
        var topic = await _context.GrammarTopics
            .AsNoTracking()
            .Where(t => t.Id == topicId)
            .Select(t => new { t.IsExplanationPremiumRequired })
            .FirstOrDefaultAsync();

        return topic == null ||
               !topic.IsExplanationPremiumRequired ||
               await IsPremiumUserAsync(GetUserIdOrNull());
    }

    // ==========================================
    // 1. GET GRAMMAR QUESTIONS (by GrammarId)
    // ==========================================

    /// <summary>
    /// Lấy danh sách câu hỏi ngữ pháp theo Grammar
    /// GET: /api/v1/grammar/grammars/{grammarId}/questions
    /// </summary>
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetQuestionsByGrammar(
        int grammarId,
        [FromQuery] string? mode = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        try
        {
            if (grammarId <= 0)
                return BadRequest(new { error = "Grammar ID không hợp lệ" });

            // Option A: If mode is null, return all questions without filtering by mode
            string? modeToUse = null;
            string? responseMode = null;
            
            // When mode is null/empty, disable pagination and return ALL questions
            int pageSizeToUse = pageSize;
            if (string.IsNullOrEmpty(mode))
            {
                modeToUse = null;
                responseMode = "all";
                pageSizeToUse = 1000;  // Large number to get all questions (no pagination)
            }
            else
            {
                modeToUse = mode.ToLower();
                responseMode = modeToUse;
            }

            // Get total count BEFORE pagination
            var totalCount = await _grammarService.GetGrammarQuestionCountAsync(grammarId, modeToUse);

            // Then get paginated questions
            var questions = await _grammarService.GetGrammarQuestionsByGrammarIdAsync(grammarId, modeToUse, page, pageSizeToUse);

            if (!questions.Any())
                return NotFound(new { error = "Không tìm thấy câu hỏi cho grammar này" });

            return Ok(new
            {
                grammarId,
                mode = responseMode ?? "all",  // Return "all" when no mode filter
                items = questions,
                page,
                pageSize = pageSizeToUse,
                total = totalCount,  // ← Use total count BEFORE pagination
                totalPages = string.IsNullOrEmpty(mode) ? 1 : (int)Math.Ceiling(totalCount / (double)pageSize)
            });
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error getting grammar questions: {ex.Message}");
            return StatusCode(500, new { error = "Lỗi lấy câu hỏi ngữ pháp" });
        }
    }

    /// <summary>
    /// Lấy chi tiết một câu hỏi ngữ pháp
    /// GET: /api/v1/grammar/grammars/{grammarId}/questions/{id}
    /// </summary>
    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetQuestionById(int grammarId, int id)
    {
        try
        {
            if (id <= 0)
                return BadRequest(new { error = "Question ID không hợp lệ" });

            var question = await _grammarService.GetGrammarQuestionByIdAsync(id);

            if (question == null)
                return NotFound(new { error = "Câu hỏi không tồn tại" });

            return Ok(question);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error getting grammar question {id}: {ex.Message}");
            return StatusCode(500, new { error = "Lỗi lấy câu hỏi" });
        }
    }

    /// <summary>
    /// Lấy danh sách đáp án của một câu hỏi
    /// GET: /api/v1/grammar/grammars/{grammarId}/questions/{questionId}/answers
    /// </summary>
    [HttpGet("{questionId}/answers")]
    [AllowAnonymous]
    public async Task<IActionResult> GetQuestionAnswers(int grammarId, int questionId)
    {
        try
        {
            if (questionId <= 0)
                return BadRequest(new { error = "Question ID không hợp lệ" });

            var answers = await _grammarService.GetQuestionAnswersAsync(questionId);

            if (!answers.Any())
                return NotFound(new { error = "Không tìm thấy đáp án" });

            return Ok(answers);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error getting question answers: {ex.Message}");
            return StatusCode(500, new { error = "Lỗi lấy đáp án" });
        }
    }

    // ==========================================
    // 2. CREATE GRAMMAR QUESTIONS (Admin)
    // ==========================================

    /// <summary>
    /// Tạo câu hỏi ngữ pháp (Admin)
    /// POST: /api/v1/grammar/grammars/{grammarId}/questions
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateQuestion(int grammarId, [FromBody] CreateQuestionGrammarRequest request)
    {
        try
        {
            if (request == null || string.IsNullOrEmpty(request.Content))
                return BadRequest(new { error = "Nội dung câu hỏi không được để trống" });

            if (request.GrammarId <= 0)
                return BadRequest(new { error = "Grammar ID không hợp lệ" });

            if (request.Options == null || request.Options.Count != 4)
                return BadRequest(new { error = "Phải có đúng 4 lựa chọn (A, B, C, D)" });

            if (string.IsNullOrEmpty(request.CorrectOption) || !new[] { "A", "B", "C", "D" }.Contains(request.CorrectOption))
                return BadRequest(new { error = "Đáp án đúng phải là A, B, C hoặc D" });

            var importDto = new QuestionGrammarImportItemDto
            {
                QuestionNo = request.QuestionNo,
                Content = request.Content,
                Options = request.Options,
                CorrectOption = request.CorrectOption,
                ShortExplanation = request.ShortExplanation,
                LongExplanation = request.LongExplanation,
                Mode = "medium" // Default mode, sẽ được override bởi query param trong ImportQuestions
            };

            var question = await _grammarService.CreateGrammarQuestionAsync(request.GrammarId, importDto);

            return CreatedAtAction(nameof(GetQuestionById), new { grammarId = grammarId, id = question.Id }, question);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error creating grammar question: {ex.Message}");
            return StatusCode(500, new { error = "Lỗi tạo câu hỏi" });
        }
    }

    /// <summary>
    /// Import hàng loạt câu hỏi ngữ pháp từ Excel (Admin)
    /// POST: /api/v1/grammar/grammars/{grammarId}/questions/import?mode=easy
    /// </summary>
    [HttpPost("import")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> ImportQuestions(
        int grammarId,
        IFormFile file,
        [FromQuery] string mode = "medium")
    {
        try
        {
            // Validate mode
            if (!new[] { "easy", "medium", "hard" }.Contains(mode.ToLower()))
                return BadRequest(new { error = "Mode phải là: easy, medium, hoặc hard" });

            // Validate file
            if (file == null || file.Length == 0)
                return BadRequest(new { error = "Vui lòng upload file Excel" });

            if (!file.FileName.EndsWith(".xlsx", StringComparison.OrdinalIgnoreCase))
                return BadRequest(new { error = "File phải có định dạng .xlsx" });

            var questions = new List<QuestionGrammarImportItemDto>();
            var errors = new List<string>();

            using (var stream = new MemoryStream())
            {
                await file.CopyToAsync(stream);
                using (var package = new OfficeOpenXml.ExcelPackage(stream))
                {
                    var worksheet = package.Workbook.Worksheets[0];
                    if (worksheet == null)
                        return BadRequest(new { error = "File Excel không có worksheet" });

                    var rowCount = worksheet.Dimension?.Rows ?? 0;
                    if (rowCount < 2)
                        return BadRequest(new { error = "File Excel không có dữ liệu" });

                    // Expected columns: Content, OptionA, OptionB, OptionC, OptionD, CorrectOption, ShortExplanation, LongExplanation
                    for (int row = 2; row <= rowCount; row++)
                    {
                        try
                        {
                            var content = worksheet.Cells[row, 1].Text?.Trim();
                            var optionA = worksheet.Cells[row, 2].Text?.Trim();
                            var optionB = worksheet.Cells[row, 3].Text?.Trim();
                            var optionC = worksheet.Cells[row, 4].Text?.Trim();
                            var optionD = worksheet.Cells[row, 5].Text?.Trim();
                            var correctOption = worksheet.Cells[row, 6].Text?.Trim().ToUpper();
                            var shortExp = worksheet.Cells[row, 7].Text?.Trim();
                            var longExp = worksheet.Cells[row, 8].Text?.Trim();

                            if (string.IsNullOrEmpty(content))
                            {
                                errors.Add($"Dòng {row}: Nội dung câu hỏi trống");
                                continue;
                            }

                            if (string.IsNullOrEmpty(optionA) || string.IsNullOrEmpty(optionB) || 
                                string.IsNullOrEmpty(optionC) || string.IsNullOrEmpty(optionD))
                            {
                                errors.Add($"Dòng {row}: Thiếu đáp án A/B/C/D");
                                continue;
                            }

                            if (string.IsNullOrEmpty(correctOption) || !new[] { "A", "B", "C", "D" }.Contains(correctOption))
                            {
                                errors.Add($"Dòng {row}: Đáp án đúng phải là A, B, C hoặc D");
                                continue;
                            }

                            questions.Add(new QuestionGrammarImportItemDto
                            {
                                QuestionNo = row - 1,
                                Content = content,
                                Options = new List<string> { optionA, optionB, optionC, optionD },
                                CorrectOption = correctOption,
                                ShortExplanation = shortExp ?? "",
                                LongExplanation = longExp ?? "",
                                Mode = mode.ToLower()
                            });
                        }
                        catch (Exception ex)
                        {
                            errors.Add($"Dòng {row}: {ex.Message}");
                        }
                    }
                }
            }

            if (!questions.Any())
                return BadRequest(new { error = "Không có câu hỏi hợp lệ trong file Excel", errors });

            int successCount = 0;
            int errorCount = 0;
            var importErrors = new List<string>();

            for (int i = 0; i < questions.Count; i++)
            {
                var question = questions[i];
                try
                {
                    question.QuestionNo = i + 1;
                    await _grammarService.CreateGrammarQuestionAsync(grammarId, question);
                    successCount++;
                }
                catch (Exception ex)
                {
                    errorCount++;
                    importErrors.Add($"Câu {question.QuestionNo}: {ex.Message}");
                }
            }

            return Ok(new
            {
                message = $"Import thành công {successCount} câu hỏi" + (errorCount > 0 ? $", lỗi {errorCount} câu" : ""),
                grammarId = grammarId,
                mode = mode.ToLower(),
                successCount,
                errorCount,
                errors = errorCount > 0 ? importErrors : null,
                parseErrors = errors.Any() ? errors : null
            });
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error importing grammar questions: {ex.Message}");
            return StatusCode(500, new { error = "Lỗi import câu hỏi" });
        }
    }

    // ==========================================
    // 3. DELETE GRAMMAR QUESTIONS (Admin)
    // ==========================================

    /// <summary>
    /// Xóa câu hỏi ngữ pháp (Admin)
    /// DELETE: /api/v1/grammar/grammars/{grammarId}/questions/{id}
    /// </summary>
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteQuestion(int grammarId, int id)
    {
        try
        {
            if (id <= 0)
                return BadRequest(new { error = "Question ID không hợp lệ" });

            var result = await _grammarService.DeleteGrammarQuestionAsync(id);

            if (!result)
                return NotFound(new { error = "Câu hỏi không tồn tại" });

            return Ok(new { message = "Xóa câu hỏi thành công" });
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error deleting grammar question {id}: {ex.Message}");
            return StatusCode(500, new { error = "Lỗi xóa câu hỏi" });
        }
    }

    /// <summary>
    /// Xóa tất cả câu hỏi của một grammar (Admin)
    /// DELETE: /api/v1/grammar/grammars/{grammarId}/questions/delete-all
    /// </summary>
    [HttpDelete("all")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteAllQuestions(int grammarId)
    {
        try
        {
            var result = await _grammarService.DeleteAllGrammarQuestionsAsync(grammarId);
            return Ok(new { message = $"Xóa {result} câu hỏi thành công" });
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error deleting all questions for grammar {grammarId}: {ex.Message}");
            return StatusCode(500, new { error = "Lỗi xóa câu hỏi" });
        }
    }

    // ==========================================
    // 4. IMPORT QUESTIONS BY TOPIC (New Flow - Random Practice)
    // ==========================================

    /// <summary>
    /// Import questions for a topic from Excel (New Flow - Random Practice)
    /// POST: /api/v1/grammar/topics/{topicId}/questions/import?mode=easy
    /// </summary>
    [HttpPost("~/api/v1/grammar/topics/{topicId}/questions/import")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> ImportQuestionsByTopic(
        int topicId,
        [FromQuery] string mode,
        IFormFile file)
    {
        try
        {
            // Validate mode
            if (mode != "easy" && mode != "medium" && mode != "hard")
                return BadRequest(new { error = "Mode phải là easy/medium/hard" });

            // Validate topic exists
            var topic = await _context.GrammarTopics.FindAsync(topicId);
            if (topic == null)
                return NotFound(new { error = "Topic không tồn tại" });

            // Validate file
            if (file == null || file.Length == 0)
                return BadRequest(new { error = "Vui lòng upload file Excel" });

            if (!file.FileName.EndsWith(".xlsx", StringComparison.OrdinalIgnoreCase))
                return BadRequest(new { error = "File phải có định dạng .xlsx" });

            var questions = new List<QuestionGrammarImportItemDto>();
            var parseErrors = new List<string>();

            using (var stream = new MemoryStream())
            {
                await file.CopyToAsync(stream);
                using (var package = new OfficeOpenXml.ExcelPackage(stream))
                {
                    var worksheet = package.Workbook.Worksheets[0];
                    if (worksheet == null)
                        return BadRequest(new { error = "File Excel không có worksheet" });

                    var rowCount = worksheet.Dimension?.Rows ?? 0;
                    if (rowCount < 2)
                        return BadRequest(new { error = "File Excel không có dữ liệu" });

                    // Expected columns: Content, OptionA, OptionB, OptionC, OptionD, CorrectOption, ShortExplanation, LongExplanation
                    for (int row = 2; row <= rowCount; row++)
                    {
                        try
                        {
                            var content = worksheet.Cells[row, 1].Text?.Trim();
                            var optionA = worksheet.Cells[row, 2].Text?.Trim();
                            var optionB = worksheet.Cells[row, 3].Text?.Trim();
                            var optionC = worksheet.Cells[row, 4].Text?.Trim();
                            var optionD = worksheet.Cells[row, 5].Text?.Trim();
                            var correctOption = worksheet.Cells[row, 6].Text?.Trim().ToUpper();
                            var shortExp = worksheet.Cells[row, 7].Text?.Trim();
                            var longExp = worksheet.Cells[row, 8].Text?.Trim();

                            if (string.IsNullOrEmpty(content))
                            {
                                parseErrors.Add($"Dòng {row}: Nội dung câu hỏi trống");
                                continue;
                            }

                            if (string.IsNullOrEmpty(optionA) || string.IsNullOrEmpty(optionB) || 
                                string.IsNullOrEmpty(optionC) || string.IsNullOrEmpty(optionD))
                            {
                                parseErrors.Add($"Dòng {row}: Thiếu đáp án A/B/C/D");
                                continue;
                            }

                            if (string.IsNullOrEmpty(correctOption) || !new[] { "A", "B", "C", "D" }.Contains(correctOption))
                            {
                                parseErrors.Add($"Dòng {row}: Đáp án đúng phải là A, B, C hoặc D");
                                continue;
                            }

                            questions.Add(new QuestionGrammarImportItemDto
                            {
                                Content = content,
                                Options = new List<string> { optionA, optionB, optionC, optionD },
                                CorrectOption = correctOption,
                                ShortExplanation = shortExp ?? "",
                                LongExplanation = longExp ?? "",
                                Mode = mode
                            });
                        }
                        catch (Exception ex)
                        {
                            parseErrors.Add($"Dòng {row}: {ex.Message}");
                        }
                    }
                }
            }

            if (!questions.Any())
                return BadRequest(new { error = "Không có câu hỏi hợp lệ trong file Excel", errors = parseErrors });

            var existingCount = await _context.QuestionGrammars
                .Where(q => q.TopicId == topicId && q.Mode == mode)
                .CountAsync();

            var labels = new[] { "A", "B", "C", "D" };

            // Build question entities kèm Answer options (A/B/C/D)
            var questionEntities = questions.Select((question, idx) =>
            {
                var entity = new QuestionGrammar
                {
                    TopicId = topicId,
                    Mode = mode,
                    QuestionNo = existingCount + idx + 1,
                    Content = question.Content,
                    CorrectOption = question.CorrectOption,
                    ShortExplanation = question.ShortExplanation,
                    LongExplanation = question.LongExplanation
                };

                // Lưu options A/B/C/D vào QuestionGrammarAnswer
                if (question.Options != null && question.Options.Count == 4)
                {
                    entity.Answers = question.Options.Select((opt, i) => new QuestionGrammarAnswer
                    {
                        Label = labels[i],
                        Content = opt,
                        IsCorrect = labels[i] == question.CorrectOption
                    }).ToList();
                }

                return entity;
            }).ToList();

            _context.QuestionGrammars.AddRange(questionEntities);
            await _context.SaveChangesAsync();
            var importedCount = questionEntities.Count;

            _logger.LogInformation($"Imported {importedCount} questions for topic {topicId}, mode {mode}");

            return Ok(new
            {
                message = $"Import {importedCount} questions thành công cho topic {topic.Title}",
                topicId,
                topicName = topic.Title,
                mode,
                importedCount,
                parseErrors = parseErrors.Any() ? parseErrors : null
            });
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error importing questions for topic {topicId}: {ex.Message}");
            return StatusCode(500, new { error = "Lỗi import câu hỏi" });
        }
    }

    // ==========================================
    // 5. GET QUESTIONS BY TOPIC (For Random Practice)
    // ==========================================

    /// <summary>
    /// Get questions by topic and mode (For Random Practice tab)
    /// GET: /api/v1/grammar/topics/{topicId}/questions?mode=easy
    /// </summary>
    [HttpGet("~/api/v1/grammar/topics/{topicId}/questions")]
    [AllowAnonymous]
    public async Task<IActionResult> GetQuestionsByTopic(
        int topicId,
        [FromQuery] string? mode = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 25)
    {
        try
        {
            if (topicId <= 0)
                return BadRequest(new { error = "Topic ID không hợp lệ" });

            var canViewExplanation = await CanViewTopicExplanationAsync(topicId);

            // Validate mode if provided
            if (!string.IsNullOrEmpty(mode) && !new[] { "easy", "medium", "hard" }.Contains(mode.ToLower()))
                return BadRequest(new { error = "Mode phải là easy/medium/hard" });

            // Chỉ lấy câu hỏi new flow (random practice): GrammarId IS NULL
            // Old flow questions (Layer 3) có GrammarId != null → không lấy
            var query = _context.QuestionGrammars
                .Where(q => q.TopicId == topicId && q.GrammarId == null)
                .AsQueryable();

            if (!string.IsNullOrEmpty(mode))
            {
                query = query.Where(q => q.Mode == mode.ToLower());
            }

            var totalCount = await query.CountAsync();
            var questions = await query
                .Include(q => q.Answers) // Load options A/B/C/D
                .OrderBy(q => q.QuestionNo)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            if (!questions.Any())
                return Ok(new { items = new List<QuestionGrammar>(), total = 0 });

            var items = questions.Select(q => new QuestionGrammarDto
            {
                Id = q.Id,
                TopicId = q.TopicId,
                GrammarId = q.GrammarId,
                RuleId = q.GrammarId,
                QuestionNo = q.QuestionNo,
                Content = q.Content,
                CorrectOption = q.CorrectOption,
                ShortExplanation = canViewExplanation ? q.ShortExplanation : null,
                LongExplanation = canViewExplanation ? q.LongExplanation : null,
                ExplanationLocked = !canViewExplanation,
                Mode = q.Mode,
                Answers = q.Answers.OrderBy(a => a.Label).Select(a => new QuestionGrammarAnswerDto
                {
                    Id = a.Id,
                    QuestionGrammarId = a.QuestionGrammarId,
                    Label = a.Label,
                    Content = a.Content,
                    IsCorrect = a.IsCorrect
                }).ToList()
            }).ToList();

            return Ok(new
            {
                topicId,
                mode = mode ?? "all",
                items,
                page,
                pageSize,
                total = totalCount,
                totalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
            });
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error getting questions by topic {topicId}: {ex.Message}");
            return StatusCode(500, new { error = "Lỗi lấy câu hỏi" });
        }
    }

    // ==========================================
    // 6. DELETE QUESTIONS BY TOPIC (Random Practice - New Flow only)
    // ==========================================

    /// <summary>
    /// Xóa câu hỏi random practice của topic (chỉ new flow: GrammarId IS NULL)
    /// DELETE: /api/v1/grammar/topics/{topicId}/questions        → xóa tất cả
    /// DELETE: /api/v1/grammar/topics/{topicId}/questions?mode=medium → xóa theo mode
    /// </summary>
    [HttpDelete("~/api/v1/grammar/topics/{topicId}/questions")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteRandomQuestionsByTopic(
        int topicId,
        [FromQuery] string? mode = null)
    {
        try
        {
            // Validate mode nếu có truyền vào
            if (!string.IsNullOrEmpty(mode) && !new[] { "easy", "medium", "hard" }.Contains(mode.ToLower()))
                return BadRequest(new { error = "Mode phải là easy/medium/hard" });

            var topic = await _context.GrammarTopics.FindAsync(topicId);
            if (topic == null)
                return NotFound(new { error = "Topic không tồn tại" });

            // Base query: chỉ new flow (GrammarId IS NULL)
            var query = _context.QuestionGrammars
                .Where(q => q.TopicId == topicId && q.GrammarId == null);

            // Nếu có mode → lọc thêm theo mode
            if (!string.IsNullOrEmpty(mode))
                query = query.Where(q => q.Mode == mode.ToLower());

            var questions = await query.ToListAsync();

            _context.QuestionGrammars.RemoveRange(questions);
            await _context.SaveChangesAsync();

            var modeLabel = string.IsNullOrEmpty(mode) ? "tất cả" : $"[{mode.ToLower()}]";
            return Ok(new
            {
                message = $"Đã xóa {questions.Count} câu hỏi {modeLabel} của topic {topic.Title}",
                topicId,
                topicName = topic.Title,
                mode = string.IsNullOrEmpty(mode) ? "all" : mode.ToLower(),
                deletedCount = questions.Count
            });
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error deleting random questions for topic {topicId}: {ex.Message}");
            return StatusCode(500, new { error = "Lỗi xóa câu hỏi", details = ex.Message });
        }
    }

    [HttpDelete("delete-all")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteAllQuestionsInGrammar(int grammarId)
    {
        try
        {
            if (grammarId <= 0)
                return BadRequest(new { error = "Grammar ID không hợp lệ" });

            var deletedCount = await _grammarService.DeleteAllQuestionsByGrammarIdAsync(grammarId);

            return Ok(new
            {
                message = $"Đã xóa {deletedCount} câu hỏi",
                grammarId = grammarId,
                deletedCount
            });
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error deleting all questions in grammar {grammarId}: {ex.Message}");
            return StatusCode(500, new { error = "Lỗi xóa câu hỏi" });
        }
    }

    /// <summary>
    /// Xóa tất cả câu hỏi của một mode cụ thể (Admin)
    /// DELETE: /api/v1/grammar/grammars/{grammarId}/questions?mode=easy
    /// </summary>
    [HttpDelete]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteQuestionsByMode(int grammarId, [FromQuery] string mode)
    {
        try
        {
            if (grammarId <= 0)
                return BadRequest(new { error = "Grammar ID không hợp lệ" });

            if (string.IsNullOrEmpty(mode))
                return BadRequest(new { error = "Mode không được để trống (easy/medium/hard)" });

            var modeLower = mode.ToLower();
            if (modeLower != "easy" && modeLower != "medium" && modeLower != "hard")
                return BadRequest(new { error = "Mode phải là easy/medium/hard" });

            var deletedCount = await _grammarService.DeleteQuestionsByGrammarIdAndModeAsync(grammarId, modeLower);

            return Ok(new
            {
                message = $"Đã xóa {deletedCount} câu hỏi {modeLower}",
                grammarId = grammarId,
                mode = modeLower,
                deletedCount
            });
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error deleting questions by mode for grammar {grammarId}: {ex.Message}");
            return StatusCode(500, new { error = "Lỗi xóa câu hỏi" });
        }
    }

    /// <summary>
    /// Cập nhật câu hỏi ngữ pháp (Admin)
    /// PUT: /api/v1/grammar/grammars/{grammarId}/questions/{id}
    /// </summary>
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateQuestion(int grammarId, int id, [FromBody] QuestionGrammarImportItemDto request)
    {
        try
        {
            if (id <= 0)
                return BadRequest(new { error = "Question ID không hợp lệ" });

            if (request == null || string.IsNullOrEmpty(request.Content))
                return BadRequest(new { error = "Nội dung câu hỏi không được để trống" });

            if (request.Options == null || request.Options.Count != 4)
                return BadRequest(new { error = "Phải có đúng 4 lựa chọn (A, B, C, D)" });

            if (string.IsNullOrEmpty(request.CorrectOption) || !new[] { "A", "B", "C", "D" }.Contains(request.CorrectOption))
                return BadRequest(new { error = "Đáp án đúng phải là A, B, C hoặc D" });

            var question = await _grammarService.UpdateGrammarQuestionAsync(id, request);

            if (question == null)
                return NotFound(new { error = "Câu hỏi không tồn tại" });

            return Ok(new
            {
                message = "Cập nhật câu hỏi thành công",
                question = new
                {
                    question.Id,
                    question.GrammarId,
                    question.QuestionNo,
                    question.Content,
                    question.CorrectOption,
                    question.ShortExplanation,
                    question.LongExplanation,
                    question.Mode
                }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error updating grammar question {id}: {ex.Message}");
            return StatusCode(500, new { error = "Lỗi cập nhật câu hỏi" });
        }
    }
}

// ==========================================
// HELPER CLASSES
// ==========================================

public class CreateQuestionGrammarRequest
{
    public int GrammarId { get; set; }
    public int QuestionNo { get; set; }
    public string Content { get; set; } = string.Empty;
    public List<string> Options { get; set; } = new(); // [A, B, C, D]
    public string CorrectOption { get; set; } = string.Empty; // A, B, C, D
    public string? ShortExplanation { get; set; }
    public string? LongExplanation { get; set; }
}
