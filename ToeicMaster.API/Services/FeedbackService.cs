using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ToeicMaster.API.Data;
using ToeicMaster.API.Entities;
using ToeicMaster.API.Models;

namespace ToeicMaster.API.Services;

public interface IFeedbackService
{
    Task<FeedbackResponse> CreateFeedbackAsync(CreateFeedbackRequest request, int? userId);
    Task<List<FeedbackListResponse>> GetAllFeedbacksAsync(string? status = null, string? feedbackType = null);
    Task<FeedbackResponse> GetFeedbackByIdAsync(int id);
    Task<FeedbackResponse> UpdateFeedbackStatusAsync(int id, UpdateFeedbackStatusRequest request, int adminId);
    Task<bool> DeleteFeedbackAsync(int id);
}

public class FeedbackService : IFeedbackService
{
    private readonly AppDbContext _context;

    public FeedbackService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<FeedbackResponse> CreateFeedbackAsync(CreateFeedbackRequest request, int? userId)
    {
        var feedback = new UserFeedback
        {
            UserId = userId,
            FeedbackType = request.FeedbackType,
            Title = request.Title,
            Content = request.Content,
            Email = request.Email,
            CurrentPage = request.CurrentPage,
            Priority = request.Priority ?? 2,
            Status = "pending",
            CreatedAt = DateTime.UtcNow,
            UserAgent = null // Có thể capture từ frontend nếu cần
        };

        _context.UserFeedbacks.Add(feedback);
        await _context.SaveChangesAsync();

        return MapToResponse(feedback);
    }

    public async Task<List<FeedbackListResponse>> GetAllFeedbacksAsync(string? status = null, string? feedbackType = null)
    {
        var query = _context.UserFeedbacks
            .Include(f => f.User)
            .Include(f => f.RespondedByUser)
            .AsQueryable();

        if (!string.IsNullOrEmpty(status))
            query = query.Where(f => f.Status == status);

        if (!string.IsNullOrEmpty(feedbackType))
            query = query.Where(f => f.FeedbackType == feedbackType);

        var feedbacks = await query
            .OrderByDescending(f => f.Priority)
            .ThenByDescending(f => f.CreatedAt)
            .ToListAsync();

        return feedbacks.Select(f => new FeedbackListResponse
        {
            Id = f.Id,
            UserName = f.User?.FullName ?? "Anonymous",
            UserEmail = f.User?.Email ?? f.Email,
            FeedbackType = f.FeedbackType,
            Title = f.Title,
            Status = f.Status,
            Priority = f.Priority,
            CreatedAt = f.CreatedAt,
            RespondedAt = f.RespondedAt
        }).ToList();
    }

    public async Task<FeedbackResponse> GetFeedbackByIdAsync(int id)
    {
        var feedback = await _context.UserFeedbacks
            .Include(f => f.User)
            .Include(f => f.RespondedByUser)
            .FirstOrDefaultAsync(f => f.Id == id);

        if (feedback == null)
            throw new Exception($"Feedback with ID {id} not found");

        return MapToResponse(feedback);
    }

    public async Task<FeedbackResponse> UpdateFeedbackStatusAsync(int id, UpdateFeedbackStatusRequest request, int adminId)
    {
        var feedback = await _context.UserFeedbacks
            .Include(f => f.User)
            .FirstOrDefaultAsync(f => f.Id == id);

        if (feedback == null)
            throw new Exception($"Feedback with ID {id} not found");

        feedback.Status = request.Status;
        feedback.AdminResponse = request.AdminResponse;
        feedback.Priority = request.Priority ?? feedback.Priority;
        feedback.RespondedBy = adminId;
        feedback.RespondedAt = DateTime.UtcNow;
        feedback.UpdatedAt = DateTime.UtcNow;

        _context.UserFeedbacks.Update(feedback);
        await _context.SaveChangesAsync();

        return MapToResponse(feedback);
    }

    public async Task<bool> DeleteFeedbackAsync(int id)
    {
        var feedback = await _context.UserFeedbacks.FirstOrDefaultAsync(f => f.Id == id);

        if (feedback == null)
            return false;

        _context.UserFeedbacks.Remove(feedback);
        await _context.SaveChangesAsync();
        return true;
    }

    private FeedbackResponse MapToResponse(UserFeedback feedback)
    {
        return new FeedbackResponse
        {
            Id = feedback.Id,
            UserId = feedback.UserId,
            UserName = feedback.User?.FullName ?? "Anonymous",
            UserEmail = feedback.User?.Email ?? feedback.Email,
            FeedbackType = feedback.FeedbackType,
            Title = feedback.Title,
            Content = feedback.Content,
            Email = feedback.Email,
            CurrentPage = feedback.CurrentPage,
            Status = feedback.Status,
            Priority = feedback.Priority,
            CreatedAt = feedback.CreatedAt,
            UpdatedAt = feedback.UpdatedAt,
            RespondedAt = feedback.RespondedAt,
            AdminResponse = feedback.AdminResponse,
            RespondedBy = feedback.RespondedBy,
            RespondedByName = feedback.RespondedByUser?.FullName
        };
    }
}
