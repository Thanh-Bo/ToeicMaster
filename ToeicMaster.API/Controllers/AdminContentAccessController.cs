using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ToeicMaster.API.Data;

namespace ToeicMaster.API.Controllers;

public class AdminContentAccessController : AdminBaseController
{
    public AdminContentAccessController(AppDbContext context) : base(context) { }

    [HttpPut("vocabulary/topics/{topicId}/explanation-access")]
    public async Task<IActionResult> UpdateVocabularyExplanationAccess(int topicId, [FromBody] UpdateExplanationAccessRequest request)
    {
        if (!await IsAdminAsync()) return Forbid();
        var topic = await _context.Topics.FindAsync(topicId);
        if (topic == null) return NotFound("Không tìm thấy vocabulary topic");
        topic.IsExplanationPremiumRequired = request.IsExplanationPremiumRequired;
        await _context.SaveChangesAsync();
        return Ok(new { topicId = topic.Id, isExplanationPremiumRequired = topic.IsExplanationPremiumRequired });
    }

    [HttpPut("grammar/topics/{topicId}/explanation-access")]
    public async Task<IActionResult> UpdateGrammarExplanationAccess(int topicId, [FromBody] UpdateExplanationAccessRequest request)
    {
        if (!await IsAdminAsync()) return Forbid();
        var topic = await _context.GrammarTopics.FindAsync(topicId);
        if (topic == null) return NotFound("Không tìm thấy grammar topic");
        topic.IsExplanationPremiumRequired = request.IsExplanationPremiumRequired;
        await _context.SaveChangesAsync();
        return Ok(new { topicId = topic.Id, isExplanationPremiumRequired = topic.IsExplanationPremiumRequired });
    }

    [HttpPut("grammar/rules/{grammarId}/questions-access")]
    public async Task<IActionResult> UpdateGrammarRuleQuestionsAccess(int grammarId, [FromBody] UpdateGrammarQuestionsAccessRequest request)
    {
        if (!await IsAdminAsync()) return Forbid();
        var grammar = await _context.Grammars.FindAsync(grammarId);
        if (grammar == null) return NotFound("Không tìm thấy grammar rule");
        grammar.IsQuestionsPremiumRequired = request.IsQuestionsPremiumRequired;
        await _context.SaveChangesAsync();
        return Ok(new { grammarId = grammar.Id, isQuestionsPremiumRequired = grammar.IsQuestionsPremiumRequired });
    }
}

public class UpdateGrammarQuestionsAccessRequest
{
    public bool IsQuestionsPremiumRequired { get; set; }
}
