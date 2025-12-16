using Microsoft.AspNetCore.Mvc;
using ToeicMaster.API.Entities;

namespace ToeicMaster.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AiTestController : ControllerBase
    {
        private readonly AiExplanationService _aiService;

        // Inject Service vào
        public AiTestController(AiExplanationService aiService)
        {
            _aiService = aiService;
        }

        [HttpGet("test-connection")]
        public async Task<IActionResult> TestAiConnection()
        {
            // 1. Tạo dữ liệu giả (Fake Data)
            var dummyQuestion = new Question
            {
                Content = "She _____ to the market yesterday.",
                CorrectOption = "B"
            };

            var dummyAnswers = new List<Answer>
            {
                new Answer { Label = "A", Content = "go" },
                new Answer { Label = "B", Content = "went" },
                new Answer { Label = "C", Content = "goes" },
                new Answer { Label = "D", Content = "gone" }
            };

            try 
            {
                // 2. Gọi hàm AI
                var result = await _aiService.GenerateExplanationAsync(dummyQuestion, dummyAnswers);

                // 3. Trả về kết quả để xem trên màn hình
                return Ok(new 
                {
                    Status = "Thành công! AI đã trả lời.",
                    ShortExplanation = result.Short,
                    FullExplanation = result.Full
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Status = "Lỗi rồi!", Error = ex.Message });
            }
        }
    }
}