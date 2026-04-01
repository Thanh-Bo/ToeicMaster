"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, LogOut } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import ProfileInfoTab from "../components/profile/ProfileInfoTab";
import ProfilePasswordTab from "../components/profile/ProfilePasswordTab";
import ProfileStatsTab from "../components/profile/ProfileStatsTab";

export default function ProfilePage() {
  const { user, loading, logout, updateUser } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"info" | "password" | "stats">("info");
  const [stats, setStats] = useState({ totalTests: 0, avgScore: 0, bestScore: 0, totalTime: 0 });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/profile");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-900">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-200 dark:border-zinc-700 border-t-gray-900 dark:border-t-white" />
      </div>
    );
  }

  if (!user) return null;

  const tabs: { key: "info" | "password" | "stats"; label: string }[] = [
    { key: "info", label: "Thông tin" },
    { key: "password", label: "Mật khẩu" },
    { key: "stats", label: "Thống kê" },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-700 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Trang chủ
          </Link>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">Tài khoản của tôi</h1>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition text-sm"
          >
            <LogOut className="w-4 h-4" />
            Đăng xuất
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Avatar & Quick Info */}
          <div className="lg:w-1/3">
            <div className="border border-gray-200 dark:border-zinc-700 rounded-2xl p-6 text-center">
              {/* Avatar */}
              <div className="relative mx-auto w-28 h-28 mb-4">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.fullName}
                    className="w-28 h-28 rounded-full object-cover border-4 border-gray-200 dark:border-zinc-600"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-gray-900 dark:bg-white flex items-center justify-center text-white dark:text-gray-900 text-4xl font-bold">
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user.fullName}</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{user.email}</p>

              {user.isPremium && (
                <span className="mt-3 inline-block text-xs font-semibold border border-amber-400 text-amber-500 dark:text-amber-400 rounded-full px-3 py-1">
                  ⭐ Premium
                </span>
              )}
            </div>
          </div>

          {/* Right: Tabs */}
          <div className="lg:w-2/3">
            {/* Tab buttons */}
            <div className="flex gap-1 mb-6 border border-gray-200 dark:border-zinc-700 rounded-xl p-1">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all ${
                    activeTab === tab.key
                      ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-sm"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="border border-gray-200 dark:border-zinc-700 rounded-2xl p-6">
              {activeTab === "info" && <ProfileInfoTab user={user} onUpdateUser={updateUser} />}
              {activeTab === "password" && <ProfilePasswordTab />}
              {activeTab === "stats" && <ProfileStatsTab stats={stats} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
