import axiosClient from "./axiosClient";
import type {
  ReadingHistoryItem,
  ReadingLesson,
  ReadingSession,
  ReadingStats,
  ReadingTopic,
  ReadingTopicDetail,
} from "../types";

export const readingService = {
  getTopics: async (
    partType: string | number = "all",
    difficulty: string = "all",
  ): Promise<ReadingTopic[]> => {
    const response = await axiosClient.get("/reading-practice/topics", {
      params: { partType: String(partType), difficulty },
    });
    return response.data;
  },

  getTopic: async (topicId: number | string): Promise<ReadingTopicDetail> => {
    const response = await axiosClient.get(`/reading-practice/topics/${topicId}`);
    return response.data;
  },

  getLessons: async (
    partType: string | number = "all",
    difficulty: string = "all",
  ): Promise<ReadingLesson[]> => {
    const response = await axiosClient.get("/reading-practice/lessons", {
      params: { partType: String(partType), difficulty },
    });
    return response.data;
  },

  start: async (passageCount: number, partType: string | number = "mixed"): Promise<ReadingSession> => {
    const response = await axiosClient.post("/reading-practice/start", {
      passageCount,
      partType: String(partType),
    });
    return response.data;
  },

  startLesson: async (passageId: number): Promise<ReadingSession> => {
    const response = await axiosClient.post("/reading-practice/start", {
      passageId,
    });
    return response.data;
  },

  getSession: async (sessionId: number | string): Promise<ReadingSession> => {
    const response = await axiosClient.get(`/reading-practice/${sessionId}`);
    return response.data;
  },

  submitAnswer: async (
    sessionId: number | string,
    readingQuestionId: number,
    selectedOption: string,
  ) => {
    const response = await axiosClient.post(
      `/reading-practice/${sessionId}/answer`,
      {
        readingQuestionId,
        selectedOption,
      },
    );
    return response.data;
  },

  complete: async (
    sessionId: number | string,
    timeSpentSeconds: number,
  ): Promise<ReadingSession> => {
    const response = await axiosClient.post(
      `/reading-practice/${sessionId}/complete`,
      {
        timeSpentSeconds,
      },
    );
    return response.data;
  },

  getResult: async (sessionId: number | string): Promise<ReadingSession> => {
    const response = await axiosClient.get(`/reading-practice/${sessionId}/result`);
    return response.data;
  },

  cancel: async (sessionId: number | string) => {
    const response = await axiosClient.post(`/reading-practice/${sessionId}/cancel`);
    return response.data;
  },

  getHistory: async (
    page = 1,
    pageSize = 10,
    partType?: number,
    sort?: string,
    from?: string,
    to?: string,
  ) => {
    const response = await axiosClient.get<{
      items: ReadingHistoryItem[];
      total: number;
      page: number;
      pageSize: number;
      totalPages: number;
    }>("/reading-practice/history", {
      params: { page, pageSize, partType, sort, from, to },
    });
    return response.data;
  },

  getStats: async (): Promise<ReadingStats> => {
    const response = await axiosClient.get("/reading-practice/stats");
    return response.data;
  },
};
