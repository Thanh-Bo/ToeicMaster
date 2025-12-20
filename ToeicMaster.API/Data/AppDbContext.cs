using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using ToeicMaster.API.Entities;

namespace ToeicMaster.API.Data;

public partial class AppDbContext : DbContext
{
    public AppDbContext()
    {
    }

    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

   

    public virtual DbSet<Answer> Answers { get; set; }

    public virtual DbSet<Part> Parts { get; set; }

    public virtual DbSet<Question> Questions { get; set; }

    public virtual DbSet<QuestionGroup> QuestionGroups { get; set; }

    public virtual DbSet<ReviewFeedback> ReviewFeedbacks { get; set; }

    public virtual DbSet<Tag> Tags { get; set; }

    public virtual DbSet<Test> Tests { get; set; }

    public virtual DbSet<TestAttempt> TestAttempts { get; set; }

    public virtual DbSet<Transaction> Transactions { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<UserAnswer> UserAnswers { get; set; }
    
    public virtual DbSet<Bookmark> Bookmarks { get; set; }
    
    public virtual DbSet<Vocabulary> Vocabularies { get; set; }
    
    public virtual DbSet<UserVocabulary> UserVocabularies { get; set; }
    
    public virtual DbSet<PracticeSession> PracticeSessions { get; set; }
    
    public virtual DbSet<PracticeAnswer> PracticeAnswers { get; set; }
    
    public virtual DbSet<Comment> Comments { get; set; }
    
    public virtual DbSet<CommentLike> CommentLikes { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=localhost\\SQLEXPRESS;Database=ToeicMasterDb;Trusted_Connection=True;TrustServerCertificate=True;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        

        modelBuilder.Entity<Answer>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Answers__3214EC07337BA9A4");

            entity.HasIndex(e => e.QuestionId, "IX_Answers_QuestionId");

            entity.Property(e => e.Label)
                .HasMaxLength(5)
                .IsUnicode(false);

            entity.HasOne(d => d.Question).WithMany(p => p.Answers)
                .HasForeignKey(d => d.QuestionId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Answers__Questio__2A4B4B5E");
        });

        modelBuilder.Entity<Part>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Parts__3214EC076FCC33CD");

            entity.Property(e => e.Description).HasColumnType("nvarchar(max)"); // Mở rộng từ 500
            entity.Property(e => e.Name).HasMaxLength(200); // Mở rộng từ 100

            entity.HasOne(d => d.Test).WithMany(p => p.Parts)
                .HasForeignKey(d => d.TestId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Parts__TestId__20C1E124");
        });

        modelBuilder.Entity<Question>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Question__3214EC0733666D61");

            entity.HasIndex(e => e.GroupId, "IX_Questions_GroupId");

            entity.Property(e => e.CorrectOption).HasColumnType("nvarchar(max)"); // Mở rộng từ varchar(5)
            entity.Property(e => e.QuestionType).HasMaxLength(50); // Mở rộng từ 20
            entity.Property(e => e.ScoreWeight)
                .HasDefaultValue(5.0m)
                .HasColumnType("decimal(5, 2)");

            entity.HasOne(d => d.Group).WithMany(p => p.Questions)
                .HasForeignKey(d => d.GroupId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Questions__Group__276EDEB3");

            entity.HasMany(d => d.Tags).WithMany(p => p.Questions)
                .UsingEntity<Dictionary<string, object>>(
                    "QuestionTag",
                    r => r.HasOne<Tag>().WithMany()
                        .HasForeignKey("TagId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK__QuestionT__TagId__30F848ED"),
                    l => l.HasOne<Question>().WithMany()
                        .HasForeignKey("QuestionId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK__QuestionT__Quest__300424B4"),
                    j =>
                    {
                        j.HasKey("QuestionId", "TagId").HasName("PK__Question__DB97A0363E0ADDBE");
                        j.ToTable("QuestionTags");
                    });
        });

        modelBuilder.Entity<QuestionGroup>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Question__3214EC07763A44F2");

            entity.HasIndex(e => e.PartId, "IX_QuestionGroups_PartId");

            // Bỏ giới hạn độ dài để cho phép lưu text dài (NVARCHAR(MAX))
            entity.Property(e => e.AudioUrl).HasColumnType("nvarchar(max)");
            entity.Property(e => e.ImageUrl).HasColumnType("nvarchar(max)");
            entity.Property(e => e.TextContent).HasColumnType("nvarchar(max)");
            entity.Property(e => e.Transcript).HasColumnType("nvarchar(max)");

            entity.HasOne(d => d.Part).WithMany(p => p.QuestionGroups)
                .HasForeignKey(d => d.PartId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__QuestionG__PartI__239E4DCF");
        });

        modelBuilder.Entity<ReviewFeedback>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__ReviewFe__3214EC071D3362E9");

            entity.HasIndex(e => e.UserAnswerId, "UQ__ReviewFe__47CE237E322AEA53").IsUnique();

            entity.Property(e => e.EvaluatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Score).HasColumnType("decimal(4, 1)");

            entity.HasOne(d => d.UserAnswer).WithOne(p => p.ReviewFeedback)
                .HasForeignKey<ReviewFeedback>(d => d.UserAnswerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ReviewFee__UserA__4316F928");
        });

        modelBuilder.Entity<Tag>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Tags__3214EC07AC9E8EFE");

            entity.HasIndex(e => e.Name, "UQ__Tags__737584F6ED28C450").IsUnique();

            entity.Property(e => e.Name).HasMaxLength(50);
        });

        modelBuilder.Entity<Test>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Tests__3214EC074D70A308");

            entity.HasIndex(e => new { e.Type, e.IsActive }, "IX_Tests_Type_IsActive");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Duration).HasDefaultValue(120);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.Slug)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.Title).HasMaxLength(200);
            entity.Property(e => e.TotalParticipants).HasDefaultValue(0);
            entity.Property(e => e.TotalQuestions).HasDefaultValue(200);
            entity.Property(e => e.Type)
                .HasMaxLength(20)
                .IsUnicode(false);
        });

        modelBuilder.Entity<TestAttempt>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__TestAtte__3214EC0766A2C919");

            entity.HasIndex(e => e.UserId, "IX_TestAttempts_UserId");

            entity.Property(e => e.StartedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .IsUnicode(false);

            entity.HasOne(d => d.Test).WithMany(p => p.TestAttempts)
                .HasForeignKey(d => d.TestId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__TestAttem__TestI__3A81B327");

            entity.HasOne(d => d.User).WithMany(p => p.TestAttempts)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__TestAttem__UserI__398D8EEE");
        });

        modelBuilder.Entity<Transaction>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Transact__3214EC073FFCEC07");

            entity.Property(e => e.Amount).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.Content).HasMaxLength(255);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.PaymentGateway)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .IsUnicode(false);

            entity.HasOne(d => d.User).WithMany(p => p.Transactions)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Transacti__UserI__173876EA");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Users__3214EC07DF4B76BC");

            entity.HasIndex(e => e.Email, "UQ__Users__A9D105345BFCEFD1").IsUnique();

            entity.Property(e => e.AvatarUrl)
                .HasMaxLength(500)
                .IsUnicode(false);
            entity.Property(e => e.Balance)
                .HasDefaultValue(0m)
                .HasColumnType("decimal(18, 2)");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.FullName).HasMaxLength(100);
            entity.Property(e => e.IsPremium).HasDefaultValue(false);
            entity.Property(e => e.PasswordHash)
                .HasMaxLength(255)
                .IsUnicode(false);
        });

        modelBuilder.Entity<UserAnswer>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__UserAnsw__3214EC077981C1D2");

            entity.HasIndex(e => new { e.AttemptId, e.IsCorrect }, "IX_UserAnswers_Stat");

            entity.Property(e => e.AudioResponseUrl)
                .HasMaxLength(500)
                .IsUnicode(false);
            entity.Property(e => e.SelectedOption)
                .HasMaxLength(5)
                .IsUnicode(false);

            entity.HasOne(d => d.Attempt).WithMany(p => p.UserAnswers)
                .HasForeignKey(d => d.AttemptId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__UserAnswe__Attem__3D5E1FD2");

            entity.HasOne(d => d.Question).WithMany(p => p.UserAnswers)
                .HasForeignKey(d => d.QuestionId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__UserAnswe__Quest__3E52440B");
        });

        // Bookmark configuration
        modelBuilder.Entity<Bookmark>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.UserId, e.QuestionId }).IsUnique();
            
            entity.HasOne(e => e.User)
                .WithMany(u => u.Bookmarks)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
                
            entity.HasOne(e => e.Question)
                .WithMany(q => q.Bookmarks)
                .HasForeignKey(e => e.QuestionId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Vocabulary configuration
        modelBuilder.Entity<Vocabulary>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Word).HasMaxLength(100).IsRequired();
            entity.Property(e => e.Meaning).HasMaxLength(500).IsRequired();
            entity.Property(e => e.Pronunciation).HasMaxLength(200);
            entity.Property(e => e.PartOfSpeech).HasMaxLength(20);
            entity.Property(e => e.Category).HasMaxLength(50);
            
            entity.HasOne(e => e.Question)
                .WithMany(q => q.Vocabularies)
                .HasForeignKey(e => e.QuestionId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        // UserVocabulary configuration
        modelBuilder.Entity<UserVocabulary>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.UserId, e.VocabularyId }).IsUnique();
            
            entity.HasOne(e => e.User)
                .WithMany(u => u.UserVocabularies)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
                
            entity.HasOne(e => e.Vocabulary)
                .WithMany(v => v.UserVocabularies)
                .HasForeignKey(e => e.VocabularyId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // PracticeSession configuration
        modelBuilder.Entity<PracticeSession>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Status).HasMaxLength(20);
            
            entity.HasOne(e => e.User)
                .WithMany(u => u.PracticeSessions)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // PracticeAnswer configuration
        modelBuilder.Entity<PracticeAnswer>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.SelectedOption).HasMaxLength(5);
            
            entity.HasOne(e => e.Session)
                .WithMany(s => s.PracticeAnswers)
                .HasForeignKey(e => e.SessionId)
                .OnDelete(DeleteBehavior.Cascade);
                
            entity.HasOne(e => e.Question)
                .WithMany(q => q.PracticeAnswers)
                .HasForeignKey(e => e.QuestionId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Comment configuration
        modelBuilder.Entity<Comment>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.TestId);
            entity.HasIndex(e => e.UserId);
            entity.HasIndex(e => e.ParentCommentId);
            
            entity.Property(e => e.Content).HasColumnType("nvarchar(max)").IsRequired();
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
            
            entity.HasOne(e => e.Test)
                .WithMany(t => t.Comments)
                .HasForeignKey(e => e.TestId)
                .OnDelete(DeleteBehavior.Cascade);
                
            entity.HasOne(e => e.User)
                .WithMany(u => u.Comments)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
                
            entity.HasOne(e => e.ParentComment)
                .WithMany(c => c.Replies)
                .HasForeignKey(e => e.ParentCommentId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        // CommentLike configuration
        modelBuilder.Entity<CommentLike>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.CommentId, e.UserId }).IsUnique();
            
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            
            entity.HasOne(e => e.Comment)
                .WithMany(c => c.CommentLikes)
                .HasForeignKey(e => e.CommentId)
                .OnDelete(DeleteBehavior.Cascade);
                
            entity.HasOne(e => e.User)
                .WithMany(u => u.CommentLikes)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
