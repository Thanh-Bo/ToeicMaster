import axiosClient from "./axiosClient";
import type { 
  PracticeQuestion, 
  PracticeSession, 
  PracticeResult, 
  PartInfo, 
  PracticeHistoryItem 
} from "../types";

// Re-export types để các component có thể import từ service
export type { PracticeQuestion, PracticeSession, PracticeResult, PartInfo, PracticeHistoryItem };

export const practiceService = {
  // Lấy danh sách parts
  getParts: async (): Promise<PartInfo[]> => {
    const response = await axiosClient.get("/practice/parts");
    return response.data;
  },

  // Bắt đầu luyện tập
  start: async (partNumber: number, questionCount?: number): Promise<PracticeSession> => {
    const response = await axiosClient.post("/practice/start", {
      partNumber,
      questionCount
    });
    return response.data;
  },

  // Submit câu trả lời
  submitAnswer: async (sessionId: number, questionId: number, selectedOption: string) => {
    const response = await axiosClient.post(`/practice/${sessionId}/answer`, {
      questionId,
      selectedOption
    });
    return response.data;
  },

  // Hoàn thành phiên luyện tập
  complete: async (sessionId: number, timeSpentSeconds?: number): Promise<PracticeResult> => {
    const response = await axiosClient.post(`/practice/${sessionId}/complete`, {
      timeSpentSeconds
    });
    return response.data;
  },

  // Lịch sử luyện tập
  getHistory: async (page = 1, pageSize = 10) => {
    const response = await axiosClient.get("/practice/history", {
      params: { page, pageSize }
    });
    return response.data;
  }
};
