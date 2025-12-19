import axiosClient from "./axiosClient";

export interface PracticeQuestion {
  id: number;
  questionNo: number;
  content: string;
  audioUrl: string | null;
  groupId: number;
  groupContent: string | null;
  groupImageUrl: string | null;
  groupAudioUrl: string | null;
  answers: { label: string; content: string }[];
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
