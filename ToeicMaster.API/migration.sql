IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
CREATE TABLE [Tags] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(50) NULL,
    CONSTRAINT [PK__Tags__3214EC07AC9E8EFE] PRIMARY KEY ([Id])
);

CREATE TABLE [Tests] (
    [Id] int NOT NULL IDENTITY,
    [Title] nvarchar(200) NOT NULL,
    [Slug] varchar(200) NULL,
    [Type] varchar(20) NULL,
    [Duration] int NULL DEFAULT 120,
    [TotalQuestions] int NULL DEFAULT 200,
    [TotalParticipants] int NULL DEFAULT 0,
    [IsActive] bit NULL DEFAULT CAST(1 AS bit),
    [CreatedAt] datetime2 NULL DEFAULT ((getdate())),
    CONSTRAINT [PK__Tests__3214EC074D70A308] PRIMARY KEY ([Id])
);

CREATE TABLE [Users] (
    [Id] int NOT NULL IDENTITY,
    [FullName] nvarchar(100) NULL,
    [Email] varchar(100) NOT NULL,
    [PasswordHash] varchar(255) NOT NULL,
    [AvatarUrl] varchar(500) NULL,
    [Balance] decimal(18,2) NULL DEFAULT 0.0,
    [IsPremium] bit NULL DEFAULT CAST(0 AS bit),
    [PremiumExpiredAt] datetime2 NULL,
    [CreatedAt] datetime2 NULL DEFAULT ((getdate())),
    [LastLoginAt] datetime2 NULL,
    [RefreshToken] nvarchar(max) NULL,
    [RefreshTokenExpiryTime] datetime2 NULL,
    [IsActive] bit NOT NULL,
    [Role] nvarchar(max) NULL,
    CONSTRAINT [PK__Users__3214EC07DF4B76BC] PRIMARY KEY ([Id])
);

CREATE TABLE [Parts] (
    [Id] int NOT NULL IDENTITY,
    [TestId] int NOT NULL,
    [Name] nvarchar(100) NULL,
    [PartNumber] int NULL,
    [Description] nvarchar(500) NULL,
    CONSTRAINT [PK__Parts__3214EC076FCC33CD] PRIMARY KEY ([Id]),
    CONSTRAINT [FK__Parts__TestId__20C1E124] FOREIGN KEY ([TestId]) REFERENCES [Tests] ([Id])
);

CREATE TABLE [PracticeSessions] (
    [Id] int NOT NULL IDENTITY,
    [UserId] int NOT NULL,
    [PartNumber] int NOT NULL,
    [TotalQuestions] int NOT NULL,
    [CorrectAnswers] int NOT NULL,
    [TimeSpentSeconds] int NOT NULL,
    [StartedAt] datetime2 NOT NULL,
    [CompletedAt] datetime2 NULL,
    [Status] nvarchar(20) NOT NULL,
    CONSTRAINT [PK_PracticeSessions] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_PracticeSessions_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [TestAttempts] (
    [Id] int NOT NULL IDENTITY,
    [UserId] int NOT NULL,
    [TestId] int NOT NULL,
    [StartedAt] datetime2 NOT NULL DEFAULT ((getdate())),
    [CompletedAt] datetime2 NOT NULL,
    [TotalScore] int NOT NULL,
    [ListeningScore] int NULL,
    [ReadingScore] int NULL,
    [Status] varchar(20) NULL,
    CONSTRAINT [PK__TestAtte__3214EC0766A2C919] PRIMARY KEY ([Id]),
    CONSTRAINT [FK__TestAttem__TestI__3A81B327] FOREIGN KEY ([TestId]) REFERENCES [Tests] ([Id]),
    CONSTRAINT [FK__TestAttem__UserI__398D8EEE] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id])
);

CREATE TABLE [Transactions] (
    [Id] int NOT NULL IDENTITY,
    [UserId] int NOT NULL,
    [Amount] decimal(18,2) NOT NULL,
    [Content] nvarchar(255) NULL,
    [Status] varchar(20) NULL,
    [PaymentGateway] varchar(50) NULL,
    [CreatedAt] datetime2 NULL DEFAULT ((getdate())),
    CONSTRAINT [PK__Transact__3214EC073FFCEC07] PRIMARY KEY ([Id]),
    CONSTRAINT [FK__Transacti__UserI__173876EA] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id])
);

CREATE TABLE [QuestionGroups] (
    [Id] int NOT NULL IDENTITY,
    [PartId] int NOT NULL,
    [TextContent] nvarchar(max) NULL,
    [AudioUrl] varchar(500) NULL,
    [ImageUrl] varchar(500) NULL,
    [Transcript] nvarchar(max) NULL,
    CONSTRAINT [PK__Question__3214EC07763A44F2] PRIMARY KEY ([Id]),
    CONSTRAINT [FK__QuestionG__PartI__239E4DCF] FOREIGN KEY ([PartId]) REFERENCES [Parts] ([Id])
);

CREATE TABLE [Questions] (
    [Id] int NOT NULL IDENTITY,
    [GroupId] int NOT NULL,
    [QuestionNo] int NOT NULL,
    [Content] nvarchar(max) NULL,
    [QuestionType] varchar(20) NULL,
    [CorrectOption] varchar(5) NULL,
    [ScoreWeight] decimal(5,2) NULL DEFAULT 5.0,
    [ShortExplanation] nvarchar(max) NULL,
    [FullExplanation] nvarchar(max) NULL,
    [AudioUrl] nvarchar(max) NULL,
    [Transcript] nvarchar(max) NULL,
    CONSTRAINT [PK__Question__3214EC0733666D61] PRIMARY KEY ([Id]),
    CONSTRAINT [FK__Questions__Group__276EDEB3] FOREIGN KEY ([GroupId]) REFERENCES [QuestionGroups] ([Id])
);

CREATE TABLE [Answers] (
    [Id] int NOT NULL IDENTITY,
    [QuestionId] int NOT NULL,
    [Label] varchar(5) NULL,
    [Content] nvarchar(max) NULL,
    CONSTRAINT [PK__Answers__3214EC07337BA9A4] PRIMARY KEY ([Id]),
    CONSTRAINT [FK__Answers__Questio__2A4B4B5E] FOREIGN KEY ([QuestionId]) REFERENCES [Questions] ([Id])
);

CREATE TABLE [Bookmarks] (
    [Id] int NOT NULL IDENTITY,
    [UserId] int NOT NULL,
    [QuestionId] int NOT NULL,
    [Note] nvarchar(max) NULL,
    [CreatedAt] datetime2 NOT NULL,
    CONSTRAINT [PK_Bookmarks] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Bookmarks_Questions_QuestionId] FOREIGN KEY ([QuestionId]) REFERENCES [Questions] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_Bookmarks_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [PracticeAnswers] (
    [Id] int NOT NULL IDENTITY,
    [SessionId] int NOT NULL,
    [QuestionId] int NOT NULL,
    [SelectedOption] nvarchar(5) NULL,
    [IsCorrect] bit NOT NULL,
    [AnsweredAt] datetime2 NOT NULL,
    CONSTRAINT [PK_PracticeAnswers] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_PracticeAnswers_PracticeSessions_SessionId] FOREIGN KEY ([SessionId]) REFERENCES [PracticeSessions] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_PracticeAnswers_Questions_QuestionId] FOREIGN KEY ([QuestionId]) REFERENCES [Questions] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [QuestionTags] (
    [QuestionId] int NOT NULL,
    [TagId] int NOT NULL,
    CONSTRAINT [PK__Question__DB97A0363E0ADDBE] PRIMARY KEY ([QuestionId], [TagId]),
    CONSTRAINT [FK__QuestionT__Quest__300424B4] FOREIGN KEY ([QuestionId]) REFERENCES [Questions] ([Id]),
    CONSTRAINT [FK__QuestionT__TagId__30F848ED] FOREIGN KEY ([TagId]) REFERENCES [Tags] ([Id])
);

CREATE TABLE [UserAnswers] (
    [Id] int NOT NULL IDENTITY,
    [AttemptId] int NOT NULL,
    [QuestionId] int NOT NULL,
    [SelectedOption] varchar(5) NOT NULL,
    [IsCorrect] bit NOT NULL,
    [TextResponse] nvarchar(max) NULL,
    [AudioResponseUrl] varchar(500) NULL,
    CONSTRAINT [PK__UserAnsw__3214EC077981C1D2] PRIMARY KEY ([Id]),
    CONSTRAINT [FK__UserAnswe__Attem__3D5E1FD2] FOREIGN KEY ([AttemptId]) REFERENCES [TestAttempts] ([Id]),
    CONSTRAINT [FK__UserAnswe__Quest__3E52440B] FOREIGN KEY ([QuestionId]) REFERENCES [Questions] ([Id])
);

CREATE TABLE [Vocabularies] (
    [Id] int NOT NULL IDENTITY,
    [Word] nvarchar(100) NOT NULL,
    [Pronunciation] nvarchar(200) NULL,
    [PartOfSpeech] nvarchar(20) NULL,
    [Meaning] nvarchar(500) NOT NULL,
    [Example] nvarchar(max) NULL,
    [ExampleTranslation] nvarchar(max) NULL,
    [AudioUrl] nvarchar(max) NULL,
    [ImageUrl] nvarchar(max) NULL,
    [QuestionId] int NULL,
    [Category] nvarchar(50) NULL,
    [Difficulty] int NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    CONSTRAINT [PK_Vocabularies] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Vocabularies_Questions_QuestionId] FOREIGN KEY ([QuestionId]) REFERENCES [Questions] ([Id]) ON DELETE SET NULL
);

CREATE TABLE [ReviewFeedbacks] (
    [Id] int NOT NULL IDENTITY,
    [UserAnswerId] int NOT NULL,
    [Score] decimal(4,1) NULL,
    [FeedbackJson] nvarchar(max) NULL,
    [EvaluatedAt] datetime2 NULL DEFAULT ((getdate())),
    CONSTRAINT [PK__ReviewFe__3214EC071D3362E9] PRIMARY KEY ([Id]),
    CONSTRAINT [FK__ReviewFee__UserA__4316F928] FOREIGN KEY ([UserAnswerId]) REFERENCES [UserAnswers] ([Id])
);

CREATE TABLE [UserVocabularies] (
    [Id] int NOT NULL IDENTITY,
    [UserId] int NOT NULL,
    [VocabularyId] int NOT NULL,
    [Status] int NOT NULL,
    [CorrectStreak] int NOT NULL,
    [ReviewCount] int NOT NULL,
    [NextReviewAt] datetime2 NULL,
    [LastReviewedAt] datetime2 NULL,
    [CreatedAt] datetime2 NOT NULL,
    CONSTRAINT [PK_UserVocabularies] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_UserVocabularies_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_UserVocabularies_Vocabularies_VocabularyId] FOREIGN KEY ([VocabularyId]) REFERENCES [Vocabularies] ([Id]) ON DELETE CASCADE
);

CREATE INDEX [IX_Answers_QuestionId] ON [Answers] ([QuestionId]);

CREATE INDEX [IX_Bookmarks_QuestionId] ON [Bookmarks] ([QuestionId]);

CREATE UNIQUE INDEX [IX_Bookmarks_UserId_QuestionId] ON [Bookmarks] ([UserId], [QuestionId]);

CREATE INDEX [IX_Parts_TestId] ON [Parts] ([TestId]);

CREATE INDEX [IX_PracticeAnswers_QuestionId] ON [PracticeAnswers] ([QuestionId]);

CREATE INDEX [IX_PracticeAnswers_SessionId] ON [PracticeAnswers] ([SessionId]);

CREATE INDEX [IX_PracticeSessions_UserId] ON [PracticeSessions] ([UserId]);

CREATE INDEX [IX_QuestionGroups_PartId] ON [QuestionGroups] ([PartId]);

CREATE INDEX [IX_Questions_GroupId] ON [Questions] ([GroupId]);

CREATE INDEX [IX_QuestionTags_TagId] ON [QuestionTags] ([TagId]);

CREATE UNIQUE INDEX [UQ__ReviewFe__47CE237E322AEA53] ON [ReviewFeedbacks] ([UserAnswerId]);

CREATE UNIQUE INDEX [UQ__Tags__737584F6ED28C450] ON [Tags] ([Name]) WHERE [Name] IS NOT NULL;

CREATE INDEX [IX_TestAttempts_TestId] ON [TestAttempts] ([TestId]);

CREATE INDEX [IX_TestAttempts_UserId] ON [TestAttempts] ([UserId]);

CREATE INDEX [IX_Tests_Type_IsActive] ON [Tests] ([Type], [IsActive]);

CREATE INDEX [IX_Transactions_UserId] ON [Transactions] ([UserId]);

CREATE INDEX [IX_UserAnswers_QuestionId] ON [UserAnswers] ([QuestionId]);

CREATE INDEX [IX_UserAnswers_Stat] ON [UserAnswers] ([AttemptId], [IsCorrect]);

CREATE UNIQUE INDEX [UQ__Users__A9D105345BFCEFD1] ON [Users] ([Email]);

CREATE UNIQUE INDEX [IX_UserVocabularies_UserId_VocabularyId] ON [UserVocabularies] ([UserId], [VocabularyId]);

CREATE INDEX [IX_UserVocabularies_VocabularyId] ON [UserVocabularies] ([VocabularyId]);

CREATE INDEX [IX_Vocabularies_QuestionId] ON [Vocabularies] ([QuestionId]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251220090423_InitialCreate', N'10.0.1');

COMMIT;
GO

BEGIN TRANSACTION;
DECLARE @var nvarchar(max);
SELECT @var = QUOTENAME([d].[name])
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[QuestionGroups]') AND [c].[name] = N'ImageUrl');
IF @var IS NOT NULL EXEC(N'ALTER TABLE [QuestionGroups] DROP CONSTRAINT ' + @var + ';');
ALTER TABLE [QuestionGroups] ALTER COLUMN [ImageUrl] nvarchar(max) NULL;

DECLARE @var1 nvarchar(max);
SELECT @var1 = QUOTENAME([d].[name])
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[QuestionGroups]') AND [c].[name] = N'AudioUrl');
IF @var1 IS NOT NULL EXEC(N'ALTER TABLE [QuestionGroups] DROP CONSTRAINT ' + @var1 + ';');
ALTER TABLE [QuestionGroups] ALTER COLUMN [AudioUrl] nvarchar(max) NULL;

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251220113936_ExpandColumnSizes', N'10.0.1');

COMMIT;
GO

BEGIN TRANSACTION;
DECLARE @var2 nvarchar(max);
SELECT @var2 = QUOTENAME([d].[name])
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Questions]') AND [c].[name] = N'QuestionType');
IF @var2 IS NOT NULL EXEC(N'ALTER TABLE [Questions] DROP CONSTRAINT ' + @var2 + ';');
ALTER TABLE [Questions] ALTER COLUMN [QuestionType] nvarchar(50) NULL;

DECLARE @var3 nvarchar(max);
SELECT @var3 = QUOTENAME([d].[name])
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Questions]') AND [c].[name] = N'CorrectOption');
IF @var3 IS NOT NULL EXEC(N'ALTER TABLE [Questions] DROP CONSTRAINT ' + @var3 + ';');
ALTER TABLE [Questions] ALTER COLUMN [CorrectOption] nvarchar(max) NULL;

DECLARE @var4 nvarchar(max);
SELECT @var4 = QUOTENAME([d].[name])
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Parts]') AND [c].[name] = N'Name');
IF @var4 IS NOT NULL EXEC(N'ALTER TABLE [Parts] DROP CONSTRAINT ' + @var4 + ';');
ALTER TABLE [Parts] ALTER COLUMN [Name] nvarchar(200) NULL;

DECLARE @var5 nvarchar(max);
SELECT @var5 = QUOTENAME([d].[name])
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Parts]') AND [c].[name] = N'Description');
IF @var5 IS NOT NULL EXEC(N'ALTER TABLE [Parts] DROP CONSTRAINT ' + @var5 + ';');
ALTER TABLE [Parts] ALTER COLUMN [Description] nvarchar(max) NULL;

CREATE TABLE [Comments] (
    [Id] int NOT NULL IDENTITY,
    [TestId] int NOT NULL,
    [UserId] int NOT NULL,
    [ParentCommentId] int NULL,
    [Content] nvarchar(max) NOT NULL,
    [CreatedAt] datetime2 NOT NULL DEFAULT ((getdate())),
    [UpdatedAt] datetime2 NULL,
    [IsDeleted] bit NOT NULL DEFAULT CAST(0 AS bit),
    CONSTRAINT [PK_Comments] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Comments_Comments_ParentCommentId] FOREIGN KEY ([ParentCommentId]) REFERENCES [Comments] ([Id]),
    CONSTRAINT [FK_Comments_Tests_TestId] FOREIGN KEY ([TestId]) REFERENCES [Tests] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_Comments_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [CommentLikes] (
    [Id] int NOT NULL IDENTITY,
    [CommentId] int NOT NULL,
    [UserId] int NOT NULL,
    [CreatedAt] datetime2 NOT NULL DEFAULT ((getdate())),
    CONSTRAINT [PK_CommentLikes] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_CommentLikes_Comments_CommentId] FOREIGN KEY ([CommentId]) REFERENCES [Comments] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_CommentLikes_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id])
);

CREATE UNIQUE INDEX [IX_CommentLikes_CommentId_UserId] ON [CommentLikes] ([CommentId], [UserId]);

CREATE INDEX [IX_CommentLikes_UserId] ON [CommentLikes] ([UserId]);

CREATE INDEX [IX_Comments_ParentCommentId] ON [Comments] ([ParentCommentId]);

CREATE INDEX [IX_Comments_TestId] ON [Comments] ([TestId]);

CREATE INDEX [IX_Comments_UserId] ON [Comments] ([UserId]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251220115545_AddCommentsFeature', N'10.0.1');

COMMIT;
GO

BEGIN TRANSACTION;
DECLARE @var6 nvarchar(max);
SELECT @var6 = QUOTENAME([d].[name])
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Users]') AND [c].[name] = N'Role');
IF @var6 IS NOT NULL EXEC(N'ALTER TABLE [Users] DROP CONSTRAINT ' + @var6 + ';');
UPDATE [Users] SET [Role] = N'' WHERE [Role] IS NULL;
ALTER TABLE [Users] ALTER COLUMN [Role] nvarchar(max) NOT NULL;
ALTER TABLE [Users] ADD DEFAULT N'' FOR [Role];

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251225223637_AddRoleColumn', N'10.0.1');

COMMIT;
GO

BEGIN TRANSACTION;
ALTER TABLE [Vocabularies] ADD [Icon] nvarchar(max) NULL;

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251225230721_AddIconColumn', N'10.0.1');

COMMIT;
GO

BEGIN TRANSACTION;
INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251226130541_scoreConversion', N'10.0.1');

COMMIT;
GO

BEGIN TRANSACTION;
CREATE TABLE [ScoreConversions] (
    [Id] int NOT NULL IDENTITY,
    [CorrectCount] int NOT NULL,
    [ListeningScore] int NOT NULL,
    [ReadingScore] int NOT NULL,
    CONSTRAINT [PK_ScoreConversions] PRIMARY KEY ([Id])
);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251226131423_AddScoreConversions', N'10.0.1');

COMMIT;
GO

BEGIN TRANSACTION;
ALTER TABLE [Users] ADD [OtpCode] nvarchar(max) NULL;

ALTER TABLE [Users] ADD [OtpExpiryTime] datetime2 NULL;

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251229095416_AddOtpToUser', N'10.0.1');

COMMIT;
GO

BEGIN TRANSACTION;
ALTER TABLE [TestAttempts] ADD [TimeTaken] int NOT NULL DEFAULT 0;

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251230143346_AddTimeTaken', N'10.0.1');

COMMIT;
GO

BEGIN TRANSACTION;
DECLARE @var7 nvarchar(max);
SELECT @var7 = QUOTENAME([d].[name])
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Vocabularies]') AND [c].[name] = N'Category');
IF @var7 IS NOT NULL EXEC(N'ALTER TABLE [Vocabularies] DROP CONSTRAINT ' + @var7 + ';');
ALTER TABLE [Vocabularies] DROP COLUMN [Category];

ALTER TABLE [Vocabularies] ADD [TopicId] int NULL;

CREATE TABLE [Topics] (
    [Id] int NOT NULL IDENTITY,
    [Title] nvarchar(max) NOT NULL,
    [Description] nvarchar(max) NULL,
    [ImageUrl] nvarchar(max) NULL,
    [Level] nvarchar(max) NOT NULL,
    [LevelRange] nvarchar(max) NOT NULL,
    CONSTRAINT [PK_Topics] PRIMARY KEY ([Id])
);

CREATE TABLE [WordFamilies] (
    [Id] int NOT NULL IDENTITY,
    [VocabularyId] int NOT NULL,
    [Word] nvarchar(max) NOT NULL,
    [PartOfSpeech] nvarchar(max) NOT NULL,
    [Meaning] nvarchar(max) NULL,
    CONSTRAINT [PK_WordFamilies] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_WordFamilies_Vocabularies_VocabularyId] FOREIGN KEY ([VocabularyId]) REFERENCES [Vocabularies] ([Id]) ON DELETE CASCADE
);

CREATE INDEX [IX_Vocabularies_TopicId] ON [Vocabularies] ([TopicId]);

CREATE INDEX [IX_WordFamilies_VocabularyId] ON [WordFamilies] ([VocabularyId]);

ALTER TABLE [Vocabularies] ADD CONSTRAINT [FK_Vocabularies_Topics_TopicId] FOREIGN KEY ([TopicId]) REFERENCES [Topics] ([Id]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251231152350_UpdateVocabStructure', N'10.0.1');

COMMIT;
GO

BEGIN TRANSACTION;
ALTER TABLE [Questions] ADD [TopicId] int NULL;

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260105064509_AddTopicIdToQuestion', N'10.0.1');

COMMIT;
GO

BEGIN TRANSACTION;
ALTER TABLE [Answers] ADD [IsCorrect] bit NULL;

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260105124646_UpdateAnswerIsCorrect', N'10.0.1');

COMMIT;
GO

BEGIN TRANSACTION;
ALTER TABLE [UserVocabularies] ADD [Level] int NOT NULL DEFAULT 0;

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260106143459_levelUservocabulary', N'10.0.1');

COMMIT;
GO

BEGIN TRANSACTION;
INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260107082800_newReviewVocab', N'10.0.1');

COMMIT;
GO

BEGIN TRANSACTION;
CREATE TABLE [Payments] (
    [Id] int NOT NULL IDENTITY,
    [UserId] int NOT NULL,
    [TransactionNo] nvarchar(100) NOT NULL,
    [Amount] int NOT NULL,
    [OrderInfo] nvarchar(500) NOT NULL,
    [PackageType] nvarchar(50) NOT NULL,
    [DurationMonths] int NOT NULL,
    [PaymentStatus] nvarchar(50) NOT NULL,
    [PaymentMethod] nvarchar(50) NOT NULL,
    [CreatedAt] datetime2 NOT NULL DEFAULT ((getdate())),
    [PaidAt] datetime2 NULL,
    [ResponseCode] nvarchar(10) NOT NULL,
    [ResponseMessage] nvarchar(500) NOT NULL,
    [SubscriptionStartDate] datetime2 NULL,
    [SubscriptionEndDate] datetime2 NULL,
    [IsSubscriptionActive] bit NOT NULL,
    CONSTRAINT [PK_Payments] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Payments_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id]) ON DELETE CASCADE
);

CREATE UNIQUE INDEX [IX_Payments_TransactionNo] ON [Payments] ([TransactionNo]);

CREATE INDEX [IX_Payments_UserId] ON [Payments] ([UserId]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260131025704_AddPaymentTable', N'10.0.1');

COMMIT;
GO

BEGIN TRANSACTION;
DECLARE @var8 nvarchar(max);
SELECT @var8 = QUOTENAME([d].[name])
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Payments]') AND [c].[name] = N'ResponseMessage');
IF @var8 IS NOT NULL EXEC(N'ALTER TABLE [Payments] DROP CONSTRAINT ' + @var8 + ';');
ALTER TABLE [Payments] ALTER COLUMN [ResponseMessage] nvarchar(500) NULL;

DECLARE @var9 nvarchar(max);
SELECT @var9 = QUOTENAME([d].[name])
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Payments]') AND [c].[name] = N'ResponseCode');
IF @var9 IS NOT NULL EXEC(N'ALTER TABLE [Payments] DROP CONSTRAINT ' + @var9 + ';');
ALTER TABLE [Payments] ALTER COLUMN [ResponseCode] nvarchar(10) NULL;

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260207_MakePaymentResponseFieldsNullable', N'10.0.1');

COMMIT;
GO

BEGIN TRANSACTION;
ALTER TABLE [QuestionGroups] ADD [AudioDuration] int NULL;

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260317122537_AddAudioDurationToQuestionGroup', N'10.0.1');

COMMIT;
GO

BEGIN TRANSACTION;
ALTER TABLE [TestAttempts] ADD [AttemptGuid] uniqueidentifier NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000';

UPDATE TestAttempts SET AttemptGuid = NEWID()

CREATE TABLE [QuestionVocab] (
    [Id] int NOT NULL IDENTITY,
    [TopicId] int NOT NULL,
    [QuestionNo] int NOT NULL,
    [Content] nvarchar(max) NULL,
    [CorrectOption] nvarchar(5) NULL,
    [ShortExplanation] nvarchar(max) NULL,
    [LongExplanation] nvarchar(max) NULL,
    CONSTRAINT [PK_QuestionVocab] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_QuestionVocab_Topics_TopicId] FOREIGN KEY ([TopicId]) REFERENCES [Topics] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [QuestionVocabAnswer] (
    [Id] int NOT NULL IDENTITY,
    [QuestionVocabId] int NOT NULL,
    [Label] nvarchar(5) NULL,
    [Content] nvarchar(max) NULL,
    [IsCorrect] bit NOT NULL,
    CONSTRAINT [PK_QuestionVocabAnswer] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_QuestionVocabAnswer_QuestionVocab_QuestionVocabId] FOREIGN KEY ([QuestionVocabId]) REFERENCES [QuestionVocab] ([Id]) ON DELETE CASCADE
);

CREATE INDEX [IX_QuestionVocab_TopicId] ON [QuestionVocab] ([TopicId]);

CREATE INDEX [IX_QuestionVocabAnswer_QuestionVocabId] ON [QuestionVocabAnswer] ([QuestionVocabId]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260325043958_AddAttemptGuidAndVocabFeatures', N'10.0.1');

COMMIT;
GO

BEGIN TRANSACTION;
CREATE TABLE [GrammarTopics] (
    [Id] int NOT NULL IDENTITY,
    [Title] nvarchar(max) NOT NULL,
    [Description] nvarchar(max) NULL,
    [ImageUrl] nvarchar(max) NULL,
    [Level] nvarchar(max) NOT NULL,
    [LevelRange] nvarchar(max) NOT NULL,
    [Category] nvarchar(max) NOT NULL,
    CONSTRAINT [PK_GrammarTopics] PRIMARY KEY ([Id])
);

CREATE TABLE [Grammars] (
    [Id] int NOT NULL IDENTITY,
    [TopicId] int NOT NULL,
    [RuleName] nvarchar(max) NOT NULL,
    [Structure] nvarchar(max) NULL,
    [Meaning] nvarchar(max) NOT NULL,
    [Example] nvarchar(max) NULL,
    [ExampleTranslation] nvarchar(max) NULL,
    [AudioUrl] nvarchar(max) NULL,
    [ImageUrl] nvarchar(max) NULL,
    [CommonMistakes] nvarchar(max) NULL,
    [Difficulty] int NOT NULL,
    [CreatedAt] datetime2 NOT NULL DEFAULT ((getdate())),
    CONSTRAINT [PK_Grammars] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Grammars_GrammarTopics_TopicId] FOREIGN KEY ([TopicId]) REFERENCES [GrammarTopics] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [GrammarExamples] (
    [Id] int NOT NULL IDENTITY,
    [GrammarId] int NOT NULL,
    [Sentence] nvarchar(max) NOT NULL,
    [Translation] nvarchar(max) NULL,
    [Context] nvarchar(max) NULL,
    [AudioUrl] nvarchar(max) NULL,
    CONSTRAINT [PK_GrammarExamples] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_GrammarExamples_Grammars_GrammarId] FOREIGN KEY ([GrammarId]) REFERENCES [Grammars] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [UserGrammars] (
    [Id] int NOT NULL IDENTITY,
    [UserId] int NOT NULL,
    [GrammarId] int NOT NULL,
    [Status] int NOT NULL,
    [CorrectStreak] int NOT NULL,
    [ReviewCount] int NOT NULL,
    [NextReviewAt] datetime2 NULL,
    [LastReviewedAt] datetime2 NULL,
    [Level] int NOT NULL DEFAULT 0,
    [CreatedAt] datetime2 NOT NULL DEFAULT ((getdate())),
    CONSTRAINT [PK_UserGrammars] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_UserGrammars_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_UserGrammars_Grammars_GrammarId] FOREIGN KEY ([GrammarId]) REFERENCES [Grammars] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [QuestionGrammar] (
    [Id] int NOT NULL IDENTITY,
    [TopicId] int NOT NULL,
    [QuestionNo] int NOT NULL,
    [Content] nvarchar(max) NULL,
    [CorrectOption] nvarchar(5) NULL,
    [ShortExplanation] nvarchar(max) NULL,
    [LongExplanation] nvarchar(max) NULL,
    CONSTRAINT [PK_QuestionGrammar] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_QuestionGrammar_GrammarTopics_TopicId] FOREIGN KEY ([TopicId]) REFERENCES [GrammarTopics] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [QuestionGrammarAnswer] (
    [Id] int NOT NULL IDENTITY,
    [QuestionGrammarId] int NOT NULL,
    [Label] nvarchar(5) NULL,
    [Content] nvarchar(max) NULL,
    [IsCorrect] bit NOT NULL,
    CONSTRAINT [PK_QuestionGrammarAnswer] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_QuestionGrammarAnswer_QuestionGrammar_QuestionGrammarId] FOREIGN KEY ([QuestionGrammarId]) REFERENCES [QuestionGrammar] ([Id]) ON DELETE CASCADE
);

CREATE INDEX [IX_Grammars_TopicId] ON [Grammars] ([TopicId]);

CREATE INDEX [IX_GrammarExamples_GrammarId] ON [GrammarExamples] ([GrammarId]);

CREATE UNIQUE INDEX [IX_UserGrammars_UserId_GrammarId] ON [UserGrammars] ([UserId], [GrammarId]);

CREATE INDEX [IX_UserGrammars_GrammarId] ON [UserGrammars] ([GrammarId]);

CREATE INDEX [IX_QuestionGrammar_TopicId] ON [QuestionGrammar] ([TopicId]);

CREATE INDEX [IX_QuestionGrammarAnswer_QuestionGrammarId] ON [QuestionGrammarAnswer] ([QuestionGrammarId]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260414_AddGrammarFeature', N'10.0.1');

COMMIT;
GO

