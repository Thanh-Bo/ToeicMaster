"use client";

import { useState, useEffect } from "react";
import { Flame, CheckCircle, FileText, Award, Target, Clock, TrendingUp, TrendingDown, AlertTriangle, Check, Circle } from "lucide-react";
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
    if (accuracy >= 80) return "text-green-600";
    if (accuracy >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getAccuracyBg = (accuracy: number) => {
    if (accuracy >= 80) return "bg-green-500";
    if (accuracy >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Excellent": return "text-green-600 dark:text-green-400";
      case "Good": return "text-blue-600 dark:text-blue-400";
      case "Average": return "text-yellow-600 dark:text-yellow-400";
      case "Weak": return "text-red-600 dark:text-red-400";
      default: return "text-gray-600 dark:text-gray-400";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 dark:border-zinc-700 border-t-gray-900 dark:border-t-white"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Period Filter */}
      <div className="flex flex-wrap gap-2 p-3 sm:p-4 rounded-xl border border-gray-200 dark:border-zinc-700">
        <span className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 self-center mr-1 sm:mr-2">Lọc theo thời gian:</span>
        {(Object.keys(PERIOD_LABELS) as PeriodType[]).map((period) => (
          <button
            key={period}
            onClick={() => setSelectedPeriod(period)}
            className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition ${
              selectedPeriod === period
                ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                : "border border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800"
            }`}
          >
            {PERIOD_LABELS[period]}
          </button>
        ))}
      </div>

      {/* Streak */}
      {streakData && (
        <div className="border border-gray-200 dark:border-zinc-700 rounded-2xl p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <Flame className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500" />
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                  {streakData.currentStreak} ngày liên tục
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  Kỷ lục: {streakData.longestStreak} ngày · Tổng: {streakData.totalActiveDays} ngày học
                </p>
              </div>
            </div>

            <div className="flex gap-1 sm:gap-1.5 overflow-x-auto pb-1">
              {streakData.last7Days.map((day, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1">
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition ${
                    day.hasActivity
                      ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                      : "border border-gray-200 dark:border-zinc-700 text-gray-400 dark:text-zinc-600"
                  }`}>
                    {day.hasActivity ? <Check size={12} className="sm:w-3.5 sm:h-3.5" /> : <Circle size={12} className="sm:w-3.5 sm:h-3.5" />}
                  </div>
                  <span className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-600">{day.dayName}</span>
                </div>
              ))}
            </div>

            {streakData.todayActive ? (
              <div className="px-3 sm:px-4 py-2 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 rounded-full text-xs sm:text-sm flex items-center gap-2">
                <Check size={12} /> <span className="hidden sm:inline">Đã học hôm nay</span>
                <span className="sm:hidden">Đã học</span>
              </div>
            ) : (
              <div className="px-3 sm:px-4 py-2 border border-gray-200 dark:border-zinc-700 text-gray-500 dark:text-gray-400 rounded-full text-xs sm:text-sm">
                Chưa học hôm nay!
              </div>
            )}
          </div>
        </div>
      )}

      {/* Dashboard Overview */}
      {dashboard && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
          {[
            { icon: <FileText className="w-4 h-4 sm:w-5 sm:h-5" />, value: dashboard.tests.total, label: "Bài thi" },
            { icon: <Award className="w-4 h-4 sm:w-5 sm:h-5" />, value: dashboard.tests.averageScore, label: "Điểm TB", colored: true, pct: dashboard.tests.averageScore / 9.9 },
            { icon: <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />, value: dashboard.practice.totalQuestions, label: "Câu luyện tập" },
            { icon: <Target className="w-4 h-4 sm:w-5 sm:h-5" />, value: `${dashboard.practice.accuracy}%`, label: "Độ chính xác", colored: true, pct: dashboard.practice.accuracy },
            { icon: <Clock className="w-4 h-4 sm:w-5 sm:h-5" />, value: `${dashboard.totalLearningTimeMinutes}m`, label: "Thời gian học" },
          ].map((card, i) => (
            <div key={i} className="rounded-xl p-3 sm:p-5 border border-gray-200 dark:border-zinc-700">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="text-gray-400 dark:text-gray-500">{card.icon}</div>
                <div>
                  <div className={`text-lg sm:text-2xl font-bold ${(card as any).colored ? getAccuracyColor((card as any).pct) : "text-gray-900 dark:text-white"}`}>
                    {card.value}
                  </div>
                  <div className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">{card.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Parts Analysis */}
      <div className="rounded-xl border border-gray-200 dark:border-zinc-700 p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">Phân tích theo Part</h2>

        {!partsData || partsData.parts.length === 0 ? (
          <div className="text-center py-6 sm:py-8 text-gray-500 dark:text-gray-400 text-sm sm:text-base">
            <p>Chưa có dữ liệu. Hãy làm bài thi hoặc luyện tập!</p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {partsData.parts.map((part) => (
              <div key={part.partNumber} className="relative">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1 sm:mb-2 gap-1 sm:gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-700 dark:text-gray-200 text-sm">Part {part.partNumber}</span>
                    <span className="text-gray-400 dark:text-gray-500 text-xs sm:text-sm">{part.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`font-bold text-sm ${getAccuracyColor(part.accuracy)}`}>
                      {part.accuracy}%
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getLevelColor(part.level)} border border-gray-200 dark:border-zinc-700`}>
                      {part.level}
                    </span>
                  </div>
                </div>
                <div className="h-1.5 sm:h-2 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getAccuracyBg(part.accuracy)} rounded-full transition-all`}
                    style={{ width: `${part.accuracy}%` }}
                  />
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  {part.correctAnswers}/{part.totalQuestions} câu đúng
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
          <div className="rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-zinc-700">
            <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" /> Điểm mạnh
            </h3>
            <div className="space-y-2">
              {partsData.strengths.length > 0 ? (
                partsData.strengths.map((strength, idx) => (
                  <div key={idx} className="flex items-center gap-2 sm:gap-3 border border-gray-200 dark:border-zinc-700 rounded-lg p-2.5 sm:p-3">
                    <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">{strength}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Tiếp tục luyện tập để xác định điểm mạnh!</p>
              )}
            </div>
          </div>

          {/* Weaknesses */}
          <div className="rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-zinc-700">
            <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" /> Cần cải thiện
            </h3>
            <div className="space-y-2">
              {partsData.weaknesses.length > 0 ? (
                partsData.weaknesses.map((weakness, idx) => (
                  <div key={idx} className="flex items-center gap-2 sm:gap-3 border border-gray-200 dark:border-zinc-700 rounded-lg p-2.5 sm:p-3">
                    <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">{weakness}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Tuyệt vời! Bạn đang làm tốt tất cả các phần!</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
