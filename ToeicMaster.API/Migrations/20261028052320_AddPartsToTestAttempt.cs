using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ToeicMaster.API.Migrations
{
    /// <inheritdoc />
    public partial class AddPartsToTestAttempt : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserVocabularies");

            migrationBuilder.AddColumn<string>(
                name: "Antonyms",
                table: "Vocabularies",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Collocations",
                table: "Vocabularies",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Synonyms",
                table: "Vocabularies",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "LevelRange",
                table: "Topics",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "0-450",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Level",
                table: "Topics",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "Basic",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<bool>(
                name: "IsExplanationPremiumRequired",
                table: "Topics",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<Guid>(
                name: "TopicGuid",
                table: "Topics",
                type: "uniqueidentifier",
                nullable: false,
                defaultValueSql: "NEWID()");

            migrationBuilder.AddColumn<bool>(
                name: "IsExplanationPremiumRequired",
                table: "Tests",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<Guid>(
                name: "TestGuid",
                table: "Tests",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<string>(
                name: "Parts",
                table: "TestAttempts",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.CreateTable(
                name: "GrammarGroups",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    GroupGuid = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWID()"),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Order = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "(getdate())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GrammarGroups", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ReadingSessions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PublicId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    TotalPassages = table.Column<int>(type: "int", nullable: false),
                    TotalQuestions = table.Column<int>(type: "int", nullable: false),
                    CorrectAnswers = table.Column<int>(type: "int", nullable: false),
                    TimeSpentSeconds = table.Column<int>(type: "int", nullable: false),
                    StartedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "(getdate())"),
                    CompletedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false, defaultValue: "in_progress")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReadingSessions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ReadingSessions_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ReadingTopics",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PublicId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PartType = table.Column<int>(type: "int", nullable: false),
                    Difficulty = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    DisplayOrder = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    IsPremiumRequired = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "(getdate())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReadingTopics", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "UserActivityVocabSessions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    StartTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndTime = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DurationSeconds = table.Column<int>(type: "int", nullable: true),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserActivityVocabSessions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserActivityVocabSessions_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserDailyActivity",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    HasActivity = table.Column<bool>(type: "bit", nullable: false),
                    TotalStudySeconds = table.Column<int>(type: "int", nullable: false),
                    LessonsLearnedCount = table.Column<int>(type: "int", nullable: false),
                    QuestionsAnsweredCount = table.Column<int>(type: "int", nullable: false),
                    CorrectAnswersCount = table.Column<int>(type: "int", nullable: false),
                    LastActivityAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserDailyActivity", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserDailyActivity_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserFeedbacks",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: true),
                    FeedbackType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Title = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    CurrentPage = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    UserAgent = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ScreenshotUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    Status = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false, defaultValue: "pending"),
                    Priority = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    RespondedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    AdminResponse = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RespondedBy = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserFeedbacks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserFeedbacks_Users_RespondedBy",
                        column: x => x.RespondedBy,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_UserFeedbacks_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "UserVocab",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    TopicId = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    ReviewCount = table.Column<int>(type: "int", nullable: false),
                    Level = table.Column<int>(type: "int", nullable: false),
                    NextReviewAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastReviewedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    TotalQuestionsAnswered = table.Column<int>(type: "int", nullable: false),
                    TotalCorrectAnswers = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserVocab", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserVocab_Topics_TopicId",
                        column: x => x.TopicId,
                        principalTable: "Topics",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserVocab_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserVocabStreaks",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    CurrentStreak = table.Column<int>(type: "int", nullable: false),
                    LongestStreak = table.Column<int>(type: "int", nullable: false),
                    LastActivityDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserVocabStreaks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserVocabStreaks_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GrammarTopics",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TopicGuid = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWID()"),
                    GroupId = table.Column<int>(type: "int", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Level = table.Column<string>(type: "nvarchar(max)", nullable: false, defaultValue: "Basic"),
                    LevelRange = table.Column<string>(type: "nvarchar(max)", nullable: false, defaultValue: "0-450"),
                    Category = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsExplanationPremiumRequired = table.Column<bool>(type: "bit", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GrammarTopics", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GrammarTopics_GrammarGroups_GroupId",
                        column: x => x.GroupId,
                        principalTable: "GrammarGroups",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ReadingPassages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PublicId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TopicId = table.Column<int>(type: "int", nullable: true),
                    Title = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    TextContent = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TextContentTranslation = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PassageType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    PartType = table.Column<int>(type: "int", nullable: false),
                    Difficulty = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    DisplayOrder = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "(getdate())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReadingPassages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ReadingPassages_ReadingTopics_TopicId",
                        column: x => x.TopicId,
                        principalTable: "ReadingTopics",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Grammars",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TopicId = table.Column<int>(type: "int", nullable: false),
                    RuleName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Structure = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Meaning = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Example = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ExampleTranslation = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AudioUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CommonMistakes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Difficulty = table.Column<int>(type: "int", nullable: false),
                    IsQuestionsPremiumRequired = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    NegativeExample = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NegativeExampleTranslation = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TestTip = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Frequency = table.Column<int>(type: "int", nullable: true),
                    RelatedRuleIds = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Grammars", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Grammars_GrammarTopics_TopicId",
                        column: x => x.TopicId,
                        principalTable: "GrammarTopics",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ReadingQuestions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PassageId = table.Column<int>(type: "int", nullable: false),
                    QuestionNo = table.Column<int>(type: "int", nullable: false),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CorrectOption = table.Column<string>(type: "nvarchar(5)", maxLength: 5, nullable: true),
                    ShortExplanation = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FullExplanation = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    QuestionType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "(getdate())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReadingQuestions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ReadingQuestions_ReadingPassages_PassageId",
                        column: x => x.PassageId,
                        principalTable: "ReadingPassages",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ReadingSessionPassages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SessionId = table.Column<int>(type: "int", nullable: false),
                    PassageId = table.Column<int>(type: "int", nullable: false),
                    DisplayOrder = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReadingSessionPassages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ReadingSessionPassages_ReadingPassages_PassageId",
                        column: x => x.PassageId,
                        principalTable: "ReadingPassages",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ReadingSessionPassages_ReadingSessions_SessionId",
                        column: x => x.SessionId,
                        principalTable: "ReadingSessions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GrammarExamples",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    GrammarId = table.Column<int>(type: "int", nullable: false),
                    Sentence = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Translation = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Context = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AudioUrl = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GrammarExamples", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GrammarExamples_Grammars_GrammarId",
                        column: x => x.GrammarId,
                        principalTable: "Grammars",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GrammarStudySessions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    GrammarId = table.Column<int>(type: "int", nullable: true),
                    TopicId = table.Column<int>(type: "int", nullable: true),
                    GroupId = table.Column<int>(type: "int", nullable: true),
                    SessionType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    DurationSeconds = table.Column<int>(type: "int", nullable: false),
                    QuestionsAnswered = table.Column<int>(type: "int", nullable: false),
                    CorrectAnswers = table.Column<int>(type: "int", nullable: false),
                    StartedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GrammarStudySessions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GrammarStudySessions_GrammarGroups_GroupId",
                        column: x => x.GroupId,
                        principalTable: "GrammarGroups",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_GrammarStudySessions_GrammarTopics_TopicId",
                        column: x => x.TopicId,
                        principalTable: "GrammarTopics",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_GrammarStudySessions_Grammars_GrammarId",
                        column: x => x.GrammarId,
                        principalTable: "Grammars",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_GrammarStudySessions_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "QuestionGrammar",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    GrammarId = table.Column<int>(type: "int", nullable: true),
                    TopicId = table.Column<int>(type: "int", nullable: true),
                    QuestionNo = table.Column<int>(type: "int", nullable: false),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CorrectOption = table.Column<string>(type: "nvarchar(5)", maxLength: 5, nullable: true),
                    ShortExplanation = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LongExplanation = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Mode = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuestionGrammar", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuestionGrammar_GrammarTopics_TopicId",
                        column: x => x.TopicId,
                        principalTable: "GrammarTopics",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_QuestionGrammar_Grammars_GrammarId",
                        column: x => x.GrammarId,
                        principalTable: "Grammars",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "UserGrammars",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    GrammarId = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    CorrectStreak = table.Column<int>(type: "int", nullable: false),
                    ReviewCount = table.Column<int>(type: "int", nullable: false),
                    Level = table.Column<int>(type: "int", nullable: false),
                    FirstLearnedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    NextReviewAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastReviewedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    TotalQuestionsAnswered = table.Column<int>(type: "int", nullable: false),
                    TotalCorrectAnswers = table.Column<int>(type: "int", nullable: false),
                    TotalStudyTimeSeconds = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserGrammars", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserGrammars_Grammars_GrammarId",
                        column: x => x.GrammarId,
                        principalTable: "Grammars",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserGrammars_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ReadingAnswers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ReadingQuestionId = table.Column<int>(type: "int", nullable: false),
                    Label = table.Column<string>(type: "nvarchar(5)", maxLength: 5, nullable: true),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReadingAnswers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ReadingAnswers_ReadingQuestions_ReadingQuestionId",
                        column: x => x.ReadingQuestionId,
                        principalTable: "ReadingQuestions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ReadingSessionAnswers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SessionId = table.Column<int>(type: "int", nullable: false),
                    ReadingQuestionId = table.Column<int>(type: "int", nullable: false),
                    SelectedOption = table.Column<string>(type: "nvarchar(5)", maxLength: 5, nullable: true),
                    IsCorrect = table.Column<bool>(type: "bit", nullable: false),
                    AnsweredAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "(getdate())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReadingSessionAnswers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ReadingSessionAnswers_ReadingQuestions_ReadingQuestionId",
                        column: x => x.ReadingQuestionId,
                        principalTable: "ReadingQuestions",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ReadingSessionAnswers_ReadingSessions_SessionId",
                        column: x => x.SessionId,
                        principalTable: "ReadingSessions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "QuestionGrammarAnswer",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    QuestionGrammarId = table.Column<int>(type: "int", nullable: false),
                    Label = table.Column<string>(type: "nvarchar(5)", maxLength: 5, nullable: true),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsCorrect = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuestionGrammarAnswer", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuestionGrammarAnswer_QuestionGrammar_QuestionGrammarId",
                        column: x => x.QuestionGrammarId,
                        principalTable: "QuestionGrammar",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Topics_TopicGuid",
                table: "Topics",
                column: "TopicGuid",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_GrammarExamples_GrammarId",
                table: "GrammarExamples",
                column: "GrammarId");

            migrationBuilder.CreateIndex(
                name: "IX_Grammars_TopicId",
                table: "Grammars",
                column: "TopicId");

            migrationBuilder.CreateIndex(
                name: "IX_GrammarStudySessions_GrammarId",
                table: "GrammarStudySessions",
                column: "GrammarId");

            migrationBuilder.CreateIndex(
                name: "IX_GrammarStudySessions_GroupId",
                table: "GrammarStudySessions",
                column: "GroupId");

            migrationBuilder.CreateIndex(
                name: "IX_GrammarStudySessions_TopicId",
                table: "GrammarStudySessions",
                column: "TopicId");

            migrationBuilder.CreateIndex(
                name: "IX_GrammarStudySessions_UserId",
                table: "GrammarStudySessions",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_GrammarTopics_GroupId",
                table: "GrammarTopics",
                column: "GroupId");

            migrationBuilder.CreateIndex(
                name: "IX_GrammarTopics_TopicGuid",
                table: "GrammarTopics",
                column: "TopicGuid",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_QuestionGrammar_GrammarId",
                table: "QuestionGrammar",
                column: "GrammarId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionGrammar_TopicId_Mode",
                table: "QuestionGrammar",
                columns: new[] { "TopicId", "Mode" });

            migrationBuilder.CreateIndex(
                name: "IX_QuestionGrammarAnswer_QuestionGrammarId",
                table: "QuestionGrammarAnswer",
                column: "QuestionGrammarId");

            migrationBuilder.CreateIndex(
                name: "IX_ReadingAnswers_ReadingQuestionId",
                table: "ReadingAnswers",
                column: "ReadingQuestionId");

            migrationBuilder.CreateIndex(
                name: "UX_ReadingAnswers_Question_Label",
                table: "ReadingAnswers",
                columns: new[] { "ReadingQuestionId", "Label" },
                unique: true,
                filter: "[Label] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_ReadingPassages_PartType_IsActive",
                table: "ReadingPassages",
                columns: new[] { "PartType", "IsActive" });

            migrationBuilder.CreateIndex(
                name: "IX_ReadingPassages_TopicId",
                table: "ReadingPassages",
                column: "TopicId");

            migrationBuilder.CreateIndex(
                name: "IX_ReadingQuestions_PassageId",
                table: "ReadingQuestions",
                column: "PassageId");

            migrationBuilder.CreateIndex(
                name: "IX_ReadingSessionAnswers_ReadingQuestionId",
                table: "ReadingSessionAnswers",
                column: "ReadingQuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_ReadingSessionAnswers_SessionId",
                table: "ReadingSessionAnswers",
                column: "SessionId");

            migrationBuilder.CreateIndex(
                name: "UX_ReadingSessionAnswers_Session_Question",
                table: "ReadingSessionAnswers",
                columns: new[] { "SessionId", "ReadingQuestionId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ReadingSessionPassages_PassageId",
                table: "ReadingSessionPassages",
                column: "PassageId");

            migrationBuilder.CreateIndex(
                name: "UX_ReadingSessionPassages_Session_Passage",
                table: "ReadingSessionPassages",
                columns: new[] { "SessionId", "PassageId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ReadingSessions_UserId_StartedAt",
                table: "ReadingSessions",
                columns: new[] { "UserId", "StartedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_ReadingTopics_PartType_Difficulty_IsActive",
                table: "ReadingTopics",
                columns: new[] { "PartType", "Difficulty", "IsActive" });

            migrationBuilder.CreateIndex(
                name: "IX_UserActivityVocabSessions_UserId",
                table: "UserActivityVocabSessions",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserDailyActivity_UserId",
                table: "UserDailyActivity",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserFeedbacks_CreatedAt",
                table: "UserFeedbacks",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_UserFeedbacks_Priority",
                table: "UserFeedbacks",
                column: "Priority");

            migrationBuilder.CreateIndex(
                name: "IX_UserFeedbacks_RespondedBy",
                table: "UserFeedbacks",
                column: "RespondedBy");

            migrationBuilder.CreateIndex(
                name: "IX_UserFeedbacks_Status",
                table: "UserFeedbacks",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_UserFeedbacks_UserId",
                table: "UserFeedbacks",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserGrammars_GrammarId",
                table: "UserGrammars",
                column: "GrammarId");

            migrationBuilder.CreateIndex(
                name: "IX_UserGrammars_UserId",
                table: "UserGrammars",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserVocab_TopicId",
                table: "UserVocab",
                column: "TopicId");

            migrationBuilder.CreateIndex(
                name: "IX_UserVocab_UserId_TopicId",
                table: "UserVocab",
                columns: new[] { "UserId", "TopicId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserVocabStreaks_UserId",
                table: "UserVocabStreaks",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "GrammarExamples");

            migrationBuilder.DropTable(
                name: "GrammarStudySessions");

            migrationBuilder.DropTable(
                name: "QuestionGrammarAnswer");

            migrationBuilder.DropTable(
                name: "ReadingAnswers");

            migrationBuilder.DropTable(
                name: "ReadingSessionAnswers");

            migrationBuilder.DropTable(
                name: "ReadingSessionPassages");

            migrationBuilder.DropTable(
                name: "UserActivityVocabSessions");

            migrationBuilder.DropTable(
                name: "UserDailyActivity");

            migrationBuilder.DropTable(
                name: "UserFeedbacks");

            migrationBuilder.DropTable(
                name: "UserGrammars");

            migrationBuilder.DropTable(
                name: "UserVocab");

            migrationBuilder.DropTable(
                name: "UserVocabStreaks");

            migrationBuilder.DropTable(
                name: "QuestionGrammar");

            migrationBuilder.DropTable(
                name: "ReadingQuestions");

            migrationBuilder.DropTable(
                name: "ReadingSessions");

            migrationBuilder.DropTable(
                name: "Grammars");

            migrationBuilder.DropTable(
                name: "ReadingPassages");

            migrationBuilder.DropTable(
                name: "GrammarTopics");

            migrationBuilder.DropTable(
                name: "ReadingTopics");

            migrationBuilder.DropTable(
                name: "GrammarGroups");

            migrationBuilder.DropIndex(
                name: "IX_Topics_TopicGuid",
                table: "Topics");

            migrationBuilder.DropColumn(
                name: "Antonyms",
                table: "Vocabularies");

            migrationBuilder.DropColumn(
                name: "Collocations",
                table: "Vocabularies");

            migrationBuilder.DropColumn(
                name: "Synonyms",
                table: "Vocabularies");

            migrationBuilder.DropColumn(
                name: "IsExplanationPremiumRequired",
                table: "Topics");

            migrationBuilder.DropColumn(
                name: "TopicGuid",
                table: "Topics");

            migrationBuilder.DropColumn(
                name: "IsExplanationPremiumRequired",
                table: "Tests");

            migrationBuilder.DropColumn(
                name: "TestGuid",
                table: "Tests");

            migrationBuilder.DropColumn(
                name: "Parts",
                table: "TestAttempts");

            migrationBuilder.AlterColumn<string>(
                name: "LevelRange",
                table: "Topics",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldDefaultValue: "0-450");

            migrationBuilder.AlterColumn<string>(
                name: "Level",
                table: "Topics",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldDefaultValue: "Basic");

            migrationBuilder.CreateTable(
                name: "UserVocabularies",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    VocabularyId = table.Column<int>(type: "int", nullable: false),
                    CorrectStreak = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastReviewedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Level = table.Column<int>(type: "int", nullable: false),
                    NextReviewAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ReviewCount = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserVocabularies", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserVocabularies_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserVocabularies_Vocabularies_VocabularyId",
                        column: x => x.VocabularyId,
                        principalTable: "Vocabularies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserVocabularies_UserId_VocabularyId",
                table: "UserVocabularies",
                columns: new[] { "UserId", "VocabularyId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserVocabularies_VocabularyId",
                table: "UserVocabularies",
                column: "VocabularyId");
        }
    }
}
