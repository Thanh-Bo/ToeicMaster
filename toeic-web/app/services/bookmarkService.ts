import axiosClient from "./axiosClient";
import type { BookmarkItem } from "../types";

// Re-export type để các component có thể import từ service
export type { BookmarkItem };

export const bookmarkService = {
  // Lấy danh sách bookmark
  getBookmarks: async (
    page = 1,
    pageSize = 20,
    partNumber?: number | null,
    sort = "newest",
    fromDate?: string, // format YYYY-MM-DD
    toDate?: string
  ) => {
    // Tạo query string
    const params: any = { page, pageSize, sort };
    if (partNumber) params.partNumber = partNumber;
    if (fromDate) params.fromDate = fromDate;
    if (toDate) params.toDate = toDate;

    const response = await axiosClient.get("/bookmarks", { params });
    return response.data;
  },
  
  // Thêm bookmark
  add: async (questionId: number, note?: string) => {
    const response = await axiosClient.post("/bookmarks", {
      questionId,
      note,
    });
    return response.data;
  },
  // Hàm mới lấy thống kê
  getStats: async () => {
    const response = await axiosClient.get("/bookmarks/stats");
    return response.data; // { total: 100, parts: { 1: 10, 5: 20... } }
  },

  // Xóa bookmark
  remove: async (questionId: number) => {
    const response = await axiosClient.delete(`/bookmarks/${questionId}`);
    return response.data;
  },

  // Xóa tất cả bookmark
  removeAll: async () => {
    const response = await axiosClient.delete(`/bookmarks/all`);
    return response.data;
  },

  // Kiểm tra 1 câu hỏi
  check: async (questionId: number): Promise<{ isBookmarked: boolean }> => {
    const response = await axiosClient.get(`/bookmarks/check/${questionId}`);
    return response.data;
  },

  // Kiểm tra nhiều câu hỏi
  checkBatch: async (
    questionIds: number[]
  ): Promise<{ bookmarkedIds: number[] }> => {
    const response = await axiosClient.post(
      "/bookmarks/check-batch",
      questionIds
    );
    return response.data;
  },
};
