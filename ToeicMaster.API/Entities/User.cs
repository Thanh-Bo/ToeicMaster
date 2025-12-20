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

    public bool IsActive { get; set; }

    public string? Role { get; set; }

    public virtual ICollection<Bookmark> Bookmarks { get; set; } = new List<Bookmark>();

    public virtual ICollection<PracticeSession> PracticeSessions { get; set; } = new List<PracticeSession>();

    public virtual ICollection<TestAttempt> TestAttempts { get; set; } = new List<TestAttempt>();

    public virtual ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();

    public virtual ICollection<UserVocabulary> UserVocabularies { get; set; } = new List<UserVocabulary>();

    public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();

    public virtual ICollection<CommentLike> CommentLikes { get; set; } = new List<CommentLike>();
}
