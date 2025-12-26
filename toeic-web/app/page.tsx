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
  { icon: "🎯", title: "Luyện tập", description: "Theo từng Part", href: "/practice", iconBgColor: "bg-blue-100" },
  { icon: "📖", title: "Từ vựng", description: "Flashcards", href: "/vocabulary", iconBgColor: "bg-green-100" },
  { icon: "🔖", title: "Đánh dấu", description: "Câu hỏi khó", href: "/bookmarks", iconBgColor: "bg-orange-100" },
  { icon: "📊", title: "Thống kê", description: "Tiến độ học", href: "/statistics", iconBgColor: "bg-purple-100" },
  { icon: "🏆", title: "Xếp hạng", description: "Top điểm cao", href: "/leaderboard", iconBgColor: "bg-yellow-100" },
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
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-white">
      {/* HEADER */}
      <PageHeader />

      {/* HERO BANNER */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-indigo-700"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-300 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-white/90 text-sm mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Miễn phí 100% • Không giới hạn
            </div>
            
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Luyện thi TOEIC <br className="hidden md:block"/>
              <span className="text-yellow-300">hiệu quả & thông minh</span>
            </h1>
            
            <p className="text-blue-100 text-lg max-w-xl mx-auto mb-8">
              Kho đề thi chuẩn format ETS, giải thích chi tiết bằng AI, 
              giúp bạn đạt 900+ điểm TOEIC nhanh chóng.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="#tests" className="bg-white text-blue-600 px-8 py-3 rounded-xl font-bold hover:bg-blue-50 transition shadow-lg">
                Bắt đầu luyện thi →
              </a>
              <Link href="/register" className="bg-white/10 backdrop-blur-sm text-white px-8 py-3 rounded-xl font-medium hover:bg-white/20 transition border border-white/30">
                Tạo tài khoản miễn phí
              </Link>
            </div>
          </div>
          
          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-4 max-w-lg mx-auto">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white">{tests.length}+</div>
              <div className="text-blue-200 text-sm">Đề thi</div>
            </div>
            <div className="text-center border-x border-white/20">
              <div className="text-2xl md:text-3xl font-bold text-white">{tests.reduce((sum, t) => sum + (t.totalQuestions || 0), 0)}+</div>
              <div className="text-blue-200 text-sm">Câu hỏi</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white">AI</div>
              <div className="text-blue-200 text-sm">Giải thích</div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK ACCESS FEATURES */}
      <section className="max-w-6xl mx-auto px-4 py-12 -mt-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickFeatures.map((feature) => (
            <FeatureCard key={feature.href} {...feature} />
          ))}
        </div>
      </section>

      {/* DANH SÁCH ĐỀ THI */}
      <section id="tests" className="max-w-6xl mx-auto px-4 py-12">
        {/* Header + Filter */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">📚 Thư viện đề thi</h2>
            <p className="text-gray-500">Chọn một đề để bắt đầu luyện tập ngay</p>
          </div>
          
          {/* Filter Tabs */}
          <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition
                  ${filter === tab.key 
                    ? "bg-white text-blue-600 shadow-sm" 
                    : "text-gray-600 hover:text-gray-800"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
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
          { label: "Luyện tập", href: "/practice" },
          { label: "Từ vựng", href: "/vocabulary" },
          { label: "Đánh dấu", href: "/bookmarks" },
          { label: "Thống kê", href: "/statistics" },
          { label: "Xếp hạng", href: "/leaderboard" },
          { label: "Lịch sử", href: "/history" },
        ]}
        
      />
    </div>
  );
}
