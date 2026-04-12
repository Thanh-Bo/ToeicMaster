"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, LogOut } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { PageHeader } from "../components/layout";
import ProfileInfoTab from "../components/profile/ProfileInfoTab";
import ProfilePasswordTab from "../components/profile/ProfilePasswordTab";


export default function ProfilePage() {
  const { user, loading, logout, updateUser } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"info" | "password" | "stats">("info");
  const [stats, setStats] = useState({ totalTests: 0, avgScore: 0, bestScore: 0, totalTime: 0 });
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

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
    
  ];
  

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900">
      <PageHeader />
      {/* Header */}
      

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex justify-center">
          {/* Right: Tabs */}
          <div className="w-full lg:w-2/3">
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
              
            </div>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 max-w-sm mx-4 border border-gray-200 dark:border-zinc-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Đăng xuất</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Bạn có chắc chắn muốn đăng xuất?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-zinc-800 transition"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  setShowLogoutConfirm(false);
                  logout();
                }}
                className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 dark:hover:bg-red-600 transition"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
