# 📚 ToeicMaster API Documentation

## Thông tin chung

- **Base URL**: `/api/v1`
- **Authentication**: JWT Bearer Token
- **Content-Type**: `application/json` (trừ khi có ghi chú khác)

---

## 📌 Mục lục

1. [AuthController](#1-authcontroller---xác-thực)
2. [TestsController](#2-testscontroller---bài-thi)
3. [PracticeController](#3-practicecontroller---luyện-tập)
4. [BookmarksController](#4-bookmarkscontroller---đánh-dấu-câu-hỏi)
5. [VocabularyController](#5-vocabularycontroller---từ-vựng)
6. [LeaderboardController](#6-leaderboardcontroller---bảng-xếp-hạng)
7. [StatisticsController](#7-statisticscontroller---thống-kê)
8. [AdminController](#8-admincontroller---import-dữ-liệu)
9. [AdminManagementController](#9-adminmanagementcontroller---quản-lý-admin)
10. [TestManagementController](#10-testmanagementcontroller---quản-lý-đề-thi)
11. [AiTestController](#11-aitestcontroller---test-ai)

---

## 1. AuthController - Xác thực

**Route**: `/api/v1/Auth`

### 1.1 Đăng ký
```
POST /api/v1/Auth/register
```

**Request Body:**
```json
{
  "email": "string",
  "password": "string",
  "fullName": "string"
}
```

**Response:**
```json
{
  "message": "Đăng ký thành công!"
}
```

---

### 1.2 Đăng nhập
```
POST /api/v1/Auth/login
```

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "token": "string (JWT)",
  "refreshToken": "string",
  "user": {
    "id": 1,
    "email": "string",
    "fullName": "string",
    "balance": 0,
    "isPremium": false
  }
}
```

---

### 1.3 Refresh Token
```
POST /api/v1/Auth/refresh-token
```

**Request Body:**
```json
{
  "refreshToken": "string"
}
```

**Response:**
```json
{
  "token": "string",
  "refreshToken": "string"
}
```

---

### 1.4 Lấy thông tin bản thân
```
GET /api/v1/Auth/me
```

**🔒 Authorization Required**

**Response:**
```json
{
  "id": 1,
  "fullName": "string",
  "email": "string",
  "balance": 0,
  "isPremium": false,
  "premiumExpiredAt": "datetime"
}
```

---

### 1.5 Cập nhật hồ sơ
```
PUT /api/v1/Auth/update-profile
```

**🔒 Authorization Required**

**Request Body:**
```json
{
  "fullName": "string"
}
```

**Response:**
```json
{
  "message": "Cập nhật thông tin thành công!",
  "fullName": "string"
}
```

---

### 1.6 Đổi mật khẩu
```
POST /api/v1/Auth/change-password
```

**🔒 Authorization Required**

**Request Body:**
```json
{
  "currentPassword": "string",
  "newPassword": "string"
}
```

**Response:**
```json
{
  "message": "Đổi mật khẩu thành công!"
}
```

---

## 2. TestsController - Bài thi

**Route**: `/api/v1/Tests`

### 2.1 Lấy danh sách đề thi
```
GET /api/v1/Tests
```

**Query Parameters:**
| Tham số | Kiểu | Mặc định | Mô tả |
|---------|------|----------|-------|
| page | int | 1 | Số trang |
| limit | int | 10 | Số lượng/trang |
| search | string | null | Tìm kiếm theo tiêu đề |

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "title": "ETS 2024 Test 1",
      "slug": "ets-2024-test-1",
      "duration": 120,
      "totalQuestions": 200
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalRecord": 50,
    "totalPages": 5
  }
}
```

---

### 2.2 Lấy chi tiết đề thi đầy đủ
```
GET /api/v1/Tests/{id}/full
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "ETS 2024 Test 1",
    "duration": 120,
    "parts": [
      {
        "id": 1,
        "name": "Part 1: Photographs",
        "groups": [
          {
            "id": 1,
            "textContent": "string",
            "imageUrl": "/uploads/images/...",
            "audioUrl": "/uploads/audio/...",
            "questions": [
              {
                "id": 1,
                "questionNo": 1,
                "content": "string",
                "answers": [
                  { "label": "A", "content": "string" },
                  { "label": "B", "content": "string" },
                  { "label": "C", "content": "string" },
                  { "label": "D", "content": "string" }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
}
```

---

### 2.3 Nộp bài thi
```
POST /api/v1/Tests/submit
```

**🔒 Authorization Required**

**Request Body:**
```json
{
  "testId": 1,
  "answers": [
    { "questionId": 1, "selectedOption": "A" },
    { "questionId": 2, "selectedOption": "B" }
  ]
}
```

**Response:**
```json
{
  "attemptId": 1,
  "totalScore": 150,
  "totalQuestions": 200,
  "message": "Nộp bài thành công!"
}
```

---

### 2.4 Lấy kết quả bài thi
```
GET /api/v1/Tests/results/{attemptId}
```

**🔒 Authorization Required**

**Response:**
```json
{
  "attemptId": 1,
  "testTitle": "ETS 2024 Test 1",
  "totalScore": 150,
  "totalQuestions": 200,
  "completedAt": "datetime",
  "questions": [
    {
      "questionId": 1,
      "questionNo": 1,
      "content": "string",
      "userSelected": "A",
      "correctOption": "B",
      "isCorrect": false,
      "shortExplanation": "string",
      "fullExplanation": "string",
      "partNumber": 1,
      "partName": "Part 1",
      "imageUrl": "string",
      "audioUrl": "string",
      "answers": [
        { "label": "A", "content": "string" }
      ]
    }
  ]
}
```

---

### 2.5 Lịch sử làm bài
```
GET /api/v1/Tests/history
```

**🔒 Authorization Required**

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "attemptId": 1,
      "testId": 1,
      "testTitle": "ETS 2024 Test 1",
      "totalScore": 150,
      "totalQuestions": 200,
      "listeningScore": 75,
      "readingScore": 75,
      "startedAt": "datetime",
      "completedAt": "datetime",
      "status": "COMPLETED"
    }
  ]
}
```

---

### 2.6 Tạo giải thích AI cho tất cả câu hỏi
```
POST /api/v1/Tests/{testId}/generate-explanations
```

**Response:**
```json
{
  "message": "Đã cập nhật giải thích thành công cho 50 câu hỏi!",
  "totalUpdated": 50
}
```

---

### 2.7 Giải thích AI cho 1 câu hỏi
```
POST /api/v1/Tests/explain-question/{questionId}
```

**Response:**
```json
{
  "shortExplanation": "string",
  "fullExplanation": "string"
}
```

---

## 3. PracticeController - Luyện tập

**Route**: `/api/v1/Practice`

### 3.1 Lấy danh sách Part có thể luyện tập
```
GET /api/v1/Practice/parts
```

**Response:**
```json
[
  {
    "partNumber": 1,
    "name": "Part 1: Photographs",
    "description": "Mô tả hình ảnh",
    "type": "listening",
    "icon": "🖼️",
    "totalQuestions": 100
  }
]
```

---

### 3.2 Bắt đầu phiên luyện tập
```
POST /api/v1/Practice/start
```

**🔒 Authorization Required**

**Request Body:**
```json
{
  "partNumber": 5,
  "questionCount": 10
}
```

**Response:**
```json
{
  "sessionId": 1,
  "partNumber": 5,
  "totalQuestions": 10,
  "questions": [
    {
      "id": 1,
      "questionNo": 101,
      "content": "string",
      "audioUrl": "string",
      "groupId": 1,
      "groupContent": "string",
      "groupImageUrl": "string",
      "groupAudioUrl": "string",
      "answers": [
        { "label": "A", "content": "string" }
      ]
    }
  ]
}
```

---

### 3.3 Submit câu trả lời (từng câu)
```
POST /api/v1/Practice/{sessionId}/answer
```

**🔒 Authorization Required**

**Request Body:**
```json
{
  "questionId": 1,
  "selectedOption": "A"
}
```

**Response:**
```json
{
  "isCorrect": true,
  "correctOption": "A",
  "explanation": "string",
  "answers": [
    { "label": "A", "content": "string" }
  ]
}
```

---

### 3.4 Hoàn thành phiên luyện tập
```
POST /api/v1/Practice/{sessionId}/complete
```

**🔒 Authorization Required**

**Request Body:**
```json
{
  "timeSpentSeconds": 300
}
```

**Response:**
```json
{
  "sessionId": 1,
  "partNumber": 5,
  "totalQuestions": 10,
  "correctAnswers": 8,
  "accuracy": 80.0,
  "timeSpent": 300,
  "completedAt": "datetime"
}
```

---

### 3.5 Lịch sử luyện tập
```
GET /api/v1/Practice/history
```

**🔒 Authorization Required**

**Query Parameters:**
| Tham số | Kiểu | Mặc định |
|---------|------|----------|
| page | int | 1 |
| pageSize | int | 10 |

**Response:**
```json
{
  "items": [
    {
      "id": 1,
      "partNumber": 5,
      "totalQuestions": 10,
      "correctAnswers": 8,
      "accuracy": 80.0,
      "timeSpentSeconds": 300,
      "startedAt": "datetime",
      "completedAt": "datetime"
    }
  ],
  "total": 50,
  "page": 1,
  "pageSize": 10,
  "totalPages": 5
}
```

---

## 4. BookmarksController - Đánh dấu câu hỏi

**Route**: `/api/v1/Bookmarks`

**🔒 Tất cả endpoints đều yêu cầu Authorization**

### 4.1 Lấy danh sách bookmark
```
GET /api/v1/Bookmarks
```

**Query Parameters:**
| Tham số | Kiểu | Mặc định |
|---------|------|----------|
| page | int | 1 |
| pageSize | int | 20 |

**Response:**
```json
{
  "items": [
    {
      "id": 1,
      "questionId": 1,
      "note": "string",
      "createdAt": "datetime",
      "question": {
        "id": 1,
        "questionNo": 101,
        "content": "string",
        "correctOption": "A",
        "partNumber": 5,
        "partName": "Part 5",
        "answers": [...]
      }
    }
  ],
  "total": 50,
  "page": 1,
  "pageSize": 20,
  "totalPages": 3
}
```

---

### 4.2 Thêm bookmark
```
POST /api/v1/Bookmarks
```

**Request Body:**
```json
{
  "questionId": 1,
  "note": "Cần ôn lại grammar"
}
```

**Response:**
```json
{
  "message": "Đã thêm bookmark",
  "bookmarkId": 1
}
```

---

### 4.3 Xóa bookmark
```
DELETE /api/v1/Bookmarks/{questionId}
```

**Response:**
```json
{
  "message": "Đã xóa bookmark"
}
```

---

### 4.4 Kiểm tra bookmark
```
GET /api/v1/Bookmarks/check/{questionId}
```

**Response:**
```json
{
  "isBookmarked": true
}
```

---

### 4.5 Kiểm tra nhiều bookmark (batch)
```
POST /api/v1/Bookmarks/check-batch
```

**Request Body:**
```json
[1, 2, 3, 4, 5]
```

**Response:**
```json
{
  "bookmarkedIds": [1, 3, 5]
}
```

---

## 5. VocabularyController - Từ vựng

**Route**: `/api/v1/Vocabulary`

### 5.1 Lấy danh sách từ vựng
```
GET /api/v1/Vocabulary
```

**Query Parameters:**
| Tham số | Kiểu | Mặc định | Mô tả |
|---------|------|----------|-------|
| category | string | null | Lọc theo danh mục |
| difficulty | int | null | Độ khó (1-5) |
| search | string | null | Tìm kiếm |
| page | int | 1 | |
| pageSize | int | 20 | |

**Response:**
```json
{
  "items": [
    {
      "id": 1,
      "word": "collaborate",
      "pronunciation": "/kəˈlæbəreɪt/",
      "partOfSpeech": "verb",
      "meaning": "hợp tác, cộng tác",
      "example": "We need to collaborate with other teams.",
      "exampleTranslation": "Chúng ta cần hợp tác với các team khác.",
      "audioUrl": "string",
      "imageUrl": "string",
      "category": "business",
      "difficulty": 3
    }
  ],
  "total": 500,
  "page": 1,
  "pageSize": 20,
  "totalPages": 25
}
```

---

### 5.2 Lấy danh mục từ vựng
```
GET /api/v1/Vocabulary/categories
```

**Response:**
```json
[
  { "category": "business", "count": 150 },
  { "category": "travel", "count": 80 }
]
```

---

### 5.3 Lấy flashcards (Spaced Repetition)
```
GET /api/v1/Vocabulary/flashcards
```

**🔒 Authorization Required**

**Query Parameters:**
| Tham số | Kiểu | Mặc định |
|---------|------|----------|
| count | int | 20 |
| category | string | null |

**Response:**
```json
{
  "cards": [
    {
      "id": 1,
      "word": "collaborate",
      "pronunciation": "/kəˈlæbəreɪt/",
      "meaning": "hợp tác",
      "example": "string",
      "isNew": true,
      "isDueReview": false
    }
  ],
  "newCount": 15,
  "reviewCount": 5
}
```

---

### 5.4 Review flashcard
```
POST /api/v1/Vocabulary/flashcards/{vocabId}/review
```

**🔒 Authorization Required**

**Request Body:**
```json
{
  "remembered": true
}
```

**Response:**
```json
{
  "status": 2,
  "correctStreak": 3,
  "nextReview": "datetime"
}
```

---

### 5.5 Thống kê học từ vựng
```
GET /api/v1/Vocabulary/stats
```

**🔒 Authorization Required**

**Response:**
```json
{
  "totalVocabulary": 500,
  "learned": 150,
  "learning": 50,
  "review": 30,
  "mastered": 70,
  "dueForReview": 10,
  "progress": 14.0
}
```

---

### 5.6 Thêm từ vựng (Admin)
```
POST /api/v1/Vocabulary
```

**🔒 Authorization Required**

**Request Body:**
```json
{
  "word": "collaborate",
  "pronunciation": "/kəˈlæbəreɪt/",
  "partOfSpeech": "verb",
  "meaning": "hợp tác",
  "example": "string",
  "exampleTranslation": "string",
  "audioUrl": "string",
  "imageUrl": "string",
  "category": "business",
  "difficulty": 3,
  "questionId": null
}
```

---

### 5.7 Import từ vựng hàng loạt
```
POST /api/v1/Vocabulary/import
```

**🔒 Authorization Required**

**Request Body:** Array of vocabulary objects

---

### 5.8 Lưu từ vựng từ câu hỏi
```
POST /api/v1/Vocabulary/save-from-question
```

**🔒 Authorization Required**

**Request Body:**
```json
{
  "word": "string",
  "meaning": "string",
  "pronunciation": "string",
  "partOfSpeech": "string",
  "example": "string",
  "questionId": 1
}
```

---

### 5.9 Lấy từ vựng đã lưu
```
GET /api/v1/Vocabulary/my-vocabulary
```

**🔒 Authorization Required**

---

### 5.10 Xóa từ vựng đã lưu
```
DELETE /api/v1/Vocabulary/my-vocabulary/{vocabId}
```

**🔒 Authorization Required**

---

## 6. LeaderboardController - Bảng xếp hạng

**Route**: `/api/v1/Leaderboard`

### 6.1 Lấy bảng xếp hạng
```
GET /api/v1/Leaderboard
```

**Query Parameters:**
| Tham số | Kiểu | Mặc định | Giá trị |
|---------|------|----------|---------|
| timeRange | string | "all" | "week", "month", "all" |
| limit | int | 50 | |

**Response:**
```json
{
  "items": [
    {
      "rank": 1,
      "userId": 1,
      "fullName": "Nguyễn Văn A",
      "avatarUrl": "string",
      "totalScore": 5000,
      "totalTests": 25,
      "averageScore": 200,
      "highestScore": 250,
      "listeningAvg": 100,
      "readingAvg": 100
    }
  ],
  "totalCount": 50,
  "currentUserRank": 15,
  "timeRange": "all"
}
```

---

### 6.2 Lấy thống kê của 1 user
```
GET /api/v1/Leaderboard/user/{userId}
```

**Response:**
```json
{
  "userId": 1,
  "fullName": "Nguyễn Văn A",
  "avatarUrl": "string",
  "rank": 15,
  "totalTests": 25,
  "totalScore": 5000,
  "averageScore": 200,
  "highestScore": 250,
  "listeningAvg": 100,
  "readingAvg": 100
}
```

---

## 7. StatisticsController - Thống kê

**Route**: `/api/v1/Statistics`

**🔒 Tất cả endpoints đều yêu cầu Authorization**

### 7.1 Dashboard tổng quan
```
GET /api/v1/Statistics/dashboard
```

**Response:**
```json
{
  "tests": {
    "total": 25,
    "averageScore": 180,
    "bestScore": 250,
    "avgListening": 90,
    "avgReading": 90
  },
  "practice": {
    "totalSessions": 50,
    "totalQuestions": 500,
    "totalCorrect": 400,
    "accuracy": 80.0,
    "totalTimeMinutes": 120.5
  },
  "bookmarks": 30,
  "vocabulary": {
    "learned": 150,
    "mastered": 70
  },
  "recentActivity": {
    "testsLast7Days": 3,
    "practiceLast7Days": 10
  }
}
```

---

### 7.2 Phân tích theo Part
```
GET /api/v1/Statistics/parts-analysis
```

**Response:**
```json
{
  "parts": [
    {
      "partNumber": 1,
      "name": "Part 1: Photographs",
      "type": "listening",
      "totalQuestions": 100,
      "correctAnswers": 85,
      "accuracy": 85.0,
      "level": "Tốt"
    }
  ],
  "strengths": ["Part 1: Photographs", "Part 5: Incomplete Sentences"],
  "weaknesses": ["Part 7: Reading Comprehension", "Part 3: Conversations"]
}
```

---

### 7.3 Biểu đồ tiến bộ
```
GET /api/v1/Statistics/progress
```

**Query Parameters:**
| Tham số | Kiểu | Mặc định |
|---------|------|----------|
| days | int | 30 |

**Response:**
```json
{
  "chartData": [
    {
      "date": "2024-12-01",
      "testScore": 180,
      "listeningScore": 90,
      "readingScore": 90,
      "practiceAccuracy": 80.0,
      "practiceQuestions": 20
    }
  ],
  "summary": {
    "totalTests": 10,
    "averageScore": 180,
    "bestScore": 250,
    "trend": 15,
    "trendDirection": "up"
  }
}
```

---

### 7.4 Streak học tập
```
GET /api/v1/Statistics/streak
```

**Response:**
```json
{
  "currentStreak": 7,
  "longestStreak": 30,
  "totalActiveDays": 60,
  "last7Days": [
    { "date": "2024-12-14", "dayName": "Sat", "hasActivity": true }
  ],
  "todayActive": true
}
```

---

## 8. AdminController - Import dữ liệu

**Route**: `/api/v1/Admin`

### 8.1 Import Part 1 (Photographs)
```
POST /api/v1/Admin/import-part1
```

**Content-Type**: `multipart/form-data`

**Form Data:**
| Field | Kiểu | Mô tả |
|-------|------|-------|
| excelFile | File | File Excel chứa dữ liệu |
| images | File[] | Danh sách ảnh |
| audios | File[] | Danh sách audio |
| testId | int (query) | ID đề thi |

**Excel Format:**
| QuestionNo | ImageFile | AudioFile | Transcript | CorrectAnswer |
|------------|-----------|-----------|------------|---------------|

---

### 8.2 Import Part 2 (Question-Response)
```
POST /api/v1/Admin/import-part2
```

**Content-Type**: `multipart/form-data`

**Form Data:**
| Field | Kiểu | Mô tả |
|-------|------|-------|
| excelFile | File | File Excel |
| audios | File[] | Danh sách audio |
| testId | int (query) | ID đề thi |

**Excel Format:**
| QuestionNo | AudioFile | Transcript | CorrectAnswer (A/B/C) |
|------------|-----------|------------|------------------------|

---

### 8.3 Import Part 3 (Conversations)
```
POST /api/v1/Admin/import-part3
```

**Content-Type**: `multipart/form-data`

**Form Data:**
| Field | Kiểu | Mô tả |
|-------|------|-------|
| excelFile | File | File Excel |
| audios | File[] | Danh sách audio |
| images | File[] | Danh sách ảnh (optional) |
| testId | int (query) | ID đề thi |

**Excel Format (mỗi row = 1 nhóm 3 câu):**
| GroupNo | AudioFile | ImageFile | Transcript | Q1_No | Q1_Content | Q1_A | Q1_B | Q1_C | Q1_D | Q1_Correct | Q2_... | Q3_... |

---

### 8.4 Import Part 4 (Talks)
```
POST /api/v1/Admin/import-part4
```

**Giống Part 3**

---

### 8.5 Import Part 5 (Incomplete Sentences)
```
POST /api/v1/Admin/import-part5
```

**Content-Type**: `multipart/form-data`

**Form Data:**
| Field | Kiểu |
|-------|------|
| file | File |
| testId | int (query) |

**Excel Format:**
| Part | QuestionNo | Content | OptionA | OptionB | OptionC | OptionD | CorrectAnswer | Explanation |

---

### 8.6 Import Part 6 (Text Completion)
```
POST /api/v1/Admin/import-part6
```

**Excel Format:**
| PassageContent | QuestionNo | QuestionContent | A | B | C | D | CorrectAnswer | Explanation |

---

### 8.7 Import Part 7 (Reading Comprehension)
```
POST /api/v1/Admin/import-part7
```

**Excel Format:**
| PassageContent | QuestionNo | QuestionContent | A | B | C | D | CorrectAnswer | Explanation | ImageFile |

---

## 9. AdminManagementController - Quản lý Admin

**Route**: `/api/v1/admin`

**🔒 Tất cả endpoints yêu cầu Authorization + Role Admin**

### 9.1 Dashboard Stats
```
GET /api/v1/admin/dashboard
```

**Response:**
```json
{
  "totalUsers": 1000,
  "activeUsers": 950,
  "newUsersToday": 10,
  "totalTests": 50,
  "totalQuestions": 10000,
  "totalAttempts": 5000,
  "attemptsThisWeek": 200,
  "recentAttempts": [...]
}
```

---

### 9.2 Lấy danh sách Users
```
GET /api/v1/admin/users
```

**Query Parameters:**
| Tham số | Kiểu | Mô tả |
|---------|------|-------|
| search | string | Tìm theo tên/email |
| role | string | Filter theo role |
| isActive | bool | Filter theo trạng thái |
| page | int | |
| pageSize | int | |

---

### 9.3 Chi tiết User
```
GET /api/v1/admin/users/{userId}
```

---

### 9.4 Toggle User Status
```
POST /api/v1/admin/users/{userId}/toggle-status
```

---

### 9.5 Cập nhật User Role
```
PUT /api/v1/admin/users/{userId}/role
```

**Request Body:**
```json
{
  "role": "Admin" // "User", "Admin", "Moderator"
}
```

---

### 9.6 Lấy danh sách Tests (Admin)
```
GET /api/v1/admin/tests
```

---

### 9.7 Toggle Test Status
```
POST /api/v1/admin/tests/{testId}/toggle-status
```

---

### 9.8 Xóa Test
```
DELETE /api/v1/admin/tests/{testId}
```

---

### 9.9 Lấy câu hỏi của Test
```
GET /api/v1/admin/tests/{testId}/questions
```

**Query Parameters:**
| Tham số | Kiểu |
|---------|------|
| partNumber | int |
| page | int |
| pageSize | int |

---

### 9.10 Cập nhật câu hỏi
```
PUT /api/v1/admin/questions/{questionId}
```

**Request Body:**
```json
{
  "content": "string",
  "correctOption": "A",
  "explanation": "string"
}
```

---

### 9.11 Thống kê hệ thống
```
GET /api/v1/admin/statistics
```

**Response:**
```json
{
  "userGrowth": [...],
  "attemptsTrend": [...],
  "scoreDistribution": [...]
}
```

---

## 10. TestManagementController - Quản lý đề thi

**Route**: `/api/v1/TestManagement`

### 10.1 Xóa cache Test
```
DELETE /api/v1/TestManagement/clear-cache/{testId}
```

---

### 10.2 Lấy tất cả Tests
```
GET /api/v1/TestManagement/tests
```

---

### 10.3 Chi tiết Test
```
GET /api/v1/TestManagement/tests/{testId}
```

---

### 10.4 Tạo Test mới
```
POST /api/v1/TestManagement/tests
```

**Request Body:**
```json
{
  "title": "ETS 2024 Test 1",
  "slug": "ets-2024-test-1",
  "type": "FULL_TEST",
  "duration": 120,
  "totalQuestions": 200
}
```

---

### 10.5 Cập nhật Test
```
PUT /api/v1/TestManagement/tests/{testId}
```

**Request Body:**
```json
{
  "title": "string",
  "slug": "string",
  "type": "string",
  "duration": 120,
  "totalQuestions": 200,
  "isActive": true
}
```

---

### 10.6 Xóa Test
```
DELETE /api/v1/TestManagement/tests/{testId}
```

---

### 10.7 Lấy Parts của Test
```
GET /api/v1/TestManagement/tests/{testId}/parts
```

---

### 10.8 Xóa Part
```
DELETE /api/v1/TestManagement/tests/{testId}/parts/{partNumber}
```

---

### 10.9 Cập nhật Part
```
PUT /api/v1/TestManagement/tests/{testId}/parts/{partNumber}
```

**Request Body:**
```json
{
  "name": "Part 1: Photographs"
}
```

---

## 11. AiTestController - Test AI

**Route**: `/api/AiTest`

### 11.1 Test kết nối AI
```
GET /api/AiTest/test-connection
```

**Response:**
```json
{
  "status": "Thành công! AI đã trả lời.",
  "shortExplanation": "string",
  "fullExplanation": "string"
}
```

---

## 📋 HTTP Status Codes

| Code | Mô tả |
|------|-------|
| 200 | Thành công |
| 201 | Tạo mới thành công |
| 400 | Bad Request - Dữ liệu không hợp lệ |
| 401 | Unauthorized - Chưa đăng nhập |
| 403 | Forbidden - Không có quyền |
| 404 | Not Found - Không tìm thấy |
| 500 | Internal Server Error |

---

## 🔐 Authentication

Thêm header sau cho các API yêu cầu đăng nhập:

```
Authorization: Bearer <your_jwt_token>
```

---

*Generated on: December 20, 2024*
