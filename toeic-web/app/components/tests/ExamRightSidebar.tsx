"use client";

import { Send, Trash2, Pause, Play, MessageCircle } from "lucide-react";
import { useState } from "react";
import { FeedbackModal } from "../feedback";

interface Props {
  parts: any[];
  userAnswers: Record<number, string>;
  onScrollToQuestion: (id: number) => void;
  onSubmit: () => void;
  onClearAll: () => void;
  onStopTimer: () => void;
  isSubmitting: boolean;
  timeLeft: number; // Nhận từ parent
  currentQuestionId: number | null; // Để highlight câu đang xem
  durationParam?: string | null;
  isTimerPaused?: boolean;
}

export default function ExamRightSidebar({
  parts,
  userAnswers,
  onScrollToQuestion,
  onSubmit,
  onClearAll,
  onStopTimer,
  isSubmitting,
  timeLeft,
  currentQuestionId,
  durationParam,
  isTimerPaused = false,
}: Props) {
  const [showFeedback, setShowFeedback] = useState(false);
  const isUnlimited = durationParam === "0";
  // Format giây thành HH:MM:SS hoặc MM:SS
  const formatTime = (seconds: number) => {
    // Tính tổng số phút (không chia ra giờ)
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;

    // Trả về dạng MM:SS (Ví dụ: 0:00, 5:30, 120:00)
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const isLowTime = !isUnlimited && timeLeft <= 300;

  return (
    <div className="sticky top-20 dark:text-white text-zinc-600 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-700 overflow-y-auto max-h-[calc(100vh-5rem)] custom-scrollbar">
      <div className="p-3 md:p-5">
        {/* 1. ĐỒNG HỒ & NỘP BÀI */}
        <div className="text-center mb-2">
          <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
            {isUnlimited ? "Thời gian làm bài:" : "Thời gian còn lại:"}
          </div>

          <div
            className={`text-2xl md:text-3xl font-bold mb-3 md:mb-4 tracking-wider transition-colors
          ${
            isLowTime
              ? "text-red-600 dark:text-red-400 animate-pulse"
              : "text-gray-800 dark:text-white"
          }`}
          >
            {formatTime(timeLeft)}
          </div>

          {isLowTime && (
            <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-400 text-xs p-2 rounded-lg mb-3 font-medium">
              ⚠️ Sắp hết giờ! Hãy nộp bài ngay.
            </div>
          )}

          <button
            onClick={onSubmit}
            disabled={isSubmitting}
            className={`w-full py-2 md:py-2.5 rounded-lg font-bold transition-all duration-200 uppercase text-xs md:text-sm border flex items-center justify-center gap-2
            ${
              isLowTime
                ? "bg-red-600 text-white border-red-600 hover:bg-red-700"
                : "bg-white dark:bg-zinc-800 text-gray-900 dark:text-white border-gray-200 dark:border-zinc-600 hover:bg-gray-100 dark:hover:bg-zinc-700"
            }`}
          >
            <Send className="w-3 h-3 md:w-4 md:h-4" />
            {isSubmitting ? "Đang nộp..." : "Nộp bài"}
          </button>

          <button
            onClick={onStopTimer}
            className={`w-full py-2 md:py-2.5 rounded-lg font-bold transition-all duration-200 uppercase text-xs md:text-sm border mt-2 flex items-center justify-center gap-2
            ${
              isTimerPaused
                ? "bg-green-500 text-white border-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
                : "bg-orange-500 text-white border-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700"
            }`}
          >
            {isTimerPaused ? (
              <>
                <Play className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden sm:inline">Tiếp tục</span>
                <span className="sm:hidden">Chơi</span>
              </>
            ) : (
              <>
                <Pause className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden sm:inline">Tạm dừng</span>
                <span className="sm:hidden">Dừng</span>
              </>
            )}
          </button>
        </div>

        <button
          onClick={() => {
            if (confirm("Bạn có chắc chắn muốn xóa tất cả đáp án đã chọn?")) {
              onClearAll();
            }
          }}
          className="w-full py-1.5 md:py-2 rounded-lg font-bold transition-all duration-200 text-xs md:text-sm mb-3 md:mb-4 uppercase flex items-center justify-center gap-2
          border border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-400 hover:border-red-400 dark:hover:border-red-500 hover:text-red-600 dark:hover:text-red-400"
        >
          <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
          <span className="hidden sm:inline">Xóa tất cả</span>
          <span className="sm:hidden">Xóa</span>
        </button>
        <button
          onClick={() => setShowFeedback(true)}
          className="w-full py-1.5 md:py-2 rounded-lg font-bold transition-all duration-200 text-xs md:text-sm mb-3 md:mb-4 uppercase flex items-center justify-center gap-2
          bg-white dark:bg-zinc-800 text-gray-900 dark:text-white border-gray-200 dark:border-zinc-600 hover:bg-gray-100 dark:hover:bg-zinc-700"
          title="Gửi ý kiến"
        >
          <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
          <span className="hidden sm:inline">Gửi ý kiến</span>
          <span className="sm:hidden">Ý kiến</span>
        </button>
        {showFeedback && (
          <FeedbackModal onClose={() => setShowFeedback(false)} />
        )}

        <hr className="border-gray-100 dark:border-zinc-700 my-3 md:my-4" />

        {/* 2. CHÚ THÍCH */}
        <div className="mb-3 md:mb-4 text-xs text-gray-500 dark:text-gray-400">
          <span className="font-bold text-orange-500 dark:text-orange-400">
            Chú ý:{" "}
          </span>
          <span className="hidden sm:inline">Click vào số câu hỏi để nhảy đến | Nhấn phím A/B/C/D để chọn nhanh</span>
          <span className="sm:inline">Click số để nhảy | Phím A/B/C/D chọn</span>
        </div>

        {/* 3. DANH SÁCH CÂU HỎI (PALETTE) */}
        <div className="space-y-4 md:space-y-6 pr-1 md:pr-2">
          {parts.map((part) => (
            <div key={part.id}>
              <h4 className="font-bold text-gray-700 dark:text-gray-300 text-xs md:text-sm mb-2 md:mb-3">
                {part.name}
              </h4>
              <div className="grid grid-cols-5 gap-1.5 md:gap-2">
                {part.groups
                  .flatMap((g: any) => g.questions)
                  .map((q: any) => {
                    const isAnswered = !!userAnswers[q.id];
                    const isCurrent = currentQuestionId === q.id;

                    return (
                      <button
                        key={q.id}
                        onClick={() => onScrollToQuestion(q.id)}
                        className={`h-7 w-7 md:h-8 md:w-8 text-xs font-medium rounded flex items-center justify-center border-2 transition-all
                      ${
                        isCurrent
                          ? "ring-2 ring-gray-400 dark:ring-zinc-400 ring-offset-1 dark:ring-offset-zinc-900"
                          : ""
                      }
                      ${
                        isAnswered
                          ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white font-medium"
                          : "bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-700"
                      }`}
                      >
                        {q.questionNo}
                      </button>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
