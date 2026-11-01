import axiosClient from "./axiosClient";
import { createCachedRequest } from "../lib/requestCache";

export interface OverallStats {
  testCount: number;
  grammarTopicsCount: number;
  grammarQuestionsCount: number;
  vocabTopicsCount: number;
  vocabCount: number;
  readingTopicCount: number;
  readingPassageCount: number;
}

// Homepage stats: identical calls in the same tick (StrictMode / multiple widgets)
// share one request, and the value is reused for 60s instead of re-fetching on
// every mount.
const getStatsRequest = createCachedRequest(async (): Promise<OverallStats> => {
  const response = await axiosClient.get("/overall-stats/stats");
  return response.data;
}, 60_000);

export const overallStatsService = {
  getOverallStats: (options?: { force?: boolean }): Promise<OverallStats> => {
    return getStatsRequest.get(options);
  },

  invalidateOverallStats: () => {
    getStatsRequest.invalidate();
  },
};
