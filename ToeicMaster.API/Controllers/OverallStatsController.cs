using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using ToeicMaster.API.Data;

namespace ToeicMaster.API.Controllers;

[ApiController]
[Route("api/v1/overall-stats")]
[AllowAnonymous]
public class OverallStatsController : ControllerBase
{
    private const string CacheKey = "overall_stats_v1";
    private static readonly TimeSpan CacheDuration = TimeSpan.FromMinutes(10);

    private readonly DapperContext _dapperContext;
    private readonly IMemoryCache _cache;

    public OverallStatsController(DapperContext dapperContext, IMemoryCache cache)
    {
        _dapperContext = dapperContext;
        _cache = cache;
    }

    /// <summary>
    /// Get overall platform statistics including tests, grammar, vocabulary, and reading.
    /// All counters are read in a single round trip and cached for 10 minutes.
    /// </summary>
    [HttpGet("stats")]
    public async Task<IActionResult> GetOverallStats()
    {
        try
        {
            if (_cache.TryGetValue(CacheKey, out OverallStatsResponse? cached) && cached is not null)
            {
                return Ok(cached);
            }

            const string sql = @"
                SELECT
                    (SELECT COUNT(*) FROM Tests)                               AS TestCount,
                    (SELECT COUNT(*) FROM GrammarTopics)                       AS GrammarTopicsCount,
                    (SELECT COUNT(*) FROM QuestionGrammar)                     AS GrammarQuestionsCount,
                    (SELECT COUNT(*) FROM Topics)                              AS VocabTopicsCount,
                    (SELECT COUNT(*) FROM Vocabularies)                        AS VocabCount,
                    (SELECT COUNT(*) FROM ReadingTopics   WHERE IsActive = 1)  AS ReadingTopicCount,
                    (SELECT COUNT(*) FROM ReadingPassages WHERE IsActive = 1)  AS ReadingPassageCount;";

            using var connection = _dapperContext.CreateConnection();
            var response = await connection.QuerySingleAsync<OverallStatsResponse>(sql);

            _cache.Set(CacheKey, response, CacheDuration);

            return Ok(response);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Failed to retrieve overall statistics", details = ex.Message });
        }
    }
}

public class OverallStatsResponse
{
    public int TestCount { get; set; }
    public int GrammarTopicsCount { get; set; }
    public int GrammarQuestionsCount { get; set; }
    public int VocabTopicsCount { get; set; }
    public int VocabCount { get; set; }
    public int ReadingTopicCount { get; set; }
    public int ReadingPassageCount { get; set; }
}
