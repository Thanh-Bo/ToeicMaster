"use client";

import { Send, Trash2, Pause, Play, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Props {
  parts: any[];
  userAnswers: Record<number, string>;
  flaggedQuestions?: Set<number>;
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
  flaggedQuestions = new Set<number>(),
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
  const [showLowTimeAlert, setShowLowTimeAlert] = useState(true);
  const lowTimeTimerRef = useRef<number | null>(null);
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

  // Show the warning again when time goes back above the threshold (new exam / reset)
  useEffect(() => {
    if (!isLowTime) setShowLowTimeAlert(true);
  }, [isLowTime]);

  // Clean up the re-show timer on unmount
  useEffect(() => {
    return () => {
      if (lowTimeTimerRef.current) window.clearTimeout(lowTimeTimerRef.current);
    };
  }, []);

  // Dismiss is temporary: the banner comes back after 60s while time is still low
  const handleDismissLowTime = () => {
    setShowLowTimeAlert(false);
    if (lowTimeTimerRef.current) window.clearTimeout(lowTimeTimerRef.current);
    lowTimeTimerRef.current = window.setTimeout(
      () => setShowLowTimeAlert(true),
      60_000,
    );
  };

  return (
    <div className="sticky top-20 dark:text-zinc-200 text-zinc-700 bg-white/80 dark:bg-zinc-900/60 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200/50 dark:border-zinc-800/45 overflow-y-auto max-h-[calc(100vh-5.5rem)] custom-scrollbar">
      <div className="p-4 sm:p-5">
        {/* 1. ĐỒNG HỒ */}
        <div className="text-center mb-3 sm:mb-4">
          <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">
            {isUnlimited ? "Thời gian làm bài:" : "Thời gian còn lại:"}
          </div>

          <div
            className={`text-2xl sm:text-3xl font-black mt-1 tracking-wider transition-colors
          ${
            isLowTime
              ? "text-red-600 dark:text-red-400 animate-pulse"
              : "text-gray-800 dark:text-white"
          }`}
          >
            {formatTime(timeLeft)}
          </div>

          {isLowTime && showLowTimeAlert && (
            <div className="relative bg-red-100 dark:bg-red-950/40 border border-red-200/40 dark:border-red-900/50 text-red-700 dark:text-red-400 text-xs p-2.5 pr-8 rounded-xl mt-3 font-semibold">
              Sắp hết giờ! Hãy nộp bài ngay.
              <button
                type="button"
                onClick={handleDismissLowTime}
                title="Ẩn cảnh báo (sẽ hiện lại sau 60 giây)"
                aria-label="Ẩn cảnh báo"
                className="absolute right-1.5 top-1.5 rounded p-1 text-red-600 hover:bg-red-200/60 dark:text-red-400 dark:hover:bg-red-900/40 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* 2. ACTIONS - 3 buttons in one row */}
        <div className="grid grid-cols-3 gap-2 mb-3 sm:mb-4">
          <button
            onClick={onSubmit}
            disabled={isSubmitting}
            title={isSubmitting ? "Đang nộp..." : "Nộp bài"}
            aria-label={isSubmitting ? "Đang nộp..." : "Nộp bài"}
            className={`w-full py-2.5 rounded-xl font-bold transition-all duration-200 uppercase text-xs sm:text-sm border flex items-center justify-center gap-2 shadow-xs hover:scale-[1.01] active:scale-[0.99]
            ${
              isLowTime
                ? "bg-red-600 text-white border-transparent hover:bg-red-700 shadow-sm shadow-red-500/10"
                : "bg-blue-600 text-white border-transparent hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 shadow-sm shadow-blue-500/10"
            }`}
          >
            <Send className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onStopTimer}
            title={isTimerPaused ? "Tiếp tục" : "Tạm dừng"}
            aria-label={isTimerPaused ? "Tiếp tục" : "Tạm dừng"}
            className={`w-full py-2.5 rounded-xl font-bold transition-all duration-200 uppercase text-xs sm:text-sm border flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]
            ${
              isTimerPaused
                ? "bg-emerald-600 text-white border-transparent hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 shadow-sm shadow-emerald-500/10"
                : "bg-amber-600 text-white border-transparent hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 shadow-sm shadow-amber-500/10"
            }`}
          >
            {isTimerPaused ? (
              <Play className="w-3.5 h-3.5" />
            ) : (
              <Pause className="w-3.5 h-3.5" />
            )}
          </button>

          <button
            onClick={() => {
              if (confirm("Bạn có chắc chắn muốn xóa tất cả đáp án đã chọn?")) {
                onClearAll();
              }
            }}
            className="w-full py-2.5 rounded-xl font-bold transition-all duration-200 text-xs sm:text-sm uppercase flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]
            border border-gray-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:border-red-400/40 dark:hover:border-red-500/40 hover:bg-red-50/50 dark:hover:bg-red-950/20 hover:text-red-600 dark:hover:text-red-400"
            title="Xóa tất cả"
            aria-label="Xóa tất cả"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        <hr className="border-gray-100 dark:border-zinc-800 my-3 sm:my-4" />

        {/* 3. CHÚ THÍCH MÀU */}
        <div className="mb-3 sm:mb-4 flex flex-nowrap items-center justify-between gap-1 text-[10px] sm:text-xs font-semibold text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1 whitespace-nowrap">
            <span className="w-2.5 h-2.5 rounded shrink-0 bg-blue-600 dark:bg-blue-500" />
            Đã làm
          </span>
          <span className="flex items-center gap-1 whitespace-nowrap">
            <span className="w-2.5 h-2.5 rounded shrink-0 bg-emerald-600 dark:bg-emerald-500" />
            Làm sau
          </span>
          <span className="flex items-center gap-1 whitespace-nowrap">
            <span className="w-2.5 h-2.5 rounded shrink-0 bg-white border border-gray-300 dark:bg-zinc-800 dark:border-zinc-700" />
            Chưa làm
          </span>
        </div>

        {/* 4. DANH SÁCH CÂU HỎI (PALETTE) */}
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
                    const isFlagged = flaggedQuestions.has(q.id);
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
                        isFlagged
                          ? "bg-emerald-600 dark:bg-emerald-500 text-white border-transparent shadow-sm shadow-emerald-500/10 font-bold"
                          : isAnswered
                          ? "bg-blue-600 dark:bg-blue-500 text-white border-transparent shadow-sm shadow-blue-500/10 font-bold"
                          : "bg-white dark:bg-zinc-800/40 text-zinc-700 dark:text-zinc-400 border-gray-200/60 dark:border-zinc-800/50 hover:bg-gray-100 dark:hover:bg-zinc-800/80"
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
