using System;
using System.Collections.Generic;

namespace ToeicMaster.API.Entities;

public partial class User
{
    public int Id { get; set; }

    public string? FullName { get; set; }

    public string Email { get; set; } = null!;

    public string PasswordHash { get; set; } = null!;

    public string? AvatarUrl { get; set; }

    public decimal? Balance { get; set; }

    public bool? IsPremium { get; set; }

    public DateTime? PremiumExpiredAt { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? LastLoginAt { get; set; }


    public string? RefreshToken { get; set; }
    public DateTime? RefreshTokenExpiryTime { get; set; }

    public virtual ICollection<TestAttempt> TestAttempts { get; set; } = new List<TestAttempt>();

    public virtual ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
}
