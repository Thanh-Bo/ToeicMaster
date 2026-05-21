namespace ToeicMaster.API.Services;

public sealed record SubscriptionPlan(
    string Id,
    string Name,
    decimal Amount,
    int DurationMonths
);

public interface ISubscriptionPlanService
{
    IReadOnlyCollection<SubscriptionPlan> GetPlans();
    SubscriptionPlan? GetPlan(string? planId);
}

public class SubscriptionPlanService : ISubscriptionPlanService
{
    private static readonly SubscriptionPlan[] Plans =
    [
        new("premium_1m", "Premium 1 Thang", 30000m, 1),
        new("premium_3m", "Premium 3 Thang", 79000m, 3),
        new("premium_6m", "Premium 6 Thang", 149000m, 6)
    ];

    public IReadOnlyCollection<SubscriptionPlan> GetPlans() => Plans;

    public SubscriptionPlan? GetPlan(string? planId)
    {
        if (string.IsNullOrWhiteSpace(planId))
            return null;

        return Plans.FirstOrDefault(p =>
            string.Equals(p.Id, planId.Trim(), StringComparison.OrdinalIgnoreCase));
    }
}
