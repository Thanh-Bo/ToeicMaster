import axiosClient from "./axiosClient";
import type { BookmarkItem } from "../types";

// Re-export type để các component có thể import từ service
export type { BookmarkItem };

export const bookmarkService = {
  // Lấy danh sách bookmark
  getBookmarks: async (page = 1, pageSize = 20) => {
    const response = await axiosClient.get("/bookmarks", {
      params: { page, pageSize }
    });
    return response.data;
  },

  // Thêm bookmark
  add: async (questionId: number, note?: string) => {
    const response = await axiosClient.post("/bookmarks", {
      questionId,
      note
    });
    return response.data;
  },

  // Xóa bookmark
  remove: async (questionId: number) => {
    const response = await axiosClient.delete(`/bookmarks/${questionId}`);
    return response.data;
  },

  // Kiểm tra 1 câu hỏi
  check: async (questionId: number): Promise<{ isBookmarked: boolean }> => {
    const response = await axiosClient.get(`/bookmarks/check/${questionId}`);
    return response.data;
  },

  // Kiểm tra nhiều câu hỏi
  checkBatch: async (questionIds: number[]): Promise<{ bookmarkedIds: number[] }> => {
    const response = await axiosClient.post("/bookmarks/check-batch", questionIds);
    return response.data;
  }
};
