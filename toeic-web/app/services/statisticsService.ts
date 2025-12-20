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
