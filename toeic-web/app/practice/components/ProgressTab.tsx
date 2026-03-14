"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Flame, CheckCircle, FileText, Award, Target, Clock, TrendingUp, TrendingDown, AlertTriangle, Bookmark, Check, Circle } from "lucide-react";
import { statisticsService, DashboardStats, PartAnalysis, ProgressData, StreakData } from "../../services/statisticsService";
import HistoryTab from "./HistoryTab";

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
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 dark:border-blue-400 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Period Filter */}
      <div className="flex flex-wrap gap-2  p-4 rounded-xl border border-gray-200 dark:border-gray-700">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400 self-center mr-2">Lọc theo thời gian:</span>
        {(Object.keys(PERIOD_LABELS) as PeriodType[]).map((period) => (
          <button
            key={period}
            onClick={() => setSelectedPeriod(period)}
            className={`px-4 py-2 rounded-lg font-medium transition text-sm ${
              selectedPeriod === period
                ? 'bg-indigo-500 text-white shadow-lg'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {PERIOD_LABELS[period]}
          </button>
        ))}
      </div>

      {/* Streak */}
      {streakData && (
        <div className="bg-gradient-to-r from-orange-400 to-pink-500 dark:from-red-600 dark:to-pink-700 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <Flame className="w-12 h-12 text-white" />
              <div>
                <h3 className="text-2xl font-bold">{streakData.currentStreak} ngày liên tục</h3>
                <p className="text-white/80">
                  Kỷ lục: {streakData.longestStreak} ngày | Tổng: {streakData.totalActiveDays} ngày học
                </p>
              </div>
            </div>
            <div className="flex gap-1">
              {streakData.last7Days.map((day, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                    ${day.hasActivity ? 'bg-white text-orange-500 dark:text-red-600' : 'bg-white/30 text-white/70'}`}>
                    {day.hasActivity ? <Check size={18} /> : <Circle size={18} />}
                  </div>
                  <span className="text-xs text-white/70 mt-1">{day.dayName}</span>
                </div>
              ))}
            </div>
            {streakData.todayActive ? (
              <div className="px-4 py-2 bg-white/20 rounded-full flex items-center gap-2"><Check size={18} /> Đã học hôm nay</div>
            ) : (
              <div className="px-4 py-2 bg-white/30 rounded-full animate-pulse">Chưa học hôm nay!</div>
            )}
          </div>
        </div>
      )}

      {/* Dashboard Overview */}
      {dashboard && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className=" rounded-xl shadow-sm dark:shadow-md p-5 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400"><FileText className="w-6 h-6" /></div>
              <div>
                <div className="text-2xl font-bold text-gray-800 dark:text-white">{dashboard.tests.total}</div>
                <div className="text-gray-500 dark:text-gray-400 text-sm">Bài thi</div>
              </div>
            </div>
          </div>

          <div className=" rounded-xl shadow-sm dark:shadow-md p-5 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl text-green-600 dark:text-green-400"><Award className="w-6 h-6" /></div>
              <div>
                <div className={`text-2xl font-bold ${getAccuracyColor(dashboard.tests.averageScore / 9.9)}`}>
                  {dashboard.tests.averageScore}
                </div>
                <div className="text-gray-500 dark:text-gray-400 text-sm">Điểm TB</div>
              </div>
            </div>
          </div>

          <div className=" rounded-xl shadow-sm dark:shadow-md p-5 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl text-purple-600 dark:text-purple-400"><CheckCircle className="w-6 h-6" /></div>
              <div>
                <div className="text-2xl font-bold text-gray-800 dark:text-white">{dashboard.practice.totalQuestions}</div>
                <div className="text-gray-500 dark:text-gray-400 text-sm">Câu luyện tập</div>
              </div>
            </div>
          </div>

          <div className=" rounded-xl shadow-sm dark:shadow-md p-5 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl text-orange-600 dark:text-orange-400"><Target className="w-6 h-6" /></div>
              <div>
                <div className={`text-2xl font-bold ${getAccuracyColor(dashboard.practice.accuracy)}`}>
                  {dashboard.practice.accuracy}%
                </div>
                <div className="text-gray-500 dark:text-gray-400 text-sm">Độ chính xác</div>
              </div>
            </div>
          </div>

          <div className=" rounded-xl shadow-sm dark:shadow-md p-5 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-cyan-100 dark:bg-cyan-900/30 rounded-xl text-cyan-600 dark:text-cyan-400"><Clock className="w-6 h-6" /></div>
              <div>
                <div className="text-2xl font-bold text-gray-800 dark:text-white">
                  {dashboard.totalLearningTimeMinutes}m
                </div>
                <div className="text-gray-500 dark:text-gray-400 text-sm">Thời gian học</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className=" gap-8">
        {/* Parts Analysis */}
        <div className="rounded-2xl shadow-lg dark:shadow-xl p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6"> Phân tích theo Part</h2>

          {!partsData || partsData.parts.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>Chưa có dữ liệu. Hãy làm bài thi hoặc luyện tập!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {partsData.parts.map((part) => (
                <div key={part.partNumber} className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-700 dark:text-gray-200">Part {part.partNumber}</span>
                      <span className="text-gray-400 dark:text-gray-500 text-sm">{part.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${getAccuracyColor(part.accuracy)}`}>
                        {part.accuracy}%
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getLevelColor(part.level)} bg-gray-100 dark:bg-gray-700`}>
                        {part.level}
                      </span>
                    </div>
                  </div>
                  <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
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

        
      </div>

      {/* Strengths and Weaknesses */}
      {partsData && (partsData.strengths.length > 0 || partsData.weaknesses.length > 0) && (
        <div className="grid md:grid-cols-2 gap-8">
          {/* Strengths */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-700">
            <h3 className="text-lg font-bold text-green-800 dark:text-green-400 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" /> Điểm mạnh
            </h3>
            <div className="space-y-3">
              {partsData.strengths.length > 0 ? (
                partsData.strengths.map((strength, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-white/60 dark:bg-gray-900/40 rounded-xl p-3">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <span className="font-medium text-gray-700 dark:text-gray-200">{strength}</span>
                  </div>
                ))
              ) : (
                <p className="text-green-700 dark:text-green-300">Tiếp tục luyện tập để xác định điểm mạnh!</p>
              )}
            </div>
          </div>

          {/* Weaknesses */}
          <div className="bg-gradient-to-br from-orange-50 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl p-6 border border-orange-200 dark:border-orange-700">
            <h3 className="text-lg font-bold text-orange-800 dark:text-orange-400 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" /> Cần cải thiện
            </h3>
            <div className="space-y-3">
              {partsData.weaknesses.length > 0 ? (
                partsData.weaknesses.map((weakness, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-white/60 dark:bg-gray-900/40 rounded-xl p-3">
                    <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0" />
                    <span className="font-medium text-gray-700 dark:text-gray-200">{weakness}</span>
                  </div>
                ))
              ) : (
                <p className="text-orange-700 dark:text-orange-300">Tuyệt vời! Bạn đang làm tốt tất cả các phần!</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="rounded-2xl shadow-lg dark:shadow-xl p-6 border border-gray-200 dark:border-gray-700">
        <HistoryTab />
      </div>
    </div>
  );
}
