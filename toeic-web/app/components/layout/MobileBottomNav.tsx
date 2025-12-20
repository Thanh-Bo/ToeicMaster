"use client";

import Link from "next/link";

interface Props {
  /** Hiển thị nav */
  isOpen: boolean;
  /** Toggle nav */
  onToggle: () => void;
  /** Số câu đã làm */
  answeredCount: number;
  /** Tổng số câu */
  totalQuestions: number;
  /** Thời gian còn lại (giây) - cho exam mode */
  timeLeft?: number;
  /** Callback nộp bài */
  onSubmit?: () => void;
  /** Đang nộp bài */
  isSubmitting?: boolean;
  /** Nội dung bên trong (Question Palette) */
  children?: React.ReactNode;
  /** Mode: exam hoặc result */
  mode?: "exam" | "result";
  /** Stats cho result mode */
  stats?: {
    correctCount?: number;
    incorrectCount?: number;
  };
}

export default function MobileBottomNav({
  isOpen,
  onToggle,
  answeredCount,
  totalQuestions,
  timeLeft,
  onSubmit,
  isSubmitting,
  children,
  mode = "exam",
  stats,
}: Props) {
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    }
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      {/* Main bar */}
      <div className="flex items-center justify-between px-4 py-3">
        {/* Toggle button */}
        <button onClick={onToggle} className="flex items-center gap-2 text-gray-600">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span className="font-medium">{answeredCount}/{totalQuestions}</span>
        </button>

        {/* Center content */}
        {mode === "exam" && timeLeft !== undefined && (
          <div className={`font-bold ${timeLeft <= 300 ? "text-red-600" : "text-gray-800"}`}>
            ⏱️ {formatTime(timeLeft)}
          </div>
        )}

        {mode === "result" && stats && (
          <div className="flex items-center gap-2">
            <span className="text-green-600 font-bold text-sm">✓{stats.correctCount}</span>
            <span className="text-red-500 font-bold text-sm">✗{stats.incorrectCount}</span>
          </div>
        )}

        {/* Right action */}
        {mode === "exam" && onSubmit && (
          <button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm"
          >
            Nộp bài
          </button>
        )}

        {mode === "result" && (
          <Link href="/" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm">
            Trang chủ
          </Link>
        )}
      </div>

      {/* Expandable content */}
      {isOpen && (
        <div className="border-t border-gray-100 p-4 max-h-[50vh] overflow-y-auto bg-gray-50">
          {children}
        </div>
      )}
    </div>
  );
}
