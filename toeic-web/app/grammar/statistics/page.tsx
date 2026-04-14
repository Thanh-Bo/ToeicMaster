"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GrammarTopic } from "@/app/types";
import { grammarService } from "@/app/services/grammarService";
import {
  ArrowLeft,
  Loader,
  TrendingUp,
  CalendarDays,
  Zap,
  Target,
} from "lucide-react";

interface UserStats {
  totalLearned: number;
  totalMastered: number;
  totalReviewed: number;
  streakDays: number;
  lastReviewDate?: string;
  accuracy?: number;
}

export default function GrammarStatisticsPage() {
  const router = useRouter();
  const [topics, setTopics] = useState<GrammarTopic[]>([]);
  const [stats, setStats] = useState<UserStats>({
    totalLearned: 0,
    totalMastered: 0,
    totalReviewed: 0,
    streakDays: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      const data = await grammarService.getTopics();
      setTopics(data);

      // Calculate aggregated statistics
      let learned = 0;
      let mastered = 0;
      let reviewed = 0;
      let accuracy = 0;
      let totalAttempts = 0;

      data.forEach((topic: GrammarTopic) => {
        learned += topic.learnedRules || 0;
        mastered += (topic.ruleCounts?.[3] || 0); // Status 3 = Mastered
        reviewed += Object.values(topic.ruleCounts || {}).reduce((a, b) => a + b, 0);
      });

      setStats({
        totalLearned: learned,
        totalMastered: mastered,
        totalReviewed: reviewed,
        streakDays: 5, // Would come from backend
        lastReviewDate: new Date().toLocaleDateString("vi-VN"),
        accuracy: 78, // Would come from backend
      });
    } catch (error) {
      console.error("Error loading statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Đang tải thống kê...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900">
      {/* Header */}
      <div className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => router.push("/grammar")}
            className="inline-flex items-center gap-2 mb-6 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            Quay lại
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Thống kê học tập
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Theo dõi tiến độ học ngữ pháp của bạn
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Total Learned */}
          <div className="rounded-xl border-2 border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                Đang học
              </h3>
              <TrendingUp className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {stats.totalLearned}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              quy tắc
            </p>
          </div>

          {/* Total Mastered */}
          <div className="rounded-xl border-2 border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                Nắm vững
              </h3>
              <Target className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {stats.totalMastered}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              quy tắc
            </p>
          </div>

          {/* Streak */}
          <div className="rounded-xl border-2 border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                Streak
              </h3>
              <Zap className="w-5 h-5 text-orange-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {stats.streakDays}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              ngày liên tiếp
            </p>
          </div>

          {/* Accuracy */}
          <div className="rounded-xl border-2 border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                Độ chính xác
              </h3>
              <CalendarDays className="w-5 h-5 text-purple-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {stats.accuracy}%
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              trên tổng số
            </p>
          </div>
        </div>

        {/* Topics Progress */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Tiến độ theo chủ đề
          </h2>

          <div className="space-y-4">
            {topics.map((topic) => {
              const total = (topic.learnedRules || 0) + (topic.ruleCounts?.[3] || 0);
              const progress = total > 0 
                ? Math.round(((topic.ruleCounts?.[3] || 0) / total) * 100) 
                : 0;

              return (
                <div
                  key={topic.id}
                  className="rounded-lg border-2 border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">
                        {topic.category}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {topic.learnedRules || 0} đang học, {topic.ruleCounts?.[3] || 0} nắm vững
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {progress}%
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        hoàn thành
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-2 rounded-full bg-gray-200 dark:bg-zinc-700 overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Learning Info */}
        <div className="mt-12 rounded-lg bg-blue-50 dark:bg-blue-950/30 border-2 border-blue-200 dark:border-blue-900 p-6">
          <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-3">
            📚 Mẹo học tập hiệu quả
          </h3>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
            <li>✓ Duy trì streak học tập hàng ngày để cải thiện kỹ năng</li>
            <li>✓ Ôn tập quy tắc sẵn sàng khi bạn thấy biểu tượng ⏰</li>
            <li>✓ Làm bài kiểm tra sau khi học quy tắc mới</li>
            <li>✓ Theo dõi thống kê để xem tiến độ của bạn</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
