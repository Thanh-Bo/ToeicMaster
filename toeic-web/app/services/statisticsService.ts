import axiosClient from "./axiosClient";

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

export const statisticsService = {
  // Dashboard tổng quan
  getDashboard: async (): Promise<DashboardStats> => {
    const response = await axiosClient.get("/statistics/dashboard");
    return response.data;
  },

  // Phân tích theo Part
  getPartsAnalysis: async (): Promise<{ parts: PartAnalysis[]; strengths: string[]; weaknesses: string[] }> => {
    const response = await axiosClient.get("/statistics/parts-analysis");
    return response.data;
  },

  // Biểu đồ tiến bộ
  getProgress: async (days = 30): Promise<{ chartData: ProgressData[]; summary: { totalTests: number; averageScore: number; bestScore: number; trend: number; trendDirection: string } }> => {
    const response = await axiosClient.get("/statistics/progress", {
      params: { days }
    });
    return response.data;
  },

  // Streak
  getStreak: async (): Promise<StreakData> => {
    const response = await axiosClient.get("/statistics/streak");
    return response.data;
  }
};
