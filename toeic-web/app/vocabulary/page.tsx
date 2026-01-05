"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Loader } from "lucide-react";
import { vocabularyService } from "../services/vocabularyService";
import TopicCard from "../components/vocabulary/TopicCard";
import { VocabularyTopic } from "../types";

export default function VocabularyPage() {
  const { user } = useAuth();
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
      <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-gray-600 dark:text-gray-400">Đang tải chủ đề từ vựng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-white via-blue-50 to-white dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-1.5 h-8 bg-linear-to-b from-blue-600 to-blue-400 rounded-full"></div>
            <span className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Học Tập</span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-3 leading-tight">
            Từ Vựng TOEIC
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
            Phát triển vốn từ vựng chuyên sâu với 10 chủ đề TOEIC. Luyện tập, học flashcard và kiểm tra kiến thức ngay
          </p>
        </div>

        {/* Search Section */}
        <div className="mb-10">
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Tìm kiếm chủ đề từ vựng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-5 py-3.5 border-2 border-gray-200 dark:border-zinc-700 rounded-xl
                bg-white dark:bg-zinc-900 text-gray-900 dark:text-white
                placeholder-gray-500 dark:placeholder-gray-400
                focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors
                text-base font-medium"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-5 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl">
            <p className="text-red-700 dark:text-red-300 font-medium">{error}</p>
          </div>
        )}

        {/* Topics Grid */}
        {filteredTopics.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7">
            {filteredTopics.map((topic) => (
              <TopicCard key={topic.id} topic={topic} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-zinc-900/50 backdrop-blur-sm rounded-2xl border-2 border-dashed border-gray-200 dark:border-zinc-800">
            <svg className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">Không có chủ đề từ vựng phù hợp</p>
          </div>
        )}
      </div>
    </div>
  );
}
