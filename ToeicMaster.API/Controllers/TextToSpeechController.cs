using Microsoft.AspNetCore.Mvc;
using ToeicMaster.API.Data;
using ToeicMaster.API.Services;
using ToeicMaster.API.Models.TextToSpeech;
using Microsoft.EntityFrameworkCore;

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
        /// Tạo audio cho câu hỏi và lưu vào DB
        /// </summary>
        [HttpPost("generate-for-question/{questionId}")]
        public async Task<IActionResult> GenerateAudioForQuestion(int questionId, [FromQuery] string voiceName = "en-US-Neural2-A")
        {
            try
            {
                var question = await _dbContext.Questions.FindAsync(questionId);
                if (question == null)
                    return NotFound(new { message = "Câu hỏi không tồn tại" });

                if (string.IsNullOrEmpty(question.Content))
                    return BadRequest(new { message = "Câu hỏi không có nội dung text" });

                // Tạo audio
                var audioUrl = await _ttsService.TextToSpeechAsync(
                    question.Content,
                    languageCode: "en-US",
                    voiceName: voiceName
                );

                // Lưu URL vào DB
                question.AudioUrl = audioUrl;
                await _dbContext.SaveChangesAsync();

                return Ok(new
                {
                    message = "Tạo audio thành công",
                    questionId = questionId,
                    audioUrl = audioUrl
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi: {ex.Message}" });
            }
        }

        /// <summary>
        /// Tạo audio cho một loạt câu hỏi
        /// </summary>
        [HttpPost("generate-batch")]
        public async Task<IActionResult> GenerateAudioBatch([FromBody] AudioBatchRequest request, [FromQuery] string voiceName = "en-US-Neural2-A")
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
        /// Tạo audio cho tất cả câu hỏi trong một Part
        /// </summary>
        [HttpPost("generate-for-part/{partId}")]
        public async Task<IActionResult> GenerateAudioForPart(int partId, [FromQuery] string voiceName = "en-US-Neural2-A")
        {
            try
            {
                var questions = await _dbContext.Questions
                    .Where(q => q.Group.PartId == partId && string.IsNullOrEmpty(q.AudioUrl))
                    .ToListAsync();

                if (!questions.Any())
                    return NotFound(new { message = "Không tìm thấy câu hỏi nào cần tạo audio" });

                var successCount = 0;
                var errors = new List<object>();

                foreach (var question in questions)
                {
                    try
                    {
                        var audioUrl = await _ttsService.TextToSpeechAsync(
                            question.Content,
                            languageCode: "en-US",
                            voiceName: voiceName
                        );

                        question.AudioUrl = audioUrl;
                        successCount++;
                    }
                    catch (Exception ex)
                    {
                        errors.Add(new { questionId = question.Id, error = ex.Message });
                    }
                }

                await _dbContext.SaveChangesAsync();

                return Ok(new
                {
                    message = $"Tạo audio cho Part {partId} thành công",
                    successCount = successCount,
                    errorCount = errors.Count,
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
    }
}
