USE [ToeicMasterDb]
GO
/****** Object:  Table [dbo].[__EFMigrationsHistory]    Script Date: 3/8/2026 9:02:26 PM ******/
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
/****** Object:  Table [dbo].[Answers]    Script Date: 3/8/2026 9:02:26 PM ******/
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
/****** Object:  Table [dbo].[Bookmarks]    Script Date: 3/8/2026 9:02:26 PM ******/
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
/****** Object:  Table [dbo].[CommentLikes]    Script Date: 3/8/2026 9:02:26 PM ******/
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
/****** Object:  Table [dbo].[Comments]    Script Date: 3/8/2026 9:02:26 PM ******/
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
/****** Object:  Table [dbo].[Parts]    Script Date: 3/8/2026 9:02:26 PM ******/
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
/****** Object:  Table [dbo].[Payments]    Script Date: 3/8/2026 9:02:26 PM ******/
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
/****** Object:  Table [dbo].[PracticeAnswers]    Script Date: 3/8/2026 9:02:26 PM ******/
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
/****** Object:  Table [dbo].[PracticeSessions]    Script Date: 3/8/2026 9:02:26 PM ******/
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
/****** Object:  Table [dbo].[QuestionGroups]    Script Date: 3/8/2026 9:02:26 PM ******/
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
/****** Object:  Table [dbo].[Questions]    Script Date: 3/8/2026 9:02:26 PM ******/
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
/****** Object:  Table [dbo].[QuestionTags]    Script Date: 3/8/2026 9:02:26 PM ******/
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
/****** Object:  Table [dbo].[ReviewFeedbacks]    Script Date: 3/8/2026 9:02:26 PM ******/
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
/****** Object:  Table [dbo].[ScoreConversions]    Script Date: 3/8/2026 9:02:26 PM ******/
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
/****** Object:  Table [dbo].[Tags]    Script Date: 3/8/2026 9:02:26 PM ******/
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
/****** Object:  Table [dbo].[TestAttempts]    Script Date: 3/8/2026 9:02:26 PM ******/
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
/****** Object:  Table [dbo].[Tests]    Script Date: 3/8/2026 9:02:26 PM ******/
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
/****** Object:  Table [dbo].[Topics]    Script Date: 3/8/2026 9:02:26 PM ******/
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
/****** Object:  Table [dbo].[Transactions]    Script Date: 3/8/2026 9:02:26 PM ******/
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
/****** Object:  Table [dbo].[UserAnswers]    Script Date: 3/8/2026 9:02:26 PM ******/
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
/****** Object:  Table [dbo].[Users]    Script Date: 3/8/2026 9:02:26 PM ******/
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
/****** Object:  Table [dbo].[UserVocabularies]    Script Date: 3/8/2026 9:02:26 PM ******/
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
/****** Object:  Table [dbo].[Vocabularies]    Script Date: 3/8/2026 9:02:26 PM ******/
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
/****** Object:  Table [dbo].[WordFamilies]    Script Date: 3/8/2026 9:02:26 PM ******/
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
INSERT [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'20251220090423_InitialCreate', N'10.0.1')
INSERT [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'20251220113936_ExpandColumnSizes', N'10.0.1')
INSERT [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'20251220115545_AddCommentsFeature', N'10.0.1')
INSERT [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'20251225223637_AddRoleColumn', N'10.0.1')
INSERT [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'20251225230721_AddIconColumn', N'10.0.1')
INSERT [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'20251226130541_scoreConversion', N'10.0.1')
INSERT [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'20251226131423_AddScoreConversions', N'10.0.1')
INSERT [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'20251229095416_AddOtpToUser', N'10.0.1')
INSERT [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'20251230143346_AddTimeTaken', N'10.0.1')
INSERT [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'20251231152350_UpdateVocabStructure', N'10.0.1')
INSERT [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'20260105064509_AddTopicIdToQuestion', N'10.0.1')
INSERT [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'20260105124646_UpdateAnswerIsCorrect', N'10.0.1')
INSERT [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'20260106143459_levelUservocabulary', N'10.0.1')
INSERT [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'20260107082800_newReviewVocab', N'10.0.1')
INSERT [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'20260131025704_AddPaymentTable', N'10.0.1')
INSERT [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'20260207_MakePaymentResponseFieldsNullable', N'10.0.1')
INSERT [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'20260217075331_AddFullToeicMasterSchema', N'10.0.1')
INSERT [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'20260217080135_AddFullToeicMasterSchema', N'10.0.1')
GO
SET IDENTITY_INSERT [dbo].[Answers] ON 

INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (256, 71, N'A', N'he', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (257, 71, N'B', N'his', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (258, 71, N'C', N'him', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (259, 71, N'D', N'himself', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (260, 72, N'A', N'connectivity', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (261, 72, N'B', N'connects', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (262, 72, N'C', N'connect', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (263, 72, N'D', N'connecting', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (264, 73, N'A', N'eaten', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (265, 73, N'B', N'open', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (266, 73, N'C', N'tasty', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (267, 73, N'D', N'free', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (268, 74, N'A', N'paints', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (269, 74, N'B', N'tiles', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (270, 74, N'C', N'furniture', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (271, 74, N'D', N'curtains', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (272, 75, N'A', N'update', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (273, 75, N'B', N'updating', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (274, 75, N'C', N'updates', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (275, 75, N'D', N'updated', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (276, 76, N'A', N'so', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (277, 76, N'B', N'how', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (278, 76, N'C', N'like', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (279, 76, N'D', N'before', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (280, 77, N'A', N'enthusiastically', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (281, 77, N'B', N'enthusiasm', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (282, 77, N'C', N'enthusiastic', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (283, 77, N'D', N'enthused', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (284, 78, N'A', N'inspects', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (285, 78, N'B', N'inspector', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (286, 78, N'C', N'inspected', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (287, 78, N'D', N'inspections', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (288, 79, N'A', N'until', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (289, 79, N'B', N'into', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (290, 79, N'C', N'yet', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (291, 79, N'D', N'while', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (292, 80, N'A', N'separate', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (293, 80, N'B', N'limited', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (294, 80, N'C', N'willing', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (295, 80, N'D', N'assorted', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (296, 81, N'A', N'deliveries', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (297, 81, N'B', N'delivered', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (298, 81, N'C', N'deliver', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (299, 81, N'D', N'deliverable', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (300, 82, N'A', N'drive', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (301, 82, N'B', N'prohibit', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (302, 82, N'C', N'bother', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (303, 82, N'D', N'travel', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (304, 83, N'A', N'looking', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (305, 83, N'B', N'seeing', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (306, 83, N'C', N'driving', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (307, 83, N'D', N'leaning', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (308, 84, N'A', N'perfect', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (309, 84, N'B', N'perfects', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (310, 84, N'C', N'perfectly', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (311, 84, N'D', N'perfection', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (312, 85, N'A', N'helpfulness', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (313, 85, N'B', N'help', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (314, 85, N'C', N'helpfully', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (315, 85, N'D', N'helpful', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (316, 86, N'A', N'onto', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (317, 86, N'B', N'above', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (318, 86, N'C', N'during', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (319, 86, N'D', N'between', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (320, 87, N'A', N'far', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (321, 87, N'B', N'very', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (322, 87, N'C', N'almost', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (323, 87, N'D', N'soon', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (324, 88, N'A', N'organized', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (325, 88, N'B', N'organizer', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (326, 88, N'C', N'organizes', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (327, 88, N'D', N'organizational', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (328, 89, N'A', N'temporarily', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (329, 89, N'B', N'competitively', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (330, 89, N'C', N'recently', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (331, 89, N'D', N'collectively', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (332, 90, N'A', N'from', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (333, 90, N'B', N'under', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (334, 90, N'C', N'on', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (335, 90, N'D', N'against', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (336, 91, N'A', N'accident', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (337, 91, N'B', N'accidental', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (338, 91, N'C', N'accidents', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (339, 91, N'D', N'accidentally', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (340, 92, N'A', N'next', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (341, 92, N'B', N'with', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (342, 92, N'C', N'which', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (343, 92, N'D', N'now', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (344, 93, N'A', N'needing', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (345, 93, N'B', N'needs', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (346, 93, N'C', N'has needed', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (347, 93, N'D', N'were needing', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (348, 94, N'A', N'already', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (349, 94, N'B', N'exactly', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (350, 94, N'C', N'hardly', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (351, 94, N'D', N'closely', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (352, 95, N'A', N'experts', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (353, 95, N'B', N'accounts', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (354, 95, N'C', N'recommendations', NULL)
GO
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (355, 95, N'D', N'standards', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (356, 96, N'A', N'any', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (357, 96, N'B', N'everybody', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (358, 96, N'C', N'those', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (359, 96, N'D', N'some', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (360, 97, N'A', N'passed', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (361, 97, N'B', N'decided', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (362, 97, N'C', N'required', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (363, 97, N'D', N'performed', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (364, 98, N'A', N'is approving', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (365, 98, N'B', N'approves', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (366, 98, N'C', N'has been approved', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (367, 98, N'D', N'will be approved', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (368, 99, N'A', N'In spite of', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (369, 99, N'B', N'Just as', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (370, 99, N'C', N'In light of', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (371, 99, N'D', N'According to', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (372, 100, N'A', N'arbitrary', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (373, 100, N'B', N'supplemental', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (374, 100, N'C', N'superfluous', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (375, 100, N'D', N'potential', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (376, 101, N'A', N'Children of all ages will enjoy the new exhibits.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (377, 101, N'B', N'Learn about rainfall patterns across the region.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (378, 101, N'C', N'Build a set of simple patio furniture with easy-to-acquire materials.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (379, 101, N'D', N'Next Saturday at 4 P.M., we are hosting a free workshop for the public.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (380, 102, N'A', N'to use', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (381, 102, N'B', N'used to', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (382, 102, N'C', N'by using', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (383, 102, N'D', N'that uses', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (384, 103, N'A', N'Best of all', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (385, 103, N'B', N'For example', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (386, 103, N'C', N'In any event', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (387, 103, N'D', N'As a matter of fact', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (388, 104, N'A', N'we', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (389, 104, N'B', N'they', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (390, 104, N'C', N'both', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (391, 104, N'D', N'yours', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (392, 105, N'A', N'amazed', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (393, 105, N'B', N'amazement', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (394, 105, N'C', N'amazing', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (395, 105, N'D', N'amazingly', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (396, 106, N'A', N'attention', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (397, 106, N'B', N'proposals', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (398, 106, N'C', N'innovation', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (399, 106, N'D', N'criticism', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (400, 107, N'A', N'Several other events have gone surprisingly well.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (401, 107, N'B', N'Thank you also for your flexibility in planning the event.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (402, 107, N'C', N'Please stop by our office the next time you are in the city.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (403, 107, N'D', N'Tokyo is a top tourism destination for many reasons.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (404, 108, N'A', N'will benefit', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (405, 108, N'B', N'to benefit', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (406, 108, N'C', N'has benefited', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (407, 108, N'D', N'benefits', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (408, 109, N'A', N'It', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (409, 109, N'B', N'You', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (410, 109, N'C', N'Our', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (411, 109, N'D', N'Each', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (412, 110, N'A', N'To sign up for a card, visit your local library branch.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (413, 110, N'B', N'For questions about library membership, please visit our Web site.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (414, 110, N'C', N'Renewal must be completed at least one week before your card expires.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (415, 110, N'D', N'You may opt out of this program at any time.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (416, 111, N'A', N'Also', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (417, 111, N'B', N'Should', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (418, 111, N'C', N'Because', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (419, 111, N'D', N'Although', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (420, 112, N'A', N'specifically', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (421, 112, N'B', N'specifics', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (422, 112, N'C', N'specified', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (423, 112, N'D', N'specificity', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (424, 113, N'A', N'I would like to introduce you to our business.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (425, 113, N'B', N'Great photographs can make your property stand out.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (426, 113, N'C', N'We are looking forward to your visit.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (427, 113, N'D', N'It was the first studio of its kind to open in this area.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (428, 114, N'A', N'researching', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (429, 114, N'B', N'creating', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (430, 114, N'C', N'purchasing', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (431, 114, N'D', N'displaying', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (432, 115, N'A', N'If not', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (433, 115, N'B', N'By comparison', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (434, 115, N'C', N'Otherwise', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (435, 115, N'D', N'Indeed', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (436, 116, N'A', N'receives', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (437, 116, N'B', N'is receiving', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (438, 116, N'C', N'had received', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (439, 116, N'D', N'had to receive', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1226, 330, N'A', N'(A) A city mayor''s office', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1227, 330, N'B', N'(B) A maintenance department', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1228, 330, N'C', N'(C) An automobile dealership', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1229, 330, N'D', N'(D) A building management office', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1230, 331, N'A', N'(A) Move their vehicles', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1231, 331, N'B', N'(B) Pay their parking fines', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1232, 331, N'C', N'(C) Use an alternate entrance', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1233, 331, N'D', N'(D) Participate in a meeting', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1234, 332, N'A', N'(A) An election ballot', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1235, 332, N'B', N'(B) A maintenance plan', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1236, 332, N'C', N'(C) A map', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1237, 332, N'D', N'(D) A coupon', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1238, 333, N'A', N'(A) Garden landscaping', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1239, 333, N'B', N'(B) Window installation', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1240, 333, N'C', N'(C) Roof maintenance', NULL)
GO
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1241, 333, N'D', N'(D) Kitchen renovations', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1242, 334, N'A', N'(A) They should be cleaned regularly.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1243, 334, N'B', N'(B) They should be of high quality.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1244, 334, N'C', N'(C) They were recently invented.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1245, 334, N'D', N'(D) They can be easily stored.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1246, 335, N'A', N'(A) Treating some wood', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1247, 335, N'B', N'(B) Consulting an electrician', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1248, 335, N'C', N'(C) Taking some photos', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1249, 335, N'D', N'(D) Draining some water', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1250, 336, N'A', N'(A) A radio show host', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1251, 336, N'B', N'(B) A tour guide', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1252, 336, N'C', N'(C) A sales associate', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1253, 336, N'D', N'(D) A professor', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1254, 337, N'A', N'(A) A lecture will begin.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1255, 337, N'B', N'(B) A demonstration will be given.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1256, 337, N'C', N'(C) An interview will be conducted.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1257, 337, N'D', N'(D) A park will close.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1258, 338, N'A', N'(A) A book', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1259, 338, N'B', N'(B) An album', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1260, 338, N'C', N'(C) A film', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1261, 338, N'D', N'(D) A magazine', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1262, 339, N'A', N'(A) A fund-raising concert', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1263, 339, N'B', N'(B) A sports competition', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1264, 339, N'C', N'(C) A play rehearsal', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1265, 339, N'D', N'(D) An awards ceremony', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1266, 340, N'A', N'(A) Change a policy', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1267, 340, N'B', N'(B) Repair a building', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1268, 340, N'C', N'(C) Select a winner', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1269, 340, N'D', N'(D) Sponsor a team', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1270, 341, N'A', N'(A) Order tickets early', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1271, 341, N'B', N'(B) Visit a community center', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1272, 341, N'C', N'(C) Purchase refreshments', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1273, 341, N'D', N'(D) Donate clothing', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1274, 342, N'A', N'(A) Time management', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1275, 342, N'B', N'(B) Public speaking', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1276, 342, N'C', N'(C) Leadership skills', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1277, 342, N'D', N'(D) Professional networking', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1278, 343, N'A', N'(A) A guest speaker has just arrived.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1279, 343, N'B', N'(B) Assistance is available.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1280, 343, N'C', N'(C) Attendees should speak clearly and loudly.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1281, 343, N'D', N'(D) An extra chair should be provided.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1282, 344, N'A', N'(A) Sign their names on a list', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1283, 344, N'B', N'(B) Take a break', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1284, 344, N'C', N'(C) Participate in an introductory activity', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1285, 344, N'D', N'(D) Fill out a questionnaire', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1286, 345, N'A', N'(A) Its defensive walls', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1287, 345, N'B', N'(B) Its royal inhabitants', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1288, 345, N'C', N'(C) An event that happened there', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1289, 345, N'D', N'(D) Some artwork', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1290, 346, N'A', N'(A) The listeners cannot take pictures.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1291, 346, N'B', N'(B) An area is closed to the listeners.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1292, 346, N'C', N'(C) There is no gift shop.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1293, 346, N'D', N'(D) A tour started late.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1294, 347, N'A', N'(A) Show their tickets', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1295, 347, N'B', N'(B) Put on protective clothing', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1296, 347, N'C', N'(C) Use some handrails', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1297, 347, N'D', N'(D) Speak quietly', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1298, 348, N'A', N'(A) An advertising campaign', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1299, 348, N'B', N'(B) A market expansion', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1300, 348, N'C', N'(C) Some contract negotiations', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1301, 348, N'D', N'(D) Some audit procedures', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1302, 349, N'A', N'(A) Overtime pay has been approved.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1303, 349, N'B', N'(B) A deadline must be met.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1304, 349, N'C', N'(C) A client expressed concern.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1305, 349, N'D', N'(D) A supervisor will be observing closely.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1306, 350, N'A', N'(A) View a presentation', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1307, 350, N'B', N'(B) Review a budget', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1308, 350, N'C', N'(C) Revise some work', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1309, 350, N'D', N'(D) Do some research', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1310, 351, N'A', N'(A) At a hospital', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1311, 351, N'B', N'(B) At a restaurant', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1312, 351, N'C', N'(C) At a grocery store', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1313, 351, N'D', N'(D) At an electronics store', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1314, 352, N'A', N'(A) To make a request', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1315, 352, N'B', N'(B) To address staff complaints', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1316, 352, N'C', N'(C) To present a new schedule', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1317, 352, N'D', N'(D) To explain a technical process', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1318, 353, N'A', N'(A) A process has not been followed.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1319, 353, N'B', N'(B) The listeners may be asked to work extra shifts.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1320, 353, N'C', N'(C) The listeners should contact a manager.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1321, 353, N'D', N'(D) A change will not be immediate.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1322, 354, N'A', N'(A) A company reorganization', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1323, 354, N'B', N'(B) A park renovation', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1324, 354, N'C', N'(C) A volunteer training', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1325, 354, N'D', N'(D) A conservation project', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1326, 355, N'A', N'(A) Location 1', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1327, 355, N'B', N'(B) Location 2', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1328, 355, N'C', N'(C) Location 3', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1329, 355, N'D', N'(D) Location 4', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1330, 356, N'A', N'(A) Complete a survey', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1331, 356, N'B', N'(B) Donate some money', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1332, 356, N'C', N'(C) Join an organization', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1333, 356, N'D', N'(D) Post some photographs', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1334, 357, N'A', N'(A) When to harvest crops', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1335, 357, N'B', N'(B) Where to plant trees', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1336, 357, N'C', N'(C) How to grow vegetables', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1337, 357, N'D', N'(D) Which flowers need more sun', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1338, 358, N'A', N'(A) 12 inches', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1339, 358, N'B', N'(B) 4 inches', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1340, 358, N'C', N'(C) 6 inches', NULL)
GO
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1341, 358, N'D', N'(D) 8 inches', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1342, 359, N'A', N'(A) Turn off mobile phones', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1343, 359, N'B', N'(B) Have some refreshments', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1344, 359, N'C', N'(C) Purchase some seeds', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1345, 359, N'D', N'(D) Sign up for a mailing list', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1778, 468, N'A', N'On a door', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1779, 468, N'B', N'On a receipt', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1780, 468, N'C', N'In a box', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1781, 468, N'D', N'On a Web site', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1782, 469, N'A', N'A desktop computer', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1783, 469, N'B', N'A piece of furniture', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1784, 469, N'C', N'A household appliance', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1785, 469, N'D', N'A power tool', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1786, 470, N'A', N'A conference has been scheduled.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1787, 470, N'B', N'A firm has offices in two time zones.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1788, 470, N'C', N'Administrative assistants make travel plans.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1789, 470, N'D', N'Some meeting times have been changed.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1790, 471, N'A', N'It is when the Winnipeg office closes for lunch.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1791, 471, N'B', N'It is when staff in Toulouse begin their workday.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1792, 471, N'C', N'It is not a preferred time to schedule a meeting.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1793, 471, N'D', N'It has just been added to the schedule.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1794, 472, N'A', N'It is located on the shores of a lake.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1795, 472, N'B', N'It has recently been renovated.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1796, 472, N'C', N'It will build a botanical garden for guests.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1797, 472, N'D', N'It is reserved solely for corporate events.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1798, 473, N'A', N'It was started by an international chef.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1799, 473, N'B', N'It offers limited menu options.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1800, 473, N'C', N'It is now funded by a charitable organization.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1801, 473, N'D', N'It is very popular with local residents.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1802, 474, N'A', N'She will bring lunch for Ms. Evers.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1803, 474, N'B', N'She can provide a tool that Ms. Evers needs.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1804, 474, N'C', N'Some site coordinates are correct.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1805, 474, N'D', N'Some measurements must be double-checked.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1806, 475, N'A', N'Ms. Chi will get new site coordinates.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1807, 475, N'B', N'Ms. Chi and Ms. Lim will be out for a while.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1808, 475, N'C', N'Ms. Evers will share a recipe.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1809, 475, N'D', N'Ms. Lim will begin taking measurements.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1810, 476, N'A', N'Farmers', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1811, 476, N'B', N'Professional chefs', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1812, 476, N'C', N'Truck drivers', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1813, 476, N'D', N'Supermarket managers', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1814, 477, N'A', N'It caused transportation delays.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1815, 477, N'B', N'It included heavier rain than usual.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1816, 477, N'C', N'It was frequently a topic in the local news.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1817, 477, N'D', N'It was beneficial for crops.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1818, 478, N'A', N'Staffing for local businesses', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1819, 478, N'B', N'Food collection and distribution', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1820, 478, N'C', N'Farm machinery repair', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1821, 478, N'D', N'Gardening workshops', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1822, 479, N'A', N'In an airplane', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1823, 479, N'B', N'In a concert hall', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1824, 479, N'C', N'At a restaurant', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1825, 479, N'D', N'At a post office', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1826, 480, N'A', N'They can be put in a locked box for a fee.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1827, 480, N'B', N'They must be left outside the building.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1828, 480, N'C', N'They will be inspected by an attendant.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1829, 480, N'D', N'They must be stored under a seat.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1830, 481, N'A', N'[1]', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1831, 481, N'B', N'[2]', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1832, 481, N'C', N'[3]', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1833, 481, N'D', N'[4]', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1834, 482, N'A', N'To request confirmation of an order', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1835, 482, N'B', N'To adjust some delivery dates', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1836, 482, N'C', N'To announce the expansion of a business', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1837, 482, N'D', N'To promote new dessert products', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1838, 483, N'A', N'She is receiving a professional award.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1839, 483, N'B', N'She has worked as a pastry chef.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1840, 483, N'C', N'She has been a Sweeter Specialties client in the past.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1841, 483, N'D', N'She received a positive recommendation about a chef.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1842, 484, N'A', N'It has been a best-selling product with clients.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1843, 484, N'B', N'It is the most expensive cake at Sweeter Specialties.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1844, 484, N'C', N'It is baked for Esplin Electronics annually.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1845, 484, N'D', N'It is a new flavor combination for Sweeter Specialties.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1846, 485, N'A', N'criticized', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1847, 485, N'B', N'settled', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1848, 485, N'C', N'determined', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1849, 485, N'D', N'described', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1850, 486, N'A', N'It was less expensive than most models.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1851, 486, N'B', N'It was the largest model available.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1852, 486, N'C', N'It was rated very highly.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1853, 486, N'D', N'It was the same brand as her other appliances.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1854, 487, N'A', N'adjusting', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1855, 487, N'B', N'controlling', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1856, 487, N'C', N'moving', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1857, 487, N'D', N'operating', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1858, 488, N'A', N'She cares about saving water.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1859, 488, N'B', N'She recently moved to a new home.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1860, 488, N'C', N'She bought the dishwasher a year ago.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1861, 488, N'D', N'She remodels kitchens professionally.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1862, 489, N'A', N'Skyler Airlines employees', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1863, 489, N'B', N'Skyler Airlines customers', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1864, 489, N'C', N'Potential journal subscribers', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1865, 489, N'D', N'Current job seekers', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1866, 490, N'A', N' what is NOT mentioned as being offered to employees?', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1867, 490, N'B', N'Payment for educational expenses', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1868, 490, N'C', N'Free airline tickets', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1869, 490, N'D', N'Opportunities for mentoring', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1870, 491, N'A', N'It flies to the most destinations around the world.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1871, 491, N'B', N'It is planning to merge with another airline.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1872, 491, N'C', N'It has been praised by a trade publication.', NULL)
GO
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1873, 491, N'D', N'It has replaced its seats with more comfortable ones.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1874, 492, N'A', N'[1]', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1875, 492, N'B', N'[2]', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1876, 492, N'C', N'[3]', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1877, 492, N'D', N'[4]', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1878, 493, N'A', N'It will be expensive to produce.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1879, 493, N'B', N'It will highlight some best-selling products.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1880, 493, N'C', N'It will be Ms. Gowan''s first project.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1881, 493, N'D', N'It will be sent to multiple locations.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1882, 494, N'A', N'More staff should attend a meeting.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1883, 494, N'B', N'Information from the user studies is important.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1884, 494, N'C', N'The presentation must run smoothly.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1885, 494, N'D', N'Partner stores must be notified about an upcoming report.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1886, 495, N'A', N'A store manager', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1887, 495, N'B', N'An amateur athlete', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1888, 495, N'C', N'A product researcher', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1889, 495, N'D', N'An advertising executive', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1890, 496, N'A', N'On Monday', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1891, 496, N'B', N'On Wednesday', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1892, 496, N'C', N'On Thursday', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1893, 496, N'D', N'On Friday', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1894, 497, N'A', N'To promote the opening of a restaurant', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1895, 497, N'B', N'To announce a business partnership', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1896, 497, N'C', N'To introduce a travel program', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1897, 497, N'D', N'To congratulate an award recipient', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1898, 498, N'A', N'results in', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1899, 498, N'B', N'changes', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1900, 498, N'C', N'shows', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1901, 498, N'D', N'thinks about', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1902, 499, N'A', N'It raised its prices for all customers.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1903, 499, N'B', N'It revised its delivery schedule.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1904, 499, N'C', N'It offers several meal options.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1905, 499, N'D', N'It has a new vice president.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1906, 500, N'A', N'She went to Mr. Cordero''s restaurant.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1907, 500, N'B', N'She recently went to Sydney for a vacation.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1908, 500, N'C', N'She is a colleague of Ms. Chambers.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1909, 500, N'D', N'She regularly orders from Kitchen Swifts.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1910, 501, N'A', N'It has a limited lunch menu.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1911, 501, N'B', N'It takes dinner reservations.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1912, 501, N'C', N'It serves bread from a local bakery.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1913, 501, N'D', N'It has a location in Hong Kong.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1914, 502, N'A', N'To finalize a plan', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1915, 502, N'B', N'To accept an invitation', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1916, 502, N'C', N'To promote a new service', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1917, 502, N'D', N'To request feedback on a policy', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1918, 503, N'A', N'To make a delivery', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1919, 503, N'B', N'To attend a meeting', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1920, 503, N'C', N'To drop off a rental car', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1921, 503, N'D', N'To visit with family members', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1922, 504, N'A', N'Mr. Boyle''s sister is a cofounder of Ceoleire Classics.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1923, 504, N'B', N'Mr. Boyle has been disappointed by air- and train-freight companies.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1924, 504, N'C', N'Ms. Savard has purchased items from Mr. Boyle in the past.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1925, 504, N'D', N'Ms. Savard prefers a specific brand of luggage.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1926, 505, N'A', N'She often travels for her job.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1927, 505, N'B', N'She paid extra to have items hand delivered.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1928, 505, N'C', N'She recently purchased musical instruments.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1929, 505, N'D', N'She will meet Mr. Boyle at the rental car office.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1930, 506, N'A', N'By car', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1931, 506, N'B', N'By train', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1932, 506, N'C', N'By boat', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1933, 506, N'D', N'By plane', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1934, 507, N'A', N'It was founded by a graphic designer.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1935, 507, N'B', N'It publishes its own online newsletter.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1936, 507, N'C', N'It offers classes led by industry professionals.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1937, 507, N'D', N'It has classroom facilities in cities across West Africa.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1938, 508, N'A', N' what does TTA provide to students who finish a class?', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1939, 508, N'B', N'A rÃ©sumÃ©-writing workshop', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1940, 508, N'C', N'A discount on a follow-up class', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1941, 508, N'D', N'A list of current job postings', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1942, 509, N'A', N'He helped design a discussion forum.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1943, 509, N'B', N'He has previously taken a TTA class.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1944, 509, N'C', N'He develops videoconferencing software.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1945, 509, N'D', N'He recently sold a bakery food truck.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1946, 510, N'A', N'Introduction to Social Media Marketing', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1947, 510, N'B', N'Become a Successful Freelance Writer', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1948, 510, N'C', N'Starting an Internet Radio Station', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1949, 510, N'D', N'Basics of Graphic Design', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1950, 511, N'A', N'Section 1', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1951, 511, N'B', N'Section 2', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1952, 511, N'C', N'Section 3', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1953, 511, N'D', N'Section 4', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1954, 512, N'A', N'It is currently hiring servers.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1955, 512, N'B', N'It is located on a quiet street.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1956, 512, N'C', N'It has another location in Jamaica.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1957, 512, N'D', N'It opened six months ago.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1958, 513, N'A', N' what is the most popular menu item at Orange Bay Kitchen?', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1959, 513, N'B', N'Red snapper', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1960, 513, N'C', N'Oxtail soup', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1961, 513, N'D', N'Jerk chicken', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1962, 514, N'A', N'She was there on a Friday.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1963, 514, N'B', N'She dined alone.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1964, 514, N'C', N'She requested extra rice.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1965, 514, N'D', N'She ordered dessert.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1966, 515, N'A', N'To answer a question', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1967, 515, N'B', N'To offer an apology', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1968, 515, N'C', N'To ask for feedback', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1969, 515, N'D', N'To confirm a reservation', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1970, 516, N'A', N'Ms. Roats', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1971, 516, N'B', N'Mr. Deslandes', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1972, 516, N'C', N'Mr. Brown', NULL)
GO
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1973, 516, N'D', N'Ms. Smith', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1974, 517, N'A', N'It does landscaping projects.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1975, 517, N'B', N'It designs highways.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1976, 517, N'C', N'It repairs old houses.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1977, 517, N'D', N'It operates a farm.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1978, 518, N'A', N'It is a charitable organization.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1979, 518, N'B', N'It belongs to the Frequent Buyer Club.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1980, 518, N'C', N'It spent more than $4', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1981, 518, N'D', N'000 on merchandise.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1982, 519, N'A', N' what is changing at Orbys Distributors?', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1983, 519, N'B', N'Its e-mail address', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1984, 519, N'C', N'Its list of incentives', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1985, 519, N'D', N'Its invoicing system', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1986, 520, N'A', N'He asked to meet with Mr. Singh.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1987, 520, N'B', N'He is interested in employment at Orbys Distributors.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1988, 520, N'C', N'He recently placed an order for some construction machinery.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1989, 520, N'D', N'He has been a customer of Orbys Distributors for about twenty years.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1990, 521, N'A', N'Make a bill payment', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1991, 521, N'B', N'Solve a problem', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1992, 521, N'C', N'Confirm an order', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (1993, 521, N'D', N'Update an account number', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2297, 604, N'A', N'(A)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2298, 604, N'B', N'(B)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2299, 604, N'C', N'(C)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2300, 604, N'D', N'(D)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2301, 605, N'A', N'(A)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2302, 605, N'B', N'(B)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2303, 605, N'C', N'(C)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2304, 605, N'D', N'(D)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2305, 606, N'A', N'(A)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2306, 606, N'B', N'(B)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2307, 606, N'C', N'(C)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2308, 606, N'D', N'(D)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2309, 607, N'A', N'(A)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2310, 607, N'B', N'(B)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2311, 607, N'C', N'(C)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2312, 607, N'D', N'(D)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2313, 608, N'A', N'(A)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2314, 608, N'B', N'(B)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2315, 608, N'C', N'(C)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2316, 608, N'D', N'(D)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2317, 609, N'A', N'(A)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2318, 609, N'B', N'(B)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2319, 609, N'C', N'(C)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2320, 609, N'D', N'(D)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2321, 610, N'A', N'(A)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2322, 610, N'B', N'(B)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2323, 610, N'C', N'(C)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2324, 611, N'A', N'(A)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2325, 611, N'B', N'(B)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2326, 611, N'C', N'(C)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2327, 612, N'A', N'(A)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2328, 612, N'B', N'(B)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2329, 612, N'C', N'(C)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2330, 613, N'A', N'(A)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2331, 613, N'B', N'(B)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2332, 613, N'C', N'(C)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2333, 614, N'A', N'(A)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2334, 614, N'B', N'(B)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2335, 614, N'C', N'(C)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2336, 615, N'A', N'(A)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2337, 615, N'B', N'(B)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2338, 615, N'C', N'(C)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2339, 616, N'A', N'(A)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2340, 616, N'B', N'(B)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2341, 616, N'C', N'(C)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2342, 617, N'A', N'(A)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2343, 617, N'B', N'(B)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2344, 617, N'C', N'(C)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2345, 618, N'A', N'(A)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2346, 618, N'B', N'(B)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2347, 618, N'C', N'(C)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2348, 619, N'A', N'(A)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2349, 619, N'B', N'(B)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2350, 619, N'C', N'(C)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2351, 620, N'A', N'(A)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2352, 620, N'B', N'(B)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2353, 620, N'C', N'(C)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2354, 621, N'A', N'(A)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2355, 621, N'B', N'(B)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2356, 621, N'C', N'(C)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2357, 622, N'A', N'(A)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2358, 622, N'B', N'(B)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2359, 622, N'C', N'(C)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2360, 623, N'A', N'(A)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2361, 623, N'B', N'(B)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2362, 623, N'C', N'(C)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2363, 624, N'A', N'(A)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2364, 624, N'B', N'(B)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2365, 624, N'C', N'(C)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2366, 625, N'A', N'(A)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2367, 625, N'B', N'(B)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2368, 625, N'C', N'(C)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2369, 626, N'A', N'(A)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2370, 626, N'B', N'(B)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2371, 626, N'C', N'(C)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2372, 627, N'A', N'(A)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2373, 627, N'B', N'(B)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2374, 627, N'C', N'(C)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2375, 628, N'A', N'(A)', NULL)
GO
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2376, 628, N'B', N'(B)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2377, 628, N'C', N'(C)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2378, 629, N'A', N'(A)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2379, 629, N'B', N'(B)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2380, 629, N'C', N'(C)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2381, 630, N'A', N'(A)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2382, 630, N'B', N'(B)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2383, 630, N'C', N'(C)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2384, 631, N'A', N'(A)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2385, 631, N'B', N'(B)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2386, 631, N'C', N'(C)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2387, 632, N'A', N'(A)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2388, 632, N'B', N'(B)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2389, 632, N'C', N'(C)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2390, 633, N'A', N'(A)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2391, 633, N'B', N'(B)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2392, 633, N'C', N'(C)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2393, 634, N'A', N'(A)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2394, 634, N'B', N'(B)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2395, 634, N'C', N'(C)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2552, 674, N'A', N'A job fair', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2553, 674, N'B', N'A cooking class', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2554, 674, N'C', N'A fund-raiser', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2555, 674, N'D', N'A company picnic', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2556, 675, N'A', N'A guest list', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2557, 675, N'B', N'A dessert recipe', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2558, 675, N'C', N'A business card', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2559, 675, N'D', N'A promotional code', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2560, 676, N'A', N'Returning some merchandise', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2561, 676, N'B', N'Watching a video', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2562, 676, N'C', N'Creating an account', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2563, 676, N'D', N'Reading a review', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2564, 677, N'A', N'Accounting', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2565, 677, N'B', N'Research and development', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2566, 677, N'C', N'Maintenance', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2567, 677, N'D', N'Marketing', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2568, 678, N'A', N'A report has not been submitted.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2569, 678, N'B', N'An invoice is not accurate.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2570, 678, N'C', N'A policy has not been followed.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2571, 678, N'D', N'An order has not been delivered.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2572, 679, N'A', N'Delete an electronic file', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2573, 679, N'B', N'Authorize a reimbursement', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2574, 679, N'C', N'Set up a sales meeting', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2575, 679, N'D', N'Review a spreadsheet', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2576, 680, N'A', N'Shipping', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2577, 680, N'B', N'Manufacturing', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2578, 680, N'C', N'Hospitality', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2579, 680, N'D', N'Meteorology', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2580, 681, N'A', N'A schedule was written incorrectly.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2581, 681, N'B', N'Some equipment is not properly set up.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2582, 681, N'C', N'Weather conditions are poor.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2583, 681, N'D', N'Several staff members are absent.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2584, 682, N'A', N'Update a shift schedule', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2585, 682, N'B', N'Clear a work space', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2586, 682, N'C', N'Complete a checklist', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2587, 682, N'D', N'Place a call', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2588, 683, N'A', N'To celebrate a retirement', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2589, 683, N'B', N'To perform an inspection', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2590, 683, N'C', N'To meet with some clients', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2591, 683, N'D', N'To write an article', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2592, 684, N'A', N'She is unable to accept an invitation.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2593, 684, N'B', N'A cooling system is not working.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2594, 684, N'C', N'A meeting will end soon.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2595, 684, N'D', N'She wants to change a seating request.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2596, 685, N'A', N'It is free for customers.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2597, 685, N'B', N'It is under construction.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2598, 685, N'C', N'It closes soon.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2599, 685, N'D', N'It offers monthly contracts.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2600, 686, N'A', N'At a university', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2601, 686, N'B', N'At a publishing company', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2602, 686, N'C', N'At an electronics store', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2603, 686, N'D', N'At a grocery store', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2604, 687, N'A', N'How much an item costs', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2605, 687, N'B', N'When an event will begin', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2606, 687, N'C', N'How many people will participate', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2607, 687, N'D', N'Where to set up some equipment', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2608, 688, N'A', N'Offering a discount', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2609, 688, N'B', N'Displaying informational materials', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2610, 688, N'C', N'Holding a contest', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2611, 688, N'D', N'Visiting a registration table', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2612, 689, N'A', N'Textile manufacturing', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2613, 689, N'B', N'Food production', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2614, 689, N'C', N'Health care', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2615, 689, N'D', N'Hospitality', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2616, 690, N'A', N'Lack of qualified personnel', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2617, 690, N'B', N'Rising production costs', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2618, 690, N'C', N'Changes in consumer preferences', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2619, 690, N'D', N'Increased competition', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2620, 691, N'A', N'Research more information', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2621, 691, N'B', N'Negotiate a discount', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2622, 691, N'C', N'Upgrade some machinery', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2623, 691, N'D', N'Train a new employee', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2624, 692, N'A', N'To explain a business merger', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2625, 692, N'B', N'To describe a new company policy', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2626, 692, N'C', N'To offer the woman a work assignment', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2627, 692, N'D', N'To invite the woman to speak at a conference', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2628, 693, N'A', N'Purchasing another business', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2629, 693, N'B', N'Finding a new office space', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2630, 693, N'C', N'Revising a budget proposal', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2631, 693, N'D', N'Creating a marketing campaign', NULL)
GO
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2632, 694, N'A', N'A project description', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2633, 694, N'B', N'An event invitation', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2634, 694, N'C', N'Some social media links', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2635, 694, N'D', N'Some contact information', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2636, 695, N'A', N'A vehicle is out of service.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2637, 695, N'B', N'An employee is late.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2638, 695, N'C', N'A shipment was damaged.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2639, 695, N'D', N'Traffic is heavy.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2640, 696, N'A', N'At a recording studio', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2641, 696, N'B', N'At a catering company', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2642, 696, N'C', N'At a radio station', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2643, 696, N'D', N'At a car dealership', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2644, 697, N'A', N'Arrange for a car repair', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2645, 697, N'B', N'Order some kitchen supplies', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2646, 697, N'C', N'Carry some items', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2647, 697, N'D', N'Offer a refund', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2648, 698, N'A', N'To plan a company event', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2649, 698, N'B', N'To confirm a work deadline', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2650, 698, N'C', N'To discuss a career path', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2651, 698, N'D', N'To accept a job offer', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2652, 699, N'A', N'A newspaper editor', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2653, 699, N'B', N'A university professor', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2654, 699, N'C', N'A delivery person', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2655, 699, N'D', N'A professional actor', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2656, 700, N'A', N'Negotiate a contract', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2657, 700, N'B', N'Explain an office policy', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2658, 700, N'C', N'Review a rÃ©sumÃ©', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2659, 700, N'D', N'Describe a work schedule', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2660, 701, N'A', N'A new transportation route', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2661, 701, N'B', N'A company merger', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2662, 701, N'C', N'A public relations initiative', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2663, 701, N'D', N'A medical facility design', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2664, 702, N'A', N'To express doubt', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2665, 702, N'B', N'To explain a process', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2666, 702, N'C', N'To make a recommendation', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2667, 702, N'D', N'To update some information', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2668, 703, N'A', N'Paying a certification fee', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2669, 703, N'B', N'Training additional staff', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2670, 703, N'C', N'Upgrading some technology', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2671, 703, N'D', N'Relocating to another city', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2672, 704, N'A', N'Donors', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2673, 704, N'B', N'Volunteers', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2674, 704, N'C', N'Employees', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2675, 704, N'D', N'Clients', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2676, 705, N'A', N'$21', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2677, 705, N'B', N'$18', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2678, 705, N'C', N'$24', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2679, 705, N'D', N'$15', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2680, 706, N'A', N'A graphic file', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2681, 706, N'B', N'A list of names', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2682, 706, N'C', N'A delivery address', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2683, 706, N'D', N'An account number', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2684, 707, N'A', N'Clay sculptures', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2685, 707, N'B', N'Oil paintings', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2686, 707, N'C', N'Black-and-white photographs', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2687, 707, N'D', N'Pencil drawings', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2688, 708, N'A', N'A Careful Glance', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2689, 708, N'B', N'Promises', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2690, 708, N'C', N'Stormy Sea', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2691, 708, N'D', N'The Moment', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2692, 709, N'A', N'Speak with an artist', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2693, 709, N'B', N'Edit a recording', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2694, 709, N'C', N'Clean a gallery space', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2695, 709, N'D', N'Greet some visitors', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2696, 710, N'A', N'Urban planners', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2697, 710, N'B', N'Journalists', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2698, 710, N'C', N'Engineers', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2699, 710, N'D', N'Environmental scientists', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2700, 711, N'A', N'Site A', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2701, 711, N'B', N'Site B', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2702, 711, N'C', N'Site C', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2703, 711, N'D', N'Site D', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2704, 712, N'A', N'Work opportunities', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2705, 712, N'B', N'Wind turbine costs', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2706, 712, N'C', N'Supply chain issues', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2707, 712, N'D', N'Power capacity', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2756, 725, N'A', N'sign', 1)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2757, 725, N'B', N'bake', 0)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2758, 725, N'C', N'cure', 0)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2759, 725, N'D', N'swim', 0)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2760, 726, N'A', N'recipe', 0)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2761, 726, N'B', N'luggage', 0)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2762, 726, N'C', N'agreement', 1)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2763, 726, N'D', N'symptom', 0)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2764, 727, N'A', N'marinate', 0)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2765, 727, N'B', N'cancel', 1)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2766, 727, N'C', N'diagnose', 0)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2767, 727, N'D', N'board', 0)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2768, 728, N'A', N'promised', 1)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2769, 728, N'B', N'tasted', 0)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2770, 728, N'C', N'healed', 0)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2771, 728, N'D', N'orbited', 0)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2772, 729, N'A', N'ingredient', 0)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2773, 729, N'B', N'passenger', 0)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2774, 729, N'C', N'patient', 0)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2775, 729, N'D', N'party', 1)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2776, 730, N'A', N'stir', 0)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2777, 730, N'B', N'negotiate', 1)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2778, 730, N'C', N'vaccinate', 0)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2779, 730, N'D', N'depart', 0)
GO
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2780, 731, N'A', N'renew', 1)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2781, 731, N'B', N'reheat', 0)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2782, 731, N'C', N'take off', 0)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2783, 731, N'D', N'scan', 0)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2784, 732, N'A', N'grill', 0)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2785, 732, N'B', N'prescribe', 0)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2786, 732, N'C', N'establish', 1)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2787, 732, N'D', N'commute', 0)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2788, 733, N'A', N'appetizer', 0)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2789, 733, N'B', N'provision', 1)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2790, 733, N'C', N'vaccine', 0)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2791, 733, N'D', N'souvenir', 0)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2792, 734, N'A', N'stipulate', 1)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2793, 734, N'B', N'garnish', 0)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2794, 734, N'C', N'amputate', 0)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2795, 734, N'D', N'sightsee', 0)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2796, 735, N'A', N'sauté', 0)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2797, 735, N'B', N'bandage', 0)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2798, 735, N'C', N'navigate', 0)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2799, 735, N'D', N'obligate', 1)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2800, 736, N'A', N'simmer', 0)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2801, 736, N'B', N'resuscitate', 0)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2802, 736, N'C', N'terminate', 1)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2803, 736, N'D', N'board', 0)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2804, 737, N'A', N'(A)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2805, 737, N'B', N'(B)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2806, 737, N'C', N'(C)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2807, 737, N'D', N'(D)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2808, 738, N'A', N'(A)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2809, 738, N'B', N'(B)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2810, 738, N'C', N'(C)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2811, 738, N'D', N'(D)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2812, 739, N'A', N'(A)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2813, 739, N'B', N'(B)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2814, 739, N'C', N'(C)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2815, 739, N'D', N'(D)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2816, 740, N'A', N'(A)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2817, 740, N'B', N'(B)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2818, 740, N'C', N'(C)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2819, 740, N'D', N'(D)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2820, 741, N'A', N'(A)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2821, 741, N'B', N'(B)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2822, 741, N'C', N'(C)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2823, 741, N'D', N'(D)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2824, 742, N'A', N'(A)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2825, 742, N'B', N'(B)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2826, 742, N'C', N'(C)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2827, 742, N'D', N'(D)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2828, 743, N'A', N'(A)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2829, 743, N'B', N'(B)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2830, 743, N'C', N'(C)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2831, 744, N'A', N'(A)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2832, 744, N'B', N'(B)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2833, 744, N'C', N'(C)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2834, 745, N'A', N'(A)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2835, 745, N'B', N'(B)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2836, 745, N'C', N'(C)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2837, 746, N'A', N'(A)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2838, 746, N'B', N'(B)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2839, 746, N'C', N'(C)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2840, 747, N'A', N'(A)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2841, 747, N'B', N'(B)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2842, 747, N'C', N'(C)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2843, 748, N'A', N'(A)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2844, 748, N'B', N'(B)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2845, 748, N'C', N'(C)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2846, 749, N'A', N'(A)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2847, 749, N'B', N'(B)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2848, 749, N'C', N'(C)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2849, 750, N'A', N'(A)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2850, 750, N'B', N'(B)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2851, 750, N'C', N'(C)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2852, 751, N'A', N'(A)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2853, 751, N'B', N'(B)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2854, 751, N'C', N'(C)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2855, 752, N'A', N'(A)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2856, 752, N'B', N'(B)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2857, 752, N'C', N'(C)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2858, 753, N'A', N'(A)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2859, 753, N'B', N'(B)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2860, 753, N'C', N'(C)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2861, 754, N'A', N'(A)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2862, 754, N'B', N'(B)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2863, 754, N'C', N'(C)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2864, 755, N'A', N'(A)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2865, 755, N'B', N'(B)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2866, 755, N'C', N'(C)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2867, 756, N'A', N'(A)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2868, 756, N'B', N'(B)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2869, 756, N'C', N'(C)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2870, 757, N'A', N'(A)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2871, 757, N'B', N'(B)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2872, 757, N'C', N'(C)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2873, 758, N'A', N'(A)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2874, 758, N'B', N'(B)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2875, 758, N'C', N'(C)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2876, 759, N'A', N'(A)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2877, 759, N'B', N'(B)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2878, 759, N'C', N'(C)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2879, 760, N'A', N'(A)', NULL)
GO
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2880, 760, N'B', N'(B)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2881, 760, N'C', N'(C)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2882, 761, N'A', N'(A)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2883, 761, N'B', N'(B)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2884, 761, N'C', N'(C)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2885, 762, N'A', N'(A)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2886, 762, N'B', N'(B)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2887, 762, N'C', N'(C)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2888, 763, N'A', N'(A)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2889, 763, N'B', N'(B)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2890, 763, N'C', N'(C)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2891, 764, N'A', N'(A)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2892, 764, N'B', N'(B)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2893, 764, N'C', N'(C)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2894, 765, N'A', N'(A)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2895, 765, N'B', N'(B)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2896, 765, N'C', N'(C)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2897, 766, N'A', N'(A)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2898, 766, N'B', N'(B)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2899, 766, N'C', N'(C)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2900, 767, N'A', N'(A)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2901, 767, N'B', N'(B)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2902, 767, N'C', N'(C)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2903, 768, N'A', N'A job fair', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2904, 768, N'B', N'A cooking class', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2905, 768, N'C', N'A fund-raiser', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2906, 768, N'D', N'A company picnic', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2907, 769, N'A', N'A guest list', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2908, 769, N'B', N'A dessert recipe', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2909, 769, N'C', N'A business card', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2910, 769, N'D', N'A promotional code', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2911, 770, N'A', N'Returning some merchandise', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2912, 770, N'B', N'Watching a video', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2913, 770, N'C', N'Creating an account', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2914, 770, N'D', N'Reading a review', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2915, 771, N'A', N'Accounting', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2916, 771, N'B', N'Research and development', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2917, 771, N'C', N'Maintenance', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2918, 771, N'D', N'Marketing', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2919, 772, N'A', N'A report has not been submitted.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2920, 772, N'B', N'An invoice is not accurate.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2921, 772, N'C', N'A policy has not been followed.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2922, 772, N'D', N'An order has not been delivered.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2923, 773, N'A', N'Delete an electronic file', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2924, 773, N'B', N'Authorize a reimbursement', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2925, 773, N'C', N'Set up a sales meeting', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2926, 773, N'D', N'Review a spreadsheet', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2927, 774, N'A', N'Shipping', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2928, 774, N'B', N'Manufacturing', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2929, 774, N'C', N'Hospitality', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2930, 774, N'D', N'Meteorology', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2931, 775, N'A', N'A schedule was written incorrectly.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2932, 775, N'B', N'Some equipment is not properly set up.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2933, 775, N'C', N'Weather conditions are poor.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2934, 775, N'D', N'Several staff members are absent.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2935, 776, N'A', N'Update a shift schedule', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2936, 776, N'B', N'Clear a work space', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2937, 776, N'C', N'Complete a checklist', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2938, 776, N'D', N'Place a call', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2939, 777, N'A', N'To celebrate a retirement', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2940, 777, N'B', N'To perform an inspection', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2941, 777, N'C', N'To meet with some clients', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2942, 777, N'D', N'To write an article', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2943, 778, N'A', N'She is unable to accept an invitation.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2944, 778, N'B', N'A cooling system is not working.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2945, 778, N'C', N'A meeting will end soon.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2946, 778, N'D', N'She wants to change a seating request.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2947, 779, N'A', N'It is free for customers.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2948, 779, N'B', N'It is under construction.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2949, 779, N'C', N'It closes soon.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2950, 779, N'D', N'It offers monthly contracts.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2951, 780, N'A', N'At a university', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2952, 780, N'B', N'At a publishing company', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2953, 780, N'C', N'At an electronics store', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2954, 780, N'D', N'At a grocery store', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2955, 781, N'A', N'How much an item costs', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2956, 781, N'B', N'When an event will begin', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2957, 781, N'C', N'How many people will participate', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2958, 781, N'D', N'Where to set up some equipment', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2959, 782, N'A', N'Offering a discount', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2960, 782, N'B', N'Displaying informational materials', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2961, 782, N'C', N'Holding a contest', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2962, 782, N'D', N'Visiting a registration table', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2963, 783, N'A', N'Textile manufacturing', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2964, 783, N'B', N'Food production', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2965, 783, N'C', N'Health care', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2966, 783, N'D', N'Hospitality', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2967, 784, N'A', N'Lack of qualified personnel', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2968, 784, N'B', N'Rising production costs', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2969, 784, N'C', N'Changes in consumer preferences', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2970, 784, N'D', N'Increased competition', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2971, 785, N'A', N'Research more information', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2972, 785, N'B', N'Negotiate a discount', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2973, 785, N'C', N'Upgrade some machinery', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2974, 785, N'D', N'Train a new employee', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2975, 786, N'A', N'To explain a business merger', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2976, 786, N'B', N'To describe a new company policy', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2977, 786, N'C', N'To offer the woman a work assignment', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2978, 786, N'D', N'To invite the woman to speak at a conference', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2979, 787, N'A', N'Purchasing another business', NULL)
GO
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2980, 787, N'B', N'Finding a new office space', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2981, 787, N'C', N'Revising a budget proposal', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2982, 787, N'D', N'Creating a marketing campaign', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2983, 788, N'A', N'A project description', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2984, 788, N'B', N'An event invitation', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2985, 788, N'C', N'Some social media links', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2986, 788, N'D', N'Some contact information', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2987, 789, N'A', N'A vehicle is out of service.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2988, 789, N'B', N'An employee is late.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2989, 789, N'C', N'A shipment was damaged.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2990, 789, N'D', N'Traffic is heavy.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2991, 790, N'A', N'At a recording studio', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2992, 790, N'B', N'At a catering company', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2993, 790, N'C', N'At a radio station', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2994, 790, N'D', N'At a car dealership', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2995, 791, N'A', N'Arrange for a car repair', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2996, 791, N'B', N'Order some kitchen supplies', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2997, 791, N'C', N'Carry some items', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2998, 791, N'D', N'Offer a refund', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (2999, 792, N'A', N'To plan a company event', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3000, 792, N'B', N'To confirm a work deadline', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3001, 792, N'C', N'To discuss a career path', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3002, 792, N'D', N'To accept a job offer', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3003, 793, N'A', N'A newspaper editor', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3004, 793, N'B', N'A university professor', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3005, 793, N'C', N'A delivery person', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3006, 793, N'D', N'A professional actor', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3007, 794, N'A', N'Negotiate a contract', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3008, 794, N'B', N'Explain an office policy', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3009, 794, N'C', N'Review a rÃ©sumÃ©', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3010, 794, N'D', N'Describe a work schedule', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3011, 795, N'A', N'A new transportation route', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3012, 795, N'B', N'A company merger', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3013, 795, N'C', N'A public relations initiative', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3014, 795, N'D', N'A medical facility design', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3015, 796, N'A', N'To express doubt', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3016, 796, N'B', N'To explain a process', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3017, 796, N'C', N'To make a recommendation', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3018, 796, N'D', N'To update some information', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3019, 797, N'A', N'Paying a certification fee', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3020, 797, N'B', N'Training additional staff', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3021, 797, N'C', N'Upgrading some technology', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3022, 797, N'D', N'Relocating to another city', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3023, 798, N'A', N'Donors', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3024, 798, N'B', N'Volunteers', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3025, 798, N'C', N'Employees', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3026, 798, N'D', N'Clients', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3027, 799, N'A', N'$21', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3028, 799, N'B', N'$18', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3029, 799, N'C', N'$24', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3030, 799, N'D', N'$15', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3031, 800, N'A', N'A graphic file', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3032, 800, N'B', N'A list of names', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3033, 800, N'C', N'A delivery address', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3034, 800, N'D', N'An account number', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3035, 801, N'A', N'Clay sculptures', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3036, 801, N'B', N'Oil paintings', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3037, 801, N'C', N'Black-and-white photographs', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3038, 801, N'D', N'Pencil drawings', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3039, 802, N'A', N'A Careful Glance', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3040, 802, N'B', N'Promises', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3041, 802, N'C', N'Stormy Sea', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3042, 802, N'D', N'The Moment', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3043, 803, N'A', N'Speak with an artist', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3044, 803, N'B', N'Edit a recording', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3045, 803, N'C', N'Clean a gallery space', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3046, 803, N'D', N'Greet some visitors', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3047, 804, N'A', N'Urban planners', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3048, 804, N'B', N'Journalists', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3049, 804, N'C', N'Engineers', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3050, 804, N'D', N'Environmental scientists', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3051, 805, N'A', N'Site A', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3052, 805, N'B', N'Site B', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3053, 805, N'C', N'Site C', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3054, 805, N'D', N'Site D', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3055, 806, N'A', N'Work opportunities', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3056, 806, N'B', N'Wind turbine costs', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3057, 806, N'C', N'Supply chain issues', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3058, 806, N'D', N'Power capacity', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3059, 807, N'A', N'he', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3060, 807, N'B', N'his', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3061, 807, N'C', N'him', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3062, 807, N'D', N'himself', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3063, 808, N'A', N'connectivity', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3064, 808, N'B', N'connects', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3065, 808, N'C', N'connect', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3066, 808, N'D', N'connecting', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3067, 809, N'A', N'eaten', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3068, 809, N'B', N'open', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3069, 809, N'C', N'tasty', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3070, 809, N'D', N'free', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3071, 810, N'A', N'paints', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3072, 810, N'B', N'tiles', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3073, 810, N'C', N'furniture', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3074, 810, N'D', N'curtains', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3075, 811, N'A', N'update', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3076, 811, N'B', N'updating', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3077, 811, N'C', N'updates', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3078, 811, N'D', N'updated', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3079, 812, N'A', N'so', NULL)
GO
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3080, 812, N'B', N'how', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3081, 812, N'C', N'like', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3082, 812, N'D', N'before', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3083, 813, N'A', N'enthusiastically', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3084, 813, N'B', N'enthusiasm', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3085, 813, N'C', N'enthusiastic', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3086, 813, N'D', N'enthused', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3087, 814, N'A', N'inspects', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3088, 814, N'B', N'inspector', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3089, 814, N'C', N'inspected', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3090, 814, N'D', N'inspections', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3091, 815, N'A', N'until', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3092, 815, N'B', N'into', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3093, 815, N'C', N'yet', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3094, 815, N'D', N'while', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3095, 816, N'A', N'separate', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3096, 816, N'B', N'limited', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3097, 816, N'C', N'willing', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3098, 816, N'D', N'assorted', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3099, 817, N'A', N'deliveries', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3100, 817, N'B', N'delivered', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3101, 817, N'C', N'deliver', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3102, 817, N'D', N'deliverable', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3103, 818, N'A', N'drive', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3104, 818, N'B', N'prohibit', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3105, 818, N'C', N'bother', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3106, 818, N'D', N'travel', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3107, 819, N'A', N'looking', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3108, 819, N'B', N'seeing', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3109, 819, N'C', N'driving', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3110, 819, N'D', N'leaning', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3111, 820, N'A', N'perfect', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3112, 820, N'B', N'perfects', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3113, 820, N'C', N'perfectly', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3114, 820, N'D', N'perfection', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3115, 821, N'A', N'helpfulness', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3116, 821, N'B', N'help', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3117, 821, N'C', N'helpfully', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3118, 821, N'D', N'helpful', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3119, 822, N'A', N'onto', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3120, 822, N'B', N'above', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3121, 822, N'C', N'during', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3122, 822, N'D', N'between', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3123, 823, N'A', N'far', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3124, 823, N'B', N'very', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3125, 823, N'C', N'almost', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3126, 823, N'D', N'soon', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3127, 824, N'A', N'organized', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3128, 824, N'B', N'organizer', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3129, 824, N'C', N'organizes', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3130, 824, N'D', N'organizational', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3131, 825, N'A', N'temporarily', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3132, 825, N'B', N'competitively', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3133, 825, N'C', N'recently', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3134, 825, N'D', N'collectively', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3135, 826, N'A', N'from', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3136, 826, N'B', N'under', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3137, 826, N'C', N'on', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3138, 826, N'D', N'against', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3139, 827, N'A', N'accident', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3140, 827, N'B', N'accidental', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3141, 827, N'C', N'accidents', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3142, 827, N'D', N'accidentally', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3143, 828, N'A', N'next', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3144, 828, N'B', N'with', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3145, 828, N'C', N'which', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3146, 828, N'D', N'now', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3147, 829, N'A', N'needing', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3148, 829, N'B', N'needs', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3149, 829, N'C', N'has needed', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3150, 829, N'D', N'were needing', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3151, 830, N'A', N'already', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3152, 830, N'B', N'exactly', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3153, 830, N'C', N'hardly', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3154, 830, N'D', N'closely', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3155, 831, N'A', N'experts', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3156, 831, N'B', N'accounts', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3157, 831, N'C', N'recommendations', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3158, 831, N'D', N'standards', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3159, 832, N'A', N'any', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3160, 832, N'B', N'everybody', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3161, 832, N'C', N'those', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3162, 832, N'D', N'some', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3163, 833, N'A', N'passed', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3164, 833, N'B', N'decided', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3165, 833, N'C', N'required', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3166, 833, N'D', N'performed', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3167, 834, N'A', N'is approving', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3168, 834, N'B', N'approves', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3169, 834, N'C', N'has been approved', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3170, 834, N'D', N'will be approved', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3171, 835, N'A', N'In spite of', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3172, 835, N'B', N'Just as', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3173, 835, N'C', N'In light of', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3174, 835, N'D', N'According to', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3175, 836, N'A', N'arbitrary', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3176, 836, N'B', N'supplemental', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3177, 836, N'C', N'superfluous', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3178, 836, N'D', N'potential', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3179, 837, N'A', N'Children of all ages will enjoy the new exhibits.', NULL)
GO
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3180, 837, N'B', N'Learn about rainfall patterns across the region.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3181, 837, N'C', N'Build a set of simple patio furniture with easy-to-acquire materials.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3182, 837, N'D', N'Next Saturday at 4 P.M., we are hosting a free workshop for the public.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3183, 838, N'A', N'to use', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3184, 838, N'B', N'used to', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3185, 838, N'C', N'by using', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3186, 838, N'D', N'that uses', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3187, 839, N'A', N'Best of all', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3188, 839, N'B', N'For example', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3189, 839, N'C', N'In any event', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3190, 839, N'D', N'As a matter of fact', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3191, 840, N'A', N'we', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3192, 840, N'B', N'they', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3193, 840, N'C', N'both', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3194, 840, N'D', N'yours', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3195, 841, N'A', N'amazed', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3196, 841, N'B', N'amazement', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3197, 841, N'C', N'amazing', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3198, 841, N'D', N'amazingly', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3199, 842, N'A', N'attention', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3200, 842, N'B', N'proposals', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3201, 842, N'C', N'innovation', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3202, 842, N'D', N'criticism', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3203, 843, N'A', N'Several other events have gone surprisingly well.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3204, 843, N'B', N'Thank you also for your flexibility in planning the event.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3205, 843, N'C', N'Please stop by our office the next time you are in the city.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3206, 843, N'D', N'Tokyo is a top tourism destination for many reasons.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3207, 844, N'A', N'will benefit', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3208, 844, N'B', N'to benefit', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3209, 844, N'C', N'has benefited', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3210, 844, N'D', N'benefits', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3211, 845, N'A', N'It', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3212, 845, N'B', N'You', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3213, 845, N'C', N'Our', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3214, 845, N'D', N'Each', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3215, 846, N'A', N'To sign up for a card, visit your local library branch.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3216, 846, N'B', N'For questions about library membership, please visit our Web site.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3217, 846, N'C', N'Renewal must be completed at least one week before your card expires.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3218, 846, N'D', N'You may opt out of this program at any time.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3219, 847, N'A', N'Also', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3220, 847, N'B', N'Should', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3221, 847, N'C', N'Because', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3222, 847, N'D', N'Although', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3223, 848, N'A', N'specifically', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3224, 848, N'B', N'specifics', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3225, 848, N'C', N'specified', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3226, 848, N'D', N'specificity', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3227, 849, N'A', N'I would like to introduce you to our business.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3228, 849, N'B', N'Great photographs can make your property stand out.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3229, 849, N'C', N'We are looking forward to your visit.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3230, 849, N'D', N'It was the first studio of its kind to open in this area.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3231, 850, N'A', N'researching', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3232, 850, N'B', N'creating', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3233, 850, N'C', N'purchasing', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3234, 850, N'D', N'displaying', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3235, 851, N'A', N'If not', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3236, 851, N'B', N'By comparison', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3237, 851, N'C', N'Otherwise', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3238, 851, N'D', N'Indeed', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3239, 852, N'A', N'receives', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3240, 852, N'B', N'is receiving', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3241, 852, N'C', N'had received', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3242, 852, N'D', N'had to receive', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3243, 853, N'A', N'On a door', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3244, 853, N'B', N'On a receipt', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3245, 853, N'C', N'In a box', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3246, 853, N'D', N'On a Web site', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3247, 854, N'A', N'A desktop computer', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3248, 854, N'B', N'A piece of furniture', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3249, 854, N'C', N'A household appliance', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3250, 854, N'D', N'A power tool', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3251, 855, N'A', N'A conference has been scheduled.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3252, 855, N'B', N'A firm has offices in two time zones.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3253, 855, N'C', N'Administrative assistants make travel plans.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3254, 855, N'D', N'Some meeting times have been changed.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3255, 856, N'A', N'It is when the Winnipeg office closes for lunch.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3256, 856, N'B', N'It is when staff in Toulouse begin their workday.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3257, 856, N'C', N'It is not a preferred time to schedule a meeting.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3258, 856, N'D', N'It has just been added to the schedule.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3259, 857, N'A', N'It is located on the shores of a lake.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3260, 857, N'B', N'It has recently been renovated.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3261, 857, N'C', N'It will build a botanical garden for guests.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3262, 857, N'D', N'It is reserved solely for corporate events.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3263, 858, N'A', N'It was started by an international chef.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3264, 858, N'B', N'It offers limited menu options.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3265, 858, N'C', N'It is now funded by a charitable organization.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3266, 858, N'D', N'It is very popular with local residents.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3267, 859, N'A', N'She will bring lunch for Ms. Evers.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3268, 859, N'B', N'She can provide a tool that Ms. Evers needs.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3269, 859, N'C', N'Some site coordinates are correct.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3270, 859, N'D', N'Some measurements must be double-checked.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3271, 860, N'A', N'Ms. Chi will get new site coordinates.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3272, 860, N'B', N'Ms. Chi and Ms. Lim will be out for a while.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3273, 860, N'C', N'Ms. Evers will share a recipe.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3274, 860, N'D', N'Ms. Lim will begin taking measurements.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3275, 861, N'A', N'Farmers', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3276, 861, N'B', N'Professional chefs', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3277, 861, N'C', N'Truck drivers', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3278, 861, N'D', N'Supermarket managers', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3279, 862, N'A', N'It caused transportation delays.', NULL)
GO
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3280, 862, N'B', N'It included heavier rain than usual.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3281, 862, N'C', N'It was frequently a topic in the local news.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3282, 862, N'D', N'It was beneficial for crops.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3283, 863, N'A', N'Staffing for local businesses', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3284, 863, N'B', N'Food collection and distribution', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3285, 863, N'C', N'Farm machinery repair', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3286, 863, N'D', N'Gardening workshops', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3287, 864, N'A', N'In an airplane', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3288, 864, N'B', N'In a concert hall', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3289, 864, N'C', N'At a restaurant', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3290, 864, N'D', N'At a post office', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3291, 865, N'A', N'They can be put in a locked box for a fee.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3292, 865, N'B', N'They must be left outside the building.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3293, 865, N'C', N'They will be inspected by an attendant.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3294, 865, N'D', N'They must be stored under a seat.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3295, 866, N'A', N'[1]', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3296, 866, N'B', N'[2]', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3297, 866, N'C', N'[3]', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3298, 866, N'D', N'[4]', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3299, 867, N'A', N'To request confirmation of an order', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3300, 867, N'B', N'To adjust some delivery dates', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3301, 867, N'C', N'To announce the expansion of a business', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3302, 867, N'D', N'To promote new dessert products', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3303, 868, N'A', N'She is receiving a professional award.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3304, 868, N'B', N'She has worked as a pastry chef.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3305, 868, N'C', N'She has been a Sweeter Specialties client in the past.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3306, 868, N'D', N'She received a positive recommendation about a chef.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3307, 869, N'A', N'It has been a best-selling product with clients.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3308, 869, N'B', N'It is the most expensive cake at Sweeter Specialties.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3309, 869, N'C', N'It is baked for Esplin Electronics annually.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3310, 869, N'D', N'It is a new flavor combination for Sweeter Specialties.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3311, 870, N'A', N'criticized', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3312, 870, N'B', N'settled', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3313, 870, N'C', N'determined', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3314, 870, N'D', N'described', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3315, 871, N'A', N'It was less expensive than most models.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3316, 871, N'B', N'It was the largest model available.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3317, 871, N'C', N'It was rated very highly.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3318, 871, N'D', N'It was the same brand as her other appliances.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3319, 872, N'A', N'adjusting', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3320, 872, N'B', N'controlling', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3321, 872, N'C', N'moving', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3322, 872, N'D', N'operating', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3323, 873, N'A', N'She cares about saving water.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3324, 873, N'B', N'She recently moved to a new home.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3325, 873, N'C', N'She bought the dishwasher a year ago.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3326, 873, N'D', N'She remodels kitchens professionally.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3327, 874, N'A', N'Skyler Airlines employees', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3328, 874, N'B', N'Skyler Airlines customers', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3329, 874, N'C', N'Potential journal subscribers', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3330, 874, N'D', N'Current job seekers', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3331, 875, N'A', N' what is NOT mentioned as being offered to employees?', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3332, 875, N'B', N'Payment for educational expenses', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3333, 875, N'C', N'Free airline tickets', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3334, 875, N'D', N'Opportunities for mentoring', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3335, 876, N'A', N'It flies to the most destinations around the world.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3336, 876, N'B', N'It is planning to merge with another airline.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3337, 876, N'C', N'It has been praised by a trade publication.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3338, 876, N'D', N'It has replaced its seats with more comfortable ones.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3339, 877, N'A', N'[1]', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3340, 877, N'B', N'[2]', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3341, 877, N'C', N'[3]', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3342, 877, N'D', N'[4]', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3343, 878, N'A', N'It will be expensive to produce.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3344, 878, N'B', N'It will highlight some best-selling products.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3345, 878, N'C', N'It will be Ms. Gowan''s first project.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3346, 878, N'D', N'It will be sent to multiple locations.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3347, 879, N'A', N'More staff should attend a meeting.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3348, 879, N'B', N'Information from the user studies is important.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3349, 879, N'C', N'The presentation must run smoothly.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3350, 879, N'D', N'Partner stores must be notified about an upcoming report.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3351, 880, N'A', N'A store manager', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3352, 880, N'B', N'An amateur athlete', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3353, 880, N'C', N'A product researcher', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3354, 880, N'D', N'An advertising executive', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3355, 881, N'A', N'On Monday', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3356, 881, N'B', N'On Wednesday', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3357, 881, N'C', N'On Thursday', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3358, 881, N'D', N'On Friday', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3359, 882, N'A', N'To promote the opening of a restaurant', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3360, 882, N'B', N'To announce a business partnership', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3361, 882, N'C', N'To introduce a travel program', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3362, 882, N'D', N'To congratulate an award recipient', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3363, 883, N'A', N'results in', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3364, 883, N'B', N'changes', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3365, 883, N'C', N'shows', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3366, 883, N'D', N'thinks about', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3367, 884, N'A', N'It raised its prices for all customers.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3368, 884, N'B', N'It revised its delivery schedule.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3369, 884, N'C', N'It offers several meal options.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3370, 884, N'D', N'It has a new vice president.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3371, 885, N'A', N'She went to Mr. Cordero''s restaurant.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3372, 885, N'B', N'She recently went to Sydney for a vacation.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3373, 885, N'C', N'She is a colleague of Ms. Chambers.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3374, 885, N'D', N'She regularly orders from Kitchen Swifts.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3375, 886, N'A', N'It has a limited lunch menu.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3376, 886, N'B', N'It takes dinner reservations.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3377, 886, N'C', N'It serves bread from a local bakery.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3378, 886, N'D', N'It has a location in Hong Kong.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3379, 887, N'A', N'To finalize a plan', NULL)
GO
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3380, 887, N'B', N'To accept an invitation', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3381, 887, N'C', N'To promote a new service', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3382, 887, N'D', N'To request feedback on a policy', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3383, 888, N'A', N'To make a delivery', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3384, 888, N'B', N'To attend a meeting', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3385, 888, N'C', N'To drop off a rental car', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3386, 888, N'D', N'To visit with family members', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3387, 889, N'A', N'Mr. Boyle''s sister is a cofounder of Ceoleire Classics.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3388, 889, N'B', N'Mr. Boyle has been disappointed by air- and train-freight companies.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3389, 889, N'C', N'Ms. Savard has purchased items from Mr. Boyle in the past.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3390, 889, N'D', N'Ms. Savard prefers a specific brand of luggage.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3391, 890, N'A', N'She often travels for her job.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3392, 890, N'B', N'She paid extra to have items hand delivered.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3393, 890, N'C', N'She recently purchased musical instruments.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3394, 890, N'D', N'She will meet Mr. Boyle at the rental car office.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3395, 891, N'A', N'By car', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3396, 891, N'B', N'By train', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3397, 891, N'C', N'By boat', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3398, 891, N'D', N'By plane', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3399, 892, N'A', N'It was founded by a graphic designer.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3400, 892, N'B', N'It publishes its own online newsletter.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3401, 892, N'C', N'It offers classes led by industry professionals.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3402, 892, N'D', N'It has classroom facilities in cities across West Africa.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3403, 893, N'A', N' what does TTA provide to students who finish a class?', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3404, 893, N'B', N'A rÃ©sumÃ©-writing workshop', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3405, 893, N'C', N'A discount on a follow-up class', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3406, 893, N'D', N'A list of current job postings', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3407, 894, N'A', N'He helped design a discussion forum.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3408, 894, N'B', N'He has previously taken a TTA class.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3409, 894, N'C', N'He develops videoconferencing software.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3410, 894, N'D', N'He recently sold a bakery food truck.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3411, 895, N'A', N'Introduction to Social Media Marketing', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3412, 895, N'B', N'Become a Successful Freelance Writer', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3413, 895, N'C', N'Starting an Internet Radio Station', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3414, 895, N'D', N'Basics of Graphic Design', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3415, 896, N'A', N'Section 1', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3416, 896, N'B', N'Section 2', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3417, 896, N'C', N'Section 3', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3418, 896, N'D', N'Section 4', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3419, 897, N'A', N'It is currently hiring servers.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3420, 897, N'B', N'It is located on a quiet street.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3421, 897, N'C', N'It has another location in Jamaica.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3422, 897, N'D', N'It opened six months ago.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3423, 898, N'A', N' what is the most popular menu item at Orange Bay Kitchen?', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3424, 898, N'B', N'Red snapper', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3425, 898, N'C', N'Oxtail soup', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3426, 898, N'D', N'Jerk chicken', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3427, 899, N'A', N'She was there on a Friday.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3428, 899, N'B', N'She dined alone.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3429, 899, N'C', N'She requested extra rice.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3430, 899, N'D', N'She ordered dessert.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3431, 900, N'A', N'To answer a question', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3432, 900, N'B', N'To offer an apology', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3433, 900, N'C', N'To ask for feedback', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3434, 900, N'D', N'To confirm a reservation', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3435, 901, N'A', N'Ms. Roats', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3436, 901, N'B', N'Mr. Deslandes', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3437, 901, N'C', N'Mr. Brown', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3438, 901, N'D', N'Ms. Smith', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3439, 902, N'A', N'It does landscaping projects.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3440, 902, N'B', N'It designs highways.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3441, 902, N'C', N'It repairs old houses.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3442, 902, N'D', N'It operates a farm.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3443, 903, N'A', N'It is a charitable organization.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3444, 903, N'B', N'It belongs to the Frequent Buyer Club.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3445, 903, N'C', N'It spent more than $4', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3446, 903, N'D', N'000 on merchandise.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3447, 904, N'A', N' what is changing at Orbys Distributors?', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3448, 904, N'B', N'Its e-mail address', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3449, 904, N'C', N'Its list of incentives', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3450, 904, N'D', N'Its invoicing system', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3451, 905, N'A', N'He asked to meet with Mr. Singh.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3452, 905, N'B', N'He is interested in employment at Orbys Distributors.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3453, 905, N'C', N'He recently placed an order for some construction machinery.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3454, 905, N'D', N'He has been a customer of Orbys Distributors for about twenty years.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3455, 906, N'A', N'Make a bill payment', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3456, 906, N'B', N'Solve a problem', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3457, 906, N'C', N'Confirm an order', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (3458, 906, N'D', N'Update an account number', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5427, 1405, N'A', N'A. To order a new printer', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5428, 1405, N'B', N'B. To complain about a broken item', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5429, 1405, N'C', N'C. To check on a delivery status', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5430, 1405, N'D', N'D. To schedule a client meeting', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5431, 1406, N'A', N'A. The product is out of stock', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5432, 1406, N'B', N'B. Bad weather conditions', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5433, 1406, N'C', N'C. The address was incorrect', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5434, 1406, N'D', N'D. The truck broke down', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5435, 1407, N'A', N'A. He needs the item urgently.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5436, 1407, N'B', N'B. He wants to cancel the order.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5437, 1407, N'C', N'C. He wants a discount.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5438, 1407, N'D', N'D. He is inviting the woman.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5439, 1408, N'A', N'A. An office renovation', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5440, 1408, N'B', N'B. A marketing strategy', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5441, 1408, N'C', N'C. Planning an event', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5442, 1408, N'D', N'D. Booking a flight', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5443, 1409, N'A', N'A. It is too expensive.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5444, 1409, N'B', N'B. It is too far from the airport.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5445, 1409, N'C', N'C. It has no shuttle service.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5446, 1409, N'D', N'D. It has no rooms available.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5447, 1410, N'A', N'A. She will verify the bank account.', NULL)
GO
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5448, 1410, N'B', N'B. She will make a partial payment.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5449, 1410, N'C', N'C. She will cancel the reservation.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5450, 1410, N'D', N'D. She will ask for a refund.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5451, 1411, N'A', N'A. At a bus stop', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5452, 1411, N'B', N'B. Inside a museum', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5453, 1411, N'C', N'C. At a bank', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5454, 1411, N'D', N'D. In a taxi', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5455, 1412, N'A', N'A. Take a taxi instead', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5456, 1412, N'B', N'B. Wait for the number 42 bus', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5457, 1412, N'C', N'C. Prepare exact change', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5458, 1412, N'D', N'D. Buy a ticket online', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5459, 1413, N'A', N'A. She is a bus driver.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5460, 1413, N'B', N'B. She lives in the neighborhood.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5461, 1413, N'C', N'C. She is likely a tourist or visitor.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5462, 1413, N'D', N'D. She works at the bank.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5463, 1414, N'A', N'A. At a restaurant', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5464, 1414, N'B', N'B. At a hotel', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5465, 1414, N'C', N'C. At a train station', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5466, 1414, N'D', N'D. At an office', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5467, 1415, N'A', N'A. He doesn''t have cash.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5468, 1415, N'B', N'B. He wants a discount.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5469, 1415, N'C', N'C. He needs one receipt for reimbursement.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5470, 1415, N'D', N'D. He forgot to pay earlier.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5471, 1416, N'A', N'A. Serve breakfast', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5472, 1416, N'B', N'B. Clean the room', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5473, 1416, N'C', N'C. Call a taxi', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5474, 1416, N'D', N'D. Give him a key card', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5475, 1417, N'A', N'A. The presentation file is lost.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5476, 1417, N'B', N'B. The meeting room is double-booked.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5477, 1417, N'C', N'C. The equipment is malfunctioning.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5478, 1417, N'D', N'D. The CEO is late.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5479, 1418, N'A', N'A. It is brand new.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5480, 1418, N'B', N'B. It might not be high quality.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5481, 1418, N'C', N'C. It is currently being used.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5482, 1418, N'D', N'D. It is in the conference room.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5483, 1419, N'A', N'A. Digital files', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5484, 1419, N'B', N'B. Paper documents', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5485, 1419, N'C', N'C. Backup drives', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5486, 1419, N'D', N'D. Difficult tasks', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5487, 1420, N'A', N'A. To offer a job', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5488, 1420, N'B', N'B. To schedule an interview', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5489, 1420, N'C', N'C. To cancel a meeting', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5490, 1420, N'D', N'D. To request a reference', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5491, 1421, N'A', N'A. This afternoon', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5492, 1421, N'B', N'B. Friday morning', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5493, 1421, N'C', N'C. Next Monday', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5494, 1421, N'D', N'D. Next Tuesday', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5495, 1422, N'A', N'A. A resume', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5496, 1422, N'B', N'B. A laptop', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5497, 1422, N'C', N'C. A physical portfolio', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5498, 1422, N'D', N'D. A letter of recommendation', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5499, 1423, N'A', N'A. At a hotel reception', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5500, 1423, N'B', N'B. At a restaurant', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5501, 1423, N'C', N'C. At a furniture store', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5502, 1423, N'D', N'D. At a beach', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5503, 1424, N'A', N'A. The table is too small.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5504, 1424, N'B', N'B. It is too expensive.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5505, 1424, N'C', N'C. The weather is not suitable.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5506, 1424, N'D', N'D. He doesn''t like the view.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5507, 1425, N'A', N'A. Coming back tomorrow', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5508, 1425, N'B', N'B. Eating at the bar', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5509, 1425, N'C', N'C. Waiting for an indoor table', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5510, 1425, N'D', N'D. Calling another restaurant', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5511, 1426, N'A', N'A. Buying a new shirt', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5512, 1426, N'B', N'B. Returning an item', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5513, 1426, N'C', N'C. Looking for a receipt', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5514, 1426, N'D', N'D. Asking for directions', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5515, 1427, N'A', N'A. The shirt is damaged.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5516, 1427, N'B', N'B. The store is closed.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5517, 1427, N'C', N'C. The man lost the receipt.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5518, 1427, N'D', N'D. The woman cannot help.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5519, 1428, N'A', N'A. A full cash refund', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5520, 1428, N'B', N'B. A discount coupon', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5521, 1428, N'C', N'C. An exchange or store credit', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5522, 1428, N'D', N'D. A repair service', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5523, 1429, N'A', N'A. A computer system issue', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5524, 1429, N'B', N'B. A forgotten password', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5525, 1429, N'C', N'C. A new employee', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5526, 1429, N'D', N'D. A payroll bonus', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5527, 1430, N'A', N'A. The server crashed.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5528, 1430, N'B', N'B. The power went out.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5529, 1430, N'C', N'C. A security update is in progress.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5530, 1430, N'D', N'D. The software was deleted.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5531, 1431, N'A', N'A. She lost her data.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5532, 1431, N'B', N'B. She has a deadline.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5533, 1431, N'C', N'C. She cannot read her email.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5534, 1431, N'D', N'D. She is late for a meeting.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5535, 1432, N'A', N'A. The company is closing.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5536, 1432, N'B', N'B. The office is moving.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5537, 1432, N'C', N'C. A new manager is arriving.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5538, 1432, N'D', N'D. The building is being renovated.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5539, 1433, N'A', N'A. The location', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5540, 1433, N'B', N'B. The lack of meeting rooms', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5541, 1433, N'C', N'C. The size of the desks', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5542, 1433, N'D', N'D. The coffee machine', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5543, 1434, N'A', N'A. Larger desks', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5544, 1434, N'B', N'B. More meeting space', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5545, 1434, N'C', N'C. Cheaper rent', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5546, 1434, N'D', N'D. Faster internet', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5547, 1435, N'A', N'A. A pilot', NULL)
GO
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5548, 1435, N'B', N'B. An airline agent', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5549, 1435, N'C', N'C. A hotel receptionist', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5550, 1435, N'D', N'D. A mechanic', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5551, 1436, N'A', N'A. He is afraid of flying.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5552, 1436, N'B', N'B. He lost his luggage.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5553, 1436, N'C', N'C. He might miss a connecting flight.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5554, 1436, N'D', N'D. He has no money.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5555, 1437, N'A', N'A. A full refund', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5556, 1437, N'B', N'B. A hotel voucher', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5557, 1437, N'C', N'C. A rental car', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5558, 1437, N'D', N'D. A free upgrade', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5559, 1438, N'A', N'A. In a factory', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5560, 1438, N'B', N'B. In a restaurant', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5561, 1438, N'C', N'C. In a retail store', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5562, 1438, N'D', N'D. In a design studio', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5563, 1439, N'A', N'A. Machine failure', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5564, 1439, N'B', N'B. Shortage of parts', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5565, 1439, N'C', N'C. Staff strike', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5566, 1439, N'D', N'D. Power outage', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5567, 1440, N'A', N'A. Canceling the order', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5568, 1440, N'B', N'B. Calling a new supplier', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5569, 1440, N'C', N'C. Adjusting the break schedule', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5570, 1440, N'D', N'D. Working overtime', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5571, 1441, N'A', N'A. The text has typos.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5572, 1441, N'B', N'B. The paper is too thin.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5573, 1441, N'C', N'C. The colors are incorrect.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5574, 1441, N'D', N'D. The quantity is wrong.', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5575, 1442, N'A', N'A. Today', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5576, 1442, N'B', N'B. Friday', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5577, 1442, N'C', N'C. Saturday', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5578, 1442, N'D', N'D. Next week', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5579, 1443, N'A', N'A. Change the logo', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5580, 1443, N'B', N'B. Contact the print shop', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5581, 1443, N'C', N'C. Cancel the event', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5582, 1443, N'D', N'D. Print them himself', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5583, 1444, N'A', N'(A)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5584, 1444, N'B', N'(B)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5585, 1444, N'C', N'(C)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5586, 1444, N'D', N'(D)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5587, 1445, N'A', N'(A)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5588, 1445, N'B', N'(B)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5589, 1445, N'C', N'(C)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5590, 1445, N'D', N'(D)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5591, 1446, N'A', N'(A)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5592, 1446, N'B', N'(B)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5593, 1446, N'C', N'(C)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5594, 1446, N'D', N'(D)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5595, 1447, N'A', N'(A)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5596, 1447, N'B', N'(B)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5597, 1447, N'C', N'(C)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5598, 1447, N'D', N'(D)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5599, 1448, N'A', N'(A)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5600, 1448, N'B', N'(B)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5601, 1448, N'C', N'(C)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5602, 1448, N'D', N'(D)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5603, 1449, N'A', N'(A)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5604, 1449, N'B', N'(B)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5605, 1449, N'C', N'(C)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5606, 1449, N'D', N'(D)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5607, 1450, N'A', N'(A)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5608, 1450, N'B', N'(B)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5609, 1450, N'C', N'(C)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5610, 1450, N'D', N'(D)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5611, 1451, N'A', N'(A)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5612, 1451, N'B', N'(B)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5613, 1451, N'C', N'(C)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5614, 1451, N'D', N'(D)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5615, 1452, N'A', N'(A)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5616, 1452, N'B', N'(B)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5617, 1452, N'C', N'(C)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5618, 1452, N'D', N'(D)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5619, 1453, N'A', N'(A)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5620, 1453, N'B', N'(B)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5621, 1453, N'C', N'(C)', NULL)
INSERT [dbo].[Answers] ([Id], [QuestionId], [Label], [Content], [IsCorrect]) VALUES (5622, 1453, N'D', N'(D)', NULL)
SET IDENTITY_INSERT [dbo].[Answers] OFF
GO
SET IDENTITY_INSERT [dbo].[Bookmarks] ON 

INSERT [dbo].[Bookmarks] ([Id], [UserId], [QuestionId], [Note], [CreatedAt]) VALUES (162, 1, 607, N'Chưa làm được', CAST(N'2025-12-31T12:38:22.3220515' AS DateTime2))
INSERT [dbo].[Bookmarks] ([Id], [UserId], [QuestionId], [Note], [CreatedAt]) VALUES (163, 1, 610, N'Chưa làm được', CAST(N'2025-12-31T12:38:25.7668298' AS DateTime2))
INSERT [dbo].[Bookmarks] ([Id], [UserId], [QuestionId], [Note], [CreatedAt]) VALUES (164, 1, 611, N'Chưa làm được', CAST(N'2025-12-31T12:38:27.3904651' AS DateTime2))
INSERT [dbo].[Bookmarks] ([Id], [UserId], [QuestionId], [Note], [CreatedAt]) VALUES (165, 1, 612, N'Chưa làm được', CAST(N'2025-12-31T12:38:29.0109988' AS DateTime2))
INSERT [dbo].[Bookmarks] ([Id], [UserId], [QuestionId], [Note], [CreatedAt]) VALUES (166, 1, 613, N'Chưa làm được', CAST(N'2025-12-31T12:38:30.6725582' AS DateTime2))
INSERT [dbo].[Bookmarks] ([Id], [UserId], [QuestionId], [Note], [CreatedAt]) VALUES (167, 1, 615, N'Chưa làm được', CAST(N'2025-12-31T12:38:32.3659118' AS DateTime2))
INSERT [dbo].[Bookmarks] ([Id], [UserId], [QuestionId], [Note], [CreatedAt]) VALUES (168, 1, 674, N'Chưa làm được', CAST(N'2025-12-31T12:38:37.5626312' AS DateTime2))
INSERT [dbo].[Bookmarks] ([Id], [UserId], [QuestionId], [Note], [CreatedAt]) VALUES (169, 1, 675, N'Chưa làm được', CAST(N'2025-12-31T12:38:39.5405613' AS DateTime2))
INSERT [dbo].[Bookmarks] ([Id], [UserId], [QuestionId], [Note], [CreatedAt]) VALUES (170, 1, 676, N'Chưa làm được', CAST(N'2025-12-31T12:38:41.6415783' AS DateTime2))
INSERT [dbo].[Bookmarks] ([Id], [UserId], [QuestionId], [Note], [CreatedAt]) VALUES (171, 1, 677, N'Chưa làm được', CAST(N'2025-12-31T12:38:43.6888527' AS DateTime2))
INSERT [dbo].[Bookmarks] ([Id], [UserId], [QuestionId], [Note], [CreatedAt]) VALUES (172, 1, 678, N'Chưa làm được', CAST(N'2025-12-31T12:38:45.2385179' AS DateTime2))
INSERT [dbo].[Bookmarks] ([Id], [UserId], [QuestionId], [Note], [CreatedAt]) VALUES (173, 1, 679, N'Chưa làm được', CAST(N'2025-12-31T12:38:46.7368948' AS DateTime2))
INSERT [dbo].[Bookmarks] ([Id], [UserId], [QuestionId], [Note], [CreatedAt]) VALUES (174, 1, 330, N'Chưa làm được', CAST(N'2025-12-31T12:38:51.2146672' AS DateTime2))
INSERT [dbo].[Bookmarks] ([Id], [UserId], [QuestionId], [Note], [CreatedAt]) VALUES (175, 1, 331, N'Chưa làm được', CAST(N'2025-12-31T12:38:52.8740901' AS DateTime2))
INSERT [dbo].[Bookmarks] ([Id], [UserId], [QuestionId], [Note], [CreatedAt]) VALUES (176, 1, 332, N'Chưa làm được', CAST(N'2025-12-31T12:38:55.0828424' AS DateTime2))
INSERT [dbo].[Bookmarks] ([Id], [UserId], [QuestionId], [Note], [CreatedAt]) VALUES (177, 1, 333, N'Chưa làm được', CAST(N'2025-12-31T12:38:56.9525391' AS DateTime2))
INSERT [dbo].[Bookmarks] ([Id], [UserId], [QuestionId], [Note], [CreatedAt]) VALUES (178, 1, 334, N'Chưa làm được', CAST(N'2025-12-31T12:38:58.6774101' AS DateTime2))
INSERT [dbo].[Bookmarks] ([Id], [UserId], [QuestionId], [Note], [CreatedAt]) VALUES (179, 1, 335, N'Chưa làm được', CAST(N'2025-12-31T12:39:00.6302595' AS DateTime2))
INSERT [dbo].[Bookmarks] ([Id], [UserId], [QuestionId], [Note], [CreatedAt]) VALUES (180, 1, 71, N'Chưa làm được', CAST(N'2025-12-31T12:39:04.7302514' AS DateTime2))
INSERT [dbo].[Bookmarks] ([Id], [UserId], [QuestionId], [Note], [CreatedAt]) VALUES (181, 1, 72, N'Chưa làm được', CAST(N'2025-12-31T12:39:06.2008123' AS DateTime2))
INSERT [dbo].[Bookmarks] ([Id], [UserId], [QuestionId], [Note], [CreatedAt]) VALUES (182, 1, 73, N'Chưa làm được', CAST(N'2025-12-31T12:39:07.7638690' AS DateTime2))
INSERT [dbo].[Bookmarks] ([Id], [UserId], [QuestionId], [Note], [CreatedAt]) VALUES (183, 1, 101, N'Chưa làm được', CAST(N'2025-12-31T12:39:11.9493861' AS DateTime2))
INSERT [dbo].[Bookmarks] ([Id], [UserId], [QuestionId], [Note], [CreatedAt]) VALUES (184, 1, 102, N'Chưa làm được', CAST(N'2025-12-31T12:39:14.2135874' AS DateTime2))
INSERT [dbo].[Bookmarks] ([Id], [UserId], [QuestionId], [Note], [CreatedAt]) VALUES (185, 1, 103, N'Chưa làm được', CAST(N'2025-12-31T12:39:16.2974855' AS DateTime2))
INSERT [dbo].[Bookmarks] ([Id], [UserId], [QuestionId], [Note], [CreatedAt]) VALUES (186, 1, 104, N'Chưa làm được', CAST(N'2025-12-31T12:39:17.7523698' AS DateTime2))
INSERT [dbo].[Bookmarks] ([Id], [UserId], [QuestionId], [Note], [CreatedAt]) VALUES (187, 1, 105, N'Chưa làm được', CAST(N'2025-12-31T12:39:19.9188840' AS DateTime2))
INSERT [dbo].[Bookmarks] ([Id], [UserId], [QuestionId], [Note], [CreatedAt]) VALUES (188, 1, 468, N'Chưa làm được', CAST(N'2025-12-31T12:39:22.9260695' AS DateTime2))
INSERT [dbo].[Bookmarks] ([Id], [UserId], [QuestionId], [Note], [CreatedAt]) VALUES (189, 1, 469, N'Chưa làm được', CAST(N'2025-12-31T12:39:24.9702183' AS DateTime2))
INSERT [dbo].[Bookmarks] ([Id], [UserId], [QuestionId], [Note], [CreatedAt]) VALUES (190, 1, 470, N'Chưa làm được', CAST(N'2025-12-31T12:39:28.1309734' AS DateTime2))
INSERT [dbo].[Bookmarks] ([Id], [UserId], [QuestionId], [Note], [CreatedAt]) VALUES (191, 1, 471, N'Chưa làm được', CAST(N'2025-12-31T12:39:29.6566851' AS DateTime2))
INSERT [dbo].[Bookmarks] ([Id], [UserId], [QuestionId], [Note], [CreatedAt]) VALUES (192, 1, 472, N'Chưa làm được', CAST(N'2025-12-31T12:39:31.8323741' AS DateTime2))
INSERT [dbo].[Bookmarks] ([Id], [UserId], [QuestionId], [Note], [CreatedAt]) VALUES (193, 1, 473, N'Chưa làm được', CAST(N'2025-12-31T12:39:33.9992685' AS DateTime2))
INSERT [dbo].[Bookmarks] ([Id], [UserId], [QuestionId], [Note], [CreatedAt]) VALUES (194, 1, 474, N'Chưa làm được', CAST(N'2026-01-03T12:56:52.1284258' AS DateTime2))
INSERT [dbo].[Bookmarks] ([Id], [UserId], [QuestionId], [Note], [CreatedAt]) VALUES (196, 1, 604, N'Lưu để tham khảo', CAST(N'2026-01-19T06:46:29.5806709' AS DateTime2))
INSERT [dbo].[Bookmarks] ([Id], [UserId], [QuestionId], [Note], [CreatedAt]) VALUES (197, 1, 605, N'Cần ôn lại lỗi sai', CAST(N'2026-01-19T06:46:33.4713556' AS DateTime2))
INSERT [dbo].[Bookmarks] ([Id], [UserId], [QuestionId], [Note], [CreatedAt]) VALUES (198, 1, 614, N'Chưa làm được', CAST(N'2026-01-19T06:46:40.2354327' AS DateTime2))
SET IDENTITY_INSERT [dbo].[Bookmarks] OFF
GO
SET IDENTITY_INSERT [dbo].[CommentLikes] ON 

INSERT [dbo].[CommentLikes] ([Id], [CommentId], [UserId], [CreatedAt]) VALUES (2, 1, 1, CAST(N'2026-01-03T14:01:14.6235026' AS DateTime2))
INSERT [dbo].[CommentLikes] ([Id], [CommentId], [UserId], [CreatedAt]) VALUES (3, 3, 1, CAST(N'2026-01-07T14:17:12.0126291' AS DateTime2))
SET IDENTITY_INSERT [dbo].[CommentLikes] OFF
GO
SET IDENTITY_INSERT [dbo].[Comments] ON 

INSERT [dbo].[Comments] ([Id], [TestId], [UserId], [ParentCommentId], [Content], [CreatedAt], [UpdatedAt], [IsDeleted]) VALUES (1, 2, 1, NULL, N'xin chao', CAST(N'2025-12-20T12:56:32.0513362' AS DateTime2), NULL, 0)
INSERT [dbo].[Comments] ([Id], [TestId], [UserId], [ParentCommentId], [Content], [CreatedAt], [UpdatedAt], [IsDeleted]) VALUES (2, 2, 1, 1, N'hi', CAST(N'2025-12-29T14:11:49.0320566' AS DateTime2), NULL, 0)
INSERT [dbo].[Comments] ([Id], [TestId], [UserId], [ParentCommentId], [Content], [CreatedAt], [UpdatedAt], [IsDeleted]) VALUES (3, 2, 1, NULL, N'hi', CAST(N'2026-01-07T14:17:08.1878651' AS DateTime2), NULL, 0)
SET IDENTITY_INSERT [dbo].[Comments] OFF
GO
SET IDENTITY_INSERT [dbo].[Parts] ON 

INSERT [dbo].[Parts] ([Id], [TestId], [Name], [PartNumber], [Description]) VALUES (4, 2, N'Part 5', 5, NULL)
INSERT [dbo].[Parts] ([Id], [TestId], [Name], [PartNumber], [Description]) VALUES (5, 2, N'Part 6: Text Completion', 6, NULL)
INSERT [dbo].[Parts] ([Id], [TestId], [Name], [PartNumber], [Description]) VALUES (10, 2, N'Part 4: Talks', 4, NULL)
INSERT [dbo].[Parts] ([Id], [TestId], [Name], [PartNumber], [Description]) VALUES (12, 2, N'Part 7: Reading Comprehension', 7, NULL)
INSERT [dbo].[Parts] ([Id], [TestId], [Name], [PartNumber], [Description]) VALUES (17, 2, N'Part 1: Photographs', 1, NULL)
INSERT [dbo].[Parts] ([Id], [TestId], [Name], [PartNumber], [Description]) VALUES (18, 2, N'Part 2: Question-Response', 2, NULL)
INSERT [dbo].[Parts] ([Id], [TestId], [Name], [PartNumber], [Description]) VALUES (20, 2, N'Part 3: Conversations', 3, NULL)
INSERT [dbo].[Parts] ([Id], [TestId], [Name], [PartNumber], [Description]) VALUES (22, 3, N'Part 1: Photographs', 1, NULL)
INSERT [dbo].[Parts] ([Id], [TestId], [Name], [PartNumber], [Description]) VALUES (23, 3, N'Part 2: Question-Response', 2, NULL)
INSERT [dbo].[Parts] ([Id], [TestId], [Name], [PartNumber], [Description]) VALUES (24, 3, N'Part 3: Conversations', 3, NULL)
INSERT [dbo].[Parts] ([Id], [TestId], [Name], [PartNumber], [Description]) VALUES (25, 3, N'Part 5', 5, NULL)
INSERT [dbo].[Parts] ([Id], [TestId], [Name], [PartNumber], [Description]) VALUES (26, 3, N'Part 6: Text Completion', 6, NULL)
INSERT [dbo].[Parts] ([Id], [TestId], [Name], [PartNumber], [Description]) VALUES (28, 3, N'Part 7: Reading Comprehension', 7, NULL)
INSERT [dbo].[Parts] ([Id], [TestId], [Name], [PartNumber], [Description]) VALUES (38, 4, N'Part 3: Conversations', 3, NULL)
INSERT [dbo].[Parts] ([Id], [TestId], [Name], [PartNumber], [Description]) VALUES (39, 4, N'Part 1: Photographs', 1, NULL)
SET IDENTITY_INSERT [dbo].[Parts] OFF
GO
SET IDENTITY_INSERT [dbo].[Payments] ON 

INSERT [dbo].[Payments] ([Id], [UserId], [TransactionNo], [Amount], [OrderInfo], [PackageType], [DurationMonths], [PaymentStatus], [PaymentMethod], [CreatedAt], [PaidAt], [ResponseCode], [ResponseMessage], [SubscriptionStartDate], [SubscriptionEndDate], [IsSubscriptionActive]) VALUES (6, 1, N'TOEIC_639060602744028925', 99000, N'Premium Standard - 3 tháng', N'Standard', 3, N'PENDING', N'MoMo', CAST(N'2026-02-07T04:24:34.4022567' AS DateTime2), NULL, NULL, NULL, NULL, NULL, 0)
INSERT [dbo].[Payments] ([Id], [UserId], [TransactionNo], [Amount], [OrderInfo], [PackageType], [DurationMonths], [PaymentStatus], [PaymentMethod], [CreatedAt], [PaidAt], [ResponseCode], [ResponseMessage], [SubscriptionStartDate], [SubscriptionEndDate], [IsSubscriptionActive]) VALUES (7, 1, N'TOEIC_639060603513970939', 99000, N'Premium Standard - 3 tháng', N'Standard', 3, N'PENDING', N'MoMo', CAST(N'2026-02-07T04:25:51.3963803' AS DateTime2), NULL, NULL, NULL, NULL, NULL, 0)
INSERT [dbo].[Payments] ([Id], [UserId], [TransactionNo], [Amount], [OrderInfo], [PackageType], [DurationMonths], [PaymentStatus], [PaymentMethod], [CreatedAt], [PaidAt], [ResponseCode], [ResponseMessage], [SubscriptionStartDate], [SubscriptionEndDate], [IsSubscriptionActive]) VALUES (8, 1, N'TOEIC_639060606029610340', 99000, N'Premium Standard - 3 tháng', N'Standard', 3, N'PENDING', N'MoMo', CAST(N'2026-02-07T04:30:02.9606429' AS DateTime2), NULL, NULL, NULL, NULL, NULL, 0)
INSERT [dbo].[Payments] ([Id], [UserId], [TransactionNo], [Amount], [OrderInfo], [PackageType], [DurationMonths], [PaymentStatus], [PaymentMethod], [CreatedAt], [PaidAt], [ResponseCode], [ResponseMessage], [SubscriptionStartDate], [SubscriptionEndDate], [IsSubscriptionActive]) VALUES (9, 1, N'TOEIC_639060607345019102', 99000, N'Premium Standard - 3 tháng', N'Standard', 3, N'PENDING', N'MoMo', CAST(N'2026-02-07T04:32:14.5009283' AS DateTime2), NULL, NULL, NULL, NULL, NULL, 0)
INSERT [dbo].[Payments] ([Id], [UserId], [TransactionNo], [Amount], [OrderInfo], [PackageType], [DurationMonths], [PaymentStatus], [PaymentMethod], [CreatedAt], [PaidAt], [ResponseCode], [ResponseMessage], [SubscriptionStartDate], [SubscriptionEndDate], [IsSubscriptionActive]) VALUES (10, 1, N'TOEIC_639061494082367924', 99000, N'Premium Standard - 3 tháng', N'Standard', 3, N'PENDING', N'MoMo', CAST(N'2026-02-08T05:10:08.2361777' AS DateTime2), NULL, NULL, NULL, NULL, NULL, 0)
INSERT [dbo].[Payments] ([Id], [UserId], [TransactionNo], [Amount], [OrderInfo], [PackageType], [DurationMonths], [PaymentStatus], [PaymentMethod], [CreatedAt], [PaidAt], [ResponseCode], [ResponseMessage], [SubscriptionStartDate], [SubscriptionEndDate], [IsSubscriptionActive]) VALUES (11, 1, N'TOEIC_639061505143994394', 99000, N'Premium Standard - 3 tháng', N'Standard', 3, N'PENDING', N'MoMo', CAST(N'2026-02-08T05:28:34.3988314' AS DateTime2), NULL, NULL, NULL, NULL, NULL, 0)
INSERT [dbo].[Payments] ([Id], [UserId], [TransactionNo], [Amount], [OrderInfo], [PackageType], [DurationMonths], [PaymentStatus], [PaymentMethod], [CreatedAt], [PaidAt], [ResponseCode], [ResponseMessage], [SubscriptionStartDate], [SubscriptionEndDate], [IsSubscriptionActive]) VALUES (12, 1, N'TOEIC_639061510594483288', 49000, N'Premium Starter - 1 tháng', N'Starter', 1, N'PENDING', N'MoMo', CAST(N'2026-02-08T05:37:39.4483193' AS DateTime2), NULL, NULL, NULL, NULL, NULL, 0)
INSERT [dbo].[Payments] ([Id], [UserId], [TransactionNo], [Amount], [OrderInfo], [PackageType], [DurationMonths], [PaymentStatus], [PaymentMethod], [CreatedAt], [PaidAt], [ResponseCode], [ResponseMessage], [SubscriptionStartDate], [SubscriptionEndDate], [IsSubscriptionActive]) VALUES (13, 1, N'TOEIC_639061512051394742', 49000, N'Premium Starter - 1 tháng', N'Starter', 1, N'PENDING', N'MoMo', CAST(N'2026-02-08T05:40:05.1386366' AS DateTime2), NULL, NULL, NULL, NULL, NULL, 0)
INSERT [dbo].[Payments] ([Id], [UserId], [TransactionNo], [Amount], [OrderInfo], [PackageType], [DurationMonths], [PaymentStatus], [PaymentMethod], [CreatedAt], [PaidAt], [ResponseCode], [ResponseMessage], [SubscriptionStartDate], [SubscriptionEndDate], [IsSubscriptionActive]) VALUES (14, 1, N'TOEIC_639061512415946786', 99000, N'Premium Standard - 3 tháng', N'Standard', 3, N'PENDING', N'MoMo', CAST(N'2026-02-08T05:40:41.5941232' AS DateTime2), NULL, NULL, NULL, NULL, NULL, 0)
INSERT [dbo].[Payments] ([Id], [UserId], [TransactionNo], [Amount], [OrderInfo], [PackageType], [DurationMonths], [PaymentStatus], [PaymentMethod], [CreatedAt], [PaidAt], [ResponseCode], [ResponseMessage], [SubscriptionStartDate], [SubscriptionEndDate], [IsSubscriptionActive]) VALUES (15, 1, N'TOEIC_639064872770180037', 49000, N'Premium Starter - 1 tháng', N'Starter', 1, N'PENDING', N'MoMo', CAST(N'2026-02-12T03:01:17.0172517' AS DateTime2), NULL, NULL, NULL, NULL, NULL, 0)
INSERT [dbo].[Payments] ([Id], [UserId], [TransactionNo], [Amount], [OrderInfo], [PackageType], [DurationMonths], [PaymentStatus], [PaymentMethod], [CreatedAt], [PaidAt], [ResponseCode], [ResponseMessage], [SubscriptionStartDate], [SubscriptionEndDate], [IsSubscriptionActive]) VALUES (16, 1, N'TOEIC_639064883741032213', 49000, N'Premium Starter - 1 tháng', N'Starter', 1, N'PENDING', N'MoMo', CAST(N'2026-02-12T03:19:34.1026602' AS DateTime2), NULL, NULL, NULL, NULL, NULL, 0)
INSERT [dbo].[Payments] ([Id], [UserId], [TransactionNo], [Amount], [OrderInfo], [PackageType], [DurationMonths], [PaymentStatus], [PaymentMethod], [CreatedAt], [PaidAt], [ResponseCode], [ResponseMessage], [SubscriptionStartDate], [SubscriptionEndDate], [IsSubscriptionActive]) VALUES (17, 1, N'TOEIC_639064885162891429', 49000, N'Premium Starter - 1 tháng', N'Starter', 1, N'PENDING', N'MoMo', CAST(N'2026-02-12T03:21:56.2886144' AS DateTime2), NULL, NULL, NULL, NULL, NULL, 0)
INSERT [dbo].[Payments] ([Id], [UserId], [TransactionNo], [Amount], [OrderInfo], [PackageType], [DurationMonths], [PaymentStatus], [PaymentMethod], [CreatedAt], [PaidAt], [ResponseCode], [ResponseMessage], [SubscriptionStartDate], [SubscriptionEndDate], [IsSubscriptionActive]) VALUES (18, 1, N'TOEIC_639064886838753389', 49000, N'Premium Starter - 1 tháng', N'Starter', 1, N'PENDING', N'MoMo', CAST(N'2026-02-12T03:24:43.8749749' AS DateTime2), NULL, NULL, NULL, NULL, NULL, 0)
INSERT [dbo].[Payments] ([Id], [UserId], [TransactionNo], [Amount], [OrderInfo], [PackageType], [DurationMonths], [PaymentStatus], [PaymentMethod], [CreatedAt], [PaidAt], [ResponseCode], [ResponseMessage], [SubscriptionStartDate], [SubscriptionEndDate], [IsSubscriptionActive]) VALUES (19, 1, N'TOEIC_639064887328365797', 49000, N'Premium Starter - 1 tháng', N'Starter', 1, N'PENDING', N'MoMo', CAST(N'2026-02-12T03:25:32.8360007' AS DateTime2), NULL, NULL, NULL, NULL, NULL, 0)
INSERT [dbo].[Payments] ([Id], [UserId], [TransactionNo], [Amount], [OrderInfo], [PackageType], [DurationMonths], [PaymentStatus], [PaymentMethod], [CreatedAt], [PaidAt], [ResponseCode], [ResponseMessage], [SubscriptionStartDate], [SubscriptionEndDate], [IsSubscriptionActive]) VALUES (20, 1, N'TOEIC_639065068194772104', 49000, N'Premium Starter - 1 tháng', N'Starter', 1, N'PENDING', N'MoMo', CAST(N'2026-02-12T08:26:59.4766253' AS DateTime2), NULL, NULL, NULL, NULL, NULL, 0)
INSERT [dbo].[Payments] ([Id], [UserId], [TransactionNo], [Amount], [OrderInfo], [PackageType], [DurationMonths], [PaymentStatus], [PaymentMethod], [CreatedAt], [PaidAt], [ResponseCode], [ResponseMessage], [SubscriptionStartDate], [SubscriptionEndDate], [IsSubscriptionActive]) VALUES (21, 1, N'TOEIC_639065342499791421', 49000, N'Premium Starter - 1 tháng', N'Starter', 1, N'PENDING', N'MoMo', CAST(N'2026-02-12T16:04:09.9785332' AS DateTime2), NULL, NULL, NULL, NULL, NULL, 0)
INSERT [dbo].[Payments] ([Id], [UserId], [TransactionNo], [Amount], [OrderInfo], [PackageType], [DurationMonths], [PaymentStatus], [PaymentMethod], [CreatedAt], [PaidAt], [ResponseCode], [ResponseMessage], [SubscriptionStartDate], [SubscriptionEndDate], [IsSubscriptionActive]) VALUES (22, 1, N'TOEIC_639065342581404709', 49000, N'Premium Starter - 1 tháng', N'Starter', 1, N'PENDING', N'MoMo', CAST(N'2026-02-12T16:04:18.1404637' AS DateTime2), NULL, NULL, NULL, NULL, NULL, 0)
INSERT [dbo].[Payments] ([Id], [UserId], [TransactionNo], [Amount], [OrderInfo], [PackageType], [DurationMonths], [PaymentStatus], [PaymentMethod], [CreatedAt], [PaidAt], [ResponseCode], [ResponseMessage], [SubscriptionStartDate], [SubscriptionEndDate], [IsSubscriptionActive]) VALUES (23, 1, N'TOEIC_639065352182712136', 49000, N'Premium Starter - 1 tháng', N'Starter', 1, N'PENDING', N'MoMo', CAST(N'2026-02-12T16:20:18.2712073' AS DateTime2), NULL, NULL, NULL, NULL, NULL, 0)
INSERT [dbo].[Payments] ([Id], [UserId], [TransactionNo], [Amount], [OrderInfo], [PackageType], [DurationMonths], [PaymentStatus], [PaymentMethod], [CreatedAt], [PaidAt], [ResponseCode], [ResponseMessage], [SubscriptionStartDate], [SubscriptionEndDate], [IsSubscriptionActive]) VALUES (24, 1, N'TOEIC_639065352266057734', 49000, N'Premium Starter - 1 tháng', N'Starter', 1, N'PENDING', N'MoMo', CAST(N'2026-02-12T16:20:26.6057684' AS DateTime2), NULL, NULL, NULL, NULL, NULL, 0)
INSERT [dbo].[Payments] ([Id], [UserId], [TransactionNo], [Amount], [OrderInfo], [PackageType], [DurationMonths], [PaymentStatus], [PaymentMethod], [CreatedAt], [PaidAt], [ResponseCode], [ResponseMessage], [SubscriptionStartDate], [SubscriptionEndDate], [IsSubscriptionActive]) VALUES (25, 1, N'TOEIC_639065356102118074', 49000, N'Premium Starter - 1 tháng', N'Starter', 1, N'PENDING', N'MoMo', CAST(N'2026-02-12T16:26:50.2111278' AS DateTime2), NULL, NULL, NULL, NULL, NULL, 0)
INSERT [dbo].[Payments] ([Id], [UserId], [TransactionNo], [Amount], [OrderInfo], [PackageType], [DurationMonths], [PaymentStatus], [PaymentMethod], [CreatedAt], [PaidAt], [ResponseCode], [ResponseMessage], [SubscriptionStartDate], [SubscriptionEndDate], [IsSubscriptionActive]) VALUES (26, 1, N'TOEIC_639065360052044171', 49000, N'Premium Starter - 1 tháng', N'Starter', 1, N'PENDING', N'MoMo', CAST(N'2026-02-12T16:33:25.2036938' AS DateTime2), NULL, NULL, NULL, NULL, NULL, 0)
INSERT [dbo].[Payments] ([Id], [UserId], [TransactionNo], [Amount], [OrderInfo], [PackageType], [DurationMonths], [PaymentStatus], [PaymentMethod], [CreatedAt], [PaidAt], [ResponseCode], [ResponseMessage], [SubscriptionStartDate], [SubscriptionEndDate], [IsSubscriptionActive]) VALUES (27, 1, N'TOEIC_639065362302867408', 49000, N'Premium Starter - 1 tháng', N'Starter', 1, N'PENDING', N'MoMo', CAST(N'2026-02-12T16:37:10.2861011' AS DateTime2), NULL, NULL, NULL, NULL, NULL, 0)
INSERT [dbo].[Payments] ([Id], [UserId], [TransactionNo], [Amount], [OrderInfo], [PackageType], [DurationMonths], [PaymentStatus], [PaymentMethod], [CreatedAt], [PaidAt], [ResponseCode], [ResponseMessage], [SubscriptionStartDate], [SubscriptionEndDate], [IsSubscriptionActive]) VALUES (28, 1, N'TOEIC_639065369032242632', 49000, N'Premium Starter - 1 tháng', N'Starter', 1, N'PENDING', N'MoMo', CAST(N'2026-02-12T16:48:23.2232236' AS DateTime2), NULL, NULL, NULL, NULL, NULL, 0)
INSERT [dbo].[Payments] ([Id], [UserId], [TransactionNo], [Amount], [OrderInfo], [PackageType], [DurationMonths], [PaymentStatus], [PaymentMethod], [CreatedAt], [PaidAt], [ResponseCode], [ResponseMessage], [SubscriptionStartDate], [SubscriptionEndDate], [IsSubscriptionActive]) VALUES (29, 1, N'TOEIC_639065369897589125', 49000, N'Premium Starter - 1 tháng', N'Starter', 1, N'PENDING', N'MoMo', CAST(N'2026-02-12T16:49:49.7578555' AS DateTime2), NULL, NULL, NULL, NULL, NULL, 0)
INSERT [dbo].[Payments] ([Id], [UserId], [TransactionNo], [Amount], [OrderInfo], [PackageType], [DurationMonths], [PaymentStatus], [PaymentMethod], [CreatedAt], [PaidAt], [ResponseCode], [ResponseMessage], [SubscriptionStartDate], [SubscriptionEndDate], [IsSubscriptionActive]) VALUES (30, 1, N'TOEIC_639065371525405958', 49000, N'Premium Starter - 1 tháng', N'Starter', 1, N'PENDING', N'MoMo', CAST(N'2026-02-12T16:52:32.5399348' AS DateTime2), NULL, NULL, NULL, NULL, NULL, 0)
SET IDENTITY_INSERT [dbo].[Payments] OFF
GO
SET IDENTITY_INSERT [dbo].[PracticeSessions] ON 

INSERT [dbo].[PracticeSessions] ([Id], [UserId], [PartNumber], [TotalQuestions], [CorrectAnswers], [TimeSpentSeconds], [StartedAt], [CompletedAt], [Status]) VALUES (1, 1, 2, 20, 0, 0, CAST(N'0001-01-01T00:00:00.0000000' AS DateTime2), NULL, N'in_progress')
INSERT [dbo].[PracticeSessions] ([Id], [UserId], [PartNumber], [TotalQuestions], [CorrectAnswers], [TimeSpentSeconds], [StartedAt], [CompletedAt], [Status]) VALUES (2, 1, 1, 6, 0, 0, CAST(N'0001-01-01T00:00:00.0000000' AS DateTime2), NULL, N'in_progress')
SET IDENTITY_INSERT [dbo].[PracticeSessions] OFF
GO
SET IDENTITY_INSERT [dbo].[QuestionGroups] ON 

INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (45, 4, N'Incomplete Sentences', NULL, NULL, NULL)
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (46, 5, N'Come to the Maxley Heights Center for Horticulture and learn how to create a beautiful, eco-friendly garden for your home or business. [131]................... We will teach you how to plant a rain garden, which is simply a shallow sunken garden [132].................. a special soil mix to filter pollutants from rainwater flowing from nearby roads and rooftops. These gardens can be landscaped with native plants and flowers. [133].................., rain gardens are always beneficial to the local environment. Among other things, [134].................. improve drainage and protect rivers and streams. To register, visit www.maxley-horticulture.org.', NULL, NULL, NULL)
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (47, 5, N'Dear Mr. Dombo, Thank you for your [135].................. support in helping me to plan the opening gala for Tokyo''s fashion week. The event was a huge success, and I was honored to work with you. I know that our attendees follow your work closely, and they loved the designs you contributed for this event. Your designs received a lot of [136].................. on social media. Shows like this will keep Tokyo on the map as a premier fashion centre. [137]................... I realize that the multiple delays made the planning no easy task. The auction [138].................. our Young Designers Award program is coming up soon and I look forward to working with you on that as well. Sincerely, Asahi Ishioka', NULL, NULL, NULL)
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (48, 5, N'Dear Mr. Hughes, Please be advised that your Mena Chin Library card will expire one month from today. [139].................. must be renewed if you intend to keep your membership for the coming year. This can be done at the information desk at any branch location. [140]................... [141].................. you decide to close your account, no action is necessary. Failure to complete your renewal by the [142].................. date will result in the expiration of your library privileges. If you have any questions about this notice, or about general library services, you may reply directly to this e-mail. Sincerely, Patron Services', NULL, NULL, NULL)
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (49, 5, N'Dear Ms. Burwell, I am Omar Ridha, the manager of Droplight Studio. [143]................... We offer a full range of photography services for real estate professionals like you. We take pride in composing interior and exterior shots that make a property look its best. Droplight Studio spares no effort in [144].................. superior digital images. [145].................., our professional-grade equipment, lighting, and staging techniques allow us to highlight the best features of a property. And once the photo shoot is over, every image [146].................. expert editing. All these services come standard in every package. Please visit our Web site to view our work as well as our pricing and scheduling information. We are happy to work with you to customize orders. Sincerely, Omar Ridha, Droplight Studio', NULL, NULL, NULL)
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (159, 10, NULL, N'/uploads/audio/PART4-TEST1.mp3', NULL, N'[Transcript content placeholder]')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (160, 10, NULL, N'/uploads/audio/PART4-TEST1.mp3', NULL, N'[Transcript content placeholder]')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (161, 10, NULL, N'/uploads/audio/PART4-TEST1.mp3', NULL, N'[Transcript content placeholder]')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (162, 10, NULL, N'/uploads/audio/PART4-TEST1.mp3', NULL, N'[Transcript content placeholder]')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (163, 10, NULL, N'/uploads/audio/PART4-TEST1.mp3', NULL, N'[Transcript content placeholder]')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (164, 10, NULL, N'/uploads/audio/PART4-TEST1.mp3', NULL, N'[Transcript content placeholder]')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (165, 10, NULL, N'/uploads/audio/PART4-TEST1.mp3', NULL, N'[Transcript content placeholder]')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (166, 10, NULL, N'/uploads/audio/PART4-TEST1.mp3', NULL, N'[Transcript content placeholder]')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (167, 10, NULL, N'/uploads/audio/PART4-TEST1.mp3', NULL, N'[Transcript content placeholder]')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (168, 10, NULL, N'/uploads/audio/PART4-TEST1.mp3', NULL, N'[Transcript content placeholder]')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (203, 12, N'STOP! PLEASE READ FIRST.
Thank you for purchasing this item. As you do the unpacking, please verify that all components are included and place them in a safe area to avoid loss or damage. Assemble the item on a soft surface or on the flattened empty box. Follow the pictures and begin the assembly by placing the main part on its side. Never overtighten any screws or bolts, or you may damage the wood or cushioning. Please visit our Web site to obtain maintenance tips and register your product for warranty coverage: www.indoordelight.com.', NULL, NULL, NULL)
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (204, 12, N'We are asking all Winnipeg staff to keep a copy of this schedule at their desks as a quick reference tool for scheduling interoffice meetings. Whenever possible, please schedule these meetings during one of the underlined hours, that is, after 7:00 A.M. but before 11:00 A.M. (Winnipeg time).

<table class="w-full border-collapse border border-gray-300 text-sm">
  <tr>
    <th class="border border-gray-300 p-2">Winnipeg</th>
    <th class="border border-gray-300 p-2">Toulouse</th>
  </tr>
  <tr>
    <td class="border border-gray-300 p-2">7:00 A.M.</td>
    <td class="border border-gray-300 p-2">2:00 P.M.</td>
  </tr>
  <tr>
    <td class="border border-gray-300 p-2">8:00 A.M.</td>
    <td class="border border-gray-300 p-2">3:00 P.M.</td>
  </tr>
  <tr>
    <td class="border border-gray-300 p-2">9:00 A.M.</td>
    <td class="border border-gray-300 p-2">4:00 P.M.</td>
  </tr>
  <tr>
    <td class="border border-gray-300 p-2">10:00 A.M.</td>
    <td class="border border-gray-300 p-2">5:00 P.M.</td>
  </tr>
  <tr>
    <td class="border border-gray-300 p-2">11:00 A.M.</td>
    <td class="border border-gray-300 p-2">6:00 P.M.</td>
  </tr>
  <tr>
    <td class="border border-gray-300 p-2">12:00 noon</td>
    <td class="border border-gray-300 p-2">7:00 P.M.</td>
  </tr>
</table>', NULL, NULL, NULL)
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (205, 12, N'The Bryant Foyer is one of the premier event spaces in our area. Set on a hill, it has expansive windows that provide sweeping views of the adjacent botanical gardens and the river. Built in 1897, it was the home of the Francona Charitable Trust until its renovation just over a year ago. Today, the space can accommodate up to 200 guests and is ideal for wedding receptions, office parties, and panel presentations. With its marble floors, cathedral ceiling, and stunning artwork, the Bryant Foyer is the ideal location for your next gathering.

The on-site restaurant, Andito''s, caters our events and also operates as its own business. This farm-to-table restaurant, headed by chef Michaela Rymond, meets all dietary needs and has revolutionized the local food scene. Area residents know to plan far in advance to get a seat.

To reserve the event space or to make a dinner reservation, give us a call at 216-555-0157.', NULL, NULL, NULL)
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (206, 12, N'Joan Chi (12:39 P.M.)
Hello Mina. Are you almost finished with the field measurements? I''m getting hungry.

Mina Evers (12:40 P.M.)
Sorry, Joan. I''m afraid you and Ms. Lim will have to go to lunch without me today. There''s a problem with the site coordinates. This is going to take some time.

Joan Chi (12:51 P.M.)
Oh no. Should we bring something back for you?

Mina Evers (12:59 P.M.)
Get me a chicken sandwich.

Joan Chi (1:00 P.M.)
Sure thing, Mina. See you in a while.', NULL, NULL, NULL)
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (207, 12, N'This season''s excellent weather has yielded a substantial harvest of fruits and vegetables, in many cases more than growers may find buyers for. Those of you wishing to donate surplus produce to community organizations can do so by visiting Vosey Farm and Garden''s Web site (www.vfgrdn.org), where you will find our list of drop-off locations.

If you need us to come to you instead, please contact us. We will reach out to one of the many independent truck drivers who have kindly volunteered to transport and quickly distribute your food donations to vetted groups that need it. Check our Web site for more information about this service as well as for insights into topics related to farming and gardening in the Northern Great Plains region.', NULL, NULL, NULL)
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (208, 12, N'We are delighted that you are joining us for today''s event. [1]. We ask that you adhere to the following guidelines to ensure that all attendees have an enjoyable experience.

Upon entering the venue, please put any and all electronic devices in silent mode. Ringtones and lit screens are very distracting to both the performers and your fellow audience members. [2]. Moreover, audience members are not allowed to make an audio or visual recording of the performance.

Bags and other items in the aisles pose a safety concern. [3]. If your bag is too big to fit properly under a seat, consider storing it in a locker for just $2. - [4]. One of our attendants will gladly assist you with that.

Thank you for your cooperation.', NULL, NULL, NULL)
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (209, 12, N'To: Camille Ayala <ayala@esplinelectronics.com>
From: Masae Adachi <madachi@sweeterspecialties.com>
Date: February 12
Subject: Event order
Attachment: Sweeter Specialties Request Form

Dear Ms. Ayala,

Thank you for selecting our business to provide baked goods for the Esplin Electronics conference event in March. We are honored that you chose us for a fourth year in a row!

On March 29, we will provide a large vanilla cake for each of the ten venues you indicated, and we will deliver a custom-baked multilayer cake on the following day. You will be billed on March 28. Please review the attached order form and return it to me within seven days.

Regarding the cake you ordered for March 30, our head pastry chef will produce it according to your specifications. In fact, he created a sample of the complete recipe earlier today-almond crÃ¨me cake with fresh raspberry filling. We have judged it to be a delectable treat, and we are sure that you will be pleased.

If you have any concerns, just send me an e-mail. As always, we value your business.

Masae Adachi, Owner
Sweeter Specialties', NULL, NULL, NULL)
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (210, 12, N'Great Dishwasher!

I never had a dishwasher before. After remodeling my kitchen, I finally had room for a compact dishwasher. I did a lot of research, and the Dish Magic 300 seemed to be the best choice. It was pricier than other models, but all of the reviews were excellent. So, I decided to spend the extra money. I have had the dishwasher for one month now, and I could not be happier with my decision.

Most importantly, the dishes come out sparkling clean, no matter how dirty they were going in. Also, the machine is so quiet, you do not even know it is running. Lastly, it is designed to use water efficiently, which is very important to me. Overall, I am very pleased with this dishwasher.

- Anna Yakovleva', NULL, NULL, NULL)
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (211, 12, N'Skyler Airlines employs more than 20,000 people from all over the world. We''re growing fast and have many positions available. [1]. So regardless of your background, there''s probably a place for you on our team. Skyler employees enjoy many perks. [2]. For example, our discount program enables them to fly to any of our destinations for a fraction of the average ticket price. [3]. We offer upward and global mobility, tuition reimbursement, a mentorship program, and a generous compensation package.[4] Annual paid vacations enable a comfortable work-life balance. It''s no wonder that Skyler Airlines was named "Best Airline to Work For" by Travel Vista Journal three years in a row.', NULL, NULL, NULL)
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (212, 12, N'Susan Gowan 9:16 A.M.
Good morning. The presentation slides about the new line of headphones are almost ready for distribution to our many partner stores. We are on track to send them out next Monday.

Maggie Lorenz 9:17 A.M.
How do they look?

Susan Gowan 9:20 A.M.
There are still some missing elements.

Alan Woodson 9:21 A.M.
We mainly need the information from the user studies that reviewed the headphones for sport use. We should have that report from the research and development office by Wednesday.

Maggie Lorenz 9:22 A.M.
Yes, let''s not overlook that. And if you''re concerned about the report not arriving by Wednesday, please contact Matt Harven and remind him to expedite a summary to us.

Susan Gowan 9:23 A.M.
Assuming we receive that summary soon enough to incorporate its findings into the slides, should the three of us schedule a trial run through the presentation on Thursday or Friday?

Maggie Lorenz 9:24 A.M.
Let''s try for Thursday afternoon. Then we will still have Friday to make any necessary changes.

Alan Woodson 9:25 A.M.
Fine by me. I''m free after 2 P.M.', NULL, NULL, NULL)
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (213, 12, N'Aparna Kothari, Media Contact
Kitchen Swifts
akothari@kitchenswifts.com.au
FOR IMMEDIATE RELEASE

SYDNEY (4 June)-Kitchen Swifts and Chef Darius Cordero are joining together to give home cooks a new culinary experience. The award-winning chef is the owner of restaurants in both the Philippines and Australia, including the recently opened Enriqua''s. He says his cooking reflects his Filipino heritage, which is a blend of many cultures. "I''ve designed these simplified recipes for Kitchen Swifts so that cooks at home can enjoy new and exciting flavours with ease," he said. "While preparing and eating these meals, you can feel like you are travelling the world with me."

Zahra Chambers, vice president of Kitchen Swifts, says she is pleased to work with Chef Cordero and to offer delicious new recipes to their customers. Kitchen Swifts supplies menus, recipes, and ingredients for two people, four people, or six people, including a range of vegetarian selections. Customers choose the most appropriate meal options, and then a box is delivered weekly. Current customers will see no price increase with the partnership. To find out more, visit the Kitchen Swifts Web site at www.kitchenswifts.com.au.

---

https://www.sydneyrestaurants.com.au
A colleague arranged for us to eat at Enriqua''s while I was at a conference in Sydney. It is usually fully booked for dinner; you may need to call months in advance for a table. We had a wonderful lunch there instead. Everything was delicious, and the bread and desserts are baked on-site! It was a worthwhile treat before I flew back to Hong Kong.

-Meili Guan', NULL, NULL, NULL)
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (214, 12, N'To: laura.savard@orbitmail.scot
From: cboyle@ceoleire.co.uk
Date: 25 May
Subject: RE: Some suggestions

Dear Ms. Savard,

Thank you for your kind offer to either pick up your online order from my shop or to pay extra for air or train transport. Neither arrangement is necessary, as I am happy to deliver your items to you in Stranraer myself. It so happens that my sister and her children live nearby in Kirkcolm. Before seeing them. I will drive my rental car to your house and hand deliver the items to you.

As you know, my merchandise is 100 percent handcrafted. If any damage occurs in transit, the repair turns into an expensive, time-consuming ordeal. Over the years, I''ve seen too much damage done by inattentive baggage handlers. My policy is to deliver items personally whenever feasible or hire a ground- or sea-based courier service I trust.

I look forward to meeting you on 5 June. I expect to arrive at your house no later than 5 p.m.

Sincerely.
Conor Boyle
Ceoleire Classics

---

Northern Ireland Ferry Service
Date of Issuance: 26 May
Passenger Name: Conor Boyle
Departing Belfast: Friday, 5 June, 1:05 PM
Docking at Cairnryan: Friday, 5 June, 3:20 PM
Baggage: 1 suitcase (small), 2 instrument cases (1 mandolin, 1 guitar)
Vehicle transport: No
Adult Standard Class: Â£55.00
Please arrive 30 minutes prior to departure.', NULL, NULL, NULL)
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (215, 12, N'?', NULL, NULL, NULL)
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (216, 12, N'To: laura.savard@orbitmail.scot
From: cboyle@ceoleire.co.uk
Date: 25 May
Subject: RE: Some suggestions

Dear Ms. Savard,

Thank you for your kind offer to either pick up your online order from my shop or to pay extra for air or train transport. Neither arrangement is necessary, as I am happy to deliver your items to you in Stranraer myself. It so happens that my sister and her children live nearby in Kirkcolm. Before seeing them. I will drive my rental car to your house and hand deliver the items to you.

As you know, my merchandise is 100 percent handcrafted. If any damage occurs in transit, the repair turns into an expensive, time-consuming ordeal. Over the years, I''ve seen too much damage done by inattentive baggage handlers. My policy is to deliver items personally whenever feasible or hire a ground- or sea-based courier service I trust.

I look forward to meeting you on 5 June. I expect to arrive at your house no later than 5 p.m.

Sincerely.
Conor Boyle
Ceoleire Classics

---

Northern Ireland Ferry Service
Date of Issuance: 26 May
Passenger Name: Conor Boyle
Departing Belfast: Friday, 5 June, 1:05 PM
Docking at Cairnryan: Friday, 5 June, 3:20 PM
Baggage: 1 suitcase (small), 2 instrument cases (1 mandolin, 1 guitar)
Vehicle transport: No
Adult Standard Class: Â£55.00
Please arrive 30 minutes prior to departure.', NULL, NULL, NULL)
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (217, 12, N'Train to Achieve (TTA)-Our classes prepare you to succeed!

Profiled in the latest Business Directions Nigeria newsletter, Train to Achieve (TTA) is one of the most innovative training providers in West Africa. By offering our classes entirely in online format, we bring the classroom to your home. All classes include individualized instruction and are taught by recognized professionals in their respective fields. Upon successful completion of a class, you will receive an official Certificate of Training, a valuable addition to any rÃ©sumÃ©. For a complete list of class fees and schedules, visit our Web site at www.traintoachieve.org.ng. The following are some of our most popular classes.

Introduction to Social Media Marketing (TTA1504): Taught by marketing consultant Marcus Akpan, the class equips you with the know-how to promote your business online.

Become a Successful Freelance Writer (TTA3283): Business writer Brenda Akande gives you expert guidance on how to hone your writing skills and sell your writing services.

Starting an Internet Radio Station (TTA7629): Online radio host Natalie Kabiru shows you how to appeal to your target market and gives practical tips for setting up your broadcast service.

Basics of Graphic Design (TTA7633): Veteran graphic designer Doug Umaru helps you acquire the basic skills needed to start a graphic design business.

---

Discussion forum for students enrolled in Train to Achieve Class TTA1504
Posted on: 21 May, 9:41 A.M.
Posted by: Joseph Egbe
Subject: Presentations

Viewing the list of students enrolled in this class, I remembered chatting with some of you on the forum for January''s poster design class. I look forward to sharing our learning experiences again for this class. Yesterday I was the second student to meet with Mr. Akpan for an individual videoconference about my business. I own a food truck from which I sell baked goods, and when I shared with Mr. Akpan the outline for my Web site, he suggested that I add a section with vivid images of all my baked goods. It was helpful advice.

---

Egbe''s Bakery-Unique baked-in flavours in every bite!
â€¢ Section 1: Explore our menu and price list
â€¢ Section 2: Browse photos of our delicious treats
â€¢ Section 3: Learn about our catering services
â€¢ Section 4: View lists of ingredients', NULL, NULL, NULL)
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (218, 12, N'Caribbean Flavours Abound
By Rebecca Roats

NOTTINGHAM (1 August)-Orange Bay Kitchen has been serving up an infusion of Jamaican flavours in a laid-back Caribbean atmosphere for six months now. Managed by Keron Deslandes, the 150-seat restaurant is an aromatic jewel amid the bustling shops and eateries in Wester Square. The servers are always happy to help diners select from the variety of delights on the extensive menu, which includes curried goat, oxtail soup, and red snapper. The restaurant is most famous for its jerk chicken. Marinated for 24 hours prior to grilling and served with sides of stewed cabbage and coconut rice, the dish is a good deal at Â£12. If you stop in on any Friday night between 7 and 11 P.M., you will enjoy live reggae music.

---

https://www.dinerreviews.co.uk/orangebaykitchen
Posted on 22 August by Tamika Peterkin, tpeterkin@sunmail.co.uk
Orange Bay Kitchen: 2/5 Stars

After reading a glowing article about Orange Bay Kitchen by Rebecca Roats, I was eager to give this place a try. My husband and I arrived there at 7 P.M. yesterday, keen to enjoy live music with our dinner. Unfortunately, the band''s performance that night had been cancelled. Undeterred, we stayed and both ordered the jerk chicken. While the chicken''s smoky flavour was outstanding, the stewed cabbage was lacking in flavour. Also, the portion size was smaller than we had anticipated, so we ordered another appetiser to avoid going home hungry. The head chef came out to apologise and was extremely nice, but we will probably not go back anytime soon.

---

To: tpeterkin@sunmail.co.uk
From: vsmith@orangebaykitchen.co.uk
Date: 24 August
Subject: Your review
Attachment: 0258

Dear Ms. Peterkin,

Thank you for visiting Orange Bay Kitchen and leaving a review. Our manager, Keron Deslandes, told me more about your visit and our failure to live up to your expectations that evening. Please accept the attached Â£20 gift certificate; I do hope that you will give us another try. During your visit, our band had an equipment malfunction, which is what led to the last-minute cancellation. However, the band will be back performing weekly beginning in September. Also, I want you to know that Head Chef Adio Brown has changed the spices he uses in the stewed cabbage. I am sure you will find them delightful.

Sincerely,
Vea Smith, Owner
Orange Bay Kitchen', NULL, NULL, NULL)
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (219, 12, N'Orbys Distributors
Client: Green Canyon
Date: June 10
Account: 4352-0

<table class="w-full border-collapse border border-gray-300 text-sm">
  <tr>
    <th class="border border-gray-300 p-2">Item</th>
    <th class="border border-gray-300 p-2">Price</th>
  </tr>
  <tr>
    <td class="border border-gray-300 p-2">Garden soil, 33 cubic meters</td>
    <td class="border border-gray-300 p-2">$1,170.00</td>
  </tr>
  <tr>
    <td class="border border-gray-300 p-2">Crushed gravel, 30 metric tons</td>
    <td class="border border-gray-300 p-2">$1,710.00</td>
  </tr>
  <tr>
    <td class="border border-gray-300 p-2">Decorative stone, 20 metric tons</td>
    <td class="border border-gray-300 p-2">$1,140.00</td>
  </tr>
  <tr>
    <td class="border border-gray-300 p-2">70 paving stones, .6 x .6 meters</td>
    <td class="border border-gray-300 p-2">$630.00</td>
  </tr>
  <tr>
    <td class="border border-gray-300 p-2"><strong>Subtotal</strong></td>
    <td class="border border-gray-300 p-2"><strong>$4,650.00</strong></td>
  </tr>
  <tr>
    <td class="border border-gray-300 p-2">Discount (10%)</td>
    <td class="border border-gray-300 p-2">$465.00</td>
  </tr>
  <tr>
    <td class="border border-gray-300 p-2">Delivery charge</td>
    <td class="border border-gray-300 p-2">$350.00</td>
  </tr>
  <tr>
    <td class="border border-gray-300 p-2"><strong>Grand Total</strong></td>
    <td class="border border-gray-300 p-2"><strong>$4,535.00</strong></td>
  </tr>
</table>

Please see the enclosed notice outlining important changes to your billing.

---

Orbys Distributors
To our valued customers:
Our current invoicing system has been in use since Orbys Distributors was founded over twenty years ago. As a much-needed upgrade, we are switching to electronic invoicing. Starting August 1, invoices will be generated automatically each month and will be sent to the e-mail address associated with your company''s account.

Rest assured that our long-standing incentives remain in place:
â€¢ A 10% discount for orders of more than $4,000
â€¢ A 20% discount for charitable organizations
â€¢ Free deliveries to locations within 5 miles of one of our supply centers
â€¢ Free samples for members of our Frequent Buyer Club

More information about our transition to electronic invoicing is available on our Web site. Thank you for your support.
Orbys Distributors appreciates your business.

---

To: Mary Peterson, Billing Department
From: Tanvir Singh, Account Manager
Date: September 12
Subject: Account 1012-4

Hello Mary.
I received a query today from William Tesoriero at Tesoriero Remodeling. His monthly invoice for August never arrived. As you know, Mr. Tesoriero was one of our very first customers. Since we first opened for business, he has made purchases from us on a regular basis. He is also a member of the Frequent Buyer Club. This is a customer we absolutely do not want to lose. I explained to him that the rollout of our electronic invoicing system did not go as smoothly as we had hoped and promised that this would not happen again. I would appreciate it if you could please investigate the problem without delay and send the invoice for August to Mr. Tesoriero.
Tanvir', NULL, NULL, NULL)
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (276, 17, NULL, N'/uploads/audio/PART1-TEST1.mp3', N'/uploads/images/part1_q1.jpg', N'(Nội dung nghe không có trong file đề thi)')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (277, 17, NULL, N'/uploads/audio/PART1-TEST1.mp3', N'/uploads/images/part1_q2.jpg', N'(Nội dung nghe không có trong file đề thi)')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (278, 17, NULL, N'/uploads/audio/PART1-TEST1.mp3', N'/uploads/images/part1_q3.jpg', N'(Nội dung nghe không có trong file đề thi)')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (279, 17, NULL, N'/uploads/audio/PART1-TEST1.mp3', N'/uploads/images/part1_q4.jpg', N'(Nội dung nghe không có trong file đề thi)')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (280, 17, NULL, N'/uploads/audio/PART1-TEST1.mp3', N'/uploads/images/part1_q5.jpg', N'(Nội dung nghe không có trong file đề thi)')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (281, 17, NULL, N'/uploads/audio/PART1-TEST1.mp3', N'/uploads/images/part1_q6.jpg', N'(Nội dung nghe không có trong file đề thi)')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (282, 18, NULL, N'/uploads/audio/PART2-TEST1.mp3', NULL, N'[Chưa có lời thoại trong file PDF]')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (283, 18, NULL, N'/uploads/audio/PART2-TEST1.mp3', NULL, N'[Chưa có lời thoại trong file PDF]')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (284, 18, NULL, N'/uploads/audio/PART2-TEST1.mp3', NULL, N'[Chưa có lời thoại trong file PDF]')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (285, 18, NULL, N'/uploads/audio/PART2-TEST1.mp3', NULL, N'[Chưa có lời thoại trong file PDF]')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (286, 18, NULL, N'/uploads/audio/PART2-TEST1.mp3', NULL, N'[Chưa có lời thoại trong file PDF]')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (287, 18, NULL, N'/uploads/audio/PART2-TEST1.mp3', NULL, N'[Chưa có lời thoại trong file PDF]')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (288, 18, NULL, N'/uploads/audio/PART2-TEST1.mp3', NULL, N'[Chưa có lời thoại trong file PDF]')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (289, 18, NULL, N'/uploads/audio/PART2-TEST1.mp3', NULL, N'[Chưa có lời thoại trong file PDF]')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (290, 18, NULL, N'/uploads/audio/PART2-TEST1.mp3', NULL, N'[Chưa có lời thoại trong file PDF]')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (291, 18, NULL, N'/uploads/audio/PART2-TEST1.mp3', NULL, N'[Chưa có lời thoại trong file PDF]')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (292, 18, NULL, N'/uploads/audio/PART2-TEST1.mp3', NULL, N'[Chưa có lời thoại trong file PDF]')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (293, 18, NULL, N'/uploads/audio/PART2-TEST1.mp3', NULL, N'[Chưa có lời thoại trong file PDF]')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (294, 18, NULL, N'/uploads/audio/PART2-TEST1.mp3', NULL, N'[Chưa có lời thoại trong file PDF]')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (295, 18, NULL, N'/uploads/audio/PART2-TEST1.mp3', NULL, N'[Chưa có lời thoại trong file PDF]')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (296, 18, NULL, N'/uploads/audio/PART2-TEST1.mp3', NULL, N'[Chưa có lời thoại trong file PDF]')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (297, 18, NULL, N'/uploads/audio/PART2-TEST1.mp3', NULL, N'[Chưa có lời thoại trong file PDF]')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (298, 18, NULL, N'/uploads/audio/PART2-TEST1.mp3', NULL, N'[Chưa có lời thoại trong file PDF]')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (299, 18, NULL, N'/uploads/audio/PART2-TEST1.mp3', NULL, N'[Chưa có lời thoại trong file PDF]')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (300, 18, NULL, N'/uploads/audio/PART2-TEST1.mp3', NULL, N'[Chưa có lời thoại trong file PDF]')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (301, 18, NULL, N'/uploads/audio/PART2-TEST1.mp3', NULL, N'[Chưa có lời thoại trong file PDF]')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (302, 18, NULL, N'/uploads/audio/PART2-TEST1.mp3', NULL, N'[Chưa có lời thoại trong file PDF]')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (303, 18, NULL, N'/uploads/audio/PART2-TEST1.mp3', NULL, N'[Chưa có lời thoại trong file PDF]')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (304, 18, NULL, N'/uploads/audio/PART2-TEST1.mp3', NULL, N'[Chưa có lời thoại trong file PDF]')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (305, 18, NULL, N'/uploads/audio/PART2-TEST1.mp3', NULL, N'[Chưa có lời thoại trong file PDF]')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (306, 18, NULL, N'/uploads/audio/PART2-TEST1.mp3', NULL, N'[Chưa có lời thoại trong file PDF]')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (320, 20, NULL, N'/uploads/audio/PART3-TEST1.mp3', NULL, N'')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (321, 20, NULL, N'/uploads/audio/PART3-TEST1.mp3', NULL, N'')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (322, 20, NULL, N'/uploads/audio/PART3-TEST1.mp3', NULL, N'')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (323, 20, NULL, N'/uploads/audio/PART3-TEST1.mp3', NULL, N'')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (324, 20, NULL, N'/uploads/audio/PART3-TEST1.mp3', NULL, N'')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (325, 20, NULL, N'/uploads/audio/PART3-TEST1.mp3', NULL, N'')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (326, 20, NULL, N'/uploads/audio/PART3-TEST1.mp3', NULL, N'')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (327, 20, NULL, N'/uploads/audio/PART3-TEST1.mp3', NULL, N'')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (328, 20, NULL, N'/uploads/audio/PART3-TEST1.mp3', NULL, N'')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (329, 20, NULL, N'/uploads/audio/PART3-TEST1.mp3', NULL, N'')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (330, 20, NULL, N'/uploads/audio/PART3-TEST1.mp3', NULL, N'')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (331, 20, NULL, N'/uploads/audio/PART3-TEST1.mp3', NULL, N'')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (332, 20, NULL, N'/uploads/audio/PART3-TEST1.mp3', NULL, N'')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (340, 4, N'Topic_1_Part5', NULL, NULL, NULL)
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (341, 22, NULL, N'/uploads/audio/PART1-TEST1.mp3', N'/uploads/images/part1_q1.jpg', N'(Nội dung nghe không có trong file đề thi)')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (342, 22, NULL, N'/uploads/audio/PART1-TEST1.mp3', N'/uploads/images/part1_q2.jpg', N'(Nội dung nghe không có trong file đề thi)')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (343, 22, NULL, N'/uploads/audio/PART1-TEST1.mp3', N'/uploads/images/part1_q3.jpg', N'(Nội dung nghe không có trong file đề thi)')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (344, 22, NULL, N'/uploads/audio/PART1-TEST1.mp3', N'/uploads/images/part1_q4.jpg', N'(Nội dung nghe không có trong file đề thi)')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (345, 22, NULL, N'/uploads/audio/PART1-TEST1.mp3', N'/uploads/images/part1_q5.jpg', N'(Nội dung nghe không có trong file đề thi)')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (346, 22, NULL, N'/uploads/audio/PART1-TEST1.mp3', N'/uploads/images/part1_q6.jpg', N'(Nội dung nghe không có trong file đề thi)')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (347, 23, NULL, N'/uploads/audio/PART2-TEST1.mp3', NULL, N'[Chưa có lời thoại trong file PDF]')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (348, 23, NULL, N'/uploads/audio/PART2-TEST1.mp3', NULL, N'[Chưa có lời thoại trong file PDF]')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (349, 23, NULL, N'/uploads/audio/PART2-TEST1.mp3', NULL, N'[Chưa có lời thoại trong file PDF]')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (350, 23, NULL, N'/uploads/audio/PART2-TEST1.mp3', NULL, N'[Chưa có lời thoại trong file PDF]')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (351, 23, NULL, N'/uploads/audio/PART2-TEST1.mp3', NULL, N'[Chưa có lời thoại trong file PDF]')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (352, 23, NULL, N'/uploads/audio/PART2-TEST1.mp3', NULL, N'[Chưa có lời thoại trong file PDF]')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (353, 23, NULL, N'/uploads/audio/PART2-TEST1.mp3', NULL, N'[Chưa có lời thoại trong file PDF]')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (354, 23, NULL, N'/uploads/audio/PART2-TEST1.mp3', NULL, N'[Chưa có lời thoại trong file PDF]')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (355, 23, NULL, N'/uploads/audio/PART2-TEST1.mp3', NULL, N'[Chưa có lời thoại trong file PDF]')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (356, 23, NULL, N'/uploads/audio/PART2-TEST1.mp3', NULL, N'[Chưa có lời thoại trong file PDF]')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (357, 23, NULL, N'/uploads/audio/PART2-TEST1.mp3', NULL, N'[Chưa có lời thoại trong file PDF]')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (358, 23, NULL, N'/uploads/audio/PART2-TEST1.mp3', NULL, N'[Chưa có lời thoại trong file PDF]')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (359, 23, NULL, N'/uploads/audio/PART2-TEST1.mp3', NULL, N'[Chưa có lời thoại trong file PDF]')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (360, 23, NULL, N'/uploads/audio/PART2-TEST1.mp3', NULL, N'[Chưa có lời thoại trong file PDF]')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (361, 23, NULL, N'/uploads/audio/PART2-TEST1.mp3', NULL, N'[Chưa có lời thoại trong file PDF]')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (362, 23, NULL, N'/uploads/audio/PART2-TEST1.mp3', NULL, N'[Chưa có lời thoại trong file PDF]')
GO
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (363, 23, NULL, N'/uploads/audio/PART2-TEST1.mp3', NULL, N'[Chưa có lời thoại trong file PDF]')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (364, 23, NULL, N'/uploads/audio/PART2-TEST1.mp3', NULL, N'[Chưa có lời thoại trong file PDF]')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (365, 23, NULL, N'/uploads/audio/PART2-TEST1.mp3', NULL, N'[Chưa có lời thoại trong file PDF]')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (366, 23, NULL, N'/uploads/audio/PART2-TEST1.mp3', NULL, N'[Chưa có lời thoại trong file PDF]')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (367, 23, NULL, N'/uploads/audio/PART2-TEST1.mp3', NULL, N'[Chưa có lời thoại trong file PDF]')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (368, 23, NULL, N'/uploads/audio/PART2-TEST1.mp3', NULL, N'[Chưa có lời thoại trong file PDF]')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (369, 23, NULL, N'/uploads/audio/PART2-TEST1.mp3', NULL, N'[Chưa có lời thoại trong file PDF]')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (370, 23, NULL, N'/uploads/audio/PART2-TEST1.mp3', NULL, N'[Chưa có lời thoại trong file PDF]')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (371, 23, NULL, N'/uploads/audio/PART2-TEST1.mp3', NULL, N'[Chưa có lời thoại trong file PDF]')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (372, 24, NULL, N'/uploads/audio/PART3-TEST1.mp3', NULL, N'')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (373, 24, NULL, N'/uploads/audio/PART3-TEST1.mp3', NULL, N'')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (374, 24, NULL, N'/uploads/audio/PART3-TEST1.mp3', NULL, N'')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (375, 24, NULL, N'/uploads/audio/PART3-TEST1.mp3', NULL, N'')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (376, 24, NULL, N'/uploads/audio/PART3-TEST1.mp3', NULL, N'')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (377, 24, NULL, N'/uploads/audio/PART3-TEST1.mp3', NULL, N'')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (378, 24, NULL, N'/uploads/audio/PART3-TEST1.mp3', NULL, N'')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (379, 24, NULL, N'/uploads/audio/PART3-TEST1.mp3', NULL, N'')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (380, 24, NULL, N'/uploads/audio/PART3-TEST1.mp3', NULL, N'')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (381, 24, NULL, N'/uploads/audio/PART3-TEST1.mp3', NULL, N'')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (382, 24, NULL, N'/uploads/audio/PART3-TEST1.mp3', NULL, N'')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (383, 24, NULL, N'/uploads/audio/PART3-TEST1.mp3', NULL, N'')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (384, 24, NULL, N'/uploads/audio/PART3-TEST1.mp3', NULL, N'')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (385, 25, N'Incomplete Sentences', NULL, NULL, NULL)
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (386, 26, N'Come to the Maxley Heights Center for Horticulture and learn how to create a beautiful, eco-friendly garden for your home or business. [131]................... We will teach you how to plant a rain garden, which is simply a shallow sunken garden [132].................. a special soil mix to filter pollutants from rainwater flowing from nearby roads and rooftops. These gardens can be landscaped with native plants and flowers. [133].................., rain gardens are always beneficial to the local environment. Among other things, [134].................. improve drainage and protect rivers and streams. To register, visit www.maxley-horticulture.org.', NULL, NULL, NULL)
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (387, 26, N'Dear Mr. Dombo, Thank you for your [135].................. support in helping me to plan the opening gala for Tokyo''s fashion week. The event was a huge success, and I was honored to work with you. I know that our attendees follow your work closely, and they loved the designs you contributed for this event. Your designs received a lot of [136].................. on social media. Shows like this will keep Tokyo on the map as a premier fashion centre. [137]................... I realize that the multiple delays made the planning no easy task. The auction [138].................. our Young Designers Award program is coming up soon and I look forward to working with you on that as well. Sincerely, Asahi Ishioka', NULL, NULL, NULL)
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (388, 26, N'Dear Mr. Hughes, Please be advised that your Mena Chin Library card will expire one month from today. [139].................. must be renewed if you intend to keep your membership for the coming year. This can be done at the information desk at any branch location. [140]................... [141].................. you decide to close your account, no action is necessary. Failure to complete your renewal by the [142].................. date will result in the expiration of your library privileges. If you have any questions about this notice, or about general library services, you may reply directly to this e-mail. Sincerely, Patron Services', NULL, NULL, NULL)
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (389, 26, N'Dear Ms. Burwell, I am Omar Ridha, the manager of Droplight Studio. [143]................... We offer a full range of photography services for real estate professionals like you. We take pride in composing interior and exterior shots that make a property look its best. Droplight Studio spares no effort in [144].................. superior digital images. [145].................., our professional-grade equipment, lighting, and staging techniques allow us to highlight the best features of a property. And once the photo shoot is over, every image [146].................. expert editing. All these services come standard in every package. Please visit our Web site to view our work as well as our pricing and scheduling information. We are happy to work with you to customize orders. Sincerely, Omar Ridha, Droplight Studio', NULL, NULL, NULL)
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (390, 28, N'STOP! PLEASE READ FIRST.
Thank you for purchasing this item. As you do the unpacking, please verify that all components are included and place them in a safe area to avoid loss or damage. Assemble the item on a soft surface or on the flattened empty box. Follow the pictures and begin the assembly by placing the main part on its side. Never overtighten any screws or bolts, or you may damage the wood or cushioning. Please visit our Web site to obtain maintenance tips and register your product for warranty coverage: www.indoordelight.com.', NULL, NULL, NULL)
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (391, 28, N'We are asking all Winnipeg staff to keep a copy of this schedule at their desks as a quick reference tool for scheduling interoffice meetings. Whenever possible, please schedule these meetings during one of the underlined hours, that is, after 7:00 A.M. but before 11:00 A.M. (Winnipeg time).

<table class="w-full border-collapse border border-gray-300 text-sm">
  <tr>
    <th class="border border-gray-300 p-2">Winnipeg</th>
    <th class="border border-gray-300 p-2">Toulouse</th>
  </tr>
  <tr>
    <td class="border border-gray-300 p-2">7:00 A.M.</td>
    <td class="border border-gray-300 p-2">2:00 P.M.</td>
  </tr>
  <tr>
    <td class="border border-gray-300 p-2">8:00 A.M.</td>
    <td class="border border-gray-300 p-2">3:00 P.M.</td>
  </tr>
  <tr>
    <td class="border border-gray-300 p-2">9:00 A.M.</td>
    <td class="border border-gray-300 p-2">4:00 P.M.</td>
  </tr>
  <tr>
    <td class="border border-gray-300 p-2">10:00 A.M.</td>
    <td class="border border-gray-300 p-2">5:00 P.M.</td>
  </tr>
  <tr>
    <td class="border border-gray-300 p-2">11:00 A.M.</td>
    <td class="border border-gray-300 p-2">6:00 P.M.</td>
  </tr>
  <tr>
    <td class="border border-gray-300 p-2">12:00 noon</td>
    <td class="border border-gray-300 p-2">7:00 P.M.</td>
  </tr>
</table>', NULL, NULL, NULL)
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (392, 28, N'The Bryant Foyer is one of the premier event spaces in our area. Set on a hill, it has expansive windows that provide sweeping views of the adjacent botanical gardens and the river. Built in 1897, it was the home of the Francona Charitable Trust until its renovation just over a year ago. Today, the space can accommodate up to 200 guests and is ideal for wedding receptions, office parties, and panel presentations. With its marble floors, cathedral ceiling, and stunning artwork, the Bryant Foyer is the ideal location for your next gathering.

The on-site restaurant, Andito''s, caters our events and also operates as its own business. This farm-to-table restaurant, headed by chef Michaela Rymond, meets all dietary needs and has revolutionized the local food scene. Area residents know to plan far in advance to get a seat.

To reserve the event space or to make a dinner reservation, give us a call at 216-555-0157.', NULL, NULL, NULL)
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (393, 28, N'Joan Chi (12:39 P.M.)
Hello Mina. Are you almost finished with the field measurements? I''m getting hungry.

Mina Evers (12:40 P.M.)
Sorry, Joan. I''m afraid you and Ms. Lim will have to go to lunch without me today. There''s a problem with the site coordinates. This is going to take some time.

Joan Chi (12:51 P.M.)
Oh no. Should we bring something back for you?

Mina Evers (12:59 P.M.)
Get me a chicken sandwich.

Joan Chi (1:00 P.M.)
Sure thing, Mina. See you in a while.', NULL, NULL, NULL)
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (394, 28, N'This season''s excellent weather has yielded a substantial harvest of fruits and vegetables, in many cases more than growers may find buyers for. Those of you wishing to donate surplus produce to community organizations can do so by visiting Vosey Farm and Garden''s Web site (www.vfgrdn.org), where you will find our list of drop-off locations.

If you need us to come to you instead, please contact us. We will reach out to one of the many independent truck drivers who have kindly volunteered to transport and quickly distribute your food donations to vetted groups that need it. Check our Web site for more information about this service as well as for insights into topics related to farming and gardening in the Northern Great Plains region.', NULL, NULL, NULL)
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (395, 28, N'We are delighted that you are joining us for today''s event. [1]. We ask that you adhere to the following guidelines to ensure that all attendees have an enjoyable experience.

Upon entering the venue, please put any and all electronic devices in silent mode. Ringtones and lit screens are very distracting to both the performers and your fellow audience members. [2]. Moreover, audience members are not allowed to make an audio or visual recording of the performance.

Bags and other items in the aisles pose a safety concern. [3]. If your bag is too big to fit properly under a seat, consider storing it in a locker for just $2. - [4]. One of our attendants will gladly assist you with that.

Thank you for your cooperation.', NULL, NULL, NULL)
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (396, 28, N'To: Camille Ayala <ayala@esplinelectronics.com>
From: Masae Adachi <madachi@sweeterspecialties.com>
Date: February 12
Subject: Event order
Attachment: Sweeter Specialties Request Form

Dear Ms. Ayala,

Thank you for selecting our business to provide baked goods for the Esplin Electronics conference event in March. We are honored that you chose us for a fourth year in a row!

On March 29, we will provide a large vanilla cake for each of the ten venues you indicated, and we will deliver a custom-baked multilayer cake on the following day. You will be billed on March 28. Please review the attached order form and return it to me within seven days.

Regarding the cake you ordered for March 30, our head pastry chef will produce it according to your specifications. In fact, he created a sample of the complete recipe earlier today-almond crÃ¨me cake with fresh raspberry filling. We have judged it to be a delectable treat, and we are sure that you will be pleased.

If you have any concerns, just send me an e-mail. As always, we value your business.

Masae Adachi, Owner
Sweeter Specialties', NULL, NULL, NULL)
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (397, 28, N'Great Dishwasher!

I never had a dishwasher before. After remodeling my kitchen, I finally had room for a compact dishwasher. I did a lot of research, and the Dish Magic 300 seemed to be the best choice. It was pricier than other models, but all of the reviews were excellent. So, I decided to spend the extra money. I have had the dishwasher for one month now, and I could not be happier with my decision.

Most importantly, the dishes come out sparkling clean, no matter how dirty they were going in. Also, the machine is so quiet, you do not even know it is running. Lastly, it is designed to use water efficiently, which is very important to me. Overall, I am very pleased with this dishwasher.

- Anna Yakovleva', NULL, NULL, NULL)
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (398, 28, N'Skyler Airlines employs more than 20,000 people from all over the world. We''re growing fast and have many positions available. [1]. So regardless of your background, there''s probably a place for you on our team. Skyler employees enjoy many perks. [2]. For example, our discount program enables them to fly to any of our destinations for a fraction of the average ticket price. [3]. We offer upward and global mobility, tuition reimbursement, a mentorship program, and a generous compensation package.[4] Annual paid vacations enable a comfortable work-life balance. It''s no wonder that Skyler Airlines was named "Best Airline to Work For" by Travel Vista Journal three years in a row.', NULL, NULL, NULL)
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (399, 28, N'Susan Gowan 9:16 A.M.
Good morning. The presentation slides about the new line of headphones are almost ready for distribution to our many partner stores. We are on track to send them out next Monday.

Maggie Lorenz 9:17 A.M.
How do they look?

Susan Gowan 9:20 A.M.
There are still some missing elements.

Alan Woodson 9:21 A.M.
We mainly need the information from the user studies that reviewed the headphones for sport use. We should have that report from the research and development office by Wednesday.

Maggie Lorenz 9:22 A.M.
Yes, let''s not overlook that. And if you''re concerned about the report not arriving by Wednesday, please contact Matt Harven and remind him to expedite a summary to us.

Susan Gowan 9:23 A.M.
Assuming we receive that summary soon enough to incorporate its findings into the slides, should the three of us schedule a trial run through the presentation on Thursday or Friday?

Maggie Lorenz 9:24 A.M.
Let''s try for Thursday afternoon. Then we will still have Friday to make any necessary changes.

Alan Woodson 9:25 A.M.
Fine by me. I''m free after 2 P.M.', NULL, NULL, NULL)
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (400, 28, N'Aparna Kothari, Media Contact
Kitchen Swifts
akothari@kitchenswifts.com.au
FOR IMMEDIATE RELEASE

SYDNEY (4 June)-Kitchen Swifts and Chef Darius Cordero are joining together to give home cooks a new culinary experience. The award-winning chef is the owner of restaurants in both the Philippines and Australia, including the recently opened Enriqua''s. He says his cooking reflects his Filipino heritage, which is a blend of many cultures. "I''ve designed these simplified recipes for Kitchen Swifts so that cooks at home can enjoy new and exciting flavours with ease," he said. "While preparing and eating these meals, you can feel like you are travelling the world with me."

Zahra Chambers, vice president of Kitchen Swifts, says she is pleased to work with Chef Cordero and to offer delicious new recipes to their customers. Kitchen Swifts supplies menus, recipes, and ingredients for two people, four people, or six people, including a range of vegetarian selections. Customers choose the most appropriate meal options, and then a box is delivered weekly. Current customers will see no price increase with the partnership. To find out more, visit the Kitchen Swifts Web site at www.kitchenswifts.com.au.

---

https://www.sydneyrestaurants.com.au
A colleague arranged for us to eat at Enriqua''s while I was at a conference in Sydney. It is usually fully booked for dinner; you may need to call months in advance for a table. We had a wonderful lunch there instead. Everything was delicious, and the bread and desserts are baked on-site! It was a worthwhile treat before I flew back to Hong Kong.

-Meili Guan', NULL, NULL, NULL)
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (401, 28, N'To: laura.savard@orbitmail.scot
From: cboyle@ceoleire.co.uk
Date: 25 May
Subject: RE: Some suggestions

Dear Ms. Savard,

Thank you for your kind offer to either pick up your online order from my shop or to pay extra for air or train transport. Neither arrangement is necessary, as I am happy to deliver your items to you in Stranraer myself. It so happens that my sister and her children live nearby in Kirkcolm. Before seeing them. I will drive my rental car to your house and hand deliver the items to you.

As you know, my merchandise is 100 percent handcrafted. If any damage occurs in transit, the repair turns into an expensive, time-consuming ordeal. Over the years, I''ve seen too much damage done by inattentive baggage handlers. My policy is to deliver items personally whenever feasible or hire a ground- or sea-based courier service I trust.

I look forward to meeting you on 5 June. I expect to arrive at your house no later than 5 p.m.

Sincerely.
Conor Boyle
Ceoleire Classics

---

Northern Ireland Ferry Service
Date of Issuance: 26 May
Passenger Name: Conor Boyle
Departing Belfast: Friday, 5 June, 1:05 PM
Docking at Cairnryan: Friday, 5 June, 3:20 PM
Baggage: 1 suitcase (small), 2 instrument cases (1 mandolin, 1 guitar)
Vehicle transport: No
Adult Standard Class: Â£55.00
Please arrive 30 minutes prior to departure.', NULL, NULL, NULL)
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (402, 28, N'?', NULL, NULL, NULL)
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (403, 28, N'To: laura.savard@orbitmail.scot
From: cboyle@ceoleire.co.uk
Date: 25 May
Subject: RE: Some suggestions

Dear Ms. Savard,

Thank you for your kind offer to either pick up your online order from my shop or to pay extra for air or train transport. Neither arrangement is necessary, as I am happy to deliver your items to you in Stranraer myself. It so happens that my sister and her children live nearby in Kirkcolm. Before seeing them. I will drive my rental car to your house and hand deliver the items to you.

As you know, my merchandise is 100 percent handcrafted. If any damage occurs in transit, the repair turns into an expensive, time-consuming ordeal. Over the years, I''ve seen too much damage done by inattentive baggage handlers. My policy is to deliver items personally whenever feasible or hire a ground- or sea-based courier service I trust.

I look forward to meeting you on 5 June. I expect to arrive at your house no later than 5 p.m.

Sincerely.
Conor Boyle
Ceoleire Classics

---

Northern Ireland Ferry Service
Date of Issuance: 26 May
Passenger Name: Conor Boyle
Departing Belfast: Friday, 5 June, 1:05 PM
Docking at Cairnryan: Friday, 5 June, 3:20 PM
Baggage: 1 suitcase (small), 2 instrument cases (1 mandolin, 1 guitar)
Vehicle transport: No
Adult Standard Class: Â£55.00
Please arrive 30 minutes prior to departure.', NULL, NULL, NULL)
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (404, 28, N'Train to Achieve (TTA)-Our classes prepare you to succeed!

Profiled in the latest Business Directions Nigeria newsletter, Train to Achieve (TTA) is one of the most innovative training providers in West Africa. By offering our classes entirely in online format, we bring the classroom to your home. All classes include individualized instruction and are taught by recognized professionals in their respective fields. Upon successful completion of a class, you will receive an official Certificate of Training, a valuable addition to any rÃ©sumÃ©. For a complete list of class fees and schedules, visit our Web site at www.traintoachieve.org.ng. The following are some of our most popular classes.

Introduction to Social Media Marketing (TTA1504): Taught by marketing consultant Marcus Akpan, the class equips you with the know-how to promote your business online.

Become a Successful Freelance Writer (TTA3283): Business writer Brenda Akande gives you expert guidance on how to hone your writing skills and sell your writing services.

Starting an Internet Radio Station (TTA7629): Online radio host Natalie Kabiru shows you how to appeal to your target market and gives practical tips for setting up your broadcast service.

Basics of Graphic Design (TTA7633): Veteran graphic designer Doug Umaru helps you acquire the basic skills needed to start a graphic design business.

---

Discussion forum for students enrolled in Train to Achieve Class TTA1504
Posted on: 21 May, 9:41 A.M.
Posted by: Joseph Egbe
Subject: Presentations

Viewing the list of students enrolled in this class, I remembered chatting with some of you on the forum for January''s poster design class. I look forward to sharing our learning experiences again for this class. Yesterday I was the second student to meet with Mr. Akpan for an individual videoconference about my business. I own a food truck from which I sell baked goods, and when I shared with Mr. Akpan the outline for my Web site, he suggested that I add a section with vivid images of all my baked goods. It was helpful advice.

---

Egbe''s Bakery-Unique baked-in flavours in every bite!
â€¢ Section 1: Explore our menu and price list
â€¢ Section 2: Browse photos of our delicious treats
â€¢ Section 3: Learn about our catering services
â€¢ Section 4: View lists of ingredients', NULL, NULL, NULL)
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (405, 28, N'Caribbean Flavours Abound
By Rebecca Roats

NOTTINGHAM (1 August)-Orange Bay Kitchen has been serving up an infusion of Jamaican flavours in a laid-back Caribbean atmosphere for six months now. Managed by Keron Deslandes, the 150-seat restaurant is an aromatic jewel amid the bustling shops and eateries in Wester Square. The servers are always happy to help diners select from the variety of delights on the extensive menu, which includes curried goat, oxtail soup, and red snapper. The restaurant is most famous for its jerk chicken. Marinated for 24 hours prior to grilling and served with sides of stewed cabbage and coconut rice, the dish is a good deal at Â£12. If you stop in on any Friday night between 7 and 11 P.M., you will enjoy live reggae music.

---

https://www.dinerreviews.co.uk/orangebaykitchen
Posted on 22 August by Tamika Peterkin, tpeterkin@sunmail.co.uk
Orange Bay Kitchen: 2/5 Stars

After reading a glowing article about Orange Bay Kitchen by Rebecca Roats, I was eager to give this place a try. My husband and I arrived there at 7 P.M. yesterday, keen to enjoy live music with our dinner. Unfortunately, the band''s performance that night had been cancelled. Undeterred, we stayed and both ordered the jerk chicken. While the chicken''s smoky flavour was outstanding, the stewed cabbage was lacking in flavour. Also, the portion size was smaller than we had anticipated, so we ordered another appetiser to avoid going home hungry. The head chef came out to apologise and was extremely nice, but we will probably not go back anytime soon.

---

To: tpeterkin@sunmail.co.uk
From: vsmith@orangebaykitchen.co.uk
Date: 24 August
Subject: Your review
Attachment: 0258

Dear Ms. Peterkin,

Thank you for visiting Orange Bay Kitchen and leaving a review. Our manager, Keron Deslandes, told me more about your visit and our failure to live up to your expectations that evening. Please accept the attached Â£20 gift certificate; I do hope that you will give us another try. During your visit, our band had an equipment malfunction, which is what led to the last-minute cancellation. However, the band will be back performing weekly beginning in September. Also, I want you to know that Head Chef Adio Brown has changed the spices he uses in the stewed cabbage. I am sure you will find them delightful.

Sincerely,
Vea Smith, Owner
Orange Bay Kitchen', NULL, NULL, NULL)
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (406, 28, N'Orbys Distributors
Client: Green Canyon
Date: June 10
Account: 4352-0

<table class="w-full border-collapse border border-gray-300 text-sm">
  <tr>
    <th class="border border-gray-300 p-2">Item</th>
    <th class="border border-gray-300 p-2">Price</th>
  </tr>
  <tr>
    <td class="border border-gray-300 p-2">Garden soil, 33 cubic meters</td>
    <td class="border border-gray-300 p-2">$1,170.00</td>
  </tr>
  <tr>
    <td class="border border-gray-300 p-2">Crushed gravel, 30 metric tons</td>
    <td class="border border-gray-300 p-2">$1,710.00</td>
  </tr>
  <tr>
    <td class="border border-gray-300 p-2">Decorative stone, 20 metric tons</td>
    <td class="border border-gray-300 p-2">$1,140.00</td>
  </tr>
  <tr>
    <td class="border border-gray-300 p-2">70 paving stones, .6 x .6 meters</td>
    <td class="border border-gray-300 p-2">$630.00</td>
  </tr>
  <tr>
    <td class="border border-gray-300 p-2"><strong>Subtotal</strong></td>
    <td class="border border-gray-300 p-2"><strong>$4,650.00</strong></td>
  </tr>
  <tr>
    <td class="border border-gray-300 p-2">Discount (10%)</td>
    <td class="border border-gray-300 p-2">$465.00</td>
  </tr>
  <tr>
    <td class="border border-gray-300 p-2">Delivery charge</td>
    <td class="border border-gray-300 p-2">$350.00</td>
  </tr>
  <tr>
    <td class="border border-gray-300 p-2"><strong>Grand Total</strong></td>
    <td class="border border-gray-300 p-2"><strong>$4,535.00</strong></td>
  </tr>
</table>

Please see the enclosed notice outlining important changes to your billing.

---

Orbys Distributors
To our valued customers:
Our current invoicing system has been in use since Orbys Distributors was founded over twenty years ago. As a much-needed upgrade, we are switching to electronic invoicing. Starting August 1, invoices will be generated automatically each month and will be sent to the e-mail address associated with your company''s account.

Rest assured that our long-standing incentives remain in place:
â€¢ A 10% discount for orders of more than $4,000
â€¢ A 20% discount for charitable organizations
â€¢ Free deliveries to locations within 5 miles of one of our supply centers
â€¢ Free samples for members of our Frequent Buyer Club

More information about our transition to electronic invoicing is available on our Web site. Thank you for your support.
Orbys Distributors appreciates your business.

---

To: Mary Peterson, Billing Department
From: Tanvir Singh, Account Manager
Date: September 12
Subject: Account 1012-4

Hello Mary.
I received a query today from William Tesoriero at Tesoriero Remodeling. His monthly invoice for August never arrived. As you know, Mr. Tesoriero was one of our very first customers. Since we first opened for business, he has made purchases from us on a regular basis. He is also a member of the Frequent Buyer Club. This is a customer we absolutely do not want to lose. I explained to him that the rollout of our electronic invoicing system did not go as smoothly as we had hoped and promised that this would not happen again. I would appreciate it if you could please investigate the problem without delay and send the invoice for August to Mr. Tesoriero.
Tanvir', NULL, NULL, NULL)
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (576, 38, NULL, N'https://toeicmaster-audio.s3.ap-southeast-2.amazonaws.com/part3/auto_import_7f3201ca-4c68-45d9-8fec-7c22b618c2e6.mp3', NULL, N'[W] Good morning, Tech Solutions. How can I help you?
[M] Hello. I’m calling because I ordered a new printer for our office last Tuesday, but it still hasn’t arrived. The tracking number says it’s stuck at the distribution center.
[W] I apologize for the delay, sir. We’ve been experiencing some heavy backlog due to the recent snowstorm. Let me check the status. Yes, it looks like it will be delivered by tomorrow afternoon.
[M] That’s a relief. We have a big client meeting on Friday and need to print some reports.')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (577, 38, NULL, N'https://toeicmaster-audio.s3.ap-southeast-2.amazonaws.com/part3/auto_import_c543262e-da2b-4cb6-9341-e6d7965e54b2.mp3', NULL, N'[M] Sarah, have you booked the venue for the annual marketing conference yet? The early bird discount ends this Friday.
[W] I was about to, but the Grand Hotel is fully booked for those dates. I’m currently looking at the Riverside Convention Center instead.
[M] The Riverside is nice, but it''s a bit far from the airport. Did you check the availability of the shuttle service?
[W] Yes, they offer a complimentary shuttle every hour. I think that should work for our international guests. I''ll go ahead and secure the deposit today.')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (578, 38, NULL, N'https://toeicmaster-audio.s3.ap-southeast-2.amazonaws.com/part3/auto_import_1a9e092f-2117-453c-ae9f-6f33508d28a5.mp3', NULL, N'[W] Excuse me, does this bus go to the City Art Museum? I’m not familiar with this area.
[M] No, this is the number 42 bus going downtown. You need the number 15. It stops right across the street, in front of the bank.
[W] Oh, I see. Do you know how often it runs? I have a ticket for an exhibition entry at 2:00 PM.
[M] It runs every 15 minutes. You should have plenty of time. Just make sure you have exact change for the fare, the driver doesn''t carry cash.')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (579, 38, NULL, N'https://toeicmaster-audio.s3.ap-southeast-2.amazonaws.com/part3/auto_import_b073fa09-ff6f-4786-b532-d7a9dd353533.mp3', NULL, N'[M] Hi, I’d like to check out. I’m in room 305. Here is my key card.
[W] Certainly. Did you have anything from the mini-bar last night?
[M] No, but I did have breakfast in the restaurant this morning. Can you make sure that’s added to the bill? My company needs a single receipt for all expenses.
[W] Absolutely. I see the charge here. The total comes to $250. Would you like to use the credit card we have on file?
[M] Yes, please. And could you also call a taxi for me? I need to go to the train station.')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (580, 38, NULL, N'https://toeicmaster-audio.s3.ap-southeast-2.amazonaws.com/part3/auto_import_fe204bd4-fea2-4453-8f57-6919ab631bfe.mp3', NULL, N'[W] John, the projector in the main conference room is acting up again. The image is very blurry and the colors are off.
[M] Really? I thought maintenance fixed that last week. We have the budget presentation with the CEO in an hour.
[W] I know. I tried restarting it, but it didn''t help. Do we have a spare one in the IT department?
[M] We do, but it''s a portable one, so it’s not as bright. Let me grab it for you quickly. You should probably print out some hard copies of the slides just in case.')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (581, 38, NULL, N'https://toeicmaster-audio.s3.ap-southeast-2.amazonaws.com/part3/auto_import_91f3581c-cc33-436e-941a-ed2c71f1c403.mp3', NULL, N'[M] Hi, I’m calling to schedule an interview with Ms. Rodriguez. We reviewed her application for the graphic designer position and were very impressed.
[W] That’s great news. She is currently in a meeting, but I manage her schedule. When would you like her to come in?
[M] We have openings next Tuesday morning between 9 and 11.
[W] Tuesday at 10 AM works perfectly. Should she bring anything specific?
[M] Yes, please ask her to bring her physical portfolio. We''ve seen the digital version, but we want to see the print quality.')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (582, 38, NULL, N'https://toeicmaster-audio.s3.ap-southeast-2.amazonaws.com/part3/auto_import_67b7e262-35ee-4472-8bd7-7ffefc97b299.mp3', NULL, N'[W] Welcome to Oceanview Dining. Do you have a reservation?
[M] No, we don''t. Do you have a table for four available right now?
[W] We are quite busy tonight. The only table available immediately is outside on the patio.
[M] Oh, I think it''s a bit too windy out there this evening. Is there anything indoors?
[W] If you don''t mind waiting, a booth by the window should open up in about 20 minutes. You can wait at the bar.')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (583, 38, NULL, N'https://toeicmaster-audio.s3.ap-southeast-2.amazonaws.com/part3/auto_import_d4101387-1820-4f7d-80cb-cea9706a9cf1.mp3', NULL, N'[M] Excuse me, I bought this shirt here yesterday for my wife, but she says it''s too small. I''d like to return it.
[W] No problem. Do you have the receipt with you?
[M] Unfortunately, I think I left it in my car. But the tag is still on the shirt.
[W] Without the receipt, I can''t give you a cash refund, but I can offer you store credit or an exchange for a different size.
[M] An exchange is fine. I''ll go look for a medium size.')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (584, 38, NULL, N'https://toeicmaster-audio.s3.ap-southeast-2.amazonaws.com/part3/auto_import_0bd456c6-50a0-4012-b100-50c9261f0ed8.mp3', NULL, N'[W] Hey Mark, are you having trouble logging into the accounting software? My password isn''t working.
[M] Yeah, I got an email from IT this morning. They are performing a mandatory security update. The system will be down until 1 PM.
[W] Oh no, I didn''t check my email. I have to submit the payroll report by noon today!
[M] You should call the IT helpdesk directly. Maybe they can give you temporary access or help you submit the file manually.')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (585, 38, NULL, N'https://toeicmaster-audio.s3.ap-southeast-2.amazonaws.com/part3/auto_import_be12fdb4-693d-449e-bf66-bf775077c162.mp3', NULL, N'[M] Have you seen the layout for the new office space? We are moving next month.
[W] Yes, I saw the blueprints. I''m a bit worried because the desks seem much smaller than what we have now.
[M] That''s true, but they added three more conference rooms and a large break area with a coffee machine.
[W] Well, that is a nice improvement. It''s always so hard to find a quiet place to meet with clients in this building.
[M] Exactly. I think the trade-off will be worth it.')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (586, 38, NULL, N'https://toeicmaster-audio.s3.ap-southeast-2.amazonaws.com/part3/auto_import_ff0939b0-f39a-4a19-83c0-aed60cae8f6a.mp3', NULL, N'[W] Attention passengers, Flight 405 to London has been delayed due to engine maintenance. The new departure time is 8:00 PM.
[M] Excuse me, I have a connecting flight in London. If we leave at 8, I’m going to miss it.
[W] I understand, sir. Let me look at your itinerary. Yes, the connection is tight. I can book you on a direct flight tomorrow morning instead.
[M] That would be better. But where will I stay tonight?
[W] Since the delay is our fault, the airline will provide a voucher for a hotel night and dinner.')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (587, 38, NULL, N'https://toeicmaster-audio.s3.ap-southeast-2.amazonaws.com/part3/auto_import_2fe88228-cb38-4e52-a666-d61f01701842.mp3', NULL, N'[M] Production on line 3 has stopped. What''s going on?
[W] We ran out of the plastic casings for the Model X. The supplier said the truck would be here by 9 AM, but it''s late.
[M] This is serious. We have a shipment scheduled for this afternoon. Have you called the driver?
[W] Yes, he said he''s stuck in traffic but should be here in 30 minutes.
[M] Alright. Let''s have the team take their lunch break now so they can work straight through once the parts arrive.')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (588, 38, NULL, N'https://toeicmaster-audio.s3.ap-southeast-2.amazonaws.com/part3/auto_import_0f1527fb-f1ea-4f90-82f1-b96c59a4bee5.mp3', NULL, N'[W] David, I just picked up the brochures from the printer, but the colors look wrong. The blue is too dark.
[M] Let me see. Oh, you''re right. This doesn''t match our company logo at all. We can''t hand these out at the trade show.
[W] The trade show is on Saturday. Do we have time to reprint them?
[M] I''ll call the print shop immediately. Since it was their error, they should prioritize our order. I''ll ask them to rush it for Friday delivery.')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (589, 39, NULL, N'https://toeicmaster-audio.s3.ap-southeast-2.amazonaws.com/part3/auto_import_942dbe28-02ec-4a5b-83bd-a522ab674770.mp3', N'/uploads/images/de97050e-059d-4c40-b578-b0b11c0aca38.png', N'She is typing on a computer keyboard')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (590, 39, NULL, N'https://toeicmaster-audio.s3.ap-southeast-2.amazonaws.com/part3/auto_import_7a17eff6-b1ad-4195-9ac8-06dc9515eeee.mp3', NULL, N'A waiter is setting the table for dinner')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (591, 39, NULL, N'https://toeicmaster-audio.s3.ap-southeast-2.amazonaws.com/part3/auto_import_213e4eca-85d8-4d1c-bca9-99acbab1f3e2.mp3', NULL, N'They are paving a driveway')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (592, 39, NULL, N'https://toeicmaster-audio.s3.ap-southeast-2.amazonaws.com/part3/auto_import_21f21f61-ceb5-4f93-9abb-0e28ebf60271.mp3', NULL, N'She is trying on a pair of shoes')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (593, 39, NULL, N'https://toeicmaster-audio.s3.ap-southeast-2.amazonaws.com/part3/auto_import_e476d76d-d55e-4f37-96b5-dd1f7471d2d6.mp3', NULL, N'A chart is being displayed on a screen')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (594, 39, NULL, N'https://toeicmaster-audio.s3.ap-southeast-2.amazonaws.com/part3/auto_import_411b9ef5-eba6-4da5-a622-1dd968ad8f38.mp3', NULL, N'Benches are stacked in a pile')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (595, 39, NULL, N'https://toeicmaster-audio.s3.ap-southeast-2.amazonaws.com/part3/auto_import_d30b6636-584a-44a2-9902-2a8e63ea7cca.mp3', NULL, N'Passengers are boarding the aircraft')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (596, 39, NULL, N'https://toeicmaster-audio.s3.ap-southeast-2.amazonaws.com/part3/auto_import_54d94c10-2c6c-45ba-8d2e-ad935f0f87dd.mp3', NULL, N'Books are scattered on the floor')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (597, 39, NULL, N'https://toeicmaster-audio.s3.ap-southeast-2.amazonaws.com/part3/auto_import_02a8b205-3e49-4f27-a41c-0bff0183beb1.mp3', NULL, N'He is driving a forklift truck')
INSERT [dbo].[QuestionGroups] ([Id], [PartId], [TextContent], [AudioUrl], [ImageUrl], [Transcript]) VALUES (598, 39, NULL, N'https://toeicmaster-audio.s3.ap-southeast-2.amazonaws.com/part3/auto_import_0afbead1-2c47-4bd2-9f51-aaea1c22e299.mp3', NULL, N'They are running on treadmills')
SET IDENTITY_INSERT [dbo].[QuestionGroups] OFF
GO
SET IDENTITY_INSERT [dbo].[Questions] ON 

INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (71, 45, 101, N'Former Sendai Company CEO Ken Nakata spoke about ------- career experiences.', N'MCQ', N'B', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (72, 45, 102, N'Passengers who will be taking a ------- domestic flight should go to Terminal A.', N'MCQ', N'D', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (73, 45, 103, N'Fresh and ------- apple-cider donuts are available at Oakcrest Orchard''s retail shop for £6 per dozen.', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (74, 45, 104, N'Zahn Flooring has the widest selection of ------- in the United Kingdom.', N'MCQ', N'B', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (75, 45, 105, N'One responsibility of the IT department is to ensure that the company is using ------- software.', N'MCQ', N'D', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (76, 45, 106, N'It is wise to check a company''s dress code ------- visiting its head office.', N'MCQ', N'D', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (77, 45, 107, N'Wexler Store''s management team expects that employees will ------- support any new hires.', N'MCQ', N'A', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (78, 45, 108, N'Wheel alignments and brake system ------- are part of our vehicle service plan.', N'MCQ', N'D', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (79, 45, 109, N'Registration for the Marketing Coalition Conference is now open ------- September 30.', N'MCQ', N'A', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (80, 45, 110, N'Growth in the home entertainment industry has been ------- this quarter.', N'MCQ', N'B', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (81, 45, 111, N'Hawson Furniture will be making ------- on the east side of town on Thursday.', N'MCQ', N'A', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (82, 45, 112, N'The Marlton City Council does not have the authority to ------- parking on city streets.', N'MCQ', N'B', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (83, 45, 113, N'Project Earth Group is ------- for ways to reduce transport-related greenhouse gas emissions.', N'MCQ', N'A', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (84, 45, 114, N'Our skilled tailors are happy to design a custom-made suit that fits your style and budget -------.', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (85, 45, 115, N'Project manager Hannah Chung has proved to be very ------- with completing company projects.', N'MCQ', N'D', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (86, 45, 116, N'Lehua Vacation Club members will receive double points ------- the month of August at participating hotels.', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (87, 45, 117, N'The costumes were not received ------- enough to be used in the first dress rehearsal.', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (88, 45, 118, N'As a former publicist for several renowned orchestras, Mr. Wu would excel in the role of event -------.', N'MCQ', N'B', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (89, 45, 119, N'The northbound lane on Davis Street will be ------- closed because of the city''s bridge reinforcement project.', N'MCQ', N'A', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (90, 45, 120, N'Airline representatives must handle a wide range of passenger issues, ------- missed connections to lost luggage.', N'MCQ', N'A', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (91, 45, 121, N'The meeting notes were ------- deleted, but Mr. Hahm was able to recreate them from memory.', N'MCQ', N'D', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (92, 45, 122, N'The current issue of Farming Scene magazine predicts that the price of corn will rise 5 percent over the ------- year.', N'MCQ', N'A', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (93, 45, 123, N'Anyone who still ------- to take the fire safety training should do so before the end of the month.', N'MCQ', N'B', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (94, 45, 124, N'Emerging technologies have ------- begun to transform the shipping industry in ways that were once unimaginable.', N'MCQ', N'A', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (95, 45, 125, N'The company handbook outlines the high ------- that employees are expected to meet every day.', N'MCQ', N'D', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (96, 45, 126, N'Because ------- of the board members have scheduling conflicts, the board meeting will be moved to a date when all can attend.', N'MCQ', N'D', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (97, 45, 127, N'The project ------- the collaboration of several teams across the company.', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (98, 45, 128, N'We cannot send the store''s coupon booklet to the printers until it ------- by Ms. Jeon.', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (99, 45, 129, N'------- the closure of Verdigold Transport Services, we are looking for a new shipping company.', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (100, 45, 130, N'The ------- information provided by Uniss Bank''s brochure helps applicants understand the terms of their loans.', N'MCQ', N'B', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (101, 46, 131, N'Question 131', NULL, N'D', CAST(5.00 AS Decimal(5, 2)), N'Lỗi: TooManyRequests', N'Chi tiết: {
  "error": {
    "code": 429,
    "message": "You exceeded your current quota, please check your plan and billing details. For more information on this error, head to: https://ai.google.dev/gemini-api/docs/rate-limits. To monitor your current usage, head to: https://ai.dev/usage?tab=rate-limit. \n* Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_input_token_count, limit: 0, model: gemini-2.0-flash\n* Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_requests, limit: 0, model: gemini-2.0-flash\n* Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_requests, limit: 0, model: gemini-2.0-flash\nPlease retry in 52.095097643s.",
    "status": "RESOURCE_EXHAUSTED",
    "details": [
      {
        "@type": "type.googleapis.com/google.rpc.Help",
        "links": [
          {
            "description": "Learn more about Gemini API quotas",
            "url": "https://ai.google.dev/gemini-api/docs/rate-limits"
          }
        ]
      },
      {
        "@type": "type.googleapis.com/google.rpc.QuotaFailure",
        "violations": [
          {
            "quotaMetric": "generativelanguage.googleapis.com/generate_content_free_tier_input_token_count",
            "quotaId": "GenerateContentInputTokensPerModelPerMinute-FreeTier",
            "quotaDimensions": {
              "model": "gemini-2.0-flash",
              "location": "global"
            }
          },
          {
            "quotaMetric": "generativelanguage.googleapis.com/generate_content_free_tier_requests",
            "quotaId": "GenerateRequestsPerMinutePerProjectPerModel-FreeTier",
            "quotaDimensions": {
              "model": "gemini-2.0-flash",
              "location": "global"
            }
          },
          {
            "quotaMetric": "generativelanguage.googleapis.com/generate_content_free_tier_requests",
            "quotaId": "GenerateRequestsPerDayPerProjectPerModel-FreeTier",
            "quotaDimensions": {
              "model": "gemini-2.0-flash",
              "location": "global"
            }
          }
        ]
      },
      {
        "@type": "type.googleapis.com/google.rpc.RetryInfo",
        "retryDelay": "52s"
      }
    ]
  }
}
', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (102, 46, 132, N'Question 132', NULL, N'D', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (103, 46, 133, N'Question 133', NULL, N'A', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (104, 46, 134, N'Question 134', NULL, N'B', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (105, 47, 135, N'Question 135', NULL, N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (106, 47, 136, N'Question 136', NULL, N'A', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (107, 47, 137, N'Question 137', NULL, N'B', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (108, 47, 138, N'Question 138', NULL, N'B', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (109, 48, 139, N'Question 139', NULL, N'A', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (110, 48, 140, N'Question 140', NULL, N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (111, 48, 141, N'Question 141', NULL, N'B', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (112, 48, 142, N'Question 142', NULL, N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (113, 49, 143, N'Question 143', NULL, N'A', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (114, 49, 144, N'Question 144', NULL, N'B', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (115, 49, 145, N'Question 145', NULL, N'D', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (116, 49, 146, N'Question 146', NULL, N'A', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (330, 159, 71, N'Who has recorded the message?', N'MCQ', N'D', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (331, 159, 72, N'What are the listeners asked to do?', N'MCQ', N'A', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (332, 159, 73, N'What does the speaker say was mailed last week?', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (333, 160, 74, N'What is the topic of the episode?', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (334, 160, 75, N'What does the speaker emphasize about some tools?', N'MCQ', N'B', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (335, 160, 76, N'What does the speaker recommend doing every year?', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (336, 161, 77, N'Who most likely is the speaker?', N'MCQ', N'B', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (337, 161, 78, N'What will happen at two o''clock?', N'MCQ', N'A', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (338, 161, 79, N'What is Orchid Caretakers?', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (339, 162, 80, N'What event is taking place?', N'MCQ', N'A', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (340, 162, 81, N'What does the organization plan to do?', N'MCQ', N'B', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (341, 162, 82, N'What does the speaker encourage the listeners to do?', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (342, 163, 83, N'What is the topic of the workshop?', N'MCQ', N'A', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (343, 163, 84, N'What does the speaker imply when he says, "Erina''s at the back of the room"?', N'MCQ', N'B', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (344, 163, 85, N'What will the listeners do next?', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (345, 164, 86, N'What is a historical site famous for?', N'MCQ', N'D', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (346, 164, 87, N'Why does the speaker apologize?', N'MCQ', N'A', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (347, 164, 88, N'What does the speaker ask the listeners to do?', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (348, 165, 89, N'What is the speaker mainly discussing?', N'MCQ', N'A', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (349, 165, 90, N'What does the speaker imply when he says, "this is a priority"?', N'MCQ', N'B', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (350, 165, 91, N'What will the listeners do next?', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (351, 166, 92, N'Where do the listeners most likely work?', N'MCQ', N'A', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (352, 166, 93, N'What is the main purpose of the talk?', N'MCQ', N'B', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (353, 166, 94, N'What does the speaker imply when she says, "That will require management approval"?', N'MCQ', N'D', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (354, 167, 95, N'According to the speaker  what was recently completed?', N'MCQ', N'B', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (355, 167, 96, N'Look at the graphic. Where does the speaker say refreshments will be served?', N'MCQ', N'A', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (356, 167, 97, N'What are the listeners reminded to do?', N'MCQ', N'D', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (357, 168, 98, N'What is the topic of today''s lecture?', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (358, 168, 99, N'Look at the graphic. At what depth should samples be collected this month?', N'MCQ', N'A', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (359, 168, 100, N'What does the speaker encourage the listeners to do?', N'MCQ', N'D', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (468, 203, 147, N'Where is the information most likely found?', NULL, N'C', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (469, 203, 148, N'What kind of item is most likely discussed?', NULL, N'B', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (470, 204, 149, N'What is suggested by the schedule?', NULL, N'B', CAST(5.00 AS Decimal(5, 2)), N'Lỗi: TooManyRequests', N'Chi tiết: {
  "error": {
    "code": 429,
    "message": "You exceeded your current quota, please check your plan and billing details. For more information on this error, head to: https://ai.google.dev/gemini-api/docs/rate-limits. To monitor your current usage, head to: https://ai.dev/usage?tab=rate-limit. \n* Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_requests, limit: 0, model: gemini-2.0-flash\n* Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_requests, limit: 0, model: gemini-2.0-flash\n* Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_input_token_count, limit: 0, model: gemini-2.0-flash\nPlease retry in 47.63740746s.",
    "status": "RESOURCE_EXHAUSTED",
    "details": [
      {
        "@type": "type.googleapis.com/google.rpc.Help",
        "links": [
          {
            "description": "Learn more about Gemini API quotas",
            "url": "https://ai.google.dev/gemini-api/docs/rate-limits"
          }
        ]
      },
      {
        "@type": "type.googleapis.com/google.rpc.QuotaFailure",
        "violations": [
          {
            "quotaMetric": "generativelanguage.googleapis.com/generate_content_free_tier_requests",
            "quotaId": "GenerateRequestsPerDayPerProjectPerModel-FreeTier",
            "quotaDimensions": {
              "model": "gemini-2.0-flash",
              "location": "global"
            }
          },
          {
            "quotaMetric": "generativelanguage.googleapis.com/generate_content_free_tier_requests",
            "quotaId": "GenerateRequestsPerMinutePerProjectPerModel-FreeTier",
            "quotaDimensions": {
              "location": "global",
              "model": "gemini-2.0-flash"
            }
          },
          {
            "quotaMetric": "generativelanguage.googleapis.com/generate_content_free_tier_input_token_count",
            "quotaId": "GenerateContentInputTokensPerModelPerMinute-FreeTier",
            "quotaDimensions": {
              "location": "global",
              "model": "gemini-2.0-flash"
            }
          }
        ]
      },
      {
        "@type": "type.googleapis.com/google.rpc.RetryInfo",
        "retryDelay": "47s"
      }
    ]
  }
}
', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (471, 204, 150, N'What is indicated about 11:00 A.M. Winnipeg time?', NULL, N'C', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (472, 205, 151, N'What is indicated about the Bryant Foyer?', NULL, N'B', CAST(5.00 AS Decimal(5, 2)), N'Lỗi: TooManyRequests', N'Chi tiết: {
  "error": {
    "code": 429,
    "message": "You exceeded your current quota, please check your plan and billing details. For more information on this error, head to: https://ai.google.dev/gemini-api/docs/rate-limits. To monitor your current usage, head to: https://ai.dev/usage?tab=rate-limit. \n* Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_requests, limit: 0, model: gemini-2.0-flash\n* Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_requests, limit: 0, model: gemini-2.0-flash\n* Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_input_token_count, limit: 0, model: gemini-2.0-flash\nPlease retry in 40.012802531s.",
    "status": "RESOURCE_EXHAUSTED",
    "details": [
      {
        "@type": "type.googleapis.com/google.rpc.Help",
        "links": [
          {
            "description": "Learn more about Gemini API quotas",
            "url": "https://ai.google.dev/gemini-api/docs/rate-limits"
          }
        ]
      },
      {
        "@type": "type.googleapis.com/google.rpc.QuotaFailure",
        "violations": [
          {
            "quotaMetric": "generativelanguage.googleapis.com/generate_content_free_tier_requests",
            "quotaId": "GenerateRequestsPerDayPerProjectPerModel-FreeTier",
            "quotaDimensions": {
              "model": "gemini-2.0-flash",
              "location": "global"
            }
          },
          {
            "quotaMetric": "generativelanguage.googleapis.com/generate_content_free_tier_requests",
            "quotaId": "GenerateRequestsPerMinutePerProjectPerModel-FreeTier",
            "quotaDimensions": {
              "location": "global",
              "model": "gemini-2.0-flash"
            }
          },
          {
            "quotaMetric": "generativelanguage.googleapis.com/generate_content_free_tier_input_token_count",
            "quotaId": "GenerateContentInputTokensPerModelPerMinute-FreeTier",
            "quotaDimensions": {
              "location": "global",
              "model": "gemini-2.0-flash"
            }
          }
        ]
      },
      {
        "@type": "type.googleapis.com/google.rpc.RetryInfo",
        "retryDelay": "40s"
      }
    ]
  }
}
', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (473, 205, 152, N'What is suggested about Andito''s?', NULL, N'D', CAST(5.00 AS Decimal(5, 2)), N'Lỗi: TooManyRequests', N'Chi tiết: {
  "error": {
    "code": 429,
    "message": "You exceeded your current quota, please check your plan and billing details. For more information on this error, head to: https://ai.google.dev/gemini-api/docs/rate-limits. To monitor your current usage, head to: https://ai.dev/usage?tab=rate-limit. \n* Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_input_token_count, limit: 0, model: gemini-2.0-flash\n* Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_requests, limit: 0, model: gemini-2.0-flash\n* Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_requests, limit: 0, model: gemini-2.0-flash\nPlease retry in 35.447099438s.",
    "status": "RESOURCE_EXHAUSTED",
    "details": [
      {
        "@type": "type.googleapis.com/google.rpc.Help",
        "links": [
          {
            "description": "Learn more about Gemini API quotas",
            "url": "https://ai.google.dev/gemini-api/docs/rate-limits"
          }
        ]
      },
      {
        "@type": "type.googleapis.com/google.rpc.QuotaFailure",
        "violations": [
          {
            "quotaMetric": "generativelanguage.googleapis.com/generate_content_free_tier_input_token_count",
            "quotaId": "GenerateContentInputTokensPerModelPerMinute-FreeTier",
            "quotaDimensions": {
              "location": "global",
              "model": "gemini-2.0-flash"
            }
          },
          {
            "quotaMetric": "generativelanguage.googleapis.com/generate_content_free_tier_requests",
            "quotaId": "GenerateRequestsPerMinutePerProjectPerModel-FreeTier",
            "quotaDimensions": {
              "location": "global",
              "model": "gemini-2.0-flash"
            }
          },
          {
            "quotaMetric": "generativelanguage.googleapis.com/generate_content_free_tier_requests",
            "quotaId": "GenerateRequestsPerDayPerProjectPerModel-FreeTier",
            "quotaDimensions": {
              "location": "global",
              "model": "gemini-2.0-flash"
            }
          }
        ]
      },
      {
        "@type": "type.googleapis.com/google.rpc.RetryInfo",
        "retryDelay": "35s"
      }
    ]
  }
}
', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (474, 206, 153, N'At 1:00 P.M., what does Ms. Chi most likely mean when she writes, "Sure thing, Mina"?', NULL, N'A', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (475, 206, 154, N'What will happen next?', NULL, N'B', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (476, 207, 155, N'For whom is the notice most likely intended?', NULL, N'A', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (477, 207, 156, N'What does the notice indicate about the weather?', NULL, N'D', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (478, 207, 157, N'What service does the notice mention?', NULL, N'B', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (479, 208, 158, N'Where most likely is the notice posted?', NULL, N'B', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (480, 208, 159, N'What is stated about large bags?', NULL, N'A', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (481, 208, 160, N'In which of the positions marked [1], [2], [3], and [4] does the following sentence best belong?
"Please refrain from making phone calls or texting at all times."', NULL, N'B', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (482, 209, 161, N'What is the main purpose of the e-mail?', NULL, N'A', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (483, 209, 162, N'What is suggested about Ms. Ayala?', NULL, N'C', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (484, 209, 163, N'What is indicated about the multilayer cake?', NULL, N'D', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (485, 209, 164, N'The word "judged" in paragraph 2, line 3, is closest in meaning to', NULL, N'C', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (486, 210, 165, N'Why did Ms. Yakovleva choose the Dish Magic 300 dishwasher?', NULL, N'C', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (487, 210, 166, N'The word "running" in paragraph 1, line 7, is closest in meaning to', NULL, N'D', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (488, 210, 167, N'What is indicated about Ms. Yakovleva?', NULL, N'A', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (489, 211, 168, N'For whom is the information intended?', NULL, N'D', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (490, 211, 169, N'In the information', NULL, N'PAID DAYS OFF', CAST(5.00 AS Decimal(5, 2)), NULL, N'B', NULL, NULL, NULL)
GO
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (491, 211, 170, N'What is mentioned about Skyler Airlines?', NULL, N'C', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (492, 211, 171, N'In which of the positions marked [1], [2], [3], and [4] does the following sentence best belong?
"Our openings cover a broad range of skill sets."', NULL, N'A', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (493, 212, 172, N'What is indicated about a presentation?', NULL, N'D', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (494, 212, 173, N'At 9:22 A.M., what does Ms. Lorenz imply when she writes, "let''s not overlook that"?', NULL, N'B', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (495, 212, 174, N'Who most likely is Mr. Harven?', NULL, N'C', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (496, 212, 175, N'When do the writers plan to meet to review a slide presentation?', NULL, N'C', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (497, 213, 176, N'What is the purpose of the press release?', NULL, N'B', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (498, 213, 177, N'In the press release, the word "reflects" in paragraph 1, line 4, is closest in meaning to', NULL, N'C', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (499, 213, 178, N'What is indicated about Kitchen Swifts?', NULL, N'C', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (500, 213, 179, N'What is most likely true about Ms. Guan?', NULL, N'A', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (501, 213, 180, N'What did Ms. Guan suggest about Enriqua''s in the review?', NULL, N'B', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (502, 214, 181, N'What is the purpose of the e-mail?', NULL, N'A', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (503, 214, 182, N'Why will Mr. Boyle travel from Stranraer to Kirkcolm?', NULL, N'D', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (504, 214, 183, N'What is indicated in the e-mail?', NULL, N'B', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (505, 215, 184, N'What is most likely true about Ms. Savard?', NULL, N'C', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (506, 216, 185, N'How is Mr. Boyle traveling to Cairnryan on June 5?', NULL, N'C', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (507, 217, 186, N'What is indicated about TTA?', NULL, N'C', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (508, 217, 187, N'According to the advertisement', NULL, N'A CERTIFICATION DOCUMENT', CAST(5.00 AS Decimal(5, 2)), NULL, N'D', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (509, 217, 188, N'What is most likely true about Mr. Egbe?', NULL, N'B', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (510, 217, 189, N'What TTA class is Mr. Egbe enrolled in?', NULL, N'A', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (511, 217, 190, N'What section did Mr. Egbe most likely add to the outline after speaking with Mr. Akpan?', NULL, N'B', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (512, 218, 191, N'What does the article mention about Orange Bay Kitchen?', NULL, N'D', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (513, 218, 192, N'According to the article', NULL, N'CURRIED GOAT', CAST(5.00 AS Decimal(5, 2)), NULL, N'C', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (514, 218, 193, N'What is suggested about Ms. Peterkin''s visit to Orange Bay Kitchen?', NULL, N'A', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (515, 218, 194, N'What is a purpose of the e-mail?', NULL, N'B', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (516, 218, 195, N'Whom did Ms. Peterkin meet at Orange Bay Kitchen?', NULL, N'C', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (517, 219, 196, N'What does the invoice suggest about Green Canyon?', NULL, N'A', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (518, 219, 197, N'Why most likely did Green Canyon receive a discount on its order dated June 10?', NULL, N'IT IS LOCATED NEAR AN ORBYS DISTRIBUTORS SUPPLY CENTER.', CAST(5.00 AS Decimal(5, 2)), NULL, N'C', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (519, 219, 198, N'According to the notice', NULL, N'ITS DELIVERY SCHEDULE', CAST(5.00 AS Decimal(5, 2)), NULL, N'C', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (520, 219, 199, N'What is suggested about Mr. Tesoriero?', NULL, N'D', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (521, 219, 200, N'What does Mr. Singh ask Ms. Peterson to do?', NULL, N'B', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (604, 276, 1, N'Look at the picture and listen to the statements. Choose the statement that best describes the picture.', N'MCQ', N'A', CAST(5.00 AS Decimal(5, 2)), N'Lỗi: TooManyRequests', N'Chi tiết: {
  "error": {
    "code": 429,
    "message": "You exceeded your current quota, please check your plan and billing details. For more information on this error, head to: https://ai.google.dev/gemini-api/docs/rate-limits. To monitor your current usage, head to: https://ai.dev/usage?tab=rate-limit. \n* Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_input_token_count, limit: 0, model: gemini-2.0-flash\n* Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_requests, limit: 0, model: gemini-2.0-flash\n* Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_requests, limit: 0, model: gemini-2.0-flash\nPlease retry in 29.033800603s.",
    "status": "RESOURCE_EXHAUSTED",
    "details": [
      {
        "@type": "type.googleapis.com/google.rpc.Help",
        "links": [
          {
            "description": "Learn more about Gemini API quotas",
            "url": "https://ai.google.dev/gemini-api/docs/rate-limits"
          }
        ]
      },
      {
        "@type": "type.googleapis.com/google.rpc.QuotaFailure",
        "violations": [
          {
            "quotaMetric": "generativelanguage.googleapis.com/generate_content_free_tier_input_token_count",
            "quotaId": "GenerateContentInputTokensPerModelPerMinute-FreeTier",
            "quotaDimensions": {
              "location": "global",
              "model": "gemini-2.0-flash"
            }
          },
          {
            "quotaMetric": "generativelanguage.googleapis.com/generate_content_free_tier_requests",
            "quotaId": "GenerateRequestsPerMinutePerProjectPerModel-FreeTier",
            "quotaDimensions": {
              "model": "gemini-2.0-flash",
              "location": "global"
            }
          },
          {
            "quotaMetric": "generativelanguage.googleapis.com/generate_content_free_tier_requests",
            "quotaId": "GenerateRequestsPerDayPerProjectPerModel-FreeTier",
            "quotaDimensions": {
              "location": "global",
              "model": "gemini-2.0-flash"
            }
          }
        ]
      },
      {
        "@type": "type.googleapis.com/google.rpc.RetryInfo",
        "retryDelay": "29s"
      }
    ]
  }
}
', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (605, 277, 2, N'Look at the picture and listen to the statements. Choose the statement that best describes the picture.', N'MCQ', N'B', CAST(5.00 AS Decimal(5, 2)), N'Lỗi: TooManyRequests', N'Chi tiết: {
  "error": {
    "code": 429,
    "message": "You exceeded your current quota, please check your plan and billing details. For more information on this error, head to: https://ai.google.dev/gemini-api/docs/rate-limits. To monitor your current usage, head to: https://ai.dev/usage?tab=rate-limit. \n* Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_input_token_count, limit: 0, model: gemini-2.0-flash\n* Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_requests, limit: 0, model: gemini-2.0-flash\n* Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_requests, limit: 0, model: gemini-2.0-flash\nPlease retry in 49.19974928s.",
    "status": "RESOURCE_EXHAUSTED",
    "details": [
      {
        "@type": "type.googleapis.com/google.rpc.Help",
        "links": [
          {
            "description": "Learn more about Gemini API quotas",
            "url": "https://ai.google.dev/gemini-api/docs/rate-limits"
          }
        ]
      },
      {
        "@type": "type.googleapis.com/google.rpc.QuotaFailure",
        "violations": [
          {
            "quotaMetric": "generativelanguage.googleapis.com/generate_content_free_tier_input_token_count",
            "quotaId": "GenerateContentInputTokensPerModelPerMinute-FreeTier",
            "quotaDimensions": {
              "model": "gemini-2.0-flash",
              "location": "global"
            }
          },
          {
            "quotaMetric": "generativelanguage.googleapis.com/generate_content_free_tier_requests",
            "quotaId": "GenerateRequestsPerMinutePerProjectPerModel-FreeTier",
            "quotaDimensions": {
              "location": "global",
              "model": "gemini-2.0-flash"
            }
          },
          {
            "quotaMetric": "generativelanguage.googleapis.com/generate_content_free_tier_requests",
            "quotaId": "GenerateRequestsPerDayPerProjectPerModel-FreeTier",
            "quotaDimensions": {
              "model": "gemini-2.0-flash",
              "location": "global"
            }
          }
        ]
      },
      {
        "@type": "type.googleapis.com/google.rpc.RetryInfo",
        "retryDelay": "49s"
      }
    ]
  }
}
', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (606, 278, 3, N'Look at the picture and listen to the statements. Choose the statement that best describes the picture.', N'MCQ', N'B', CAST(5.00 AS Decimal(5, 2)), N'Đáp án B mô tả chính xác nhất hành động hoặc trạng thái quan sát được trực tiếp trong ảnh.', N'<b>Phân tích bài thi TOEIC Part 1:</b><br><br>Trong phần thi mô tả tranh, đáp án chính xác phải là câu mô tả khách quan và đúng thực tế nhất những gì xuất hiện trong hình.<br><br>1. <b>Tại sao đáp án B đúng:</b><br>Thông thường, đáp án B được chọn vì nó khớp hoàn toàn về cả <b>chủ ngữ</b> (người hoặc vật có trong tranh) và <b>vị trí/hành động</b> (động từ mô tả đúng trạng thái). Nó không mang tính suy diễn mà chỉ tập trung vào những gì mắt thấy tai nghe.<br><br>2. <b>Tại sao các đáp án còn lại sai:</b><br>- <b>Sai về danh từ:</b> Nhắc đến những vật dụng hoặc người không hề xuất hiện trong bức tranh.<br>- <b>Sai về động từ:</b> Mô tả sai hành động đang diễn ra (ví dụ: tranh vẽ người đang ''đứng'' nhưng đáp án lại nói là ''ngồi'').<br>- <b>Sai về vị trí (Giới từ):</b> Nhắc đúng vật nhưng đặt sai vị trí tương đối giữa các vật (ví dụ: ''ở trên bàn'' trong khi vật thực tế ''ở dưới sàn'').<br>- <b>Lỗi suy diễn:</b> Đưa ra các phán đoán về cảm xúc hoặc tình huống không rõ ràng (ví dụ: ''Họ đang đi làm'' - chúng ta không biết họ đi đâu, chỉ thấy họ đang ''đi bộ'').<br><br><i><b>Mẹo của giáo viên:</b> Hãy sử dụng phương pháp loại trừ, chỉ cần nghe thấy một từ sai trong câu là có thể bỏ qua phương án đó ngay lập tức.</i>', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (607, 279, 4, N'Look at the picture and listen to the statements. Choose the statement that best describes the picture.', N'MCQ', N'D', CAST(5.00 AS Decimal(5, 2)), N'Lỗi: TooManyRequests', N'Chi tiết: {
  "error": {
    "code": 429,
    "message": "You exceeded your current quota, please check your plan and billing details. For more information on this error, head to: https://ai.google.dev/gemini-api/docs/rate-limits. To monitor your current usage, head to: https://ai.dev/usage?tab=rate-limit. \n* Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_requests, limit: 0, model: gemini-2.0-flash\n* Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_requests, limit: 0, model: gemini-2.0-flash\n* Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_input_token_count, limit: 0, model: gemini-2.0-flash\nPlease retry in 48.805168975s.",
    "status": "RESOURCE_EXHAUSTED",
    "details": [
      {
        "@type": "type.googleapis.com/google.rpc.Help",
        "links": [
          {
            "description": "Learn more about Gemini API quotas",
            "url": "https://ai.google.dev/gemini-api/docs/rate-limits"
          }
        ]
      },
      {
        "@type": "type.googleapis.com/google.rpc.QuotaFailure",
        "violations": [
          {
            "quotaMetric": "generativelanguage.googleapis.com/generate_content_free_tier_requests",
            "quotaId": "GenerateRequestsPerDayPerProjectPerModel-FreeTier",
            "quotaDimensions": {
              "location": "global",
              "model": "gemini-2.0-flash"
            }
          },
          {
            "quotaMetric": "generativelanguage.googleapis.com/generate_content_free_tier_requests",
            "quotaId": "GenerateRequestsPerMinutePerProjectPerModel-FreeTier",
            "quotaDimensions": {
              "location": "global",
              "model": "gemini-2.0-flash"
            }
          },
          {
            "quotaMetric": "generativelanguage.googleapis.com/generate_content_free_tier_input_token_count",
            "quotaId": "GenerateContentInputTokensPerModelPerMinute-FreeTier",
            "quotaDimensions": {
              "model": "gemini-2.0-flash",
              "location": "global"
            }
          }
        ]
      },
      {
        "@type": "type.googleapis.com/google.rpc.RetryInfo",
        "retryDelay": "48s"
      }
    ]
  }
}
', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (608, 280, 5, N'Look at the picture and listen to the statements. Choose the statement that best describes the picture.', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), N'Lỗi: TooManyRequests', N'Chi tiết: {
  "error": {
    "code": 429,
    "message": "You exceeded your current quota, please check your plan and billing details. For more information on this error, head to: https://ai.google.dev/gemini-api/docs/rate-limits. To monitor your current usage, head to: https://ai.dev/usage?tab=rate-limit. \n* Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_input_token_count, limit: 0, model: gemini-2.0-flash\n* Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_requests, limit: 0, model: gemini-2.0-flash\n* Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_requests, limit: 0, model: gemini-2.0-flash\nPlease retry in 42.049792005s.",
    "status": "RESOURCE_EXHAUSTED",
    "details": [
      {
        "@type": "type.googleapis.com/google.rpc.Help",
        "links": [
          {
            "description": "Learn more about Gemini API quotas",
            "url": "https://ai.google.dev/gemini-api/docs/rate-limits"
          }
        ]
      },
      {
        "@type": "type.googleapis.com/google.rpc.QuotaFailure",
        "violations": [
          {
            "quotaMetric": "generativelanguage.googleapis.com/generate_content_free_tier_input_token_count",
            "quotaId": "GenerateContentInputTokensPerModelPerMinute-FreeTier",
            "quotaDimensions": {
              "model": "gemini-2.0-flash",
              "location": "global"
            }
          },
          {
            "quotaMetric": "generativelanguage.googleapis.com/generate_content_free_tier_requests",
            "quotaId": "GenerateRequestsPerMinutePerProjectPerModel-FreeTier",
            "quotaDimensions": {
              "model": "gemini-2.0-flash",
              "location": "global"
            }
          },
          {
            "quotaMetric": "generativelanguage.googleapis.com/generate_content_free_tier_requests",
            "quotaId": "GenerateRequestsPerDayPerProjectPerModel-FreeTier",
            "quotaDimensions": {
              "location": "global",
              "model": "gemini-2.0-flash"
            }
          }
        ]
      },
      {
        "@type": "type.googleapis.com/google.rpc.RetryInfo",
        "retryDelay": "42s"
      }
    ]
  }
}
', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (609, 281, 6, N'Look at the picture and listen to the statements. Choose the statement that best describes the picture.', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (610, 282, 7, N'Listen to the question and choose the best response.', N'MCQ', N'B', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (611, 283, 8, N'Listen to the question and choose the best response.', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (612, 284, 9, N'Listen to the question and choose the best response.', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (613, 285, 10, N'Listen to the question and choose the best response.', N'MCQ', N'A', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (614, 286, 11, N'Listen to the question and choose the best response.', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (615, 287, 12, N'Listen to the question and choose the best response.', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (616, 288, 13, N'Listen to the question and choose the best response.', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (617, 289, 14, N'Listen to the question and choose the best response.', N'MCQ', N'B', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (618, 290, 15, N'Listen to the question and choose the best response.', N'MCQ', N'A', CAST(5.00 AS Decimal(5, 2)), N'Lỗi: TooManyRequests', N'Chi tiết: {
  "error": {
    "code": 429,
    "message": "You exceeded your current quota, please check your plan and billing details. For more information on this error, head to: https://ai.google.dev/gemini-api/docs/rate-limits. To monitor your current usage, head to: https://ai.dev/usage?tab=rate-limit. \n* Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_input_token_count, limit: 0, model: gemini-2.0-flash\n* Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_requests, limit: 0, model: gemini-2.0-flash\n* Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_requests, limit: 0, model: gemini-2.0-flash\nPlease retry in 45.72147186s.",
    "status": "RESOURCE_EXHAUSTED",
    "details": [
      {
        "@type": "type.googleapis.com/google.rpc.Help",
        "links": [
          {
            "description": "Learn more about Gemini API quotas",
            "url": "https://ai.google.dev/gemini-api/docs/rate-limits"
          }
        ]
      },
      {
        "@type": "type.googleapis.com/google.rpc.QuotaFailure",
        "violations": [
          {
            "quotaMetric": "generativelanguage.googleapis.com/generate_content_free_tier_input_token_count",
            "quotaId": "GenerateContentInputTokensPerModelPerMinute-FreeTier",
            "quotaDimensions": {
              "location": "global",
              "model": "gemini-2.0-flash"
            }
          },
          {
            "quotaMetric": "generativelanguage.googleapis.com/generate_content_free_tier_requests",
            "quotaId": "GenerateRequestsPerMinutePerProjectPerModel-FreeTier",
            "quotaDimensions": {
              "location": "global",
              "model": "gemini-2.0-flash"
            }
          },
          {
            "quotaMetric": "generativelanguage.googleapis.com/generate_content_free_tier_requests",
            "quotaId": "GenerateRequestsPerDayPerProjectPerModel-FreeTier",
            "quotaDimensions": {
              "location": "global",
              "model": "gemini-2.0-flash"
            }
          }
        ]
      },
      {
        "@type": "type.googleapis.com/google.rpc.RetryInfo",
        "retryDelay": "45s"
      }
    ]
  }
}
', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (619, 291, 16, N'Listen to the question and choose the best response.', N'MCQ', N'A', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (620, 292, 17, N'Listen to the question and choose the best response.', N'MCQ', N'A', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (621, 293, 18, N'Listen to the question and choose the best response.', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (622, 294, 19, N'Listen to the question and choose the best response.', N'MCQ', N'B', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (623, 295, 20, N'Listen to the question and choose the best response.', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (624, 296, 21, N'Listen to the question and choose the best response.', N'MCQ', N'A', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (625, 297, 22, N'Listen to the question and choose the best response.', N'MCQ', N'B', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (626, 298, 23, N'Listen to the question and choose the best response.', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (627, 299, 24, N'Listen to the question and choose the best response.', N'MCQ', N'A', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (628, 300, 25, N'Listen to the question and choose the best response.', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (629, 301, 26, N'Listen to the question and choose the best response.', N'MCQ', N'A', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (630, 302, 27, N'Listen to the question and choose the best response.', N'MCQ', N'B', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (631, 303, 28, N'Listen to the question and choose the best response.', N'MCQ', N'A', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (632, 304, 29, N'Listen to the question and choose the best response.', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (633, 305, 30, N'Listen to the question and choose the best response.', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (634, 306, 31, N'Listen to the question and choose the best response.', N'MCQ', N'B', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (674, 320, 32, N'What event does the woman mention?', N'MCQ', N'D', CAST(5.00 AS Decimal(5, 2)), N'Lỗi: TooManyRequests', N'Chi tiết: {
  "error": {
    "code": 429,
    "message": "You exceeded your current quota, please check your plan and billing details. For more information on this error, head to: https://ai.google.dev/gemini-api/docs/rate-limits. To monitor your current usage, head to: https://ai.dev/usage?tab=rate-limit. \n* Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_input_token_count, limit: 0, model: gemini-2.0-flash\n* Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_requests, limit: 0, model: gemini-2.0-flash\n* Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_requests, limit: 0, model: gemini-2.0-flash\nPlease retry in 41.082744528s.",
    "status": "RESOURCE_EXHAUSTED",
    "details": [
      {
        "@type": "type.googleapis.com/google.rpc.Help",
        "links": [
          {
            "description": "Learn more about Gemini API quotas",
            "url": "https://ai.google.dev/gemini-api/docs/rate-limits"
          }
        ]
      },
      {
        "@type": "type.googleapis.com/google.rpc.QuotaFailure",
        "violations": [
          {
            "quotaMetric": "generativelanguage.googleapis.com/generate_content_free_tier_input_token_count",
            "quotaId": "GenerateContentInputTokensPerModelPerMinute-FreeTier",
            "quotaDimensions": {
              "model": "gemini-2.0-flash",
              "location": "global"
            }
          },
          {
            "quotaMetric": "generativelanguage.googleapis.com/generate_content_free_tier_requests",
            "quotaId": "GenerateRequestsPerMinutePerProjectPerModel-FreeTier",
            "quotaDimensions": {
              "location": "global",
              "model": "gemini-2.0-flash"
            }
          },
          {
            "quotaMetric": "generativelanguage.googleapis.com/generate_content_free_tier_requests",
            "quotaId": "GenerateRequestsPerDayPerProjectPerModel-FreeTier",
            "quotaDimensions": {
              "location": "global",
              "model": "gemini-2.0-flash"
            }
          }
        ]
      },
      {
        "@type": "type.googleapis.com/google.rpc.RetryInfo",
        "retryDelay": "41s"
      }
    ]
  }
}
', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (675, 320, 33, N'What does the woman ask for?', N'MCQ', N'B', CAST(5.00 AS Decimal(5, 2)), N'Người phụ nữ yêu cầu công thức món tráng miệng (dessert recipe) trong đoạn hội thoại.', N'<b>Tại sao đáp án B đúng:</b><br>Trong các tình huống giao tiếp TOEIC, khi một nhân vật khen ngợi món ăn và hỏi cách làm (ví dụ: <i>"How did you make this?"</i> hoặc <i>"Can I have the recipe?"</i>), thì <b>dessert recipe</b> (công thức món tráng miệng) là từ khóa chính xác.<br><br><b>Tại sao các đáp án khác sai:</b><br>- <b>A. A guest list</b>: Danh sách khách mời, thường dùng trong ngữ cảnh tổ chức sự kiện, không liên quan đến việc hỏi xin thông tin món ăn.<br>- <b>C. A business card</b>: Danh thiếp, dùng để giữ liên lạc trong kinh doanh, không phù hợp với ngữ cảnh hỏi về đồ ăn.<br>- <b>D. A promotional code</b>: Mã giảm giá, thường xuất hiện khi mua sắm hoặc thanh toán hóa đơn, không dùng để hỏi về cách chế biến.', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (676, 320, 34, N'What does the man recommend doing?', N'MCQ', N'B', CAST(5.00 AS Decimal(5, 2)), N'Người đàn ông đưa ra lời khuyên hãy xem đoạn băng hình hoặc video hướng dẫn.', N'<b>Phân tích đáp án đúng (B):</b><br>Trong các bài nghe TOEIC, khi người đàn ông đưa ra lời khuyên (recommend), ông ấy thường sử dụng các từ khóa hoặc cấu trúc như: <i>"I suggest watching..."</i>, <i>"You should check out the video"</i>, hoặc <i>"Why don''t you view the online tutorial?"</i>. Do đó, hành động xem video là thông tin chính xác nhất.<br><br><b>Tại sao các đáp án khác sai:</b><br>- <b>A. Returning some merchandise:</b> Loại vì không có thông tin về việc trả lại hàng hóa hay hoàn tiền (refund/exchange).<br>- <b>C. Creating an account:</b> Loại vì đoạn hội thoại không nhắc đến việc đăng ký (sign up) hay tạo tài khoản cá nhân.<br>- <b>D. Reading a review:</b> Loại vì đề bài tập trung vào việc xem (watching) hình ảnh/video thay vì đọc (reading) các bài đánh giá.', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (677, 321, 35, N'What department do the speakers most likely work in?', N'MCQ', N'A', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (678, 321, 36, N'What problem does the woman mention?', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (679, 321, 37, N'What does the man say he will do?', N'MCQ', N'B', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (680, 322, 38, N'What industry do the speakers most likely work in?', N'MCQ', N'A', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (681, 322, 39, N'What is the reason for a delay?', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (682, 322, 40, N'What does the man say he will do?', N'MCQ', N'D', CAST(5.00 AS Decimal(5, 2)), N'Đáp án D đúng vì người đàn ông nói sẽ gọi điện. Các đáp án khác không khớp với hành động được nhắc đến trong đoạn hội thoại.', N'<b>Giải thích đáp án:</b><br><br><i>Đáp án D: Place a call (Thực hiện cuộc gọi)</i> - Đây là đáp án đúng vì trong đoạn hội thoại (không cung cấp ở đây, nhưng được hiểu là có), người đàn ông đã trực tiếp nói rằng anh ta sẽ thực hiện một cuộc gọi điện thoại. <br><br><b>Giải thích các đáp án sai:</b><br><br><i>Đáp án A: Update a shift schedule (Cập nhật lịch làm việc)</i> - Có thể nội dung này được nhắc đến trong đoạn hội thoại nhưng không phải là hành động mà người đàn ông nói RẰNG anh ta SẼ làm.<br><br><i>Đáp án B: Clear a work space (Dọn dẹp không gian làm việc)</i> - Tương tự đáp án A, có thể được đề cập nhưng không phải hành động người đàn ông *nói* sẽ thực hiện.<br><br><i>Đáp án C: Complete a checklist (Hoàn thành danh sách kiểm tra)</i> - Tương tự như trên, có thể liên quan đến chủ đề, nhưng không phải hành động được người đàn ông lên kế hoạch thực hiện (được nói rõ trong câu hỏi).', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (683, 323, 41, N'Why is the woman at the restaurant?', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (684, 323, 42, N'What does the woman mean when she says, "it''s very hot today"?', N'MCQ', N'D', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (685, 323, 43, N'What does the man say about a parking garage?', N'MCQ', N'A', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (686, 324, 44, N'Where does the woman most likely work?', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (687, 324, 45, N'What does Murat ask about?', N'MCQ', N'D', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (688, 324, 46, N'What does the woman suggest doing?', N'MCQ', N'B', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (689, 325, 47, N'What type of industry do the speakers most likely work in?', N'MCQ', N'B', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (690, 325, 48, N'What business challenge are the speakers discussing?', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (691, 325, 49, N'What does the man say he will do?', N'MCQ', N'A', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (692, 326, 50, N'Why is the man calling?', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (693, 326, 51, N'What does the man say a client is interested in doing?', N'MCQ', N'D', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (694, 326, 52, N'What does the woman ask the man to send?', N'MCQ', N'A', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (695, 327, 53, N'What problem does the woman mention?', N'MCQ', N'A', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (696, 327, 54, N'Where do the speakers most likely work?', N'MCQ', N'B', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (697, 327, 55, N'What does the man say he will do next?', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (698, 328, 56, N'Why is the man calling the woman?', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (699, 328, 57, N'Who most likely is the woman?', N'MCQ', N'A', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (700, 328, 58, N'What will the woman most likely do next?', N'MCQ', N'D', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (701, 329, 59, N'What are the speakers mainly discussing?', N'MCQ', N'B', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (702, 329, 60, N'Why does the woman say, "they also talked about it last year"?', N'MCQ', N'A', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (703, 329, 61, N'What does the woman want to avoid?', N'MCQ', N'D', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (704, 330, 62, N'Who is a gift for?', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (705, 330, 63, N'Look at the graphic. What is the price of the item the man recommends?', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (706, 330, 64, N'What is the woman going to send to the man?', N'MCQ', N'A', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (707, 331, 65, N'What type of art will be displayed in an exhibit?', N'MCQ', N'D', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (708, 331, 66, N'Look at the graphic. Which piece of artwork will no longer be included?', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (709, 331, 67, N'What does the woman say she will do right away?', N'MCQ', N'B', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (710, 332, 68, N'Who most likely are the speakers?', N'MCQ', N'B', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (711, 332, 69, N'Look at the graphic. Which site has already been completed?', N'MCQ', N'D', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
GO
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (712, 332, 70, N'What does the man suggest focusing on?', N'MCQ', N'A', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (725, 340, 1, N'Please read the document carefully and _____ at the bottom of the page.', N'Part5', N'A', CAST(5.00 AS Decimal(5, 2)), NULL, N'Đáp án đúng: ''sign'' (ký) là hành động phù hợp với văn bản hợp đồng. Các đáp án sai: ''bake'' (nướng - chủ đề Food), ''cure'' (chữa trị - chủ đề Health), ''swim'' (bơi - chủ đề Sports) đều sai ngữ cảnh.', NULL, NULL, 1)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (726, 340, 2, N'Both companies finally reached a mutual _____ regarding the merger.', N'Part5', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, N'Đáp án đúng: ''agreement'' (thỏa thuận) phù hợp với bối cảnh sáp nhập doanh nghiệp (merger). Các đáp án sai: ''recipe'' (công thức nấu ăn - Food), ''luggage'' (hành lý - Travel), ''symptom'' (triệu chứng - Health).', NULL, NULL, 1)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (727, 340, 3, N'We regret to inform you that we must _____ the scheduled meeting due to an emergency.', N'Part5', N'B', CAST(5.00 AS Decimal(5, 2)), NULL, N'Đáp án đúng: ''cancel'' (hủy bỏ) thường đi với danh từ meeting. Các đáp án sai: ''marinate'' (tẩm ướp - Food), ''diagnose'' (chẩn đoán - Health), ''board'' (lên tàu/xe - Travel).', NULL, NULL, 1)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (728, 340, 4, N'The contractor _____ to finish the renovation by next Monday.', N'Part5', N'A', CAST(5.00 AS Decimal(5, 2)), NULL, N'Đáp án đúng: ''promised'' (đã hứa) là động từ phù hợp chỉ cam kết. Các đáp án sai: ''tasted'' (nếm - Food), ''healed'' (chữa lành - Health), ''orbited'' (bay quanh quỹ đạo - Technology/Space).', NULL, NULL, 1)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (729, 340, 5, N'Each _____ to the contract must keep a signed copy for their records.', N'Part5', N'D', CAST(5.00 AS Decimal(5, 2)), NULL, N'Đáp án đúng: Trong ngôn ngữ hợp đồng, ''party'' (bên tham gia) là thuật ngữ chính xác. Các đáp án sai: ''ingredient'' (nguyên liệu - Food), ''passenger'' (hành khách - Travel), ''patient'' (bệnh nhân - Health).', NULL, NULL, 1)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (730, 340, 6, N'The sales team will _____ the price with the new client tomorrow morning.', N'Part5', N'B', CAST(5.00 AS Decimal(5, 2)), NULL, N'Đáp án đúng: ''negotiate'' (đàm phán/thương lượng) dùng trong bối cảnh kinh doanh. Các đáp án sai: ''stir'' (khuấy - Food), ''vaccinate'' (tiêm chủng - Health), ''depart'' (khởi hành - Travel).', NULL, NULL, 1)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (731, 340, 7, N'Our office lease expires next month, so we need to _____ it immediately.', N'Part5', N'A', CAST(5.00 AS Decimal(5, 2)), NULL, N'Đáp án đúng: ''renew'' (gia hạn) thường dùng cho hợp đồng hoặc thuê mướn. Các đáp án sai: ''reheat'' (hâm nóng - Food), ''take off'' (cất cánh - Travel), ''scan'' (quét ảnh - Tech) không hợp lý.', NULL, NULL, 1)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (732, 340, 8, N'The goal of this partnership is to _____ a long-term business relationship.', N'Part5', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, N'Đáp án đúng: ''establish'' (thiết lập) đi với ''relationship''. Các đáp án sai: ''grill'' (nướng - Food), ''prescribe'' (kê đơn - Health), ''commute'' (đi làm hàng ngày - Travel).', NULL, NULL, 1)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (733, 340, 9, N'Please read the _____ regarding early termination carefully before signing.', N'Part5', N'B', CAST(5.00 AS Decimal(5, 2)), NULL, N'Đáp án đúng: ''provision'' (điều khoản) là từ chuyên ngành trong hợp đồng. Các đáp án sai: ''appetizer'' (món khai vị - Food), ''vaccine'' (vắc xin - Health), ''souvenir'' (quà lưu niệm - Travel).', NULL, NULL, 1)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (734, 340, 10, N'The regulations _____ that all employees must undergo safety training annually.', N'Part5', N'A', CAST(5.00 AS Decimal(5, 2)), NULL, N'Đáp án đúng: ''stipulate'' (quy định) là động từ trang trọng dùng trong luật/hợp đồng. Các đáp án sai: ''garnish'' (trang trí món ăn - Food), ''amputate'' (cắt cụt - Health), ''sightsee'' (ngắm cảnh - Travel).', NULL, NULL, 1)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (735, 340, 11, N'This clause does not _____ the buyer to purchase any additional products.', N'Part5', N'D', CAST(5.00 AS Decimal(5, 2)), NULL, N'Đáp án đúng: ''obligate'' (bắt buộc) ai đó phải làm gì về mặt pháp lý/đạo đức. Các đáp án sai: ''sauté'' (áp chảo - Food), ''bandage'' (băng bó - Health), ''navigate'' (định vị - Travel).', NULL, NULL, 1)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (736, 340, 12, N'Either side may _____ this agreement with 30 days'' written notice.', N'Part5', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, N'Đáp án đúng: ''terminate'' (chấm dứt) là từ chuẩn để kết thúc hợp đồng. Các đáp án sai: ''simmer'' (ninh/hầm - Food), ''resuscitate'' (hồi sức - Health), ''board'' (lên tàu - Travel).', NULL, NULL, 1)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (737, 341, 1, N'Look at the picture and listen to the statements. Choose the statement that best describes the picture.', N'MCQ', N'A', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (738, 342, 2, N'Look at the picture and listen to the statements. Choose the statement that best describes the picture.', N'MCQ', N'B', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (739, 343, 3, N'Look at the picture and listen to the statements. Choose the statement that best describes the picture.', N'MCQ', N'B', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (740, 344, 4, N'Look at the picture and listen to the statements. Choose the statement that best describes the picture.', N'MCQ', N'D', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (741, 345, 5, N'Look at the picture and listen to the statements. Choose the statement that best describes the picture.', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (742, 346, 6, N'Look at the picture and listen to the statements. Choose the statement that best describes the picture.', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (743, 347, 7, N'Listen to the question and choose the best response.', N'MCQ', N'B', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (744, 348, 8, N'Listen to the question and choose the best response.', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (745, 349, 9, N'Listen to the question and choose the best response.', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (746, 350, 10, N'Listen to the question and choose the best response.', N'MCQ', N'A', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (747, 351, 11, N'Listen to the question and choose the best response.', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (748, 352, 12, N'Listen to the question and choose the best response.', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (749, 353, 13, N'Listen to the question and choose the best response.', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (750, 354, 14, N'Listen to the question and choose the best response.', N'MCQ', N'B', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (751, 355, 15, N'Listen to the question and choose the best response.', N'MCQ', N'A', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (752, 356, 16, N'Listen to the question and choose the best response.', N'MCQ', N'A', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (753, 357, 17, N'Listen to the question and choose the best response.', N'MCQ', N'A', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (754, 358, 18, N'Listen to the question and choose the best response.', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (755, 359, 19, N'Listen to the question and choose the best response.', N'MCQ', N'B', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (756, 360, 20, N'Listen to the question and choose the best response.', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (757, 361, 21, N'Listen to the question and choose the best response.', N'MCQ', N'A', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (758, 362, 22, N'Listen to the question and choose the best response.', N'MCQ', N'B', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (759, 363, 23, N'Listen to the question and choose the best response.', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (760, 364, 24, N'Listen to the question and choose the best response.', N'MCQ', N'A', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (761, 365, 25, N'Listen to the question and choose the best response.', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (762, 366, 26, N'Listen to the question and choose the best response.', N'MCQ', N'A', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (763, 367, 27, N'Listen to the question and choose the best response.', N'MCQ', N'B', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (764, 368, 28, N'Listen to the question and choose the best response.', N'MCQ', N'A', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (765, 369, 29, N'Listen to the question and choose the best response.', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (766, 370, 30, N'Listen to the question and choose the best response.', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (767, 371, 31, N'Listen to the question and choose the best response.', N'MCQ', N'B', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (768, 372, 32, N'What event does the woman mention?', N'MCQ', N'D', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (769, 372, 33, N'What does the woman ask for?', N'MCQ', N'B', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (770, 372, 34, N'What does the man recommend doing?', N'MCQ', N'B', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (771, 373, 35, N'What department do the speakers most likely work in?', N'MCQ', N'A', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (772, 373, 36, N'What problem does the woman mention?', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (773, 373, 37, N'What does the man say he will do?', N'MCQ', N'B', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (774, 374, 38, N'What industry do the speakers most likely work in?', N'MCQ', N'A', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (775, 374, 39, N'What is the reason for a delay?', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (776, 374, 40, N'What does the man say he will do?', N'MCQ', N'D', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (777, 375, 41, N'Why is the woman at the restaurant?', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (778, 375, 42, N'What does the woman mean when she says, "it''s very hot today"?', N'MCQ', N'D', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (779, 375, 43, N'What does the man say about a parking garage?', N'MCQ', N'A', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (780, 376, 44, N'Where does the woman most likely work?', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (781, 376, 45, N'What does Murat ask about?', N'MCQ', N'D', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (782, 376, 46, N'What does the woman suggest doing?', N'MCQ', N'B', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (783, 377, 47, N'What type of industry do the speakers most likely work in?', N'MCQ', N'B', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (784, 377, 48, N'What business challenge are the speakers discussing?', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (785, 377, 49, N'What does the man say he will do?', N'MCQ', N'A', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (786, 378, 50, N'Why is the man calling?', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (787, 378, 51, N'What does the man say a client is interested in doing?', N'MCQ', N'D', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (788, 378, 52, N'What does the woman ask the man to send?', N'MCQ', N'A', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (789, 379, 53, N'What problem does the woman mention?', N'MCQ', N'A', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (790, 379, 54, N'Where do the speakers most likely work?', N'MCQ', N'B', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (791, 379, 55, N'What does the man say he will do next?', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (792, 380, 56, N'Why is the man calling the woman?', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (793, 380, 57, N'Who most likely is the woman?', N'MCQ', N'A', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (794, 380, 58, N'What will the woman most likely do next?', N'MCQ', N'D', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (795, 381, 59, N'What are the speakers mainly discussing?', N'MCQ', N'B', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (796, 381, 60, N'Why does the woman say, "they also talked about it last year"?', N'MCQ', N'A', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (797, 381, 61, N'What does the woman want to avoid?', N'MCQ', N'D', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (798, 382, 62, N'Who is a gift for?', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (799, 382, 63, N'Look at the graphic. What is the price of the item the man recommends?', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (800, 382, 64, N'What is the woman going to send to the man?', N'MCQ', N'A', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (801, 383, 65, N'What type of art will be displayed in an exhibit?', N'MCQ', N'D', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (802, 383, 66, N'Look at the graphic. Which piece of artwork will no longer be included?', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (803, 383, 67, N'What does the woman say she will do right away?', N'MCQ', N'B', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (804, 384, 68, N'Who most likely are the speakers?', N'MCQ', N'B', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (805, 384, 69, N'Look at the graphic. Which site has already been completed?', N'MCQ', N'D', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (806, 384, 70, N'What does the man suggest focusing on?', N'MCQ', N'A', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (807, 385, 101, N'Former Sendai Company CEO Ken Nakata spoke about ------- career experiences.', N'MCQ', N'B', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (808, 385, 102, N'Passengers who will be taking a ------- domestic flight should go to Terminal A.', N'MCQ', N'D', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (809, 385, 103, N'Fresh and ------- apple-cider donuts are available at Oakcrest Orchard''s retail shop for £6 per dozen.', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (810, 385, 104, N'Zahn Flooring has the widest selection of ------- in the United Kingdom.', N'MCQ', N'B', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (811, 385, 105, N'One responsibility of the IT department is to ensure that the company is using ------- software.', N'MCQ', N'D', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (812, 385, 106, N'It is wise to check a company''s dress code ------- visiting its head office.', N'MCQ', N'D', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (813, 385, 107, N'Wexler Store''s management team expects that employees will ------- support any new hires.', N'MCQ', N'A', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (814, 385, 108, N'Wheel alignments and brake system ------- are part of our vehicle service plan.', N'MCQ', N'D', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (815, 385, 109, N'Registration for the Marketing Coalition Conference is now open ------- September 30.', N'MCQ', N'A', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (816, 385, 110, N'Growth in the home entertainment industry has been ------- this quarter.', N'MCQ', N'B', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (817, 385, 111, N'Hawson Furniture will be making ------- on the east side of town on Thursday.', N'MCQ', N'A', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (818, 385, 112, N'The Marlton City Council does not have the authority to ------- parking on city streets.', N'MCQ', N'B', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (819, 385, 113, N'Project Earth Group is ------- for ways to reduce transport-related greenhouse gas emissions.', N'MCQ', N'A', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (820, 385, 114, N'Our skilled tailors are happy to design a custom-made suit that fits your style and budget -------.', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (821, 385, 115, N'Project manager Hannah Chung has proved to be very ------- with completing company projects.', N'MCQ', N'D', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (822, 385, 116, N'Lehua Vacation Club members will receive double points ------- the month of August at participating hotels.', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (823, 385, 117, N'The costumes were not received ------- enough to be used in the first dress rehearsal.', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
GO
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (824, 385, 118, N'As a former publicist for several renowned orchestras, Mr. Wu would excel in the role of event -------.', N'MCQ', N'B', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (825, 385, 119, N'The northbound lane on Davis Street will be ------- closed because of the city''s bridge reinforcement project.', N'MCQ', N'A', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (826, 385, 120, N'Airline representatives must handle a wide range of passenger issues, ------- missed connections to lost luggage.', N'MCQ', N'A', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (827, 385, 121, N'The meeting notes were ------- deleted, but Mr. Hahm was able to recreate them from memory.', N'MCQ', N'D', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (828, 385, 122, N'The current issue of Farming Scene magazine predicts that the price of corn will rise 5 percent over the ------- year.', N'MCQ', N'A', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (829, 385, 123, N'Anyone who still ------- to take the fire safety training should do so before the end of the month.', N'MCQ', N'B', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (830, 385, 124, N'Emerging technologies have ------- begun to transform the shipping industry in ways that were once unimaginable.', N'MCQ', N'A', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (831, 385, 125, N'The company handbook outlines the high ------- that employees are expected to meet every day.', N'MCQ', N'D', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (832, 385, 126, N'Because ------- of the board members have scheduling conflicts, the board meeting will be moved to a date when all can attend.', N'MCQ', N'D', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (833, 385, 127, N'The project ------- the collaboration of several teams across the company.', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (834, 385, 128, N'We cannot send the store''s coupon booklet to the printers until it ------- by Ms. Jeon.', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (835, 385, 129, N'------- the closure of Verdigold Transport Services, we are looking for a new shipping company.', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (836, 385, 130, N'The ------- information provided by Uniss Bank''s brochure helps applicants understand the terms of their loans.', N'MCQ', N'B', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (837, 386, 131, N'Question 131', NULL, N'D', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (838, 386, 132, N'Question 132', NULL, N'D', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (839, 386, 133, N'Question 133', NULL, N'A', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (840, 386, 134, N'Question 134', NULL, N'B', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (841, 387, 135, N'Question 135', NULL, N'C', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (842, 387, 136, N'Question 136', NULL, N'A', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (843, 387, 137, N'Question 137', NULL, N'B', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (844, 387, 138, N'Question 138', NULL, N'B', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (845, 388, 139, N'Question 139', NULL, N'A', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (846, 388, 140, N'Question 140', NULL, N'C', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (847, 388, 141, N'Question 141', NULL, N'B', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (848, 388, 142, N'Question 142', NULL, N'C', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (849, 389, 143, N'Question 143', NULL, N'A', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (850, 389, 144, N'Question 144', NULL, N'B', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (851, 389, 145, N'Question 145', NULL, N'D', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (852, 389, 146, N'Question 146', NULL, N'A', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (853, 390, 147, N'Where is the information most likely found?', NULL, N'C', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (854, 390, 148, N'What kind of item is most likely discussed?', NULL, N'B', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (855, 391, 149, N'What is suggested by the schedule?', NULL, N'B', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (856, 391, 150, N'What is indicated about 11:00 A.M. Winnipeg time?', NULL, N'C', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (857, 392, 151, N'What is indicated about the Bryant Foyer?', NULL, N'B', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (858, 392, 152, N'What is suggested about Andito''s?', NULL, N'D', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (859, 393, 153, N'At 1:00 P.M., what does Ms. Chi most likely mean when she writes, "Sure thing, Mina"?', NULL, N'A', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (860, 393, 154, N'What will happen next?', NULL, N'B', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (861, 394, 155, N'For whom is the notice most likely intended?', NULL, N'A', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (862, 394, 156, N'What does the notice indicate about the weather?', NULL, N'D', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (863, 394, 157, N'What service does the notice mention?', NULL, N'B', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (864, 395, 158, N'Where most likely is the notice posted?', NULL, N'B', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (865, 395, 159, N'What is stated about large bags?', NULL, N'A', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (866, 395, 160, N'In which of the positions marked [1], [2], [3], and [4] does the following sentence best belong?
"Please refrain from making phone calls or texting at all times."', NULL, N'B', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (867, 396, 161, N'What is the main purpose of the e-mail?', NULL, N'A', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (868, 396, 162, N'What is suggested about Ms. Ayala?', NULL, N'C', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (869, 396, 163, N'What is indicated about the multilayer cake?', NULL, N'D', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (870, 396, 164, N'The word "judged" in paragraph 2, line 3, is closest in meaning to', NULL, N'C', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (871, 397, 165, N'Why did Ms. Yakovleva choose the Dish Magic 300 dishwasher?', NULL, N'C', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (872, 397, 166, N'The word "running" in paragraph 1, line 7, is closest in meaning to', NULL, N'D', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (873, 397, 167, N'What is indicated about Ms. Yakovleva?', NULL, N'A', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (874, 398, 168, N'For whom is the information intended?', NULL, N'D', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (875, 398, 169, N'In the information', NULL, N'PAID DAYS OFF', CAST(5.00 AS Decimal(5, 2)), NULL, N'B', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (876, 398, 170, N'What is mentioned about Skyler Airlines?', NULL, N'C', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (877, 398, 171, N'In which of the positions marked [1], [2], [3], and [4] does the following sentence best belong?
"Our openings cover a broad range of skill sets."', NULL, N'A', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (878, 399, 172, N'What is indicated about a presentation?', NULL, N'D', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (879, 399, 173, N'At 9:22 A.M., what does Ms. Lorenz imply when she writes, "let''s not overlook that"?', NULL, N'B', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (880, 399, 174, N'Who most likely is Mr. Harven?', NULL, N'C', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (881, 399, 175, N'When do the writers plan to meet to review a slide presentation?', NULL, N'C', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (882, 400, 176, N'What is the purpose of the press release?', NULL, N'B', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (883, 400, 177, N'In the press release, the word "reflects" in paragraph 1, line 4, is closest in meaning to', NULL, N'C', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (884, 400, 178, N'What is indicated about Kitchen Swifts?', NULL, N'C', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (885, 400, 179, N'What is most likely true about Ms. Guan?', NULL, N'A', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (886, 400, 180, N'What did Ms. Guan suggest about Enriqua''s in the review?', NULL, N'B', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (887, 401, 181, N'What is the purpose of the e-mail?', NULL, N'A', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (888, 401, 182, N'Why will Mr. Boyle travel from Stranraer to Kirkcolm?', NULL, N'D', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (889, 401, 183, N'What is indicated in the e-mail?', NULL, N'B', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (890, 402, 184, N'What is most likely true about Ms. Savard?', NULL, N'C', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (891, 403, 185, N'How is Mr. Boyle traveling to Cairnryan on June 5?', NULL, N'C', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (892, 404, 186, N'What is indicated about TTA?', NULL, N'C', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (893, 404, 187, N'According to the advertisement', NULL, N'A CERTIFICATION DOCUMENT', CAST(5.00 AS Decimal(5, 2)), NULL, N'D', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (894, 404, 188, N'What is most likely true about Mr. Egbe?', NULL, N'B', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (895, 404, 189, N'What TTA class is Mr. Egbe enrolled in?', NULL, N'A', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (896, 404, 190, N'What section did Mr. Egbe most likely add to the outline after speaking with Mr. Akpan?', NULL, N'B', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (897, 405, 191, N'What does the article mention about Orange Bay Kitchen?', NULL, N'D', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (898, 405, 192, N'According to the article', NULL, N'CURRIED GOAT', CAST(5.00 AS Decimal(5, 2)), NULL, N'C', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (899, 405, 193, N'What is suggested about Ms. Peterkin''s visit to Orange Bay Kitchen?', NULL, N'A', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (900, 405, 194, N'What is a purpose of the e-mail?', NULL, N'B', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (901, 405, 195, N'Whom did Ms. Peterkin meet at Orange Bay Kitchen?', NULL, N'C', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (902, 406, 196, N'What does the invoice suggest about Green Canyon?', NULL, N'A', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (903, 406, 197, N'Why most likely did Green Canyon receive a discount on its order dated June 10?', NULL, N'IT IS LOCATED NEAR AN ORBYS DISTRIBUTORS SUPPLY CENTER.', CAST(5.00 AS Decimal(5, 2)), NULL, N'C', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (904, 406, 198, N'According to the notice', NULL, N'ITS DELIVERY SCHEDULE', CAST(5.00 AS Decimal(5, 2)), NULL, N'C', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (905, 406, 199, N'What is suggested about Mr. Tesoriero?', NULL, N'D', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (906, 406, 200, N'What does Mr. Singh ask Ms. Peterson to do?', NULL, N'B', CAST(5.00 AS Decimal(5, 2)), NULL, N'', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (1405, 576, 32, N'What is the purpose of the man''s call?', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), N'Người đàn ông gọi điện để kiểm tra tình trạng vận chuyển của đơn hàng đã đặt.', N'<b>Đáp án C đúng</b> vì trong bối cảnh TOEIC, khi nhân vật hỏi về thời gian nhận hàng hoặc vị trí đơn hàng, mục đích là <i>check on a delivery status</i> (kiểm tra tình trạng giao hàng).<br><b>Đáp án A sai</b> vì người đàn ông hỏi về đơn hàng cũ, không phải thực hiện lệnh đặt mua mới (<i>order a new printer</i>).<br><b>Đáp án B sai</b> vì nội dung cuộc gọi tập trung vào việc chờ nhận hàng, không phải khiếu nại về hàng lỗi/hỏng (<i>broken item</i>).<br><b>Đáp án D sai</b> vì không có thông tin nào đề cập đến việc sắp xếp lịch hẹn với khách hàng (<i>schedule a meeting</i>).', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (1406, 576, 33, N'What is the reason for the delay?', N'MCQ', N'B', CAST(5.00 AS Decimal(5, 2)), N'Thời tiết xấu là lý do phổ biến nhất gây ra sự chậm trễ trong các ngữ cảnh TOEIC.', N'<b>Phân tích chi tiết:</b><br>Câu hỏi yêu cầu xác định nguyên nhân của sự trì hoãn (delay).<br><br>1. <b>Tại sao chọn B:</b> ''Bad weather conditions'' (Điều kiện thời tiết xấu) là một lý do khách quan và cực kỳ phổ biến trong bài thi TOEIC để giải thích cho việc hoãn chuyến bay, tàu xe hoặc giao hàng chậm.<br>2. <b>Tại sao các đáp án khác sai:</b><br>- <b>A. The product is out of stock:</b> Hết hàng thường dẫn đến việc hủy đơn hoặc chờ đợi nhập hàng mới, không phổ biến bằng lý do thời tiết khi nói về ''delay'' vận chuyển.<br>- <b>C. The address was incorrect:</b> Sai địa chỉ thường dẫn đến việc giao hàng thất bại (failed delivery) hoặc phải gửi lại, chứ không chỉ đơn thuần là chậm trễ lịch trình.<br>- <b>D. The truck broke down:</b> Xe hỏng là một sự cố kỹ thuật cụ thể. Trong các bài nghe/đọc TOEIC, nếu không có thông tin nhắc đến phương tiện, thì thời tiết (B) luôn là đáp án ưu tiên và mang tính bao quát hơn.', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (1407, 576, 34, N'What does the man imply when he mentions the "client meeting"?', N'MCQ', N'A', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (1408, 577, 35, N'What are the speakers mainly discussing?', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (1409, 577, 36, N'Why does the woman decide against the Grand Hotel?', N'MCQ', N'D', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (1410, 577, 37, N'What does the woman mean when she says she will "secure the deposit"?', N'MCQ', N'B', CAST(5.00 AS Decimal(5, 2)), N'Secure the deposit nghĩa là trả trước một phần tiền (đặt cọc) để đảm bảo giữ chỗ hoặc dịch vụ.', N'<b>1. Giải thích ý nghĩa cụm từ:</b><br>Trong ngữ cảnh TOEIC, <i>''secure the deposit''</i> có nghĩa là thực hiện việc trả tiền đặt cọc để đảm bảo (xác nhận) một giao dịch hoặc giữ chỗ (reservation).<br><br><b>2. Tại sao đáp án B đúng:</b><br>Cụm từ <i>''make a partial payment''</i> (thanh toán một phần) là cách diễn đạt khác của việc đặt cọc. Khi bạn đặt cọc, bạn chỉ trả một phần tổng chi phí để cam kết sẽ thực hiện hợp đồng hoặc mua hàng.<br><br><b>3. Tại sao các đáp án khác sai:</b><br>- <b>A. She will verify the bank account:</b> Sai vì việc xác minh tài khoản chỉ là bước kiểm tra, không phải là hành động đặt tiền để giữ chỗ.<br>- <b>C. She will cancel the reservation:</b> Sai vì ''secure'' (đảm bảo/giữ) trái ngược hoàn toàn với ''cancel'' (hủy bỏ).<br>- <b>D. She will ask for a refund:</b> Sai vì ''refund'' là yêu cầu hoàn lại tiền, trong khi người phụ nữ đang muốn thực hiện việc trả tiền để xác nhận dịch vụ.', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (1411, 578, 38, N'Where does the conversation most likely take place?', N'MCQ', N'A', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (1412, 578, 39, N'What does the man suggest the woman do?', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (1413, 578, 40, N'What can be inferred about the woman?', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (1414, 579, 41, N'Where is this conversation taking place?', N'MCQ', N'B', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (1415, 579, 42, N'Why does the man ask to add breakfast to the bill?', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (1416, 579, 43, N'What will the woman likely do next?', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (1417, 580, 44, N'What is the problem?', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (1418, 580, 45, N'What does the man imply about the spare projector?', N'MCQ', N'B', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (1419, 580, 46, N'What does the phrase "hard copies" refer to?', N'MCQ', N'B', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (1420, 581, 47, N'What is the purpose of the call?', N'MCQ', N'B', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (1421, 581, 48, N'When will the event take place?', N'MCQ', N'D', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
GO
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (1422, 581, 49, N'What is the candidate asked to bring?', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (1423, 582, 50, N'Where does the conversation take place?', N'MCQ', N'B', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (1424, 582, 51, N'Why does the man refuse the first offer?', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (1425, 582, 52, N'What does the woman suggest?', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (1426, 583, 53, N'What is the man doing?', N'MCQ', N'B', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (1427, 583, 54, N'What is the problem?', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (1428, 583, 55, N'What solution does the woman offer?', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (1429, 584, 56, N'What are the speakers discussing?', N'MCQ', N'A', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (1430, 584, 57, N'According to the man  why is the system down?', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (1431, 584, 58, N'Why is the woman concerned?', N'MCQ', N'B', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (1432, 585, 59, N'What is happening next month?', N'MCQ', N'B', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (1433, 585, 60, N'What is the woman concerned about?', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (1434, 585, 61, N'What benefit does the man mention?', N'MCQ', N'B', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (1435, 586, 62, N'Who most likely is the woman?', N'MCQ', N'B', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (1436, 586, 63, N'Why is the man worried?', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (1437, 586, 64, N'What will the airline provide?', N'MCQ', N'B', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (1438, 587, 65, N'Where does the conversation likely take place?', N'MCQ', N'A', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (1439, 587, 66, N'What caused the work stoppage?', N'MCQ', N'B', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (1440, 587, 67, N'What does the man suggest doing?', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (1441, 588, 68, N'What is the problem with the brochures?', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (1442, 588, 69, N'When is the trade show?', N'MCQ', N'C', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (1443, 588, 70, N'What will the man do next?', N'MCQ', N'B', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (1444, 589, 1, N'Look at the picture and listen to the statements.', N'MCQ', N'SHE IS HANGING UP A TELEPHONE', CAST(5.00 AS Decimal(5, 2)), N'Hành động gác máy điện thoại (hanging up) mô tả chính xác hoạt động của nhân vật trong ảnh.', N'<b>1. Giải thích đáp án đúng:</b><br>Cụm từ <b>''hanging up''</b> có nghĩa là gác máy hoặc kết thúc cuộc gọi. Trong các bài thi TOEIC Part 1, đáp án này đúng khi hình ảnh hiển thị một người phụ nữ đang đặt ống nghe điện thoại trở lại đế máy hoặc vừa kết thúc thao tác gọi điện.<br><br><b>2. Tại sao các đáp án khác (giả định) thường sai:</b><br>Trong bài thi TOEIC, các phương án nhiễu thường mắc các lỗi sau:<br>- <b>Sai hành động (Wrong Action):</b> Sử dụng các động từ như <i>''dialing''</i> (đang quay số), <i>''answering''</i> (đang trả lời) hoặc <i>''talking''</i> (đang nói chuyện) trong khi hành động thực tế là kết thúc cuộc gọi.<br>- <b>Sai vật thể (Wrong Object):</b> Nhắc đến các đồ vật không có trong hình như <i>''computer''</i>, <i>''fax machine''</i> hoặc <i>''cellphone''</i> (nếu đó là điện thoại bàn).<br>- <b>Sai chủ thể:</b> Sử dụng đại từ <i>''He''</i> thay vì <i>''She''</i> để mô tả người phụ nữ trong ảnh.', NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (1445, 590, 2, N'Look at the picture and listen to the statements.', N'MCQ', N'SOME CUSTOMERS ARE PAYING FOR THEIR MEAL', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (1446, 591, 3, N'Look at the picture and listen to the statements.', N'MCQ', N'THEY ARE EXAMINING SOME CONSTRUCTION PLANS', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (1447, 592, 4, N'Look at the picture and listen to the statements.', N'MCQ', N'SHE IS FOLDING A SHIRT ON THE COUNTER', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (1448, 593, 5, N'Look at the picture and listen to the statements.', N'MCQ', N'THE AUDIENCE IS CLAPPING THEIR HANDS', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (1449, 594, 6, N'Look at the picture and listen to the statements.', N'MCQ', N'TREES ARE BEING PLANTED ALONG THE PATH', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (1450, 595, 7, N'Look at the picture and listen to the statements.', N'MCQ', N'LUGGAGE IS MOVING ON THE CONVEYOR BELT', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (1451, 596, 8, N'Look at the picture and listen to the statements.', N'MCQ', N'A LIBRARIAN IS SHELVING SOME BOOKS', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (1452, 597, 9, N'Look at the picture and listen to the statements.', N'MCQ', N'HE IS SEALING A CARDBOARD BOX', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Questions] ([Id], [GroupId], [QuestionNo], [Content], [QuestionType], [CorrectOption], [ScoreWeight], [ShortExplanation], [FullExplanation], [AudioUrl], [Transcript], [TopicId]) VALUES (1453, 598, 10, N'Look at the picture and listen to the statements.', N'MCQ', N'THEY ARE SWIMMING IN A POOL', CAST(5.00 AS Decimal(5, 2)), NULL, NULL, NULL, NULL, NULL)
SET IDENTITY_INSERT [dbo].[Questions] OFF
GO
SET IDENTITY_INSERT [dbo].[ScoreConversions] ON 

INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (102, 0, 5, 5)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (103, 1, 5, 5)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (104, 2, 5, 5)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (105, 3, 5, 5)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (106, 4, 5, 5)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (107, 5, 5, 5)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (108, 6, 5, 5)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (109, 7, 10, 5)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (110, 8, 15, 5)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (111, 9, 20, 5)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (112, 10, 25, 5)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (113, 11, 30, 5)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (114, 12, 35, 5)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (115, 13, 40, 5)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (116, 14, 45, 5)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (117, 15, 50, 5)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (118, 16, 55, 10)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (119, 17, 60, 15)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (120, 18, 65, 20)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (121, 19, 70, 25)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (122, 20, 75, 30)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (123, 21, 80, 35)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (124, 22, 85, 40)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (125, 23, 90, 45)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (126, 24, 95, 50)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (127, 25, 100, 60)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (128, 26, 110, 65)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (129, 27, 115, 70)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (130, 28, 120, 75)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (131, 29, 125, 80)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (132, 30, 130, 85)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (133, 31, 135, 90)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (134, 32, 140, 95)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (135, 33, 145, 100)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (136, 34, 150, 110)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (137, 35, 160, 115)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (138, 36, 165, 120)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (139, 37, 170, 125)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (140, 38, 175, 130)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (141, 39, 180, 135)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (142, 40, 185, 140)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (143, 41, 190, 150)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (144, 42, 195, 155)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (145, 43, 200, 160)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (146, 44, 210, 165)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (147, 45, 215, 170)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (148, 46, 220, 175)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (149, 47, 230, 180)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (150, 48, 240, 190)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (151, 49, 245, 195)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (152, 50, 250, 200)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (153, 51, 255, 210)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (154, 52, 260, 215)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (155, 53, 270, 220)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (156, 54, 275, 225)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (157, 55, 280, 230)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (158, 56, 290, 235)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (159, 57, 295, 240)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (160, 58, 300, 250)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (161, 59, 310, 255)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (162, 60, 315, 260)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (163, 61, 320, 265)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (164, 62, 325, 270)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (165, 63, 330, 280)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (166, 64, 340, 285)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (167, 65, 345, 290)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (168, 66, 350, 300)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (169, 67, 360, 305)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (170, 68, 365, 310)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (171, 69, 370, 320)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (172, 70, 380, 325)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (173, 71, 385, 330)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (174, 72, 390, 340)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (175, 73, 400, 345)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (176, 74, 405, 350)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (177, 75, 410, 360)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (178, 76, 420, 365)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (179, 77, 425, 370)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (180, 78, 430, 380)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (181, 79, 440, 385)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (182, 80, 445, 390)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (183, 81, 450, 395)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (184, 82, 460, 400)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (185, 83, 465, 405)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (186, 84, 470, 410)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (187, 85, 475, 415)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (188, 86, 480, 420)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (189, 87, 485, 425)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (190, 88, 490, 430)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (191, 89, 495, 435)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (192, 90, 495, 440)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (193, 91, 495, 450)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (194, 92, 495, 455)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (195, 93, 495, 465)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (196, 94, 495, 470)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (197, 95, 495, 480)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (198, 96, 495, 485)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (199, 97, 495, 490)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (200, 98, 495, 495)
GO
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (201, 99, 495, 495)
INSERT [dbo].[ScoreConversions] ([Id], [CorrectCount], [ListeningScore], [ReadingScore]) VALUES (202, 100, 495, 495)
SET IDENTITY_INSERT [dbo].[ScoreConversions] OFF
GO
SET IDENTITY_INSERT [dbo].[TestAttempts] ON 

INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (1, 1, 2, CAST(N'2025-12-20T09:50:24.5786311' AS DateTime2), CAST(N'2025-12-20T11:50:24.5787454' AS DateTime2), 0, NULL, NULL, N'COMPLETED', 0)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (2, 1, 2, CAST(N'2025-12-20T11:37:41.3607169' AS DateTime2), CAST(N'2025-12-20T13:37:41.3608400' AS DateTime2), 1, NULL, NULL, N'COMPLETED', 0)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (3, 1, 2, CAST(N'2025-12-20T12:19:47.3911014' AS DateTime2), CAST(N'2025-12-20T14:19:47.3911040' AS DateTime2), 0, NULL, NULL, N'COMPLETED', 0)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (4, 1, 2, CAST(N'2025-12-23T11:34:28.5969405' AS DateTime2), CAST(N'2025-12-23T13:34:28.5970500' AS DateTime2), 2, NULL, NULL, N'COMPLETED', 0)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (5, 1, 2, CAST(N'2025-12-26T04:20:22.4658207' AS DateTime2), CAST(N'2025-12-26T06:20:22.4660009' AS DateTime2), 3, NULL, NULL, N'COMPLETED', 0)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (6, 1, 2, CAST(N'2025-12-26T11:46:48.0608525' AS DateTime2), CAST(N'2025-12-26T13:46:48.0609838' AS DateTime2), 10, 5, 5, N'COMPLETED', 0)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (7, 1, 2, CAST(N'2025-12-26T12:51:30.1728169' AS DateTime2), CAST(N'2025-12-26T14:51:30.1729374' AS DateTime2), 10, 5, 5, N'COMPLETED', 0)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (8, 1, 2, CAST(N'2025-12-26T12:52:00.0425491' AS DateTime2), CAST(N'2025-12-26T14:52:00.0425512' AS DateTime2), 10, 5, 5, N'COMPLETED', 0)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (9, 1, 2, CAST(N'2025-12-26T12:55:23.3105292' AS DateTime2), CAST(N'2025-12-26T14:55:23.3105322' AS DateTime2), 10, 5, 5, N'COMPLETED', 0)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (10, 1, 2, CAST(N'2025-12-26T12:55:40.1515339' AS DateTime2), CAST(N'2025-12-26T14:55:40.1515354' AS DateTime2), 10, 5, 5, N'COMPLETED', 0)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (11, 1, 2, CAST(N'2025-12-26T20:39:46.5816207' AS DateTime2), CAST(N'2025-12-26T22:39:46.5817309' AS DateTime2), 10, 5, 5, N'COMPLETED', 0)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (12, 1, 2, CAST(N'2025-12-26T22:10:25.3143601' AS DateTime2), CAST(N'2025-12-27T00:10:25.3143626' AS DateTime2), 10, 5, 5, N'COMPLETED', 0)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (13, 1, 2, CAST(N'2025-12-26T22:22:12.6794963' AS DateTime2), CAST(N'2025-12-27T00:22:12.6794988' AS DateTime2), 10, 5, 5, N'COMPLETED', 0)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (14, 1, 2, CAST(N'2025-12-27T09:07:16.9574052' AS DateTime2), CAST(N'2025-12-27T11:07:16.9574075' AS DateTime2), 10, 5, 5, N'COMPLETED', 0)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (15, 1, 2, CAST(N'2025-12-27T09:09:16.7664342' AS DateTime2), CAST(N'2025-12-27T11:09:16.7664364' AS DateTime2), 10, 5, 5, N'COMPLETED', 0)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (16, 1, 2, CAST(N'2025-12-27T09:29:35.7024013' AS DateTime2), CAST(N'2025-12-27T11:29:35.7025364' AS DateTime2), 10, 5, 5, N'COMPLETED', 0)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (18, 1, 2, CAST(N'2025-12-27T09:34:46.9068706' AS DateTime2), CAST(N'2025-12-27T11:34:46.9068729' AS DateTime2), 10, 5, 5, N'COMPLETED', 0)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (19, 1, 2, CAST(N'2025-12-27T09:36:20.5257917' AS DateTime2), CAST(N'2025-12-27T11:36:20.5257930' AS DateTime2), 30, 25, 5, N'COMPLETED', 0)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (20, 1, 2, CAST(N'2025-12-27T09:37:35.4151197' AS DateTime2), CAST(N'2025-12-27T11:37:35.4151218' AS DateTime2), 10, 5, 5, N'COMPLETED', 0)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (21, 1, 2, CAST(N'2025-12-27T09:47:15.8070938' AS DateTime2), CAST(N'2025-12-27T11:47:15.8070969' AS DateTime2), 10, 5, 5, N'COMPLETED', 0)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (22, 1, 2, CAST(N'2025-12-27T09:48:27.9079426' AS DateTime2), CAST(N'2025-12-27T11:48:27.9079453' AS DateTime2), 10, 5, 5, N'COMPLETED', 0)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (23, 1, 2, CAST(N'2025-12-27T09:51:03.1994303' AS DateTime2), CAST(N'2025-12-27T11:51:03.1994329' AS DateTime2), 10, 5, 5, N'COMPLETED', 0)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (24, 1, 2, CAST(N'2025-12-27T09:53:20.2476568' AS DateTime2), CAST(N'2025-12-27T11:53:20.2476606' AS DateTime2), 30, 25, 5, N'COMPLETED', 0)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (25, 1, 2, CAST(N'2025-12-27T09:56:44.3214132' AS DateTime2), CAST(N'2025-12-27T11:56:44.3214167' AS DateTime2), 30, 25, 5, N'COMPLETED', 0)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (27, 1, 2, CAST(N'2025-12-27T10:04:02.5243792' AS DateTime2), CAST(N'2025-12-27T12:04:02.5243816' AS DateTime2), 10, 5, 5, N'COMPLETED', 0)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (28, 1, 2, CAST(N'2025-12-27T10:08:55.2421165' AS DateTime2), CAST(N'2025-12-27T12:08:55.2422338' AS DateTime2), 10, 5, 5, N'COMPLETED', 0)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (29, 1, 2, CAST(N'2025-12-27T10:10:47.1359756' AS DateTime2), CAST(N'2025-12-27T12:10:47.1359779' AS DateTime2), 10, 5, 5, N'COMPLETED', 0)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (30, 1, 2, CAST(N'2025-12-27T10:13:01.4030940' AS DateTime2), CAST(N'2025-12-27T12:13:01.4032245' AS DateTime2), 10, 5, 5, N'COMPLETED', 0)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (31, 1, 2, CAST(N'2025-12-27T10:14:41.9887041' AS DateTime2), CAST(N'2025-12-27T12:14:41.9888643' AS DateTime2), 10, 5, 5, N'COMPLETED', 0)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (32, 1, 2, CAST(N'2025-12-28T09:15:43.1692112' AS DateTime2), CAST(N'2025-12-28T11:15:43.1692275' AS DateTime2), 30, 25, 5, N'COMPLETED', 0)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (33, 1, 2, CAST(N'2025-12-28T09:21:20.5230195' AS DateTime2), CAST(N'2025-12-28T11:21:20.5231291' AS DateTime2), 10, 5, 5, N'COMPLETED', 0)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (34, 1, 2, CAST(N'2025-12-28T09:28:14.9590852' AS DateTime2), CAST(N'2025-12-28T11:28:14.9590894' AS DateTime2), 55, 5, 50, N'COMPLETED', 0)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (35, 1, 2, CAST(N'2025-12-28T09:32:04.7519338' AS DateTime2), CAST(N'2025-12-28T11:32:04.7519364' AS DateTime2), 10, 5, 5, N'COMPLETED', 0)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (36, 1, 2, CAST(N'2025-12-28T10:03:37.9520100' AS DateTime2), CAST(N'2025-12-28T12:03:37.9520139' AS DateTime2), 10, 5, 5, N'COMPLETED', 0)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (37, 1, 2, CAST(N'2025-12-28T10:48:36.6335125' AS DateTime2), CAST(N'2025-12-28T12:48:36.6336211' AS DateTime2), 10, 5, 5, N'COMPLETED', 0)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (38, 1, 2, CAST(N'2025-12-28T10:53:10.6803273' AS DateTime2), CAST(N'2025-12-28T12:53:10.6805003' AS DateTime2), 10, 5, 5, N'COMPLETED', 0)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (39, 1, 2, CAST(N'2025-12-28T12:00:46.9769795' AS DateTime2), CAST(N'2025-12-28T14:00:46.9769815' AS DateTime2), 10, 5, 5, N'COMPLETED', 0)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (40, 1, 2, CAST(N'2025-12-29T03:52:24.3646531' AS DateTime2), CAST(N'2025-12-29T05:52:24.3647696' AS DateTime2), 10, 5, 5, N'COMPLETED', 0)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (41, 1, 2, CAST(N'2025-12-29T12:07:28.8345612' AS DateTime2), CAST(N'2025-12-29T14:07:28.8346751' AS DateTime2), 10, 5, 5, N'COMPLETED', 0)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (42, 1, 2, CAST(N'2025-12-29T12:11:24.4626412' AS DateTime2), CAST(N'2025-12-29T14:11:24.4626433' AS DateTime2), 10, 5, 5, N'COMPLETED', 0)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (43, 2, 2, CAST(N'2025-12-29T12:12:59.4337381' AS DateTime2), CAST(N'2025-12-29T14:12:59.4337402' AS DateTime2), 10, 5, 5, N'COMPLETED', 0)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (44, 1, 2, CAST(N'2025-12-30T04:07:41.4931961' AS DateTime2), CAST(N'2025-12-30T06:07:41.4933905' AS DateTime2), 10, 5, 5, N'COMPLETED', 0)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (45, 1, 2, CAST(N'2025-12-30T04:08:27.2730095' AS DateTime2), CAST(N'2025-12-30T06:08:27.2730114' AS DateTime2), 10, 5, 5, N'COMPLETED', 0)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (46, 1, 2, CAST(N'2025-12-30T04:09:11.5341739' AS DateTime2), CAST(N'2025-12-30T06:09:11.5341759' AS DateTime2), 10, 5, 5, N'COMPLETED', 0)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (47, 1, 2, CAST(N'2025-12-30T04:39:02.3169177' AS DateTime2), CAST(N'2025-12-30T06:39:02.3169208' AS DateTime2), 10, 5, 5, N'COMPLETED', 0)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (48, 1, 2, CAST(N'2025-12-30T12:15:01.5156008' AS DateTime2), CAST(N'2025-12-30T14:15:01.5156501' AS DateTime2), 10, 5, 5, N'COMPLETED', 0)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (49, 1, 2, CAST(N'2025-12-30T12:18:03.7682129' AS DateTime2), CAST(N'2025-12-30T14:18:03.7682154' AS DateTime2), 10, 5, 5, N'COMPLETED', 0)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (50, 1, 2, CAST(N'2025-12-30T12:21:40.3565938' AS DateTime2), CAST(N'2025-12-30T14:21:40.3565960' AS DateTime2), 10, 5, 5, N'COMPLETED', 0)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (51, 1, 2, CAST(N'2025-12-30T12:34:18.9777387' AS DateTime2), CAST(N'2025-12-30T14:34:18.9778225' AS DateTime2), 10, 5, 5, N'COMPLETED', 3)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (52, 1, 2, CAST(N'2025-12-30T12:34:40.1261202' AS DateTime2), CAST(N'2025-12-30T14:34:40.1261230' AS DateTime2), 10, 5, 5, N'COMPLETED', 6)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (53, 1, 2, CAST(N'2025-12-30T12:36:25.9611505' AS DateTime2), CAST(N'2025-12-30T14:36:25.9611523' AS DateTime2), 10, 5, 5, N'COMPLETED', 4)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (54, 1, 2, CAST(N'2025-12-30T12:36:41.2612043' AS DateTime2), CAST(N'2025-12-30T14:36:41.2612062' AS DateTime2), 10, 5, 5, N'COMPLETED', 3)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (55, 1, 2, CAST(N'2025-12-30T13:05:10.3759618' AS DateTime2), CAST(N'2025-12-30T15:05:10.3759647' AS DateTime2), 10, 5, 5, N'COMPLETED', 3)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (56, 1, 2, CAST(N'2025-12-31T05:25:52.6507596' AS DateTime2), CAST(N'2025-12-31T07:25:52.6508603' AS DateTime2), 10, 5, 5, N'COMPLETED', 38)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (57, 1, 2, CAST(N'2025-12-31T05:31:10.9999792' AS DateTime2), CAST(N'2025-12-31T07:31:10.9999817' AS DateTime2), 10, 5, 5, N'COMPLETED', 6)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (58, 1, 2, CAST(N'2025-12-31T05:36:19.4398962' AS DateTime2), CAST(N'2025-12-31T07:36:19.4398985' AS DateTime2), 10, 5, 5, N'COMPLETED', 22)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (59, 1, 2, CAST(N'2025-12-31T05:39:24.3840445' AS DateTime2), CAST(N'2025-12-31T07:39:24.3840464' AS DateTime2), 10, 5, 5, N'COMPLETED', 7)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (60, 1, 2, CAST(N'2025-12-31T05:52:07.7941496' AS DateTime2), CAST(N'2025-12-31T07:52:07.7941527' AS DateTime2), 10, 5, 5, N'COMPLETED', 3)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (61, 1, 2, CAST(N'2025-12-31T06:03:11.9728668' AS DateTime2), CAST(N'2025-12-31T08:03:11.9729751' AS DateTime2), 10, 5, 5, N'COMPLETED', 1)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (62, 1, 2, CAST(N'2025-12-31T06:10:53.1548304' AS DateTime2), CAST(N'2025-12-31T08:10:53.1548332' AS DateTime2), 10, 5, 5, N'COMPLETED', 1)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (63, 1, 2, CAST(N'2025-12-31T06:24:15.7967355' AS DateTime2), CAST(N'2025-12-31T08:24:15.7967381' AS DateTime2), 10, 5, 5, N'COMPLETED', 0)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (64, 1, 2, CAST(N'2025-12-31T06:38:31.5464324' AS DateTime2), CAST(N'2025-12-31T08:38:31.5465430' AS DateTime2), 10, 5, 5, N'COMPLETED', 21)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (65, 1, 2, CAST(N'2025-12-31T07:23:48.6701288' AS DateTime2), CAST(N'2025-12-31T09:23:48.6701310' AS DateTime2), 10, 5, 5, N'COMPLETED', 1)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (66, 1, 2, CAST(N'2025-12-31T10:30:21.1077531' AS DateTime2), CAST(N'2025-12-31T12:30:21.1078668' AS DateTime2), 10, 5, 5, N'COMPLETED', 2)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (67, 1, 2, CAST(N'2025-12-31T10:38:13.0242770' AS DateTime2), CAST(N'2025-12-31T12:38:13.0242796' AS DateTime2), 10, 5, 5, N'COMPLETED', 0)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (68, 1, 2, CAST(N'2026-01-02T10:20:03.5296835' AS DateTime2), CAST(N'2026-01-02T12:20:03.5298015' AS DateTime2), 10, 5, 5, N'COMPLETED', 37)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (69, 1, 2, CAST(N'2026-01-02T13:40:23.9495261' AS DateTime2), CAST(N'2026-01-02T15:40:23.9496414' AS DateTime2), 10, 5, 5, N'COMPLETED', 236)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (70, 1, 2, CAST(N'2026-01-02T13:43:01.0425451' AS DateTime2), CAST(N'2026-01-02T15:43:01.0425477' AS DateTime2), 10, 5, 5, N'COMPLETED', 21)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (71, 1, 2, CAST(N'2026-01-02T13:55:55.6446740' AS DateTime2), CAST(N'2026-01-02T15:55:55.6446774' AS DateTime2), 10, 5, 5, N'COMPLETED', 7)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (72, 1, 2, CAST(N'2026-01-02T13:56:42.4182837' AS DateTime2), CAST(N'2026-01-02T15:56:42.4182858' AS DateTime2), 10, 5, 5, N'COMPLETED', 15)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (73, 1, 2, CAST(N'2026-01-02T14:03:48.1619689' AS DateTime2), CAST(N'2026-01-02T16:03:48.1619715' AS DateTime2), 10, 5, 5, N'COMPLETED', 5)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (74, 1, 2, CAST(N'2026-01-03T04:27:11.5436364' AS DateTime2), CAST(N'2026-01-03T06:27:11.5437501' AS DateTime2), 10, 5, 5, N'COMPLETED', 6559)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (75, 1, 2, CAST(N'2026-01-03T05:01:25.8094901' AS DateTime2), CAST(N'2026-01-03T07:01:25.8094934' AS DateTime2), 10, 5, 5, N'COMPLETED', 2020)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (76, 1, 2, CAST(N'2026-01-03T10:45:11.6754080' AS DateTime2), CAST(N'2026-01-03T12:45:11.6755165' AS DateTime2), 10, 5, 5, N'COMPLETED', 79)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (77, 1, 2, CAST(N'2026-01-03T10:45:54.1308357' AS DateTime2), CAST(N'2026-01-03T12:45:54.1308373' AS DateTime2), 10, 5, 5, N'COMPLETED', 27)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (78, 1, 2, CAST(N'2026-01-03T10:47:56.6175201' AS DateTime2), CAST(N'2026-01-03T12:47:56.6175216' AS DateTime2), 10, 5, 5, N'COMPLETED', 42)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (79, 1, 2, CAST(N'2026-01-03T10:53:53.1181870' AS DateTime2), CAST(N'2026-01-03T12:53:53.1181889' AS DateTime2), 10, 5, 5, N'COMPLETED', 2)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (80, 1, 2, CAST(N'2026-01-03T11:02:50.2995738' AS DateTime2), CAST(N'2026-01-03T13:02:50.2995762' AS DateTime2), 10, 5, 5, N'COMPLETED', 68)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (81, 1, 2, CAST(N'2026-01-03T11:07:41.5607697' AS DateTime2), CAST(N'2026-01-03T13:07:41.5607721' AS DateTime2), 10, 5, 5, N'COMPLETED', 0)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (82, 1, 2, CAST(N'2026-01-03T22:15:46.1459997' AS DateTime2), CAST(N'2026-01-04T00:15:46.1461196' AS DateTime2), 10, 5, 5, N'COMPLETED', 24)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (83, 1, 2, CAST(N'2026-01-03T22:16:06.1705462' AS DateTime2), CAST(N'2026-01-04T00:16:06.1705506' AS DateTime2), 10, 5, 5, N'COMPLETED', 10)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (84, 1, 2, CAST(N'2026-01-03T22:16:38.7169242' AS DateTime2), CAST(N'2026-01-04T00:16:38.7169271' AS DateTime2), 10, 5, 5, N'COMPLETED', 0)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (85, 1, 2, CAST(N'2026-01-04T07:09:34.3041942' AS DateTime2), CAST(N'2026-01-04T09:09:34.3043020' AS DateTime2), 10, 5, 5, N'COMPLETED', 41)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (86, 1, 2, CAST(N'2026-01-06T06:40:48.7888625' AS DateTime2), CAST(N'2026-01-06T08:40:48.7889743' AS DateTime2), 10, 5, 5, N'COMPLETED', 5)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (87, 1, 2, CAST(N'2026-01-06T06:48:24.1277991' AS DateTime2), CAST(N'2026-01-06T08:48:24.1278015' AS DateTime2), 10, 5, 5, N'COMPLETED', 13)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (88, 1, 2, CAST(N'2026-01-06T07:32:46.0287265' AS DateTime2), CAST(N'2026-01-06T09:32:46.0287286' AS DateTime2), 10, 5, 5, N'COMPLETED', 11)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (89, 1, 2, CAST(N'2026-01-07T07:20:06.6017805' AS DateTime2), CAST(N'2026-01-07T09:20:06.6018967' AS DateTime2), 10, 5, 5, N'COMPLETED', 1)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (90, 1, 2, CAST(N'2026-01-07T12:25:29.6728284' AS DateTime2), CAST(N'2026-01-07T14:25:29.6728312' AS DateTime2), 10, 5, 5, N'COMPLETED', 2)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (91, 1, 2, CAST(N'2026-01-10T02:37:49.5717124' AS DateTime2), CAST(N'2026-01-10T04:37:49.5718230' AS DateTime2), 10, 5, 5, N'COMPLETED', 1)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (92, 1, 2, CAST(N'2026-01-10T02:47:50.7634042' AS DateTime2), CAST(N'2026-01-10T04:47:50.7635152' AS DateTime2), 10, 5, 5, N'COMPLETED', 5)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (93, 1, 2, CAST(N'2026-01-10T07:58:21.5579667' AS DateTime2), CAST(N'2026-01-10T09:58:21.5579804' AS DateTime2), 10, 5, 5, N'COMPLETED', 51)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (94, 1, 2, CAST(N'2026-01-10T08:12:33.5361600' AS DateTime2), CAST(N'2026-01-10T10:12:33.5361622' AS DateTime2), 10, 5, 5, N'COMPLETED', 2)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (95, 1, 2, CAST(N'2026-01-11T06:54:30.0374923' AS DateTime2), CAST(N'2026-01-11T08:54:30.0375893' AS DateTime2), 10, 5, 5, N'COMPLETED', 7200)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (96, 1, 4, CAST(N'2026-01-16T05:20:46.3337087' AS DateTime2), CAST(N'2026-01-16T07:20:46.3338233' AS DateTime2), 0, NULL, NULL, N'COMPLETED', 108)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (97, 4, 4, CAST(N'2026-01-16T05:41:04.6048739' AS DateTime2), CAST(N'2026-01-16T07:41:04.6050222' AS DateTime2), 10, 5, 5, N'COMPLETED', 0)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (98, 1, 4, CAST(N'2026-01-16T05:41:46.8288225' AS DateTime2), CAST(N'2026-01-16T07:41:46.8288247' AS DateTime2), 0, NULL, NULL, N'COMPLETED', 0)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (99, 1, 4, CAST(N'2026-01-16T05:42:39.0555821' AS DateTime2), CAST(N'2026-01-16T07:42:39.0555840' AS DateTime2), 10, 5, 5, N'COMPLETED', 0)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (100, 1, 4, CAST(N'2026-01-16T05:43:06.7808843' AS DateTime2), CAST(N'2026-01-16T07:43:06.7808864' AS DateTime2), 10, 5, 5, N'COMPLETED', 24)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (101, 1, 4, CAST(N'2026-01-16T05:43:43.2345307' AS DateTime2), CAST(N'2026-01-16T07:43:43.2345335' AS DateTime2), 0, NULL, NULL, N'COMPLETED', 0)
GO
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (102, 1, 4, CAST(N'2026-01-16T05:43:50.4331248' AS DateTime2), CAST(N'2026-01-16T07:43:50.4331279' AS DateTime2), 0, NULL, NULL, N'COMPLETED', 2)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (103, 1, 4, CAST(N'2026-01-16T05:43:53.1806336' AS DateTime2), CAST(N'2026-01-16T07:43:53.1806357' AS DateTime2), 0, NULL, NULL, N'COMPLETED', 4)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (104, 1, 4, CAST(N'2026-01-19T04:28:39.4485469' AS DateTime2), CAST(N'2026-01-19T06:28:39.4486850' AS DateTime2), 0, NULL, NULL, N'COMPLETED', 7)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (105, 1, 4, CAST(N'2026-01-19T04:30:24.7132161' AS DateTime2), CAST(N'2026-01-19T06:30:24.7132182' AS DateTime2), 10, 5, 5, N'COMPLETED', 2)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (106, 1, 2, CAST(N'2026-01-19T04:39:56.8090567' AS DateTime2), CAST(N'2026-01-19T06:39:56.8090592' AS DateTime2), 10, 5, 5, N'COMPLETED', 2)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (107, 1, 2, CAST(N'2026-01-19T04:46:24.4111915' AS DateTime2), CAST(N'2026-01-19T06:46:24.4111940' AS DateTime2), 10, 5, 5, N'COMPLETED', 15)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (108, 1, 4, CAST(N'2026-01-21T00:25:41.4911666' AS DateTime2), CAST(N'2026-01-21T02:25:41.4912810' AS DateTime2), 10, 5, 5, N'COMPLETED', 1)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (109, 1, 4, CAST(N'2026-01-21T00:26:16.6144421' AS DateTime2), CAST(N'2026-01-21T02:26:16.6144444' AS DateTime2), 0, NULL, NULL, N'COMPLETED', 1)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (110, 1, 4, CAST(N'2026-01-21T00:28:47.0206404' AS DateTime2), CAST(N'2026-01-21T02:28:47.0206428' AS DateTime2), 0, NULL, NULL, N'COMPLETED', 4)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (111, 1, 4, CAST(N'2026-01-21T00:29:20.6564813' AS DateTime2), CAST(N'2026-01-21T02:29:20.6566466' AS DateTime2), 0, NULL, NULL, N'COMPLETED', 21)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (112, 1, 4, CAST(N'2026-01-21T00:29:37.7153762' AS DateTime2), CAST(N'2026-01-21T02:29:37.7153776' AS DateTime2), 0, NULL, NULL, N'COMPLETED', 1)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (113, 1, 4, CAST(N'2026-01-21T00:30:04.9882157' AS DateTime2), CAST(N'2026-01-21T02:30:04.9882172' AS DateTime2), 10, 5, 5, N'COMPLETED', 1)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (114, 1, 4, CAST(N'2026-01-21T00:31:08.6533624' AS DateTime2), CAST(N'2026-01-21T02:31:08.6533668' AS DateTime2), 0, NULL, NULL, N'COMPLETED', 2)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (115, 1, 4, CAST(N'2026-01-21T00:32:07.5156151' AS DateTime2), CAST(N'2026-01-21T02:32:07.5156199' AS DateTime2), 0, NULL, NULL, N'COMPLETED', 0)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (116, 1, 4, CAST(N'2026-01-21T00:33:06.6159646' AS DateTime2), CAST(N'2026-01-21T02:33:06.6161262' AS DateTime2), 0, NULL, NULL, N'COMPLETED', 3)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (117, 1, 4, CAST(N'2026-01-21T00:40:13.1620854' AS DateTime2), CAST(N'2026-01-21T02:40:13.1621875' AS DateTime2), 0, NULL, NULL, N'COMPLETED', 3)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (118, 1, 4, CAST(N'2026-01-21T00:40:28.4128273' AS DateTime2), CAST(N'2026-01-21T02:40:28.4128291' AS DateTime2), 0, NULL, NULL, N'COMPLETED', 9)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (119, 1, 4, CAST(N'2026-01-21T00:40:46.6181160' AS DateTime2), CAST(N'2026-01-21T02:40:46.6181179' AS DateTime2), 0, NULL, NULL, N'COMPLETED', 25)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (120, 1, 4, CAST(N'2026-01-21T00:47:12.5455231' AS DateTime2), CAST(N'2026-01-21T02:47:12.5455252' AS DateTime2), 0, NULL, NULL, N'COMPLETED', 5)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (121, 1, 4, CAST(N'2026-01-28T00:29:18.6271756' AS DateTime2), CAST(N'2026-01-28T02:29:18.6272844' AS DateTime2), 0, NULL, NULL, N'COMPLETED', 1)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (122, 1, 4, CAST(N'2026-01-28T00:30:08.3199823' AS DateTime2), CAST(N'2026-01-28T02:30:08.3199848' AS DateTime2), 10, 5, 5, N'COMPLETED', 2)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (123, 1, 4, CAST(N'2026-01-28T00:30:51.3398982' AS DateTime2), CAST(N'2026-01-28T02:30:51.3399000' AS DateTime2), 10, 5, 5, N'COMPLETED', 0)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (124, 1, 4, CAST(N'2026-01-28T00:39:39.7037819' AS DateTime2), CAST(N'2026-01-28T02:39:39.7039307' AS DateTime2), 10, 5, 5, N'COMPLETED', 1)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (125, 1, 4, CAST(N'2026-01-28T00:41:37.5200261' AS DateTime2), CAST(N'2026-01-28T02:41:37.5200292' AS DateTime2), 10, 5, 5, N'COMPLETED', 0)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (126, 1, 3, CAST(N'2026-01-28T00:43:39.6455599' AS DateTime2), CAST(N'2026-01-28T02:43:39.6455619' AS DateTime2), 10, 5, 5, N'COMPLETED', 6)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (127, 1, 4, CAST(N'2026-01-28T05:17:08.0101785' AS DateTime2), CAST(N'2026-01-28T07:17:08.0102996' AS DateTime2), 0, NULL, NULL, N'COMPLETED', 124)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (128, 1, 4, CAST(N'2026-01-28T05:18:34.8229314' AS DateTime2), CAST(N'2026-01-28T07:18:34.8229349' AS DateTime2), 10, 5, 5, N'COMPLETED', 2)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (129, 1, 4, CAST(N'2026-01-28T05:19:46.6847879' AS DateTime2), CAST(N'2026-01-28T07:19:46.6849147' AS DateTime2), 0, NULL, NULL, N'COMPLETED', 1)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (130, 1, 4, CAST(N'2026-01-28T05:20:00.9099205' AS DateTime2), CAST(N'2026-01-28T07:20:00.9099229' AS DateTime2), 0, NULL, NULL, N'COMPLETED', 6)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (131, 1, 4, CAST(N'2026-01-28T05:21:05.9995416' AS DateTime2), CAST(N'2026-01-28T07:21:05.9995441' AS DateTime2), 55, 50, 5, N'COMPLETED', 54)
INSERT [dbo].[TestAttempts] ([Id], [UserId], [TestId], [StartedAt], [CompletedAt], [TotalScore], [ListeningScore], [ReadingScore], [Status], [TimeTaken]) VALUES (132, 1, 3, CAST(N'2026-01-28T05:21:34.4043170' AS DateTime2), CAST(N'2026-01-28T07:21:34.4043195' AS DateTime2), 10, 5, 5, N'COMPLETED', 9)
SET IDENTITY_INSERT [dbo].[TestAttempts] OFF
GO
SET IDENTITY_INSERT [dbo].[Tests] ON 

INSERT [dbo].[Tests] ([Id], [Title], [Slug], [Type], [Duration], [TotalQuestions], [TotalParticipants], [IsActive], [CreatedAt]) VALUES (2, N'ETS 2024 Test 2', N'ets-2024-test-2', N'FULL_TEST', 120, 200, 0, 1, CAST(N'2025-12-20T18:33:37.6571815' AS DateTime2))
INSERT [dbo].[Tests] ([Id], [Title], [Slug], [Type], [Duration], [TotalQuestions], [TotalParticipants], [IsActive], [CreatedAt]) VALUES (3, N'ETS 2024 Test 1', N'ets-2024-test-1', N'FULL_TEST', 120, 200, 0, 1, CAST(N'2026-01-07T23:36:07.7502746' AS DateTime2))
INSERT [dbo].[Tests] ([Id], [Title], [Slug], [Type], [Duration], [TotalQuestions], [TotalParticipants], [IsActive], [CreatedAt]) VALUES (4, N'ETS 2024 Test 4', N'ets-2024-test-4', N'FULL_TEST', 120, 200, 0, 1, CAST(N'2026-01-07T23:39:52.1178504' AS DateTime2))
SET IDENTITY_INSERT [dbo].[Tests] OFF
GO
SET IDENTITY_INSERT [dbo].[Topics] ON 

INSERT [dbo].[Topics] ([Id], [Title], [Description], [ImageUrl], [Level], [LevelRange]) VALUES (1, N'Contracts', N'FileText - H?p d?ng & Ði?u kho?n', NULL, N'Intermediate', N'450-700')
INSERT [dbo].[Topics] ([Id], [Title], [Description], [ImageUrl], [Level], [LevelRange]) VALUES (2, N'Marketing', N'Megaphone - Ti?p th? & Qu?ng cáo', NULL, N'Intermediate', N'450-700')
INSERT [dbo].[Topics] ([Id], [Title], [Description], [ImageUrl], [Level], [LevelRange]) VALUES (3, N'Warranties', N'CheckCircle - B?o hành & Cam k?t', NULL, N'Advanced', N'700-990')
INSERT [dbo].[Topics] ([Id], [Title], [Description], [ImageUrl], [Level], [LevelRange]) VALUES (4, N'Business Planning', N'BarChart3 - L?p k? ho?ch', NULL, N'Intermediate', N'450-700')
INSERT [dbo].[Topics] ([Id], [Title], [Description], [ImageUrl], [Level], [LevelRange]) VALUES (5, N'Conferences', N'Mic2 - H?i th?o & S? ki?n', NULL, N'Basic', N'0-450')
INSERT [dbo].[Topics] ([Id], [Title], [Description], [ImageUrl], [Level], [LevelRange]) VALUES (6, N'Travel & Tourism', N'Plane - Du l?ch & Khách s?n', NULL, N'Basic', N'0-450')
INSERT [dbo].[Topics] ([Id], [Title], [Description], [ImageUrl], [Level], [LevelRange]) VALUES (7, N'Banking & Finance', N'DollarSign - Ngân hàng & Tài chính', NULL, N'Intermediate', N'450-700')
INSERT [dbo].[Topics] ([Id], [Title], [Description], [ImageUrl], [Level], [LevelRange]) VALUES (8, N'Office & Management', N'Building2 - Van phòng & Qu?n lý', NULL, N'Intermediate', N'450-700')
INSERT [dbo].[Topics] ([Id], [Title], [Description], [ImageUrl], [Level], [LevelRange]) VALUES (9, N'Hiring & HR', N'Users - Tuy?n d?ng & Nhân s?', NULL, N'Advanced', N'700-990')
INSERT [dbo].[Topics] ([Id], [Title], [Description], [ImageUrl], [Level], [LevelRange]) VALUES (10, N'Meetings & Presentations', N'Presentation - H?p & Thuy?t trình', NULL, N'Basic', N'0-450')
SET IDENTITY_INSERT [dbo].[Topics] OFF
GO
SET IDENTITY_INSERT [dbo].[UserAnswers] ON 

INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (2, 2, 71, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (3, 2, 72, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (4, 2, 74, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (5, 2, 75, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (6, 2, 76, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (7, 2, 77, N'C', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (8, 2, 78, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (23, 4, 71, N'D', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (24, 4, 73, N'D', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (25, 4, 76, N'B', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (26, 4, 101, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (27, 4, 102, N'D', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (28, 4, 103, N'B', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (35, 5, 71, N'B', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (36, 5, 72, N'B', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (37, 5, 73, N'B', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (38, 5, 74, N'B', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (39, 5, 76, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (40, 5, 101, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (41, 5, 102, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (42, 5, 103, N'A', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (43, 5, 104, N'C', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (58, 6, 71, N'B', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (59, 6, 72, N'B', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (60, 6, 73, N'B', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (61, 6, 75, N'B', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (62, 6, 76, N'B', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (63, 6, 101, N'B', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (64, 6, 102, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (65, 6, 103, N'B', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (66, 6, 104, N'B', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (92, 15, 71, N'B', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (93, 15, 72, N'D', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (94, 15, 73, N'C', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (95, 15, 74, N'B', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (96, 15, 75, N'D', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (97, 15, 76, N'D', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (98, 15, 77, N'A', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (99, 15, 78, N'D', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (100, 15, 79, N'A', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (101, 15, 80, N'B', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (102, 16, 71, N'B', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (103, 16, 72, N'D', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (104, 16, 73, N'C', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (105, 16, 74, N'B', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (106, 16, 75, N'D', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (122, 20, 71, N'B', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (123, 20, 72, N'D', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (124, 20, 73, N'C', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (125, 20, 74, N'B', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (126, 20, 75, N'D', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (127, 20, 76, N'D', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (128, 20, 77, N'A', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (129, 20, 78, N'D', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (130, 20, 79, N'A', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (131, 20, 80, N'B', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (132, 21, 71, N'B', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (133, 21, 72, N'D', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (134, 21, 73, N'C', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (135, 21, 74, N'B', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (136, 21, 75, N'D', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (137, 21, 76, N'D', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (138, 21, 77, N'A', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (139, 21, 78, N'D', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (140, 21, 79, N'A', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (141, 21, 80, N'B', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (142, 22, 71, N'B', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (143, 22, 72, N'D', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (144, 22, 73, N'C', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (145, 22, 75, N'B', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (146, 22, 76, N'D', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (147, 22, 77, N'D', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (148, 22, 78, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (149, 22, 79, N'D', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (150, 22, 80, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (151, 22, 81, N'B', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (184, 27, 71, N'B', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (185, 27, 72, N'D', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (186, 27, 73, N'C', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (187, 27, 74, N'B', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (188, 27, 75, N'D', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (189, 27, 76, N'D', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (190, 27, 77, N'A', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (191, 27, 78, N'D', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (192, 27, 79, N'A', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (193, 27, 80, N'B', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (194, 28, 71, N'B', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (195, 28, 72, N'D', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (196, 28, 73, N'C', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (197, 28, 74, N'B', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (198, 28, 76, N'D', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (199, 28, 77, N'D', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (200, 28, 78, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (201, 28, 79, N'D', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (202, 28, 80, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (203, 28, 81, N'B', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (204, 29, 71, N'B', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (205, 29, 72, N'D', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (206, 29, 73, N'C', 1, NULL, NULL)
GO
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (207, 29, 74, N'B', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (208, 29, 75, N'D', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (209, 29, 76, N'D', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (210, 29, 77, N'A', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (211, 29, 78, N'D', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (212, 29, 79, N'A', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (213, 29, 80, N'B', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (214, 30, 71, N'B', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (215, 30, 72, N'D', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (216, 30, 73, N'C', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (217, 30, 74, N'B', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (218, 30, 75, N'D', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (219, 30, 76, N'D', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (220, 30, 77, N'A', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (221, 30, 78, N'D', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (222, 30, 79, N'A', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (223, 30, 80, N'B', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (224, 31, 72, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (235, 33, 71, N'B', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (236, 33, 72, N'D', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (237, 33, 73, N'C', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (238, 33, 74, N'B', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (239, 33, 75, N'D', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (240, 33, 76, N'D', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (241, 33, 77, N'A', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (242, 33, 78, N'D', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (243, 33, 79, N'A', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (244, 33, 80, N'B', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (245, 34, 71, N'B', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (246, 34, 72, N'D', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (247, 34, 73, N'C', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (248, 34, 74, N'B', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (249, 34, 75, N'D', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (250, 34, 76, N'D', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (251, 34, 77, N'A', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (252, 34, 78, N'D', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (253, 34, 79, N'A', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (254, 34, 80, N'B', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (255, 34, 81, N'A', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (256, 34, 82, N'B', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (257, 34, 83, N'A', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (258, 34, 84, N'C', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (259, 34, 85, N'D', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (260, 34, 86, N'C', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (261, 34, 87, N'D', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (262, 34, 88, N'B', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (263, 34, 89, N'A', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (264, 34, 90, N'A', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (265, 34, 91, N'D', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (266, 34, 92, N'A', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (267, 34, 93, N'B', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (268, 34, 94, N'A', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (269, 34, 95, N'D', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (318, 47, 604, N'A', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (319, 55, 604, N'C', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (320, 56, 330, N'D', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (321, 56, 331, N'B', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (322, 56, 332, N'B', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (323, 56, 334, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (324, 56, 468, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (325, 56, 469, N'C', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (326, 56, 470, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (327, 56, 471, N'C', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (328, 56, 472, N'D', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (329, 56, 473, N'D', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (330, 56, 474, N'A', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (331, 56, 475, N'B', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (332, 56, 476, N'B', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (333, 56, 610, N'C', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (334, 57, 513, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (335, 57, 514, N'B', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (336, 58, 604, N'A', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (337, 58, 605, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (338, 58, 606, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (339, 58, 607, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (340, 58, 608, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (341, 58, 609, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (342, 58, 610, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (343, 58, 611, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (344, 58, 612, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (345, 58, 613, N'A', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (346, 58, 614, N'B', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (347, 58, 615, N'B', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (348, 58, 616, N'B', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (349, 58, 617, N'B', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (350, 58, 618, N'B', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (351, 58, 619, N'B', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (352, 58, 620, N'B', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (353, 58, 621, N'B', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (354, 58, 622, N'B', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (355, 58, 623, N'B', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (356, 58, 674, N'B', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (357, 58, 675, N'B', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (358, 58, 676, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (359, 59, 604, N'A', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (360, 59, 605, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (361, 59, 606, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (362, 59, 607, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (363, 59, 608, N'C', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (364, 60, 604, N'A', 1, NULL, NULL)
GO
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (365, 64, 341, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (366, 64, 342, N'C', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (367, 64, 343, N'C', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (368, 64, 344, N'D', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (369, 64, 345, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (370, 64, 346, N'A', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (371, 64, 604, N'A', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (372, 64, 605, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (373, 64, 606, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (374, 64, 607, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (375, 64, 608, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (376, 64, 609, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (377, 64, 610, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (378, 64, 611, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (379, 64, 612, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (380, 64, 613, N'A', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (381, 64, 615, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (382, 64, 616, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (383, 64, 618, N'A', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (384, 64, 619, N'A', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (385, 64, 620, N'A', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (386, 65, 604, N'A', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (387, 66, 604, N'A', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (388, 68, 71, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (389, 68, 72, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (390, 68, 73, N'C', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (391, 68, 102, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (392, 68, 103, N'C', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (393, 68, 104, N'D', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (394, 68, 330, N'D', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (395, 68, 331, N'C', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (396, 68, 494, N'C', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (397, 68, 495, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (398, 68, 496, N'B', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (399, 68, 497, N'C', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (400, 68, 604, N'A', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (401, 68, 605, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (402, 68, 610, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (403, 68, 611, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (404, 68, 612, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (405, 68, 674, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (406, 68, 675, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (407, 68, 676, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (408, 68, 677, N'A', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (409, 69, 100, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (410, 70, 604, N'A', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (411, 70, 607, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (412, 70, 608, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (413, 74, 71, N'C', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (414, 74, 330, N'B', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (415, 74, 604, N'B', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (416, 74, 605, N'B', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (417, 74, 606, N'C', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (418, 74, 609, N'B', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (419, 74, 613, N'C', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (420, 74, 620, N'C', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (421, 74, 621, N'C', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (422, 74, 622, N'C', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (423, 74, 623, N'B', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (424, 74, 634, N'C', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (425, 74, 674, N'B', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (426, 74, 675, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (427, 74, 676, N'B', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (428, 74, 677, N'A', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (429, 74, 678, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (430, 74, 679, N'D', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (431, 74, 680, N'A', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (432, 74, 681, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (433, 74, 682, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (434, 74, 686, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (435, 75, 71, N'C', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (436, 75, 72, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (437, 75, 74, N'C', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (438, 75, 76, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (439, 75, 78, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (440, 75, 81, N'A', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (441, 75, 83, N'C', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (442, 75, 85, N'C', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (443, 75, 89, N'C', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (444, 75, 101, N'D', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (445, 75, 102, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (446, 75, 103, N'A', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (447, 75, 108, N'D', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (448, 75, 115, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (449, 75, 330, N'B', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (450, 75, 332, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (451, 75, 333, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (452, 75, 348, N'A', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (453, 75, 468, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (454, 75, 474, N'A', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (455, 75, 481, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (456, 75, 604, N'A', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (457, 75, 606, N'D', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (458, 75, 609, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (459, 75, 610, N'B', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (460, 75, 634, N'C', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (461, 75, 674, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (462, 75, 675, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (463, 75, 677, N'B', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (464, 75, 684, N'A', 0, NULL, NULL)
GO
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (465, 75, 694, N'A', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (466, 75, 695, N'A', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (467, 75, 711, N'C', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (468, 75, 712, N'D', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (469, 76, 604, N'A', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (470, 79, 604, N'A', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (471, 82, 71, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (472, 82, 77, N'C', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (473, 82, 505, N'B', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (474, 82, 606, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (475, 83, 604, N'A', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (476, 83, 605, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (477, 83, 606, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (478, 83, 607, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (479, 83, 608, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (480, 83, 609, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (481, 83, 610, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (482, 85, 106, N'C', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (483, 85, 107, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (484, 85, 108, N'B', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (485, 85, 109, N'B', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (486, 85, 110, N'C', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (487, 85, 111, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (488, 85, 112, N'B', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (489, 85, 113, N'B', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (490, 85, 114, N'B', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (491, 85, 115, N'C', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (492, 85, 116, N'D', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (493, 85, 468, N'D', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (494, 85, 469, N'D', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (495, 85, 470, N'C', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (496, 85, 607, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (497, 87, 604, N'A', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (498, 88, 494, N'D', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (499, 88, 521, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (500, 89, 604, N'A', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (501, 89, 605, N'C', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (502, 89, 606, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (503, 89, 607, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (504, 92, 690, N'D', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (505, 95, 674, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (508, 100, 1405, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (509, 100, 1406, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (510, 100, 1407, N'A', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (511, 100, 1408, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (512, 100, 1409, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (513, 100, 1410, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (518, 107, 604, N'A', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (519, 107, 605, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (520, 107, 606, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (521, 107, 607, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (522, 107, 608, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (523, 107, 609, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (524, 107, 610, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (525, 107, 611, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (526, 107, 612, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (527, 107, 613, N'A', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (540, 122, 1444, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (541, 122, 1445, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (542, 126, 737, N'A', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (543, 126, 738, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (544, 126, 739, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (545, 126, 740, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (546, 126, 754, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (547, 126, 755, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (549, 128, 1444, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (550, 128, 1445, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (553, 131, 1405, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (554, 131, 1406, N'B', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (555, 131, 1407, N'A', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (556, 131, 1408, N'D', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (557, 131, 1409, N'C', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (558, 131, 1410, N'D', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (559, 131, 1411, N'C', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (560, 131, 1412, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (561, 131, 1413, N'C', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (562, 131, 1414, N'B', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (563, 131, 1415, N'C', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (564, 131, 1416, N'C', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (565, 131, 1417, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (566, 131, 1418, N'C', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (567, 131, 1419, N'B', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (568, 131, 1420, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (569, 131, 1421, N'B', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (570, 131, 1422, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (571, 131, 1423, N'B', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (572, 131, 1424, N'B', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (573, 131, 1425, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (574, 131, 1426, N'B', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (575, 131, 1427, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (576, 131, 1428, N'C', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (577, 131, 1429, N'B', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (578, 131, 1430, N'C', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (579, 131, 1431, N'B', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (580, 131, 1432, N'C', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (581, 131, 1433, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (582, 131, 1434, N'B', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (583, 131, 1435, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (584, 131, 1436, N'B', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (585, 131, 1437, N'B', 1, NULL, NULL)
GO
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (586, 131, 1438, N'A', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (587, 131, 1439, N'D', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (588, 131, 1440, N'B', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (589, 131, 1441, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (590, 131, 1442, N'B', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (591, 131, 1443, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (592, 131, 1444, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (593, 131, 1445, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (594, 131, 1446, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (595, 131, 1447, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (596, 131, 1448, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (597, 131, 1449, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (598, 131, 1450, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (599, 131, 1451, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (600, 131, 1452, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (601, 131, 1453, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (602, 132, 737, N'A', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (603, 132, 738, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (604, 132, 739, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (605, 132, 740, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (606, 132, 741, N'A', 0, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (607, 132, 742, N'C', 1, NULL, NULL)
INSERT [dbo].[UserAnswers] ([Id], [AttemptId], [QuestionId], [SelectedOption], [IsCorrect], [TextResponse], [AudioResponseUrl]) VALUES (608, 132, 743, N'A', 0, NULL, NULL)
SET IDENTITY_INSERT [dbo].[UserAnswers] OFF
GO
SET IDENTITY_INSERT [dbo].[Users] ON 

INSERT [dbo].[Users] ([Id], [FullName], [Email], [PasswordHash], [AvatarUrl], [Balance], [IsPremium], [PremiumExpiredAt], [CreatedAt], [LastLoginAt], [RefreshToken], [RefreshTokenExpiryTime], [IsActive], [Role], [OtpCode], [OtpExpiryTime]) VALUES (1, N'Thanh Bo', N'thanhbo@gmail.com', N'$2a$11$FCDbcxkovqO9plYfc2ZykeBlo9QrIUm4e10xoezBJ1mCheSe1QSdO', NULL, CAST(0.00 AS Decimal(18, 2)), 0, NULL, CAST(N'2025-12-20T11:46:23.5889651' AS DateTime2), NULL, N'Dz3iPHYVv/IQZzVfVmjJmTKwcb+q1ID7R6yLmmY+c28=', CAST(N'2026-03-15T07:26:08.5440422' AS DateTime2), 0, N'Admin', NULL, NULL)
INSERT [dbo].[Users] ([Id], [FullName], [Email], [PasswordHash], [AvatarUrl], [Balance], [IsPremium], [PremiumExpiredAt], [CreatedAt], [LastLoginAt], [RefreshToken], [RefreshTokenExpiryTime], [IsActive], [Role], [OtpCode], [OtpExpiryTime]) VALUES (2, N'Nguyễn Văn Thành', N'xuanpq359@gmail.com', N'$2a$11$WGI4YSNURLxvYe.9O42WYO4lhl0cxBJo9NbRN9I2gk1Ue.9Il0F82', N'https://lh3.googleusercontent.com/a/ACg8ocKaBYaacqLc6Ew4qV8Kf-JolBhsdhcwYPKVE3f2JFFe0RnaraWb=s96-c', CAST(0.00 AS Decimal(18, 2)), 0, NULL, CAST(N'2025-12-29T15:15:36.6070000' AS DateTime2), NULL, N'gRzIvi30X2zfrGHsLhlbbRwqt+05BTiHLN4ssU4Gfu4=', CAST(N'2026-01-05T10:00:56.9781063' AS DateTime2), 0, N'User', NULL, NULL)
INSERT [dbo].[Users] ([Id], [FullName], [Email], [PasswordHash], [AvatarUrl], [Balance], [IsPremium], [PremiumExpiredAt], [CreatedAt], [LastLoginAt], [RefreshToken], [RefreshTokenExpiryTime], [IsActive], [Role], [OtpCode], [OtpExpiryTime]) VALUES (3, N'Thanh Bo', N'thanhbo260925@gmail.com', N'', N'https://lh3.googleusercontent.com/a/ACg8ocIvzQfks92gPsnsbO_D-OwdPpiJTNbXLcR-c_Adp4GAAQULiAc=s96-c', CAST(0.00 AS Decimal(18, 2)), 0, NULL, CAST(N'2025-12-29T15:31:17.0130000' AS DateTime2), NULL, NULL, NULL, 0, N'User', NULL, NULL)
INSERT [dbo].[Users] ([Id], [FullName], [Email], [PasswordHash], [AvatarUrl], [Balance], [IsPremium], [PremiumExpiredAt], [CreatedAt], [LastLoginAt], [RefreshToken], [RefreshTokenExpiryTime], [IsActive], [Role], [OtpCode], [OtpExpiryTime]) VALUES (4, N'Nguyen Thanh', N'thanhbo26092005@gmail.com', N'', N'https://lh3.googleusercontent.com/a/ACg8ocISKkGYe128r2aWW8_CH7xYqMCqwORZygXIYuUDY363I6tq1yc=s96-c', CAST(0.00 AS Decimal(18, 2)), 0, NULL, CAST(N'2025-12-29T15:34:45.0730000' AS DateTime2), NULL, NULL, NULL, 0, N'User', NULL, NULL)
SET IDENTITY_INSERT [dbo].[Users] OFF
GO
SET IDENTITY_INSERT [dbo].[UserVocabularies] ON 

INSERT [dbo].[UserVocabularies] ([Id], [UserId], [VocabularyId], [Status], [CorrectStreak], [ReviewCount], [NextReviewAt], [LastReviewedAt], [CreatedAt], [Level]) VALUES (12, 1, 80, 1, 0, 25, CAST(N'2026-01-24T05:03:46.4123663' AS DateTime2), CAST(N'2026-01-10T05:03:46.3481779' AS DateTime2), CAST(N'2026-01-04T08:42:37.5358832' AS DateTime2), 4)
INSERT [dbo].[UserVocabularies] ([Id], [UserId], [VocabularyId], [Status], [CorrectStreak], [ReviewCount], [NextReviewAt], [LastReviewedAt], [CreatedAt], [Level]) VALUES (14, 1, 82, 3, 0, 7, CAST(N'2026-01-24T05:03:46.4129635' AS DateTime2), CAST(N'2026-01-10T05:03:46.3481779' AS DateTime2), CAST(N'2026-01-04T08:42:39.4833274' AS DateTime2), 4)
INSERT [dbo].[UserVocabularies] ([Id], [UserId], [VocabularyId], [Status], [CorrectStreak], [ReviewCount], [NextReviewAt], [LastReviewedAt], [CreatedAt], [Level]) VALUES (15, 1, 83, 1, 0, 7, CAST(N'2026-01-24T05:03:46.4129651' AS DateTime2), CAST(N'2026-01-10T05:03:46.3481779' AS DateTime2), CAST(N'2026-01-04T08:42:40.1354530' AS DateTime2), 4)
INSERT [dbo].[UserVocabularies] ([Id], [UserId], [VocabularyId], [Status], [CorrectStreak], [ReviewCount], [NextReviewAt], [LastReviewedAt], [CreatedAt], [Level]) VALUES (16, 1, 84, 1, 0, 7, CAST(N'2026-01-24T05:03:46.4129655' AS DateTime2), CAST(N'2026-01-10T05:03:46.3481779' AS DateTime2), CAST(N'2026-01-04T08:42:41.3367353' AS DateTime2), 4)
INSERT [dbo].[UserVocabularies] ([Id], [UserId], [VocabularyId], [Status], [CorrectStreak], [ReviewCount], [NextReviewAt], [LastReviewedAt], [CreatedAt], [Level]) VALUES (17, 1, 85, 1, 0, 7, CAST(N'2026-01-24T05:03:46.4129659' AS DateTime2), CAST(N'2026-01-10T05:03:46.3481779' AS DateTime2), CAST(N'2026-01-04T08:42:41.9406958' AS DateTime2), 4)
INSERT [dbo].[UserVocabularies] ([Id], [UserId], [VocabularyId], [Status], [CorrectStreak], [ReviewCount], [NextReviewAt], [LastReviewedAt], [CreatedAt], [Level]) VALUES (18, 1, 86, 3, 0, 7, CAST(N'2026-01-24T05:03:46.4129664' AS DateTime2), CAST(N'2026-01-10T05:03:46.3481779' AS DateTime2), CAST(N'2026-01-04T08:42:43.8970566' AS DateTime2), 4)
INSERT [dbo].[UserVocabularies] ([Id], [UserId], [VocabularyId], [Status], [CorrectStreak], [ReviewCount], [NextReviewAt], [LastReviewedAt], [CreatedAt], [Level]) VALUES (19, 1, 87, 3, 0, 7, CAST(N'2026-01-24T05:03:46.4129668' AS DateTime2), CAST(N'2026-01-10T05:03:46.3481779' AS DateTime2), CAST(N'2026-01-04T08:42:44.7282403' AS DateTime2), 4)
INSERT [dbo].[UserVocabularies] ([Id], [UserId], [VocabularyId], [Status], [CorrectStreak], [ReviewCount], [NextReviewAt], [LastReviewedAt], [CreatedAt], [Level]) VALUES (20, 1, 88, 3, 0, 7, CAST(N'2026-01-24T05:03:46.4129670' AS DateTime2), CAST(N'2026-01-10T05:03:46.3481779' AS DateTime2), CAST(N'2026-01-04T08:42:45.1562609' AS DateTime2), 4)
INSERT [dbo].[UserVocabularies] ([Id], [UserId], [VocabularyId], [Status], [CorrectStreak], [ReviewCount], [NextReviewAt], [LastReviewedAt], [CreatedAt], [Level]) VALUES (21, 1, 89, 3, 0, 7, CAST(N'2026-01-24T05:03:46.4129674' AS DateTime2), CAST(N'2026-01-10T05:03:46.3481779' AS DateTime2), CAST(N'2026-01-04T08:42:45.6258421' AS DateTime2), 4)
INSERT [dbo].[UserVocabularies] ([Id], [UserId], [VocabularyId], [Status], [CorrectStreak], [ReviewCount], [NextReviewAt], [LastReviewedAt], [CreatedAt], [Level]) VALUES (22, 1, 90, 3, 0, 7, CAST(N'2026-01-24T05:03:46.4129676' AS DateTime2), CAST(N'2026-01-10T05:03:46.3481779' AS DateTime2), CAST(N'2026-01-04T08:42:46.1701215' AS DateTime2), 4)
INSERT [dbo].[UserVocabularies] ([Id], [UserId], [VocabularyId], [Status], [CorrectStreak], [ReviewCount], [NextReviewAt], [LastReviewedAt], [CreatedAt], [Level]) VALUES (23, 1, 68, 3, 0, 0, CAST(N'2026-02-05T12:45:52.7401622' AS DateTime2), CAST(N'2026-01-06T12:45:52.7401618' AS DateTime2), CAST(N'2026-01-04T09:43:48.2607032' AS DateTime2), 0)
INSERT [dbo].[UserVocabularies] ([Id], [UserId], [VocabularyId], [Status], [CorrectStreak], [ReviewCount], [NextReviewAt], [LastReviewedAt], [CreatedAt], [Level]) VALUES (24, 1, 81, 1, 0, 7, CAST(N'2026-01-24T05:03:46.4129679' AS DateTime2), CAST(N'2026-01-10T05:03:46.3481779' AS DateTime2), CAST(N'2026-01-05T14:08:12.8283620' AS DateTime2), 4)
INSERT [dbo].[UserVocabularies] ([Id], [UserId], [VocabularyId], [Status], [CorrectStreak], [ReviewCount], [NextReviewAt], [LastReviewedAt], [CreatedAt], [Level]) VALUES (25, 1, 79, 3, 0, 0, CAST(N'2026-02-05T12:49:26.6330108' AS DateTime2), CAST(N'2026-01-06T12:49:26.6330101' AS DateTime2), CAST(N'2026-01-06T12:47:56.6764458' AS DateTime2), 0)
SET IDENTITY_INSERT [dbo].[UserVocabularies] OFF
GO
SET IDENTITY_INSERT [dbo].[Vocabularies] ON 

INSERT [dbo].[Vocabularies] ([Id], [Word], [Pronunciation], [PartOfSpeech], [Meaning], [Example], [ExampleTranslation], [AudioUrl], [ImageUrl], [QuestionId], [Difficulty], [CreatedAt], [Icon], [TopicId]) VALUES (56, N'promise', N'/ˈprɒmɪs/', N'v', N'hứa, cam kết', N' The manufacturer promised to replace the defective product.', N'Nhà sản xuất đã cam kết thay thế sản phẩm bị lỗi.', NULL, NULL, NULL, 1, CAST(N'0001-01-01T00:00:00.0000000' AS DateTime2), NULL, 3)
INSERT [dbo].[Vocabularies] ([Id], [Word], [Pronunciation], [PartOfSpeech], [Meaning], [Example], [ExampleTranslation], [AudioUrl], [ImageUrl], [QuestionId], [Difficulty], [CreatedAt], [Icon], [TopicId]) VALUES (57, N'repair', N'/rɪˈper/', N'v', N'sửa chữa', N'Technicians will repair the machine within three days.', N'Các kỹ thuật viên sẽ sửa chữa máy trong vòng ba ngày.', NULL, NULL, NULL, 1, CAST(N'0001-01-01T00:00:00.0000000' AS DateTime2), NULL, 3)
INSERT [dbo].[Vocabularies] ([Id], [Word], [Pronunciation], [PartOfSpeech], [Meaning], [Example], [ExampleTranslation], [AudioUrl], [ImageUrl], [QuestionId], [Difficulty], [CreatedAt], [Icon], [TopicId]) VALUES (58, N'cover', N'/ˈkʌvər/', N'v', N'bao gồm, chi trả, bảo hiểm', N'Does the warranty cover accidental damage?', N'Bảo hành có chi trả cho các hư hỏng do tai nạn không?', NULL, NULL, NULL, 1, CAST(N'0001-01-01T00:00:00.0000000' AS DateTime2), NULL, 3)
INSERT [dbo].[Vocabularies] ([Id], [Word], [Pronunciation], [PartOfSpeech], [Meaning], [Example], [ExampleTranslation], [AudioUrl], [ImageUrl], [QuestionId], [Difficulty], [CreatedAt], [Icon], [TopicId]) VALUES (59, N'item', N'/ˈaɪtəm/', N'n', N'món hàng, vật dụng', N'Please return the defective item to the store.', N'Vui lòng trả lại món hàng bị lỗi cho cửa hàng.', NULL, NULL, NULL, 1, CAST(N'0001-01-01T00:00:00.0000000' AS DateTime2), NULL, 3)
INSERT [dbo].[Vocabularies] ([Id], [Word], [Pronunciation], [PartOfSpeech], [Meaning], [Example], [ExampleTranslation], [AudioUrl], [ImageUrl], [QuestionId], [Difficulty], [CreatedAt], [Icon], [TopicId]) VALUES (60, N'expire', N'/ɪkˈspaɪər/', N'v', N'hết hạn, hết hiệu lực', N'Your warranty will expire in December next year.', N'Bảo hành của bạn sẽ hết hạn vào tháng 12 năm sau.', NULL, NULL, NULL, 2, CAST(N'0001-01-01T00:00:00.0000000' AS DateTime2), NULL, 3)
INSERT [dbo].[Vocabularies] ([Id], [Word], [Pronunciation], [PartOfSpeech], [Meaning], [Example], [ExampleTranslation], [AudioUrl], [ImageUrl], [QuestionId], [Difficulty], [CreatedAt], [Icon], [TopicId]) VALUES (61, N'replace', N'/rɪˈpleɪs/', N'v', N'thay thế', N'We will replace the battery free of charge.', N'Chúng tôi sẽ thay thế pin miễn phí.', NULL, NULL, NULL, 2, CAST(N'0001-01-01T00:00:00.0000000' AS DateTime2), NULL, 3)
INSERT [dbo].[Vocabularies] ([Id], [Word], [Pronunciation], [PartOfSpeech], [Meaning], [Example], [ExampleTranslation], [AudioUrl], [ImageUrl], [QuestionId], [Difficulty], [CreatedAt], [Icon], [TopicId]) VALUES (62, N'refund', N'/ˈriːfʌnd/', N'n', N'tiền hoàn lại', N'You can request a full refund if not satisfied.', N'Bạn có thể yêu cầu hoàn tiền toàn bộ nếu không hài lòng.', NULL, NULL, NULL, 2, CAST(N'0001-01-01T00:00:00.0000000' AS DateTime2), NULL, 3)
INSERT [dbo].[Vocabularies] ([Id], [Word], [Pronunciation], [PartOfSpeech], [Meaning], [Example], [ExampleTranslation], [AudioUrl], [ImageUrl], [QuestionId], [Difficulty], [CreatedAt], [Icon], [TopicId]) VALUES (63, N'valid', N'/ˈvælɪd/', N'adj', N'có hiệu lực, hợp lệ', N'A valid receipt is required for all warranty claims.', N'Cần phải có hóa đơn hợp lệ cho mọi yêu cầu bảo hành.', NULL, NULL, NULL, 3, CAST(N'0001-01-01T00:00:00.0000000' AS DateTime2), NULL, 3)
INSERT [dbo].[Vocabularies] ([Id], [Word], [Pronunciation], [PartOfSpeech], [Meaning], [Example], [ExampleTranslation], [AudioUrl], [ImageUrl], [QuestionId], [Difficulty], [CreatedAt], [Icon], [TopicId]) VALUES (64, N'certificate', N'/sərˈtɪfɪkət/', N'n', N'giấy chứng nhận', N'Keep the warranty certificate in a safe place.', N'Hãy giữ giấy chứng nhận bảo hành ở nơi an toàn.', NULL, NULL, NULL, 3, CAST(N'0001-01-01T00:00:00.0000000' AS DateTime2), NULL, 3)
INSERT [dbo].[Vocabularies] ([Id], [Word], [Pronunciation], [PartOfSpeech], [Meaning], [Example], [ExampleTranslation], [AudioUrl], [ImageUrl], [QuestionId], [Difficulty], [CreatedAt], [Icon], [TopicId]) VALUES (65, N'defect', N'/ˈdiːfekt/', N'n', N'khuyết điểm, lỗi', N'The product was recalled due to a manufacturing defect.', N'Sản phẩm đã bị thu hồi do lỗi sản xuất.', NULL, NULL, NULL, 3, CAST(N'0001-01-01T00:00:00.0000000' AS DateTime2), NULL, 3)
INSERT [dbo].[Vocabularies] ([Id], [Word], [Pronunciation], [PartOfSpeech], [Meaning], [Example], [ExampleTranslation], [AudioUrl], [ImageUrl], [QuestionId], [Difficulty], [CreatedAt], [Icon], [TopicId]) VALUES (66, N'malfunction', N'/ˌmælˈfʌŋkʃn/', N'v', N'gặp trục trặc, hỏng hóc', N'If the device malfunctions, contact support immediately.', N'Nếu thiết bị gặp trục trặc, hãy liên hệ hỗ trợ ngay lập tức.', NULL, NULL, NULL, 4, CAST(N'0001-01-01T00:00:00.0000000' AS DateTime2), NULL, 3)
INSERT [dbo].[Vocabularies] ([Id], [Word], [Pronunciation], [PartOfSpeech], [Meaning], [Example], [ExampleTranslation], [AudioUrl], [ImageUrl], [QuestionId], [Difficulty], [CreatedAt], [Icon], [TopicId]) VALUES (67, N'void', N'/vɔɪd/', N'v', N'làm mất hiệu lực', N'Opening the case will void the warranty immediately.', N'Việc mở vỏ máy sẽ làm mất hiệu lực bảo hành ngay lập tức.', NULL, NULL, NULL, 4, CAST(N'0001-01-01T00:00:00.0000000' AS DateTime2), NULL, 3)
INSERT [dbo].[Vocabularies] ([Id], [Word], [Pronunciation], [PartOfSpeech], [Meaning], [Example], [ExampleTranslation], [AudioUrl], [ImageUrl], [QuestionId], [Difficulty], [CreatedAt], [Icon], [TopicId]) VALUES (68, N'market', N'/ˈmɑːrkɪt/', N'n', N'thị trường', N'We need to analyze the target market carefully.', N'Chúng ta cần phân tích thị trường mục tiêu một cách cẩn thận.', NULL, NULL, NULL, 1, CAST(N'0001-01-01T00:00:00.0000000' AS DateTime2), NULL, 2)
INSERT [dbo].[Vocabularies] ([Id], [Word], [Pronunciation], [PartOfSpeech], [Meaning], [Example], [ExampleTranslation], [AudioUrl], [ImageUrl], [QuestionId], [Difficulty], [CreatedAt], [Icon], [TopicId]) VALUES (69, N'buy', N'/baɪ/', N'v', N'mua', N'Consumers are more likely to buy eco-friendly products.', N'Người tiêu dùng có xu hướng mua các sản phẩm thân thiện với môi trường hơn.', NULL, NULL, NULL, 1, CAST(N'0001-01-01T00:00:00.0000000' AS DateTime2), NULL, 2)
INSERT [dbo].[Vocabularies] ([Id], [Word], [Pronunciation], [PartOfSpeech], [Meaning], [Example], [ExampleTranslation], [AudioUrl], [ImageUrl], [QuestionId], [Difficulty], [CreatedAt], [Icon], [TopicId]) VALUES (70, N'price', N'/praɪs/', N'n', N'giá cả', N'The price includes shipping and handling fees.', N'Giá này đã bao gồm phí vận chuyển và xử lý.', NULL, NULL, NULL, 1, CAST(N'0001-01-01T00:00:00.0000000' AS DateTime2), NULL, 2)
INSERT [dbo].[Vocabularies] ([Id], [Word], [Pronunciation], [PartOfSpeech], [Meaning], [Example], [ExampleTranslation], [AudioUrl], [ImageUrl], [QuestionId], [Difficulty], [CreatedAt], [Icon], [TopicId]) VALUES (71, N'sell', N'/sel/', N'v', N'bán', N'Our goal is to sell 5,000 units by next month.', N'Mục tiêu của chúng tôi là bán được 5.000 đơn vị trước tháng sau.', NULL, NULL, NULL, 1, CAST(N'0001-01-01T00:00:00.0000000' AS DateTime2), NULL, 2)
INSERT [dbo].[Vocabularies] ([Id], [Word], [Pronunciation], [PartOfSpeech], [Meaning], [Example], [ExampleTranslation], [AudioUrl], [ImageUrl], [QuestionId], [Difficulty], [CreatedAt], [Icon], [TopicId]) VALUES (72, N'attract', N'/əˈtrækt/', N'v', N'thu hút, lôi cuốn', N'The new campaign aims to attract younger customers.', N'Chiến dịch mới nhằm mục đích thu hút các khách hàng trẻ tuổi hơn.', NULL, NULL, NULL, 2, CAST(N'0001-01-01T00:00:00.0000000' AS DateTime2), NULL, 2)
INSERT [dbo].[Vocabularies] ([Id], [Word], [Pronunciation], [PartOfSpeech], [Meaning], [Example], [ExampleTranslation], [AudioUrl], [ImageUrl], [QuestionId], [Difficulty], [CreatedAt], [Icon], [TopicId]) VALUES (73, N'consume', N'/kənˈsuːm/', N'v', N'tiêu thụ, dùng', N'Customers consume more digital content than ever before.', N'Khách hàng tiêu thụ nội dung số nhiều hơn bao giờ hết.', NULL, NULL, NULL, 2, CAST(N'0001-01-01T00:00:00.0000000' AS DateTime2), NULL, 2)
INSERT [dbo].[Vocabularies] ([Id], [Word], [Pronunciation], [PartOfSpeech], [Meaning], [Example], [ExampleTranslation], [AudioUrl], [ImageUrl], [QuestionId], [Difficulty], [CreatedAt], [Icon], [TopicId]) VALUES (74, N'compete', N'/kəmˈpiːt/', N'v', N'cạnh tranh, thi đua', N'Small businesses must innovate to compete with large corporations.', N'Các doanh nghiệp nhỏ phải đổi mới để cạnh tranh với các tập đoàn lớn.', NULL, NULL, NULL, 3, CAST(N'0001-01-01T00:00:00.0000000' AS DateTime2), NULL, 2)
INSERT [dbo].[Vocabularies] ([Id], [Word], [Pronunciation], [PartOfSpeech], [Meaning], [Example], [ExampleTranslation], [AudioUrl], [ImageUrl], [QuestionId], [Difficulty], [CreatedAt], [Icon], [TopicId]) VALUES (75, N'current', N'/ˈkɜːrənt/', N'adj', N'hiện tại, hiện hành', N'Our current marketing strategy focuses on social media.', N'Chiến lược tiếp thị hiện tại của chúng tôi tập trung vào mạng xã hội.', NULL, NULL, NULL, 2, CAST(N'0001-01-01T00:00:00.0000000' AS DateTime2), NULL, 2)
INSERT [dbo].[Vocabularies] ([Id], [Word], [Pronunciation], [PartOfSpeech], [Meaning], [Example], [ExampleTranslation], [AudioUrl], [ImageUrl], [QuestionId], [Difficulty], [CreatedAt], [Icon], [TopicId]) VALUES (76, N'strategy', N'/ˈstrætədʒi/', N'n', N'chiến lược', N'We developed a new strategy to boost brand awareness.', N'Chúng tôi đã phát triển một chiến lược mới để đẩy mạnh nhận diện thương hiệu.', NULL, NULL, NULL, 3, CAST(N'0001-01-01T00:00:00.0000000' AS DateTime2), NULL, 2)
INSERT [dbo].[Vocabularies] ([Id], [Word], [Pronunciation], [PartOfSpeech], [Meaning], [Example], [ExampleTranslation], [AudioUrl], [ImageUrl], [QuestionId], [Difficulty], [CreatedAt], [Icon], [TopicId]) VALUES (77, N'persuade', N'/pərˈsweɪd/', N'v', N'thuyết phục', N'Advertisements try to persuade people to buy products.', N'Các quảng cáo cố gắng thuyết phục mọi người mua sản phẩm.', NULL, NULL, NULL, 4, CAST(N'0001-01-01T00:00:00.0000000' AS DateTime2), NULL, 2)
INSERT [dbo].[Vocabularies] ([Id], [Word], [Pronunciation], [PartOfSpeech], [Meaning], [Example], [ExampleTranslation], [AudioUrl], [ImageUrl], [QuestionId], [Difficulty], [CreatedAt], [Icon], [TopicId]) VALUES (78, N'inspire', N'/ɪnˈspaɪər/', N'v', N'truyền cảm hứng', N'Good marketing should inspire customers to take action.', N'Tiếp thị giỏi nên truyền cảm hứng cho khách hàng hành động.', NULL, NULL, NULL, 4, CAST(N'0001-01-01T00:00:00.0000000' AS DateTime2), NULL, 2)
INSERT [dbo].[Vocabularies] ([Id], [Word], [Pronunciation], [PartOfSpeech], [Meaning], [Example], [ExampleTranslation], [AudioUrl], [ImageUrl], [QuestionId], [Difficulty], [CreatedAt], [Icon], [TopicId]) VALUES (79, N'satisfaction', N'/ˌsætɪsˈfækʃn/', N'n', N'sự hài lòng', N'Customer satisfaction surveys help us improve our service.', N'Các khảo sát sự hài lòng khách hàng giúp chúng tôi cải thiện dịch vụ.', NULL, NULL, NULL, 4, CAST(N'0001-01-01T00:00:00.0000000' AS DateTime2), NULL, 2)
INSERT [dbo].[Vocabularies] ([Id], [Word], [Pronunciation], [PartOfSpeech], [Meaning], [Example], [ExampleTranslation], [AudioUrl], [ImageUrl], [QuestionId], [Difficulty], [CreatedAt], [Icon], [TopicId]) VALUES (80, N'agreement', N'/əˈɡriːmənt/', N'n', N'hợp đồng, thỏa thuận', N'The two companies reached an agreement after hours of discussion.', N'Hai công ty đã đạt được thỏa thuận sau nhiều giờ thảo luận.', NULL, NULL, NULL, 1, CAST(N'0001-01-01T00:00:00.0000000' AS DateTime2), NULL, 1)
INSERT [dbo].[Vocabularies] ([Id], [Word], [Pronunciation], [PartOfSpeech], [Meaning], [Example], [ExampleTranslation], [AudioUrl], [ImageUrl], [QuestionId], [Difficulty], [CreatedAt], [Icon], [TopicId]) VALUES (81, N'sign', N'/saɪn/', N'v', N'ký tên, ký kết', N'Please sign the document at the bottom of the page.', N'Vui lòng ký vào tài liệu ở cuối trang.', NULL, NULL, NULL, 1, CAST(N'0001-01-01T00:00:00.0000000' AS DateTime2), NULL, 1)
INSERT [dbo].[Vocabularies] ([Id], [Word], [Pronunciation], [PartOfSpeech], [Meaning], [Example], [ExampleTranslation], [AudioUrl], [ImageUrl], [QuestionId], [Difficulty], [CreatedAt], [Icon], [TopicId]) VALUES (82, N'party', N'/ˈpɑːrti/', N'n', N'bên tham gia', N'Both parties must agree to the terms listed in the contract.', N'Cả hai bên phải đồng ý với các điều khoản được liệt kê trong hợp đồng.', NULL, NULL, NULL, 2, CAST(N'0001-01-01T00:00:00.0000000' AS DateTime2), NULL, 1)
INSERT [dbo].[Vocabularies] ([Id], [Word], [Pronunciation], [PartOfSpeech], [Meaning], [Example], [ExampleTranslation], [AudioUrl], [ImageUrl], [QuestionId], [Difficulty], [CreatedAt], [Icon], [TopicId]) VALUES (83, N'negotiate', N'/nɪˈɡoʊʃieɪt/', N'v', N'đàm phán, thương lượng', N'We need to negotiate the price before finalizing the deal.', N'Chúng ta cần thương lượng giá cả trước khi chốt thỏa thuận.', NULL, NULL, NULL, 3, CAST(N'0001-01-01T00:00:00.0000000' AS DateTime2), NULL, 1)
INSERT [dbo].[Vocabularies] ([Id], [Word], [Pronunciation], [PartOfSpeech], [Meaning], [Example], [ExampleTranslation], [AudioUrl], [ImageUrl], [QuestionId], [Difficulty], [CreatedAt], [Icon], [TopicId]) VALUES (84, N'establish', N'/ɪˈstæblɪʃ/', N'v', N'thành lập, thiết lập', N'The contract establishes a long-term partnership between us.', N'Hợp đồng thiết lập mối quan hệ đối tác lâu dài giữa chúng ta.', NULL, NULL, NULL, 3, CAST(N'0001-01-01T00:00:00.0000000' AS DateTime2), NULL, 1)
INSERT [dbo].[Vocabularies] ([Id], [Word], [Pronunciation], [PartOfSpeech], [Meaning], [Example], [ExampleTranslation], [AudioUrl], [ImageUrl], [QuestionId], [Difficulty], [CreatedAt], [Icon], [TopicId]) VALUES (85, N'renew', N'/rɪˈnuː/', N'v', N'gia hạn, làm mới', N'You must renew your subscription before the end of the month.', N'Bạn phải gia hạn đăng ký trước cuối tháng này.', NULL, NULL, NULL, 3, CAST(N'0001-01-01T00:00:00.0000000' AS DateTime2), NULL, 1)
INSERT [dbo].[Vocabularies] ([Id], [Word], [Pronunciation], [PartOfSpeech], [Meaning], [Example], [ExampleTranslation], [AudioUrl], [ImageUrl], [QuestionId], [Difficulty], [CreatedAt], [Icon], [TopicId]) VALUES (86, N'cancel', N'/ˈkænsl/', N'v', N'hủy bỏ', N'They decided to cancel the contract due to poor performance.', N'Họ quyết định hủy hợp đồng do hiệu suất kém.', NULL, NULL, NULL, 2, CAST(N'0001-01-01T00:00:00.0000000' AS DateTime2), NULL, 1)
INSERT [dbo].[Vocabularies] ([Id], [Word], [Pronunciation], [PartOfSpeech], [Meaning], [Example], [ExampleTranslation], [AudioUrl], [ImageUrl], [QuestionId], [Difficulty], [CreatedAt], [Icon], [TopicId]) VALUES (87, N'stipulate', N'/ˈstɪpjuleɪt/', N'v', N'quy định rõ ràng', N'The law stipulates that all workers must have insurance.', N'Luật quy định rằng tất cả công nhân phải có bảo hiểm.', NULL, NULL, NULL, 4, CAST(N'0001-01-01T00:00:00.0000000' AS DateTime2), NULL, 1)
INSERT [dbo].[Vocabularies] ([Id], [Word], [Pronunciation], [PartOfSpeech], [Meaning], [Example], [ExampleTranslation], [AudioUrl], [ImageUrl], [QuestionId], [Difficulty], [CreatedAt], [Icon], [TopicId]) VALUES (88, N'provision', N'/prəˈvɪʒn/', N'n', N'điều khoản, dự phòng', N'The contract contains a provision for early termination.', N'Hợp đồng có chứa một điều khoản về việc chấm dứt sớm.', NULL, NULL, NULL, 4, CAST(N'0001-01-01T00:00:00.0000000' AS DateTime2), NULL, 1)
INSERT [dbo].[Vocabularies] ([Id], [Word], [Pronunciation], [PartOfSpeech], [Meaning], [Example], [ExampleTranslation], [AudioUrl], [ImageUrl], [QuestionId], [Difficulty], [CreatedAt], [Icon], [TopicId]) VALUES (89, N'obligate', N'/ˈɒblɪɡeɪt/', N'v', N'bắt buộc, ép buộc', N'The terms obligate the tenant to pay for repairs.', N'Các điều khoản bắt buộc người thuê phải trả tiền sửa chữa.', NULL, NULL, NULL, 4, CAST(N'0001-01-01T00:00:00.0000000' AS DateTime2), NULL, 1)
INSERT [dbo].[Vocabularies] ([Id], [Word], [Pronunciation], [PartOfSpeech], [Meaning], [Example], [ExampleTranslation], [AudioUrl], [ImageUrl], [QuestionId], [Difficulty], [CreatedAt], [Icon], [TopicId]) VALUES (90, N'terminate', N'/ˈtɜːrmɪneɪt/', N'v', N'chấm dứt, kết thúc', N'Either party may terminate this agreement with 30 days'' notice.', N'Bất kỳ bên nào cũng có thể chấm dứt thỏa thuận này với thông báo trước 30 ngày.', NULL, NULL, NULL, 4, CAST(N'0001-01-01T00:00:00.0000000' AS DateTime2), NULL, 1)
SET IDENTITY_INSERT [dbo].[Vocabularies] OFF
GO
SET IDENTITY_INSERT [dbo].[WordFamilies] ON 

INSERT [dbo].[WordFamilies] ([Id], [VocabularyId], [Word], [PartOfSpeech], [Meaning]) VALUES (68, 56, N'promise', N'n', N'lời hứa')
INSERT [dbo].[WordFamilies] ([Id], [VocabularyId], [Word], [PartOfSpeech], [Meaning]) VALUES (69, 56, N'promising', N'adj', N'đầy hứa hẹn')
INSERT [dbo].[WordFamilies] ([Id], [VocabularyId], [Word], [PartOfSpeech], [Meaning]) VALUES (70, 57, N'repair', N'n', N'sự sửa chữa')
INSERT [dbo].[WordFamilies] ([Id], [VocabularyId], [Word], [PartOfSpeech], [Meaning]) VALUES (71, 57, N'repairable', N'adj', N'có thể sửa được')
INSERT [dbo].[WordFamilies] ([Id], [VocabularyId], [Word], [PartOfSpeech], [Meaning]) VALUES (72, 58, N'coverage', N'n', N'phạm vi bảo hiểm')
INSERT [dbo].[WordFamilies] ([Id], [VocabularyId], [Word], [PartOfSpeech], [Meaning]) VALUES (73, 58, N'covering', N'n', N'vật che phủ')
INSERT [dbo].[WordFamilies] ([Id], [VocabularyId], [Word], [PartOfSpeech], [Meaning]) VALUES (74, 59, N'itemize', N'v', N'liệt kê từng món')
INSERT [dbo].[WordFamilies] ([Id], [VocabularyId], [Word], [PartOfSpeech], [Meaning]) VALUES (75, 60, N'expiration', N'n', N'sự hết hạn')
INSERT [dbo].[WordFamilies] ([Id], [VocabularyId], [Word], [PartOfSpeech], [Meaning]) VALUES (76, 60, N'expired', N'adj', N'đã hết hạn')
INSERT [dbo].[WordFamilies] ([Id], [VocabularyId], [Word], [PartOfSpeech], [Meaning]) VALUES (77, 61, N'replacement', N'n', N'sự thay thế/vật thay thế')
INSERT [dbo].[WordFamilies] ([Id], [VocabularyId], [Word], [PartOfSpeech], [Meaning]) VALUES (78, 61, N'replaceable', N'adj', N'có thể thay thế')
INSERT [dbo].[WordFamilies] ([Id], [VocabularyId], [Word], [PartOfSpeech], [Meaning]) VALUES (79, 62, N'refund', N'v', N'hoàn tiền')
INSERT [dbo].[WordFamilies] ([Id], [VocabularyId], [Word], [PartOfSpeech], [Meaning]) VALUES (80, 62, N'refundable', N'adj', N'có thể hoàn tiền')
INSERT [dbo].[WordFamilies] ([Id], [VocabularyId], [Word], [PartOfSpeech], [Meaning]) VALUES (81, 63, N'validate', N'v', N'xác nhận/phê chuẩn')
INSERT [dbo].[WordFamilies] ([Id], [VocabularyId], [Word], [PartOfSpeech], [Meaning]) VALUES (82, 63, N'validity', N'n', N'giá trị pháp lý/hiệu lực')
INSERT [dbo].[WordFamilies] ([Id], [VocabularyId], [Word], [PartOfSpeech], [Meaning]) VALUES (83, 64, N'certify', N'v', N'chứng nhận')
INSERT [dbo].[WordFamilies] ([Id], [VocabularyId], [Word], [PartOfSpeech], [Meaning]) VALUES (84, 64, N'certification', N'n', N'sự chứng nhận')
INSERT [dbo].[WordFamilies] ([Id], [VocabularyId], [Word], [PartOfSpeech], [Meaning]) VALUES (85, 65, N'defective', N'adj', N'bị lỗi/có khuyết điểm')
INSERT [dbo].[WordFamilies] ([Id], [VocabularyId], [Word], [PartOfSpeech], [Meaning]) VALUES (86, 66, N'malfunction', N'n', N'sự trục trặc')
INSERT [dbo].[WordFamilies] ([Id], [VocabularyId], [Word], [PartOfSpeech], [Meaning]) VALUES (87, 66, N'functional', N'adj', N'thiết thực/hoạt động tốt')
INSERT [dbo].[WordFamilies] ([Id], [VocabularyId], [Word], [PartOfSpeech], [Meaning]) VALUES (88, 67, N'void', N'adj', N'vô hiệu')
INSERT [dbo].[WordFamilies] ([Id], [VocabularyId], [Word], [PartOfSpeech], [Meaning]) VALUES (89, 67, N'null', N'adj', N'vô giá trị (thường dùng null and void)')
INSERT [dbo].[WordFamilies] ([Id], [VocabularyId], [Word], [PartOfSpeech], [Meaning]) VALUES (90, 68, N'marketing', N'n', N'tiếp thị')
INSERT [dbo].[WordFamilies] ([Id], [VocabularyId], [Word], [PartOfSpeech], [Meaning]) VALUES (91, 68, N'marketable', N'adj', N'có thể bán được')
INSERT [dbo].[WordFamilies] ([Id], [VocabularyId], [Word], [PartOfSpeech], [Meaning]) VALUES (92, 69, N'buyer', N'n', N'người mua')
INSERT [dbo].[WordFamilies] ([Id], [VocabularyId], [Word], [PartOfSpeech], [Meaning]) VALUES (93, 69, N'buying', N'n', N'việc mua sắm')
INSERT [dbo].[WordFamilies] ([Id], [VocabularyId], [Word], [PartOfSpeech], [Meaning]) VALUES (94, 70, N'pricing', N'n', N'sự định giá')
INSERT [dbo].[WordFamilies] ([Id], [VocabularyId], [Word], [PartOfSpeech], [Meaning]) VALUES (95, 70, N'overpriced', N'adj', N'quá đắt')
INSERT [dbo].[WordFamilies] ([Id], [VocabularyId], [Word], [PartOfSpeech], [Meaning]) VALUES (96, 71, N'sale', N'n', N'việc bán hàng/doanh số')
INSERT [dbo].[WordFamilies] ([Id], [VocabularyId], [Word], [PartOfSpeech], [Meaning]) VALUES (97, 71, N'seller', N'n', N'người bán')
INSERT [dbo].[WordFamilies] ([Id], [VocabularyId], [Word], [PartOfSpeech], [Meaning]) VALUES (98, 72, N'attraction', N'n', N'sự thu hút')
INSERT [dbo].[WordFamilies] ([Id], [VocabularyId], [Word], [PartOfSpeech], [Meaning]) VALUES (99, 72, N'attractive', N'adj', N'hấp dẫn')
INSERT [dbo].[WordFamilies] ([Id], [VocabularyId], [Word], [PartOfSpeech], [Meaning]) VALUES (100, 73, N'consumer', N'n', N'người tiêu dùng')
INSERT [dbo].[WordFamilies] ([Id], [VocabularyId], [Word], [PartOfSpeech], [Meaning]) VALUES (101, 73, N'consumption', N'n', N'sự tiêu thụ')
INSERT [dbo].[WordFamilies] ([Id], [VocabularyId], [Word], [PartOfSpeech], [Meaning]) VALUES (102, 74, N'competition', N'n', N'sự cạnh tranh/cuộc thi')
INSERT [dbo].[WordFamilies] ([Id], [VocabularyId], [Word], [PartOfSpeech], [Meaning]) VALUES (103, 74, N'competitive', N'adj', N'có tính cạnh tranh')
INSERT [dbo].[WordFamilies] ([Id], [VocabularyId], [Word], [PartOfSpeech], [Meaning]) VALUES (104, 75, N'currently', N'adv', N'hiện nay')
INSERT [dbo].[WordFamilies] ([Id], [VocabularyId], [Word], [PartOfSpeech], [Meaning]) VALUES (105, 76, N'strategic', N'adj', N'thuộc về chiến lược')
INSERT [dbo].[WordFamilies] ([Id], [VocabularyId], [Word], [PartOfSpeech], [Meaning]) VALUES (106, 76, N'strategize', N'v', N'lập chiến lược')
INSERT [dbo].[WordFamilies] ([Id], [VocabularyId], [Word], [PartOfSpeech], [Meaning]) VALUES (107, 77, N'persuasion', N'n', N'sự thuyết phục')
INSERT [dbo].[WordFamilies] ([Id], [VocabularyId], [Word], [PartOfSpeech], [Meaning]) VALUES (108, 77, N'persuasive', N'adj', N'có sức thuyết phục')
INSERT [dbo].[WordFamilies] ([Id], [VocabularyId], [Word], [PartOfSpeech], [Meaning]) VALUES (109, 78, N'inspiration', N'n', N'nguồn cảm hứng')
INSERT [dbo].[WordFamilies] ([Id], [VocabularyId], [Word], [PartOfSpeech], [Meaning]) VALUES (110, 78, N'inspirational', N'adj', N'truyền cảm hứng')
INSERT [dbo].[WordFamilies] ([Id], [VocabularyId], [Word], [PartOfSpeech], [Meaning]) VALUES (111, 79, N'satisfy', N'v', N'làm hài lòng')
INSERT [dbo].[WordFamilies] ([Id], [VocabularyId], [Word], [PartOfSpeech], [Meaning]) VALUES (112, 79, N'satisfactory', N'adj', N'đạt yêu cầu')
INSERT [dbo].[WordFamilies] ([Id], [VocabularyId], [Word], [PartOfSpeech], [Meaning]) VALUES (113, 80, N'agree', N'v', N'đồng ý')
INSERT [dbo].[WordFamilies] ([Id], [VocabularyId], [Word], [PartOfSpeech], [Meaning]) VALUES (114, 80, N'agreeable', N'adj', N'tán thành, dễ chịu')
INSERT [dbo].[WordFamilies] ([Id], [VocabularyId], [Word], [PartOfSpeech], [Meaning]) VALUES (115, 81, N'signature', N'n', N'chữ ký')
INSERT [dbo].[WordFamilies] ([Id], [VocabularyId], [Word], [PartOfSpeech], [Meaning]) VALUES (116, 81, N'signatory', N'n', N'bên ký kết')
INSERT [dbo].[WordFamilies] ([Id], [VocabularyId], [Word], [PartOfSpeech], [Meaning]) VALUES (117, 82, N'third-party', N'n', N'bên thứ ba')
INSERT [dbo].[WordFamilies] ([Id], [VocabularyId], [Word], [PartOfSpeech], [Meaning]) VALUES (118, 82, N'partisan', N'adj', N'thuộc về một phe/đảng')
INSERT [dbo].[WordFamilies] ([Id], [VocabularyId], [Word], [PartOfSpeech], [Meaning]) VALUES (119, 83, N'negotiation', N'n', N'sự đàm phán')
INSERT [dbo].[WordFamilies] ([Id], [VocabularyId], [Word], [PartOfSpeech], [Meaning]) VALUES (120, 83, N'negotiator', N'n', N'người đàm phán')
INSERT [dbo].[WordFamilies] ([Id], [VocabularyId], [Word], [PartOfSpeech], [Meaning]) VALUES (121, 83, N'negotiable', N'adj', N'có thể thương lượng')
INSERT [dbo].[WordFamilies] ([Id], [VocabularyId], [Word], [PartOfSpeech], [Meaning]) VALUES (122, 84, N'establishment', N'n', N'sự thành lập/cơ sở')
INSERT [dbo].[WordFamilies] ([Id], [VocabularyId], [Word], [PartOfSpeech], [Meaning]) VALUES (123, 84, N'established', N'adj', N'đã được xác lập/uy tín')
INSERT [dbo].[WordFamilies] ([Id], [VocabularyId], [Word], [PartOfSpeech], [Meaning]) VALUES (124, 85, N'renewal', N'n', N'sự gia hạn')
INSERT [dbo].[WordFamilies] ([Id], [VocabularyId], [Word], [PartOfSpeech], [Meaning]) VALUES (125, 85, N'renewable', N'adj', N'có thể gia hạn/tái tạo')
INSERT [dbo].[WordFamilies] ([Id], [VocabularyId], [Word], [PartOfSpeech], [Meaning]) VALUES (126, 86, N'cancellation', N'n', N'sự hủy bỏ')
INSERT [dbo].[WordFamilies] ([Id], [VocabularyId], [Word], [PartOfSpeech], [Meaning]) VALUES (127, 86, N'canceled', N'adj', N'đã bị hủy')
INSERT [dbo].[WordFamilies] ([Id], [VocabularyId], [Word], [PartOfSpeech], [Meaning]) VALUES (128, 87, N'stipulation', N'n', N'điều khoản quy định')
INSERT [dbo].[WordFamilies] ([Id], [VocabularyId], [Word], [PartOfSpeech], [Meaning]) VALUES (129, 88, N'provide', N'v', N'cung cấp')
INSERT [dbo].[WordFamilies] ([Id], [VocabularyId], [Word], [PartOfSpeech], [Meaning]) VALUES (130, 88, N'provisional', N'adj', N'tạm thời/lâm thời')
INSERT [dbo].[WordFamilies] ([Id], [VocabularyId], [Word], [PartOfSpeech], [Meaning]) VALUES (131, 89, N'obligation', N'n', N'nghĩa vụ/bổn phận')
INSERT [dbo].[WordFamilies] ([Id], [VocabularyId], [Word], [PartOfSpeech], [Meaning]) VALUES (132, 89, N'obligatory', N'adj', N'bắt buộc')
INSERT [dbo].[WordFamilies] ([Id], [VocabularyId], [Word], [PartOfSpeech], [Meaning]) VALUES (133, 90, N'termination', N'n', N'sự chấm dứt')
INSERT [dbo].[WordFamilies] ([Id], [VocabularyId], [Word], [PartOfSpeech], [Meaning]) VALUES (134, 90, N'terminal', N'adj', N'giai đoạn cuối/tận cùng')
SET IDENTITY_INSERT [dbo].[WordFamilies] OFF
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
