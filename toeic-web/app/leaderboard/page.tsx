"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axiosClient from "../services/axiosClient";

interface LeaderboardEntry {
  rank: number;
  userId: number;
  fullName: string;
  avatarUrl?: string;
  totalScore: number;
  totalTests: number;
  averageScore: number;
  highestScore: number;
  listeningAvg: number;
  readingAvg: number;
}

interface LeaderboardResponse {
  items: LeaderboardEntry[];
  totalCount: number;
  currentUserRank?: number;
}

type TimeRange = "all" | "month" | "week";

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>("all");
  const [currentUserRank, setCurrentUserRank] = useState<number | null>(null);

  useEffect(() => {
    loadLeaderboard();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRange]);

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get<LeaderboardResponse>(`/leaderboard?timeRange=${timeRange}&limit=50`);
      setLeaderboard(response.data.items || []);
      setCurrentUserRank(response.data.currentUserRank || null);
    } catch (error) {
      console.error("Failed to load leaderboard:", error);
      // Mock data for demo
      setLeaderboard([
        { rank: 1, userId: 1, fullName: "Nguyễn Văn A", totalScore: 4500, totalTests: 5, averageScore: 900, highestScore: 950, listeningAvg: 450, readingAvg: 450 },
        { rank: 2, userId: 2, fullName: "Trần Thị B", totalScore: 4350, totalTests: 5, averageScore: 870, highestScore: 920, listeningAvg: 440, readingAvg: 430 },
        { rank: 3, userId: 3, fullName: "Lê Hoàng C", totalScore: 4200, totalTests: 5, averageScore: 840, highestScore: 890, listeningAvg: 420, readingAvg: 420 },
        { rank: 4, userId: 4, fullName: "Phạm Minh D", totalScore: 4050, totalTests: 5, averageScore: 810, highestScore: 860, listeningAvg: 400, readingAvg: 410 },
        { rank: 5, userId: 5, fullName: "Hoàng Thu E", totalScore: 3900, totalTests: 5, averageScore: 780, highestScore: 830, listeningAvg: 390, readingAvg: 390 },
        { rank: 6, userId: 6, fullName: "Vũ Đức F", totalScore: 3750, totalTests: 5, averageScore: 750, highestScore: 800, listeningAvg: 380, readingAvg: 370 },
        { rank: 7, userId: 7, fullName: "Đặng Thảo G", totalScore: 3600, totalTests: 5, averageScore: 720, highestScore: 770, listeningAvg: 360, readingAvg: 360 },
        { rank: 8, userId: 8, fullName: "Bùi Quang H", totalScore: 3450, totalTests: 5, averageScore: 690, highestScore: 740, listeningAvg: 350, readingAvg: 340 },
        { rank: 9, userId: 9, fullName: "Ngô Thanh I", totalScore: 3300, totalTests: 5, averageScore: 660, highestScore: 710, listeningAvg: 330, readingAvg: 330 },
        { rank: 10, userId: 10, fullName: "Đinh Hương K", totalScore: 3150, totalTests: 5, averageScore: 630, highestScore: 680, listeningAvg: 320, readingAvg: 310 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-linear-to-r from-yellow-400 to-amber-500 text-white shadow-lg shadow-yellow-200";
      case 2:
        return "bg-linear-to-r from-gray-300 to-gray-400 text-gray-800 shadow-lg shadow-gray-200";
      case 3:
        return "bg-linear-to-r from-amber-600 to-amber-700 text-white shadow-lg shadow-amber-200";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return rank.toString();
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 900) return "text-yellow-600";
    if (score >= 800) return "text-green-600";
    if (score >= 700) return "text-blue-600";
    if (score >= 600) return "text-purple-600";
    return "text-gray-600";
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
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">🏆 Bảng xếp hạng</h1>
            <p className="text-gray-600 mt-1">Top người dùng có điểm cao nhất</p>
          </div>
          <Link href="/" className="px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition text-gray-700">
            ← Trang chủ
          </Link>
        </div>

        {/* Time Range Filter */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
          <div className="flex gap-2">
            {[
              { key: "all", label: "Tất cả thời gian", icon: "🌟" },
              { key: "month", label: "Tháng này", icon: "📅" },
              { key: "week", label: "Tuần này", icon: "📆" },
            ].map((option) => (
              <button
                key={option.key}
                onClick={() => setTimeRange(option.key as TimeRange)}
                className={`flex-1 px-4 py-3 rounded-xl font-medium transition ${
                  timeRange === option.key
                    ? "bg-indigo-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <span className="mr-2">{option.icon}</span>
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Current User Rank */}
        {currentUserRank && (
          <div className="bg-linear-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg p-5 mb-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-200 text-sm">Xếp hạng của bạn</p>
                <p className="text-3xl font-bold">#{currentUserRank}</p>
              </div>
              <div className="text-5xl">🎯</div>
            </div>
          </div>
        )}

        {/* Top 3 Podium */}
        {leaderboard.length >= 3 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-end justify-center gap-4">
              {/* 2nd Place */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold mb-2 border-4 border-gray-300">
                  {leaderboard[1].fullName.charAt(0)}
                </div>
                <p className="font-bold text-gray-800 text-sm text-center truncate max-w-20">{leaderboard[1].fullName}</p>
                <p className="text-gray-500 text-xs">{leaderboard[1].averageScore} điểm</p>
                <div className="w-20 h-24 bg-gray-200 rounded-t-lg mt-2 flex items-center justify-center">
                  <span className="text-3xl">🥈</span>
                </div>
              </div>

              {/* 1st Place */}
              <div className="flex flex-col items-center -mt-4">
                <div className="w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center text-3xl font-bold mb-2 border-4 border-yellow-400 shadow-lg">
                  {leaderboard[0].fullName.charAt(0)}
                </div>
                <p className="font-bold text-gray-800 text-center truncate max-w-24">{leaderboard[0].fullName}</p>
                <p className="text-yellow-600 font-bold">{leaderboard[0].averageScore} điểm</p>
                <div className="w-24 h-32 bg-yellow-400 rounded-t-lg mt-2 flex items-center justify-center">
                  <span className="text-4xl">🥇</span>
                </div>
              </div>

              {/* 3rd Place */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-2xl font-bold mb-2 border-4 border-amber-500">
                  {leaderboard[2].fullName.charAt(0)}
                </div>
                <p className="font-bold text-gray-800 text-sm text-center truncate max-w-20">{leaderboard[2].fullName}</p>
                <p className="text-gray-500 text-xs">{leaderboard[2].averageScore} điểm</p>
                <div className="w-20 h-16 bg-amber-500 rounded-t-lg mt-2 flex items-center justify-center">
                  <span className="text-3xl">🥉</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Full Leaderboard */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50">
            <h2 className="font-bold text-gray-800">Bảng xếp hạng đầy đủ</h2>
          </div>
          
          <div className="divide-y">
            {leaderboard.map((entry) => (
              <div
                key={entry.userId}
                className={`flex items-center gap-4 p-4 hover:bg-gray-50 transition ${
                  entry.rank <= 3 ? "bg-linear-to-r from-yellow-50 to-transparent" : ""
                }`}
              >
                {/* Rank */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${getRankStyle(entry.rank)}`}>
                  {entry.rank <= 3 ? getRankIcon(entry.rank) : entry.rank}
                </div>

                {/* Avatar & Name */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg shrink-0">
                    {entry.fullName.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-gray-800 truncate">{entry.fullName}</p>
                    <p className="text-gray-500 text-sm">{entry.totalTests} bài thi</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="hidden md:flex items-center gap-6 text-center">
                  <div>
                    <p className="text-xs text-gray-500">Listening</p>
                    <p className="font-bold text-blue-600">{entry.listeningAvg}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Reading</p>
                    <p className="font-bold text-green-600">{entry.readingAvg}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Cao nhất</p>
                    <p className="font-bold text-purple-600">{entry.highestScore}</p>
                  </div>
                </div>

                {/* Average Score */}
                <div className="text-right">
                  <p className={`text-2xl font-bold ${getScoreColor(entry.averageScore)}`}>
                    {entry.averageScore}
                  </p>
                  <p className="text-gray-500 text-xs">điểm TB</p>
                </div>
              </div>
            ))}
          </div>

          {leaderboard.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              <div className="text-5xl mb-4">🏆</div>
              <p>Chưa có dữ liệu xếp hạng</p>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-6 bg-white rounded-xl p-4 shadow">
          <p className="text-sm text-gray-600 text-center">
            💡 Xếp hạng được tính dựa trên điểm trung bình của tất cả các bài thi đã hoàn thành
          </p>
        </div>
      </div>
    </div>
  );
}
