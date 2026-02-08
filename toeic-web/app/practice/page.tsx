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

export default function PracticePage() {
  const [tests, setTests] = useState<TestSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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

  // Filter theo search query
  let filteredTests = tests.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Màu cho test cards
  const getCardColor = (index: number): "blue" | "green" | "purple" | "orange" => {
    const colors: ("blue" | "green" | "purple" | "orange")[] = ["blue", "purple", "green", "orange"];
    return colors[index % 4];
  };

  // Get stats
  const totalQuestions = tests.reduce((sum, t) => sum + (t.totalQuestions || 0), 0);
  const fullTestCount = tests.filter(t => t.type?.toLowerCase() === "full_test").length;
  const miniTestCount = tests.filter(t => t.type?.toLowerCase() === "mini_test").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-800">
      {/* HEADER */}
      <PageHeader />

      {/* HERO SECTION */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-zinc-800 dark:to-zinc-900 py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Luyện đề TOEIC
              </h1>
              <p className="text-blue-100 text-lg mb-6">
                Truy cập vào kho đề thi đa dạng, từ Full Test đến Mini Test. Luyện tập hàng ngày để nâng cao kỹ năng của bạn.
              </p>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
                  <div className="text-2xl font-bold text-white">{tests.length}</div>
                  <div className="text-blue-100 text-sm">Đề thi</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
                  <div className="text-2xl font-bold text-white">{totalQuestions}</div>
                  <div className="text-blue-100 text-sm">Câu hỏi</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
                  <div className="text-2xl font-bold text-white">♾️</div>
                  <div className="text-blue-100 text-sm">Miễn phí</div>
                </div>
              </div>
            </div>

            {/* Right Side - Visual */}
            <div className="hidden md:flex items-center justify-center">
              <div className="relative w-full max-w-sm h-80">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-3xl blur-2xl animate-blob"></div>
                <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl">
                  <div className="space-y-4">
                    <div className="h-3 bg-white/20 rounded-full w-3/4 animate-pulse"></div>
                    <div className="h-3 bg-white/20 rounded-full w-5/6 animate-pulse" style={{animationDelay: "0.2s"}}></div>
                    <div className="h-3 bg-white/20 rounded-full w-4/5 animate-pulse" style={{animationDelay: "0.4s"}}></div>
                    <div className="pt-4 border-t border-white/10">
                      <p className="text-white/70 text-sm">Bắt đầu luyện ngay</p>
                      <div className="mt-2 inline-block px-4 py-2 bg-white/20 rounded-lg text-white text-xs font-medium">
                        ▶ Tham gia ngay
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DANH SÁCH ĐỀ THI */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        {/* Section Title */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Tất cả đề thi
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {tests.length} đề thi • {totalQuestions} câu hỏi • {fullTestCount} Full Test • {miniTestCount} Mini Test
          </p>
        </div>

        {/* Search Bar - Compact */}
        <div className="mb-10 max-w-2xl">
          <div className="relative">
            <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Tìm kiếm đề thi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-3 pl-12 rounded-xl border-2 border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition shadow-sm"
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
              title={searchQuery ? "Không tìm thấy đề thi" : "Chưa có đề thi"}
              description={searchQuery ? "Hãy thử tìm kiếm với từ khóa khác" : "Hiện tại chưa có đề thi nào."}
            />
          </div>
        ) : (
          <>
            {/* Results Info */}
            <div className="mb-8 flex items-center justify-between">
              <p className="text-gray-600 dark:text-gray-400">
                Tìm thấy <span className="font-bold text-blue-600 dark:text-blue-400">{filteredTests.length}</span> đề thi
              </p>
              {filteredTests.length > 0 && (
                <select className="px-4 py-2 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-200 text-sm font-medium hover:border-blue-400 dark:hover:border-blue-500 transition">
                  <option>Sắp xếp: Mới nhất</option>
                  <option>Sắp xếp: Cũ nhất</option>
                  <option>Sắp xếp: Câu hỏi (Nhiều nhất)</option>
                  <option>Sắp xếp: Câu hỏi (Ít nhất)</option>
                </select>
              )}
            </div>

            {/* Cards Grid - Enhanced Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTests.map((test, index) => (
                <div key={test.id} className="transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
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
