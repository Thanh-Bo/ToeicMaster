/****** Object:  Table [dbo].[__EFMigrationsHistory]    Script Date: 3/8/2026 1:07:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[__EFMigrationsHistory](
	[MigrationId] [nvarchar](150) NOT NULL,
	[ProductVersion] [nvarchar](32) NOT NULL,
 CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY CLUSTERED 
(
	[MigrationId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Answers]    Script Date: 3/8/2026 1:07:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Answers](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[QuestionId] [int] NOT NULL,
	[Label] [varchar](5) NULL,
	[Content] [nvarchar](max) NULL,
	[IsCorrect] [bit] NULL,
 CONSTRAINT [PK__Answers__3214EC07337BA9A4] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Bookmarks]    Script Date: 3/8/2026 1:07:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Bookmarks](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [int] NOT NULL,
	[QuestionId] [int] NOT NULL,
	[Note] [nvarchar](max) NULL,
	[CreatedAt] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_Bookmarks] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CommentLikes]    Script Date: 3/8/2026 1:07:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CommentLikes](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[CommentId] [int] NOT NULL,
	[UserId] [int] NOT NULL,
	[CreatedAt] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_CommentLikes] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Comments]    Script Date: 3/8/2026 1:07:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Comments](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[TestId] [int] NOT NULL,
	[UserId] [int] NOT NULL,
	[ParentCommentId] [int] NULL,
	[Content] [nvarchar](max) NOT NULL,
	[CreatedAt] [datetime2](7) NOT NULL,
	[UpdatedAt] [datetime2](7) NULL,
	[IsDeleted] [bit] NOT NULL,
 CONSTRAINT [PK_Comments] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Parts]    Script Date: 3/8/2026 1:07:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Parts](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[TestId] [int] NOT NULL,
	[Name] [nvarchar](200) NULL,
	[PartNumber] [int] NULL,
	[Description] [nvarchar](max) NULL,
 CONSTRAINT [PK__Parts__3214EC076FCC33CD] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Payments]    Script Date: 3/8/2026 1:07:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Payments](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [int] NOT NULL,
	[TransactionNo] [nvarchar](100) NOT NULL,
	[Amount] [int] NOT NULL,
	[OrderInfo] [nvarchar](500) NOT NULL,
	[PackageType] [nvarchar](50) NOT NULL,
	[DurationMonths] [int] NOT NULL,
	[PaymentStatus] [nvarchar](50) NOT NULL,
	[PaymentMethod] [nvarchar](50) NOT NULL,
	[CreatedAt] [datetime2](7) NOT NULL,
	[PaidAt] [datetime2](7) NULL,
	[ResponseCode] [nvarchar](10) NULL,
	[ResponseMessage] [nvarchar](500) NULL,
	[SubscriptionStartDate] [datetime2](7) NULL,
	[SubscriptionEndDate] [datetime2](7) NULL,
	[IsSubscriptionActive] [bit] NOT NULL,
 CONSTRAINT [PK_Payments] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PracticeAnswers]    Script Date: 3/8/2026 1:07:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PracticeAnswers](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[SessionId] [int] NOT NULL,
	[QuestionId] [int] NOT NULL,
	[SelectedOption] [nvarchar](5) NULL,
	[IsCorrect] [bit] NOT NULL,
	[AnsweredAt] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_PracticeAnswers] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PracticeSessions]    Script Date: 3/8/2026 1:07:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PracticeSessions](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [int] NOT NULL,
	[PartNumber] [int] NOT NULL,
	[TotalQuestions] [int] NOT NULL,
	[CorrectAnswers] [int] NOT NULL,
	[TimeSpentSeconds] [int] NOT NULL,
	[StartedAt] [datetime2](7) NOT NULL,
	[CompletedAt] [datetime2](7) NULL,
	[Status] [nvarchar](20) NOT NULL,
 CONSTRAINT [PK_PracticeSessions] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[QuestionGroups]    Script Date: 3/8/2026 1:07:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[QuestionGroups](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[PartId] [int] NOT NULL,
	[TextContent] [nvarchar](max) NULL,
	[AudioUrl] [nvarchar](max) NULL,
	[ImageUrl] [nvarchar](max) NULL,
	[Transcript] [nvarchar](max) NULL,
 CONSTRAINT [PK__Question__3214EC07763A44F2] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Questions]    Script Date: 3/8/2026 1:07:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Questions](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[GroupId] [int] NOT NULL,
	[QuestionNo] [int] NOT NULL,
	[Content] [nvarchar](max) NULL,
	[QuestionType] [nvarchar](50) NULL,
	[CorrectOption] [nvarchar](max) NULL,
	[ScoreWeight] [decimal](5, 2) NULL,
	[ShortExplanation] [nvarchar](max) NULL,
	[FullExplanation] [nvarchar](max) NULL,
	[AudioUrl] [nvarchar](max) NULL,
	[Transcript] [nvarchar](max) NULL,
	[TopicId] [int] NULL,
 CONSTRAINT [PK__Question__3214EC0733666D61] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[QuestionTags]    Script Date: 3/8/2026 1:07:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[QuestionTags](
	[QuestionId] [int] NOT NULL,
	[TagId] [int] NOT NULL,
 CONSTRAINT [PK__Question__DB97A0363E0ADDBE] PRIMARY KEY CLUSTERED 
(
	[QuestionId] ASC,
	[TagId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ReviewFeedbacks]    Script Date: 3/8/2026 1:07:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ReviewFeedbacks](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[UserAnswerId] [int] NOT NULL,
	[Score] [decimal](4, 1) NULL,
	[FeedbackJson] [nvarchar](max) NULL,
	[EvaluatedAt] [datetime2](7) NULL,
 CONSTRAINT [PK__ReviewFe__3214EC071D3362E9] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ScoreConversions]    Script Date: 3/8/2026 1:07:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ScoreConversions](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[CorrectCount] [int] NOT NULL,
	[ListeningScore] [int] NOT NULL,
	[ReadingScore] [int] NOT NULL,
 CONSTRAINT [PK_ScoreConversions] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Tags]    Script Date: 3/8/2026 1:07:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Tags](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](50) NULL,
 CONSTRAINT [PK__Tags__3214EC07AC9E8EFE] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[TestAttempts]    Script Date: 3/8/2026 1:07:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TestAttempts](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [int] NOT NULL,
	[TestId] [int] NOT NULL,
	[StartedAt] [datetime2](7) NOT NULL,
	[CompletedAt] [datetime2](7) NOT NULL,
	[TotalScore] [int] NOT NULL,
	[ListeningScore] [int] NULL,
	[ReadingScore] [int] NULL,
	[Status] [varchar](20) NULL,
	[TimeTaken] [int] NOT NULL,
 CONSTRAINT [PK__TestAtte__3214EC0766A2C919] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Tests]    Script Date: 3/8/2026 1:07:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Tests](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Title] [nvarchar](200) NOT NULL,
	[Slug] [varchar](200) NULL,
	[Type] [varchar](20) NULL,
	[Duration] [int] NULL,
	[TotalQuestions] [int] NULL,
	[TotalParticipants] [int] NULL,
	[IsActive] [bit] NULL,
	[CreatedAt] [datetime2](7) NULL,
 CONSTRAINT [PK__Tests__3214EC074D70A308] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Topics]    Script Date: 3/8/2026 1:07:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Topics](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Title] [nvarchar](max) NOT NULL,
	[Description] [nvarchar](max) NULL,
	[ImageUrl] [nvarchar](max) NULL,
	[Level] [nvarchar](max) NOT NULL,
	[LevelRange] [nvarchar](max) NOT NULL,
 CONSTRAINT [PK_Topics] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Transactions]    Script Date: 3/8/2026 1:07:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Transactions](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [int] NOT NULL,
	[Amount] [decimal](18, 2) NOT NULL,
	[Content] [nvarchar](255) NULL,
	[Status] [varchar](20) NULL,
	[PaymentGateway] [varchar](50) NULL,
	[CreatedAt] [datetime2](7) NULL,
 CONSTRAINT [PK__Transact__3214EC073FFCEC07] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[UserAnswers]    Script Date: 3/8/2026 1:07:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UserAnswers](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[AttemptId] [int] NOT NULL,
	[QuestionId] [int] NOT NULL,
	[SelectedOption] [varchar](5) NOT NULL,
	[IsCorrect] [bit] NOT NULL,
	[TextResponse] [nvarchar](max) NULL,
	[AudioResponseUrl] [varchar](500) NULL,
 CONSTRAINT [PK__UserAnsw__3214EC077981C1D2] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Users]    Script Date: 3/8/2026 1:07:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Users](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[FullName] [nvarchar](100) NULL,
	[Email] [varchar](100) NOT NULL,
	[PasswordHash] [varchar](255) NOT NULL,
	[AvatarUrl] [varchar](500) NULL,
	[Balance] [decimal](18, 2) NULL,
	[IsPremium] [bit] NULL,
	[PremiumExpiredAt] [datetime2](7) NULL,
	[CreatedAt] [datetime2](7) NULL,
	[LastLoginAt] [datetime2](7) NULL,
	[RefreshToken] [nvarchar](max) NULL,
	[RefreshTokenExpiryTime] [datetime2](7) NULL,
	[IsActive] [bit] NOT NULL,
	[Role] [nvarchar](max) NOT NULL,
	[OtpCode] [nvarchar](max) NULL,
	[OtpExpiryTime] [datetime2](7) NULL,
 CONSTRAINT [PK__Users__3214EC07DF4B76BC] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[UserVocabularies]    Script Date: 3/8/2026 1:07:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UserVocabularies](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [int] NOT NULL,
	[VocabularyId] [int] NOT NULL,
	[Status] [int] NOT NULL,
	[CorrectStreak] [int] NOT NULL,
	[ReviewCount] [int] NOT NULL,
	[NextReviewAt] [datetime2](7) NULL,
	[LastReviewedAt] [datetime2](7) NULL,
	[CreatedAt] [datetime2](7) NOT NULL,
	[Level] [int] NOT NULL,
 CONSTRAINT [PK_UserVocabularies] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Vocabularies]    Script Date: 3/8/2026 1:07:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Vocabularies](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Word] [nvarchar](100) NOT NULL,
	[Pronunciation] [nvarchar](200) NULL,
	[PartOfSpeech] [nvarchar](20) NULL,
	[Meaning] [nvarchar](500) NOT NULL,
	[Example] [nvarchar](max) NULL,
	[ExampleTranslation] [nvarchar](max) NULL,
	[AudioUrl] [nvarchar](max) NULL,
	[ImageUrl] [nvarchar](max) NULL,
	[QuestionId] [int] NULL,
	[Difficulty] [int] NOT NULL,
	[CreatedAt] [datetime2](7) NOT NULL,
	[Icon] [nvarchar](max) NULL,
	[TopicId] [int] NULL,
 CONSTRAINT [PK_Vocabularies] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[WordFamilies]    Script Date: 3/8/2026 1:07:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[WordFamilies](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[VocabularyId] [int] NOT NULL,
	[Word] [nvarchar](max) NOT NULL,
	[PartOfSpeech] [nvarchar](max) NOT NULL,
	[Meaning] [nvarchar](max) NULL,
 CONSTRAINT [PK_WordFamilies] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Index [IX_Answers_QuestionId]    Script Date: 3/8/2026 1:07:56 PM ******/
CREATE NONCLUSTERED INDEX [IX_Answers_QuestionId] ON [dbo].[Answers]
(
	[QuestionId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_Bookmarks_QuestionId]    Script Date: 3/8/2026 1:07:56 PM ******/
CREATE NONCLUSTERED INDEX [IX_Bookmarks_QuestionId] ON [dbo].[Bookmarks]
(
	[QuestionId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_Bookmarks_UserId_QuestionId]    Script Date: 3/8/2026 1:07:56 PM ******/
CREATE UNIQUE NONCLUSTERED INDEX [IX_Bookmarks_UserId_QuestionId] ON [dbo].[Bookmarks]
(
	[UserId] ASC,
	[QuestionId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_CommentLikes_CommentId_UserId]    Script Date: 3/8/2026 1:07:56 PM ******/
CREATE UNIQUE NONCLUSTERED INDEX [IX_CommentLikes_CommentId_UserId] ON [dbo].[CommentLikes]
(
	[CommentId] ASC,
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_CommentLikes_UserId]    Script Date: 3/8/2026 1:07:56 PM ******/
CREATE NONCLUSTERED INDEX [IX_CommentLikes_UserId] ON [dbo].[CommentLikes]
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_Comments_ParentCommentId]    Script Date: 3/8/2026 1:07:56 PM ******/
CREATE NONCLUSTERED INDEX [IX_Comments_ParentCommentId] ON [dbo].[Comments]
(
	[ParentCommentId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_Comments_TestId]    Script Date: 3/8/2026 1:07:56 PM ******/
CREATE NONCLUSTERED INDEX [IX_Comments_TestId] ON [dbo].[Comments]
(
	[TestId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_Comments_UserId]    Script Date: 3/8/2026 1:07:56 PM ******/
CREATE NONCLUSTERED INDEX [IX_Comments_UserId] ON [dbo].[Comments]
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_Parts_TestId]    Script Date: 3/8/2026 1:07:56 PM ******/
CREATE NONCLUSTERED INDEX [IX_Parts_TestId] ON [dbo].[Parts]
(
	[TestId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_Payments_TransactionNo]    Script Date: 3/8/2026 1:07:56 PM ******/
CREATE UNIQUE NONCLUSTERED INDEX [IX_Payments_TransactionNo] ON [dbo].[Payments]
(
	[TransactionNo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_Payments_UserId]    Script Date: 3/8/2026 1:07:56 PM ******/
CREATE NONCLUSTERED INDEX [IX_Payments_UserId] ON [dbo].[Payments]
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_PracticeAnswers_QuestionId]    Script Date: 3/8/2026 1:07:56 PM ******/
CREATE NONCLUSTERED INDEX [IX_PracticeAnswers_QuestionId] ON [dbo].[PracticeAnswers]
(
	[QuestionId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_PracticeAnswers_SessionId]    Script Date: 3/8/2026 1:07:56 PM ******/
CREATE NONCLUSTERED INDEX [IX_PracticeAnswers_SessionId] ON [dbo].[PracticeAnswers]
(
	[SessionId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_PracticeSessions_UserId]    Script Date: 3/8/2026 1:07:56 PM ******/
CREATE NONCLUSTERED INDEX [IX_PracticeSessions_UserId] ON [dbo].[PracticeSessions]
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_QuestionGroups_PartId]    Script Date: 3/8/2026 1:07:56 PM ******/
CREATE NONCLUSTERED INDEX [IX_QuestionGroups_PartId] ON [dbo].[QuestionGroups]
(
	[PartId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_Questions_GroupId]    Script Date: 3/8/2026 1:07:56 PM ******/
CREATE NONCLUSTERED INDEX [IX_Questions_GroupId] ON [dbo].[Questions]
(
	[GroupId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_QuestionTags_TagId]    Script Date: 3/8/2026 1:07:56 PM ******/
CREATE NONCLUSTERED INDEX [IX_QuestionTags_TagId] ON [dbo].[QuestionTags]
(
	[TagId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [UQ__ReviewFe__47CE237E322AEA53]    Script Date: 3/8/2026 1:07:56 PM ******/
CREATE UNIQUE NONCLUSTERED INDEX [UQ__ReviewFe__47CE237E322AEA53] ON [dbo].[ReviewFeedbacks]
(
	[UserAnswerId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__Tags__737584F6ED28C450]    Script Date: 3/8/2026 1:07:56 PM ******/
CREATE UNIQUE NONCLUSTERED INDEX [UQ__Tags__737584F6ED28C450] ON [dbo].[Tags]
(
	[Name] ASC
)
WHERE ([Name] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_TestAttempts_TestId]    Script Date: 3/8/2026 1:07:56 PM ******/
CREATE NONCLUSTERED INDEX [IX_TestAttempts_TestId] ON [dbo].[TestAttempts]
(
	[TestId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_TestAttempts_UserId]    Script Date: 3/8/2026 1:07:56 PM ******/
CREATE NONCLUSTERED INDEX [IX_TestAttempts_UserId] ON [dbo].[TestAttempts]
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_Tests_Type_IsActive]    Script Date: 3/8/2026 1:07:56 PM ******/
CREATE NONCLUSTERED INDEX [IX_Tests_Type_IsActive] ON [dbo].[Tests]
(
	[Type] ASC,
	[IsActive] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_Transactions_UserId]    Script Date: 3/8/2026 1:07:56 PM ******/
CREATE NONCLUSTERED INDEX [IX_Transactions_UserId] ON [dbo].[Transactions]
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_UserAnswers_QuestionId]    Script Date: 3/8/2026 1:07:56 PM ******/
CREATE NONCLUSTERED INDEX [IX_UserAnswers_QuestionId] ON [dbo].[UserAnswers]
(
	[QuestionId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_UserAnswers_Stat]    Script Date: 3/8/2026 1:07:56 PM ******/
CREATE NONCLUSTERED INDEX [IX_UserAnswers_Stat] ON [dbo].[UserAnswers]
(
	[AttemptId] ASC,
	[IsCorrect] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__Users__A9D105345BFCEFD1]    Script Date: 3/8/2026 1:07:56 PM ******/
CREATE UNIQUE NONCLUSTERED INDEX [UQ__Users__A9D105345BFCEFD1] ON [dbo].[Users]
(
	[Email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_UserVocabularies_UserId_VocabularyId]    Script Date: 3/8/2026 1:07:56 PM ******/
CREATE UNIQUE NONCLUSTERED INDEX [IX_UserVocabularies_UserId_VocabularyId] ON [dbo].[UserVocabularies]
(
	[UserId] ASC,
	[VocabularyId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_UserVocabularies_VocabularyId]    Script Date: 3/8/2026 1:07:56 PM ******/
CREATE NONCLUSTERED INDEX [IX_UserVocabularies_VocabularyId] ON [dbo].[UserVocabularies]
(
	[VocabularyId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_Vocabularies_QuestionId]    Script Date: 3/8/2026 1:07:56 PM ******/
CREATE NONCLUSTERED INDEX [IX_Vocabularies_QuestionId] ON [dbo].[Vocabularies]
(
	[QuestionId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_Vocabularies_TopicId]    Script Date: 3/8/2026 1:07:56 PM ******/
CREATE NONCLUSTERED INDEX [IX_Vocabularies_TopicId] ON [dbo].[Vocabularies]
(
	[TopicId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_WordFamilies_VocabularyId]    Script Date: 3/8/2026 1:07:56 PM ******/
CREATE NONCLUSTERED INDEX [IX_WordFamilies_VocabularyId] ON [dbo].[WordFamilies]
(
	[VocabularyId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [dbo].[CommentLikes] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[Comments] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[Comments] ADD  DEFAULT (CONVERT([bit],(0))) FOR [IsDeleted]
GO
ALTER TABLE [dbo].[Payments] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[Questions] ADD  DEFAULT ((5.0)) FOR [ScoreWeight]
GO
ALTER TABLE [dbo].[ReviewFeedbacks] ADD  DEFAULT (getdate()) FOR [EvaluatedAt]
GO
ALTER TABLE [dbo].[TestAttempts] ADD  DEFAULT (getdate()) FOR [StartedAt]
GO
ALTER TABLE [dbo].[TestAttempts] ADD  DEFAULT ((0)) FOR [TimeTaken]
GO
ALTER TABLE [dbo].[Tests] ADD  DEFAULT ((120)) FOR [Duration]
GO
ALTER TABLE [dbo].[Tests] ADD  DEFAULT ((200)) FOR [TotalQuestions]
GO
ALTER TABLE [dbo].[Tests] ADD  DEFAULT ((0)) FOR [TotalParticipants]
GO
ALTER TABLE [dbo].[Tests] ADD  DEFAULT (CONVERT([bit],(1))) FOR [IsActive]
GO
ALTER TABLE [dbo].[Tests] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[Transactions] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT ((0.0)) FOR [Balance]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT (CONVERT([bit],(0))) FOR [IsPremium]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT (N'') FOR [Role]
GO
ALTER TABLE [dbo].[UserVocabularies] ADD  DEFAULT ((0)) FOR [Level]
GO
ALTER TABLE [dbo].[Answers]  WITH CHECK ADD  CONSTRAINT [FK__Answers__Questio__2A4B4B5E] FOREIGN KEY([QuestionId])
REFERENCES [dbo].[Questions] ([Id])
GO
ALTER TABLE [dbo].[Answers] CHECK CONSTRAINT [FK__Answers__Questio__2A4B4B5E]
GO
ALTER TABLE [dbo].[Bookmarks]  WITH CHECK ADD  CONSTRAINT [FK_Bookmarks_Questions_QuestionId] FOREIGN KEY([QuestionId])
REFERENCES [dbo].[Questions] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Bookmarks] CHECK CONSTRAINT [FK_Bookmarks_Questions_QuestionId]
GO
ALTER TABLE [dbo].[Bookmarks]  WITH CHECK ADD  CONSTRAINT [FK_Bookmarks_Users_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Bookmarks] CHECK CONSTRAINT [FK_Bookmarks_Users_UserId]
GO
ALTER TABLE [dbo].[CommentLikes]  WITH CHECK ADD  CONSTRAINT [FK_CommentLikes_Comments_CommentId] FOREIGN KEY([CommentId])
REFERENCES [dbo].[Comments] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[CommentLikes] CHECK CONSTRAINT [FK_CommentLikes_Comments_CommentId]
GO
ALTER TABLE [dbo].[CommentLikes]  WITH CHECK ADD  CONSTRAINT [FK_CommentLikes_Users_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[CommentLikes] CHECK CONSTRAINT [FK_CommentLikes_Users_UserId]
GO
ALTER TABLE [dbo].[Comments]  WITH CHECK ADD  CONSTRAINT [FK_Comments_Comments_ParentCommentId] FOREIGN KEY([ParentCommentId])
REFERENCES [dbo].[Comments] ([Id])
GO
ALTER TABLE [dbo].[Comments] CHECK CONSTRAINT [FK_Comments_Comments_ParentCommentId]
GO
ALTER TABLE [dbo].[Comments]  WITH CHECK ADD  CONSTRAINT [FK_Comments_Tests_TestId] FOREIGN KEY([TestId])
REFERENCES [dbo].[Tests] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Comments] CHECK CONSTRAINT [FK_Comments_Tests_TestId]
GO
ALTER TABLE [dbo].[Comments]  WITH CHECK ADD  CONSTRAINT [FK_Comments_Users_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Comments] CHECK CONSTRAINT [FK_Comments_Users_UserId]
GO
ALTER TABLE [dbo].[Parts]  WITH CHECK ADD  CONSTRAINT [FK__Parts__TestId__20C1E124] FOREIGN KEY([TestId])
REFERENCES [dbo].[Tests] ([Id])
GO
ALTER TABLE [dbo].[Parts] CHECK CONSTRAINT [FK__Parts__TestId__20C1E124]
GO
ALTER TABLE [dbo].[Payments]  WITH CHECK ADD  CONSTRAINT [FK_Payments_Users_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Payments] CHECK CONSTRAINT [FK_Payments_Users_UserId]
GO
ALTER TABLE [dbo].[PracticeAnswers]  WITH CHECK ADD  CONSTRAINT [FK_PracticeAnswers_PracticeSessions_SessionId] FOREIGN KEY([SessionId])
REFERENCES [dbo].[PracticeSessions] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[PracticeAnswers] CHECK CONSTRAINT [FK_PracticeAnswers_PracticeSessions_SessionId]
GO
ALTER TABLE [dbo].[PracticeAnswers]  WITH CHECK ADD  CONSTRAINT [FK_PracticeAnswers_Questions_QuestionId] FOREIGN KEY([QuestionId])
REFERENCES [dbo].[Questions] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[PracticeAnswers] CHECK CONSTRAINT [FK_PracticeAnswers_Questions_QuestionId]
GO
ALTER TABLE [dbo].[PracticeSessions]  WITH CHECK ADD  CONSTRAINT [FK_PracticeSessions_Users_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[PracticeSessions] CHECK CONSTRAINT [FK_PracticeSessions_Users_UserId]
GO
ALTER TABLE [dbo].[QuestionGroups]  WITH CHECK ADD  CONSTRAINT [FK__QuestionG__PartI__239E4DCF] FOREIGN KEY([PartId])
REFERENCES [dbo].[Parts] ([Id])
GO
ALTER TABLE [dbo].[QuestionGroups] CHECK CONSTRAINT [FK__QuestionG__PartI__239E4DCF]
GO
ALTER TABLE [dbo].[Questions]  WITH CHECK ADD  CONSTRAINT [FK__Questions__Group__276EDEB3] FOREIGN KEY([GroupId])
REFERENCES [dbo].[QuestionGroups] ([Id])
GO
ALTER TABLE [dbo].[Questions] CHECK CONSTRAINT [FK__Questions__Group__276EDEB3]
GO
ALTER TABLE [dbo].[QuestionTags]  WITH CHECK ADD  CONSTRAINT [FK__QuestionT__Quest__300424B4] FOREIGN KEY([QuestionId])
REFERENCES [dbo].[Questions] ([Id])
GO
ALTER TABLE [dbo].[QuestionTags] CHECK CONSTRAINT [FK__QuestionT__Quest__300424B4]
GO
ALTER TABLE [dbo].[QuestionTags]  WITH CHECK ADD  CONSTRAINT [FK__QuestionT__TagId__30F848ED] FOREIGN KEY([TagId])
REFERENCES [dbo].[Tags] ([Id])
GO
ALTER TABLE [dbo].[QuestionTags] CHECK CONSTRAINT [FK__QuestionT__TagId__30F848ED]
GO
ALTER TABLE [dbo].[ReviewFeedbacks]  WITH CHECK ADD  CONSTRAINT [FK__ReviewFee__UserA__4316F928] FOREIGN KEY([UserAnswerId])
REFERENCES [dbo].[UserAnswers] ([Id])
GO
ALTER TABLE [dbo].[ReviewFeedbacks] CHECK CONSTRAINT [FK__ReviewFee__UserA__4316F928]
GO
ALTER TABLE [dbo].[TestAttempts]  WITH CHECK ADD  CONSTRAINT [FK__TestAttem__TestI__3A81B327] FOREIGN KEY([TestId])
REFERENCES [dbo].[Tests] ([Id])
GO
ALTER TABLE [dbo].[TestAttempts] CHECK CONSTRAINT [FK__TestAttem__TestI__3A81B327]
GO
ALTER TABLE [dbo].[TestAttempts]  WITH CHECK ADD  CONSTRAINT [FK__TestAttem__UserI__398D8EEE] FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[TestAttempts] CHECK CONSTRAINT [FK__TestAttem__UserI__398D8EEE]
GO
ALTER TABLE [dbo].[Transactions]  WITH CHECK ADD  CONSTRAINT [FK__Transacti__UserI__173876EA] FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[Transactions] CHECK CONSTRAINT [FK__Transacti__UserI__173876EA]
GO
ALTER TABLE [dbo].[UserAnswers]  WITH CHECK ADD  CONSTRAINT [FK__UserAnswe__Attem__3D5E1FD2] FOREIGN KEY([AttemptId])
REFERENCES [dbo].[TestAttempts] ([Id])
GO
ALTER TABLE [dbo].[UserAnswers] CHECK CONSTRAINT [FK__UserAnswe__Attem__3D5E1FD2]
GO
ALTER TABLE [dbo].[UserAnswers]  WITH CHECK ADD  CONSTRAINT [FK__UserAnswe__Quest__3E52440B] FOREIGN KEY([QuestionId])
REFERENCES [dbo].[Questions] ([Id])
GO
ALTER TABLE [dbo].[UserAnswers] CHECK CONSTRAINT [FK__UserAnswe__Quest__3E52440B]
GO
ALTER TABLE [dbo].[UserVocabularies]  WITH CHECK ADD  CONSTRAINT [FK_UserVocabularies_Users_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[UserVocabularies] CHECK CONSTRAINT [FK_UserVocabularies_Users_UserId]
GO
ALTER TABLE [dbo].[UserVocabularies]  WITH CHECK ADD  CONSTRAINT [FK_UserVocabularies_Vocabularies_VocabularyId] FOREIGN KEY([VocabularyId])
REFERENCES [dbo].[Vocabularies] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[UserVocabularies] CHECK CONSTRAINT [FK_UserVocabularies_Vocabularies_VocabularyId]
GO
ALTER TABLE [dbo].[Vocabularies]  WITH CHECK ADD  CONSTRAINT [FK_Vocabularies_Questions_QuestionId] FOREIGN KEY([QuestionId])
REFERENCES [dbo].[Questions] ([Id])
ON DELETE SET NULL
GO
ALTER TABLE [dbo].[Vocabularies] CHECK CONSTRAINT [FK_Vocabularies_Questions_QuestionId]
GO
ALTER TABLE [dbo].[Vocabularies]  WITH CHECK ADD  CONSTRAINT [FK_Vocabularies_Topics_TopicId] FOREIGN KEY([TopicId])
REFERENCES [dbo].[Topics] ([Id])
GO
ALTER TABLE [dbo].[Vocabularies] CHECK CONSTRAINT [FK_Vocabularies_Topics_TopicId]
GO
ALTER TABLE [dbo].[WordFamilies]  WITH CHECK ADD  CONSTRAINT [FK_WordFamilies_Vocabularies_VocabularyId] FOREIGN KEY([VocabularyId])
REFERENCES [dbo].[Vocabularies] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[WordFamilies] CHECK CONSTRAINT [FK_WordFamilies_Vocabularies_VocabularyId]
GO
