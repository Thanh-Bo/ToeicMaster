using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using ToeicMaster.API.Data;

namespace ToeicMaster.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class StatisticsController : ControllerBase
{
    private readonly AppDbContext _context;

    public StatisticsController(AppDbContext context)
    {
        _context = context;
    }

    private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    /// <summary>
    /// Dashboard thống kê tổng quan
    /// </summary>
    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboard()
    {
        var userId = GetUserId();

        // Thống kê bài thi
        var testStats = await _context.TestAttempts
            .Where(ta => ta.UserId == userId)
            .GroupBy(ta => 1)
            .Select(g => new
            {
                TotalTests = g.Count(),
                AverageScore = g.Average(ta => ta.TotalScore),
                BestScore = g.Max(ta => ta.TotalScore),
                TotalListening = g.Average(ta => ta.ListeningScore ?? 0),
                TotalReading = g.Average(ta => ta.ReadingScore ?? 0)
            })
            .FirstOrDefaultAsync();

        // Thống kê practice
        var practiceStats = await _context.PracticeSessions
            .Where(ps => ps.UserId == userId && ps.Status == "completed")
            .GroupBy(ps => 1)
            .Select(g => new
            {
                TotalSessions = g.Count(),
                TotalQuestions = g.Sum(ps => ps.TotalQuestions),
                TotalCorrect = g.Sum(ps => ps.CorrectAnswers),
                TotalTime = g.Sum(ps => ps.TimeSpentSeconds)
            })
            .FirstOrDefaultAsync();

        // Bookmarks count
        var bookmarksCount = await _context.Bookmarks
            .CountAsync(b => b.UserId == userId);

        // Vocabulary stats
        var vocabStats = await _context.UserVocabularies
            .Where(uv => uv.UserId == userId)
            .GroupBy(uv => 1)
            .Select(g => new
            {
                TotalLearned = g.Count(),
                Mastered = g.Count(uv => uv.Status == 3)
            })
            .FirstOrDefaultAsync();

        // Recent activity (7 ngày gần nhất)
        var sevenDaysAgo = DateTime.UtcNow.AddDays(-7);
        var recentTests = await _context.TestAttempts
            .CountAsync(ta => ta.UserId == userId && ta.CompletedAt >= sevenDaysAgo);
        var recentPractice = await _context.PracticeSessions
            .CountAsync(ps => ps.UserId == userId && ps.CompletedAt >= sevenDaysAgo);

        return Ok(new
        {
            tests = new
            {
                total = testStats?.TotalTests ?? 0,
                averageScore = Math.Round(testStats?.AverageScore ?? 0),
                bestScore = testStats?.BestScore ?? 0,
                avgListening = Math.Round(testStats?.TotalListening ?? 0),
                avgReading = Math.Round(testStats?.TotalReading ?? 0)
            },
            practice = new
            {
                totalSessions = practiceStats?.TotalSessions ?? 0,
                totalQuestions = practiceStats?.TotalQuestions ?? 0,
                totalCorrect = practiceStats?.TotalCorrect ?? 0,
                accuracy = practiceStats?.TotalQuestions > 0 
                    ? Math.Round((double)(practiceStats?.TotalCorrect ?? 0) / (practiceStats?.TotalQuestions ?? 1) * 100, 1) 
                    : 0,
                totalTimeMinutes = Math.Round((practiceStats?.TotalTime ?? 0) / 60.0, 1)
            },
            bookmarks = bookmarksCount,
            vocabulary = new
            {
                learned = vocabStats?.TotalLearned ?? 0,
                mastered = vocabStats?.Mastered ?? 0
            },
            recentActivity = new
            {
                testsLast7Days = recentTests,
                practiceLast7Days = recentPractice
            }
        });
    }

    /// <summary>
    /// Thống kê theo từng Part (điểm mạnh/yếu)
    /// </summary>
    [HttpGet("parts-analysis")]
    public async Task<IActionResult> GetPartsAnalysis()
    {
        var userId = GetUserId();

        // Lấy tất cả answers của user trong các bài thi
        var testAnswers = await _context.UserAnswers
            .Where(ua => ua.Attempt.UserId == userId)
            .Include(ua => ua.Question)
                .ThenInclude(q => q.Group)
                    .ThenInclude(g => g.Part)
            .GroupBy(ua => ua.Question.Group.Part.PartNumber)
            .Select(g => new
            {
                PartNumber = g.Key,
                Total = g.Count(),
                Correct = g.Count(ua => ua.IsCorrect)
            })
            .ToListAsync();

        // Lấy practice stats
        var practiceAnswers = await _context.PracticeAnswers
            .Where(pa => pa.Session.UserId == userId)
            .Include(pa => pa.Session)
            .GroupBy(pa => pa.Session.PartNumber)
            .Select(g => new
            {
                PartNumber = g.Key,
                Total = g.Count(),
                Correct = g.Count(pa => pa.IsCorrect)
            })
            .ToListAsync();

        var parts = new[]
        {
            new { PartNumber = 1, Name = "Part 1: Photographs", Type = "listening" },
            new { PartNumber = 2, Name = "Part 2: Question-Response", Type = "listening" },
            new { PartNumber = 3, Name = "Part 3: Conversations", Type = "listening" },
            new { PartNumber = 4, Name = "Part 4: Short Talks", Type = "listening" },
            new { PartNumber = 5, Name = "Part 5: Incomplete Sentences", Type = "reading" },
            new { PartNumber = 6, Name = "Part 6: Text Completion", Type = "reading" },
            new { PartNumber = 7, Name = "Part 7: Reading Comprehension", Type = "reading" }
        };

        var result = parts.Select(p =>
        {
            var testStat = testAnswers.FirstOrDefault(t => t.PartNumber == p.PartNumber);
            var practiceStat = practiceAnswers.FirstOrDefault(pr => pr.PartNumber == p.PartNumber);
            
            var totalQuestions = (testStat?.Total ?? 0) + (practiceStat?.Total ?? 0);
            var totalCorrect = (testStat?.Correct ?? 0) + (practiceStat?.Correct ?? 0);
            var accuracy = totalQuestions > 0 ? Math.Round((double)totalCorrect / totalQuestions * 100, 1) : 0;

            // Đánh giá level
            string level;
            if (totalQuestions < 10) level = "Chưa đủ dữ liệu";
            else if (accuracy >= 90) level = "Xuất sắc";
            else if (accuracy >= 75) level = "Tốt";
            else if (accuracy >= 60) level = "Khá";
            else if (accuracy >= 40) level = "Trung bình";
            else level = "Cần cải thiện";

            return new
            {
                p.PartNumber,
                p.Name,
                p.Type,
                TotalQuestions = totalQuestions,
                CorrectAnswers = totalCorrect,
                Accuracy = accuracy,
                Level = level,
                TestQuestions = testStat?.Total ?? 0,
                PracticeQuestions = practiceStat?.Total ?? 0
            };
        });

        // Điểm mạnh/yếu
        var dataWithEnough = result.Where(r => r.TotalQuestions >= 10).ToList();
        var strengths = dataWithEnough.OrderByDescending(r => r.Accuracy).Take(2).Select(r => r.Name);
        var weaknesses = dataWithEnough.OrderBy(r => r.Accuracy).Take(2).Select(r => r.Name);

        return Ok(new
        {
            parts = result,
            strengths,
            weaknesses
        });
    }

    /// <summary>
    /// Biểu đồ tiến bộ theo thời gian
    /// </summary>
    [HttpGet("progress")]
    public async Task<IActionResult> GetProgressChart([FromQuery] int days = 30)
    {
        var userId = GetUserId();
        var startDate = DateTime.UtcNow.AddDays(-days).Date;

        // Điểm các bài thi theo ngày
        var testScores = await _context.TestAttempts
            .Where(ta => ta.UserId == userId && ta.CompletedAt >= startDate)
            .OrderBy(ta => ta.CompletedAt)
            .Select(ta => new
            {
                Date = ta.CompletedAt.Date,
                ta.TotalScore,
                ta.ListeningScore,
                ta.ReadingScore
            })
            .ToListAsync();

        // Practice accuracy theo ngày
        var practiceData = await _context.PracticeSessions
            .Where(ps => ps.UserId == userId && ps.Status == "completed" && ps.CompletedAt >= startDate)
            .GroupBy(ps => ps.CompletedAt!.Value.Date)
            .Select(g => new
            {
                Date = g.Key,
                Questions = g.Sum(ps => ps.TotalQuestions),
                Correct = g.Sum(ps => ps.CorrectAnswers)
            })
            .ToListAsync();

        // Tạo data cho chart
        var chartData = new List<object>();
        for (var date = startDate; date <= DateTime.UtcNow.Date; date = date.AddDays(1))
        {
            var testScore = testScores.FirstOrDefault(t => t.Date == date);
            var practice = practiceData.FirstOrDefault(p => p.Date == date);

            chartData.Add(new
            {
                Date = date.ToString("yyyy-MM-dd"),
                TestScore = testScore?.TotalScore,
                ListeningScore = testScore?.ListeningScore,
                ReadingScore = testScore?.ReadingScore,
                PracticeAccuracy = practice?.Questions > 0 
                    ? Math.Round((double)practice.Correct / practice.Questions * 100, 1) 
                    : (double?)null,
                PracticeQuestions = practice?.Questions ?? 0
            });
        }

        // Tính trend (so sánh tuần này vs tuần trước)
        var lastWeek = DateTime.UtcNow.AddDays(-7);
        var twoWeeksAgo = DateTime.UtcNow.AddDays(-14);

        var thisWeekAvg = testScores.Where(t => t.Date >= lastWeek).Select(t => t.TotalScore).DefaultIfEmpty(0).Average();
        var lastWeekAvg = testScores.Where(t => t.Date >= twoWeeksAgo && t.Date < lastWeek).Select(t => t.TotalScore).DefaultIfEmpty(0).Average();

        var trend = thisWeekAvg - lastWeekAvg;

        return Ok(new
        {
            chartData,
            summary = new
            {
                TotalTests = testScores.Count,
                AverageScore = testScores.Any() ? Math.Round(testScores.Average(t => t.TotalScore)) : 0,
                BestScore = testScores.Any() ? testScores.Max(t => t.TotalScore) : 0,
                Trend = Math.Round(trend),
                TrendDirection = trend > 0 ? "up" : trend < 0 ? "down" : "stable"
            }
        });
    }

    /// <summary>
    /// Thống kê học tập hàng ngày (streak)
    /// </summary>
    [HttpGet("streak")]
    public async Task<IActionResult> GetStreak()
    {
        var userId = GetUserId();
        
        // Lấy các ngày có hoạt động
        var testDates = await _context.TestAttempts
            .Where(ta => ta.UserId == userId)
            .Select(ta => ta.CompletedAt.Date)
            .Distinct()
            .ToListAsync();

        var practiceDates = await _context.PracticeSessions
            .Where(ps => ps.UserId == userId && ps.CompletedAt != null)
            .Select(ps => ps.CompletedAt!.Value.Date)
            .Distinct()
            .ToListAsync();

        var vocabDates = await _context.UserVocabularies
            .Where(uv => uv.UserId == userId && uv.LastReviewedAt != null)
            .Select(uv => uv.LastReviewedAt!.Value.Date)
            .Distinct()
            .ToListAsync();

        var allDates = testDates.Concat(practiceDates).Concat(vocabDates).Distinct().OrderByDescending(d => d).ToList();

        // Tính current streak
        var currentStreak = 0;
        var checkDate = DateTime.UtcNow.Date;
        
        foreach (var date in allDates)
        {
            if (date == checkDate || date == checkDate.AddDays(-1))
            {
                currentStreak++;
                checkDate = date.AddDays(-1);
            }
            else
            {
                break;
            }
        }

        // Tính longest streak
        var longestStreak = 0;
        var tempStreak = 1;
        
        for (int i = 0; i < allDates.Count - 1; i++)
        {
            if ((allDates[i] - allDates[i + 1]).Days == 1)
            {
                tempStreak++;
            }
            else
            {
                longestStreak = Math.Max(longestStreak, tempStreak);
                tempStreak = 1;
            }
        }
        longestStreak = Math.Max(longestStreak, tempStreak);

        // Activity trong 7 ngày
        var last7Days = Enumerable.Range(0, 7)
            .Select(i => DateTime.UtcNow.Date.AddDays(-i))
            .Select(date => new
            {
                Date = date.ToString("yyyy-MM-dd"),
                DayName = date.ToString("ddd"),
                HasActivity = allDates.Contains(date)
            })
            .Reverse()
            .ToList();

        return Ok(new
        {
            currentStreak,
            longestStreak,
            totalActiveDays = allDates.Count,
            last7Days,
            todayActive = allDates.Contains(DateTime.UtcNow.Date)
        });
    }
}
