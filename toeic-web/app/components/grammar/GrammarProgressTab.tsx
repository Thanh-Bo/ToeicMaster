"use client";

import { useState, useEffect } from "react";
import { grammarService } from "@/app/services/grammarService";
import { useAuth } from "@/app/contexts/AuthContext";
import {
  Flame,
  Clock,
  BookOpen,
  Target,
  TrendingUp,
  Calendar,
  ChevronRight,
  Loader,
} from "lucide-react";

interface GrammarProgressTabProps {
  period: string;
}

export function GrammarProgressTab({ period }: GrammarProgressTabProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [streak, setStreak] = useState<any>(null);

  

  useEffect(() => {
    if (user?.id) {
      loadData();
    }
  }, [user?.id, period]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, streakData, heatmapData, groupData] = await Promise.all(
        [
          grammarService.getStats(user!.id, period),
          grammarService.getStreak(user!.id),
          grammarService.getHeatmap(user!.id, 12),
          grammarService.getGroupProgress(user!.id),
        ],
      );
     
      setStats(statsData);
      setStreak(streakData);

      
    } catch (error) {
      console.error("Error loading progress data:", error);
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
      <div className="text-center">
        <Loader className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Streak Card */}
      {streak && <StreakCard streak={streak} />}

      {/* Stats Cards */}
      {stats && <StatsCards stats={stats} />}

      
    </div>
  );
}

// Streak Card Component
function StreakCard({ streak }: { streak: any }) {
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-950/50 flex items-center justify-center">
            <Flame className="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {streak.currentStreak} ngày liên tục
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Kỷ lục: {streak.longestStreak} ngày · Tổng:{" "}
              {streak.totalStudyDays} ngày học
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {weekDays.map((day, index) => {
            const activity = streak.weeklyActivity?.[index];
            const isActive = activity?.hasActivity;
            return (
              <div key={day} className="text-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                    isActive
                      ? "bg-green-500 text-white"
                      : "bg-gray-100 dark:bg-zinc-800 text-gray-400"
                  }`}
                >
                  {day.charAt(0)}
                </div>
                <div className="text-xs text-gray-500 mt-1">{day}</div>
              </div>
            );
          })}
        </div>

        <button className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors">
          {streak.hasActivityToday ? "Đã học hôm nay!" : "Học ngay"}
        </button>
      </div>
    </div>
  );
}

// Stats Cards Component
function StatsCards({ stats }: { stats: any }) {
  const cards = [
    {
      icon: BookOpen,
      value: stats.totalLessonsLearned,
      label: "Bài học",
      subtext: `/ ${stats.totalLessonsAvailable}`,
      color: "blue",
    },
    {
      icon: Target,
      value: stats.totalQuestionsPracticed,
      label: "Câu luyện tập",
      subtext: null,
      color: "green",
    },
    {
      icon: TrendingUp,
      value: `${stats.accuracyPercent}%`,
      label: "Độ chính xác",
      subtext: null,
      color:
        stats.accuracyPercent >= 80
          ? "green"
          : stats.accuracyPercent >= 50
          ? "yellow"
          : "red",
    },
    {
      icon: Clock,
      value: stats.totalStudyTimeFormatted,
      label: "Thời gian học",
      subtext: null,
      color: "purple",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className="rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                card.color === "blue"
                  ? "bg-blue-100 dark:bg-blue-950/50 text-blue-600"
                  : card.color === "green"
                  ? "bg-green-100 dark:bg-green-950/50 text-green-600"
                  : card.color === "yellow"
                  ? "bg-yellow-100 dark:bg-yellow-950/50 text-yellow-600"
                  : card.color === "red"
                  ? "bg-red-100 dark:bg-red-950/50 text-red-600"
                  : "bg-purple-100 dark:bg-purple-950/50 text-purple-600"
              }`}
            >
              <card.icon className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {card.value}
            {card.subtext && (
              <span className="text-sm font-normal text-gray-500">
                {card.subtext}
              </span>
            )}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {card.label}
          </div>
        </div>
      ))}
    </div>
  );
}
