import axiosClient from "./axiosClient";
import type { TestHistoryItem } from "../types";

// Re-export type để các component có thể import từ service
export type { TestHistoryItem };

export const testService = {
  // 1. Lấy danh sách đề (Cho trang chủ)
  getList: () => {
    return axiosClient.get("/tests");
  },

  // 2. Lấy chi tiết đề (Cho trang thi)
  // app/services/testService.ts
  getTestFull: (id: number, parts?: string | null) => {
    const url = parts
      ? `/tests/${id}/full?parts=${parts}`
      : `/tests/${id}/full`;
    return axiosClient.get(url);
  },
  // 3. Nộp bài (Sẽ dùng sau)
  submit: (data: any) => {
    return axiosClient.post("/tests/submit", data);
  },
  getResult: (attemptId: number) => {
    return axiosClient.get(`/tests/results/${attemptId}`);
  },

  // 4. Lấy giải thích câu hỏi
  getQuestionExplanation: async (questionId: number) => {
    const response = await axiosClient.post(
      `/Tests/explain-question/${questionId}`
    );
    return response.data;
  },

  // 5. Dịch đoạn văn (Part 6/7) sang tiếng Việt
  translatePassage: async (passage: string): Promise<{ translation: string }> => {
    const response = await axiosClient.post("/Tests/translate-passage", { passage });
    return response.data;
  },

  // 5. Lấy lịch sử làm bài
  getHistory: async (): Promise<{
    success: boolean;
    data: TestHistoryItem[];
  }> => {
    const response = await axiosClient.get("/tests/history");
    return response.data;
  },
};
