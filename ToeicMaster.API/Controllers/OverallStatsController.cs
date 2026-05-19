using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ToeicMaster.API.Data;

namespace ToeicMaster.API.Controllers;

[ApiController]
[Route("api/v1/overall-stats")]
[AllowAnonymous]
public class OverallStatsController : ControllerBase
{
    private readonly AppDbContext _context;

    public OverallStatsController(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Get overall platform statistics including tests, grammar topics/questions, and vocabulary topics/words
    /// </summary>
    [HttpGet("stats")]
    public async Task<IActionResult> GetOverallStats()
    {
        try
        {
            var response = new OverallStatsResponse
            {
                TestCount = await _context.Tests.CountAsync(),
                GrammarTopicsCount = await _context.GrammarTopics.CountAsync(),
                GrammarQuestionsCount = await _context.QuestionGrammars.CountAsync(),
                VocabTopicsCount = await _context.Topics.CountAsync(),
                VocabCount = await _context.Vocabularies.CountAsync()
            };

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
}
