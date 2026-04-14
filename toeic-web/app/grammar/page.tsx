"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GrammarTopic } from "@/app/types";
import { grammarService } from "@/app/services/grammarService";
import { GrammarTopicGrid } from "@/app/components/grammar/GrammarTopicGrid";
import {
  Book,
  Flame,
  Target,
  TrendingUp,
  ArrowRight,
  Loader,
} from "lucide-react";

export default function GrammarHub() {
  const router = useRouter();
  const [topics, setTopics] = useState<GrammarTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalLearned: 0,
    totalMastered: 0,
    streakDays: 0,
    readyForReview: 0,
  });

  useEffect(() => {
    loadTopics();
  }, []);

  const loadTopics = async () => {
    try {
      setLoading(true);
      const data = await grammarService.getTopics();
      setTopics(data);

      // Calculate statistics
      let learned = 0;
      let mastered = 0;
      let readyForReview = 0;

      data.forEach((topic: GrammarTopic) => {
        learned += topic.learnedRules || 0;
        mastered += (topic.ruleCounts?.[3] || 0); // Status 3 = Mastered
        if (
          topic.nextReviewAt &&
          new Date(topic.nextReviewAt) <= new Date()
        ) {
          readyForReview += 1;
        }
      });

      setStats({
        totalLearned: learned,
        totalMastered: mastered,
        streakDays: 5, // This would come from backend UserGrammarStats
        readyForReview,
      });
    } catch (error) {
      console.error("Error loading grammar topics:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900">
      {/* Header */}
      <div className="bg-blue-50 dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Ngữ Pháp Tiếng Anh
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Học từng quy tắc ngữ pháp với hệ thống lặp lại ngắt quãng (SRS)
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Learned Count */}
          <div className="rounded-xl border-2 border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-6 hover:shadow-lg transition-all duration-200 hover:border-blue-400 dark:hover:border-blue-600">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                Đang học
              </h3>
              <Book className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {stats.totalLearned}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              quy tắc học
            </p>
          </div>

          {/* Mastered Count */}
          <div className="rounded-xl border-2 border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-6 hover:shadow-lg transition-all duration-200 hover:border-green-400 dark:hover:border-green-600">
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
          <div className="rounded-xl border-2 border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-6 hover:shadow-lg transition-all duration-200 hover:border-orange-400 dark:hover:border-orange-600">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                Streak
              </h3>
              <Flame className="w-5 h-5 text-orange-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {stats.streakDays}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              ngày liên tiếp
            </p>
          </div>

          {/* Ready for Review */}
          <div className="rounded-xl border-2 border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-6 hover:shadow-lg transition-all duration-200 hover:border-purple-400 dark:hover:border-purple-600">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                Sẵn sàng ôn
              </h3>
              <TrendingUp className="w-5 h-5 text-purple-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {stats.readyForReview}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              chủ đề
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <Link
            href="/grammar/practice"
            className="rounded-xl border-2 border-blue-400 dark:border-blue-600 bg-white dark:bg-zinc-900 p-6 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all duration-200 hover:shadow-md group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Luyện tập
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Làm bài kiểm tra
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/grammar/review"
            className="rounded-xl border-2 border-purple-400 dark:border-purple-600 bg-white dark:bg-zinc-900 p-6 hover:bg-purple-50 dark:hover:bg-purple-950/30 transition-all duration-200 hover:shadow-md group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Ôn tập
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Flashcard SRS
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-purple-600 dark:text-purple-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/grammar/statistics"
            className="rounded-xl border-2 border-teal-400 dark:border-teal-600 bg-white dark:bg-zinc-900 p-6 hover:bg-teal-50 dark:hover:bg-teal-950/30 transition-all duration-200 hover:shadow-md group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Thống kê
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Xem tiến độ
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-teal-600 dark:text-teal-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>

        {/* Topics Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            Chủ đề ngữ pháp
          </h2>
          <GrammarTopicGrid
            topics={topics}
            isLoading={loading}
            isEmpty={topics.length === 0}
          />
        </div>
      </div>
    </div>
  );
}
