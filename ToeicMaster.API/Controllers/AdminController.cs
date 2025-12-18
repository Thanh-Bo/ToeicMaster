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
        
        private readonly AppDbContext _efContext;
       
        public AdminController(AppDbContext efContext)
        {
            _efContext = efContext;
        }

       

        [HttpPost("import-part5")]
        public async Task<IActionResult> ImportReadingExcel(IFormFile file, [FromQuery] int testId)
        {
            // 1. Kiểm tra file
            if (file == null || file.Length == 0) return BadRequest("Chưa chọn file!");

       

            try 
            {
                // 2. Tìm đề thi (Test) trong DB để gắn câu hỏi vào
                var test = await _efContext.Tests
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
                                await _efContext.SaveChangesAsync(); // Lưu để có ID Part
                            }

                            // b. Tạo Group (Part 5 mỗi câu 1 group, hoặc gom chung 1 group cũng được)
                            // Ở đây ta tạo 1 Group chung cho cả Part để tiết kiệm DB
                            var group = part.QuestionGroups.FirstOrDefault();
                            if (group == null)
                            {
                                group = new QuestionGroup { PartId = part.Id, TextContent = "Incomplete Sentences" };
                                _efContext.QuestionGroups.Add(group);
                                await _efContext.SaveChangesAsync();
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

                            _efContext.Questions.Add(question);
                            countSuccess++;
                        }
                        
                        // Lưu tất cả thay đổi
                        await _efContext.SaveChangesAsync();
                    }
                }

                return Ok(new { message = $"Đã nhập thành công {countSuccess} câu hỏi Part 5!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpPost("import-part6")]
        public async Task<IActionResult> ImportPart6(IFormFile file, [FromQuery] int testId)
        {
            if (file == null || file.Length == 0)
                return BadRequest("File không hợp lệ");

            // 1. Tìm hoặc tạo Part 6 (Text Completion)
            var part = await _efContext.Parts.FirstOrDefaultAsync(p => p.TestId == testId && p.PartNumber == 6);
            if (part == null)
            {
                part = new Part { TestId = testId, Name = "Part 6: Text Completion", PartNumber = 6 };
                _efContext.Parts.Add(part);
                await _efContext.SaveChangesAsync();
            }

            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            using (var stream = new MemoryStream())
            {
                await file.CopyToAsync(stream);
                using (var package = new ExcelPackage(stream))
                {
                    var worksheet = package.Workbook.Worksheets[0];
                    var rowCount = worksheet.Dimension.Rows;

                    // Biến để theo dõi Group hiện tại
                    string lastPassageContent = ""; 
                    int currentGroupId = 0;

                    for (int row = 2; row <= rowCount; row++)
                    {
                        // Lấy nội dung đoạn văn ở Cột A
                        var passageContent = worksheet.Cells[row, 1].Text?.Trim();
                        if (string.IsNullOrEmpty(passageContent)) continue; // Bỏ qua dòng trống

                        // --- LOGIC GOM NHÓM ---
                        // Nếu đoạn văn này KHÁC đoạn văn của dòng trước -> Tạo Group mới
                        if (passageContent != lastPassageContent)
                        {
                            var newGroup = new QuestionGroup
                            {
                                PartId = part.Id,
                                TextContent = passageContent, // Lưu đoạn văn vào Group
                                ImageUrl = null,
                                AudioUrl = null
                            };
                            _efContext.QuestionGroups.Add(newGroup);
                            await _efContext.SaveChangesAsync(); // Lưu để lấy ID
                            
                            currentGroupId = newGroup.Id;
                            lastPassageContent = passageContent; // Cập nhật biến tạm
                        }
                        // ----------------------

                        // Tạo câu hỏi (Gán vào currentGroupId)
                        var questionNo = int.Parse(worksheet.Cells[row, 2].Text);
                        var questionContent = worksheet.Cells[row, 3].Text; // Thường Part 6 nội dung câu hỏi nằm trong bài đọc, cột này có thể để trống
                        var correctOpt = worksheet.Cells[row, 8].Text?.Trim().ToUpper();
                        var explanation = worksheet.Cells[row, 9].Text;

                        var question = new Question
                        {
                            GroupId = currentGroupId, // <--- GẮN VÀO GROUP VỪA TẠO
                            QuestionNo = questionNo,
                            Content = string.IsNullOrEmpty(questionContent) ? $"Question {questionNo}" : questionContent,
                            CorrectOption = correctOpt,
                            ShortExplanation = null,
                            FullExplanation = explanation
                        };
                        _efContext.Questions.Add(question);
                        await _efContext.SaveChangesAsync();

                        // Lưu 4 đáp án
                        var answers = new List<Answer>
                        {
                            new Answer { QuestionId = question.Id, Label = "A", Content = worksheet.Cells[row, 4].Text },
                            new Answer { QuestionId = question.Id, Label = "B", Content = worksheet.Cells[row, 5].Text },
                            new Answer { QuestionId = question.Id, Label = "C", Content = worksheet.Cells[row, 6].Text },
                            new Answer { QuestionId = question.Id, Label = "D", Content = worksheet.Cells[row, 7].Text }
                        };
                        _efContext.Answers.AddRange(answers);
                    }
                    await _efContext.SaveChangesAsync();
                }
            }

            return Ok("Import Part 6 thành công!");
        }


        
    }
}