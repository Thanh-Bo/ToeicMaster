"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { Loader, ArrowLeft, Book, X } from "lucide-react";
import { vocabularyService } from "../services/vocabularyService";
import TopicCard from "../components/vocabulary/TopicCard";
import { VocabularyTopic } from "../types";
import { PageHeader } from "../components";

export default function VocabularyPage() {
  const router = useRouter();
  const [topics, setTopics] = useState<VocabularyTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      setLoading(true);
      const data = await vocabularyService.getTopics();
      setTopics(data);
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(err.message || "Lỗi khi tải chủ đề từ vựng");
    } finally {
      setLoading(false);
    }
  };

  const filteredTopics = topics.filter((topic) =>
    topic.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-800 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-lg opacity-30 animate-pulse"></div>
            <Loader className="w-16 h-16 text-blue-600 animate-spin relative" />
          </div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Đang tải chủ đề từ vựng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-800">
       <PageHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 px-4 py-2 mb-8 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800/50 rounded-lg transition-all font-semibold group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>Quay lại</span>
        </button>

        {/* Hero Section */}
        <div className="mb-12">
          <div className="flex items-start gap-4 mb-4">
            
            <div className="flex-1">
              <h1 className="text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-3 leading-tight">
                Từ Vựng TOEIC
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
                Phát triển vốn từ vựng chuyên sâu với các chủ đề TOEIC. Luyện tập, học flashcard và kiểm tra kiến thức
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white dark:bg-zinc-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-zinc-700">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{topics.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Chủ đề</div>
            </div>
            <div className="bg-white dark:bg-zinc-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-zinc-700">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {topics.reduce((sum, t) => sum + (t.wordCount || 0), 0)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Từ vựng</div>
            </div>
            <div className="bg-white dark:bg-zinc-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-zinc-700">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">∞</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Miễn phí</div>
            </div>
            <div className="bg-white dark:bg-zinc-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-zinc-700">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">3</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Cách học</div>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="mb-12">
          <div className="relative max-w-2xl">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Tìm kiếm chủ đề từ vựng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-5 py-4 border-2 border-gray-200 dark:border-zinc-700 rounded-xl
                bg-white dark:bg-zinc-800 text-gray-900 dark:text-white
                placeholder-gray-500 dark:placeholder-gray-400
                focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900/50 transition-all
                text-base font-medium shadow-sm"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-6 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <X size={32} className="text-red-600 dark:text-red-400 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-red-700 dark:text-red-300 mb-1">Lỗi tải dữ liệu</h3>
                <p className="text-red-600 dark:text-red-400">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Topics Grid */}
        {filteredTopics.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in">
            {filteredTopics.map((topic) => (
              <TopicCard key={topic.id} topic={topic} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white dark:bg-zinc-800/30 backdrop-blur-sm rounded-2xl border-2 border-dashed border-gray-200 dark:border-zinc-700">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
              {searchTerm ? "Không tìm thấy chủ đề từ vựng phù hợp" : "Chưa có chủ đề từ vựng"}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Xóa tìm kiếm
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
