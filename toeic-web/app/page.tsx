"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PageHeader, Footer } from "./components/layout";
import { FeatureCard } from "./components/cards";
import { useAuth } from "./contexts/AuthContext";
import { statisticsService, StreakData } from "./services/statisticsService";

// Quick access features
const quickFeatures = [
  {
    icon: "🎯",
    title: "Luyện đề",
    description: "Làm đề Toeic",
    href: "/practice",
    iconBgColor: "bg-blue-100",
  },
  {
    icon: "📖",
    title: "Từ vựng",
    description: "Flashcards",
    href: "/vocabulary",
    iconBgColor: "bg-green-100",
  },
  {
    icon: "🔖",
    title: "Đánh dấu",
    description: "Câu hỏi khó",
    href: "/bookmarks",
    iconBgColor: "bg-orange-100",
  },
  {
    icon: "📊",
    title: "Thống kê",
    description: "Tiến độ học",
    href: "/statistics",
    iconBgColor: "bg-purple-100",
  },

  {
    icon: "📋",
    title: "Lịch sử",
    description: "Bài đã làm",
    href: "/history",
    iconBgColor: "bg-indigo-100",
  },
];

export default function HomePage() {
  const { user } = useAuth();
  const [streakData, setStreakData] = useState<StreakData | null>(null);
  const [loadingStreak, setLoadingStreak] = useState(true);

  useEffect(() => {
    const loadStreak = async () => {
      try {
        const response = await statisticsService.getStreak();
        if (response) {
          setStreakData(response);
        }
      } catch (error) {
        console.error("Failed to load streak:", error);
      } finally {
        setLoadingStreak(false);
      }
    };

    if (user) {
      loadStreak();
    } else {
      setLoadingStreak(false);
    }
  }, [user]);

  return (
    <div className="min-h-screen  bg-blue-50  dark:bg-zinc-900 ">
      {/* HEADER */}
      <PageHeader />

      {/* HERO BANNER */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0  bg-blue-600  dark:bg-zinc-900 "></div>

        <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 dark:bg-zinc-700/40 backdrop-blur-sm px-4 py-1.5 rounded-full text-white/90 dark:text-zinc-200 text-sm mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Giải đề miễn phí 100% • Không giới hạn
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-white dark:text-white mb-4 leading-tight">
              Luyện thi TOEIC <br className="hidden md:block" />
              <span className="">hiệu quả & thông minh</span>
            </h1>

            <p className="text-blue-100 dark:text-zinc-300 text-lg max-w-xl mx-auto mb-8">
              Kho đề thi chuẩn format ETS, giải thích chi tiết bằng AI, giúp bạn
              đạt 900+ điểm TOEIC nhanh chóng.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/practice"
                className="bg-white dark:bg-blue-600 text-blue-600 dark:text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-50 dark:hover:bg-blue-700 transition shadow-lg"
              >
                Bắt đầu luyện thi →
              </Link>
              <Link
                href="/register"
                className="bg-white/10 dark:bg-zinc-700/40 backdrop-blur-sm text-white dark:text-zinc-100 px-8 py-3 rounded-xl font-medium hover:bg-white/20 dark:hover:bg-zinc-600/60 transition border border-white/30 dark:border-zinc-600"
              >
                Tạo tài khoản miễn phí
              </Link>

              {/* Admin Button - Visible only for admins */}
              {user && user.role && user.role.toLowerCase() === "admin" && (
                <Link
                  href="/admin"
                  className="bg-yellow-400 dark:bg-yellow-500 text-gray-900 dark:text-gray-900 px-8 py-3 rounded-xl font-bold hover:bg-yellow-300 dark:hover:bg-yellow-400 transition shadow-lg"
                >
                  ⚙️ Admin Panel
                </Link>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-4 max-w-lg mx-auto">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white dark:text-white">
                100+
              </div>
              <div className="text-blue-200 dark:text-zinc-300 text-sm">
                Đề thi
              </div>
            </div>
            <div className="text-center border-x border-white/20 dark:border-zinc-600">
              <div className="text-2xl md:text-3xl font-bold text-white dark:text-white">
                4000+
              </div>
              <div className="text-blue-200 dark:text-zinc-300 text-sm">
                Câu hỏi
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white dark:text-white">
                AI
              </div>
              <div className="text-blue-200 dark:text-zinc-300 text-sm">
                Giải thích
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STREAK SECTION */}
      {/* {user && streakData && !loadingStreak && (
        <section className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-gradient-to-r from-orange-400 to-pink-500 dark:from-orange-500 dark:to-red-500 rounded-2xl shadow-lg dark:shadow-xl p-6 text-white">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="text-5xl animate-bounce">🔥</div>
                <div>
                  <h3 className="text-2xl font-bold">
                    {streakData.currentStreak} ngày liên tục
                  </h3>
                  <p className="text-white/90 dark:text-white/95 text-sm">
                    Kỷ lục: {streakData.longestStreak} ngày | Tổng:{" "}
                    {streakData.totalActiveDays} ngày học
                  </p>
                </div>
              </div>
              <Link
                href="/statistics"
                className="px-6 py-2.5 bg-white text-orange-600 dark:bg-yellow-300 dark:text-orange-900 rounded-xl font-bold hover:shadow-lg transition transform hover:scale-105"
              >
                Xem chi tiết →
              </Link>
            </div>
          </div>
        </section>
      )} */}

      {/* QUICK ACCESS FEATURES */}
      <section className="max-w-6xl mx-auto px-4 py-12 -mt-8 relative z-10">
        <div className="flex justify-center  gap-4">
          {quickFeatures.map((feature) => (
            <FeatureCard key={feature.href} {...feature} />
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <Footer
        links={[
          { label: "Trang chủ", href: "/" },
          { label: "Luyện đề", href: "/practice" },
          { label: "Từ vựng", href: "/vocabulary" },
          { label: "Đánh dấu", href: "/bookmarks" },
          { label: "Thống kê", href: "/statistics" },
          { label: "Lịch sử", href: "/history" },
        ]}
      />
    </div>
  );
}
