"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { statisticsService, DashboardStats, PartAnalysis, ProgressData, StreakData } from "../services/statisticsService";

interface PartsAnalysisResponse {
  parts: PartAnalysis[];
  strengths: string[];
  weaknesses: string[];
}

interface ProgressResponse {
  chartData: ProgressData[];
  summary: {
    totalTests: number;
    averageScore: number;
    bestScore: number;
    trend: number;
    trendDirection: string;
  };
}

export default function StatisticsPage() {
  const [dashboard, setDashboard] = useState<DashboardStats | null>(null);
  const [partsData, setPartsData] = useState<PartsAnalysisResponse | null>(null);
  const [progressData, setProgressData] = useState<ProgressResponse | null>(null);
  const [streakData, setStreakData] = useState<StreakData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllStats();
  }, []);

  const loadAllStats = async () => {
    try {
      const [dashboardRes, partsRes, progressRes, streakRes] = await Promise.all([
        statisticsService.getDashboard().catch(() => null),
        statisticsService.getPartsAnalysis().catch(() => null),
        statisticsService.getProgress(30).catch(() => null),
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
      case "Excellent": return "text-green-600";
      case "Good": return "text-blue-600";
      case "Average": return "text-yellow-600";
      case "Weak": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-indigo-50 to-purple-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 to-purple-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">📊 Thống kê & Tiến bộ</h1>
            <p className="text-gray-600 mt-1">Theo dõi quá trình học tập của bạn</p>
          </div>
          <Link href="/" className="px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition text-gray-700">
            ← Trang chủ
          </Link>
        </div>

        {/* Streak */}
        {streakData && (
          <div className="bg-linear-to-r from-orange-400 to-pink-500 rounded-2xl shadow-lg p-6 mb-8 text-white">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="text-5xl">🔥</div>
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
                      ${day.hasActivity ? 'bg-white text-orange-500' : 'bg-white/30 text-white/70'}`}>
                      {day.hasActivity ? '✓' : '○'}
                    </div>
                    <span className="text-xs text-white/70 mt-1">{day.dayName}</span>
                  </div>
                ))}
              </div>
              {streakData.todayActive ? (
                <div className="px-4 py-2 bg-white/20 rounded-full">✓ Đã học hôm nay</div>
              ) : (
                <div className="px-4 py-2 bg-white/30 rounded-full animate-pulse">Chưa học hôm nay!</div>
              )}
            </div>
          </div>
        )}

        {/* Dashboard Overview */}
        {dashboard && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-xl text-blue-600 text-2xl">📝</div>
                <div>
                  <div className="text-2xl font-bold text-gray-800">{dashboard.tests.total}</div>
                  <div className="text-gray-500 text-sm">Bài thi</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-xl text-green-600 text-2xl">💯</div>
                <div>
                  <div className={`text-2xl font-bold ${getAccuracyColor(dashboard.tests.averageScore / 9.9)}`}>
                    {dashboard.tests.averageScore}
                  </div>
                  <div className="text-gray-500 text-sm">Điểm TB</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-xl text-purple-600 text-2xl">✅</div>
                <div>
                  <div className="text-2xl font-bold text-gray-800">{dashboard.practice.totalQuestions}</div>
                  <div className="text-gray-500 text-sm">Câu luyện tập</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-100 rounded-xl text-orange-600 text-2xl">🎯</div>
                <div>
                  <div className={`text-2xl font-bold ${getAccuracyColor(dashboard.practice.accuracy)}`}>
                    {dashboard.practice.accuracy}%
                  </div>
                  <div className="text-gray-500 text-sm">Độ chính xác</div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Parts Analysis */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">📈 Phân tích theo Part</h2>
            
            {!partsData || partsData.parts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Chưa có dữ liệu. Hãy làm bài thi hoặc luyện tập!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {partsData.parts.map((part) => (
                  <div key={part.partNumber} className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-700">Part {part.partNumber}</span>
                        <span className="text-gray-400 text-sm">{part.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${getAccuracyColor(part.accuracy)}`}>
                          {part.accuracy}%
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getLevelColor(part.level)} bg-gray-100`}>
                          {part.level}
                        </span>
                      </div>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getAccuracyBg(part.accuracy)} rounded-full transition-all`}
                        style={{ width: `${part.accuracy}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {part.correctAnswers}/{part.totalQuestions} câu đúng
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Progress Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">📉 Tiến bộ 30 ngày</h2>
            
            {!progressData || progressData.chartData.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Chưa có dữ liệu. Hãy làm bài thi hoặc luyện tập!</p>
              </div>
            ) : (
              <>
                {/* Summary */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-3 bg-blue-50 rounded-xl">
                    <div className="text-xl font-bold text-blue-600">{progressData.summary.totalTests}</div>
                    <div className="text-xs text-blue-700">Bài thi</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-xl">
                    <div className="text-xl font-bold text-green-600">{progressData.summary.averageScore}</div>
                    <div className="text-xs text-green-700">Điểm TB</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-xl">
                    <div className="text-xl font-bold text-purple-600">{progressData.summary.bestScore}</div>
                    <div className="text-xs text-purple-700">Điểm cao nhất</div>
                  </div>
                </div>

                {/* Bar Chart */}
                <div className="h-48">
                  <div className="h-full flex items-end gap-1">
                    {progressData.chartData.slice(-14).map((data: ProgressData, index: number) => {
                      const score = data.testScore || data.practiceAccuracy || 0;
                      return (
                        <div
                          key={index}
                          className="flex-1 bg-linear-to-t from-indigo-500 to-purple-500 rounded-t transition-all hover:from-indigo-600 hover:to-purple-600 cursor-pointer"
                          style={{ height: `${score}%`, minHeight: score > 0 ? '4px' : '0' }}
                          title={`${data.date}: ${score}%`}
                        />
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-2">
                    <span>{progressData.chartData.slice(-14)[0]?.date || ''}</span>
                    <span>{progressData.chartData.slice(-1)[0]?.date || ''}</span>
                  </div>
                </div>

                {/* Trend */}
                <div className="mt-4 text-center">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium
                    ${progressData.summary.trendDirection === 'up' ? 'bg-green-100 text-green-700' : 
                      progressData.summary.trendDirection === 'down' ? 'bg-red-100 text-red-700' : 
                      'bg-gray-100 text-gray-700'}`}>
                    {progressData.summary.trendDirection === 'up' ? '📈' : 
                     progressData.summary.trendDirection === 'down' ? '📉' : '➡️'}
                    {progressData.summary.trend > 0 ? '+' : ''}{progressData.summary.trend}% so với trước
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Strengths and Weaknesses */}
        {partsData && (partsData.strengths.length > 0 || partsData.weaknesses.length > 0) && (
          <div className="grid md:grid-cols-2 gap-8 mt-8">
            {/* Strengths */}
            <div className="bg-linear-to-br from-green-50 to-emerald-100 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-green-800 mb-4 flex items-center gap-2">
                💪 Điểm mạnh
              </h3>
              <div className="space-y-3">
                {partsData.strengths.length > 0 ? (
                  partsData.strengths.map((strength, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-white/60 rounded-xl p-3">
                      <span className="text-green-600 text-xl">✓</span>
                      <span className="font-medium text-gray-700">{strength}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-green-700">Tiếp tục luyện tập để xác định điểm mạnh!</p>
                )}
              </div>
            </div>

            {/* Weaknesses */}
            <div className="bg-linear-to-br from-red-50 to-orange-100 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-red-800 mb-4 flex items-center gap-2">
                ⚠️ Cần cải thiện
              </h3>
              <div className="space-y-3">
                {partsData.weaknesses.length > 0 ? (
                  partsData.weaknesses.map((weakness, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-white/60 rounded-xl p-3">
                      <span className="text-red-600 text-xl">!</span>
                      <span className="font-medium text-gray-700">{weakness}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-red-700">Tuyệt vời! Bạn đang làm tốt tất cả các phần!</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🚀 Hành động tiếp theo</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link
              href="/practice"
              className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition"
            >
              <div className="text-3xl">🎯</div>
              <div>
                <h4 className="font-bold text-gray-800">Luyện tập</h4>
                <p className="text-gray-600 text-sm">Luyện từng Part riêng biệt</p>
              </div>
            </Link>

            <Link
              href="/vocabulary/flashcards"
              className="flex items-center gap-4 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition"
            >
              <div className="text-3xl">🎴</div>
              <div>
                <h4 className="font-bold text-gray-800">Flashcards</h4>
                <p className="text-gray-600 text-sm">Học từ vựng mới</p>
              </div>
            </Link>

            <Link
              href="/bookmarks"
              className="flex items-center gap-4 p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition"
            >
              <div className="text-3xl">🔖</div>
              <div>
                <h4 className="font-bold text-gray-800">Bookmarks</h4>
                <p className="text-gray-600 text-sm">Ôn lại câu đã đánh dấu</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
