import Cookies from "js-cookie";

const BASE_URL = "http://localhost:5298/api/feedback";

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
    try {
      const response = await fetch(`${BASE_URL}/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token") || ""}`,
        },
        body: JSON.stringify({
          feedbackType: request.feedbackType,
          title: request.title,
          content: request.content,
          email: request.email,
          currentPage: request.currentPage || window.location.pathname,
          priority: request.priority || 2,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to submit feedback");
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error("Error creating feedback:", error);
      throw error;
    }
  }

  async getAllFeedbacks(status?: string, feedbackType?: string): Promise<FeedbackListResponse[]> {
    try {
      const token = Cookies.get("token");
      console.log("[FeedbackService] Token available:", !!token);
      
      const params = new URLSearchParams();
      if (status) params.append("status", status);
      if (feedbackType) params.append("feedbackType", feedbackType);

      const url = `${BASE_URL}/list?${params.toString()}`;
      console.log("[FeedbackService] Fetching from:", url);

      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token || ""}`,
        },
      });

      console.log("[FeedbackService] Response status:", response.status);
      console.log("[FeedbackService] Response headers:", response.headers);

      if (!response.ok) {
        const text = await response.text();
        console.error("[FeedbackService] Error response text:", text);
        try {
          const error = JSON.parse(text);
          throw new Error(error.message || `Failed to fetch feedbacks (${response.status})`);
        } catch {
          throw new Error(`Failed to fetch feedbacks (${response.status}): ${text}`);
        }
      }

      const text = await response.text();
      console.log("[FeedbackService] Response text:", text);
      
      if (!text) {
        console.warn("[FeedbackService] Empty response body");
        return [];
      }

      const data = JSON.parse(text);
      return data.data || [];
    } catch (error: any) {
      console.error("Error fetching feedbacks:", error.message);
      throw error;
    }
  }

  async getFeedbackById(id: number): Promise<FeedbackResponse> {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token") || ""}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch feedback");
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error("Error fetching feedback:", error);
      throw error;
    }
  }

  async updateFeedbackStatus(
    id: number,
    status: string,
    adminResponse?: string,
    priority?: number
  ): Promise<FeedbackResponse> {
    try {
      const response = await fetch(`${BASE_URL}/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token") || ""}`,
        },
        body: JSON.stringify({
          status,
          adminResponse,
          priority,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update feedback");
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error("Error updating feedback:", error);
      throw error;
    }
  }

  async deleteFeedback(id: number): Promise<boolean> {
    try {
      const response = await fetch(`${BASE_URL}/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${Cookies.get("token") || ""}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete feedback");
      }

      return true;
    } catch (error) {
      console.error("Error deleting feedback:", error);
      throw error;
    }
  }
}

const feedbackService = new FeedbackService();
export default feedbackService;
