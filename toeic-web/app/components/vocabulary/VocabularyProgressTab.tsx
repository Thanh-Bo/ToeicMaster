"use client";

import { useState, useEffect } from "react";
import { vocabularyService } from "@/app/services/vocabularyService";
import { useAuth } from "@/app/contexts/AuthContext";
import {
  Flame,
  BookOpen,
  Target,
  Clock,
  TrendingUp,
  Loader,
} from "lucide-react";

interface VocabularyProgressTabProps {
  period?: string;
}

export function VocabularyProgressTab({ period }: VocabularyProgressTabProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<{
    totalTopicsLearned: number;
    totalVocabLearned: number;
    reviewDue: number;
    totalTimeMinutes: number;
    streak: { current: number; longest: number };
  } | null>(null);

  useEffect(() => {
    if (user?.id) {
      loadData();
    }
  }, [user?.id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await vocabularyService.getVocabStats(user!.id);
      setStats(data);
    } catch (error) {
      console.error("Error loading vocab progress data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">
          Vui lòng đăng nhập để xem tiến độ
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <Loader className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">
          Không thể tải dữ liệu. Vui lòng thử lại sau.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Streak Card */}
      <StreakCard streak={stats.streak} />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
          value={stats.totalTopicsLearned}
          label="Chủ đề đã học"
          bgColor="bg-blue-50 dark:bg-blue-950/30"
        />
        <StatCard
          icon={<Target className="w-6 h-6 text-green-600 dark:text-green-400" />}
          value={stats.totalVocabLearned}
          label="Từ đã học"
          bgColor="bg-green-50 dark:bg-green-950/30"
        />
        <StatCard
          icon={<TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />}
          value={stats.reviewDue}
          label="Cần ôn tập"
          bgColor="bg-orange-50 dark:bg-orange-950/30"
        />
        <StatCard
          icon={<Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />}
          value={`${stats.totalTimeMinutes}m`}
          label="Thời gian học"
          bgColor="bg-purple-50 dark:bg-purple-950/30"
        />
      </div>
    </div>
  );
}

// Streak Card Component
function StreakCard({ streak }: { streak: { current: number; longest: number } }) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-950/50 flex items-center justify-center">
            <Flame className="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {streak.current} ngày
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Streak hiện tại
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            {streak.longest}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Streak cao nhất
          </div>
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({
  icon,
  value,
  label,
  bgColor,
}: {
  icon: React.ReactNode;
  value: number | string;
  label: string;
  bgColor: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-6">
      <div className={`w-12 h-12 rounded-lg ${bgColor} flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
        {value}
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
    </div>
  );
}
