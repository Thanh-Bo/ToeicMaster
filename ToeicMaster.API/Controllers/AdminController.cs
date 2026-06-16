using System.IO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;
using OfficeOpenXml;
using ToeicMaster.API.Data;
using ToeicMaster.API.Entities;
using ToeicMaster.API.Models.Admin;

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
        private readonly IDistributedCache _cache;
        private readonly BlobService _blobService;

        public AdminController(AppDbContext efContext, IDistributedCache cache, BlobService blobService)
        {
            _efContext = efContext;
            _cache = cache;
            _blobService = blobService;
        }

        // Helper method để xóa cache khi có thay đổi dữ liệu
        private async Task InvalidateTestCacheAsync(int testId)
        {
            string cacheKey = $"test_full_{testId}";
            await _cache.RemoveAsync(cacheKey);
        }

        // Helper method để tạo đường dẫn folder phân cấp theo năm
        // Ví dụ: "ets-2024-test-1" -> "ets-2024/ets-2024-test-1"
        // Ví dụ: "ets-2026-test-3" -> "ets-2026/ets-2026-test-3"
        private string GetHierarchicalTestFolderName(string testSlug)
        {
            if (string.IsNullOrEmpty(testSlug))
                return "unknown";

            // Extract year from slug like "ets-2024-test-1" or "ets-2026-test-10"
            // Pattern: look for "ets-YYYY" or "test-YYYY" etc.
            var match = System.Text.RegularExpressions.Regex.Match(testSlug, @"(ets|test)-(\d{4})", System.Text.RegularExpressions.RegexOptions.IgnoreCase);
            
            if (match.Success)
            {
                // Extract the year prefix (e.g., "ets-2024")
                string yearPrefix = match.Value;
                // Return hierarchical path: "ets-2024/ets-2024-test-1"
                return $"{yearPrefix}/{testSlug}";
            }

            // Fallback: if no year pattern found, just return the slug
            return testSlug;
        }

        // =============================================
        // IMPORT PART 5 - Incomplete Sentences
        // =============================================
        [HttpPost("import-part5")]
        public async Task<IActionResult> ImportReadingExcel(IFormFile file, [FromQuery] int testId)
        {
            // 1. Kiểm tra file
            if (file == null || file.Length == 0)
                return BadRequest("Chưa chọn file!");

            try
            {
                // Check if Test exists
                var test = await _efContext
                    .Tests.Include(t => t.Parts)
                        .ThenInclude(p => p.QuestionGroups)
                    .FirstOrDefaultAsync(t => t.Id == testId);

                if (test == null)
                    return NotFound("Không tìm thấy Test ID này. Hãy tạo Test trước!");

                // Check if Part 5 already exists - prevent reimporting
                var existingPart5 = test.Parts.FirstOrDefault(p => p.PartNumber == 5);
                if (existingPart5 != null)
                {
                    return BadRequest(new { error = $"Cannot import Part 5 to Test ID {testId} because it already has Part 5 data. Please delete the existing part first if you want to reimport." });
                }

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
                            if (string.IsNullOrEmpty(partStr))
                                continue; // Bỏ qua dòng trống

                            int partNum = int.Parse(partStr); // Cột 1: Part
                            int qNo = int.Parse(worksheet.Cells[row, 2].Value?.ToString() ?? "0"); // Cột 2: Số câu
                            string content = worksheet.Cells[row, 3].Value?.ToString() ?? ""; // Cột 3: Nội dung câu hỏi

                            // Cột 4,5,6,7: Đáp án A, B, C, D
                            string optA = worksheet.Cells[row, 4].Value?.ToString() ?? "";
                            string optB = worksheet.Cells[row, 5].Value?.ToString() ?? "";
                            string optC = worksheet.Cells[row, 6].Value?.ToString() ?? "";
                            string optD = worksheet.Cells[row, 7].Value?.ToString() ?? "";

                            string correctParams =
                                worksheet.Cells[row, 8].Value?.ToString()?.Trim().ToUpper() ?? "A"; // Cột 8: Đáp án đúng
                            string explain = worksheet.Cells[row, 9].Value?.ToString() ?? ""; // Cột 9: Giải thích

                            // --- LOGIC LƯU VÀO DB ---

                            // a. Tìm hoặc Tạo Part (Ví dụ Part 5)
                            var part = test.Parts.FirstOrDefault(p => p.PartNumber == partNum);
                            if (part == null)
                            {
                                part = new Part
                                {
                                    Name = $"Part {partNum}",
                                    PartNumber = partNum,
                                    TestId = test.Id,
                                };
                                test.Parts.Add(part);
                                await _efContext.SaveChangesAsync(); // Lưu để có ID Part
                            }

                            // b. Tạo Group (Part 5 mỗi câu 1 group, hoặc gom chung 1 group cũng được)
                            // Ở đây ta tạo 1 Group chung cho cả Part để tiết kiệm DB
                            var group = part.QuestionGroups.FirstOrDefault();
                            if (group == null)
                            {
                                group = new QuestionGroup
                                {
                                    PartId = part.Id,
                                    TextContent = "Incomplete Sentences",
                                };
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
                                ScoreWeight = 5,
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
                await InvalidateTestCacheAsync(testId);

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

            // Check if Part 6 already exists - prevent reimporting
            var existingPart = await _efContext.Parts.FirstOrDefaultAsync(p =>
                p.TestId == testId && p.PartNumber == 6
            );
            if (existingPart != null)
            {
                return BadRequest(new { error = $"Cannot import Part 6 to Test ID {testId} because it already has Part 6 data. Please delete the existing part first if you want to reimport." });
            }

            // Create Part 6 (Text Completion)
            var part = new Part
            {
                TestId = testId,
                Name = "Part 6: Text Completion",
                PartNumber = 6,
            };
            _efContext.Parts.Add(part);
            await _efContext.SaveChangesAsync();

            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            using (var stream = new MemoryStream())
            {
                await file.CopyToAsync(stream);
                using (var package = new ExcelPackage(stream))
                {
                    var worksheet = package.Workbook.Worksheets[0];
                    var rowCount = worksheet.Dimension.Rows;

                    // Biến để theo dõi Group hiện tại
                    int currentGroupId = 0;

                    for (int row = 2; row <= rowCount; row++)
                    {
                        var qNoText = worksheet.Cells[row, 2].Text?.Trim();
                        if (string.IsNullOrEmpty(qNoText)) continue; // Bỏ qua dòng trống

                        // NEW RULE: Non-empty Col A = start of a new group.
                        // Empty Col A = same group as previous row (no need to repeat passage).
                        var passageContent = worksheet.Cells[row, 1].Value?.ToString()?.Trim();

                        // --- LOGIC GOM NHÓM ---
                        if (!string.IsNullOrEmpty(passageContent) || currentGroupId == 0)
                        {
                            var newGroup = new QuestionGroup
                            {
                                PartId = part.Id,
                                TextContent = string.IsNullOrEmpty(passageContent) ? null : passageContent,
                                ImageUrl = null,
                                AudioUrl = null,
                            };
                            _efContext.QuestionGroups.Add(newGroup);
                            await _efContext.SaveChangesAsync(); // Lưu để lấy ID

                            currentGroupId = newGroup.Id;
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
                            Content = string.IsNullOrEmpty(questionContent)
                                ? $"Question {questionNo}"
                                : questionContent,
                            CorrectOption = correctOpt,
                            ShortExplanation = null,
                            FullExplanation = explanation,
                        };
                        _efContext.Questions.Add(question);
                        await _efContext.SaveChangesAsync();

                        // Lưu 4 đáp án
                        var answers = new List<Answer>
                        {
                            new Answer
                            {
                                QuestionId = question.Id,
                                Label = "A",
                                Content = worksheet.Cells[row, 4].Text,
                            },
                            new Answer
                            {
                                QuestionId = question.Id,
                                Label = "B",
                                Content = worksheet.Cells[row, 5].Text,
                            },
                            new Answer
                            {
                                QuestionId = question.Id,
                                Label = "C",
                                Content = worksheet.Cells[row, 6].Text,
                            },
                            new Answer
                            {
                                QuestionId = question.Id,
                                Label = "D",
                                Content = worksheet.Cells[row, 7].Text,
                            },
                        };
                        _efContext.Answers.AddRange(answers);
                    }
                    await _efContext.SaveChangesAsync();
                }
            }

            // Xóa cache để frontend nhận dữ liệu mới
            await InvalidateTestCacheAsync(testId);

            return Ok("Import Part 6 thành công!");
        }

        [HttpPost("import-part7")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> ImportPart7(
     [FromForm] IFormFile excelFile,
    [FromForm] List<IFormFile>? images,
    [FromQuery] int testId)
        {
            if (excelFile == null || excelFile.Length == 0)
                return BadRequest("Vui lòng upload file Excel.");

            var test = await _efContext.Tests.FindAsync(testId);
            if (test == null)
                return NotFound("Không tìm thấy Test.");

            string testFolderName = GetHierarchicalTestFolderName(test.Slug ?? $"test-{test.Id}");
            string imageFolderPath = $"images/{testFolderName}/part7";

            try
            {
                // Check if Part 7 already exists - prevent reimporting
                var existingPart = await _efContext.Parts.FirstOrDefaultAsync(p =>
                    p.TestId == testId && p.PartNumber == 7);
                if (existingPart != null)
                {
                    return BadRequest(new { error = $"Cannot import Part 7 to Test ID {testId} because it already has Part 7 data. Please delete the existing part first if you want to reimport." });
                }

                // Create Part 7
                var part = new Part
                {
                    TestId = testId,
                    Name = "Part 7: Reading Comprehension",
                    PartNumber = 7,
                };
                _efContext.Parts.Add(part);
                await _efContext.SaveChangesAsync();

                ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
                using var stream = new MemoryStream();
                await excelFile.CopyToAsync(stream);
                using var package = new ExcelPackage(stream);
                var worksheet = package.Workbook.Worksheets[0];
                int rowCount = worksheet.Dimension.Rows;

                // Cache để tránh upload cùng 1 ảnh nhiều lần
                var savedImages = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);

                int currentGroupId = 0;
                int countSuccess = 0;

                for (int row = 2; row <= rowCount; row++)
                {
                    var qNoText = worksheet.Cells[row, 2].Text?.Trim();
                    if (string.IsNullOrEmpty(qNoText)) continue;

                    // Read passage from col A. 
                    // NEW RULE: A non-empty value in col A signals the START of a new group.
                    // Empty col A means "same group as above" — no need to repeat the passage.
                    var passageRaw = worksheet.Cells[row, 1].Value?.ToString()?.Trim();

                    var content = worksheet.Cells[row, 3].Text?.Trim();
                    var imageName = worksheet.Cells[row, 10].Text?.Trim(); // Col J
                    var correctOpt = worksheet.Cells[row, 8].Text?.Trim().ToUpper(); // Col H
                    var explain = worksheet.Cells[row, 9].Text?.Trim(); // Col I

                    // 2. A non-empty passage column marks the start of a NEW group.
                    //    An empty passage column means this question belongs to the CURRENT group.
                    bool isNewGroup = !string.IsNullOrEmpty(passageRaw) || currentGroupId == 0;

                    if (isNewGroup)
                    {
                        // 3. Xử lý upload ảnh lên Azure nếu có
                        string? finalImageUrl = null;
                        if (!string.IsNullOrEmpty(imageName))
                        {
                            if (savedImages.ContainsKey(imageName))
                            {
                                // Ảnh đã upload trước đó → dùng lại URL
                                finalImageUrl = savedImages[imageName];
                            }
                            else
                            {
                                // Tìm file trong danh sách upload
                                var imgFile = images?.FirstOrDefault(f =>
                                    Path.GetFileName(f.FileName)
                                        .Equals(imageName, StringComparison.OrdinalIgnoreCase));

                                if (imgFile != null)
                                {
                                    finalImageUrl = await _blobService.UploadFileAsync(
                                        imgFile,
                                        imageFolderPath);
                                    savedImages[imageName] = finalImageUrl;
                                }
                                else
                                {
                                    // Excel khai báo ảnh nhưng không upload file → báo lỗi rõ ràng
                                    return BadRequest(
                                        $"Lỗi: Excel yêu cầu ảnh '{imageName}' " +
                                        $"nhưng không tìm thấy file này trong danh sách upload.");
                                }
                            }
                        }

                        // Store passage as HTML (keep <br> tags for the frontend to render)
                        var passageHtml = string.IsNullOrEmpty(passageRaw) ? null : passageRaw;

                        // 4. Tạo QuestionGroup mới
                        var newGroup = new QuestionGroup
                        {
                            PartId = part.Id,
                            TextContent = passageHtml,
                            ImageUrl = finalImageUrl,
                            AudioUrl = null,
                        };
                        _efContext.QuestionGroups.Add(newGroup);
                        await _efContext.SaveChangesAsync();

                        currentGroupId = newGroup.Id;
                    }

                    // 5. Tạo Question
                    var question = new Question
                    {
                        GroupId = currentGroupId,
                        QuestionNo = int.Parse(qNoText),
                        Content = string.IsNullOrEmpty(content) ? $"Question {qNoText}" : content,
                        CorrectOption = correctOpt,
                        FullExplanation = explain,
                        ShortExplanation = null,
                    };
                    _efContext.Questions.Add(question);
                    await _efContext.SaveChangesAsync();

                    // 6. Tạo 4 đáp án
                    _efContext.Answers.AddRange(new List<Answer>
            {
                new Answer { QuestionId = question.Id, Label = "A", Content = worksheet.Cells[row, 4].Text },
                new Answer { QuestionId = question.Id, Label = "B", Content = worksheet.Cells[row, 5].Text },
                new Answer { QuestionId = question.Id, Label = "C", Content = worksheet.Cells[row, 6].Text },
                new Answer { QuestionId = question.Id, Label = "D", Content = worksheet.Cells[row, 7].Text },
            });

                    countSuccess++;
                }

                await _efContext.SaveChangesAsync();
                await InvalidateTestCacheAsync(testId);

                return Ok(new
                {
                    message = $"Import Part 7 thành công! Đã nhập {countSuccess} câu hỏi.",
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
        [HttpPost("import-part1-data-only")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> ImportPart1DataOnly(
            IFormFile excelFile,
            List<IFormFile>? images,
            List<IFormFile>? audios,
            [FromQuery] int testId
        )
        {
            if (excelFile == null || excelFile.Length == 0)
                return BadRequest("Vui lòng upload file Excel.");

            var test = await _efContext.Tests.FindAsync(testId);
            if (test == null)
                return NotFound("Không tìm thấy Test.");

            string testFolderName = GetHierarchicalTestFolderName(test.Slug ?? $"test-{test.Id}");
            string audioFolderPath = $"audios/{testFolderName}/part1";
            string imageFolderPath = $"images/{testFolderName}/part1";

            try
            {
                // 1. Check if Part 1 already exists - prevent reimporting
                var existingPart = await _efContext.Parts.FirstOrDefaultAsync(p =>
                    p.TestId == testId && p.PartNumber == 1
                );
                if (existingPart != null)
                {
                    return BadRequest(new { error = $"Cannot import Part 1 to Test ID {testId} because it already has Part 1 data. Please delete the existing part first if you want to reimport." });
                }

                // Create Part 1
                var part = new Part
                {
                    Name = "Part 1: Photographs",
                    PartNumber = 1,
                    TestId = testId,
                };
                _efContext.Parts.Add(part);
                await _efContext.SaveChangesAsync();

                ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
                using var stream = new MemoryStream();
                await excelFile.CopyToAsync(stream);
                using var package = new ExcelPackage(stream);
                var worksheet = package.Workbook.Worksheets[0];
                int rowCount = worksheet.Dimension.Rows;

                var savedImages = new Dictionary<string, string>(); // Lưu ảnh
                var savedAudios = new Dictionary<string, string>(); // Lưu audio
                int countSuccess = 0;

                for (int row = 2; row <= rowCount; row++)
                {
                    var qNoText = worksheet.Cells[row, 1].Text?.Trim(); // Col A
                    if (string.IsNullOrEmpty(qNoText))
                        continue;

                    var qNo = int.Parse(qNoText);
                    var imgName = worksheet.Cells[row, 2].Text?.Trim(); // Col B - Image
                    var transcript = worksheet.Cells[row, 3].Text?.Trim(); // Col C - Transcript (4 options)
                    var correctOpt = worksheet.Cells[row, 4].Text?.Trim().ToUpper(); // Col D - Answer
                    var audioName = worksheet.Cells[row, 5].Text?.Trim(); // Col E - Audio File

                    // --- XỬ LÝ ẢNH ---
                    string? finalImageUrl = null;
                    if (!string.IsNullOrEmpty(imgName))
                    {
                        if (savedImages.ContainsKey(imgName))
                            finalImageUrl = savedImages[imgName];
                        else
                        {
                            var imgFile = images?.FirstOrDefault(f =>
                                Path.GetFileName(f.FileName)
                                    .Equals(imgName, StringComparison.OrdinalIgnoreCase)
                            );
                            if (imgFile != null)
                            {
                                finalImageUrl = await _blobService.UploadFileAsync(
                                    imgFile,
                                    imageFolderPath
                                );
                                savedImages[imgName] = finalImageUrl;
                            }
                            else
                            {
                                // 🚨 ADD THIS: Fails the request if the filename doesn't match
                                return BadRequest($"Lỗi: Excel yêu cầu ảnh '{imgName}' nhưng không tìm thấy file này trong danh sách upload.");
                            }
                        }
                    }

                    // --- XỬ LÝ AUDIO ---
                    string? finalAudioUrl = null;
                    if (!string.IsNullOrEmpty(audioName))
                    {
                        if (savedAudios.ContainsKey(audioName))
                            finalAudioUrl = savedAudios[audioName];
                        else
                        {
                            var audioFile = audios?.FirstOrDefault(f =>
                                Path.GetFileName(f.FileName)
                                    .Equals(audioName, StringComparison.OrdinalIgnoreCase)
                            );
                            if (audioFile != null)
                            {
                                finalAudioUrl = await _blobService.UploadFileAsync(
                                    audioFile,
                                    audioFolderPath
                                );
                                savedAudios[audioName] = finalAudioUrl;
                            }
                            else
                            {
                                // 🚨 ADD THIS: Fails the request if the filename doesn't match
                                return BadRequest($"Lỗi: Excel yêu cầu audio '{audioName}' nhưng không tìm thấy file này trong danh sách upload.");
                            }
                        }
                    }

                    // --- LƯU DATABASE ---
                    var group = new QuestionGroup
                    {
                        PartId = part.Id,
                        ImageUrl = finalImageUrl,
                        AudioUrl = finalAudioUrl, // AUDIO URL
                        Transcript = transcript,
                        TextContent = null,
                    };
                    _efContext.QuestionGroups.Add(group);
                    await _efContext.SaveChangesAsync();

                    var question = new Question
                    {
                        GroupId = group.Id,
                        QuestionNo = qNo,
                        Content = "Look at the picture and listen to the statements.",
                        CorrectOption = correctOpt,
                        QuestionType = "MCQ",
                    };
                    _efContext.Questions.Add(question);
                    await _efContext.SaveChangesAsync();

                    // Tạo 4 đáp án (Label A, B, C, D)
                    var answers = new List<Answer>
                    {
                        new Answer
                        {
                            QuestionId = question.Id,
                            Label = "A",
                            Content = "(A)",
                        },
                        new Answer
                        {
                            QuestionId = question.Id,
                            Label = "B",
                            Content = "(B)",
                        },
                        new Answer
                        {
                            QuestionId = question.Id,
                            Label = "C",
                            Content = "(C)",
                        },
                        new Answer
                        {
                            QuestionId = question.Id,
                            Label = "D",
                            Content = "(D)",
                        },
                    };
                    _efContext.Answers.AddRange(answers);
                    countSuccess++;
                }

                await _efContext.SaveChangesAsync();
                await InvalidateTestCacheAsync(testId);

                return Ok(
                    new
                    {
                        message = $"Import Part 1 thành công! Đã nhập {countSuccess} câu hỏi với âm thanh.",
                    }
                );
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
            IFormFile excelFile,
            List<IFormFile>? audios,
            [FromQuery] int testId
        )
        {
            if (excelFile == null || excelFile.Length == 0)
                return BadRequest("Vui lòng upload file Excel.");

            var test = await _efContext.Tests.FindAsync(testId);
            if (test == null)
                return NotFound("Không tìm thấy Test.");

            string testFolderName = GetHierarchicalTestFolderName(test.Slug ?? $"test-{test.Id}");
            string audioFolderPath = $"audios/{testFolderName}/part2";

            try
            {
                // Check if Part 2 already exists - prevent reimporting
                var existingPart = await _efContext.Parts.FirstOrDefaultAsync(p =>
                    p.TestId == testId && p.PartNumber == 2
                );
                if (existingPart != null)
                {
                    return BadRequest(new { error = $"Cannot import Part 2 to Test ID {testId} because it already has Part 2 data. Please delete the existing part first if you want to reimport." });
                }

                // Create Part 2
                var part = new Part
                {
                    Name = "Part 2: Question-Response",
                    PartNumber = 2,
                    TestId = testId,
                };
                _efContext.Parts.Add(part);
                await _efContext.SaveChangesAsync();

                ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
                using var stream = new MemoryStream();
                await excelFile.CopyToAsync(stream);
                using var package = new ExcelPackage(stream);
                var worksheet = package.Workbook.Worksheets[0];
                int rowCount = worksheet.Dimension.Rows;
                var savedAudios = new Dictionary<string, string>();
                int countSuccess = 0;

                for (int row = 2; row <= rowCount; row++)
                {
                    var qNoText = worksheet.Cells[row, 1].Text?.Trim(); // Col A
                    if (string.IsNullOrEmpty(qNoText))
                        continue;

                    var qNo = int.Parse(qNoText);
                    var transcript = worksheet.Cells[row, 2].Text?.Trim(); // Col B - Transcript
                    var correctOpt = worksheet.Cells[row, 3].Text?.Trim().ToUpper(); // Col C - Answer
                    var audioName = worksheet.Cells[row, 4].Text?.Trim(); // Col D - Audio File (NEW)

                    // --- XỰ LÝ AUDIO ---
                    string? finalAudioUrl = null;
                    if (!string.IsNullOrEmpty(audioName))
                    {
                        if (savedAudios.ContainsKey(audioName))
                            finalAudioUrl = savedAudios[audioName];
                        else
                        {
                            var audioFile = audios?.FirstOrDefault(f =>
                                Path.GetFileName(f.FileName)
                                    .Equals(audioName, StringComparison.OrdinalIgnoreCase)
                            );
                            if (audioFile != null)
                            {
                                finalAudioUrl = await _blobService.UploadFileAsync(
                                    audioFile,
                                    audioFolderPath
                                );
                                savedAudios[audioName] = finalAudioUrl;
                            }
                            else
                            {
                                // 🚨 ADD THIS: Fails the request if the filename doesn't match
                                return BadRequest($"Lỗi: Excel yêu cầu audio '{audioName}' nhưng không tìm thấy file này trong danh sách upload.");
                            }
                        }
                    }

                    // --- LƯU DATABASE ---
                    var group = new QuestionGroup
                    {
                        PartId = part.Id,
                        AudioUrl = finalAudioUrl, // AUDIO URL
                        Transcript = transcript, // Lưu Question + Answers text
                        ImageUrl = null,
                        TextContent = null,
                    };
                    _efContext.QuestionGroups.Add(group);
                    await _efContext.SaveChangesAsync();

                    var question = new Question
                    {
                        GroupId = group.Id,
                        QuestionNo = qNo,
                        Content = "Listen to the question and choose the best response.",
                        CorrectOption = correctOpt,
                        QuestionType = "MCQ",
                    };
                    _efContext.Questions.Add(question);
                    await _efContext.SaveChangesAsync();

                    // Part 2 chỉ có 3 đáp án A, B, C
                    var answers = new List<Answer>
                    {
                        new Answer
                        {
                            QuestionId = question.Id,
                            Label = "A",
                            Content = "(A)",
                        },
                        new Answer
                        {
                            QuestionId = question.Id,
                            Label = "B",
                            Content = "(B)",
                        },
                        new Answer
                        {
                            QuestionId = question.Id,
                            Label = "C",
                            Content = "(C)",
                        },
                    };
                    _efContext.Answers.AddRange(answers);
                    countSuccess++;
                }

                await _efContext.SaveChangesAsync();
                await InvalidateTestCacheAsync(testId);

                return Ok(
                    new
                    {
                        message = $"Import Part 2 thành công! Đã nhập {countSuccess} câu hỏi với âm thanh.",
                        nextStep = "Dữ liệu âm thanh đã được lưu thành công.",
                    }
                );
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
            IFormFile excelFile,
            List<IFormFile>? images,
            List<IFormFile>? audios,
            [FromQuery] int testId
        )
        {
            if (excelFile == null || excelFile.Length == 0)
                return BadRequest("Vui lòng upload file Excel.");

            var test = await _efContext.Tests.FindAsync(testId);
            if (test == null)
                return NotFound("Không tìm thấy Test với ID này.");

            string testFolderName = GetHierarchicalTestFolderName(test.Slug ?? $"test-{test.Id}");
            string audioFolderPath = $"audios/{testFolderName}/part3";
            string imageFolderPath = $"images/{testFolderName}/part3";

            try
            {
                // Check if Part 3 already exists - prevent reimporting
                var existingPart = await _efContext.Parts.FirstOrDefaultAsync(p =>
                    p.TestId == testId && p.PartNumber == 3
                );
                if (existingPart != null)
                {
                    return BadRequest(new { error = $"Cannot import Part 3 to Test ID {testId} because it already has Part 3 data. Please delete the existing part first if you want to reimport." });
                }

                // Create Part 3
                var part = new Part
                {
                    Name = "Part 3: Conversations",
                    PartNumber = 3,
                    TestId = testId,
                };
                _efContext.Parts.Add(part);
                await _efContext.SaveChangesAsync();

                ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
                using var stream = new MemoryStream();
                await excelFile.CopyToAsync(stream);
                using var package = new ExcelPackage(stream);
                var worksheet = package.Workbook.Worksheets[0];
                int rowCount = worksheet.Dimension.Rows;

                var savedImages = new Dictionary<string, string>();
                var savedAudios = new Dictionary<string, string>();
                int countGroups = 0;
                int countQuestions = 0;

                for (int row = 2; row <= rowCount; row++)
                {
                    var groupNoText = worksheet.Cells[row, 1].Text?.Trim();
                    if (string.IsNullOrEmpty(groupNoText))
                        continue;

                    var imageName = worksheet.Cells[row, 2].Text?.Trim(); // Col B (2)
                    var transcript = worksheet.Cells[row, 3].Text?.Trim(); // Col C (3)
                    var audioName = worksheet.Cells[row, 4].Text?.Trim(); // Col D (4) - Audio File (NEW)

                    string? finalImageUrl = null;

                    // Process image if provided
                    if (!string.IsNullOrEmpty(imageName))
                    {
                        if (savedImages.ContainsKey(imageName))
                            finalImageUrl = savedImages[imageName];
                        else
                        {
                            var imgFile = images?.FirstOrDefault(f =>
                                Path.GetFileName(f.FileName)
                                    .Equals(imageName, StringComparison.OrdinalIgnoreCase)
                            );

                            if (imgFile != null)
                            {
                                finalImageUrl = await _blobService.UploadFileAsync(
                                    imgFile,
                                    imageFolderPath
                                );
                                savedImages[imageName] = finalImageUrl;
                            }
                            else
                            {
                                // 🚨 ADD THIS: Fails the request if the filename doesn't match
                                return BadRequest($"Lỗi: Excel yêu cầu ảnh '{imageName}' nhưng không tìm thấy file này trong danh sách upload.");
                            }
                        }
                    }

                    // --- XỬ LÝ AUDIO ---
                    string? finalAudioUrl = null;
                    if (!string.IsNullOrEmpty(audioName))
                    {
                        if (savedAudios.ContainsKey(audioName))
                            finalAudioUrl = savedAudios[audioName];
                        else
                        {
                            var audioFile = audios?.FirstOrDefault(f =>
                                Path.GetFileName(f.FileName)
                                    .Equals(audioName, StringComparison.OrdinalIgnoreCase)
                            );
                            if (audioFile != null)
                            {
                                finalAudioUrl = await _blobService.UploadFileAsync(
                                    audioFile,
                                    audioFolderPath
                                );
                                savedAudios[audioName] = finalAudioUrl;
                            }
                            else
                            {
                                // 🚨 ADD THIS: Fails the request if the filename doesn't match
                                return BadRequest($"Lỗi: Excel yêu cầu audio '{audioName}' nhưng không tìm thấy file này trong danh sách upload.");
                            }
                        }
                    }

                    // Create QuestionGroup regardless of image/audio
                    var group = new QuestionGroup
                    {
                        PartId = part.Id,
                        Transcript = transcript,
                        AudioUrl = finalAudioUrl,
                        ImageUrl = finalImageUrl,
                        TextContent = null,
                    };

                    _efContext.QuestionGroups.Add(group);
                    await _efContext.SaveChangesAsync();
                    countGroups++;

                    // Lưu 3 câu hỏi - CỘT BẮT ĐẦU TỪ 5 (E)
                    int col = 5; // E = Q1 No (shifted because audio is now in Col D)
                    for (int q = 0; q < 3; q++)
                    {
                        var qNoText = worksheet.Cells[row, col].Text?.Trim();

                        // Skip if no question number
                        if (string.IsNullOrEmpty(qNoText) || !int.TryParse(qNoText, out int qNo))
                        {
                            col += 7;
                            continue;
                        }

                        var qContent = worksheet.Cells[row, col + 1].Text?.Trim(); // E
                        var optA = worksheet.Cells[row, col + 2].Text?.Trim(); // F
                        var optB = worksheet.Cells[row, col + 3].Text?.Trim(); // G
                        var optC = worksheet.Cells[row, col + 4].Text?.Trim(); // H
                        var optD = worksheet.Cells[row, col + 5].Text?.Trim(); // I
                        var correctOptText = worksheet.Cells[row, col + 6].Text?.Trim();
                        var correctOpt = string.IsNullOrEmpty(correctOptText)
                            ? "A"
                            : correctOptText.ToUpperInvariant();

                        var question = new Question
                        {
                            GroupId = group.Id,
                            QuestionNo = qNo,
                            Content = qContent ?? "",
                            CorrectOption = correctOpt,
                            QuestionType = "MCQ",
                        };
                        _efContext.Questions.Add(question);
                        await _efContext.SaveChangesAsync();

                        var answers = new List<Answer>
                        {
                            new Answer
                            {
                                QuestionId = question.Id,
                                Label = "A",
                                Content = optA ?? "(A)",
                            },
                            new Answer
                            {
                                QuestionId = question.Id,
                                Label = "B",
                                Content = optB ?? "(B)",
                            },
                            new Answer
                            {
                                QuestionId = question.Id,
                                Label = "C",
                                Content = optC ?? "(C)",
                            },
                            new Answer
                            {
                                QuestionId = question.Id,
                                Label = "D",
                                Content = optD ?? "(D)",
                            },
                        };
                        _efContext.Answers.AddRange(answers);
                        countQuestions++;
                        col += 7;
                    }

                    await _efContext.SaveChangesAsync();
                }

                return Ok(
                    new
                    {
                        message = "Import Part 3 thành công",
                        countGroups,
                        countQuestions,
                    }
                );
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
            IFormFile excelFile,
            List<IFormFile>? images,
            List<IFormFile>? audios,
            [FromQuery] int testId
        )
        {
            if (excelFile == null || excelFile.Length == 0)
                return BadRequest("Vui lòng upload file Excel.");

            var test = await _efContext.Tests.FindAsync(testId);
            if (test == null)
                return NotFound("Không tìm thấy Test với ID này.");

            string testFolderName = GetHierarchicalTestFolderName(test.Slug ?? $"test-{test.Id}");
            string audioFolderPath = $"audios/{testFolderName}/part4";
            string imageFolderPath = $"images/{testFolderName}/part4";

            try
            {
                // Check if Part 4 already exists - prevent reimporting
                var existingPart = await _efContext.Parts.FirstOrDefaultAsync(p =>
                    p.TestId == testId && p.PartNumber == 4
                );
                if (existingPart != null)
                {
                    return BadRequest(new { error = $"Cannot import Part 4 to Test ID {testId} because it already has Part 4 data. Please delete the existing part first if you want to reimport." });
                }

                // Create Part 4
                var part = new Part
                {
                    Name = "Part 4: Talks",
                    PartNumber = 4,
                    TestId = testId,
                };
                _efContext.Parts.Add(part);
                await _efContext.SaveChangesAsync();

                ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
                using var stream = new MemoryStream();
                await excelFile.CopyToAsync(stream);
                using var package = new ExcelPackage(stream);
                var worksheet = package.Workbook.Worksheets[0];
                int rowCount = worksheet.Dimension.Rows;

                var savedImages = new Dictionary<string, string>();
                var savedAudios = new Dictionary<string, string>();
                int countGroups = 0;
                int countQuestions = 0;

                // Loop qua Excel
                for (int row = 2; row <= rowCount; row++)
                {
                    var groupNoText = worksheet.Cells[row, 1].Text?.Trim(); // Col A - GroupNo
                    if (string.IsNullOrEmpty(groupNoText))
                        continue;

                    var imageName = worksheet.Cells[row, 2].Text?.Trim(); // Col B - Image
                    var transcript = worksheet.Cells[row, 3].Text?.Trim(); // Col C - Transcript
                    var audioName = worksheet.Cells[row, 4].Text?.Trim(); // Col D - Audio File (NEW)

                    // Câu hỏi bắt đầu từ Col E (5)

                    // Xử lý Image
                    string? finalImageUrl = null;
                    if (!string.IsNullOrEmpty(imageName))
                    {
                        if (savedImages.ContainsKey(imageName))
                            finalImageUrl = savedImages[imageName];
                        else
                        {
                            var imgFile = images?.FirstOrDefault(f =>
                                Path.GetFileName(f.FileName)
                                    .Equals(imageName, StringComparison.OrdinalIgnoreCase)
                            );

                            if (imgFile != null)
                            {
                                finalImageUrl = await _blobService.UploadFileAsync(
                                    imgFile,
                                    imageFolderPath
                                );
                                savedImages[imageName] = finalImageUrl;
                            }
                            else
                            {
                                // 🚨 ADD THIS: Fails the request if the filename doesn't match
                                return BadRequest($"Lỗi: Excel yêu cầu ảnh '{imageName}' nhưng không tìm thấy file này trong danh sách upload.");
                            }
                        }
                    }

                    // --- XỬ LÝ AUDIO ---
                    string? finalAudioUrl = null;
                    if (!string.IsNullOrEmpty(audioName))
                    {
                        if (savedAudios.ContainsKey(audioName))
                            finalAudioUrl = savedAudios[audioName];
                        else
                        {
                            var audioFile = audios?.FirstOrDefault(f =>
                                Path.GetFileName(f.FileName)
                                    .Equals(audioName, StringComparison.OrdinalIgnoreCase)
                            );
                            if (audioFile != null)
                            {
                                finalAudioUrl = await _blobService.UploadFileAsync(
                                    audioFile,
                                    audioFolderPath
                                );
                                savedAudios[audioName] = finalAudioUrl;
                            }
                            else
                            {
                                // 🚨 ADD THIS: Fails the request if the filename doesn't match
                                return BadRequest($"Lỗi: Excel yêu cầu audio '{audioName}' nhưng không tìm thấy file này trong danh sách upload.");
                            }
                        }
                    }

                    // --- LƯU VÀO DB ---
                    var group = new QuestionGroup
                    {
                        PartId = part.Id,
                        Transcript = transcript,
                        AudioUrl = finalAudioUrl, // AUDIO URL
                        ImageUrl = finalImageUrl,
                        TextContent = null,
                    };

                    _efContext.QuestionGroups.Add(group);
                    await _efContext.SaveChangesAsync();
                    countGroups++;

                    // Lưu 3 câu hỏi - CỘT BẮT ĐẦU TỪ 5 (E) - GIỐNG PART 3
                    int col = 5; // E = Q1 No (shifted because audio is now in Col D)
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
                        var correctOpt = string.IsNullOrEmpty(correctOptText)
                            ? "A"
                            : correctOptText.ToUpperInvariant();

                        var question = new Question
                        {
                            GroupId = group.Id,
                            QuestionNo = qNo,
                            Content = qContent ?? "",
                            CorrectOption = correctOpt,
                            QuestionType = "MCQ",
                        };
                        _efContext.Questions.Add(question);
                        await _efContext.SaveChangesAsync();

                        var answers = new List<Answer>
                        {
                            new Answer
                            {
                                QuestionId = question.Id,
                                Label = "A",
                                Content = optA ?? "(A)",
                            },
                            new Answer
                            {
                                QuestionId = question.Id,
                                Label = "B",
                                Content = optB ?? "(B)",
                            },
                            new Answer
                            {
                                QuestionId = question.Id,
                                Label = "C",
                                Content = optC ?? "(C)",
                            },
                            new Answer
                            {
                                QuestionId = question.Id,
                                Label = "D",
                                Content = optD ?? "(D)",
                            },
                        };
                        _efContext.Answers.AddRange(answers);
                        countQuestions++;
                        col += 7;
                    }
                }

                await _efContext.SaveChangesAsync();

                // Return thông báo rõ ràng cho Frontend biết bước tiếp theo
                return Ok(new { message = "Import dữ liệu thành công!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }
}
