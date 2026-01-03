"use client";

interface Props {
  parts: any[];
  userAnswers: Record<number, string>;
  onScrollToQuestion: (id: number) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  timeLeft: number; // Nhận từ parent
  currentQuestionId: number | null; // Để highlight câu đang xem
  durationParam?: string | null;
}

export default function ExamRightSidebar({
  parts,
  userAnswers,
  onScrollToQuestion,
  onSubmit,
  isSubmitting,
  timeLeft,
  currentQuestionId,
  durationParam,
}: Props) {
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
    <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-700 p-5 sticky top-24">
      {/* 1. ĐỒNG HỒ & NỘP BÀI */}
      <div className="text-center mb-6">
        {isUnlimited ? "Thời gian làm bài:" : "Thời gian còn lại:"}

        <div
          className={`text-3xl font-bold mb-4 tracking-wider transition-colors
          ${isLowTime ? "text-red-600 dark:text-red-400 animate-pulse" : "text-gray-800 dark:text-white"}`}
        >
          {/* 👇 HIỂN THỊ ICON KHÁC NHAU 👇 */}
          {isUnlimited }
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
          className={`w-full py-2.5 rounded-lg font-bold transition-all uppercase text-sm
            ${
              isLowTime
                ? "bg-red-600 dark:bg-red-700 text-white hover:bg-red-700 dark:hover:bg-red-800"
                : "bg-transparent border-2 border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white"
            }`}
        >
          {isSubmitting ? "Đang nộp..." : "Nộp bài"}
        </button>
      </div>

      <hr className="border-gray-100 dark:border-zinc-700 my-4" />

      {/* 2. CHÚ THÍCH */}
      <div className="mb-4 text-xs text-gray-500 dark:text-gray-400">
        <span className="font-bold text-orange-500 dark:text-orange-400">Chú ý: </span>
        Click vào số câu hỏi để nhảy đến | Nhấn phím A/B/C/D để chọn nhanh
      </div>

      {/* 3. DANH SÁCH CÂU HỎI (PALETTE) */}
      <div className="space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
        {parts.map((part) => (
          <div key={part.id}>
            <h4 className="font-bold text-gray-700 dark:text-gray-300 text-sm mb-3">
              {part.name}
            </h4>
            <div className="grid grid-cols-5 gap-2">
              {part.groups
                .flatMap((g: any) => g.questions)
                .map((q: any) => {
                  const isAnswered = !!userAnswers[q.id];
                  const isCurrent = currentQuestionId === q.id;

                  return (
                    <button
                      key={q.id}
                      onClick={() => onScrollToQuestion(q.id)}
                      className={`h-8 w-8 text-xs font-medium rounded flex items-center justify-center border-2 transition-all
                      ${isCurrent ? "ring-2 ring-blue-400 dark:ring-blue-500 ring-offset-1 dark:ring-offset-zinc-900" : ""}
                      ${
                        isAnswered
                          ? "bg-blue-600 text-white border-blue-600 font-medium"
                          : "bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-zinc-600 hover:bg-gray-300 dark:hover:bg-zinc-600"
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
  );
}
