using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; // Để dùng Include, FirstOrDefaultAsync
using ToeicMaster.API.Data;          // Để dùng AppDbContext
using ToeicMaster.API.Services;
using ToeicMaster.API.Helpers;       // Để dùng DialogueLine
using System.Collections.Generic;
using System.Linq;
namespace ToeicMaster.API.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class TextToSpeechController : ControllerBase
    {
        private readonly TextToSpeechService _ttsService;
        private readonly AppDbContext _dbContext;

        public TextToSpeechController(TextToSpeechService ttsService, AppDbContext dbContext)
        {
            _ttsService = ttsService;
            _dbContext = dbContext;
        }

        

        /// <summary>
        /// Tạo audio cho một loạt câu hỏi
        /// </summary>
        [HttpPost("generate-batch")]
        public async Task<IActionResult> GenerateAudioBatch([FromBody] AudioBatchRequest request, [FromQuery] string voiceName = "en-US-Chirp3-HD-Achernar")
        {
            try
            {
                var results = new List<object>();
                var errors = new List<object>();

                foreach (var qId in request.QuestionIds)
                {
                    try
                    {
                        var question = await _dbContext.Questions.FindAsync(qId);
                        if (question == null)
                        {
                            errors.Add(new { questionId = qId, error = "Câu hỏi không tồn tại" });
                            continue;
                        }

                        if (string.IsNullOrEmpty(question.Content))
                        {
                            errors.Add(new { questionId = qId, error = "Không có text content" });
                            continue;
                        }

                        var audioUrl = await _ttsService.TextToSpeechAsync(
                            question.Content,
                            languageCode: "en-US",
                            voiceName: voiceName
                        );

                        question.AudioUrl = audioUrl;
                        await _dbContext.SaveChangesAsync();

                        results.Add(new { questionId = qId, audioUrl = audioUrl, status = "success" });
                    }
                    catch (Exception ex)
                    {
                        errors.Add(new { questionId = qId, error = ex.Message });
                    }
                }

                return Ok(new
                {
                    message = $"Xử lý {results.Count} câu hỏi thành công, {errors.Count} lỗi",
                    successCount = results.Count,
                    errorCount = errors.Count,
                    results = results,
                    errors = errors
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi: {ex.Message}" });
            }
        }

       
        /// <summary>
        /// Lấy danh sách voice có sẵn
        /// </summary>
        [HttpGet("available-voices")]
        public async Task<IActionResult> GetAvailableVoices([FromQuery] string languageCode = "en-US")
        {
            try
            {
                var voices = await _ttsService.GetAvailableVoicesAsync(languageCode);
                return Ok(new
                {
                    languageCode = languageCode,
                    voiceCount = voices.Count,
                    voices = voices
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi: {ex.Message}" });
            }
        }

        /// <summary>
        /// Test Google TTS connection
        /// </summary>
        [HttpPost("test-connection")]
        public async Task<IActionResult> TestConnection([FromBody] TextToSpeechRequest request)
        {
            try
            {
                var text = request?.Text ?? "Hello, this is a test.";
                var audioUrl = await _ttsService.TextToSpeechAsync(text);
                return Ok(new
                {
                    message = "Kết nối thành công",
                    testText = text,
                    audioUrl = audioUrl
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Kết nối thất bại: {ex.Message}" });
            }
        }

        [HttpPost("generate-audio/{groupId}")]
        public async Task<IActionResult> GenerateAudioForGroup(int groupId)
        {
            var group = await _dbContext.QuestionGroups
                .Include(g => g.Questions) // Lấy kèm câu hỏi để đọc intro
                .FirstOrDefaultAsync(g => g.Id == groupId);

            if (group == null) return NotFound("Không tìm thấy nhóm câu hỏi.");

            try
            {
                // 1. Chuẩn bị dữ liệu cho AI
                // Parse transcript từ DB (đã lưu ở bước 1)
                var dialogueLines = ParseTranscript(group.Transcript);

                // Lấy danh sách câu hỏi để đọc
                var questionTexts = group.Questions.Select(q => q.Content).ToList();

                // 2. Gọi AI Service (Hàm GenerateFullPart3AudioAsync bạn đã viết)
                string s3Url = await _ttsService.GenerateFullPart3AudioAsync(
                    dialogueLines,
                    questionTexts,
                    introText: null
                );

                // 3. Cập nhật URL vào Database
                group.AudioUrl = s3Url;
                

                await _dbContext.SaveChangesAsync();

                return Ok(new { message = "Tạo audio thành công", url = s3Url });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        private List<DialogueLine> ParseTranscript(string? rawTranscript)
        {
            var lines = new List<DialogueLine>();
            if (string.IsNullOrEmpty(rawTranscript)) return lines;

            var rawLines = rawTranscript.Split(new[] { '\n', '\r' }, StringSplitOptions.RemoveEmptyEntries);

            foreach (var rawLine in rawLines)
            {
                var colonIndex = rawLine.IndexOf(':');
                if (colonIndex > 0)
                {
                    var speaker = rawLine.Substring(0, colonIndex).Trim().ToUpper();
                    var text = rawLine.Substring(colonIndex + 1).Trim();
                    
                    // Logic chuẩn hóa Speaker: Nếu bắt đầu bằng M -> "M", còn lại là "W"
                    string speakerCode = (speaker.StartsWith("M") || speaker.Contains("MAN")) ? "M" : "W";
                    
                    lines.Add(new DialogueLine { Speaker = speakerCode, Text = text });
                }
            }
            return lines;
        }

        /// <summary>
        /// Lấy danh sách QuestionGroup theo TestId + PartNumber (Dùng chung cho Part 1-4)
        /// Frontend: GET /api/v1/tests/questions/groups?testId=4&partNumber=3
        /// </summary>
        [HttpGet("../tests/questions/groups")]
        public async Task<IActionResult> GetGroupsByPart([FromQuery] int testId, [FromQuery] int partNumber)
        {
            try
            {
                var groups = await _dbContext.QuestionGroups
                    .Include(g => g.Questions)
                    .ThenInclude(q => q.Answers)
                    .Where(g => g.Part.TestId == testId && g.Part.PartNumber == partNumber)
                    .Select(g => new 
                    {
                        g.Id,
                        g.Transcript,
                        g.AudioUrl,
                        g.TextContent,
                        g.ImageUrl,
                        HasAudio = !string.IsNullOrEmpty(g.AudioUrl),
                        Questions = g.Questions.Select(q => new
                        {
                            q.Id,
                            q.QuestionNo,
                            q.Content,
                            q.AudioUrl,
                            Answers = q.Answers.Select(a => new
                            {
                                a.Id,
                                a.Label,
                                a.Content
                            })
                        })
                    })
                    .ToListAsync();

                return Ok(groups);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
        
       
    }
     public class DialogueLine
    {
        public string Speaker { get; set; } // "M" or "W"
        public string Text { get; set; }
    }
    public class TextToSpeechRequest
    {
        public string Text { get; set; }
    }

    public class AudioBatchRequest
    {
        public List<int> QuestionIds { get; set; }
    }
}
