"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { bookmarkService, BookmarkItem } from "@/app/services/bookmarkService";
import {
  Trash2,
  Filter,
  Calendar,
  ArrowUpDown,
  BookOpen,
  PlayCircle,
  X,
  Edit,
} from "lucide-react";
import SidebarFilterItem from "@/app/components/boomarks/SidebarFilterItem";
import BookmarkNoteModal from "@/app/components/boomarks/BookmarkNoteModal";
import ReviewTestModal from "@/app/components/boomarks/ReviewTestModal";
import ReviewSetupModal from "@/app/components/boomarks/ReviewSetupModal";

export default function BookmarksTab() {
  const router = useRouter();

  // --- STATE ---
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [stats, setStats] = useState<{
    total: number;
    parts: Record<number, number>;
  }>({ total: 0, parts: {} });
  const [loading, setLoading] = useState(true);

  // Filter States
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedPart, setSelectedPart] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [selectedDate, setSelectedDate] = useState<string>(""); // Lưu ngày dạng YYYY-MM-DD

  // UI States
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [removing, setRemoving] = useState<number | null>(null);

  const [editModalData, setEditModalData] = useState<{
    questionId: number;
    note: string;
  } | null>(null);

  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [isTestOpen, setIsTestOpen] = useState(false);
  const [reviewQuestions, setReviewQuestions] = useState<BookmarkItem[]>([]);

  // Handler khi bấm nút "Ôn tập ngẫu nhiên" trên Toolbar
  const handleOpenReview = () => {
    setIsSetupOpen(true);
  };

  // Handler khi bấm "Bắt đầu ôn" trong Setup Modal
  const handleStartReviewSession = (selectedQuestions: BookmarkItem[]) => {
    setReviewQuestions(selectedQuestions);
    setIsSetupOpen(false);
    setIsTestOpen(true);
  };

  const handleUpdateNote = async (newNote: string) => {
    if (!editModalData) return;

    try {
      await bookmarkService.add(editModalData.questionId, newNote);

      setBookmarks((prev) =>
        prev.map((b) =>
          b.questionId === editModalData.questionId
            ? { ...b, note: newNote }
            : b
        )
      );

      setEditModalData(null);
    } catch (error) {
      console.error("Lỗi cập nhật note:", error);
      alert("Không thể cập nhật ghi chú");
    }
  };

  // --- 1. Load Stats (Chỉ chạy 1 lần khi mount) ---
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await bookmarkService.getStats();
        setStats(data);
      } catch (error) {
        console.error("Lỗi tải thống kê:", error);
      }
    };
    fetchStats();
  }, [bookmarks.length]);

  // --- 2. Load Bookmarks (Chạy khi filter thay đổi) ---
  useEffect(() => {
    loadBookmarks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, selectedPart, sortOrder, selectedDate]);

  const loadBookmarks = async () => {
    setLoading(true);
    try {
      let fromDate, toDate;
      if (selectedDate) {
        fromDate = `${selectedDate}T00:00:00`;
        toDate = `${selectedDate}T23:59:59`;
      }

      const data = await bookmarkService.getBookmarks(
        page,
        20,
        selectedPart,
        sortOrder,
        fromDate,
        toDate
      );
      setBookmarks(data.items);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Lỗi tải bookmark:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- HELPER: Format Date & Time ---
  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    const dateStr = date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const timeStr = date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    return { dateStr, timeStr };
  };

  // --- HANDLERS ---
  const handleRemove = async (questionId: number) => {
    if (!confirm("Xóa câu hỏi này khỏi bookmark?")) return;
    setRemoving(questionId);
    try {
      await bookmarkService.remove(questionId);
      setBookmarks((prev) => prev.filter((b) => b.questionId !== questionId));
    } catch (error) {
      alert("Xóa thất bại");
    } finally {
      setRemoving(null);
    }
  };

  const handleRemoveAll = async () => {
    if (!confirm("CẢNH BÁO: Xóa TẤT CẢ bookmark?")) return;
    setLoading(true);
    try {
      await bookmarkService.removeAll();
      setBookmarks([]);
      setStats({ total: 0, parts: {} });
    } catch (error) {
      alert("Lỗi khi xóa tất cả");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-transparent">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-gray-150/40 dark:border-zinc-800/50 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 rounded-2xl">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                Kho câu hỏi đã lưu
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-405 mt-0.5">
                Lưu trữ và xem lại các câu hỏi TOEIC quan trọng của bạn · <span className="font-bold text-gray-700 dark:text-gray-300">{stats.total} câu</span>
              </p>
            </div>
          </div>

          <button
            disabled={bookmarks.length === 0}
            onClick={handleOpenReview}
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] px-5 py-3 rounded-xl font-bold text-sm transition-all duration-250 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PlayCircle size={18} className="fill-current stroke-[2.5]" />
            <span>Ôn tập ngẫu nhiên</span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* --- MOBILE HORIZONTAL FILTERS --- */}
          <div className="lg:hidden flex gap-2 overflow-x-auto pb-2 -mx-3 px-3 scrollbar-none flex-nowrap mb-2">
            <button
              onClick={() => setSelectedPart(null)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-1.5 shrink-0 ${
                selectedPart === null
                  ? "bg-blue-600 dark:bg-blue-550 text-white shadow-sm shadow-blue-500/20"
                  : "bg-white/80 dark:bg-zinc-900/60 border border-gray-200/50 dark:border-zinc-800/80 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800"
              }`}
            >
              <Filter size={12} />
              <span>Tất cả ({stats.total})</span>
            </button>
            {[1, 2, 3, 4, 5, 6, 7].map((num) => {
              const count = stats.parts[num] || 0;
              return (
                <button
                  key={num}
                  onClick={() => setSelectedPart(num)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-1.5 shrink-0 ${
                    selectedPart === num
                      ? "bg-blue-600 dark:bg-blue-550 text-white shadow-sm shadow-blue-500/20"
                      : "bg-white/80 dark:bg-zinc-900/60 border border-gray-200/50 dark:border-zinc-800/80 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  <span>Part {num}</span>
                  {count > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${selectedPart === num ? "bg-white/25 text-white" : "bg-gray-200 dark:bg-zinc-800 text-gray-500 dark:text-gray-400"}`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* --- LEFT SIDEBAR (FILTERS & STATS) --- */}
          <div className="hidden lg:block lg:w-1/4">
            <div className="bg-white/80 dark:bg-zinc-900/60 backdrop-blur-md rounded-2xl border border-gray-200/50 dark:border-zinc-800/80 p-4 sticky top-24 shadow-2xs">
              <h3 className="font-bold text-gray-400 dark:text-gray-500 text-[11px] uppercase tracking-widest mb-4 px-2">
                Phân loại kỹ năng
              </h3>

              <SidebarFilterItem
                label="Tất cả"
                partNum={null}
                count={stats.total}
                isActive={selectedPart === null}
                onClick={setSelectedPart}
                icon={<Filter size={14} className="mr-0.5" />}
              />

              <div className="my-3.5 border-t border-gray-150/40 dark:border-zinc-800/50"></div>

              <div className="space-y-1">
                <h4 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 px-3 mb-2 uppercase tracking-wider">
                  Listening (Nghe)
                </h4>
                {[1, 2, 3, 4].map((num) => (
                  <SidebarFilterItem
                    key={num}
                    label={`Part ${num}`}
                    partNum={num}
                    count={stats.parts[num] || 0}
                    isActive={selectedPart === num}
                    onClick={setSelectedPart}
                  />
                ))}
              </div>

              <div className="space-y-1 mt-5">
                <h4 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 px-3 mb-2 uppercase tracking-wider">
                  Reading (Đọc)
                </h4>
                {[5, 6, 7].map((num) => (
                  <SidebarFilterItem
                    key={num}
                    label={`Part ${num}`}
                    partNum={num}
                    count={stats.parts[num] || 0}
                    isActive={selectedPart === num}
                    onClick={setSelectedPart}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* --- MAIN CONTENT --- */}
          <div className="w-full lg:w-3/4">
            {/* Toolbar: Date & Sort */}
            <div className="bg-white/80 dark:bg-zinc-900/60 backdrop-blur-md p-4 rounded-2xl border border-gray-200/50 dark:border-zinc-800/80 mb-6 shadow-2xs">
              <div className="flex flex-wrap items-center justify-between gap-4">
                {/* Date Picker Section */}
                <div className="flex items-center gap-2 bg-gray-50/50 dark:bg-zinc-850/50 px-3 py-2.5 rounded-xl border border-gray-205/30 dark:border-zinc-800/60 shrink-0">
                  <Calendar size={15} className="text-gray-400 dark:text-gray-500" />
                  <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                    Ngày lưu:
                  </span>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="bg-transparent text-xs font-semibold outline-none text-gray-700 dark:text-gray-300 border-none p-0 cursor-pointer"
                  />
                  {selectedDate && (
                    <button
                      onClick={() => setSelectedDate("")}
                      className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 ml-1 transition"
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3 ml-auto sm:ml-0">
                  <div className="bg-white/80 dark:bg-zinc-900 flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-850 shadow-2xs">
                    <ArrowUpDown size={15} className="text-gray-400 dark:text-gray-500" />
                    <select
                      value={sortOrder}
                      onChange={(e) =>
                        setSortOrder(e.target.value as "newest" | "oldest")
                      }
                      className="bg-transparent text-xs font-bold cursor-pointer text-gray-750 dark:text-gray-250 outline-none"
                    >
                      <option value="newest">Mới nhất</option>
                      <option value="oldest">Cũ nhất</option>
                    </select>
                  </div>

                  {bookmarks.length > 0 && (
                    <button
                      onClick={handleRemoveAll}
                      className="p-2.5 text-red-500 hover:bg-red-500/10 dark:hover:bg-red-950/20 dark:text-red-400 rounded-xl transition hover:scale-105 active:scale-95"
                      title="Xóa tất cả bookmark"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* List */}
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 dark:border-zinc-700 border-t-blue-500"></div>
              </div>
            ) : bookmarks.length === 0 ? (
              <div className="text-center py-20 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md rounded-2xl border border-dashed border-gray-200 dark:border-zinc-700">
                <div className="text-5xl mb-4">📭</div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                  Kho lưu trữ trống
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
                  {selectedDate
                    ? `Không tìm thấy câu hỏi đã lưu nào trong ngày ${
                        formatDateTime(selectedDate).dateStr
                      }`
                    : "Bạn chưa lưu câu hỏi nào từ các bài thi."}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {bookmarks.map((item) => {
                  const { dateStr, timeStr } = formatDateTime(item.createdAt);
                  const isExpanded = expandedId === item.id;
                  return (
                    <div
                      key={item.id}
                      className={`bg-white/80 dark:bg-zinc-900/60 backdrop-blur-md rounded-2xl border transition-all duration-300 hover:shadow-md
                            ${
                              isExpanded
                                ? "ring-2 ring-blue-500/30 border-transparent shadow-lg"
                                : "border-gray-200/50 dark:border-zinc-800/60"
                            }`}
                    >
                      <div
                        className="p-4 sm:p-5 cursor-pointer group"
                        onClick={() =>
                          setExpandedId(isExpanded ? null : item.id)
                        }
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex gap-3 sm:gap-4 flex-1">
                            <div
                              className="w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0 font-extrabold border bg-gray-50/50 dark:bg-zinc-800/50 text-gray-600 dark:text-gray-300 border-gray-200/50 dark:border-zinc-800/50"
                            >
                              <span className="text-[9px] uppercase tracking-wider text-gray-400">
                                Part
                              </span>
                              <span className="text-lg leading-none mt-0.5">
                                {item.question.partNumber}
                              </span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                <div className="flex items-center gap-1 text-[10px] sm:text-xs font-semibold text-gray-500 dark:text-gray-405 bg-gray-150/55 dark:bg-zinc-800/60 px-2 py-0.5 rounded-md">
                                  <Calendar size={11} className="text-gray-400" />
                                  <span>{dateStr}</span>
                                  <span className="w-1 h-1 bg-gray-400 rounded-full mx-0.5"></span>
                                  <span className="text-gray-700 dark:text-gray-300 font-bold">
                                    {timeStr}
                                  </span>
                                </div>

                                {item.sourceTestName && (
                                  <span className="text-[10px] sm:text-xs font-semibold text-gray-500 dark:text-gray-405 bg-gray-150/55 dark:bg-zinc-800/60 px-2 py-0.5 rounded-md border border-gray-205/30 dark:border-zinc-800/50 truncate max-w-[160px]" title={item.sourceTestName}>
                                    {item.sourceTestName}
                                  </span>
                                )}
                              </div>
                              <h4 className="font-bold text-gray-900 dark:text-white line-clamp-2 text-sm sm:text-base leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                Câu {item.question.questionNo} :{" "}
                                {item.question.content ||
                                  "(Câu hỏi dạng hình ảnh / âm thanh)"}
                              </h4>
                              
                              {/* NOTE & EDIT BUTTON */}
                              {item.note && (
                                <div className="mt-2.5 flex items-center gap-2">
                                  <div className="text-xs sm:text-sm text-amber-800 dark:text-amber-350 bg-amber-500/10 px-3.5 py-1.5 rounded-xl border border-amber-300/30 dark:border-amber-500/30 flex items-center gap-2 font-medium">
                                    <span className="break-all">{item.note}</span>
                                  </div>

                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEditModalData({
                                        questionId: item.questionId,
                                        note: item.note || "",
                                      });
                                    }}
                                    className="p-1.5 text-amber-600 dark:text-amber-400 hover:bg-amber-500/15 rounded-lg transition"
                                    title="Sửa ghi chú"
                                  >
                                    <Edit size={14} />
                                  </button>
                                </div>
                              )}
                              
                              {!item.note && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditModalData({
                                      questionId: item.questionId,
                                      note: "",
                                    });
                                  }}
                                  className="mt-2 text-xs font-bold text-blue-500 dark:text-blue-400 hover:text-blue-650 flex items-center gap-1 sm:opacity-0 group-hover:opacity-100 transition-all duration-300"
                                >
                                  <Edit size={12} />
                                  <span>Thêm ghi chú</span>
                                </button>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemove(item.questionId);
                            }}
                            className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition shrink-0"
                          >
                            {removing === item.questionId ? (
                              <div className="animate-spin h-4.5 w-4.5 border-2 border-red-500 dark:border-red-400 border-t-transparent rounded-full" />
                            ) : (
                              <Trash2 size={17} />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Expanded Content (Details) */}
                      {isExpanded && (
                        <div className="px-4 sm:px-6 pb-5 pt-3 border-t border-gray-150/40 dark:border-zinc-800/50 bg-gray-50/30 dark:bg-zinc-900/30 rounded-b-2xl">
                          {item.question.imageUrl && (
                            <div className="mb-4 mt-2">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={`http://localhost:5298${item.question.imageUrl}`}
                                className="max-w-md w-full rounded-xl border border-gray-200/50 shadow-sm"
                                alt="Question Image"
                              />
                            </div>
                          )}
                          {item.question.audioUrl && (
                            <div className="mb-4 mt-2">
                              <audio
                                controls
                                className="w-full h-9 rounded-lg"
                                src={`http://localhost:5298${item.question.audioUrl}`}
                              />
                            </div>
                          )}
                          {item.question.textContent && (
                            <div
                              className="mb-4 p-4 bg-white/60 dark:bg-zinc-900/40 rounded-xl border border-gray-200/50 dark:border-zinc-800/50 text-sm text-gray-805 dark:text-gray-200 max-h-40 overflow-y-auto leading-relaxed"
                              dangerouslySetInnerHTML={{
                                __html: item.question.textContent,
                              }}
                            />
                          )}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                            {item.question.answers.map((ans) => {
                              const isCorrect =
                                ans.label === item.question.correctOption;
                              return (
                                <div
                                  key={ans.label}
                                  className={`p-3.5 rounded-xl border flex gap-3 items-center ${
                                    isCorrect
                                      ? "bg-emerald-500/10 dark:bg-emerald-500/10 border-emerald-500/30 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300 font-semibold shadow-2xs"
                                      : "bg-white/80 dark:bg-zinc-900/60 border-gray-200/50 dark:border-zinc-800/60 text-gray-600 dark:text-gray-300"
                                  }`}
                                >
                                  <span
                                    className={`w-7 h-7 flex items-center justify-center rounded-lg text-sm transition-all duration-305 ${
                                      isCorrect
                                        ? "bg-emerald-600 text-white font-extrabold shadow-xs"
                                        : "bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-gray-400 font-bold"
                                    }`}
                                  >
                                    {ans.label}
                                  </span>
                                  <span className="text-sm">{ans.content}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-white/80 dark:bg-zinc-900/80 border border-gray-200/50 dark:border-zinc-700/60 rounded-xl hover:bg-gray-150/40 text-gray-600 dark:text-gray-400 disabled:opacity-50 transition font-bold text-xs sm:text-sm shadow-2xs"
                >
                  Trước
                </button>
                <span className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl text-xs sm:text-sm shadow-sm shadow-blue-500/20">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-white/80 dark:bg-zinc-900/80 border border-gray-200/50 dark:border-zinc-700/60 rounded-xl hover:bg-gray-150/40 text-gray-600 dark:text-gray-400 disabled:opacity-50 transition font-bold text-xs sm:text-sm shadow-2xs"
                >
                  Sau
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <BookmarkNoteModal
        isOpen={!!editModalData}
        onClose={() => setEditModalData(null)}
        onSave={handleUpdateNote}
        defaultNote={editModalData?.note || ""}
      />

      <ReviewSetupModal
        isOpen={isSetupOpen}
        onClose={() => setIsSetupOpen(false)}
        currentPart={selectedPart}
        currentSort={sortOrder}
        fromDate={selectedDate ? `${selectedDate}T00:00:00` : undefined}
        toDate={selectedDate ? `${selectedDate}T23:59:59` : undefined}
        onStartReview={handleStartReviewSession}
      />

      <ReviewTestModal
        isOpen={isTestOpen}
        onClose={() => setIsTestOpen(false)}
        questions={reviewQuestions}
      />
    </div>
  );
}
