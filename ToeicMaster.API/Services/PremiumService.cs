using Microsoft.EntityFrameworkCore;
using ToeicMaster.API.Data;
using ToeicMaster.API.Entities;

namespace ToeicMaster.API.Services;

public interface IPremiumService
{
    bool IsPremiumActive(User user);
    Task<bool> IsPremiumUserAsync(int? userId);
    DateTime ExtendPremium(User user, int durationMonths);
}

public class PremiumService : IPremiumService
{
    private readonly AppDbContext _context;

    public PremiumService(AppDbContext context)
    {
        _context = context;
    }

    public bool IsPremiumActive(User user)
    {
        return user.Role == "Admin" ||
               (user.IsPremium == true &&
                user.PremiumExpiredAt.HasValue &&
                user.PremiumExpiredAt.Value > DateTime.UtcNow);
    }

    public async Task<bool> IsPremiumUserAsync(int? userId)
    {
        if (!userId.HasValue)
            return false;

        var user = await _context.Users
            .AsNoTracking()
            .Where(u => u.Id == userId.Value)
            .Select(u => new User
            {
                IsPremium = u.IsPremium,
                PremiumExpiredAt = u.PremiumExpiredAt,
                Role = u.Role
            })
            .FirstOrDefaultAsync();

        return user != null && IsPremiumActive(user);
    }

    public DateTime ExtendPremium(User user, int durationMonths)
    {
        var baseDate = user.PremiumExpiredAt.HasValue && user.PremiumExpiredAt.Value > DateTime.UtcNow
            ? user.PremiumExpiredAt.Value
            : DateTime.UtcNow;

        user.IsPremium = true;
        user.PremiumExpiredAt = baseDate.AddMonths(durationMonths);
        return user.PremiumExpiredAt.Value;
    }
}
