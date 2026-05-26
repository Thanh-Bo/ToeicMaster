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
        new("premium_1m", "PRO 1 Thang", 50000m, 1),
        new("premium_3m", "PRO 3 Thang", 120000m, 3),
        new("premium_12m", "PRO 12 Thang", 360000m, 12)
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
