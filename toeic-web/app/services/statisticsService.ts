import axiosClient from "./axiosClient";
import type {
  DashboardStats,
  PartAnalysis,
  ProgressData,
  StreakData
} from "../types";

// Re-export types để các component có thể import từ service
export type { DashboardStats, PartAnalysis, ProgressData, StreakData };

export const statisticsService = {
  // Dashboard tổng quan - support filter theo thời gian
  getDashboard: async (period: string = "30days"): Promise<DashboardStats> => {
    const response = await axiosClient.get("/statistics/dashboard", {
      params: { period }
    });
    return response.data;
  },

  // Phân tích theo Part - support filter theo thời gian
  getPartsAnalysis: async (period: string = "30days"): Promise<{ period: string; parts: PartAnalysis[]; strengths: string[]; weaknesses: string[] }> => {
    const response = await axiosClient.get("/statistics/parts-analysis", {
      params: { period }
    });
    return response.data;
  },

  // Biểu đồ tiến bộ - support filter theo thời gian
  getProgress: async (period: string = "30days"): Promise<{ period: string; chartData: ProgressData[]; summary: { totalTests: number; averageScore: number; bestScore: number; trend: number; trendDirection: string } }> => {
    const response = await axiosClient.get("/statistics/progress", {
      params: { period }
    });
    return response.data;
  },

  // Streak
  getStreak: async (): Promise<StreakData> => {
    const response = await axiosClient.get("/statistics/streak");
    return response.data;
  }
};

