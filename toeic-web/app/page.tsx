"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PageHeader, Footer } from "./components/layout";
import { FeatureCard } from "./components/cards";
import { useAuth } from "./contexts/AuthContext";
import { statisticsService, StreakData } from "./services/statisticsService";
import { BookOpen, Mic, Eye, FileText, ShoppingBag, PenTool, GraduationCap, Newspaper, Check } from "lucide-react";

// Quick access features
const quickFeatures = [
  {
    icon: <BookOpen className="w-8 h-8" />,
    title: "Ngữ pháp",
    description: "Chính thức Part 5 TOEIC với hệ thống bài học và luyện tập toàn diện",
    href: "/grammar",
    iconBgColor: "bg-gray-100",
  },
  // {
  //   icon: <Mic className="w-8 h-8" />,
  //   title: "Luyện nghe",
  //   description: "Luyện nghe 3 chế độ: Nghe Check, Nghe Chép, Nghe Full",
  //   href: "/listening",
  //   iconBgColor: "bg-gray-100",
  // },
  {
    icon: <Eye className="w-8 h-8" />,
    title: "Từ vựng",
    description: "Học từ vựng TOEIC theo chủ đề với flashcard và spaced repetition",
    href: "/vocabulary",
    iconBgColor: "bg-gray-100",
  },
  {
    icon: <FileText className="w-8 h-8" />,
    title: "Luyện đề",
    description: "Luyện đề TOEIC full test với chấm điểm và giải thích chi tiết",
    href: "/practice",
    iconBgColor: "bg-gray-100",
  },
  // {
  //   icon: <Newspaper className="w-8 h-8" />,
  //   title: "Blog",
  //   description: "Meo làm bài, chiến lược và kinh nghiệm thi TOEIC",
  //   href: "/blog",
  //   iconBgColor: "bg-gray-100",
  // },
  // {
  //   icon: <Eye className="w-8 h-8" />,
  //   title: "Luyện đọc",
  //   description: "Luyện đọc TOEIC Part 7 song ngữ Anh-Việt",
  //   href: "/reading",
  //   iconBgColor: "bg-gray-100",
  // },
  
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
    <div className="min-h-screen bg-white dark:bg-zinc-900 text-gray-700 dark:text-gray-300">
      {/* HEADER */}
      <PageHeader />

      {/* HERO BANNER - SIMPLIFIED CENTERED LAYOUT */}
      <section className="relative overflow-hidden">
        <div className="relative max-w-4xl mx-auto px-4 py-20 md:py-32 flex flex-col items-center justify-center min-h-[600px]">
          

          {/* MAIN HEADING */}
          <div className="text-center space-y-4 mb-8 animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold  leading-tight">
              Luyện TOEIC hiệu quả
            </h1>
            <h2 className="text-4xl md:text-6xl font-bold b">
              Đạt mục tiêu nhanh hơn
            </h2>
          </div>

          {/* DESCRIPTION */}
          <p className=" text-lg md:text-xl max-w-2xl text-center mb-12 leading-relaxed">
            Luyện nghe 3 chế độ, luyện đề, học từ vựng — tất cả trong một nền tảng.
          </p>

          {/* CTA BUTTONS - CENTERED */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 ">
            <Link
              href="/practice"
              className="group  border border-gray-200 dark:border-zinc-700 relative inline-flex items-center justify-center px-10 py-4 font-bold   rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              <span className="relative z-10 flex items-center gap-2">
                Tiếp tục học 
              </span>
            </Link>

            <Link
              href="/tests"
              className="px-10 border border-gray-200 dark:border-zinc-700  py-4 font-bold  backdrop-blur-md rounded-lg   shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 "
            >
              Làm bài test thứ
            </Link>

            {/* Admin Button - Visible only for admins */}
            {user && user.role && user.role.toLowerCase() === "admin" && (
              <Link
                href="/admin"
                className="px-10  border border-gray-200 dark:border-zinc-700 py-4 rounded-lg font-bold text-gray-900  hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                Admin Panel
              </Link>
            )}
          </div>

          {/* FEATURES CHECKMARKS */}
          <div className="flex flex-col sm:flex-row gap-8 justify-center text-white">
            <div className="flex items-center gap-3">
              <Check size={28} className="text-white" />
              <span className="text-sm md:text-base">Đăng ký miễn phí, bắt đầu ngay</span>
            </div>
            <div className="flex items-center gap-3">
              <Check size={28} className="text-white" />
              <span className="text-sm md:text-base">Theo dõi tiến độ học tập</span>
            </div>
            <div className="flex items-center gap-3">
              <Check size={28} className="text-white" />
              <span className="text-sm md:text-base">Giải thích chi tiết từng câu</span>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK ACCESS FEATURES - GRID LAYOUT */}
      <section className="max-w-7xl mx-auto px-4 py-12 -mt-8 relative z-10">
        <div className="flex items-center justify-center gap-6">
          {quickFeatures.map((feature) => (
            <FeatureCard key={feature.href} {...feature} />
          ))}
        </div>
      </section>

      {/* PREMIUM SIGNUP SECTION */}
      <section className=" py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="relative rounded-3xl p-12 md:p-16 border border-gray-200 dark:border-zinc-700 text-center">
            {/* Checkmark */}
            <div className="flex justify-center mb-6">
              <div className="flex items-center gap-2 text-green-500 dark:text-green-400 text-lg font-semibold">
                <Check size={24} />
                <span>Bắt đầu miễn phí</span>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              
            </h2>

            {/* Subtitle */}
            <p className="text-gray-600 dark:text-zinc-400 text-lg mb-12 max-w-2xl mx-auto">
              Trải nghiệm đầy đủ các tính năng 
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-3 text-gray-800 dark:text-white">
                <Check size={24} className="text-green-500 dark:text-green-400 flex-shrink-0" />
                <span>Luyện tập ngữ pháp & từ vựng miễn phí</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-gray-800 dark:text-white">
                <Check size={24} className="text-green-500 dark:text-green-400 flex-shrink-0" />
                <span>Giải thích chi tiết mỗi đáp án</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-gray-800 dark:text-white">
                <Check size={24} className="text-green-500 dark:text-green-400 flex-shrink-0" />
                <span>Hỏi AI khi không hiểu</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-gray-800 dark:text-white">
                <Check size={24} className="text-green-500 dark:text-green-400 flex-shrink-0" />
                <span>Đăng nhập để lưu tiến độ & streak</span>
              </div>
            </div>

            {/* CTA Button */}
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-linear-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-600 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Bắt đầu luyện tập ngay →
            </Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-20 bg-white dark:bg-zinc-900">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">
            Cách hoạt động
          </h2>

          <div className="space-y-6">
            {/* Step 1 */}
            <div className="group relative  border border-gray-200 dark:border-zinc-700 rounded-xl p-8 hover:border-blue-400 dark:hover:border-blue-500/50 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-zinc-800/70">
              <div className="flex gap-6">
                <div className="shrink-0">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-linear-to-r from-cyan-400 to-blue-500 text-white font-bold text-xl">
                    01
                  </div>
                </div>
                <div className="grow">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Chọn kỹ năng muốn luyện
                  </h3>
                  <p className="text-gray-600 dark:text-zinc-400">
                    Ngữ pháp, luyện nghe, từ vựng, hoặc làm đề thi TOEIC
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="group relative  border border-gray-200 dark:border-zinc-700 rounded-xl p-8 hover:border-blue-400 dark:hover:border-blue-500/50 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-zinc-800/70">
              <div className="flex gap-6">
                <div className="shrink-0">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-linear-to-r from-cyan-400 to-blue-500 text-white font-bold text-xl">
                    02
                  </div>
                </div>
                <div className="grow">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Làm bài và nhận phản hồi
                  </h3>
                  <p className="text-gray-600 dark:text-zinc-400">
                    Bắt đầu làm bài và nhận phản hồi chi tiết cho từng câu trả lời
                  </p>
                </div>
              </div>
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
         
        ]}
      />
    </div>
  );
}
