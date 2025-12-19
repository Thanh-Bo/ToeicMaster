import axiosClient from "./axiosClient"; // File axios bạn đã tạo ở bước trước

export interface HistoryItem {
  attemptId: number;
  testId: number;
  testTitle: string;
  totalScore: number;
  totalQuestions: number;
  listeningScore: number | null;
  readingScore: number | null;
  startedAt: string;
  completedAt: string;
  status: string;
}

export const testService = {
  // 1. Lấy danh sách đề (Cho trang chủ)
  getList: () => {
    return axiosClient.get("/tests");
  },

  // 2. Lấy chi tiết đề (Cho trang thi)
  getDetail: (id: number) => {
    return axiosClient.get(`/tests/${id}/full`);
  },
  
  // 3. Nộp bài (Sẽ dùng sau)
  submit: (data: any) => {
    return axiosClient.post("/tests/submit", data);
  }
  ,
  getResult: (attemptId: number) => {
    return axiosClient.get(`/tests/results/${attemptId}`);
  },

  // 4. Lấy giải thích câu hỏi
  getQuestionExplanation: async (questionId: number) => {
   
    const response = await axiosClient.post(`/Tests/explain-question/${questionId}`);
    return response.data; 
    
  },

  // 5. Lấy lịch sử làm bài
  getHistory: async (): Promise<{ success: boolean; data: HistoryItem[] }> => {
    const response = await axiosClient.get("/tests/history");
    return response.data;
  }
};