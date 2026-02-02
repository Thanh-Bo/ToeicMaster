"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { testService } from "../services/testService";
import { PageHeader } from "../components/layout";
import { LoadingSpinner, EmptyState, AlertMessage } from "../components/common";
import { TestCard } from "../components/cards";

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

// Filter tabs với icons
const filterTabs = [
  { key: "all", label: "Tất cả", icon: "📚", color: "from-blue-500 to-blue-600" },
  { key: "full_test", label: "Full Test", icon: "🎯", color: "from-green-500 to-green-600" },
  { key: "mini_test", label: "Mini Test", icon: "⚡", color: "from-orange-500 to-orange-600" },
];

export default function PracticePage() {
  const [tests, setTests] = useState<TestSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

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
  let filteredTests = filter === "all" 
    ? tests 
    : tests.filter(t => t.type?.toLowerCase() === filter);

  // Filter theo search query
  filteredTests = filteredTests.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Màu cho test cards
  const getCardColor = (index: number): "blue" | "green" | "purple" | "orange" => {
    const colors: ("blue" | "green" | "purple" | "orange")[] = ["blue", "purple", "green", "orange"];
    return colors[index % 4];
  };

  // Get stats
  const fullTestCount = tests.filter(t => t.type?.toLowerCase() === "full_test").length;
  const miniTestCount = tests.filter(t => t.type?.toLowerCase() === "mini_test").length;
  const totalQuestions = tests.reduce((sum, t) => sum + (t.totalQuestions || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-800">
      {/* HEADER */}
      <PageHeader />

      {/* DANH SÁCH ĐỀ THI */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Khám phá kho đề thi
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Chọn loại đề thi phù hợp với mục tiêu học tập của bạn
          </p>
        </div>

        {/* Filter Tabs - Enhanced */}
        <div className="mb-12">
          <div className="flex gap-3 justify-center flex-wrap">
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`relative group px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform ${
                  filter === tab.key
                    ? `bg-gradient-to-r ${tab.color} text-white shadow-lg scale-105`
                    : "bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-200 hover:shadow-md border border-gray-200 dark:border-zinc-700 hover:border-blue-300 dark:hover:border-blue-600"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
                {tab.key === "all" && <span className="ml-2 text-xs bg-white/30 px-2 py-0.5 rounded-full">{tests.length}</span>}
                {tab.key === "full_test" && <span className="ml-2 text-xs bg-white/30 px-2 py-0.5 rounded-full">{fullTestCount}</span>}
                {tab.key === "mini_test" && <span className="ml-2 text-xs bg-white/30 px-2 py-0.5 rounded-full">{miniTestCount}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-10 max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="🔍 Tìm kiếm đề thi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-3 pl-12 rounded-xl border-2 border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition"
            />
          </div>
        </div>

        {/* Test Cards */}
        {loading ? (
          <div className="flex justify-center py-16">
            <LoadingSpinner text="Đang tải dữ liệu..." fullScreen={false} size="lg" />
          </div>
        ) : error ? (
          <AlertMessage type="error" message={error} closable={false} />
        ) : filteredTests.length === 0 ? (
          <div className="py-16">
            <EmptyState
              icon="📭"
              title={filter === "all" && searchQuery ? "Không tìm thấy đề thi" : filter === "all" ? "Chưa có đề thi" : "Không có đề thi phù hợp"}
              description={searchQuery ? "Hãy thử tìm kiếm với từ khóa khác" : "Hiện tại chưa có đề thi nào trong danh mục này."}
            />
          </div>
        ) : (
          <>
            {/* Results Info */}
            <div className="mb-8 flex items-center justify-between">
              <p className="text-gray-600 dark:text-gray-400">
                Tìm thấy <span className="font-bold text-gray-900 dark:text-white">{filteredTests.length}</span> đề thi
              </p>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTests.map((test, index) => (
                <div key={test.id} className="transform transition-all duration-300 hover:scale-105">
                  <TestCard
                    id={test.id}
                    title={test.title}
                    duration={test.duration}
                    totalQuestions={test.totalQuestions}
                    totalParticipants={test.totalParticipants}
                    type={test.type === "FULL_TEST" ? "Full Test" : test.type === "MINI_TEST" ? "Mini Test" : "Practice"}
                    color={getCardColor(index)}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
