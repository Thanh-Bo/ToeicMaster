import axiosClient from "./axiosClient";

export interface OverallStats {
  testCount: number;
  grammarTopicsCount: number;
  grammarQuestionsCount: number;
  vocabTopicsCount: number;
  vocabCount: number;
}

export const overallStatsService = {
  getOverallStats: async (): Promise<OverallStats> => {
    const response = await axiosClient.get("/overall-stats/stats");
    return response.data;
  },
};
