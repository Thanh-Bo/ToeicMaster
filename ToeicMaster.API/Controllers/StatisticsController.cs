using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using ToeicMaster.API.Data;
using StackExchange.Redis;
using System.Text.Json;

namespace ToeicMaster.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class StatisticsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IConnectionMultiplexer _redis;

    public StatisticsController(AppDbContext context, IConnectionMultiplexer redis)
    {
        _context = context;
        _redis = redis; 
    }

    private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    private async Task<T> GetOrSetCache<T>(string cacheKey, Func<Task<T>> factory, int expirationMinutes = 30)
{
    var db = _redis.GetDatabase();
    var cachedValue = await db.StringGetAsync(cacheKey);
    
    if (cachedValue.HasValue)
    {
        return JsonSerializer.Deserialize<T>(cachedValue.ToString())!;
    }
    
    var result = await factory();
    var json = JsonSerializer.Serialize(result);
    await db.StringSetAsync(cacheKey, json, TimeSpan.FromMinutes(expirationMinutes));
    
    return result;
} 
    /// <summary>
    /// Helper: Tính startDate dựa vào period
    /// </summary>
    private DateTime GetStartDate(string period = "30days")
    {
        return period switch
        {
            "7days" => DateTime.UtcNow.AddDays(-7),
            "30days" => DateTime.UtcNow.AddDays(-30),
            "90days" => DateTime.UtcNow.AddDays(-90),
            "1year" => DateTime.UtcNow.AddYears(-1),
            "alltime" => DateTime.MinValue,
            _ => DateTime.UtcNow.AddDays(-30)
        };
    }

    /// <summary>
    /// Dashboard thống kê tổng quan (có filter theo thời gian)
    /// </summary>
    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboard([FromQuery] string period = "30days")
    {
        var userId = GetUserId();
        var cacheKey = $"dashboard:{userId}:{period}";

        var result = await GetOrSetCache(cacheKey, async () =>
        {
            var startDate = GetStartDate(period);

            // Thống kê bài thi
            var testStats = await _context.TestAttempts
                .Where(ta => ta.UserId == userId && ta.CompletedAt >= startDate)
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
                .Where(ps => ps.UserId == userId && ps.Status == "completed" && ps.CompletedAt >= startDate)
                .GroupBy(ps => 1)
                .Select(g => new
                {
                    TotalSessions = g.Count(),
                    TotalQuestions = g.Sum(ps => ps.TotalQuestions),
                    TotalCorrect = g.Sum(ps => ps.CorrectAnswers),
                    TotalTime = g.Sum(ps => ps.TimeSpentSeconds)
                })
                .FirstOrDefaultAsync();

            // Bookmarks count (không filter)
            var bookmarksCount = await _context.Bookmarks
                .CountAsync(b => b.UserId == userId);

            // Vocabulary stats (không filter)
            var vocabStats = await _context.UserVocabularies
                .Where(uv => uv.UserId == userId)
                .GroupBy(uv => 1)
                .Select(g => new
                {
                    TotalLearned = g.Count(),
                    Mastered = g.Count(uv => uv.Status == 3)
                })
                .FirstOrDefaultAsync();

            return new
            {
                period,
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
                totalLearningTimeMinutes = Math.Round((practiceStats?.TotalTime ?? 0) / 60.0, 1)
            };
        }, expirationMinutes: 30);

        return Ok(result);
    }

    /// <summary>
    /// Thống kê theo từng Part (điểm mạnh/yếu) - có filter theo thời gian
    /// </summary>
    [HttpGet("parts-analysis")]
    public async Task<IActionResult> GetPartsAnalysis([FromQuery] string period = "30days")
    {
        var userId = GetUserId();
        var cacheKey = $"parts-analysis:{userId}:{period}";

        var result = await GetOrSetCache(cacheKey, async () =>
        {
            var startDate = GetStartDate(period);

            // Lấy answers của user trong các bài thi (filtered)
            var testAnswers = await _context.UserAnswers
                .Where(ua => ua.Attempt.UserId == userId && ua.Attempt.CompletedAt >= startDate)
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

            // Lấy practice stats (filtered)
            var practiceAnswers = await _context.PracticeAnswers
                .Where(pa => pa.Session.UserId == userId && pa.Session.CompletedAt >= startDate)
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

            var partResults = parts.Select(p =>
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
            var dataWithEnough = partResults.Where(r => r.TotalQuestions >= 10).ToList();
            var strengths = dataWithEnough.OrderByDescending(r => r.Accuracy).Take(2).Select(r => r.Name);
            var weaknesses = dataWithEnough.OrderBy(r => r.Accuracy).Take(2).Select(r => r.Name);

            return new
            {
                period,
                parts = partResults,
                strengths,
                weaknesses
            };
        }, expirationMinutes: 30);

        return Ok(result);
    }

    /// <summary>
    /// Biểu đồ tiến bộ theo thời gian
    /// </summary>
    [HttpGet("progress")]
    public async Task<IActionResult> GetProgressChart([FromQuery] string period = "30days")
    {
        var userId = GetUserId();
        var cacheKey = $"progress:{userId}:{period}";

        var result = await GetOrSetCache(cacheKey, async () =>
        {
            var startDate = GetStartDate(period).Date;

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

            return new
            {
                period,
                chartData,
                summary = new
                {
                    TotalTests = testScores.Count,
                    AverageScore = testScores.Any() ? Math.Round(testScores.Average(t => t.TotalScore)) : 0,
                    BestScore = testScores.Any() ? testScores.Max(t => t.TotalScore) : 0,
                    Trend = Math.Round(trend),
                    TrendDirection = trend > 0 ? "up" : trend < 0 ? "down" : "stable"
                }
            };
        }, expirationMinutes: 30);

        return Ok(result);
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

    /// <summary>
    /// 1️⃣ GET /stats - Thống kê chi tiết cho user
    /// </summary>
    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var userId = GetUserId();

        // Tổng quát
        var userVocabStats = await _context.UserVocabularies
            .Where(uv => uv.UserId == userId)
            .GroupBy(uv => 1)
            .Select(g => new
            {
                TotalVocab = g.Count(),
                Learned = g.Count(uv => uv.Status == 3), // MASTERED
                Learning = g.Count(uv => uv.Status == 1), // LEARNING
                NotStarted = g.Count(uv => uv.Status == 0) // NEW
            })
            .FirstOrDefaultAsync() ?? new { TotalVocab = 0, Learned = 0, Learning = 0, NotStarted = 0 };

        // Stats theo topic
        var topicStats = await _context.Vocabularies
            .GroupBy(v => v.TopicId)
            .Select(g => new
            {
                TopicId = g.Key,
                TotalWords = g.Count(),
                LearnedCount = _context.UserVocabularies
                    .Count(uv => uv.UserId == userId && uv.VocabularyId == g.First().Id && uv.Status == 3),
                LearningCount = _context.UserVocabularies
                    .Count(uv => uv.UserId == userId && g.Select(v => v.Id).Contains(uv.VocabularyId) && uv.Status == 1)
            })
            .ToListAsync();

        // Test stats
        var testStats = await _context.TestAttempts
            .Where(ta => ta.UserId == userId)
            .OrderByDescending(ta => ta.CompletedAt)
            .GroupBy(ta => 1)
            .Select(g => new
            {
                TotalTests = g.Count(),
                AverageScore = g.Average(ta => ta.TotalScore),
                HighestScore = g.Max(ta => ta.TotalScore),
                LowestScore = g.Min(ta => ta.TotalScore),
                LastTestDate = g.Max(ta => ta.CompletedAt)
            })
            .FirstOrDefaultAsync();

        // Streak
        var activeDates = await _context.UserVocabularies
            .Where(uv => uv.UserId == userId)
            .Select(uv => uv.LastReviewedAt!.Value.Date)
            .Distinct()
            .OrderByDescending(d => d)
            .ToListAsync();

        var currentStreak = 0;
        var today = DateTime.UtcNow.Date;
        for (int i = 0; i < activeDates.Count; i++)
        {
            if (activeDates[i] == today.AddDays(-i))
                currentStreak++;
            else
                break;
        }

        return Ok(new
        {
            vocabulary = userVocabStats,
            topics = topicStats,
            tests = testStats,
            streak = currentStreak,
            masteryPercentage = userVocabStats.TotalVocab > 0 
                ? Math.Round((double)userVocabStats.Learned / userVocabStats.TotalVocab * 100, 2)
                : 0
        });
    }

    /// <summary>
    /// 2️⃣ GET /review-today - Vocabulary cần ôn tập hôm nay (SRS)
    /// </summary>
    [HttpGet("review-today")]
    public async Task<IActionResult> GetReviewToday()
    {
        var userId = GetUserId();
        var now = DateTime.UtcNow;

        // Lấy từ vựng cần review theo SRS (Spaced Repetition System)
        // - Review overdue (đã quá hạn)
        // - Review due today
        // - New words (optional, số lượng giới hạn)
        var reviewWords = await _context.UserVocabularies
            .Include(uv => uv.Vocabulary)
            .Where(uv => uv.UserId == userId 
                && uv.Status < 3  // Chưa mastered
                && (uv.NextReviewAt == null || uv.NextReviewAt <= now))
            .OrderBy(uv => uv.NextReviewAt)
            .Take(20) // Tối đa 20 từ mỗi ngày
            .Select(uv => new
            {
                id = uv.VocabularyId,
                word = uv.Vocabulary.Word,
                meaning = uv.Vocabulary.Meaning,
                pronunciation = uv.Vocabulary.Pronunciation,
                example = uv.Vocabulary.Example,
                audioUrl = uv.Vocabulary.AudioUrl,
                imageUrl = uv.Vocabulary.ImageUrl,
                status = uv.Status,
                nextReviewAt = uv.NextReviewAt,
                reviewCount = uv.ReviewCount,
                isOverdue = uv.NextReviewAt < now
            })
            .ToListAsync();

        // Phân loại
        var overdue = reviewWords.Where(w => w.isOverdue).Count();
        var dueToday = reviewWords.Count() - overdue;

        return Ok(new
        {
            totalToReview = reviewWords.Count(),
            overdue,
            dueToday,
            words = reviewWords
        });
    }

   
}

public class TestSubmissionDto
{
    public Dictionary<string, string> Answers { get; set; } = new();
}
