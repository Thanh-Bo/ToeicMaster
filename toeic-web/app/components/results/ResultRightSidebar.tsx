"use client";

import { useMemo } from "react";
import { Clock, Zap, ArrowUp } from "lucide-react";

interface Props {
  parts: any[]; // Cấu trúc đề thi (để lấy tên Part và danh sách ID câu hỏi)
  timeTaken : number; 
  questions: any[]; // Kết quả làm bài (chứa isCorrect, userSelected...)
  totalScore: number;
  totalQuestions: number;
  onScrollToQuestion: (id: number) => void;
  currentQuestionId?: number | null;
}

export default function ResultRightSidebar({
  parts,
  timeTaken,
  questions,
  totalScore,
  totalQuestions,
  onScrollToQuestion,
  currentQuestionId,
}: Props) {
  // 1. Tính toán thống kê
  const correctCount = questions.filter((q) => q.isCorrect).length;
  const incorrectCount = questions.filter(
    (q) => q.userSelected && !q.isCorrect
  ).length;
  const skippedCount = questions.filter((q) => !q.userSelected).length;
  const percentage =
    totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  // 2. Tính thời gian đã làm
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`
  };

  // Calculate speed feedback (seconds per question)
  const timePerQuestion = totalQuestions > 0 ? timeTaken / totalQuestions : 0;
  const getSpeedFeedback = (timePerQ: number) => {
    if (timePerQ < 2.5) return { text: "Rất nhanh!", icon: <Zap size={18} />, color: "text-green-600 dark:text-green-400" };
    if (timePerQ < 4) return { text: "Bình thường", icon: <Clock size={18} />, color: "text-amber-600 dark:text-amber-400" };
    return { text: "Chậm", icon: <Clock size={18} />, color: "text-orange-600 dark:text-orange-400" };
  };

  const speedFeedback = getSpeedFeedback(timePerQuestion);

  // 3. Tạo Map để tra cứu kết quả nhanh hơn (O(1)) khi render theo Part
  // Key: QuestionId, Value: Result Object
  const questionResultsMap = useMemo(() => {
    const map: Record<number, any> = {};
    questions.forEach((q) => {
      map[q.questionId] = q;
    });
    return map;
  }, [questions]);

  return (
    <div className="sticky top-20 bg-white dark:bg-zinc-900 rounded-lg xs:rounded-xl sm:rounded-xl shadow-sm border border-gray-200 dark:border-zinc-700 overflow-y-auto custom-scrollbar max-h-[calc(100vh-5rem)]">
      <div className="p-2.5 xs:p-3 sm:p-5">
        {/* --- KẾT QUẢ TỔNG QUAN --- */}
        <div className="text-center mb-3 xs:mb-4 sm:mb-6">
        <p className="text-gray-600 dark:text-gray-400 text-[9px] xs:text-[10px] sm:text-xs mb-0.5 xs:mb-1 sm:mb-2 font-medium uppercase tracking-wider">
          Tổng điểm
        </p>
        <div className="text-xl xs:text-2xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-1 xs:mb-1 sm:mb-2 font-mono">
          {totalScore}
          <span className="text-sm xs:text-base sm:text-lg text-gray-400 dark:text-gray-500 font-normal">/990</span>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-[9px] xs:text-[10px] sm:text-[10px] font-bold mb-1.5 xs:mb-2 sm:mb-4">
          ({correctCount}/{totalQuestions} câu đúng)
        </p>

        {/* Progress circle */}
        <div className="relative w-14 xs:w-16 sm:w-24 h-14 xs:h-16 sm:h-24 mx-auto mb-1.5 xs:mb-2 sm:mb-3">
          <svg className="w-14 xs:w-16 sm:w-24 h-14 xs:h-16 sm:h-24 transform -rotate-90">
            <circle
              cx="28"
              cy="28"
              r="24"
              fill="none"
              stroke="#d1d5db"
              strokeWidth="3"
              className="xs:hidden"
            />
            <circle
              cx="28"
              cy="28"
              r="24"
              fill="none"
              stroke="#22c55e"
              strokeWidth="3"
              strokeDasharray={`${2 * Math.PI * 24}`}
              strokeDashoffset={`${
                2 * Math.PI * 24 * (1 - percentage / 100)
              }`}
              strokeLinecap="round"
              className="xs:hidden"
            />
            <circle
              cx="32"
              cy="32"
              r="28"
              fill="none"
              stroke="#d1d5db"
              strokeWidth="4"
              className="hidden xs:block sm:hidden"
            />
            <circle
              cx="32"
              cy="32"
              r="28"
              fill="none"
              stroke="#22c55e"
              strokeWidth="4"
              strokeDasharray={`${2 * Math.PI * 28}`}
              strokeDashoffset={`${
                2 * Math.PI * 28 * (1 - percentage / 100)
              }`}
              strokeLinecap="round"
              className="hidden xs:block sm:hidden"
            />
            <circle
              cx="48"
              cy="48"
              r="40"
              fill="none"
              stroke="#d1d5db"
              strokeWidth="6"
              className="hidden sm:block"
            />
            <circle
              cx="48"
              cy="48"
              r="40"
              fill="none"
              stroke="#22c55e"
              strokeWidth="6"
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={`${
                2 * Math.PI * 40 * (1 - percentage / 100)
              }`}
              strokeLinecap="round"
              className="hidden sm:block"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-bold text-sm xs:text-base sm:text-xl text-gray-900 dark:text-white">
              {percentage}%
            </span>
          </div>
        </div>

        {/* TIMER CARD - Option 1 */}
        <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md xs:rounded-lg sm:rounded-xl p-2.5 xs:p-3 sm:p-6 mb-1.5 xs:mb-2 sm:mb-4 text-center">
          <p className="text-gray-600 dark:text-gray-300 text-[9px] xs:text-[10px] sm:text-xs mb-1.5 xs:mb-2 sm:mb-3 font-semibold uppercase tracking-widest flex items-center justify-center gap-0.5 xs:gap-1 sm:gap-2">
            <Clock size={12} className="xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4" /> <span className="hidden xs:inline">Thời gian làm bài</span>
          </p>
          <div className="text-2xl xs:text-3xl sm:text-5xl font-black text-gray-900 dark:text-white font-mono mb-1 xs:mb-1 sm:mb-2">
            {formatTime(timeTaken)}
          </div>
          <p className="text-[9px] xs:text-xs sm:text-xs text-gray-500 dark:text-gray-400">
            <span className="hidden xs:inline">Trung bình: </span>{timePerQuestion.toFixed(1)} giây/câu
          </p>
        </div>

        {/* Stats row */}
        <div className="flex justify-center gap-1.5 xs:gap-2 sm:gap-4 text-xs mt-1.5 xs:mt-2 sm:mt-4">
          <div className="text-center">
            <span className="block text-green-600 dark:text-green-400 font-bold text-sm xs:text-base sm:text-lg">
              {correctCount}
            </span>
            <span className="text-gray-600 dark:text-gray-400 text-[9px] xs:text-xs">Đúng</span>
          </div>
          <div className="text-center">
            <span className="block text-red-500 dark:text-red-400 font-bold text-sm xs:text-base sm:text-lg">
              {incorrectCount}
            </span>
            <span className="text-gray-600 dark:text-gray-400 text-[9px] xs:text-xs">Sai</span>
          </div>
          <div className="text-center">
            <span className="block text-gray-500 dark:text-gray-400 font-bold text-sm xs:text-base sm:text-lg">
              {skippedCount}
            </span>
            <span className="text-gray-600 dark:text-gray-400 text-[9px] xs:text-xs">Bỏ qua</span>
          </div>
        </div>
      </div>

      <hr className="border-gray-300 dark:border-zinc-700 my-2 xs:my-2.5 sm:my-4" />

      {/* --- CHÚ THÍCH MÀU SẮC --- */}
      <div className="mb-2 xs:mb-3 sm:mb-4 text-[9px] xs:text-xs sm:text-xs text-gray-600 dark:text-gray-400 flex flex-wrap gap-1.5 xs:gap-2 sm:gap-3 justify-center">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3 bg-green-100 dark:bg-green-900 border border-green-500 dark:border-green-700 rounded-sm"></span>
          <span className="hidden xs:inline">Đúng</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3 bg-red-100 dark:bg-red-900 border border-red-500 dark:border-red-700 rounded-sm"></span>
          <span className="hidden xs:inline">Sai</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3 bg-gray-300 dark:bg-zinc-600 border border-gray-400 dark:border-zinc-600 rounded-sm"></span>
          <span className="hidden xs:inline">Bỏ qua</span>
        </div>
      </div>

      {/* --- DANH SÁCH CÂU HỎI THEO PART --- */}
      <div className="pr-1 xs:pr-1 sm:pr-2 space-y-2.5 xs:space-y-3 sm:space-y-6">
        {parts?.map((part) => (
          <div key={part.id}>
            {/* Tên Part */}
            <h4 className="font-bold text-gray-900 dark:text-gray-200 text-[10px] xs:text-xs sm:text-xs uppercase mb-1.5 xs:mb-1.5 sm:mb-2 sticky top-0 bg-white dark:bg-zinc-900 py-0.5 xs:py-0.5 sm:py-1 z-10">
              {part.partName}
            </h4>
            
            {/* Grid câu hỏi của Part đó */}
            <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 gap-1 xs:gap-1.5 sm:gap-2">
              {part.groups
                .flatMap((g: any) => g.questions)
                .map((rawQ: any) => {
                  // Lấy kết quả từ Map đã tạo ở trên
                  const resultQ = questionResultsMap[rawQ.questionId];
                  
                  // Mặc định là màu xám (nếu không tìm thấy kết quả - trường hợp lỗi)
                  let colorClass = "bg-gray-300 dark:bg-zinc-600 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-zinc-600";

                  if (resultQ) {
                    if (resultQ.userSelected) {
                      if (resultQ.isCorrect) {
                        colorClass =
                          "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-green-400 dark:border-green-700 hover:bg-green-200 dark:hover:bg-green-800";
                      } else {
                        colorClass =
                          "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 border-red-300 dark:border-red-700 hover:bg-red-200 dark:hover:bg-red-800";
                      }
                    } else {
                        // Bỏ qua (giữ nguyên màu xám)
                         colorClass = "bg-gray-300 dark:bg-zinc-600 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-zinc-600 hover:bg-gray-400 dark:hover:bg-zinc-500";
                    }
                  }

                  const isCurrent = currentQuestionId === rawQ.questionId;

                  return (
                    <button
                      key={rawQ.questionId}
                      onClick={() => onScrollToQuestion(rawQ.questionId)}
                      className={`h-7 xs:h-8 sm:h-8 w-7 xs:w-8 sm:w-8 text-[10px] xs:text-xs sm:text-xs font-medium rounded flex items-center justify-center border transition-all 
                        ${isCurrent ? "ring-2 ring-gray-400 dark:ring-zinc-400 ring-offset-1" : ""} 
                        ${colorClass}`}
                    >
                      {rawQ.questionNo}
                    </button>
                  );
                })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-4 xs:mt-5 sm:mt-6 text-center space-y-1.5 xs:space-y-1.5 sm:space-y-2">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="text-[9px] xs:text-xs sm:text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center justify-center gap-1 transition"
        >
          <ArrowUp size={12} className="xs:w-3.5 xs:h-3.5 sm:w-3.5 sm:h-3.5" /> <span className="hidden xs:inline">Lên đầu trang</span>
        </button>
      </div>
      </div>
    </div>
  );
}