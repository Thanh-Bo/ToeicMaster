"use client";

import { useState, useEffect } from "react";
import { Flame, CheckCircle, FileText, Award, Target, Clock, TrendingUp, AlertTriangle, Check, Circle } from "lucide-react";
import { statisticsService, DashboardStats, PartAnalysis, ProgressData, StreakData } from "../../services/statisticsService";

interface PartsAnalysisResponse {
  period: string;
  parts: PartAnalysis[];
  strengths: string[];
  weaknesses: string[];
}

interface ProgressResponse {
  period: string;
  chartData: ProgressData[];
  summary: {
    totalTests: number;
    averageScore: number;
    bestScore: number;
    trend: number;
    trendDirection: string;
  };
}

type PeriodType = "7days" | "30days" | "90days" | "1year" | "alltime";

const PERIOD_LABELS: Record<PeriodType, string> = {
  "7days": "7 ngày",
  "30days": "30 ngày",
  "90days": "90 ngày",
  "1year": "1 năm",
  "alltime": "Tất cả"
};

export default function ProgressTab() {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>("30days");
  const [dashboard, setDashboard] = useState<DashboardStats | null>(null);
  const [partsData, setPartsData] = useState<PartsAnalysisResponse | null>(null);
  const [progressData, setProgressData] = useState<ProgressResponse | null>(null);
  const [streakData, setStreakData] = useState<StreakData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllStats();
  }, [selectedPeriod]);

  const loadAllStats = async () => {
    setLoading(true);
    try {
      const [dashboardRes, partsRes, progressRes, streakRes] = await Promise.all([
        statisticsService.getDashboard(selectedPeriod).catch(() => null),
        statisticsService.getPartsAnalysis(selectedPeriod).catch(() => null),
        statisticsService.getProgress(selectedPeriod).catch(() => null),
        statisticsService.getStreak().catch(() => null)
      ]);

      setDashboard(dashboardRes);
      setPartsData(partsRes);
      setProgressData(progressRes);
      setStreakData(streakRes);
    } catch (error) {
      console.error("Failed to load statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 80) return "text-emerald-600 dark:text-emerald-400";
    if (accuracy >= 60) return "text-amber-600 dark:text-amber-400";
    return "text-rose-600 dark:text-rose-400";
  };

  const getAccuracyBg = (accuracy: number) => {
    if (accuracy >= 80) return "bg-gradient-to-r from-emerald-500 to-green-400";
    if (accuracy >= 60) return "bg-gradient-to-r from-amber-500 to-yellow-400";
    return "bg-gradient-to-r from-rose-500 to-pink-500";
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Excellent": return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case "Good": return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
      case "Average": return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      case "Weak": return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
      default: return "bg-gray-100/50 text-gray-600 dark:bg-zinc-800/40 dark:text-gray-400 border-gray-200/50 dark:border-zinc-700/50";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 dark:border-zinc-700 border-t-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Period Filter */}
      <div className="inline-flex w-full flex-wrap gap-2 p-1.5 bg-gray-100/80 dark:bg-zinc-900/60 backdrop-blur-md rounded-2xl border border-gray-200/50 dark:border-zinc-800/50">
        <span className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 self-center px-3 py-1">Thời gian:</span>
        {(Object.keys(PERIOD_LABELS) as PeriodType[]).map((period) => (
          <button
            key={period}
            onClick={() => setSelectedPeriod(period)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
              selectedPeriod === period
                ? "bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm scale-[1.02]"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-white/30 dark:hover:bg-zinc-800/60"
            }`}
          >
            {PERIOD_LABELS[period]}
          </button>
        ))}
      </div>

      {/* Streak */}
      {streakData && (
        <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent border border-orange-500/20 dark:border-orange-500/30 rounded-2xl p-5 sm:p-6 backdrop-blur-md shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-3 bg-orange-500/10 dark:bg-orange-500/20 rounded-2xl">
                <Flame className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500 filter drop-shadow-[0_0_8px_rgba(249,115,22,0.5)] animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  {streakData.currentStreak} ngày liên tục
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  Kỷ lục: <span className="font-semibold text-gray-700 dark:text-gray-300">{streakData.longestStreak} ngày</span> · Tổng: <span className="font-semibold text-gray-700 dark:text-gray-300">{streakData.totalActiveDays} ngày học</span>
                </p>
              </div>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 -mx-3 px-3 lg:mx-0 lg:px-0 scrollbar-none items-center">
              {streakData.last7Days.map((day, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1.5 min-w-[36px]">
                  <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    day.hasActivity
                      ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20 scale-105"
                      : "border border-gray-200 dark:border-zinc-800 text-gray-400 dark:text-zinc-500 bg-white/50 dark:bg-zinc-900/50"
                  }`}>
                    {day.hasActivity ? <Check size={14} className="stroke-[3]" /> : <Circle size={14} className="opacity-40" />}
                  </div>
                  <span className="text-[10px] sm:text-xs font-semibold text-gray-400 dark:text-gray-500">{day.dayName}</span>
                </div>
              ))}
            </div>

            <div className="shrink-0">
              {streakData.todayActive ? (
                <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 rounded-full text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-xs">
                  <Check size={14} className="stroke-[3]" />
                  <span>Đã hoàn thành hôm nay</span>
                </div>
              ) : (
                <div className="px-4 py-2 bg-orange-500/10 border border-orange-500/25 text-orange-600 dark:text-orange-400 rounded-full text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-xs animate-pulse">
                  <span>Chưa học hôm nay!</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Dashboard Overview */}
      {dashboard && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
          {[
            { icon: <FileText className="w-5 h-5" />, value: dashboard.tests.total, label: "Bài thi", colorClass: "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400" },
            { icon: <Award className="w-5 h-5" />, value: dashboard.tests.averageScore, label: "Điểm TB", colored: true, pct: dashboard.tests.averageScore / 9.9, colorClass: "bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400" },
            { icon: <CheckCircle className="w-5 h-5" />, value: dashboard.practice.totalQuestions, label: "Câu đã làm", colorClass: "bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400" },
            { icon: <Target className="w-5 h-5" />, value: `${dashboard.practice.accuracy}%`, label: "Độ chính xác", colored: true, pct: dashboard.practice.accuracy, colorClass: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400" },
            { icon: <Clock className="w-5 h-5" />, value: `${dashboard.totalLearningTimeMinutes}m`, label: "Thời gian học", colorClass: "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400" },
          ].map((card, i) => (
            <div key={i} className="bg-white/80 dark:bg-zinc-900/60 backdrop-blur-md border border-gray-200/50 dark:border-zinc-800/50 rounded-2xl p-4 sm:p-5 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] flex items-center gap-3 sm:gap-4">
              <div className={`p-2.5 rounded-xl ${card.colorClass} shrink-0`}>
                {card.icon}
              </div>
              <div className="min-w-0">
                <div className={`text-lg sm:text-2xl font-black tracking-tight truncate ${card.colored ? getAccuracyColor(card.pct) : "text-gray-900 dark:text-white"}`}>
                  {card.value}
                </div>
                <div className="text-gray-500 dark:text-gray-400 text-xs font-semibold truncate mt-0.5">{card.label}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Parts Analysis */}
      <div className="bg-white/80 dark:bg-zinc-900/60 backdrop-blur-md border border-gray-200/50 dark:border-zinc-800/50 rounded-2xl p-5 sm:p-6">
        <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-5 sm:mb-6 border-b border-gray-200/40 dark:border-zinc-800/50 pb-3">Phân tích theo Part</h2>

        {!partsData || partsData.parts.length === 0 ? (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400 text-sm sm:text-base">
            <p className="font-semibold">Chưa có dữ liệu thống kê</p>
            <p className="text-xs text-gray-400 mt-1">Hãy làm bài thi hoặc luyện tập để xem phân tích chi tiết!</p>
          </div>
        ) : (
          <div className="space-y-5 sm:space-y-6">
            {partsData.parts.map((part) => (
              <div key={part.partNumber} className="relative">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1.5 sm:mb-2 gap-1.5 sm:gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">Part {part.partNumber}</span>
                    <span className="text-gray-500 dark:text-gray-400 text-xs font-semibold">{part.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`font-bold text-sm ${getAccuracyColor(part.accuracy)}`}>
                      {part.accuracy}%
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getLevelColor(part.level)}`}>
                      {part.level}
                    </span>
                  </div>
                </div>
                <div className="h-2.5 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getAccuracyBg(part.accuracy)} rounded-full transition-all duration-500`}
                    style={{ width: `${part.accuracy}%` }}
                  />
                </div>
                <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 mt-1">
                  Đúng {part.correctAnswers}/{part.totalQuestions} câu đã làm
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Strengths and Weaknesses */}
      {partsData && (partsData.strengths.length > 0 || partsData.weaknesses.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Strengths */}
          <div className="bg-emerald-500/5 dark:bg-emerald-500/5 border border-emerald-500/20 dark:border-emerald-500/20 rounded-2xl p-5 sm:p-6 backdrop-blur-md">
            <h3 className="text-sm sm:text-base font-bold text-emerald-700 dark:text-emerald-400 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>Điểm mạnh nổi bật</span>
            </h3>
            <div className="space-y-2.5">
              {partsData.strengths.length > 0 ? (
                partsData.strengths.map((strength, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-white/60 dark:bg-zinc-900/60 border border-emerald-100/50 dark:border-emerald-950/20 rounded-xl p-3 sm:p-3.5 shadow-2xs">
                    <CheckCircle className="w-4 h-4 text-emerald-500 dark:text-emerald-450 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-250 leading-normal">{strength}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs sm:text-sm text-emerald-600/70 dark:text-emerald-400/70">Hãy tiếp tục luyện tập để hệ thống xác định được thế mạnh của bạn!</p>
              )}
            </div>
          </div>

          {/* Weaknesses */}
          <div className="bg-rose-500/5 dark:bg-rose-500/5 border border-rose-500/20 dark:border-rose-500/20 rounded-2xl p-5 sm:p-6 backdrop-blur-md">
            <h3 className="text-sm sm:text-base font-bold text-rose-700 dark:text-rose-400 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              <span>Cần tập trung cải thiện</span>
            </h3>
            <div className="space-y-2.5">
              {partsData.weaknesses.length > 0 ? (
                partsData.weaknesses.map((weakness, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-white/60 dark:bg-zinc-900/60 border border-rose-100/50 dark:border-rose-950/20 rounded-xl p-3 sm:p-3.5 shadow-2xs">
                    <AlertTriangle className="w-4 h-4 text-rose-500 dark:text-rose-450 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-250 leading-normal">{weakness}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs sm:text-sm text-rose-600/70 dark:text-rose-400/70">Tuyệt vời! Hiện tại bạn không có phần yếu đáng chú ý nào.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
