using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ToeicMaster.API.Data;
using ToeicMaster.API.Entities;
using ToeicMaster.API.Models.Admin;
using OfficeOpenXml; // Cần using cái này
using System.IO;

namespace ToeicMaster.API.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AdminController(AppDbContext context)
        {
            _context = context;
        }

       

        [HttpPost("import-reading-excel")]
        public async Task<IActionResult> ImportReadingExcel(IFormFile file, [FromQuery] int testId)
        {
            // 1. Kiểm tra file
            if (file == null || file.Length == 0) return BadRequest("Chưa chọn file!");

       

            try 
            {
                // 2. Tìm đề thi (Test) trong DB để gắn câu hỏi vào
                var test = await _context.Tests
                    .Include(t => t.Parts)
                    .ThenInclude(p => p.QuestionGroups)
                    .FirstOrDefaultAsync(t => t.Id == testId);

                if (test == null) return NotFound("Không tìm thấy Test ID này. Hãy tạo Test trước!");

                int countSuccess = 0;

                using (var stream = new MemoryStream())
                {
                    await file.CopyToAsync(stream);
                    using (var package = new ExcelPackage(stream))
                    {
                        var worksheet = package.Workbook.Worksheets[0]; // Lấy sheet đầu tiên
                        var rowCount = worksheet.Dimension.Rows;

                        // 3. Quét từng dòng Excel (Từ dòng 2 trở đi)
                        for (int row = 2; row <= rowCount; row++)
                        {
                            // Đọc dữ liệu từ ô (Cẩn thận null)
                            string partStr = worksheet.Cells[row, 1].Value?.ToString();
                            if (string.IsNullOrEmpty(partStr)) continue; // Bỏ qua dòng trống

                            int partNum = int.Parse(partStr); // Cột 1: Part
                            int qNo = int.Parse(worksheet.Cells[row, 2].Value?.ToString() ?? "0"); // Cột 2: Số câu
                            string content = worksheet.Cells[row, 3].Value?.ToString() ?? ""; // Cột 3: Nội dung câu hỏi
                            
                            // Cột 4,5,6,7: Đáp án A, B, C, D
                            string optA = worksheet.Cells[row, 4].Value?.ToString() ?? "";
                            string optB = worksheet.Cells[row, 5].Value?.ToString() ?? "";
                            string optC = worksheet.Cells[row, 6].Value?.ToString() ?? "";
                            string optD = worksheet.Cells[row, 7].Value?.ToString() ?? "";
                            
                            string correctParams = worksheet.Cells[row, 8].Value?.ToString()?.Trim().ToUpper() ?? "A"; // Cột 8: Đáp án đúng
                            string explain = worksheet.Cells[row, 9].Value?.ToString() ?? ""; // Cột 9: Giải thích

                            // --- LOGIC LƯU VÀO DB ---

                            // a. Tìm hoặc Tạo Part (Ví dụ Part 5)
                            var part = test.Parts.FirstOrDefault(p => p.PartNumber == partNum);
                            if (part == null)
                            {
                                part = new Part { Name = $"Part {partNum}", PartNumber = partNum, TestId = test.Id };
                                test.Parts.Add(part);
                                await _context.SaveChangesAsync(); // Lưu để có ID Part
                            }

                            // b. Tạo Group (Part 5 mỗi câu 1 group, hoặc gom chung 1 group cũng được)
                            // Ở đây ta tạo 1 Group chung cho cả Part để tiết kiệm DB
                            var group = part.QuestionGroups.FirstOrDefault();
                            if (group == null)
                            {
                                group = new QuestionGroup { PartId = part.Id, TextContent = "Incomplete Sentences" };
                                _context.QuestionGroups.Add(group);
                                await _context.SaveChangesAsync();
                            }

                            // c. Tạo Câu hỏi (Question)
                            var question = new Question
                            {
                                GroupId = group.Id,
                                QuestionNo = qNo,
                                Content = content,
                                CorrectOption = correctParams, // "A", "B"...
                                QuestionType = "MCQ",
                                ScoreWeight = 5
                            };
                            
                            // Nếu có giải thích
                            if (!string.IsNullOrEmpty(explain))
                            {
                                // Tạm thời bỏ qua hoặc lưu vào cột Explaination riêng nếu bạn đã update DB
                            }

                            // d. Tạo 4 Đáp án (Answer)
                            question.Answers.Add(new Answer { Label = "A", Content = optA });
                            question.Answers.Add(new Answer { Label = "B", Content = optB });
                            question.Answers.Add(new Answer { Label = "C", Content = optC });
                            question.Answers.Add(new Answer { Label = "D", Content = optD });

                            _context.Questions.Add(question);
                            countSuccess++;
                        }
                        
                        // Lưu tất cả thay đổi
                        await _context.SaveChangesAsync();
                    }
                }

                return Ok(new { message = $"Đã nhập thành công {countSuccess} câu hỏi Part 5!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }


        [HttpPost("generate-explanations/{testId}")]
        // Nhớ đổi tên service thành GeminiExplanationService (hoặc tên class service bạn đang dùng)
        public async Task<IActionResult> GenerateExplanations(int testId, [FromServices] AiExplanationService aiService)
        {
            // 1. Lấy câu hỏi chưa có giải thích chi tiết (Check cột FullExplanation)
            var questions = await _context.Questions
                .Include(q => q.Answers)
                .Include(q => q.Group)
                // SỬA: Đổi q.Explanation thành q.FullExplanation
                .Where(q => q.Group.Part.TestId == testId && string.IsNullOrEmpty(q.FullExplanation)) 
                .ToListAsync();

            int count = 0;

            foreach (var q in questions)
            {
                if (q.Group.TextContent == "Incomplete Sentences") 
                {
                    try 
                    {
                        // 2. Gọi AI (Hàm này trả về 2 biến: shortExpl và fullExpl)
                        var result = await aiService.GenerateExplanationAsync(q, q.Answers.ToList());
                        
                        // 3. Gán vào 2 cột mới trong DB
                        q.ShortExplanation = result.Short;
                        q.FullExplanation = result.Full;
                        
                        await _context.SaveChangesAsync(); 
                        count++;
                        await Task.Delay(500); // Nghỉ 0.5s
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Lỗi câu {q.QuestionNo}: {ex.Message}");
                    }
                }
            }

            return Ok(new { message = $"Đã tạo xong giải thích cho {count} câu hỏi!" });
        }
    }
}