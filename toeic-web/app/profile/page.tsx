"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";
import ProfileInfoTab from "../components/profile/ProfileInfoTab";
import ProfilePasswordTab from "../components/profile/ProfilePasswordTab";
import ProfileStatsTab from "../components/profile/ProfileStatsTab";

export default function ProfilePage() {
  const { user, loading, logout, updateUser, refreshUser } = useAuth();
  const router = useRouter();

  // Tab state
  const [activeTab, setActiveTab] = useState<"info" | "password" | "stats">("info");

  // Stats
  const [stats, setStats] = useState({
    totalTests: 0,
    avgScore: 0,
    bestScore: 0,
    totalTime: 0,
  });

  // Load stats
  useEffect(() => {
    const loadStats = async () => {
      try {
        // TODO: Implement stats API
        // const response = await authService.getStats();
        // setStats(response.data);
      } catch (error) {
        console.error("Load stats error:", error);
      }
    };
    if (user) loadStats();
  }, [user]);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/profile");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-900 shadow-sm border-b border-gray-200 dark:border-zinc-700 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            <span className="font-medium">Trang chủ</span>
          </Link>
          <h1 className="text-lg font-bold text-gray-800 dark:text-white">Tài khoản của tôi</h1>
          <button onClick={logout} className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-500 font-medium text-sm">
            Đăng xuất
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Avatar & Quick Info */}
          <div className="lg:w-1/3">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-700 p-6 text-center">
              {/* Avatar */}
              <div className="relative mx-auto w-28 h-28 mb-4">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.fullName}
                    className="w-28 h-28 rounded-full object-cover shadow-lg border-4 border-gray-200 dark:border-zinc-600"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                )}
                {user.isPremium && (
                  <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full shadow">
                    ⭐ PREMIUM
                  </div>
                )}
              </div>

              <h2 className="text-xl font-bold text-gray-800 dark:text-white">{user.fullName}</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">{user.email}</p>

              {/* Premium Status */}
              <div className={`mt-4 p-3 rounded-xl ${user.isPremium ? "bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700" : "bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700"}`}>
                {user.isPremium ? (
                  <>
                    <p className="text-yellow-700 dark:text-yellow-300 font-medium text-sm">🌟 Tài khoản Premium</p>
                    {user.premiumExpiredAt && (
                      <p className="text-yellow-600 dark:text-yellow-400 text-xs mt-1">
                        Hết hạn: {new Date(user.premiumExpiredAt).toLocaleDateString("vi-VN")}
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <p className="text-gray-600 dark:text-gray-300 font-medium text-sm">Tài khoản Miễn phí</p>
                    <button className="mt-2 text-blue-600 dark:text-blue-400 text-xs font-bold hover:underline">
                      Nâng cấp Premium →
                    </button>
                  </>
                )}
              </div>

              {/* Balance */}
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900 rounded-xl border border-blue-200 dark:border-blue-700">
                <p className="text-blue-600 dark:text-blue-300 text-xs uppercase tracking-wider">Số dư</p>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">{(user.balance || 0).toLocaleString("vi-VN")} đ</p>
              </div>

              {/* Quick Links */}
              <div className="mt-6 space-y-2">
                <Link href="/history" className="block w-full py-2.5 px-4 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-xl text-gray-700 dark:text-gray-300 font-medium text-sm transition-colors">
                  📋 Lịch sử làm bài
                </Link>
              </div>
            </div>
          </div>

          {/* Right: Tabs Content */}
          <div className="lg:w-2/3">
            {/* Tab Buttons */}
            <div className="flex gap-2 mb-6 bg-white dark:bg-zinc-900 rounded-xl p-1 shadow-sm border border-gray-200 dark:border-zinc-700">
              <button
                onClick={() => setActiveTab("info")}
                className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all ${
                  activeTab === "info" ? "bg-blue-600 text-white shadow" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                👤 Thông tin
              </button>
              <button
                onClick={() => setActiveTab("password")}
                className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all ${
                  activeTab === "password" ? "bg-blue-600 text-white shadow" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                🔒 Mật khẩu
              </button>
              <button
                onClick={() => setActiveTab("stats")}
                className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all ${
                  activeTab === "stats" ? "bg-blue-600 text-white shadow" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                📊 Thống kê
              </button>
            </div>

            {/* Tab Content */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-700 p-6">
              {/* TAB: Thông tin */}
              {activeTab === "info" && (
                <ProfileInfoTab user={user} onUpdateUser={updateUser} />
              )}

              {/* TAB: Đổi mật khẩu */}
              {activeTab === "password" && (
                <ProfilePasswordTab />
              )}

              {/* TAB: Thống kê */}
              {activeTab === "stats" && (
                <ProfileStatsTab stats={stats} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
