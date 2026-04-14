using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ToeicMaster.API.Models;
using ToeicMaster.API.Services;

namespace ToeicMaster.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FeedbackController : ControllerBase
{
    private readonly IFeedbackService _feedbackService;

    public FeedbackController(IFeedbackService feedbackService)
    {
        _feedbackService = feedbackService;
    }

    /// <summary>
    /// Create new feedback
    /// </summary>
    [HttpPost("create")]
    public async Task<IActionResult> CreateFeedback([FromBody] CreateFeedbackRequest request)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            int? parsedUserId = int.TryParse(userId, out var id) ? id : null;

            var result = await _feedbackService.CreateFeedbackAsync(request, parsedUserId);

            return Ok(new
            {
                success = true,
                message = "Cảm ơn bạn đã gửi ý kiến!",
                data = result
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
    }

    /// <summary>
    /// Get all feedbacks (Admin only)
    /// </summary>
    [Authorize]
    [HttpGet("list")]
    public async Task<IActionResult> GetAllFeedbacks([FromQuery] string? status = null, [FromQuery] string? feedbackType = null)
    {
        try
        {
            // Check if user is admin
            var role = User.FindFirst(ClaimTypes.Role)?.Value;
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            Console.WriteLine($"[FeedbackController] Role claim: '{role}', UserId: '{userId}'");
            
            if (string.IsNullOrEmpty(role))
                return Unauthorized(new { success = false, message = "No role claim found in token" });
            
            if (role.ToLower() != "admin")
                return Unauthorized(new { success = false, message = "Only admin can view feedbacks", debug = role });

            var feedbacks = await _feedbackService.GetAllFeedbacksAsync(status, feedbackType);

            return Ok(new
            {
                success = true,
                data = feedbacks,
                total = feedbacks.Count
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
    }

    /// <summary>
    /// Get feedback by ID (Admin only)
    /// </summary>
    [Authorize]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetFeedbackById(int id)
    {
        try
        {
            var role = User.FindFirst(ClaimTypes.Role)?.Value;
            if (role?.ToLower() != "admin")
                return Unauthorized(new { success = false, message = "Only admin can view feedback details" });

            var feedback = await _feedbackService.GetFeedbackByIdAsync(id);
            return Ok(new { success = true, data = feedback });
        }
        catch (Exception ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
    }

    /// <summary>
    /// Update feedback status and add admin response (Admin only)
    /// </summary>
    [Authorize]
    [HttpPut("update/{id}")]
    public async Task<IActionResult> UpdateFeedback(int id, [FromBody] UpdateFeedbackStatusRequest request)
    {
        try
        {
            var role = User.FindFirst(ClaimTypes.Role)?.Value;
            if (role?.ToLower() != "admin")
                return Unauthorized(new { success = false, message = "Only admin can update feedbacks" });

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userId, out var adminId))
                return BadRequest(new { success = false, message = "Invalid user ID" });

            var result = await _feedbackService.UpdateFeedbackStatusAsync(id, request, adminId);

            return Ok(new
            {
                success = true,
                message = "Feedback updated successfully",
                data = result
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
    }

    /// <summary>
    /// Delete feedback (Admin only)
    /// </summary>
    [Authorize]
    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> DeleteFeedback(int id)
    {
        try
        {
            var role = User.FindFirst(ClaimTypes.Role)?.Value;
            if (role?.ToLower() != "admin")
                return Unauthorized(new { success = false, message = "Only admin can delete feedbacks" });

            var result = await _feedbackService.DeleteFeedbackAsync(id);

            if (!result)
                return NotFound(new { success = false, message = "Feedback not found" });

            return Ok(new { success = true, message = "Feedback deleted successfully" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
    }
}
