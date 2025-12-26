// ============================================
// 📦 TOEIC MASTER - TYPE DEFINITIONS
// ============================================

// --------------------------------------------
// 🔤 Common / Shared Types
// --------------------------------------------
export interface Answer {
  label: string;
  content: string;
}

// --------------------------------------------
// 📝 Test Types (Đề thi)
// --------------------------------------------
export interface Question {
  id: number;
  questionNo: number;
  imageUrl: string | null;
  audioUrl: string | null;
  content: string;
  answers: Answer[];
}

export interface Group {
  id: number;
  textContent: string | null;
  imageUrl: string | null;
  audioUrl: string | null;
  questions: Question[];
}

export interface Part {
  id: number;
  name: string;
  groups: Group[];
}

export interface TestDetail {
  id: number;
  title: string;
  duration?: number;
  parts: Part[];
}

export interface TestHistoryItem {
  attemptId: number;
  testId: number;
  testTitle: string;
  totalScore: number;
  totalQuestions: number;
  listeningScore: number | null;
  readingScore: number | null;
  startedAt: string;
  completedAt: string;
  status: string;
}

// --------------------------------------------
// 📊 Result Types (Kết quả)
// --------------------------------------------
export interface ResultQuestion {
  questionId: number;
  questionNo: number;
  content: string;
  userSelected: string;
  correctOption: string;
  isCorrect: boolean;
  shortExplanation: string | null;
  fullExplanation: string | null;
  groupId: number | null;
  groupContent: string | null;
  answers: Answer[];
}

export interface ResultDetail {
  attemptId: number;
  testId: number;
  testTitle: string;
  totalScore: number;
  totalQuestions: number;
  listeningScore?: number;  // Điểm Listening (5-495)
  readingScore?: number;    // Điểm Reading (5-495)
  completedAt: string;
  questions: ResultQuestion[];
}

export interface GroupedResult {
  groupId: number;
  groupContent: string | null;
  imageUrl?: string | null;
  questions: ResultQuestion[];
}

// --------------------------------------------
// 🎯 Practice Types (Luyện tập)
// --------------------------------------------
export interface PracticeQuestion {
  id: number;
  questionNo: number;
  content: string;
  audioUrl: string | null;
  groupId: number;
  groupContent: string | null;
  groupImageUrl: string | null;
  groupAudioUrl: string | null;
  answers: Answer[];
}

export interface PracticeSession {
  sessionId: number;
  partNumber: number;
  questions: PracticeQuestion[];
  totalQuestions: number;
}

export interface PracticeResult {
  sessionId: number;
  partNumber: number;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  timeSpent: number;
  completedAt: string;
}

export interface PartInfo {
  partNumber: number;
  name: string;
  description: string;
  type: string;
  icon: string;
  totalQuestions: number;
}

export interface PracticeHistoryItem {
  id: number;
  partNumber: number;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  timeSpentSeconds: number;
  startedAt: string;
  completedAt: string;
}

// --------------------------------------------
// 🔖 Bookmark Types
// --------------------------------------------
export interface BookmarkItem {
  id: number;
  questionId: number;
  note: string | null;
  createdAt: string;
  question: {
    id: number;
    questionNo: number;
    content: string;
    correctOption: string;
    partNumber: number;
    partName: string;
    answers: { label: string; content: string }[];
  };
}

//// 1. Enum cho dễ quản lý trạng thái (Khớp với C#)
export enum VocabularyStatus {
  New = 0,
  Learning = 1,
  Review = 2,
  Mastered = 3
}

// 2. Main Interface (Khớp 100% với C# VocabularyDto)
export interface VocabularyItem {
  icon : string ;
  id: number;
  word: string;
  meaning: string;
  pronunciation?: string;
  partOfSpeech?: string;
  example?: string;
  exampleTranslation?: string;
  audioUrl?: string;
  imageUrl?: string;      // ✅ Đã khớp với C#
  category?: string;
  difficulty: number;

  // User Progress fields (Có thể null/undefined nếu user chưa học)
  status: VocabularyStatus; 
  nextReviewAt?: string;  // Date string ISO
}

// 3. Stats Interface
export interface VocabStats {
  totalVocabulary: number;
  learned: number;      // status > 0
  learning: number;     // status = 1
  review: number;       // status = 2
  mastered: number;     // status = 3
  dueForReview: number;
  progressPercent: number; // Đổi tên cho khớp logic tính toán (%)
}

// 4. Flashcard (Dùng cho màn hình học)
// Kế thừa VocabularyItem, thêm cờ logic hiển thị
export interface Flashcard extends VocabularyItem {
  isNew: boolean;       // Helper flag UI
  isDueReview: boolean; // Helper flag UI
}
// --------------------------------------------
// 📊 Statistics Types (Thống kê)
// --------------------------------------------
export interface DashboardStats {
  tests: {
    total: number;
    averageScore: number;
    bestScore: number;
    avgListening: number;
    avgReading: number;
  };
  practice: {
    totalSessions: number;
    totalQuestions: number;
    totalCorrect: number;
    accuracy: number;
    totalTimeMinutes: number;
  };
  bookmarks: number;
  vocabulary: {
    learned: number;
    mastered: number;
  };
  recentActivity: {
    testsLast7Days: number;
    practiceLast7Days: number;
  };
}

export interface PartAnalysis {
  partNumber: number;
  name: string;
  type: string;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  level: string;
  testQuestions: number;
  practiceQuestions: number;
}

export interface ProgressData {
  date: string;
  testScore: number | null;
  listeningScore: number | null;
  readingScore: number | null;
  practiceAccuracy: number | null;
  practiceQuestions: number;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalActiveDays: number;
    last7Days: { date: string; dayName: string; hasActivity: boolean }[];
    todayActive: boolean;
  }
  
  // --------------------------------------------
  // 💬 Comment Types (Bình luận)
  // --------------------------------------------
  export interface Comment {
    id: number;
    testId: number;
    userId: number;
    userName: string;
    fullName: string; 
    userAvatar?: string | null;
    parentCommentId?: number | null;
    content: string;
    createdAt: string;
    updatedAt?: string | null;
    likeCount: number;
    isLikedByCurrentUser: boolean;
    replies: Comment[];
  }
  
  export interface CommentListResponse {
    items: Comment[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }
  