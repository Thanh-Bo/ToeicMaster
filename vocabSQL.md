# Vocabulary Database Schema

## Overview
This document contains all SQL table definitions related to the Vocabulary module in the ToeicMaster application.

---

## 1. Topics

Main categories for vocabulary organization.

```sql
CREATE TABLE [dbo].[Topics] (
    [Id] int NOT NULL IDENTITY(1,1),
    [Title] nvarchar(max) NOT NULL,
    [Description] nvarchar(max) NULL,
    [ImageUrl] nvarchar(max) NULL,
    [Level] nvarchar(max) NOT NULL,
    [LevelRange] nvarchar(max) NOT NULL,
    CONSTRAINT [PK_Topics] PRIMARY KEY CLUSTERED ([Id] ASC)
);
```

---

## 2. Vocabularies

Main vocabulary words table.

```sql
CREATE TABLE [dbo].[Vocabularies] (
    [Id] int NOT NULL IDENTITY(1,1),
    [Word] nvarchar(100) NOT NULL,
    [Pronunciation] nvarchar(200) NULL,
    [PartOfSpeech] nvarchar(20) NULL,
    [Meaning] nvarchar(500) NOT NULL,
    [Example] nvarchar(max) NULL,
    [ExampleTranslation] nvarchar(max) NULL,
    [AudioUrl] nvarchar(max) NULL,
    [ImageUrl] nvarchar(max) NULL,
    [Icon] nvarchar(max) NULL,
    [QuestionId] int NULL,
    [TopicId] int NULL,
    [Difficulty] int NOT NULL DEFAULT 0,
    [CreatedAt] datetime2 NOT NULL,
    CONSTRAINT [PK_Vocabularies] PRIMARY KEY CLUSTERED ([Id] ASC)
);

-- Indexes
CREATE NONCLUSTERED INDEX [IX_Vocabularies_TopicId] ON [dbo].[Vocabularies] ([TopicId]);
CREATE NONCLUSTERED INDEX [IX_Vocabularies_QuestionId] ON [dbo].[Vocabularies] ([QuestionId]);

-- Foreign Keys
ALTER TABLE [dbo].[Vocabularies] ADD CONSTRAINT [FK_Vocabularies_Topics_TopicId] 
    FOREIGN KEY ([TopicId]) REFERENCES [dbo].[Topics] ([Id]);
ALTER TABLE [dbo].[Vocabularies] ADD CONSTRAINT [FK_Vocabularies_Questions_QuestionId] 
    FOREIGN KEY ([QuestionId]) REFERENCES [dbo].[Questions] ([Id]) ON DELETE SET NULL;
```

---

## 3. WordFamilies

Related word forms for each vocabulary (e.g., noun, verb, adjective forms).

```sql
CREATE TABLE [dbo].[WordFamilies] (
    [Id] int NOT NULL IDENTITY(1,1),
    [VocabularyId] int NOT NULL,
    [Word] nvarchar(max) NOT NULL,
    [PartOfSpeech] nvarchar(max) NOT NULL,
    [Meaning] nvarchar(max) NULL,
    CONSTRAINT [PK_WordFamilies] PRIMARY KEY CLUSTERED ([Id] ASC)
);

-- Indexes
CREATE NONCLUSTERED INDEX [IX_WordFamilies_VocabularyId] ON [dbo].[WordFamilies] ([VocabularyId]);

-- Foreign Keys
ALTER TABLE [dbo].[WordFamilies] ADD CONSTRAINT [FK_WordFamilies_Vocabularies_VocabularyId] 
    FOREIGN KEY ([VocabularyId]) REFERENCES [dbo].[Vocabularies] ([Id]) ON DELETE CASCADE;
```

---

## 4. UserVocabularies

Tracks user learning progress for each vocabulary word (SRS - Spaced Repetition System).

```sql
CREATE TABLE [dbo].[UserVocabularies] (
    [Id] int NOT NULL IDENTITY(1,1),
    [UserId] int NOT NULL,
    [VocabularyId] int NOT NULL,
    [Status] int NOT NULL DEFAULT 0,        -- 0: New, 1: Learning, 2: Review, 3: Mastered
    [CorrectStreak] int NOT NULL DEFAULT 0,
    [ReviewCount] int NOT NULL DEFAULT 0,
    [Level] int NOT NULL DEFAULT 0,         -- SRS Level (1-5)
    [NextReviewAt] datetime2 NULL,          -- Next scheduled review time
    [LastReviewedAt] datetime2 NULL,
    [CreatedAt] datetime2 NOT NULL,
    CONSTRAINT [PK_UserVocabularies] PRIMARY KEY CLUSTERED ([Id] ASC)
);

-- Indexes
CREATE UNIQUE NONCLUSTERED INDEX [IX_UserVocabularies_UserId_VocabularyId] 
    ON [dbo].[UserVocabularies] ([UserId], [VocabularyId]);
CREATE NONCLUSTERED INDEX [IX_UserVocabularies_VocabularyId] 
    ON [dbo].[UserVocabularies] ([VocabularyId]);

-- Foreign Keys
ALTER TABLE [dbo].[UserVocabularies] ADD CONSTRAINT [FK_UserVocabularies_Users_UserId] 
    FOREIGN KEY ([UserId]) REFERENCES [dbo].[Users] ([Id]) ON DELETE CASCADE;
ALTER TABLE [dbo].[UserVocabularies] ADD CONSTRAINT [FK_UserVocabularies_Vocabularies_VocabularyId] 
    FOREIGN KEY ([VocabularyId]) REFERENCES [dbo].[Vocabularies] ([Id]) ON DELETE CASCADE;
```

---

## 5. UserVocabStreaks

Tracks user daily learning streaks for vocabulary.

```sql
CREATE TABLE [dbo].[UserVocabStreaks] (
    [Id] int NOT NULL IDENTITY(1,1),
    [UserId] int NOT NULL,
    [CurrentStreak] int NOT NULL DEFAULT 0,
    [LongestStreak] int NOT NULL DEFAULT 0,
    [LastActivityDate] datetime2 NULL,
    CONSTRAINT [PK_UserVocabStreaks] PRIMARY KEY CLUSTERED ([Id] ASC)
);

-- Indexes
CREATE UNIQUE NONCLUSTERED INDEX [IX_UserVocabStreaks_UserId] 
    ON [dbo].[UserVocabStreaks] ([UserId]);

-- Foreign Keys
ALTER TABLE [dbo].[UserVocabStreaks] ADD CONSTRAINT [FK_UserVocabStreaks_Users] 
    FOREIGN KEY ([UserId]) REFERENCES [dbo].[Users] ([Id]) ON DELETE CASCADE;
```

---

## 6. UserActivityVocabSessions

Tracks study sessions for vocabulary learning.

```sql
CREATE TABLE [dbo].[UserActivityVocabSessions] (
    [Id] int NOT NULL IDENTITY(1,1),
    [UserId] int NOT NULL,
    [StartTime] datetime2 NOT NULL,
    [EndTime] datetime2 NULL,
    [DurationSeconds] int NULL,
    [Date] datetime2 NOT NULL DEFAULT (CONVERT([date],getdate())),
    CONSTRAINT [PK_UserActivityVocabSessions] PRIMARY KEY CLUSTERED ([Id] ASC)
);

-- Foreign Keys
ALTER TABLE [dbo].[UserActivityVocabSessions] ADD CONSTRAINT [FK_UserActivityVocabSessions_Users] 
    FOREIGN KEY ([UserId]) REFERENCES [dbo].[Users] ([Id]) ON DELETE CASCADE;
```

---

## 7. QuestionVocab

Vocabulary quiz questions.

```sql
CREATE TABLE [dbo].[QuestionVocab] (
    [Id] int NOT NULL IDENTITY(1,1),
    [TopicId] int NOT NULL,
    [QuestionNo] int NOT NULL,
    [Content] nvarchar(max) NULL,
    [CorrectOption] nvarchar(5) NULL,
    [ShortExplanation] nvarchar(max) NULL,
    [LongExplanation] nvarchar(max) NULL,
    CONSTRAINT [PK_QuestionVocab] PRIMARY KEY CLUSTERED ([Id] ASC)
);

-- Indexes
CREATE NONCLUSTERED INDEX [IX_QuestionVocab_TopicId] ON [dbo].[QuestionVocab] ([TopicId]);

-- Foreign Keys
ALTER TABLE [dbo].[QuestionVocab] ADD CONSTRAINT [FK_QuestionVocab_Topics_TopicId] 
    FOREIGN KEY ([TopicId]) REFERENCES [dbo].[Topics] ([Id]) ON DELETE CASCADE;
```

---

## 8. QuestionVocabAnswer

Answer options for vocabulary quiz questions.

```sql
CREATE TABLE [dbo].[QuestionVocabAnswer] (
    [Id] int NOT NULL IDENTITY(1,1),
    [QuestionVocabId] int NOT NULL,
    [Label] nvarchar(5) NULL,           -- A, B, C, D
    [Content] nvarchar(max) NULL,
    [IsCorrect] bit NOT NULL DEFAULT 0,
    CONSTRAINT [PK_QuestionVocabAnswer] PRIMARY KEY CLUSTERED ([Id] ASC)
);

-- Indexes
CREATE NONCLUSTERED INDEX [IX_QuestionVocabAnswer_QuestionVocabId] 
    ON [dbo].[QuestionVocabAnswer] ([QuestionVocabId]);

-- Foreign Keys
ALTER TABLE [dbo].[QuestionVocabAnswer] ADD CONSTRAINT [FK_QuestionVocabAnswer_QuestionVocab_QuestionVocabId] 
    FOREIGN KEY ([QuestionVocabId]) REFERENCES [dbo].[QuestionVocab] ([Id]) ON DELETE CASCADE;
```

---

## Entity Relationship Diagram

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│     Topics      │────<│   Vocabularies   │────<│   WordFamilies  │
├─────────────────┤     ├──────────────────┤     ├─────────────────┤
│ Id (PK)         │     │ Id (PK)          │     │ Id (PK)         │
│ Title           │     │ Word             │     │ VocabularyId(FK)│
│ Description     │     │ Meaning          │     │ Word            │
│ Level           │     │ TopicId (FK)     │     │ PartOfSpeech    │
│ LevelRange      │     │ Difficulty       │     │ Meaning         │
└─────────────────┘     └──────────────────┘     └─────────────────┘
         │                       │
         │              ┌────────┘
         │              │
         │         ┌────┴──────────────┐
         │         │   UserVocabularies│
         │         ├───────────────────┤
         │         │ Id (PK)           │
         │         │ UserId (FK)       │
         │         │ VocabularyId (FK) │
         │         │ Status            │
         │         │ Level             │
         │         │ NextReviewAt      │
         │         └───────────────────┘
         │
         └──────┬────────────────────┐
                │                    │
    ┌───────────┴────────┐  ┌────────┴───────────────┐
    │   QuestionVocab    │  │ UserActivityVocabSessions│
    ├────────────────────┤  ├────────────────────────┤
    │ Id (PK)            │  │ Id (PK)                │
    │ TopicId (FK)       │  │ UserId (FK)            │
    │ QuestionNo         │  │ StartTime              │
    │ Content            │  │ EndTime                │
    │ CorrectOption      │  │ DurationSeconds        │
    │ ShortExplanation   │  └────────────────────────┘
    │ LongExplanation    │
    └──────────┬─────────┘
               │
    ┌──────────┴──────────────┐
    │   QuestionVocabAnswer     │
    ├─────────────────────────┤
    │ Id (PK)                 │
    │ QuestionVocabId (FK)    │
    │ Label                   │
    │ Content                 │
    │ IsCorrect               │
    └─────────────────────────┘
```

---

## Summary of Relationships

| Table | Foreign Key References | Cascade Delete |
|-------|----------------------|----------------|
| **Vocabularies** | Topics(Id), Questions(Id) | - |
| **WordFamilies** | Vocabularies(Id) | Yes |
| **UserVocabularies** | Users(Id), Vocabularies(Id) | Yes |
| **UserVocabStreaks** | Users(Id) | Yes |
| **UserActivityVocabSessions** | Users(Id) | Yes |
| **QuestionVocab** | Topics(Id) | Yes |
| **QuestionVocabAnswer** | QuestionVocab(Id) | Yes |

---

## Notes

- **SRS (Spaced Repetition System)**: Implemented via `UserVocabularies` table with `Level` (1-5) and `NextReviewAt` fields
- **Status values**: 0=New, 1=Learning, 2=Review, 3=Mastered
- **Level intervals**: Level 1 (1 day), Level 2 (3 days), Level 3 (7 days), Level 4 (14 days), Level 5 (30 days)
- All user-related tables have CASCADE DELETE from Users table
