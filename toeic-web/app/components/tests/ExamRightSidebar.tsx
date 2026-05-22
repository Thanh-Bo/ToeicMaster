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
    <div className="sticky top-20 dark:text-zinc-200 text-zinc-700 bg-white/80 dark:bg-zinc-900/60 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200/50 dark:border-zinc-800/45 overflow-y-auto max-h-[calc(100vh-5.5rem)] custom-scrollbar">
      <div className="p-4 sm:p-5">
        {/* 1. ĐỒNG HỒ & NỘP BÀI */}
        <div className="text-center mb-2">
          <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">
            {isUnlimited ? "Thời gian làm bài:" : "Thời gian còn lại:"}
          </div>

          <div
            className={`text-2xl sm:text-3xl font-black mb-3 sm:mb-4 tracking-wider transition-colors
          ${
            isLowTime
              ? "text-red-600 dark:text-red-400 animate-pulse"
              : "text-gray-800 dark:text-white"
          }`}
          >
            {formatTime(timeLeft)}
          </div>

          {isLowTime && (
            <div className="bg-red-100 dark:bg-red-950/40 border border-red-200/40 dark:border-red-900/50 text-red-700 dark:text-red-400 text-xs p-2.5 rounded-xl mb-3 font-semibold">
              ⚠️ Sắp hết giờ! Hãy nộp bài ngay.
            </div>
          )}

          <button
            onClick={onSubmit}
            disabled={isSubmitting}
            className={`w-full py-2 sm:py-2.5 rounded-xl font-bold transition-all duration-200 uppercase text-xs sm:text-sm border flex items-center justify-center gap-2 shadow-xs hover:scale-[1.01] active:scale-[0.99]
            ${
              isLowTime
                ? "bg-red-600 text-white border-transparent hover:bg-red-700 shadow-sm shadow-red-500/10"
                : "bg-blue-600 text-white border-transparent hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 shadow-sm shadow-blue-500/10"
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            {isSubmitting ? "Đang nộp..." : "Nộp bài"}
          </button>

          <button
            onClick={onStopTimer}
            className={`w-full py-2 sm:py-2.5 rounded-xl font-bold transition-all duration-200 uppercase text-xs sm:text-sm border mt-2 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]
            ${
              isTimerPaused
                ? "bg-emerald-600 text-white border-transparent hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 shadow-sm shadow-emerald-500/10"
                : "bg-amber-600 text-white border-transparent hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 shadow-sm shadow-amber-500/10"
            }`}
          >
            {isTimerPaused ? (
              <>
                <Play className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Tiếp tục</span>
                <span className="sm:hidden">Chơi</span>
              </>
            ) : (
              <>
                <Pause className="w-3.5 h-3.5" />
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
          className="w-full py-2 rounded-xl font-bold transition-all duration-200 text-xs sm:text-sm mb-2.5 uppercase flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]
          border border-gray-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:border-red-400/40 dark:hover:border-red-500/40 hover:bg-red-50/50 dark:hover:bg-red-950/20 hover:text-red-600 dark:hover:text-red-400"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Xóa tất cả</span>
          <span className="sm:hidden">Xóa</span>
        </button>
        <button
          onClick={() => setShowFeedback(true)}
          className="w-full py-2 rounded-xl font-bold transition-all duration-200 text-xs sm:text-sm mb-3 sm:mb-4 uppercase flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]
          bg-gray-100/50 dark:bg-zinc-800/40 border border-gray-200/40 dark:border-zinc-800/45 text-zinc-750 dark:text-zinc-300 hover:bg-gray-105 dark:hover:bg-zinc-800/85"
          title="Gửi ý kiến"
        >
          <MessageCircle className="w-4 h-4" />
          <span className="hidden sm:inline">Gửi ý kiến</span>
          <span className="sm:hidden">Ý kiến</span>
        </button>
        {showFeedback && (
          <FeedbackModal onClose={() => setShowFeedback(false)} />
        )}

        <hr className="border-gray-100 dark:border-zinc-800 my-3 sm:my-4" />

        {/* 2. CHÚ THÍCH */}
        <div className="mb-3 sm:mb-4 text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 font-medium">
          <span className="font-bold text-orange-500 dark:text-orange-400">
            Chú ý:{" "}
          </span>
          <span className="hidden sm:inline">Click vào số câu hỏi để nhảy đến | Nhấn phím A/B/C/D để chọn nhanh</span>
          <span className="sm:inline">Click số để nhảy | Phím A/B/C/D chọn</span>
        </div>

        {/* 3. DANH SÁCH CÂU HỎI (PALETTE) */}
        <div className="space-y-4 sm:space-y-6 pr-1">
          {parts.map((part) => (
            <div key={part.id}>
              <h4 className="font-bold text-gray-700 dark:text-zinc-400 text-xs mb-2 sm:mb-3 uppercase tracking-wider">
                {part.name}
              </h4>
              <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                {part.groups
                  .flatMap((g: any) => g.questions)
                  .map((q: any) => {
                    const isAnswered = !!userAnswers[q.id];
                    const isCurrent = currentQuestionId === q.id;

                    return (
                      <button
                        key={q.id}
                        onClick={() => onScrollToQuestion(q.id)}
                        className={`h-7.5 w-7.5 sm:h-8.5 sm:w-8.5 text-xs font-bold rounded-lg flex items-center justify-center border transition-all hover:scale-105 active:scale-95
                      ${
                        isCurrent
                          ? "ring-2 ring-blue-500 dark:ring-blue-400 ring-offset-2 ring-offset-white dark:ring-offset-zinc-900"
                          : ""
                      }
                      ${
                        isAnswered
                          ? "bg-blue-600 dark:bg-blue-500 text-white border-transparent shadow-sm shadow-blue-500/10 font-bold"
                          : "bg-gray-100/60 dark:bg-zinc-800/40 text-zinc-700 dark:text-zinc-400 border-gray-200/60 dark:border-zinc-800/50 hover:bg-gray-200/80 dark:hover:bg-zinc-800/80"
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
