"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { bookmarkService, BookmarkItem } from "../services/bookmarkService";
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
import SidebarFilterItem from "../components/boomarks/SidebarFilterItem";
import BookmarkNoteModal from "../components/boomarks/BookmarkNoteModal";
import ReviewTestModal from "../components/boomarks/ReviewTestModal";
import ReviewSetupModal from "../components/boomarks/ReviewSetupModal";

export default function BookmarksPage() {
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
    // Logic "Thông minh": Nếu chưa chọn gì -> Có thể alert nhắc nhở hoặc mặc định là All
    // Ở đây ta cứ mở Modal Setup lên, nó sẽ tự fetch theo filter hiện tại
    setIsSetupOpen(true);
  };

  // Handler khi bấm "Bắt đầu ôn" trong Setup Modal
  const handleStartReviewSession = (selectedQuestions: BookmarkItem[]) => {
    setReviewQuestions(selectedQuestions);
    setIsSetupOpen(false); // Đóng setup
    setIsTestOpen(true);   // Mở bài test
  };

  const handleUpdateNote = async (newNote: string) => {
    if (!editModalData) return;

    // 1. Gọi API (Dùng hàm add vì backend hỗ trợ update nếu đã tồn tại)
    try {
      await bookmarkService.add(editModalData.questionId, newNote);

      // 2. Cập nhật giao diện ngay lập tức (Optimistic Update)
      setBookmarks((prev) =>
        prev.map((b) =>
          b.questionId === editModalData.questionId
            ? { ...b, note: newNote } // Thay note cũ bằng note mới
            : b
        )
      );

      // 3. Đóng modal
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
  }, [bookmarks.length]); // Reload stats nếu số lượng bookmark thay đổi

  // --- 2. Load Bookmarks (Chạy khi filter thay đổi) ---
  useEffect(() => {
    loadBookmarks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, selectedPart, sortOrder, selectedDate]);

  const loadBookmarks = async () => {
    setLoading(true);
    try {
      // Xử lý ngày: Nếu chọn ngày cụ thể, tạo range từ 00:00 đến 23:59
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
    // Format ngày: 12/02/2024
    const dateStr = date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    // Format giờ: 14:20
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
      // Cập nhật lại stats ở client luôn cho mượt (optional)
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
    <div className="min-h-screen bg-white dark:bg-zinc-900 font-sans">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-6 gap-4">
          <div>
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-2">
              <button
                onClick={() => router.push("/")}
                className="hover:text-blue-600 dark:hover:text-blue-400 transition"
              >
                Trang chủ
              </button>
              <span>/</span>
              <span>Bookmarks</span>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white flex items-center gap-2">
              <BookOpen className="text-blue-600 dark:text-blue-400" /> Kho lưu trữ
              <span className="text-lg bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full">
                {stats.total} câu
              </span>
            </h1>
          </div>

          <button
            disabled={bookmarks.length === 0}
            onClick={handleOpenReview}
            className=" bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg  transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PlayCircle size={20} /> Ôn tập ngẫu nhiên
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* --- LEFT SIDEBAR (FILTERS & STATS) --- */}
          <div className="lg:w-1/4">
            <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-700 p-4 sticky top-24">
              <h3 className="font-bold text-gray-400 dark:text-gray-500 text-xs uppercase tracking-wider mb-4 px-2">
                Bộ lọc kỹ năng
              </h3>

              <SidebarFilterItem
                label="Tất cả"
                partNum={null}
                count={stats.total}
                isActive={selectedPart === null}
                onClick={setSelectedPart}
                icon={<Filter size={16} />}
              />

              <div className="my-3 border-t border-gray-100 dark:border-slate-700"></div>

              <div className="space-y-1">
                <h4 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 px-3 mb-1 uppercase">
                  Listening
                </h4>
                {[1, 2, 3, 4].map((num) => (
                  <SidebarFilterItem
                    key={num}
                    label={`Part ${num}`}
                    partNum={num}
                    count={stats.parts[num] || 0} // Show số lượng từ API
                    isActive={selectedPart === num}
                    onClick={setSelectedPart}
                  />
                ))}
              </div>

              <div className="space-y-1 mt-4">
                <h4 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 px-3 mb-1 uppercase">
                  Reading
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
          <div className="lg:w-3/4">
            {/* Toolbar: Date & Sort */}
            <div className="bg-white dark:bg-zinc-800 p-4 rounded-xl border border-gray-200 dark:border-zinc-700 shadow-sm mb-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                {/* Date Picker Section */}
                <div className="flex items-center gap-2 bg-gray-50 dark:bg-zinc-700 px-3 py-2 rounded-lg border border-gray-200 dark:border-zinc-600">
                  <Calendar size={18} className="text-gray-500 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Ngày lưu:
                  </span>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="bg-transparent text-sm outline-none text-gray-800 dark:text-white"
                  />
                  {selectedDate && (
                    <button
                      onClick={() => setSelectedDate("")}
                      className="text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-white dark:bg-zinc-700 flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200 px-3 py-2.5 rounded-lg border border-gray-200 dark:border-zinc-600 hover:border-gray-300 dark:hover:border-zinc-500 transition">
                    <ArrowUpDown size={16} className="text-gray-600 dark:text-gray-400" />
                    <select
                      value={sortOrder}
                      onChange={(e) =>
                        setSortOrder(e.target.value as "newest" | "oldest")
                      }
                      className=" bg-white dark:bg-zinc-700 text-sm font-medium cursor-pointer text-gray-700 dark:text-white"
                    >
                      <option value="newest">Mới nhất</option>
                      <option value="oldest">Cũ nhất</option>
                    </select>
                  </div>

                  {bookmarks.length > 0 && (
                    <button
                      onClick={handleRemoveAll}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 dark:text-red-400 rounded-lg transition"
                      title="Xóa tất cả"
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
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 dark:border-blue-400 border-t-transparent"></div>
              </div>
            ) : bookmarks.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-zinc-800 rounded-2xl border border-dashed border-gray-300 dark:border-zinc-700">
                <div className="text-6xl mb-4">📭</div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                  Không có dữ liệu
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {selectedDate
                    ? `Không có bookmark nào trong ngày ${
                        formatDateTime(selectedDate).dateStr
                      }`
                    : "Chưa có bookmark nào."}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {bookmarks.map((item) => {
                  const { dateStr, timeStr } = formatDateTime(item.createdAt);
                  return (
                    <div
                      key={item.id}
                      className={`bg-white dark:bg-zinc-800 rounded-xl border transition-all duration-200 hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-zinc-900
                            ${
                              expandedId === item.id
                                ? "ring-2 ring-blue-400 dark:ring-blue-500 border-transparent shadow-lg"
                                : "border-gray-200 dark:border-slate-700"
                            }
                            `}
                    >
                      <div
                        className="p-5 cursor-pointer"
                        onClick={() =>
                          setExpandedId(expandedId === item.id ? null : item.id)
                        }
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex gap-4 flex-1">
                            <div
                              className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0 font-bold border
                                            ${
                                              item.question.partNumber <= 4
                                                ? "bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700"
                                                : "bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700"
                                            }
                                        `}
                            >
                              <span className="text-[10px] uppercase">
                                Part
                              </span>
                              <span className="text-lg leading-none">
                                {item.question.partNumber}
                              </span>
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                {/* Hiển thị Ngày và Giờ riêng biệt */}
                                <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-zinc-700 px-2 py-0.5 rounded">
                                  <Calendar size={12} />
                                  <span>{dateStr}</span>
                                  <span className="w-1 h-1 bg-gray-400 dark:bg-zinc-600 rounded-full"></span>
                                  <span className="text-gray-700 dark:text-gray-300 font-bold">
                                    {timeStr}
                                  </span>
                                </div>

                                {item.sourceTestName && (
                                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900 px-2 py-0.5 rounded border border-blue-100 dark:border-blue-700 truncate max-w-[150px]">
                                    {item.sourceTestName}
                                  </span>
                                )}
                              </div>
                              <h4 className="font-medium text-gray-900 dark:text-white line-clamp-2">
                                Câu {item.question.questionNo} :{" "}
                                {item.question.content ||
                                  "(Câu hỏi hình ảnh/âm thanh)"}
                              </h4>
                              {/* --- PHẦN HIỂN THỊ NOTE & NÚT EDIT (ĐÃ SỬA) --- */}
                              {item.note && (
                                <div className="mt-2 flex items-center gap-2 group">
                                  <p className="text-sm text-yellow-800 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-900 px-3 py-1.5 rounded-lg border border-yellow-200 dark:border-yellow-700 flex items-center gap-2">
                                    <span> {item.note}</span>
                                  </p>

                                  {/* Nút Bút Chì */}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation(); // Chặn click lan ra ngoài (để không mở accordion)
                                      setEditModalData({
                                        questionId: item.questionId,
                                        note: item.note || "",
                                      });
                                    }}
                                    className="p-1.5 text-gray-400 dark:text-gray-500 bg-blue-50 dark:bg-blue-900 rounded-full transition opacity-100"
                                    title="Sửa ghi chú"
                                  >
                                    <Edit size={14} />
                                  </button>
                                </div>
                              )}
                              {/* Nếu chưa có note thì hiện nút thêm (Optional) */}
                              {!item.note && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditModalData({
                                      questionId: item.questionId,
                                      note: "",
                                    });
                                  }}
                                  className="mt-2 text-xs text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition"
                                >
                                  <Edit size={12} /> Thêm ghi chú
                                </button>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemove(item.questionId);
                            }}
                            className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 rounded-full transition"
                          >
                            {removing === item.questionId ? (
                              <div className="animate-spin h-4 w-4 border-2 border-red-500 dark:border-red-400 border-t-transparent rounded-full" />
                            ) : (
                              <Trash2 size={18} />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Expanded Content (Details) - Phần này giữ nguyên như cũ */}
                      {expandedId === item.id && (
                        <div className="px-5 pb-5 pt-2 border-t border-gray-100 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-700 rounded-b-xl">
                          {/* Nội dung chi tiết câu hỏi (copy lại phần render Audio/Image/Text/Answers như cũ) */}
                          {item.question.imageUrl && (
                            <img
                              src={`http://localhost:5298${item.question.imageUrl}`}
                              className="max-w-xs rounded-lg border shadow-sm mb-4 mt-2"
                              alt="Q"
                            />
                          )}
                          {item.question.audioUrl && (
                            <audio
                              controls
                              className="w-full h-8 mb-4 mt-2"
                              src={`http://localhost:5298${item.question.audioUrl}`}
                            />
                          )}
                          {item.question.textContent && (
                            <div
                              className="mb-4 p-4 bg-white dark:bg-zinc-700 rounded border border-gray-200 dark:border-zinc-600 text-sm text-gray-800 dark:text-gray-100 max-h-40 overflow-y-auto"
                              dangerouslySetInnerHTML={{
                                __html: item.question.textContent,
                              }}
                            />
                          )}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {item.question.answers.map((ans) => {
                              const isCorrect =
                                ans.label === item.question.correctOption;
                              return (
                                <div
                                  key={ans.label}
                                  className={`p-3 rounded-lg border flex gap-3 items-center ${
                                    isCorrect
                                      ? "bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-700 text-green-800 dark:text-green-200"
                                      : "bg-white dark:bg-zinc-700 border-gray-200 dark:border-zinc-600 text-gray-600 dark:text-gray-300"
                                  }`}
                                >
                                  <span
                                    className={`font-bold w-6 h-6 flex items-center justify-center rounded ${
                                      isCorrect
                                        ? "bg-green-600 dark:bg-green-700 text-white"
                                        : "bg-gray-200 dark:bg-zinc-700 dark:text-gray-400"
                                    }`}
                                  >
                                    {ans.label}
                                  </span>
                                  <span>{ans.content}</span>
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
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded hover:bg-gray-50 dark:hover:bg-zinc-700 disabled:opacity-50 text-gray-600 dark:text-gray-400 transition"
                >
                  Trước
                </button>
                <span className="px-4 py-2 bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400 font-bold rounded border border-blue-200 dark:border-blue-700">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded hover:bg-gray-50 dark:hover:bg-zinc-700 disabled:opacity-50 text-gray-600 dark:text-gray-400 transition"
                >
                  Sau
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <BookmarkNoteModal
        isOpen={!!editModalData} // Mở khi có data
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
