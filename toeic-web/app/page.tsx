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
    <div className="min-h-screen bg-blue-50 dark:bg-zinc-900">
      {/* HEADER */}
      <PageHeader />

      {/* HERO BANNER - REDESIGNED */}
      <section className="relative overflow-hidden">
        {/* ANIMATED BACKGROUND WITH GRADIENTS */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900"></div>

        {/* ANIMATED BLOB SHAPES */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob dark:opacity-10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 dark:opacity-10"></div>
        <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000 dark:opacity-10"></div>

        {/* GRID PATTERN OVERLAY */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

        {/* FLOATING SHAPES BACKGROUND */}
        <div className="absolute top-20 right-10 w-20 h-20 border-2 border-white/10 rounded-lg animate-float opacity-30"></div>
        <div className="absolute bottom-32 left-10 w-16 h-16 border-2 border-white/10 rounded-full animate-float-delayed opacity-30"></div>
        <div className="absolute top-1/3 left-1/4 w-24 h-24 border-2 border-white/5 rounded-xl animate-pulse opacity-20"></div>

        <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* LEFT SIDE - TEXT CONTENT */}
            <div className="space-y-6 animate-fade-in">
              {/* BADGE */}
              {/* <div className="inline-flex items-center gap-2 bg-white/20 dark:bg-zinc-700/40 backdrop-blur-md px-4 py-2 rounded-full text-white/90 dark:text-zinc-200 text-sm border border-white/30 dark:border-zinc-600 hover:bg-white/30 dark:hover:bg-zinc-600/50 transition">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Giải đề miễn phí 100% • Không giới hạn
              </div> */}

              {/* MAIN HEADING */}
              <div>
                <h1 className="text-4xl md:text-6xl font-bold text-white dark:text-white mb-4 leading-tight">
                  Luyện thi TOEIC
                  <br />
                  <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-blue-300 bg-clip-text text-transparent">
                    hiệu quả & thông minh
                  </span>
                </h1>
              </div>

              {/* DESCRIPTION */}
              <p className="text-blue-100 dark:text-zinc-300 text-lg max-w-xl leading-relaxed">
                Kho đề thi chuẩn format ETS, giải thích chi tiết bằng AI, giúp
                bạn đạt{" "}
                <span className="font-semibold text-white">
                  900+ điểm TOEIC
                </span>{" "}
                nhanh chóng.
              </p>

              {/* CTA BUTTONS */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Link
                  href="/practice"
                  className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-blue-600 dark:text-white bg-white dark:bg-gradient-to-r dark:from-blue-600 dark:to-blue-700 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  <span className="relative z-10 flex items-center gap-2">
                     Bắt đầu luyện thi
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                </Link>

                <Link
                  href="/register"
                  className="px-8 py-4 font-medium text-white bg-white/10 dark:bg-zinc-700/40 backdrop-blur-md rounded-xl hover:bg-white/20 dark:hover:bg-zinc-600/60 transition border border-white/30 dark:border-zinc-600 hover:border-white/50 dark:hover:border-zinc-500"
                >
                  Tạo tài khoản miễn phí
                </Link>

                {/* Admin Button - Visible only for admins */}
                {user && user.role && user.role.toLowerCase() === "admin" && (
                  <Link
                    href="/admin"
                    className="px-8 py-4 font-bold text-gray-900 bg-yellow-400 dark:bg-yellow-500 rounded-xl hover:bg-yellow-300 dark:hover:bg-yellow-400 transition shadow-lg hover:shadow-xl"
                  >
                     Admin Panel
                  </Link>
                )}
              </div>

             
            </div>

            {/* RIGHT SIDE - VISUAL ELEMENT */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative w-full max-w-sm">
                {/* FLOATING CARD 1 - Main */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/20 p-8 transform hover:scale-105 transition-transform duration-500 animate-float shadow-2xl">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-white font-bold text-xl">Test 45</h3>
                      <span className="text-2xl">📝</span>
                    </div>
                    <div className="space-y-3">
                      <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-green-400 to-blue-400 w-3/4 rounded-full"></div>
                      </div>
                      <p className="text-white/70 text-sm">75% Hoàn thành</p>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <span className="px-3 py-1 bg-green-500/30 text-green-200 rounded-full text-xs font-medium">
                        Score: 850
                      </span>
                      <span className="px-3 py-1 bg-blue-500/30 text-blue-200 rounded-full text-xs font-medium">
                        Listening
                      </span>
                    </div>
                  </div>
                </div>

                {/* FLOATING CARD 2 - Top right */}
                {user && streakData && !loadingStreak && (
                  <div className="absolute -top-12 right-0 bg-gradient-to-br from-yellow-300/90 to-orange-300/90 backdrop-blur-xl rounded-2xl border border-white/20 p-5 transform hover:scale-105 transition-transform duration-500 animate-float-delayed shadow-xl w-48">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-3xl">🔥</span>
                      <span className="text-xs font-bold text-gray-700 bg-white/50 px-2 py-1 rounded-full">
                        {streakData.currentStreak} ngày liên tục
                      </span>
                    </div>
                    <p className="text-zinc-500 text-sm">
                      Kỷ lục: {streakData.longestStreak} ngày 
                    </p>
                  </div>
                )}

                {/* FLOATING CARD 3 - Bottom left */}
                <div className="absolute -bottom-12 -left-12 bg-gradient-to-br from-purple-500/80 to-pink-500/80 backdrop-blur-xl rounded-2xl border border-white/20 p-5 transform hover:scale-105 transition-transform duration-500 animate-float-delayed-2 shadow-xl w-56">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">⭐</span>
                    <div>
                      <p className="text-white font-bold text-sm">
                        4.8/5 Rating
                      </p>
                      <p className="text-white/70 text-xs">5,000+ người dùng</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* STATS SECTION */}
          <div className="mt-20 grid grid-cols-3 gap-4 max-w-lg mx-auto">
            <div className="text-center group">
              <div className="text-3xl md:text-4xl font-bold text-white dark:text-white group-hover:text-yellow-300 transition">
                100+
              </div>
              <div className="text-blue-200 dark:text-zinc-300 text-sm">
                Đề thi
              </div>
            </div>
            <div className="text-center border-x border-white/20 dark:border-zinc-600 group">
              <div className="text-3xl md:text-4xl font-bold text-white dark:text-white group-hover:text-yellow-300 transition">
                4000+
              </div>
              <div className="text-blue-200 dark:text-zinc-300 text-sm">
                Câu hỏi
              </div>
            </div>
            <div className="text-center group">
              <div className="text-3xl md:text-4xl font-bold text-white dark:text-white group-hover:text-yellow-300 transition">
                AI
              </div>
              <div className="text-blue-200 dark:text-zinc-300 text-sm">
                Giải thích
              </div>
            </div>
          </div>
        </div>
      </section>

      
      

      {/* QUICK ACCESS FEATURES - ENHANCED */}
      <section className="max-w-6xl mx-auto px-4 py-12 -mt-8 relative z-10">
        <div className="flex justify-center gap-4">
          {quickFeatures.map((feature) => (
            <FeatureCard key={feature.href} {...feature} />
          ))}
        </div>
      </section>

      {/* STATS SECTION - REDESIGNED WITH COUNTERS */}
      <section className="bg-gradient-to-b from-white dark:from-zinc-900 to-blue-50 dark:to-zinc-800 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Nền tảng luyện thi TOEIC tại Việt Nam
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Stat 1 - Tests */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 to-blue-600/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative bg-white dark:bg-zinc-800 rounded-2xl p-8 border border-gray-200 dark:border-zinc-700 hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
                <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-600 mb-2">
                  100+
                </div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                  Đề thi
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Chuẩn format ETS, cập nhật thường xuyên
                </p>
                <div className="mt-4 h-2 bg-gray-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-400 to-blue-600 w-3/4 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Stat 2 - Questions */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/30 to-purple-600/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative bg-white dark:bg-zinc-800 rounded-2xl p-8 border border-gray-200 dark:border-zinc-700 hover:border-purple-400 dark:hover:border-purple-500 transition-colors">
                <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-purple-600 mb-2">
                  4000+
                </div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                  Câu hỏi
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Bao gồm tất cả các phần: Listening, Reading
                </p>
                <div className="mt-4 h-2 bg-gray-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-400 to-purple-600 w-4/5 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Stat 3 - AI */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-400/30 to-pink-600/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative bg-white dark:bg-zinc-800 rounded-2xl p-8 border border-gray-200 dark:border-zinc-700 hover:border-pink-400 dark:hover:border-pink-500 transition-colors">
                <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-pink-600 mb-2">
                  ⚡
                </div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                  AI Giải thích
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Phân tích từng câu hỏi chi tiết tức thì
                </p>
                <div className="mt-4 h-2 bg-gray-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-pink-400 to-pink-600 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS SECTION */}
      <section className="py-16 bg-white dark:bg-zinc-900">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-4">
            Tại sao chọn TOEIC Master?
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12 text-lg">
            Hơn 5,000+ học sinh đã đạt mục tiêu TOEIC của họ cùng chúng tôi
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Benefit 1 */}
            <div className="group bg-gradient-to-br from-blue-50 dark:from-zinc-800 to-blue-100 dark:to-zinc-700 rounded-2xl p-8 hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 border border-blue-200 dark:border-zinc-600 hover:scale-105">
              <div className="text-5xl mb-4">📚</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Học tự do
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Học bất kỳ lúc nào, ở đâu, không giới hạn thời gian. Thích hợp
                với lịch bận của bạn
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="group bg-gradient-to-br from-purple-50 dark:from-zinc-800 to-purple-100 dark:to-zinc-700 rounded-2xl p-8 hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 border border-purple-200 dark:border-zinc-600 hover:scale-105">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Hiệu quả cao
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                90% người dùng đạt được điểm mục tiêu trong vòng 30 ngày. Kết
                quả được chứng minh
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="group bg-gradient-to-br from-pink-50 dark:from-zinc-800 to-pink-100 dark:to-zinc-700 rounded-2xl p-8 hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 border border-pink-200 dark:border-zinc-600 hover:scale-105">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Tiết kiệm chi phí
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Rẻ hơn 10x so với các khóa học truyền thống. Miễn phí 100% không
                giới hạn
              </p>
            </div>

            {/* Benefit 4 */}
            <div className="group bg-gradient-to-br from-green-50 dark:from-zinc-800 to-green-100 dark:to-zinc-700 rounded-2xl p-8 hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 border border-green-200 dark:border-zinc-600 hover:scale-105">
              <div className="text-5xl mb-4">🤖</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                AI Cá nhân hóa
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                AI phân tích lỗi sai của bạn và đề xuất bài tập phù hợp nhất
              </p>
            </div>
          </div>
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
