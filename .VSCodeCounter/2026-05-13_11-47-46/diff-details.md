# Diff Details

Date : 2026-05-13 11:47:46

Directory d:\\ToeicMaster\\ToeicMaster.API

Total : 302 files,  17783 codes, 108 comments, 8788 blanks, all 26679 lines

[Summary](results.md) / [Details](details.md) / [Diff Summary](diff.md) / Diff Details

## Files
| filename | language | code | comment | blank | total |
| :--- | :--- | ---: | ---: | ---: | ---: |
| [ToeicMaster.API/.dockerignore](/ToeicMaster.API/.dockerignore) | Ignore | 16 | 0 | 1 | 17 |
| [ToeicMaster.API/Controllers/AdminController.cs](/ToeicMaster.API/Controllers/AdminController.cs) | C# | 1,026 | 105 | 137 | 1,268 |
| [ToeicMaster.API/Controllers/AdminManagementController.cs](/ToeicMaster.API/Controllers/AdminManagementController.cs) | C# | 1,202 | 183 | 202 | 1,587 |
| [ToeicMaster.API/Controllers/AuthController.cs](/ToeicMaster.API/Controllers/AuthController.cs) | C# | 301 | 45 | 69 | 415 |
| [ToeicMaster.API/Controllers/BookmarksController.cs](/ToeicMaster.API/Controllers/BookmarksController.cs) | C# | 178 | 38 | 41 | 257 |
| [ToeicMaster.API/Controllers/CommentsController.cs](/ToeicMaster.API/Controllers/CommentsController.cs) | C# | 211 | 30 | 54 | 295 |
| [ToeicMaster.API/Controllers/FeedbackController.cs](/ToeicMaster.API/Controllers/FeedbackController.cs) | C# | 126 | 16 | 23 | 165 |
| [ToeicMaster.API/Controllers/GrammarController.cs](/ToeicMaster.API/Controllers/GrammarController.cs) | C# | 318 | 71 | 48 | 437 |
| [ToeicMaster.API/Controllers/GrammarGroupsController.cs](/ToeicMaster.API/Controllers/GrammarGroupsController.cs) | C# | 101 | 15 | 13 | 129 |
| [ToeicMaster.API/Controllers/GrammarQuestionGenerationController.cs](/ToeicMaster.API/Controllers/GrammarQuestionGenerationController.cs) | C# | 124 | 8 | 21 | 153 |
| [ToeicMaster.API/Controllers/GrammarStatsController.cs](/ToeicMaster.API/Controllers/GrammarStatsController.cs) | C# | 146 | 28 | 20 | 194 |
| [ToeicMaster.API/Controllers/ImportController.cs](/ToeicMaster.API/Controllers/ImportController.cs) | C# | 248 | 32 | 41 | 321 |
| [ToeicMaster.API/Controllers/PaymentController.cs](/ToeicMaster.API/Controllers/PaymentController.cs) | C# | 257 | 37 | 44 | 338 |
| [ToeicMaster.API/Controllers/PracticeController.cs](/ToeicMaster.API/Controllers/PracticeController.cs) | C# | 231 | 22 | 44 | 297 |
| [ToeicMaster.API/Controllers/QuestionGrammarController.cs](/ToeicMaster.API/Controllers/QuestionGrammarController.cs) | C# | 596 | 89 | 104 | 789 |
| [ToeicMaster.API/Controllers/QuestionVocabController.cs](/ToeicMaster.API/Controllers/QuestionVocabController.cs) | C# | 127 | 13 | 18 | 158 |
| [ToeicMaster.API/Controllers/StatisticsController.cs](/ToeicMaster.API/Controllers/StatisticsController.cs) | C# | 418 | 45 | 60 | 523 |
| [ToeicMaster.API/Controllers/TestManagementController.cs](/ToeicMaster.API/Controllers/TestManagementController.cs) | C# | 429 | 83 | 89 | 601 |
| [ToeicMaster.API/Controllers/TestsController.cs](/ToeicMaster.API/Controllers/TestsController.cs) | C# | 627 | 44 | 77 | 748 |
| [ToeicMaster.API/Controllers/UserGrammarController.cs](/ToeicMaster.API/Controllers/UserGrammarController.cs) | C# | 86 | 21 | 16 | 123 |
| [ToeicMaster.API/Controllers/VocabularyController.cs](/ToeicMaster.API/Controllers/VocabularyController.cs) | C# | 381 | 46 | 75 | 502 |
| [ToeicMaster.API/Data/AppDbContext.cs](/ToeicMaster.API/Data/AppDbContext.cs) | C# | 427 | 22 | 136 | 585 |
| [ToeicMaster.API/Data/DapperContext.cs](/ToeicMaster.API/Data/DapperContext.cs) | C# | 17 | 0 | 3 | 20 |
| [ToeicMaster.API/Dockerfile](/ToeicMaster.API/Dockerfile) | Docker | 14 | 3 | 3 | 20 |
| [ToeicMaster.API/Entities/Answer.cs](/ToeicMaster.API/Entities/Answer.cs) | C# | 12 | 0 | 7 | 19 |
| [ToeicMaster.API/Entities/Bookmark.cs](/ToeicMaster.API/Entities/Bookmark.cs) | C# | 13 | 0 | 9 | 22 |
| [ToeicMaster.API/Entities/Comment.cs](/ToeicMaster.API/Entities/Comment.cs) | C# | 19 | 0 | 15 | 34 |
| [ToeicMaster.API/Entities/CommentLike.cs](/ToeicMaster.API/Entities/CommentLike.cs) | C# | 11 | 0 | 8 | 19 |
| [ToeicMaster.API/Entities/Grammar.cs](/ToeicMaster.API/Entities/Grammar.cs) | C# | 29 | 0 | 22 | 51 |
| [ToeicMaster.API/Entities/GrammarExample.cs](/ToeicMaster.API/Entities/GrammarExample.cs) | C# | 13 | 0 | 9 | 22 |
| [ToeicMaster.API/Entities/GrammarGroup.cs](/ToeicMaster.API/Entities/GrammarGroup.cs) | C# | 12 | 1 | 8 | 21 |
| [ToeicMaster.API/Entities/GrammarStudySession.cs](/ToeicMaster.API/Entities/GrammarStudySession.cs) | C# | 32 | 4 | 16 | 52 |
| [ToeicMaster.API/Entities/GrammarTopic.cs](/ToeicMaster.API/Entities/GrammarTopic.cs) | C# | 16 | 5 | 12 | 33 |
| [ToeicMaster.API/Entities/Part.cs](/ToeicMaster.API/Entities/Part.cs) | C# | 13 | 0 | 9 | 22 |
| [ToeicMaster.API/Entities/PracticeAnswer.cs](/ToeicMaster.API/Entities/PracticeAnswer.cs) | C# | 14 | 0 | 10 | 24 |
| [ToeicMaster.API/Entities/PracticeSession.cs](/ToeicMaster.API/Entities/PracticeSession.cs) | C# | 17 | 0 | 13 | 30 |
| [ToeicMaster.API/Entities/Question.cs](/ToeicMaster.API/Entities/Question.cs) | C# | 25 | 0 | 21 | 46 |
| [ToeicMaster.API/Entities/QuestionGrammar.cs](/ToeicMaster.API/Entities/QuestionGrammar.cs) | C# | 18 | 0 | 14 | 32 |
| [ToeicMaster.API/Entities/QuestionGrammarAnswer.cs](/ToeicMaster.API/Entities/QuestionGrammarAnswer.cs) | C# | 12 | 0 | 8 | 20 |
| [ToeicMaster.API/Entities/QuestionGroup.cs](/ToeicMaster.API/Entities/QuestionGroup.cs) | C# | 17 | 0 | 13 | 30 |
| [ToeicMaster.API/Entities/QuestionVocab.cs](/ToeicMaster.API/Entities/QuestionVocab.cs) | C# | 15 | 0 | 11 | 26 |
| [ToeicMaster.API/Entities/QuestionVocabAnswer.cs](/ToeicMaster.API/Entities/QuestionVocabAnswer.cs) | C# | 12 | 0 | 8 | 20 |
| [ToeicMaster.API/Entities/ReviewFeedback.cs](/ToeicMaster.API/Entities/ReviewFeedback.cs) | C# | 12 | 0 | 8 | 20 |
| [ToeicMaster.API/Entities/ScoreConversions.cs](/ToeicMaster.API/Entities/ScoreConversions.cs) | C# | 8 | 0 | 1 | 9 |
| [ToeicMaster.API/Entities/Tag.cs](/ToeicMaster.API/Entities/Tag.cs) | C# | 9 | 0 | 5 | 14 |
| [ToeicMaster.API/Entities/Test.cs](/ToeicMaster.API/Entities/Test.cs) | C# | 19 | 0 | 15 | 34 |
| [ToeicMaster.API/Entities/TestAttempt.cs](/ToeicMaster.API/Entities/TestAttempt.cs) | C# | 20 | 0 | 14 | 34 |
| [ToeicMaster.API/Entities/Topic.cs](/ToeicMaster.API/Entities/Topic.cs) | C# | 13 | 3 | 8 | 24 |
| [ToeicMaster.API/Entities/Transaction.cs](/ToeicMaster.API/Entities/Transaction.cs) | C# | 15 | 0 | 11 | 26 |
| [ToeicMaster.API/Entities/User.cs](/ToeicMaster.API/Entities/User.cs) | C# | 29 | 2 | 27 | 58 |
| [ToeicMaster.API/Entities/UserAnswer.cs](/ToeicMaster.API/Entities/UserAnswer.cs) | C# | 16 | 0 | 12 | 28 |
| [ToeicMaster.API/Entities/UserDailyActivity.cs](/ToeicMaster.API/Entities/UserDailyActivity.cs) | C# | 23 | 4 | 11 | 38 |
| [ToeicMaster.API/Entities/UserFeedback.cs](/ToeicMaster.API/Entities/UserFeedback.cs) | C# | 23 | 0 | 20 | 43 |
| [ToeicMaster.API/Entities/UserGrammar.cs](/ToeicMaster.API/Entities/UserGrammar.cs) | C# | 22 | 1 | 18 | 41 |
| [ToeicMaster.API/Entities/UserVocabulary.cs](/ToeicMaster.API/Entities/UserVocabulary.cs) | C# | 18 | 0 | 13 | 31 |
| [ToeicMaster.API/Entities/Vocabulary.cs](/ToeicMaster.API/Entities/Vocabulary.cs) | C# | 24 | 1 | 18 | 43 |
| [ToeicMaster.API/Entities/WordFamily.cs](/ToeicMaster.API/Entities/WordFamily.cs) | C# | 12 | 0 | 7 | 19 |
| [ToeicMaster.API/Migrations/20251220090423\_InitialCreate.Designer.cs](/ToeicMaster.API/Migrations/20251220090423_InitialCreate.Designer.cs) | C# | 706 | 2 | 255 | 963 |
| [ToeicMaster.API/Migrations/20251220090423\_InitialCreate.cs](/ToeicMaster.API/Migrations/20251220090423_InitialCreate.cs) | C# | 543 | 3 | 58 | 604 |
| [ToeicMaster.API/Migrations/20251220113936\_ExpandColumnSizes.Designer.cs](/ToeicMaster.API/Migrations/20251220113936_ExpandColumnSizes.Designer.cs) | C# | 702 | 2 | 255 | 959 |
| [ToeicMaster.API/Migrations/20251220113936\_ExpandColumnSizes.cs](/ToeicMaster.API/Migrations/20251220113936_ExpandColumnSizes.cs) | C# | 54 | 3 | 6 | 63 |
| [ToeicMaster.API/Migrations/20251220115545\_AddCommentsFeature.Designer.cs](/ToeicMaster.API/Migrations/20251220115545_AddCommentsFeature.Designer.cs) | C# | 790 | 2 | 293 | 1,085 |
| [ToeicMaster.API/Migrations/20251220115545\_AddCommentsFeature.cs](/ToeicMaster.API/Migrations/20251220115545_AddCommentsFeature.cs) | C# | 180 | 3 | 19 | 202 |
| [ToeicMaster.API/Migrations/20251225223637\_AddRoleColumn.Designer.cs](/ToeicMaster.API/Migrations/20251225223637_AddRoleColumn.Designer.cs) | C# | 791 | 2 | 293 | 1,086 |
| [ToeicMaster.API/Migrations/20251225223637\_AddRoleColumn.cs](/ToeicMaster.API/Migrations/20251225223637_AddRoleColumn.cs) | C# | 30 | 3 | 4 | 37 |
| [ToeicMaster.API/Migrations/20251225230721\_AddIconColumn.Designer.cs](/ToeicMaster.API/Migrations/20251225230721_AddIconColumn.Designer.cs) | C# | 793 | 2 | 294 | 1,089 |
| [ToeicMaster.API/Migrations/20251225230721\_AddIconColumn.cs](/ToeicMaster.API/Migrations/20251225230721_AddIconColumn.cs) | C# | 22 | 3 | 4 | 29 |
| [ToeicMaster.API/Migrations/20251226130541\_scoreConversion.Designer.cs](/ToeicMaster.API/Migrations/20251226130541_scoreConversion.Designer.cs) | C# | 793 | 2 | 294 | 1,089 |
| [ToeicMaster.API/Migrations/20251226130541\_scoreConversion.cs](/ToeicMaster.API/Migrations/20251226130541_scoreConversion.cs) | C# | 14 | 3 | 6 | 23 |
| [ToeicMaster.API/Migrations/20251226131423\_AddScoreConversions.Designer.cs](/ToeicMaster.API/Migrations/20251226131423_AddScoreConversions.Designer.cs) | C# | 808 | 2 | 301 | 1,111 |
| [ToeicMaster.API/Migrations/20251226131423\_AddScoreConversions.cs](/ToeicMaster.API/Migrations/20251226131423_AddScoreConversions.cs) | C# | 30 | 3 | 4 | 37 |
| [ToeicMaster.API/Migrations/20251229095416\_AddOtpToUser.Designer.cs](/ToeicMaster.API/Migrations/20251229095416_AddOtpToUser.Designer.cs) | C# | 812 | 2 | 303 | 1,117 |
| [ToeicMaster.API/Migrations/20251229095416\_AddOtpToUser.cs](/ToeicMaster.API/Migrations/20251229095416_AddOtpToUser.cs) | C# | 31 | 3 | 6 | 40 |
| [ToeicMaster.API/Migrations/20251230143346\_AddTimeTaken.Designer.cs](/ToeicMaster.API/Migrations/20251230143346_AddTimeTaken.Designer.cs) | C# | 814 | 2 | 304 | 1,120 |
| [ToeicMaster.API/Migrations/20251230143346\_AddTimeTaken.cs](/ToeicMaster.API/Migrations/20251230143346_AddTimeTaken.cs) | C# | 23 | 3 | 4 | 30 |
| [ToeicMaster.API/Migrations/20251231152350\_UpdateVocabStructure.Designer.cs](/ToeicMaster.API/Migrations/20251231152350_UpdateVocabStructure.Designer.cs) | C# | 874 | 2 | 329 | 1,205 |
| [ToeicMaster.API/Migrations/20251231152350\_UpdateVocabStructure.cs](/ToeicMaster.API/Migrations/20251231152350_UpdateVocabStructure.cs) | C# | 92 | 3 | 15 | 110 |
| [ToeicMaster.API/Migrations/20260105064509\_AddTopicIdToQuestion.Designer.cs](/ToeicMaster.API/Migrations/20260105064509_AddTopicIdToQuestion.Designer.cs) | C# | 876 | 2 | 330 | 1,208 |
| [ToeicMaster.API/Migrations/20260105064509\_AddTopicIdToQuestion.cs](/ToeicMaster.API/Migrations/20260105064509_AddTopicIdToQuestion.cs) | C# | 22 | 3 | 4 | 29 |
| [ToeicMaster.API/Migrations/20260105124646\_UpdateAnswerIsCorrect.Designer.cs](/ToeicMaster.API/Migrations/20260105124646_UpdateAnswerIsCorrect.Designer.cs) | C# | 878 | 2 | 331 | 1,211 |
| [ToeicMaster.API/Migrations/20260105124646\_UpdateAnswerIsCorrect.cs](/ToeicMaster.API/Migrations/20260105124646_UpdateAnswerIsCorrect.cs) | C# | 22 | 3 | 4 | 29 |
| [ToeicMaster.API/Migrations/20260106143459\_levelUservocabulary.Designer.cs](/ToeicMaster.API/Migrations/20260106143459_levelUservocabulary.Designer.cs) | C# | 880 | 2 | 332 | 1,214 |
| [ToeicMaster.API/Migrations/20260106143459\_levelUservocabulary.cs](/ToeicMaster.API/Migrations/20260106143459_levelUservocabulary.cs) | C# | 23 | 3 | 4 | 30 |
| [ToeicMaster.API/Migrations/20260107082800\_newReviewVocab.Designer.cs](/ToeicMaster.API/Migrations/20260107082800_newReviewVocab.Designer.cs) | C# | 880 | 2 | 332 | 1,214 |
| [ToeicMaster.API/Migrations/20260107082800\_newReviewVocab.cs](/ToeicMaster.API/Migrations/20260107082800_newReviewVocab.cs) | C# | 14 | 3 | 6 | 23 |
| [ToeicMaster.API/Migrations/20260131025704\_AddPaymentTable.Designer.cs](/ToeicMaster.API/Migrations/20260131025704_AddPaymentTable.Designer.cs) | C# | 948 | 2 | 356 | 1,306 |
| [ToeicMaster.API/Migrations/20260131025704\_AddPaymentTable.cs](/ToeicMaster.API/Migrations/20260131025704_AddPaymentTable.cs) | C# | 58 | 3 | 6 | 67 |
| [ToeicMaster.API/Migrations/20260207\_MakePaymentResponseFieldsNullable.Designer.cs](/ToeicMaster.API/Migrations/20260207_MakePaymentResponseFieldsNullable.Designer.cs) | C# | 88 | 2 | 27 | 117 |
| [ToeicMaster.API/Migrations/20260207\_MakePaymentResponseFieldsNullable.cs](/ToeicMaster.API/Migrations/20260207_MakePaymentResponseFieldsNullable.cs) | C# | 54 | 3 | 6 | 63 |
| [ToeicMaster.API/Migrations/20260317122537\_AddAudioDurationToQuestionGroup.Designer.cs](/ToeicMaster.API/Migrations/20260317122537_AddAudioDurationToQuestionGroup.Designer.cs) | C# | 884 | 2 | 334 | 1,220 |
| [ToeicMaster.API/Migrations/20260317122537\_AddAudioDurationToQuestionGroup.cs](/ToeicMaster.API/Migrations/20260317122537_AddAudioDurationToQuestionGroup.cs) | C# | 22 | 3 | 4 | 29 |
| [ToeicMaster.API/Migrations/20260325043807\_AddAttemptGuid.cs](/ToeicMaster.API/Migrations/20260325043807_AddAttemptGuid.cs) | C# | 25 | 4 | 5 | 34 |
| [ToeicMaster.API/Migrations/20260325043958\_AddAttemptGuidAndVocabFeatures.Designer.cs](/ToeicMaster.API/Migrations/20260325043958_AddAttemptGuidAndVocabFeatures.Designer.cs) | C# | 954 | 2 | 362 | 1,318 |
| [ToeicMaster.API/Migrations/20260325043958\_AddAttemptGuidAndVocabFeatures.cs](/ToeicMaster.API/Migrations/20260325043958_AddAttemptGuidAndVocabFeatures.cs) | C# | 81 | 4 | 11 | 96 |
| [ToeicMaster.API/Migrations/AppDbContextModelSnapshot.cs](/ToeicMaster.API/Migrations/AppDbContextModelSnapshot.cs) | C# | 952 | 1 | 362 | 1,315 |
| [ToeicMaster.API/Models/Admin/CreateTestDto.cs](/ToeicMaster.API/Models/Admin/CreateTestDto.cs) | C# | 45 | 2 | 6 | 53 |
| [ToeicMaster.API/Models/Auth/AuthResponse.cs](/ToeicMaster.API/Models/Auth/AuthResponse.cs) | C# | 17 | 0 | 1 | 18 |
| [ToeicMaster.API/Models/Auth/ChangePasswordRequest.cs](/ToeicMaster.API/Models/Auth/ChangePasswordRequest.cs) | C# | 18 | 0 | 4 | 22 |
| [ToeicMaster.API/Models/Auth/GoogleLoginRequest.cs](/ToeicMaster.API/Models/Auth/GoogleLoginRequest.cs) | C# | 7 | 0 | 0 | 7 |
| [ToeicMaster.API/Models/Auth/LoginRequest.cs](/ToeicMaster.API/Models/Auth/LoginRequest.cs) | C# | 8 | 0 | 0 | 8 |
| [ToeicMaster.API/Models/Auth/RegisterRequest.cs](/ToeicMaster.API/Models/Auth/RegisterRequest.cs) | C# | 9 | 0 | 0 | 9 |
| [ToeicMaster.API/Models/Auth/TokenRequest.cs](/ToeicMaster.API/Models/Auth/TokenRequest.cs) | C# | 8 | 0 | 0 | 8 |
| [ToeicMaster.API/Models/Auth/UpdateProfileRequest.cs](/ToeicMaster.API/Models/Auth/UpdateProfileRequest.cs) | C# | 7 | 0 | 1 | 8 |
| [ToeicMaster.API/Models/Bookmark/BookmarkDto.cs](/ToeicMaster.API/Models/Bookmark/BookmarkDto.cs) | C# | 15 | 3 | 7 | 25 |
| [ToeicMaster.API/Models/Comment/CommentModels.cs](/ToeicMaster.API/Models/Comment/CommentModels.cs) | C# | 33 | 0 | 5 | 38 |
| [ToeicMaster.API/Models/Exam/SubmitTestDto.cs](/ToeicMaster.API/Models/Exam/SubmitTestDto.cs) | C# | 24 | 0 | 2 | 26 |
| [ToeicMaster.API/Models/Exam/TestResultDetailDto.cs](/ToeicMaster.API/Models/Exam/TestResultDetailDto.cs) | C# | 42 | 1 | 5 | 48 |
| [ToeicMaster.API/Models/FeedbackModels.cs](/ToeicMaster.API/Models/FeedbackModels.cs) | C# | 48 | 0 | 36 | 84 |
| [ToeicMaster.API/Models/Grammar/GrammarDto.cs](/ToeicMaster.API/Models/Grammar/GrammarDto.cs) | C# | 263 | 16 | 31 | 310 |
| [ToeicMaster.API/Models/Grammar/GrammarStatsDto.cs](/ToeicMaster.API/Models/Grammar/GrammarStatsDto.cs) | C# | 119 | 30 | 23 | 172 |
| [ToeicMaster.API/Models/TestDTO.cs](/ToeicMaster.API/Models/TestDTO.cs) | C# | 46 | 2 | 5 | 53 |
| [ToeicMaster.API/Models/Vocabulary/VocabularyDto.cs](/ToeicMaster.API/Models/Vocabulary/VocabularyDto.cs) | C# | 103 | 11 | 15 | 129 |
| [ToeicMaster.API/Program.cs](/ToeicMaster.API/Program.cs) | C# | 100 | 10 | 27 | 137 |
| [ToeicMaster.API/Properties/launchSettings.json](/ToeicMaster.API/Properties/launchSettings.json) | JSON | 23 | 0 | 1 | 24 |
| [ToeicMaster.API/Services/AiExplanationService.cs](/ToeicMaster.API/Services/AiExplanationService.cs) | C# | 410 | 48 | 113 | 571 |
| [ToeicMaster.API/Services/AzureBlobService.cs](/ToeicMaster.API/Services/AzureBlobService.cs) | C# | 46 | 11 | 15 | 72 |
| [ToeicMaster.API/Services/EmailService.cs](/ToeicMaster.API/Services/EmailService.cs) | C# | 43 | 6 | 7 | 56 |
| [ToeicMaster.API/Services/FeedbackService.cs](/ToeicMaster.API/Services/FeedbackService.cs) | C# | 130 | 0 | 25 | 155 |
| [ToeicMaster.API/Services/GrammarAiExplanationService.cs](/ToeicMaster.API/Services/GrammarAiExplanationService.cs) | C# | 126 | 12 | 35 | 173 |
| [ToeicMaster.API/Services/GrammarService.cs](/ToeicMaster.API/Services/GrammarService.cs) | C# | 1,595 | 65 | 196 | 1,856 |
| [ToeicMaster.API/Services/IGrammarService.cs](/ToeicMaster.API/Services/IGrammarService.cs) | C# | 57 | 24 | 10 | 91 |
| [ToeicMaster.API/Services/PaymentService.cs](/ToeicMaster.API/Services/PaymentService.cs) | C# | 53 | 5 | 11 | 69 |
| [ToeicMaster.API/Services/ToeicScoreService.cs](/ToeicMaster.API/Services/ToeicScoreService.cs) | C# | 31 | 0 | 6 | 37 |
| [ToeicMaster.API/ToeicMaster.API.csproj](/ToeicMaster.API/ToeicMaster.API.csproj) | XML | 34 | 0 | 4 | 38 |
| [ToeicMaster.API/md/Group 1/Gioi tu/ADJECTIVE\_PREPOSITION\_AI\_PROMPTS.md](/ToeicMaster.API/md/Group%201/Gioi%20tu/ADJECTIVE_PREPOSITION_AI_PROMPTS.md) | Markdown | 163 | 0 | 56 | 219 |
| [ToeicMaster.API/md/Group 1/Gioi tu/COMBINED\_3\_PREPOSITIONS\_60\_QUESTIONS.md](/ToeicMaster.API/md/Group%201/Gioi%20tu/COMBINED_3_PREPOSITIONS_60_QUESTIONS.md) | Markdown | 241 | 0 | 73 | 314 |
| [ToeicMaster.API/md/Group 1/Gioi tu/PREPOSITIONS\_TIME\_PLACE\_AI\_PROMPTS.md](/ToeicMaster.API/md/Group%201/Gioi%20tu/PREPOSITIONS_TIME_PLACE_AI_PROMPTS.md) | Markdown | 167 | 0 | 58 | 225 |
| [ToeicMaster.API/md/Group 1/Gioi tu/VERB\_PREPOSITION\_AI\_PROMPTS.md](/ToeicMaster.API/md/Group%201/Gioi%20tu/VERB_PREPOSITION_AI_PROMPTS.md) | Markdown | 164 | 0 | 56 | 220 |
| [ToeicMaster.API/md/Group 1/Lien tu/COMBINED\_3\_CONJUNCTIONS\_60\_QUESTIONS.md](/ToeicMaster.API/md/Group%201/Lien%20tu/COMBINED_3_CONJUNCTIONS_60_QUESTIONS.md) | Markdown | 227 | 0 | 73 | 300 |
| [ToeicMaster.API/md/Group 1/Lien tu/CONJUNCTIONS\_VS\_PREPOSITIONS\_AI\_PROMPTS.md](/ToeicMaster.API/md/Group%201/Lien%20tu/CONJUNCTIONS_VS_PREPOSITIONS_AI_PROMPTS.md) | Markdown | 163 | 0 | 58 | 221 |
| [ToeicMaster.API/md/Group 1/Lien tu/CORRELATIVE\_CONJUNCTIONS\_AI\_PROMPTS.md](/ToeicMaster.API/md/Group%201/Lien%20tu/CORRELATIVE_CONJUNCTIONS_AI_PROMPTS.md) | Markdown | 160 | 0 | 56 | 216 |
| [ToeicMaster.API/md/Group 1/Lien tu/SUBORDINATING\_CONJUNCTIONS\_AI\_PROMPTS.md](/ToeicMaster.API/md/Group%201/Lien%20tu/SUBORDINATING_CONJUNCTIONS_AI_PROMPTS.md) | Markdown | 162 | 0 | 59 | 221 |
| [ToeicMaster.API/md/Group 1/Tu Loai/GRAMMAR\_AI\_PROMPTS.md](/ToeicMaster.API/md/Group%201/Tu%20Loai/GRAMMAR_AI_PROMPTS.md) | Markdown | 359 | 0 | 101 | 460 |
| [ToeicMaster.API/md/Group 1/Tu han dinh/ARTICLES\_DEMONSTRATIVE\_AI\_PROMPTS.md](/ToeicMaster.API/md/Group%201/Tu%20han%20dinh/ARTICLES_DEMONSTRATIVE_AI_PROMPTS.md) | Markdown | 161 | 0 | 56 | 217 |
| [ToeicMaster.API/md/Group 1/Tu han dinh/COMBINED\_4\_GRAMMAR\_TOPICS\_60\_QUESTIONS.md](/ToeicMaster.API/md/Group%201/Tu%20han%20dinh/COMBINED_4_GRAMMAR_TOPICS_60_QUESTIONS.md) | Markdown | 233 | 0 | 76 | 309 |
| [ToeicMaster.API/md/Group 1/Tu han dinh/PERSONAL\_REFLEXIVE\_PRONOUNS\_AI\_PROMPTS.md](/ToeicMaster.API/md/Group%201/Tu%20han%20dinh/PERSONAL_REFLEXIVE_PRONOUNS_AI_PROMPTS.md) | Markdown | 160 | 0 | 56 | 216 |
| [ToeicMaster.API/md/Group 1/Tu han dinh/POSSESSIVE\_ADJECTIVE\_PRONOUN\_AI\_PROMPTS.md](/ToeicMaster.API/md/Group%201/Tu%20han%20dinh/POSSESSIVE_ADJECTIVE_PRONOUN_AI_PROMPTS.md) | Markdown | 158 | 0 | 56 | 214 |
| [ToeicMaster.API/md/Group 1/Tu han dinh/QUANTIFIERS\_AI\_PROMPTS.md](/ToeicMaster.API/md/Group%201/Tu%20han%20dinh/QUANTIFIERS_AI_PROMPTS.md) | Markdown | 164 | 0 | 56 | 220 |
| [ToeicMaster.API/md/Group 2/Cac thi/COMBINED\_5\_TENSES\_60\_QUESTIONS.md](/ToeicMaster.API/md/Group%202/Cac%20thi/COMBINED_5_TENSES_60_QUESTIONS.md) | Markdown | 148 | 0 | 49 | 197 |
| [ToeicMaster.API/md/Group 2/Cac thi/FUTURE\_PERFECT\_AI\_PROMPTS.md](/ToeicMaster.API/md/Group%202/Cac%20thi/FUTURE_PERFECT_AI_PROMPTS.md) | Markdown | 169 | 0 | 56 | 225 |
| [ToeicMaster.API/md/Group 2/Cac thi/PRESENT\_CONTINUOUS\_AI\_PROMPTS.md](/ToeicMaster.API/md/Group%202/Cac%20thi/PRESENT_CONTINUOUS_AI_PROMPTS.md) | Markdown | 168 | 0 | 56 | 224 |
| [ToeicMaster.API/md/Group 2/Cac thi/PRESENT\_PERFECT\_AI\_PROMPTS.md](/ToeicMaster.API/md/Group%202/Cac%20thi/PRESENT_PERFECT_AI_PROMPTS.md) | Markdown | 171 | 0 | 56 | 227 |
| [ToeicMaster.API/md/Group 2/Cac thi/SIMPLE\_FUTURE\_AI\_PROMPTS.md](/ToeicMaster.API/md/Group%202/Cac%20thi/SIMPLE_FUTURE_AI_PROMPTS.md) | Markdown | 171 | 0 | 56 | 227 |
| [ToeicMaster.API/md/Group 2/Cac thi/SIMPLE\_PAST\_AI\_PROMPTS.md](/ToeicMaster.API/md/Group%202/Cac%20thi/SIMPLE_PAST_AI_PROMPTS.md) | Markdown | 171 | 0 | 57 | 228 |
| [ToeicMaster.API/md/Group 2/Cac thi/SIMPLE\_PRESENT\_AI\_PROMPTS.md](/ToeicMaster.API/md/Group%202/Cac%20thi/SIMPLE_PRESENT_AI_PROMPTS.md) | Markdown | 169 | 0 | 56 | 225 |
| [ToeicMaster.API/md/Group 2/Cau bi dong/COMBINED\_2\_PASSIVE\_VOICE\_60\_QUESTIONS.md](/ToeicMaster.API/md/Group%202/Cau%20bi%20dong/COMBINED_2_PASSIVE_VOICE_60_QUESTIONS.md) | Markdown | 208 | 0 | 70 | 278 |
| [ToeicMaster.API/md/Group 2/Cau bi dong/PASSIVE\_VOICE\_BASIC\_AI\_PROMPTS.md](/ToeicMaster.API/md/Group%202/Cau%20bi%20dong/PASSIVE_VOICE_BASIC_AI_PROMPTS.md) | Markdown | 172 | 0 | 62 | 234 |
| [ToeicMaster.API/md/Group 2/Cau bi dong/PASSIVE\_VOICE\_MODAL\_VERBS\_AI\_PROMPTS.md](/ToeicMaster.API/md/Group%202/Cau%20bi%20dong/PASSIVE_VOICE_MODAL_VERBS_AI_PROMPTS.md) | Markdown | 162 | 0 | 62 | 224 |
| [ToeicMaster.API/md/Group 2/Danh dong tu va dong tu nguyen the/COMBINED\_2\_GERUNDS\_INFINITIVES\_60\_QUESTIONS.md](/ToeicMaster.API/md/Group%202/Danh%20dong%20tu%20va%20dong%20tu%20nguyen%20the/COMBINED_2_GERUNDS_INFINITIVES_60_QUESTIONS.md) | Markdown | 204 | 0 | 70 | 274 |
| [ToeicMaster.API/md/Group 2/Danh dong tu va dong tu nguyen the/GERUNDS\_VERBS\_VING\_AI\_PROMPTS.md](/ToeicMaster.API/md/Group%202/Danh%20dong%20tu%20va%20dong%20tu%20nguyen%20the/GERUNDS_VERBS_VING_AI_PROMPTS.md) | Markdown | 165 | 0 | 62 | 227 |
| [ToeicMaster.API/md/Group 2/Danh dong tu va dong tu nguyen the/INFINITIVES\_VERBS\_TOV\_AI\_PROMPTS.md](/ToeicMaster.API/md/Group%202/Danh%20dong%20tu%20va%20dong%20tu%20nguyen%20the/INFINITIVES_VERBS_TOV_AI_PROMPTS.md) | Markdown | 165 | 0 | 62 | 227 |
| [ToeicMaster.API/md/Group 2/Phan tu/VING\_VED\_ADJECTIVES\_AI\_PROMPTS.md](/ToeicMaster.API/md/Group%202/Phan%20tu/VING_VED_ADJECTIVES_AI_PROMPTS.md) | Markdown | 188 | 0 | 70 | 258 |
| [ToeicMaster.API/md/Group 2/Su hoa hop chu ngu , vi ngu/COMBINED\_2\_SUBJECT\_VERB\_60\_QUESTIONS.md](/ToeicMaster.API/md/Group%202/Su%20hoa%20hop%20chu%20ngu%20,%20vi%20ngu/COMBINED_2_SUBJECT_VERB_60_QUESTIONS.md) | Markdown | 210 | 0 | 70 | 280 |
| [ToeicMaster.API/md/Group 2/Su hoa hop chu ngu , vi ngu/SUBJECT\_VERB\_GERUND\_INFINITIVE\_AI\_PROMPTS.md](/ToeicMaster.API/md/Group%202/Su%20hoa%20hop%20chu%20ngu%20,%20vi%20ngu/SUBJECT_VERB_GERUND_INFINITIVE_AI_PROMPTS.md) | Markdown | 159 | 0 | 57 | 216 |
| [ToeicMaster.API/md/Group 2/Su hoa hop chu ngu , vi ngu/SUBJECT\_VERB\_PREPOSITIONAL\_PHRASES\_AI\_PROMPTS.md](/ToeicMaster.API/md/Group%202/Su%20hoa%20hop%20chu%20ngu%20,%20vi%20ngu/SUBJECT_VERB_PREPOSITIONAL_PHRASES_AI_PROMPTS.md) | Markdown | 153 | 0 | 55 | 208 |
| [ToeicMaster.API/md/Group 3/Cau dieu kien/COMBINED\_2\_CONDITIONAL\_60\_QUESTIONS.md](/ToeicMaster.API/md/Group%203/Cau%20dieu%20kien/COMBINED_2_CONDITIONAL_60_QUESTIONS.md) | Markdown | 205 | 0 | 70 | 275 |
| [ToeicMaster.API/md/Group 3/Cau dieu kien/CONDITIONAL\_INVERSION\_AI\_PROMPTS.md](/ToeicMaster.API/md/Group%203/Cau%20dieu%20kien/CONDITIONAL_INVERSION_AI_PROMPTS.md) | Markdown | 190 | 0 | 71 | 261 |
| [ToeicMaster.API/md/Group 3/Cau dieu kien/CONDITIONAL\_TYPE\_1\_2\_AI\_PROMPTS.md](/ToeicMaster.API/md/Group%203/Cau%20dieu%20kien/CONDITIONAL_TYPE_1_2_AI_PROMPTS.md) | Markdown | 179 | 0 | 68 | 247 |
| [ToeicMaster.API/md/Group 3/Cau so sanh/COMBINED\_2\_COMPARISON\_60\_QUESTIONS.md](/ToeicMaster.API/md/Group%203/Cau%20so%20sanh/COMBINED_2_COMPARISON_60_QUESTIONS.md) | Markdown | 205 | 0 | 70 | 275 |
| [ToeicMaster.API/md/Group 3/Cau so sanh/COMPARATIVE\_INTENSIFIERS\_AI\_PROMPTS.md](/ToeicMaster.API/md/Group%203/Cau%20so%20sanh/COMPARATIVE_INTENSIFIERS_AI_PROMPTS.md) | Markdown | 189 | 0 | 74 | 263 |
| [ToeicMaster.API/md/Group 3/Cau so sanh/SUPERLATIVE\_AI\_PROMPTS.md](/ToeicMaster.API/md/Group%203/Cau%20so%20sanh/SUPERLATIVE_AI_PROMPTS.md) | Markdown | 190 | 0 | 75 | 265 |
| [ToeicMaster.API/md/Group 3/Menh de quan he/COMBINED\_2\_RELATIVE\_CLAUSES\_60\_QUESTIONS.md](/ToeicMaster.API/md/Group%203/Menh%20de%20quan%20he/COMBINED_2_RELATIVE_CLAUSES_60_QUESTIONS.md) | Markdown | 202 | 0 | 70 | 272 |
| [ToeicMaster.API/md/Group 3/Menh de quan he/REDUCED\_RELATIVE\_CLAUSES\_AI\_PROMPTS.md](/ToeicMaster.API/md/Group%203/Menh%20de%20quan%20he/REDUCED_RELATIVE_CLAUSES_AI_PROMPTS.md) | Markdown | 182 | 0 | 71 | 253 |
| [ToeicMaster.API/md/Group 3/Menh de quan he/RELATIVE\_PRONOUNS\_AI\_PROMPTS.md](/ToeicMaster.API/md/Group%203/Menh%20de%20quan%20he/RELATIVE_PRONOUNS_AI_PROMPTS.md) | Markdown | 195 | 0 | 73 | 268 |
| [ToeicMaster.API/md/Group 9/SUBJUNCTIVE\_MOOD\_AI\_PROMPTS.md](/ToeicMaster.API/md/Group%209/SUBJUNCTIVE_MOOD_AI_PROMPTS.md) | Markdown | 184 | 0 | 74 | 258 |
| [ToeicMaster.API/md/prompt.md](/ToeicMaster.API/md/prompt.md) | Markdown | 2 | 0 | 1 | 3 |
| [ToeicMaster.API/render.yaml](/ToeicMaster.API/render.yaml) | YAML | 14 | 0 | 1 | 15 |
| [toeic-web/.dockerignore](/toeic-web/.dockerignore) | Ignore | -16 | 0 | -1 | -17 |
| [toeic-web/Dockerfile](/toeic-web/Dockerfile) | Docker | -15 | -2 | -2 | -19 |
| [toeic-web/PWA\_TESTING.md](/toeic-web/PWA_TESTING.md) | Markdown | -96 | 0 | -26 | -122 |
| [toeic-web/README.md](/toeic-web/README.md) | Markdown | -23 | 0 | -14 | -37 |
| [toeic-web/app/admin/page.tsx](/toeic-web/app/admin/page.tsx) | TypeScript JSX | -442 | -28 | -57 | -527 |
| [toeic-web/app/components/MyComponent.tsx](/toeic-web/app/components/MyComponent.tsx) | TypeScript JSX | -8 | 0 | -3 | -11 |
| [toeic-web/app/components/admin/DashboardTab.tsx](/toeic-web/app/components/admin/DashboardTab.tsx) | TypeScript JSX | -81 | 0 | -10 | -91 |
| [toeic-web/app/components/admin/FeedbackTab.tsx](/toeic-web/app/components/admin/FeedbackTab.tsx) | TypeScript JSX | -5 | 0 | -3 | -8 |
| [toeic-web/app/components/admin/QuestionsTab.tsx](/toeic-web/app/components/admin/QuestionsTab.tsx) | TypeScript JSX | -96 | 0 | -6 | -102 |
| [toeic-web/app/components/admin/TestActionsTab.tsx](/toeic-web/app/components/admin/TestActionsTab.tsx) | TypeScript JSX | -170 | -4 | -10 | -184 |
| [toeic-web/app/components/admin/TestsTab.tsx](/toeic-web/app/components/admin/TestsTab.tsx) | TypeScript JSX | -110 | -1 | -8 | -119 |
| [toeic-web/app/components/admin/UsersTab.tsx](/toeic-web/app/components/admin/UsersTab.tsx) | TypeScript JSX | -112 | -2 | -6 | -120 |
| [toeic-web/app/components/admin/VocabularyManagement.tsx](/toeic-web/app/components/admin/VocabularyManagement.tsx) | TypeScript JSX | -95 | -21 | -13 | -129 |
| [toeic-web/app/components/admin/VocabularyTab.tsx](/toeic-web/app/components/admin/VocabularyTab.tsx) | TypeScript JSX | -9 | 0 | -3 | -12 |
| [toeic-web/app/components/audio/AudioPlayer.tsx](/toeic-web/app/components/audio/AudioPlayer.tsx) | TypeScript JSX | -210 | -12 | -29 | -251 |
| [toeic-web/app/components/boomarks/BookmarkNoteModal.tsx](/toeic-web/app/components/boomarks/BookmarkNoteModal.tsx) | TypeScript JSX | -48 | -3 | -8 | -59 |
| [toeic-web/app/components/boomarks/ReviewSetupModal.tsx](/toeic-web/app/components/boomarks/ReviewSetupModal.tsx) | TypeScript JSX | -241 | -22 | -31 | -294 |
| [toeic-web/app/components/boomarks/ReviewTestModal.tsx](/toeic-web/app/components/boomarks/ReviewTestModal.tsx) | TypeScript JSX | -402 | -51 | -45 | -498 |
| [toeic-web/app/components/boomarks/SidebarFilterItem.tsx](/toeic-web/app/components/boomarks/SidebarFilterItem.tsx) | TypeScript JSX | -33 | -2 | -4 | -39 |
| [toeic-web/app/components/cards/FeatureCard.tsx](/toeic-web/app/components/cards/FeatureCard.tsx) | TypeScript JSX | -46 | -9 | -9 | -64 |
| [toeic-web/app/components/cards/StatsCard.tsx](/toeic-web/app/components/cards/StatsCard.tsx) | TypeScript JSX | -60 | -6 | -7 | -73 |
| [toeic-web/app/components/cards/TestCard.tsx](/toeic-web/app/components/cards/TestCard.tsx) | TypeScript JSX | -71 | -12 | -8 | -91 |
| [toeic-web/app/components/cards/index.ts](/toeic-web/app/components/cards/index.ts) | TypeScript | -3 | -1 | -1 | -5 |
| [toeic-web/app/components/comments/CommentForm.tsx](/toeic-web/app/components/comments/CommentForm.tsx) | TypeScript JSX | -120 | -4 | -16 | -140 |
| [toeic-web/app/components/comments/CommentItem.tsx](/toeic-web/app/components/comments/CommentItem.tsx) | TypeScript JSX | -175 | -7 | -21 | -203 |
| [toeic-web/app/components/comments/CommentList.tsx](/toeic-web/app/components/comments/CommentList.tsx) | TypeScript JSX | -41 | 0 | -6 | -47 |
| [toeic-web/app/components/comments/CommentSection.tsx](/toeic-web/app/components/comments/CommentSection.tsx) | TypeScript JSX | -140 | -1 | -16 | -157 |
| [toeic-web/app/components/comments/UserAvatar.tsx](/toeic-web/app/components/comments/UserAvatar.tsx) | TypeScript JSX | -34 | 0 | -7 | -41 |
| [toeic-web/app/components/comments/index.ts](/toeic-web/app/components/comments/index.ts) | TypeScript | -5 | 0 | -1 | -6 |
| [toeic-web/app/components/common/AlertMessage.tsx](/toeic-web/app/components/common/AlertMessage.tsx) | TypeScript JSX | -75 | -4 | -5 | -84 |
| [toeic-web/app/components/common/EmptyState.tsx](/toeic-web/app/components/common/EmptyState.tsx) | TypeScript JSX | -45 | -6 | -4 | -55 |
| [toeic-web/app/components/common/LoadingSpinner.tsx](/toeic-web/app/components/common/LoadingSpinner.tsx) | TypeScript JSX | -37 | -3 | -6 | -46 |
| [toeic-web/app/components/common/Pagination.tsx](/toeic-web/app/components/common/Pagination.tsx) | TypeScript JSX | -85 | -5 | -11 | -101 |
| [toeic-web/app/components/common/ProgressBar.tsx](/toeic-web/app/components/common/ProgressBar.tsx) | TypeScript JSX | -47 | -5 | -6 | -58 |
| [toeic-web/app/components/common/ThemeToggle.tsx](/toeic-web/app/components/common/ThemeToggle.tsx) | TypeScript JSX | -63 | -7 | -9 | -79 |
| [toeic-web/app/components/common/index.ts](/toeic-web/app/components/common/index.ts) | TypeScript | -6 | -1 | -1 | -8 |
| [toeic-web/app/components/exam/AudioPlayer.tsx](/toeic-web/app/components/exam/AudioPlayer.tsx) | TypeScript JSX | -39 | -7 | -5 | -51 |
| [toeic-web/app/components/exam/PartHeader.tsx](/toeic-web/app/components/exam/PartHeader.tsx) | TypeScript JSX | -31 | -3 | -5 | -39 |
| [toeic-web/app/components/exam/QuestionPalette.tsx](/toeic-web/app/components/exam/QuestionPalette.tsx) | TypeScript JSX | -73 | -8 | -8 | -89 |
| [toeic-web/app/components/exam/index.ts](/toeic-web/app/components/exam/index.ts) | TypeScript | -3 | -1 | -1 | -5 |
| [toeic-web/app/components/feedback/AdminFeedbackPanel.tsx](/toeic-web/app/components/feedback/AdminFeedbackPanel.tsx) | TypeScript JSX | -243 | -9 | -21 | -273 |
| [toeic-web/app/components/feedback/FeedbackForm.tsx](/toeic-web/app/components/feedback/FeedbackForm.tsx) | TypeScript JSX | -199 | -4 | -15 | -218 |
| [toeic-web/app/components/feedback/FeedbackList.tsx](/toeic-web/app/components/feedback/FeedbackList.tsx) | TypeScript JSX | -140 | -2 | -14 | -156 |
| [toeic-web/app/components/feedback/FeedbackModal.tsx](/toeic-web/app/components/feedback/FeedbackModal.tsx) | TypeScript JSX | -59 | -2 | -10 | -71 |
| [toeic-web/app/components/feedback/FeedbackSection.tsx](/toeic-web/app/components/feedback/FeedbackSection.tsx) | TypeScript JSX | -18 | 0 | -4 | -22 |
| [toeic-web/app/components/feedback/FeedbackWidget.tsx](/toeic-web/app/components/feedback/FeedbackWidget.tsx) | TypeScript JSX | -19 | -2 | -5 | -26 |
| [toeic-web/app/components/feedback/index.ts](/toeic-web/app/components/feedback/index.ts) | TypeScript | -6 | 0 | -1 | -7 |
| [toeic-web/app/components/forms/FormInput.tsx](/toeic-web/app/components/forms/FormInput.tsx) | TypeScript JSX | -87 | -15 | -8 | -110 |
| [toeic-web/app/components/forms/SubmitButton.tsx](/toeic-web/app/components/forms/SubmitButton.tsx) | TypeScript JSX | -72 | -9 | -5 | -86 |
| [toeic-web/app/components/forms/index.ts](/toeic-web/app/components/forms/index.ts) | TypeScript | -2 | -1 | -1 | -4 |
| [toeic-web/app/components/grammar/GrammarLessonTab.tsx](/toeic-web/app/components/grammar/GrammarLessonTab.tsx) | TypeScript JSX | -242 | -15 | -20 | -277 |
| [toeic-web/app/components/grammar/GrammarPracticeTab.tsx](/toeic-web/app/components/grammar/GrammarPracticeTab.tsx) | TypeScript JSX | -354 | -21 | -39 | -414 |
| [toeic-web/app/components/grammar/GrammarProgressTab.tsx](/toeic-web/app/components/grammar/GrammarProgressTab.tsx) | TypeScript JSX | -197 | -4 | -23 | -224 |
| [toeic-web/app/components/grammar/GrammarQuestion.tsx](/toeic-web/app/components/grammar/GrammarQuestion.tsx) | TypeScript JSX | -175 | -10 | -16 | -201 |
| [toeic-web/app/components/grammar/GrammarTopicCard.tsx](/toeic-web/app/components/grammar/GrammarTopicCard.tsx) | TypeScript JSX | -84 | -7 | -13 | -104 |
| [toeic-web/app/components/grammar/GrammarTopicDetail.tsx](/toeic-web/app/components/grammar/GrammarTopicDetail.tsx) | TypeScript JSX | -125 | -7 | -14 | -146 |
| [toeic-web/app/components/grammar/GrammarTopicGrid.tsx](/toeic-web/app/components/grammar/GrammarTopicGrid.tsx) | TypeScript JSX | -58 | 0 | -7 | -65 |
| [toeic-web/app/components/grammar/GrammarTopicRulesList.tsx](/toeic-web/app/components/grammar/GrammarTopicRulesList.tsx) | TypeScript JSX | -147 | -6 | -16 | -169 |
| [toeic-web/app/components/grammar/GroupAnalysis.tsx](/toeic-web/app/components/grammar/GroupAnalysis.tsx) | TypeScript JSX | -236 | -22 | -29 | -287 |
| [toeic-web/app/components/grammar/RandomPracticeTab.tsx](/toeic-web/app/components/grammar/RandomPracticeTab.tsx) | TypeScript JSX | -84 | -7 | -11 | -102 |
| [toeic-web/app/components/highlight/HighlightText.tsx](/toeic-web/app/components/highlight/HighlightText.tsx) | TypeScript JSX | -236 | -20 | -42 | -298 |
| [toeic-web/app/components/index.ts](/toeic-web/app/components/index.ts) | TypeScript | -8 | -8 | -8 | -24 |
| [toeic-web/app/components/layout/Footer.tsx](/toeic-web/app/components/layout/Footer.tsx) | TypeScript JSX | -57 | -5 | -9 | -71 |
| [toeic-web/app/components/layout/MobileBottomNav.tsx](/toeic-web/app/components/layout/MobileBottomNav.tsx) | TypeScript JSX | -88 | -15 | -10 | -113 |
| [toeic-web/app/components/layout/PageHeader.tsx](/toeic-web/app/components/layout/PageHeader.tsx) | TypeScript JSX | -170 | -25 | -20 | -215 |
| [toeic-web/app/components/layout/SimplePageHeader.tsx](/toeic-web/app/components/layout/SimplePageHeader.tsx) | TypeScript JSX | -40 | -6 | -5 | -51 |
| [toeic-web/app/components/layout/index.ts](/toeic-web/app/components/layout/index.ts) | TypeScript | -4 | -1 | -1 | -6 |
| [toeic-web/app/components/profile/ProfileInfoTab.tsx](/toeic-web/app/components/profile/ProfileInfoTab.tsx) | TypeScript JSX | -211 | -6 | -15 | -232 |
| [toeic-web/app/components/profile/ProfilePasswordTab.tsx](/toeic-web/app/components/profile/ProfilePasswordTab.tsx) | TypeScript JSX | -136 | -1 | -10 | -147 |
| [toeic-web/app/components/results/AnswerOptionResult.tsx](/toeic-web/app/components/results/AnswerOptionResult.tsx) | TypeScript JSX | -62 | -1 | -5 | -68 |
| [toeic-web/app/components/results/ResultQuestionItem.tsx](/toeic-web/app/components/results/ResultQuestionItem.tsx) | TypeScript JSX | -239 | -8 | -18 | -265 |
| [toeic-web/app/components/results/ResultRightSidebar.tsx](/toeic-web/app/components/results/ResultRightSidebar.tsx) | TypeScript JSX | -192 | -17 | -21 | -230 |
| [toeic-web/app/components/tests/AnswerOption.tsx](/toeic-web/app/components/tests/AnswerOption.tsx) | TypeScript JSX | -39 | 0 | -3 | -42 |
| [toeic-web/app/components/tests/ExamRightSidebar.tsx](/toeic-web/app/components/tests/ExamRightSidebar.tsx) | TypeScript JSX | -165 | -7 | -16 | -188 |
| [toeic-web/app/components/vocabulary/Flashcard.tsx](/toeic-web/app/components/vocabulary/Flashcard.tsx) | TypeScript JSX | -81 | -7 | -16 | -104 |
| [toeic-web/app/components/vocabulary/MatchingGame.tsx](/toeic-web/app/components/vocabulary/MatchingGame.tsx) | TypeScript JSX | -329 | -30 | -43 | -402 |
| [toeic-web/app/components/vocabulary/TopicCard.tsx](/toeic-web/app/components/vocabulary/TopicCard.tsx) | TypeScript JSX | -354 | -31 | -54 | -439 |
| [toeic-web/app/components/vocabulary/VocabularyTest.tsx](/toeic-web/app/components/vocabulary/VocabularyTest.tsx) | TypeScript JSX | -553 | -34 | -54 | -641 |
| [toeic-web/app/components/vocabulary/WordDetailFeedback.tsx](/toeic-web/app/components/vocabulary/WordDetailFeedback.tsx) | TypeScript JSX | -31 | -7 | -6 | -44 |
| [toeic-web/app/contexts/AudioContext.tsx](/toeic-web/app/contexts/AudioContext.tsx) | TypeScript JSX | -34 | -2 | -8 | -44 |
| [toeic-web/app/contexts/AuthContext.tsx](/toeic-web/app/contexts/AuthContext.tsx) | TypeScript JSX | -179 | -14 | -33 | -226 |
| [toeic-web/app/contexts/ThemeContext.tsx](/toeic-web/app/contexts/ThemeContext.tsx) | TypeScript JSX | -76 | -2 | -22 | -100 |
| [toeic-web/app/feedback/page.tsx](/toeic-web/app/feedback/page.tsx) | TypeScript JSX | -52 | -3 | -8 | -63 |
| [toeic-web/app/forgot-password/page.tsx](/toeic-web/app/forgot-password/page.tsx) | TypeScript JSX | -105 | -5 | -11 | -121 |
| [toeic-web/app/globals.css](/toeic-web/app/globals.css) | PostCSS | -186 | -19 | -42 | -247 |
| [toeic-web/app/grammar/groups/\[groupId\]/page.tsx](/toeic-web/app/grammar/groups/%5BgroupId%5D/page.tsx) | TypeScript JSX | -187 | -10 | -24 | -221 |
| [toeic-web/app/grammar/groups/\[groupId\]/topics/\[topicId\]/page.tsx](/toeic-web/app/grammar/groups/%5BgroupId%5D/topics/%5BtopicId%5D/page.tsx) | TypeScript JSX | -125 | -6 | -19 | -150 |
| [toeic-web/app/grammar/page.tsx](/toeic-web/app/grammar/page.tsx) | TypeScript JSX | -277 | -12 | -23 | -312 |
| [toeic-web/app/layout.tsx](/toeic-web/app/layout.tsx) | TypeScript JSX | -61 | -1 | -5 | -67 |
| [toeic-web/app/login/page.tsx](/toeic-web/app/login/page.tsx) | TypeScript JSX | -185 | -6 | -23 | -214 |
| [toeic-web/app/offline/page.tsx](/toeic-web/app/offline/page.tsx) | TypeScript JSX | -61 | -6 | -9 | -76 |
| [toeic-web/app/page.tsx](/toeic-web/app/page.tsx) | TypeScript JSX | -310 | -18 | -26 | -354 |
| [toeic-web/app/practice/components/BookmarksTab.tsx](/toeic-web/app/practice/components/BookmarksTab.tsx) | TypeScript JSX | -492 | -32 | -41 | -565 |
| [toeic-web/app/practice/components/HistoryTab.tsx](/toeic-web/app/practice/components/HistoryTab.tsx) | TypeScript JSX | -276 | -9 | -24 | -309 |
| [toeic-web/app/practice/components/PracticeTab.tsx](/toeic-web/app/practice/components/PracticeTab.tsx) | TypeScript JSX | -159 | -10 | -11 | -180 |
| [toeic-web/app/practice/components/ProgressTab.tsx](/toeic-web/app/practice/components/ProgressTab.tsx) | TypeScript JSX | -244 | -7 | -23 | -274 |
| [toeic-web/app/practice/page.tsx](/toeic-web/app/practice/page.tsx) | TypeScript JSX | -137 | -11 | -13 | -161 |
| [toeic-web/app/profile/page.tsx](/toeic-web/app/profile/page.tsx) | TypeScript JSX | -88 | -5 | -17 | -110 |
| [toeic-web/app/providers.tsx](/toeic-web/app/providers.tsx) | TypeScript JSX | -21 | -1 | -3 | -25 |
| [toeic-web/app/register/page.tsx](/toeic-web/app/register/page.tsx) | TypeScript JSX | -397 | -11 | -22 | -430 |
| [toeic-web/app/reset-password/page.tsx](/toeic-web/app/reset-password/page.tsx) | TypeScript JSX | -180 | -10 | -22 | -212 |
| [toeic-web/app/results/\[id\]/page.tsx](/toeic-web/app/results/%5Bid%5D/page.tsx) | TypeScript JSX | -1,385 | -57 | -90 | -1,532 |
| [toeic-web/app/services/adminService.ts](/toeic-web/app/services/adminService.ts) | TypeScript | -95 | -13 | -20 | -128 |
| [toeic-web/app/services/authService.ts](/toeic-web/app/services/authService.ts) | TypeScript | -39 | -9 | -9 | -57 |
| [toeic-web/app/services/axiosClient.ts](/toeic-web/app/services/axiosClient.ts) | TypeScript | -89 | -15 | -22 | -126 |
| [toeic-web/app/services/bookmarkService.ts](/toeic-web/app/services/bookmarkService.ts) | TypeScript | -52 | -9 | -9 | -70 |
| [toeic-web/app/services/commentService.ts](/toeic-web/app/services/commentService.ts) | TypeScript | -47 | -24 | -10 | -81 |
| [toeic-web/app/services/feedbackService.ts](/toeic-web/app/services/feedbackService.ts) | TypeScript | -175 | 0 | -27 | -202 |
| [toeic-web/app/services/grammarService.ts](/toeic-web/app/services/grammarService.ts) | TypeScript | -219 | -90 | -51 | -360 |
| [toeic-web/app/services/paymentService.ts](/toeic-web/app/services/paymentService.ts) | TypeScript | -68 | -9 | -15 | -92 |
| [toeic-web/app/services/practiceService.ts](/toeic-web/app/services/practiceService.ts) | TypeScript | -41 | -6 | -7 | -54 |
| [toeic-web/app/services/statisticsService.ts](/toeic-web/app/services/statisticsService.ts) | TypeScript | -32 | -5 | -7 | -44 |
| [toeic-web/app/services/testService.ts](/toeic-web/app/services/testService.ts) | TypeScript | -47 | -9 | -7 | -63 |
| [toeic-web/app/services/vocabularyService.ts](/toeic-web/app/services/vocabularyService.ts) | TypeScript | -98 | -27 | -24 | -149 |
| [toeic-web/app/subscription/page.tsx](/toeic-web/app/subscription/page.tsx) | TypeScript JSX | -372 | -15 | -37 | -424 |
| [toeic-web/app/tests/\[id\]/page.tsx](/toeic-web/app/tests/%5Bid%5D/page.tsx) | TypeScript JSX | -197 | -16 | -17 | -230 |
| [toeic-web/app/tests/\[id\]/start/page.tsx](/toeic-web/app/tests/%5Bid%5D/start/page.tsx) | TypeScript JSX | -728 | -50 | -50 | -828 |
| [toeic-web/app/types.ts](/toeic-web/app/types.ts) | TypeScript | -468 | -47 | -57 | -572 |
| [toeic-web/app/vocabulary/\[topicId\]/page.tsx](/toeic-web/app/vocabulary/%5BtopicId%5D/page.tsx) | TypeScript JSX | -538 | -21 | -42 | -601 |
| [toeic-web/app/vocabulary/page.tsx](/toeic-web/app/vocabulary/page.tsx) | TypeScript JSX | -144 | -6 | -14 | -164 |
| [toeic-web/eslint.config.mjs](/toeic-web/eslint.config.mjs) | JavaScript | -14 | -2 | -3 | -19 |
| [toeic-web/lib/date.ts](/toeic-web/lib/date.ts) | TypeScript | -33 | -10 | -10 | -53 |
| [toeic-web/lib/utils.ts](/toeic-web/lib/utils.ts) | TypeScript | -5 | 0 | -2 | -7 |
| [toeic-web/next.config.ts](/toeic-web/next.config.ts) | TypeScript | -46 | -1 | -3 | -50 |
| [toeic-web/package.json](/toeic-web/package.json) | JSON | -42 | 0 | -1 | -43 |
| [toeic-web/postcss.config.mjs](/toeic-web/postcss.config.mjs) | JavaScript | -6 | 0 | -2 | -8 |
| [toeic-web/public/file.svg](/toeic-web/public/file.svg) | XML | -1 | 0 | 0 | -1 |
| [toeic-web/public/globe.svg](/toeic-web/public/globe.svg) | XML | -1 | 0 | 0 | -1 |
| [toeic-web/public/icons/README.md](/toeic-web/public/icons/README.md) | Markdown | -42 | 0 | -10 | -52 |
| [toeic-web/public/manifest.json](/toeic-web/public/manifest.json) | JSON | -94 | 0 | 0 | -94 |
| [toeic-web/public/next.svg](/toeic-web/public/next.svg) | XML | -1 | 0 | 0 | -1 |
| [toeic-web/public/window.svg](/toeic-web/public/window.svg) | XML | -1 | 0 | 0 | -1 |
| [toeic-web/render.yaml](/toeic-web/render.yaml) | YAML | -14 | 0 | -1 | -15 |
| [toeic-web/tailwind.config.ts](/toeic-web/tailwind.config.ts) | TypeScript | -29 | 0 | -3 | -32 |
| [toeic-web/tsconfig.json](/toeic-web/tsconfig.json) | JSON with Comments | -34 | 0 | -1 | -35 |

[Summary](results.md) / [Details](details.md) / [Diff Summary](diff.md) / Diff Details