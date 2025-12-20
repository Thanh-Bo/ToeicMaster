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

// --------------------------------------------
// 📚 Vocabulary Types (Từ vựng)
// --------------------------------------------
export interface VocabularyItem {
  id: number;
  word: string;
  pronunciation: string | null;
  partOfSpeech: string | null;
  meaning: string;
  example: string | null;
  exampleTranslation: string | null;
  audioUrl: string | null;
  imageUrl: string | null;
  category: string | null;
  difficulty: number;
}

export interface Flashcard extends VocabularyItem {
  isNew: boolean;
  isDueReview: boolean;
}

export interface VocabStats {
  totalVocabulary: number;
  learned: number;
  learning: number;
  review: number;
  mastered: number;
  dueForReview: number;
  progress: number;
}

export interface SaveVocabFromQuestionRequest {
  word: string;
  pronunciation?: string;
  partOfSpeech?: string;
  meaning: string;
  example?: string;
  exampleTranslation?: string;
  category?: string;
  difficulty?: number;
  questionId?: number;
}

export interface MyVocabularyItem extends VocabularyItem {
  status: number;
  correctStreak: number;
  lastReviewedAt: string | null;
  nextReviewAt: string | null;
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
  