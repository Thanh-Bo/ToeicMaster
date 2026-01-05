// ============================================
// 📦 TOEIC MASTER - COMMENT SERVICE
// ============================================
import axiosClient from "./axiosClient";
import { Comment, CommentListResponse, CreateCommentPayload, GetCommentsParams, UpdateCommentPayload } from "@/app/types";


const commentService = {
  /**
   * Lấy danh sách bình luận cho một bài test
   */
  getComments: async ({ 
    testId, 
    page = 1, 
    pageSize = 10, 
    sortBy = 'newest' 
  }: GetCommentsParams): Promise<CommentListResponse> => {
    const url = `/tests/${testId}/comments`;
    const response = await axiosClient.get(url, {
      params: { page, pageSize, sortBy }
    });
    return response.data;
  },

  /**
   * Tạo một bình luận mới (hoặc trả lời)
   */
  createComment: async (testId: string | number, payload: CreateCommentPayload): Promise<Comment> => {
    const url = `/tests/${testId}/comments`;
    const response = await axiosClient.post(url, payload);
    return response.data;
  },

  /**
   * Cập nhật một bình luận
   */
  updateComment: async (testId: string | number, commentId: number, payload: UpdateCommentPayload): Promise<{ message: string }> => {
    const url = `/tests/${testId}/comments/${commentId}`;
    const response = await axiosClient.put(url, payload);
    return response.data;
  },

  /**
   * Xóa một bình luận
   */
  deleteComment: async (testId: string | number, commentId: number): Promise<{ message: string }> => {
    const url = `/tests/${testId}/comments/${commentId}`;
    const response = await axiosClient.delete(url);
    return response.data;
  },

  /**
   * Thích một bình luận
   */
  likeComment: async (testId: string | number, commentId: number): Promise<{ message: string; likeCount: number }> => {
    const url = `/tests/${testId}/comments/${commentId}/like`;
    const response = await axiosClient.post(url);
    return response.data;
  },

  /**
   * Bỏ thích một bình luận
   */
  unlikeComment: async (testId: string | number, commentId: number): Promise<{ message: string; likeCount: number }> => {
    const url = `/tests/${testId}/comments/${commentId}/like`;
    const response = await axiosClient.delete(url);
    return response.data;
  },

  /**
   * Đếm số lượng bình luận
   */
  getCommentCount: async (testId: string | number): Promise<{ count: number }> => {
    const url = `/tests/${testId}/comments/count`;
    const response = await axiosClient.get(url);
    return response.data;
  }
};

export default commentService;
