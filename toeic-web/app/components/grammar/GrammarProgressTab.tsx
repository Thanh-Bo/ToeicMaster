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
    <div className="rounded-2xl border border-zinc-200/50 dark:border-zinc-800/40 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md p-4 sm:p-6 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Streak Info */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-orange-500/10 dark:bg-orange-500/5 flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(249,115,22,0.12)] dark:shadow-[0_0_20px_rgba(249,115,22,0.08)]">
            <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500 dark:text-orange-400" />
          </div>
          <div>
            <div className="text-lg sm:text-xl font-extrabold text-gray-900 dark:text-white">
              {streak.currentStreak} ngày liên tục
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              Kỷ lục: <span className="font-bold text-gray-700 dark:text-zinc-300">{streak.longestStreak} ngày</span> · Tổng:{" "}
              <span className="font-bold text-gray-700 dark:text-zinc-300">{streak.totalStudyDays} ngày học</span>
            </div>
          </div>
        </div>

        {/* Weekly Activity */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-2">
          {weekDays.map((day, index) => {
            const activity = streak.weeklyActivity?.[index];
            const isActive = activity?.hasActivity;
            return (
              <div key={day} className="text-center">
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-xs font-mono font-black border transition-all duration-300 ${
                    isActive
                      ? "bg-emerald-500/10 dark:bg-emerald-500/5 border-emerald-500/30 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 scale-[1.03]"
                      : "bg-zinc-50/50 dark:bg-zinc-950/20 border-dashed border-zinc-200/60 dark:border-zinc-800/60 text-zinc-400 dark:text-zinc-600"
                  }`}
                >
                  {day.charAt(0)}
                </div>
                <div className="text-[10px] text-gray-400 dark:text-zinc-500 mt-1 font-bold hidden sm:block">{day}</div>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <button className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold transition-all duration-200 text-xs sm:text-sm shadow-sm hover:shadow-[0_4px_12px_rgba(59,130,246,0.2)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] transform">
          {streak.hasActivityToday ? "Đã học hôm nay!" : "Học ngay"}
        </button>
      </div>
    </div>
  );
}

// Stats Cards Component
function StatsCards({ stats }: { stats: any }) {
  const accuracy = stats.accuracyPercent || 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* Card 1: Lessons learned */}
      <div className="rounded-2xl border border-zinc-200/50 dark:border-zinc-800/40 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md p-5 flex flex-col justify-between hover:shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:-translate-y-0.5 dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.15)] transition-all duration-250 transform">
        <div>
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3 border border-blue-500/10 dark:border-blue-900/20">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white font-mono">
            {stats.totalLessonsLearned}
          </div>
        </div>
        <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-bold mt-2">
          Chủ đề đã học
        </div>
      </div>

      {/* Card 2: Questions practiced */}
      <div className="rounded-2xl border border-zinc-200/50 dark:border-zinc-800/40 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md p-5 flex flex-col justify-between hover:shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:-translate-y-0.5 dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.15)] transition-all duration-250 transform">
        <div>
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3 border border-emerald-500/10 dark:border-emerald-900/20">
            <Target className="w-5 h-5" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white font-mono">
            {stats.totalQuestionsPracticed}
          </div>
        </div>
        <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-bold mt-2">
          Câu đã luyện tập
        </div>
      </div>

      {/* Card 3: Accuracy Circular Gauge */}
      <div className="rounded-2xl border border-zinc-200/50 dark:border-zinc-800/40 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md p-4 sm:p-5 flex items-center gap-3 sm:gap-4 hover:shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:-translate-y-0.5 dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.15)] transition-all duration-250 transform">
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center flex-shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="5" className="text-zinc-200 dark:text-zinc-800/80" fill="transparent" />
            <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="5" className={`${
              accuracy >= 75
                ? "text-emerald-500 drop-shadow-[0_0_6px_rgba(16,185,129,0.15)]"
                : accuracy >= 50
                ? "text-sky-500 drop-shadow-[0_0_6px_rgba(14,165,233,0.15)]"
                : "text-amber-500 drop-shadow-[0_0_6px_rgba(245,158,11,0.15)]"
            } transition-all duration-500`} fill="transparent" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * (accuracy / 100))} />
          </svg>
          <span className="absolute text-sm sm:text-base font-black text-gray-900 dark:text-white font-mono">{accuracy}%</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-bold">Độ chính xác</span>
          <span className="text-[10px] text-gray-400 dark:text-zinc-500 mt-0.5 leading-tight">Tỉ lệ trả lời đúng</span>
        </div>
      </div>

      {/* Card 4: Study Time */}
      <div className="rounded-2xl border border-zinc-200/50 dark:border-zinc-800/40 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md p-5 flex flex-col justify-between hover:shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:-translate-y-0.5 dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.15)] transition-all duration-250 transform">
        <div>
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3 border border-purple-500/10 dark:border-purple-900/20">
            <Clock className="w-5 h-5" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white font-mono truncate" title={stats.totalStudyTimeFormatted}>
            {stats.totalStudyTimeFormatted || "0m"}
          </div>
        </div>
        <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-bold mt-2">
          Thời gian học
        </div>
      </div>
    </div>
  );
}
