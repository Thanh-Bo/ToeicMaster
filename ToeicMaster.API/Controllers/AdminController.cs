using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using ToeicMaster.API.Data;
using ToeicMaster.API.Entities;
using ToeicMaster.API.Models.Admin;
using OfficeOpenXml;
using System.IO;

namespace ToeicMaster.API.Controllers
{
    /// <summary>
    /// Controller chuyên Import dữ liệu cho các Part (Part 1-7)
    /// Các API quản lý Test/Part (CRUD) đã chuyển sang TestManagementController
    /// </summary>
    [Route("api/v1/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {

        private readonly AppDbContext _efContext;
        private readonly IMemoryCache _cache;

        public AdminController(AppDbContext efContext, IMemoryCache cache)
        {
            _efContext = efContext;
            _cache = cache;
        }

        // Helper method để xóa cache khi có thay đổi dữ liệu
        private void InvalidateTestCache(int testId)
        {
            string cacheKey = $"test_full_{testId}";
            _cache.Remove(cacheKey);
        }

        // =============================================
        // IMPORT PART 5 - Incomplete Sentences
        // =============================================
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

                // Xóa cache để frontend nhận dữ liệu mới
                InvalidateTestCache(testId);

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

            // Xóa cache để frontend nhận dữ liệu mới
            InvalidateTestCache(testId);

            return Ok("Import Part 6 thành công!");
        }



        [HttpPost("import-part7")]
        public async Task<IActionResult> ImportPart7(IFormFile file, [FromQuery] int testId)
        {
            // 1. Kiểm tra file
            if (file == null || file.Length == 0)
                return BadRequest("Vui lòng upload file Excel.");

            // 2. Tìm hoặc Tạo Part 7 trong Database
            var part = await _efContext.Parts.FirstOrDefaultAsync(p => p.TestId == testId && p.PartNumber == 7);
            if (part == null)
            {
                part = new Part
                {
                    TestId = testId,
                    Name = "Part 7: Reading Comprehension",
                    PartNumber = 7
                };
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

                    // Biến dùng để theo dõi Gom nhóm (Grouping)
                    string lastPassage = "##INIT##";
                    string lastImageName = "##INIT##";
                    int currentGroupId = 0;

                    // Duyệt từ dòng 2 (bỏ qua Header)
                    for (int row = 2; row <= rowCount; row++)
                    {
                        // --- ĐỌC DỮ LIỆU TỪ EXCEL ---
                        var passageRaw = worksheet.Cells[row, 1].Text?.Trim();     // Cột A: Đoạn văn
                        var qNoText = worksheet.Cells[row, 2].Text?.Trim();        // Cột B: Số thứ tự
                        var content = worksheet.Cells[row, 3].Text?.Trim();        // Cột C: Câu hỏi

                        // Nếu không có số câu hỏi thì bỏ qua dòng này (dòng trống)
                        if (string.IsNullOrEmpty(qNoText)) continue;

                        var imageName = worksheet.Cells[row, 10].Text?.Trim();     // Cột J: Tên file ảnh (QUAN TRỌNG)

                        // --- XỬ LÝ LOGIC GOM NHÓM (GROUPING) ---
                        // Nhóm mới được tạo khi: Nội dung đoạn văn thay đổi HOẶC Tên ảnh thay đổi
                        bool isNewGroup = (passageRaw != lastPassage) || (imageName != lastImageName);

                        if (isNewGroup)
                        {
                            // Xử lý đường dẫn ảnh (Nếu có tên ảnh -> Tạo đường dẫn đầy đủ)
                            string? finalImageUrl = null;
                            if (!string.IsNullOrEmpty(imageName))
                            {
                                // Quy ước: Ảnh upload vào thư mục public/images/tests/
                                finalImageUrl = $"/images/tests/{imageName}";
                            }

                            var newGroup = new QuestionGroup
                            {
                                PartId = part.Id,
                                TextContent = string.IsNullOrEmpty(passageRaw) ? null : passageRaw,
                                ImageUrl = finalImageUrl, // Lưu đường dẫn ảnh vào DB
                                AudioUrl = null
                            };

                            _efContext.QuestionGroups.Add(newGroup);
                            await _efContext.SaveChangesAsync(); // Lưu ngay để lấy ID

                            currentGroupId = newGroup.Id;

                            // Cập nhật trạng thái cũ để so sánh vòng sau
                            lastPassage = passageRaw;
                            lastImageName = imageName;
                        }

                        // --- TẠO CÂU HỎI (QUESTION) ---
                        var correctOpt = worksheet.Cells[row, 8].Text?.Trim().ToUpper(); // Cột H
                        var explain = worksheet.Cells[row, 9].Text?.Trim();              // Cột I

                        var question = new Question
                        {
                            GroupId = currentGroupId, // Gắn vào Group vừa tạo/tìm thấy
                            QuestionNo = int.Parse(qNoText),
                            Content = string.IsNullOrEmpty(content) ? $"Question {qNoText}" : content,
                            CorrectOption = correctOpt,
                            ShortExplanation = null,
                            FullExplanation = explain // Thường là NULL để AI tự tạo sau
                        };

                        _efContext.Questions.Add(question);
                        await _efContext.SaveChangesAsync();

                        // --- TẠO 4 ĐÁP ÁN (ANSWERS) ---
                        var answers = new List<Answer>
                        {
                            new Answer { QuestionId = question.Id, Label = "A", Content = worksheet.Cells[row, 4].Text }, // Cột D
                            new Answer { QuestionId = question.Id, Label = "B", Content = worksheet.Cells[row, 5].Text }, // Cột E
                            new Answer { QuestionId = question.Id, Label = "C", Content = worksheet.Cells[row, 6].Text }, // Cột F
                            new Answer { QuestionId = question.Id, Label = "D", Content = worksheet.Cells[row, 7].Text }  // Cột G
                        };
                        _efContext.Answers.AddRange(answers);
                    }

                    // Lưu tất cả đáp án 1 lần cho nhanh
                    await _efContext.SaveChangesAsync();
                }
            }

            // Xóa cache để frontend nhận dữ liệu mới
            InvalidateTestCache(testId);

            return Ok(new { message = "Import Part 7 thành công!", count = "Check DB" });
        }


        [HttpPost("import-part1-data-only")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> ImportPart1DataOnly(
    [FromForm] IFormFile excelFile,
    [FromForm] List<IFormFile>? images,
    [FromQuery] int testId)
        {
            if (excelFile == null || excelFile.Length == 0)
                return BadRequest("Vui lòng upload file Excel.");

            var test = await _efContext.Tests.FindAsync(testId);
            if (test == null) return NotFound("Không tìm thấy Test.");

            try
            {
                // 1. Tạo Part 1 nếu chưa có
                var part = await _efContext.Parts.FirstOrDefaultAsync(p => p.TestId == testId && p.PartNumber == 1);
                if (part == null)
                {
                    part = new Part { Name = "Part 1: Photographs", PartNumber = 1, TestId = testId };
                    _efContext.Parts.Add(part);
                    await _efContext.SaveChangesAsync();
                }

                ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
                using var stream = new MemoryStream();
                await excelFile.CopyToAsync(stream);
                using var package = new ExcelPackage(stream);
                var worksheet = package.Workbook.Worksheets[0];
                int rowCount = worksheet.Dimension.Rows;

                var savedImages = new Dictionary<string, string>(); // Chỉ lưu ảnh
                int countSuccess = 0;

                for (int row = 2; row <= rowCount; row++)
                {
                    var qNoText = worksheet.Cells[row, 1].Text?.Trim();  // Col A
                    if (string.IsNullOrEmpty(qNoText)) continue;

                    var qNo = int.Parse(qNoText);
                    var imgName = worksheet.Cells[row, 2].Text?.Trim();  // Col B - Image
                    var transcript = worksheet.Cells[row, 3].Text?.Trim(); // Col C - Transcript (4 options)
                    var correctOpt = worksheet.Cells[row, 4].Text?.Trim().ToUpper();  // Col D - Answer

                    // --- XỬ LÝ ẢNH (GIỮ NGUYÊN) ---
                    string? finalImageUrl = null;
                    if (!string.IsNullOrEmpty(imgName))
                    {
                        if (savedImages.ContainsKey(imgName))
                            finalImageUrl = savedImages[imgName];
                        else
                        {
                            var imgFile = images?.FirstOrDefault(f => Path.GetFileName(f.FileName).Equals(imgName, StringComparison.OrdinalIgnoreCase));
                            if (imgFile != null)
                            {
                                var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads/images");
                                if (!Directory.Exists(folderPath)) Directory.CreateDirectory(folderPath);
                                var fileName = Guid.NewGuid() + Path.GetExtension(imgFile.FileName); // Đổi tên file cho an toàn
                                var path = Path.Combine(folderPath, fileName);
                                using (var streamImg = new FileStream(path, FileMode.Create))
                                {
                                    await imgFile.CopyToAsync(streamImg);
                                }
                                finalImageUrl = "/uploads/images/" + fileName;
                                savedImages[imgName] = finalImageUrl;
                            }
                        }
                    }

                    // --- LƯU DATABASE ---
                    var group = new QuestionGroup
                    {
                        PartId = part.Id,
                        ImageUrl = finalImageUrl,
                        AudioUrl = null,         // <--- QUAN TRỌNG: Để null
                        Transcript = transcript, // Lưu 4 câu mô tả vào đây
                        TextContent = null
                    };
                    _efContext.QuestionGroups.Add(group);
                    await _efContext.SaveChangesAsync();

                    var question = new Question
                    {
                        GroupId = group.Id,
                        QuestionNo = qNo,
                        Content = "Look at the picture and listen to the statements.",
                        CorrectOption = correctOpt,
                        QuestionType = "MCQ"
                    };
                    _efContext.Questions.Add(question);
                    await _efContext.SaveChangesAsync();

                    // Tạo 4 đáp án (Label A, B, C, D)
                    var answers = new List<Answer>
            {
                new Answer { QuestionId = question.Id, Label = "A", Content = "(A)" },
                new Answer { QuestionId = question.Id, Label = "B", Content = "(B)" },
                new Answer { QuestionId = question.Id, Label = "C", Content = "(C)" },
                new Answer { QuestionId = question.Id, Label = "D", Content = "(D)" }
            };
                    _efContext.Answers.AddRange(answers);
                    countSuccess++;
                }

                await _efContext.SaveChangesAsync();
                InvalidateTestCache(testId);

                return Ok(new
                {
                    message = $"Import Part 1 thành công! Đã nhập {countSuccess} câu hỏi.",
                    nextStep = "Vui lòng bấm 'Generate Audio' để tạo giọng đọc cho 4 câu mô tả."
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        // =============================================
        // IMPORT PART 2 - Question-Response (25 câu: 7-31)
        // Đặc điểm: 1 audio/câu, KHÔNG có câu hỏi text, chỉ 3 đáp án A/B/C
        // =============================================
        [HttpPost("import-part2-data-only")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> ImportPart2DataOnly(
    [FromForm] IFormFile excelFile,
    [FromQuery] int testId)
        {
            if (excelFile == null || excelFile.Length == 0)
                return BadRequest("Vui lòng upload file Excel.");

            var test = await _efContext.Tests.FindAsync(testId);
            if (test == null) return NotFound("Không tìm thấy Test.");

            try
            {
                var part = await _efContext.Parts.FirstOrDefaultAsync(p => p.TestId == testId && p.PartNumber == 2);
                if (part == null)
                {
                    part = new Part { Name = "Part 2: Question-Response", PartNumber = 2, TestId = testId };
                    _efContext.Parts.Add(part);
                    await _efContext.SaveChangesAsync();
                }

                ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
                using var stream = new MemoryStream();
                await excelFile.CopyToAsync(stream);
                using var package = new ExcelPackage(stream);
                var worksheet = package.Workbook.Worksheets[0];
                int rowCount = worksheet.Dimension.Rows;
                int countSuccess = 0;

                for (int row = 2; row <= rowCount; row++)
                {
                    var qNoText = worksheet.Cells[row, 1].Text?.Trim();  // Col A
                    if (string.IsNullOrEmpty(qNoText)) continue;

                    var qNo = int.Parse(qNoText);
                    // var audioName = worksheet.Cells[row, 2].Text?.Trim(); // BỎ Col B
                    // Transcript chứa: Question + 3 Answers (A, B, C)
                    var transcript = worksheet.Cells[row, 2].Text?.Trim();  // Col B - Transcript
                    var correctOpt = worksheet.Cells[row, 3].Text?.Trim().ToUpper();  // Col C - Answer

                    // --- LƯU DATABASE ---
                    var group = new QuestionGroup
                    {
                        PartId = part.Id,
                        AudioUrl = null,         // <--- QUAN TRỌNG: Để null
                        Transcript = transcript, // Lưu Question + Answers text
                        ImageUrl = null,
                        TextContent = null
                    };
                    _efContext.QuestionGroups.Add(group);
                    await _efContext.SaveChangesAsync();

                    var question = new Question
                    {
                        GroupId = group.Id,
                        QuestionNo = qNo,
                        Content = "Listen to the question and choose the best response.",
                        CorrectOption = correctOpt,
                        QuestionType = "MCQ"
                    };
                    _efContext.Questions.Add(question);
                    await _efContext.SaveChangesAsync();

                    // Part 2 chỉ có 3 đáp án A, B, C
                    var answers = new List<Answer>
            {
                new Answer { QuestionId = question.Id, Label = "A", Content = "(A)" },
                new Answer { QuestionId = question.Id, Label = "B", Content = "(B)" },
                new Answer { QuestionId = question.Id, Label = "C", Content = "(C)" }
            };
                    _efContext.Answers.AddRange(answers);
                    countSuccess++;
                }

                await _efContext.SaveChangesAsync();
                InvalidateTestCache(testId);

                return Ok(new
                {
                    message = $"Import Part 2 thành công! Đã nhập {countSuccess} câu hỏi.",
                    nextStep = "Vui lòng bấm 'Generate Audio' để tạo giọng đọc câu hỏi và trả lời."
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
        // =============================================
        // IMPORT PART 3 - Conversations (39 câu: 32-70, 13 hội thoại × 3 câu)
        // Đặc điểm: 1 audio/nhóm, có thể có ảnh, 3 câu hỏi/nhóm, 4 đáp án/câu
        // =============================================
        [HttpPost("import-part3-data-only")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> ImportPart3DataOnly(
    [FromForm] IFormFile excelFile,
    [FromForm] List<IFormFile>? images,
    [FromQuery] int testId)
        {
            if (excelFile == null || excelFile.Length == 0)
                return BadRequest("Vui lòng upload file Excel.");

            var test = await _efContext.Tests.FindAsync(testId);
            if (test == null) return NotFound("Không tìm thấy Test với ID này.");

            try
            {
                var part = await _efContext.Parts.FirstOrDefaultAsync(p => p.TestId == testId && p.PartNumber == 3);
                if (part == null)
                {
                    part = new Part { Name = "Part 3: Conversations", PartNumber = 3, TestId = testId };
                    _efContext.Parts.Add(part);
                    await _efContext.SaveChangesAsync();
                }

                ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
                using var stream = new MemoryStream();
                await excelFile.CopyToAsync(stream);
                using var package = new ExcelPackage(stream);
                var worksheet = package.Workbook.Worksheets[0];
                int rowCount = worksheet.Dimension.Rows;

                var savedImages = new Dictionary<string, string>();
                int countGroups = 0;
                int countQuestions = 0;

                for (int row = 2; row <= rowCount; row++)
                {
                    var groupNoText = worksheet.Cells[row, 1].Text?.Trim();
                    if (string.IsNullOrEmpty(groupNoText)) continue;

                    var imageName = worksheet.Cells[row, 2].Text?.Trim();  // Col B (2)
                    var transcript = worksheet.Cells[row, 3].Text?.Trim();  // Col C (3) ← FIX!

                    string? finalImageUrl = null;
                    if (!string.IsNullOrEmpty(imageName))
                    {
                        if (savedImages.ContainsKey(imageName))
                            finalImageUrl = savedImages[imageName];
                        else
                        {
                            var imgFile = images?.FirstOrDefault(f =>
                                Path.GetFileName(f.FileName).Equals(imageName, StringComparison.OrdinalIgnoreCase));

                            if (imgFile != null)
                            {
                                var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads/images");
                                if (!Directory.Exists(folderPath)) Directory.CreateDirectory(folderPath);
                                var fileName = Path.GetFileName(imgFile.FileName);
                                var path = Path.Combine(folderPath, fileName);
                                using var streamImg = new FileStream(path, FileMode.Create);
                                await imgFile.CopyToAsync(streamImg);

                                finalImageUrl = "/uploads/images/" + fileName;
                                savedImages[imageName] = finalImageUrl;
                            }
                        }
                    }

                    var group = new QuestionGroup
                    {
                        PartId = part.Id,
                        Transcript = transcript,
                        AudioUrl = null,
                        ImageUrl = finalImageUrl,
                        TextContent = null
                    };

                    _efContext.QuestionGroups.Add(group);
                    await _efContext.SaveChangesAsync();
                    countGroups++;

                    // Lưu 3 câu hỏi - CỘT BẮT ĐẦU TỪ 4 (D)
                    int col = 4;  // D = Q1 No
                    for (int q = 0; q < 3; q++)
                    {
                        var qNoText = worksheet.Cells[row, col].Text?.Trim();
                        
                        // Skip if no question number
                        if (string.IsNullOrEmpty(qNoText) || !int.TryParse(qNoText, out int qNo))
                        {
                            col += 7;
                            continue;
                        }

                        var qContent = worksheet.Cells[row, col + 1].Text?.Trim();  // E
                        var optA = worksheet.Cells[row, col + 2].Text?.Trim();      // F
                        var optB = worksheet.Cells[row, col + 3].Text?.Trim();      // G
                        var optC = worksheet.Cells[row, col + 4].Text?.Trim();      // H
                        var optD = worksheet.Cells[row, col + 5].Text?.Trim();      // I
                        var correctOptText = worksheet.Cells[row, col + 6].Text?.Trim();
                        var correctOpt = string.IsNullOrEmpty(correctOptText) ? "A" : correctOptText.ToUpperInvariant();

                        var question = new Question
                        {
                            GroupId = group.Id,
                            QuestionNo = qNo,
                            Content = qContent ?? "",
                            CorrectOption = correctOpt,
                            QuestionType = "MCQ"
                        };
                        _efContext.Questions.Add(question);
                        await _efContext.SaveChangesAsync();

                        var answers = new List<Answer>
                        {
                            new Answer { QuestionId = question.Id, Label = "A", Content = optA ?? "(A)" },
                            new Answer { QuestionId = question.Id, Label = "B", Content = optB ?? "(B)" },
                            new Answer { QuestionId = question.Id, Label = "C", Content = optC ?? "(C)" },
                            new Answer { QuestionId = question.Id, Label = "D", Content = optD ?? "(D)" }
                        };
                        _efContext.Answers.AddRange(answers);
                        countQuestions++;
                        col += 7;
                    }
                }

                await _efContext.SaveChangesAsync();

                return Ok(new
                {
                    message = $"Import dữ liệu thành công! Đã lưu {countGroups} nhóm hội thoại.",
                    nextStep = "Vui lòng bấm nút 'Generate Audio AI' để tạo file nghe."
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
        // =============================================
        // IMPORT PART 4 - Talks (30 câu: 71-100, 10 bài nói × 3 câu)
        // Đặc điểm: Giống Part 3 nhưng là bài nói đơn (monologue)
        // =============================================
        [HttpPost("import-part4-data-only")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> ImportPart4DataOnly(
   [FromForm] IFormFile excelFile,
   [FromForm] List<IFormFile>? images, // Vẫn giữ ảnh nếu bạn muốn upload ảnh minh họa
   [FromQuery] int testId)
        {
            if (excelFile == null || excelFile.Length == 0)
                return BadRequest("Vui lòng upload file Excel.");

            var test = await _efContext.Tests.FindAsync(testId);
            if (test == null) return NotFound("Không tìm thấy Test với ID này.");

            try
            {
                // 1. Tạo hoặc lấy Part 4
                var part = await _efContext.Parts.FirstOrDefaultAsync(p => p.TestId == testId && p.PartNumber == 4);
                if (part == null)
                {
                    part = new Part { Name = "Part 4: Talks", PartNumber = 4, TestId = testId };
                    _efContext.Parts.Add(part);
                    await _efContext.SaveChangesAsync();
                }

                ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
                using var stream = new MemoryStream();
                await excelFile.CopyToAsync(stream);
                using var package = new ExcelPackage(stream);
                var worksheet = package.Workbook.Worksheets[0];
                int rowCount = worksheet.Dimension.Rows;

                // Bỏ dictionary savedFiles cho audio, chỉ giữ cho image
                var savedImages = new Dictionary<string, string>();
                int countGroups = 0;
                int countQuestions = 0;

                // Loop qua Excel
                for (int row = 2; row <= rowCount; row++)
                {
                    var groupNoText = worksheet.Cells[row, 1].Text?.Trim();  // Col A - GroupNo
                    if (string.IsNullOrEmpty(groupNoText)) continue;

                    // BỎ CỘT AUDIO FILE NAME, CHỈ CẦN IMAGE & TRANSCRIPT
                    var imageName = worksheet.Cells[row, 2].Text?.Trim();    // Col B - Image
                    var transcript = worksheet.Cells[row, 3].Text?.Trim();   // Col C - Transcript
                    
                    // Câu hỏi bắt đầu từ Col D (4)

                    // --- BỎ HOÀN TOÀN ĐOẠN XỬ LÝ AUDIO FILE ---
                    // Chúng ta không cần đọc file, không cần lưu vào wwwroot nữa.

                    // Xử lý Image (Giữ nguyên logic cũ nếu bạn vẫn muốn upload ảnh từ Excel)
                    string? finalImageUrl = null;
                    if (!string.IsNullOrEmpty(imageName))
                    {
                        if (savedImages.ContainsKey(imageName))
                            finalImageUrl = savedImages[imageName];
                        else
                        {
                            var imgFile = images?.FirstOrDefault(f =>
                                Path.GetFileName(f.FileName).Equals(imageName, StringComparison.OrdinalIgnoreCase));

                            if (imgFile != null)
                            {
                                // Logic lưu ảnh (giữ nguyên hoặc upload S3 tùy bạn)
                                var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads/images");
                                if (!Directory.Exists(folderPath)) Directory.CreateDirectory(folderPath);
                                var fileName = Path.GetFileName(imgFile.FileName); // Nên đổi tên file bằng Guid để tránh trùng
                                var path = Path.Combine(folderPath, fileName);
                                using var streamImg = new FileStream(path, FileMode.Create);
                                await imgFile.CopyToAsync(streamImg);

                                finalImageUrl = "/uploads/images/" + fileName;
                                savedImages[imageName] = finalImageUrl;
                            }
                        }
                    }

                    // --- LƯU VÀO DB (QUAN TRỌNG) ---
                    var group = new QuestionGroup
                    {
                        PartId = part.Id,
                        Transcript = transcript, // Lưu transcript để tí nữa AI đọc
                        AudioUrl = null,         // <--- QUAN TRỌNG: Để Null để biết chưa có Audio
                        ImageUrl = finalImageUrl,
                        TextContent = null
                        // Nếu DB có cột IsProcessed, hãy set = false
                    };

                    _efContext.QuestionGroups.Add(group);
                    await _efContext.SaveChangesAsync();
                    countGroups++;

                    // Lưu 3 câu hỏi - CỘT BẮT ĐẦU TỪ 4 (D) - GIỐNG PART 3
                    int col = 4;  // D = Q1 No
                    for (int q = 0; q < 3; q++)
                    {
                        var qNoText = worksheet.Cells[row, col].Text?.Trim();
                        
                        // Skip if no question number or invalid number
                        if (string.IsNullOrEmpty(qNoText) || !int.TryParse(qNoText, out int qNo))
                        {
                            col += 7;
                            continue;
                        }

                        var qContent = worksheet.Cells[row, col + 1].Text?.Trim();
                        var optA = worksheet.Cells[row, col + 2].Text?.Trim();
                        var optB = worksheet.Cells[row, col + 3].Text?.Trim();
                        var optC = worksheet.Cells[row, col + 4].Text?.Trim();
                        var optD = worksheet.Cells[row, col + 5].Text?.Trim();
                        var correctOptText = worksheet.Cells[row, col + 6].Text?.Trim();
                        var correctOpt = string.IsNullOrEmpty(correctOptText) ? "A" : correctOptText.ToUpperInvariant();

                        var question = new Question
                        {
                            GroupId = group.Id,
                            QuestionNo = qNo,
                            Content = qContent ?? "",
                            CorrectOption = correctOpt,
                            QuestionType = "MCQ"
                        };
                        _efContext.Questions.Add(question);
                        await _efContext.SaveChangesAsync();

                        var answers = new List<Answer>
                {
                    new Answer { QuestionId = question.Id, Label = "A", Content = optA ?? "(A)" },
                    new Answer { QuestionId = question.Id, Label = "B", Content = optB ?? "(B)" },
                    new Answer { QuestionId = question.Id, Label = "C", Content = optC ?? "(C)" },
                    new Answer { QuestionId = question.Id, Label = "D", Content = optD ?? "(D)" }
                };
                        _efContext.Answers.AddRange(answers);
                        countQuestions++;
                        col += 7;
                    }
                }

                await _efContext.SaveChangesAsync();

                // Return thông báo rõ ràng cho Frontend biết bước tiếp theo
                return Ok(new
                {
                    message = $"Import dữ liệu thành công! Đã lưu {countGroups} nhóm hội thoại.",
                    nextStep = "Vui lòng bấm nút 'Generate Audio AI' để tạo file nghe."
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }




    }
}