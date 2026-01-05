"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { testService } from "./services/testService";
import { PageHeader, Footer } from "./components/layout";
import { LoadingSpinner, EmptyState, AlertMessage } from "./components/common";
import { TestCard, FeatureCard } from "./components/cards";

// Định nghĩa kiểu dữ liệu
interface TestSummary {
  id: number;
  title: string;
  slug?: string;
  type?: string;
  duration: number;
  totalQuestions: number;
  totalParticipants?: number;
}

// Quick access features
const quickFeatures = [

  { icon: "📖", title: "Từ vựng", description: "Flashcards", href: "/vocabulary", iconBgColor: "bg-green-100" },
  { icon: "🔖", title: "Đánh dấu", description: "Câu hỏi khó", href: "/bookmarks", iconBgColor: "bg-orange-100" },
  { icon: "📊", title: "Thống kê", description: "Tiến độ học", href: "/statistics", iconBgColor: "bg-purple-100" },
 
  { icon: "📋", title: "Lịch sử", description: "Bài đã làm", href: "/history", iconBgColor: "bg-indigo-100" },
];

// Filter tabs
const filterTabs = [
  { key: "all", label: "Tất cả" },
  { key: "full_test", label: "Full Test" },
  { key: "mini_test", label: "Mini Test" },
];

export default function HomePage() {
  const [tests, setTests] = useState<TestSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    testService.getList()
      .then((res) => {
        setTests(res.data.data || []);
      })
      .catch((err) => {
        console.error(err);
        setError("Không thể tải danh sách đề thi. Vui lòng thử lại sau.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Filter đề thi theo type
  const filteredTests = filter === "all" 
    ? tests 
    : tests.filter(t => t.type?.toLowerCase() === filter);

  // Màu cho test cards
  const getCardColor = (index: number): "blue" | "green" | "purple" | "orange" => {
    const colors: ("blue" | "green" | "purple" | "orange")[] = ["blue", "purple", "green"];
    return colors[index % 3];
  };

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
              Luyện thi TOEIC <br className="hidden md:block"/>
              <span className="text-blue-300 dark:text-blue-400">hiệu quả & thông minh</span>
            </h1>
            
            <p className="text-blue-100 dark:text-zinc-300 text-lg max-w-xl mx-auto mb-8">
              Kho đề thi chuẩn format ETS, giải thích chi tiết bằng AI, 
              giúp bạn đạt 900+ điểm TOEIC nhanh chóng.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="#tests" className="bg-white dark:bg-blue-600 text-blue-600 dark:text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-50 dark:hover:bg-blue-700 transition shadow-lg">
                Bắt đầu luyện thi →
              </a>
              <Link href="/register" className="bg-white/10 dark:bg-zinc-700/40 backdrop-blur-sm text-white dark:text-zinc-100 px-8 py-3 rounded-xl font-medium hover:bg-white/20 dark:hover:bg-zinc-600/60 transition border border-white/30 dark:border-zinc-600">
                Tạo tài khoản miễn phí
              </Link>
            </div>
          </div>
          
          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-4 max-w-lg mx-auto">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white dark:text-white">{tests.length}+</div>
              <div className="text-blue-200 dark:text-zinc-300 text-sm">Đề thi</div>
            </div>
            <div className="text-center border-x border-white/20 dark:border-zinc-600">
              <div className="text-2xl md:text-3xl font-bold text-white dark:text-white">{tests.reduce((sum, t) => sum + (t.totalQuestions || 0), 0)}+</div>
              <div className="text-blue-200 dark:text-zinc-300 text-sm">Câu hỏi</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white dark:text-white">AI</div>
              <div className="text-blue-200 dark:text-zinc-300 text-sm">Giải thích</div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK ACCESS FEATURES */}
      <section className="max-w-6xl mx-auto px-4 py-12 -mt-8 relative z-10">
        <div className="flex justify-center  gap-4">
          {quickFeatures.map((feature) => (
            <FeatureCard key={feature.href} {...feature} />
          ))}
        </div>
      </section>

      {/* DANH SÁCH ĐỀ THI */}
      <section id="tests" className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Thư viện đề thi</h2>
          <p className="text-gray-500 dark:text-gray-400">Chọn một đề để bắt đầu luyện tập ngay</p>
        </div>

        {/* Test Cards */}
        {loading ? (
          <LoadingSpinner text="Đang tải dữ liệu..." fullScreen={false} size="md" />
        ) : error ? (
          <AlertMessage type="error" message={error} closable={false} />
        ) : filteredTests.length === 0 ? (
          <EmptyState
            icon="📭"
            title={filter === "all" ? "Chưa có đề thi" : "Không có đề thi phù hợp"}
            description="Hiện tại chưa có đề thi nào trong danh mục này."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTests.map((test, index) => (
              <TestCard
                key={test.id}
                id={test.id}
                title={test.title}
                duration={test.duration}
                totalQuestions={test.totalQuestions}
                totalParticipants={test.totalParticipants}
                type={test.type === "FULL_TEST" ? "Full Test" : test.type === "MINI_TEST" ? "Mini Test" : "Practice"}
                color={getCardColor(index)}
              />
            ))}
          </div>
        )}
      </section>

      {/* FOOTER */}
      <Footer
        links={[
          { label: "Trang chủ", href: "/" },
         
          { label: "Từ vựng", href: "/vocabulary" },
          { label: "Đánh dấu", href: "/bookmarks" },
          { label: "Thống kê", href: "/statistics" },
         
          { label: "Lịch sử", href: "/history" },
        ]}
        
      />
    </div>
  );
}
