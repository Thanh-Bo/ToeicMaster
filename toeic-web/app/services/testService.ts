import axiosClient from "./axiosClient";
import type { TestHistoryItem } from "../types";

// Re-export type để các component có thể import từ service
export type { TestHistoryItem };

export const testService = {
  // 1. Lấy danh sách đề (Cho trang chủ)
  getList: () => {
    // Fetch all tests by setting a high limit
    return axiosClient.get("/tests?limit=100");
  },

  // 2. Lấy chi tiết đề (Cho trang thi) - UUID only
  getTestFull: (testGuid: string, parts?: string | null) => {
    const url = parts
      ? `/tests/${testGuid}/full?parts=${parts}`
      : `/tests/${testGuid}/full`;
    return axiosClient.get(url);
  },
  // 3. Nộp bài (Sẽ dùng sau)
  submit: (data: any) => {
    return axiosClient.post("/tests/submit", data);
  },
  getResult: (attemptGuid: string) => {
    return axiosClient.get(`/tests/results/${attemptGuid}`);
  },

  // 4. Lấy giải thích câu hỏi
  getQuestionExplanation: async (questionId: number) => {
    const response = await axiosClient.post(
      `/Tests/explain-question/${questionId}`
    );
    return response.data;
  },

  // 5. Dịch đoạn văn (Part 6/7 hay transcript Part 3/4) — lưu vào DB qua groupId + type
  translatePassage: async (
    passage: string,
    groupId?: number,
    type?: "content" | "transcript",
    partNumber?: number,
  ): Promise<{ translation: string }> => {
    const response = await axiosClient.post("/Tests/translate-passage", {
      passage,
      groupId,
      type,
      partNumber,
    });
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

  // 6. Xóa một bài làm khỏi lịch sử
  deleteHistory: (attemptGuid: string) => {
    return axiosClient.delete(`/tests/history/${attemptGuid}`);
  },
};
