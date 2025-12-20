"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { vocabularyService, VocabularyItem, VocabStats } from "../services/vocabularyService";

export default function VocabularyPage() {
  const [vocabularies, setVocabularies] = useState<VocabularyItem[]>([]);
  const [stats, setStats] = useState<VocabStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<{ category: string; count: number }[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    loadCategories();
    loadStats();
  }, []);

  useEffect(() => {
    loadVocabularies();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, category, search]);

  const loadCategories = async () => {
    try {
      const data = await vocabularyService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };

  const loadStats = async () => {
    try {
      const data = await vocabularyService.getStats();
      setStats(data);
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };

  const loadVocabularies = async () => {
    try {
      const data = await vocabularyService.getVocabularies({
        page,
        pageSize: 20,
        category: category || undefined,
        search: search || undefined
      });
      setVocabularies(data.items);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Failed to load vocabularies:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadVocabularies();
  };

  const getDifficultyStars = (difficulty: number) => {
    return "⭐".repeat(difficulty) + "☆".repeat(5 - difficulty);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-green-50 to-teal-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 to-teal-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">📚 Từ vựng TOEIC</h1>
            <p className="text-gray-600 mt-1">Học từ vựng với flashcards và spaced repetition</p>
          </div>
          <div className="flex gap-3">
            <Link 
              href="/vocabulary/flashcards" 
              className="px-5 py-2.5 bg-linear-to-r from-green-500 to-teal-600 text-white font-medium rounded-xl shadow hover:shadow-lg transition"
            >
              🎴 Học Flashcards
            </Link>
            <Link href="/" className="px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition text-gray-700">
              ← Trang chủ
            </Link>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-gray-800">{stats.totalVocabulary}</div>
              <div className="text-gray-500 text-sm">Tổng từ</div>
            </div>
            <div className="bg-blue-50 rounded-xl shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.learned}</div>
              <div className="text-blue-700 text-sm">Đã học</div>
            </div>
            <div className="bg-yellow-50 rounded-xl shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.learning}</div>
              <div className="text-yellow-700 text-sm">Đang học</div>
            </div>
            <div className="bg-green-50 rounded-xl shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.mastered}</div>
              <div className="text-green-700 text-sm">Thành thạo</div>
            </div>
            <div className="bg-red-50 rounded-xl shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{stats.dueForReview}</div>
              <div className="text-red-700 text-sm">Cần ôn tập</div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <form onSubmit={handleSearch} className="flex-1 min-w-50]">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm từ vựng..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
                <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </form>

            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Tất cả chủ đề</option>
              {categories.map((cat) => (
                <option key={cat.category} value={cat.category}>
                  {cat.category} ({cat.count})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Vocabulary List */}
        {vocabularies.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📖</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Không tìm thấy từ vựng</h3>
            <p className="text-gray-600">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
          </div>
        ) : (
          <>
            <div className="grid gap-4">
              {vocabularies.map((vocab) => (
                <div
                  key={vocab.id}
                  className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition"
                >
                  <div
                    className="p-5 cursor-pointer"
                    onClick={() => setExpandedId(expandedId === vocab.id ? null : vocab.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="text-xl font-bold text-gray-800">{vocab.word}</h3>
                            {vocab.partOfSpeech && (
                              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                                {vocab.partOfSpeech}
                              </span>
                            )}
                            {vocab.audioUrl && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  new Audio(vocab.audioUrl!).play();
                                }}
                                className="text-green-500 hover:text-green-700"
                              >
                                🔊
                              </button>
                            )}
                          </div>
                          {vocab.pronunciation && (
                            <p className="text-gray-500 text-sm mt-1">{vocab.pronunciation}</p>
                          )}
                          <p className="text-gray-700 mt-1">{vocab.meaning}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {vocab.category && (
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                            {vocab.category}
                          </span>
                        )}
                        <span className="text-xs" title={`Độ khó: ${vocab.difficulty}/5`}>
                          {getDifficultyStars(vocab.difficulty)}
                        </span>
                        <svg
                          className={`w-5 h-5 text-gray-400 transition-transform ${expandedId === vocab.id ? "rotate-180" : ""}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {expandedId === vocab.id && (
                    <div className="px-5 pb-5 pt-0 border-t bg-gray-50">
                      <div className="pt-4 space-y-3">
                        {vocab.example && (
                          <div>
                            <p className="text-gray-700 italic">&ldquo;{vocab.example}&rdquo;</p>
                            {vocab.exampleTranslation && (
                              <p className="text-gray-500 text-sm mt-1">→ {vocab.exampleTranslation}</p>
                            )}
                          </div>
                        )}
                        {vocab.imageUrl && (
                          <img src={vocab.imageUrl} alt={vocab.word} className="max-w-xs rounded-lg" />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="px-4 py-2 bg-white rounded-lg shadow disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md transition"
                >
                  ←
                </button>
                <span className="px-4 py-2 bg-white rounded-lg shadow">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-white rounded-lg shadow disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md transition"
                >
                  →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
