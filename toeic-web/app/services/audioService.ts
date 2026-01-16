import { GenerateAudioResponse, Group } from "../types";
import axiosClient from "./axiosClient";





export const audioService = {
  /**
   * Lấy danh sách Group theo TestId và PartNumber
   * Backend API: GET /api/v1/questions/groups?testId=...&partNumber=...
   */
  getGroupsByPart: async (testId: number, partNumber: number): Promise<Group[]> => {
    const response = await axiosClient.get(`tests/questions/groups`, {
      params: { 
        testId, 
        partNumber 
      }
    });

    // Mapping dữ liệu từ Backend về Frontend (nếu cần)
    return response.data.map((item: any) => ({
      id: item.id,
      transcript: item.transcript,
      audioUrl: item.audioUrl,
      hasAudio: !!item.audioUrl, // Chuyển đổi string/null sang boolean
      questions: item.questions
    }));
  },

  /**
   * Tạo audio cho một group (Dùng chung cho mọi Part)
   * Backend API: POST /api/v1/texttospeech/generate-audio/{groupId}
   */
  generateAudioForGroup: async (groupId: number): Promise<GenerateAudioResponse> => {
    // Lưu ý: Đường dẫn phải khớp với TextToSpeechController bạn đã viết
    const response = await axiosClient.post(
      `/texttospeech/generate-audio/${groupId}`
    );
    return response.data;
  },

  /**
   * (Optional) Hàm tiện ích để chạy vòng lặp tạo tất cả
   * Hàm này xử lý logic ở phía Client để tránh timeout server
   */
  generateAudioBatch: async (groups: Group[]) => {
    const results = [];
    const ungeneratedGroups = groups.filter(g => !g.hasAudio);

    for (const group of ungeneratedGroups) {
      try {
        const result = await audioService.generateAudioForGroup(group.id);
        results.push({ groupId: group.id, success: true, url: result.url });
        
        // Delay nhẹ 1s để không spam server quá gắt
        await new Promise(r => setTimeout(r, 1000)); 
      } catch (error) {
        results.push({ groupId: group.id, success: false, error });
      }
    }
    return results;
  }
};