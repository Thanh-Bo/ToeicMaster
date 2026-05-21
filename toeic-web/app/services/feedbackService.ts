import axiosClient from "./axiosClient";

const BASE_URL = "/feedback";

export interface CreateFeedbackRequest {
  feedbackType: "bug" | "feature" | "ui_ux" | "other";
  title: string;
  content: string;
  email?: string;
  currentPage?: string;
  priority?: 1 | 2 | 3;
}

export interface FeedbackResponse {
  id: number;
  userId?: number;
  userName?: string;
  userEmail?: string;
  feedbackType: string;
  title: string;
  content: string;
  email?: string;
  currentPage?: string;
  status: string;
  priority: number;
  createdAt: string;
  updatedAt?: string;
  respondedAt?: string;
  adminResponse?: string;
  respondedBy?: number;
  respondedByName?: string;
}

export interface FeedbackListResponse {
  id: number;
  userName?: string;
  userEmail?: string;
  feedbackType: string;
  title: string;
  status: string;
  priority: number;
  createdAt: string;
  respondedAt?: string;
}

class FeedbackService {
  async createFeedback(request: CreateFeedbackRequest): Promise<FeedbackResponse> {
    const response = await axiosClient.post<{ data: FeedbackResponse }>(`${BASE_URL}/create`, {
      feedbackType: request.feedbackType,
      title: request.title,
      content: request.content,
      email: request.email,
      currentPage: request.currentPage || window.location.pathname,
      priority: request.priority || 2,
    });

    return response.data.data;
  }

  async getAllFeedbacks(status?: string, feedbackType?: string): Promise<FeedbackListResponse[]> {
    const response = await axiosClient.get<{ data: FeedbackListResponse[] }>(`${BASE_URL}/list`, {
      params: {
        status,
        feedbackType,
      },
    });

    return response.data.data || [];
  }

  async getFeedbackById(id: number): Promise<FeedbackResponse> {
    const response = await axiosClient.get<{ data: FeedbackResponse }>(`${BASE_URL}/${id}`);
    return response.data.data;
  }

  async updateFeedbackStatus(
    id: number,
    status: string,
    adminResponse?: string,
    priority?: number
  ): Promise<FeedbackResponse> {
    const response = await axiosClient.put<{ data: FeedbackResponse }>(`${BASE_URL}/update/${id}`, {
      status,
      adminResponse,
      priority,
    });

    return response.data.data;
  }

  async deleteFeedback(id: number): Promise<boolean> {
    await axiosClient.delete(`${BASE_URL}/delete/${id}`);
    return true;
  }
}

const feedbackService = new FeedbackService();
export default feedbackService;
