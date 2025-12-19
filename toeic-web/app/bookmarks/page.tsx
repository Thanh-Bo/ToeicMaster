"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { bookmarkService, BookmarkItem } from "../services/bookmarkService";

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [removing, setRemoving] = useState<number | null>(null);

  useEffect(() => {
    loadBookmarks();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const loadBookmarks = async () => {
    try {
      const data = await bookmarkService.getBookmarks(page, 20);
      setBookmarks(data.items);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Failed to load bookmarks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (questionId: number) => {
    if (!confirm("Bạn có chắc muốn xóa bookmark này?")) return;
    
    setRemoving(questionId);
    try {
      await bookmarkService.remove(questionId);
      setBookmarks((prev) => prev.filter((b) => b.questionId !== questionId));
    } catch (error) {
      console.error("Failed to remove bookmark:", error);
    } finally {
      setRemoving(null);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-yellow-50 to-orange-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-yellow-50 to-orange-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">🔖 Câu hỏi đã lưu</h1>
            <p className="text-gray-600 mt-1">
              {bookmarks.length > 0 
                ? `Bạn đã đánh dấu ${bookmarks.length} câu hỏi` 
                : "Đánh dấu câu hỏi khó để ôn lại sau"}
            </p>
          </div>
          <Link href="/" className="px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition text-gray-700">
            ← Trang chủ
          </Link>
        </div>

        {bookmarks.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">🔖</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Chưa có bookmark nào</h3>
            <p className="text-gray-600 mb-6">
              Khi làm bài, bạn có thể đánh dấu những câu hỏi khó để ôn lại sau
            </p>
            <Link
              href="/tests"
              className="inline-block px-6 py-3 bg-orange-500 text-white font-medium rounded-xl hover:bg-orange-600 transition"
            >
              Làm bài thi thử
            </Link>
          </div>
        ) : (
          <>
            {/* Bookmarks List */}
            <div className="space-y-4">
              {bookmarks.map((bookmark) => (
                <div
                  key={bookmark.id}
                  className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition"
                >
                  {/* Header */}
                  <div
                    className="p-5 cursor-pointer"
                    onClick={() => setExpandedId(expandedId === bookmark.id ? null : bookmark.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <span className="w-10 h-10 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center font-bold shrink-0">
                          {bookmark.question.questionNo}
                        </span>
                        <div className="flex-1">
                          <p className="text-gray-800 line-clamp-2">
                            {bookmark.question.content || "Câu hỏi nghe"}
                          </p>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                              Part {bookmark.question.partNumber}
                            </span>
                            <span className="text-gray-400 text-xs">
                              Lưu: {formatDate(bookmark.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemove(bookmark.questionId);
                          }}
                          disabled={removing === bookmark.questionId}
                          className="p-2 text-gray-400 hover:text-red-500 transition disabled:opacity-50"
                        >
                          {removing === bookmark.questionId ? (
                            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          )}
                        </button>
                        <svg
                          className={`w-5 h-5 text-gray-400 transition-transform ${expandedId === bookmark.id ? "rotate-180" : ""}`}
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
                  {expandedId === bookmark.id && (
                    <div className="px-5 pb-5 pt-0 border-t bg-gray-50">
                      <div className="pt-4">
                        {/* Answers */}
                        <div className="space-y-2 mb-4">
                          {bookmark.question.answers.map((answer) => {
                            const isCorrect = answer.label.toUpperCase() === bookmark.question.correctOption?.toUpperCase();
                            return (
                              <div
                                key={answer.label}
                                className={`flex items-center gap-3 p-3 rounded-lg ${
                                  isCorrect ? "bg-green-50 border border-green-200" : "bg-white border"
                                }`}
                              >
                                <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold ${
                                  isCorrect ? "bg-green-500 text-white" : "bg-gray-200 text-gray-600"
                                }`}>
                                  {answer.label}
                                </span>
                                <span className={isCorrect ? "text-green-700" : "text-gray-700"}>
                                  {answer.content}
                                </span>
                                {isCorrect && <span className="ml-auto text-green-600 text-sm font-medium">✓ Đáp án đúng</span>}
                              </div>
                            );
                          })}
                        </div>

                        {/* Note */}
                        {bookmark.note && (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                            <span className="text-yellow-700 text-sm font-medium">📝 Ghi chú: </span>
                            <span className="text-yellow-800">{bookmark.note}</span>
                          </div>
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
