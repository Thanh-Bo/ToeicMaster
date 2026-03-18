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
    <div className="sticky top-0 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-700  overflow-y-auto custom-scrollbar max-h-screen">
      <div className="p-5">
        {/* --- KẾT QUẢ TỔNG QUAN --- */}
        <div className="text-center mb-6">
        <p className="text-gray-600 dark:text-gray-400 text-xs mb-2 font-medium uppercase tracking-wider">
          Tổng điểm
        </p>
        <div className="text-4xl font-extrabold text-blue-600 dark:text-blue-400 mb-2 font-mono">
          {totalScore}
          <span className="text-lg text-gray-500 dark:text-gray-400 font-normal">/990</span>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-[10px] font-bold mb-4">
          ({correctCount}/{totalQuestions} câu đúng)
        </p>

        {/* Progress circle */}
        <div className="relative w-24 h-24 mx-auto mb-3">
          <svg className="w-24 h-24 transform -rotate-90">
            <circle
              cx="48"
              cy="48"
              r="40"
              fill="none"
              stroke="#d1d5db"
              strokeWidth="6"
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
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-bold text-xl text-gray-900 dark:text-white">
              {percentage}%
            </span>
           
          </div>
        </div>

        {/* TIMER CARD - Option 1 */}
        <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-6 mb-4 text-center">
          <p className="text-gray-600 dark:text-gray-300 text-xs mb-3 font-semibold uppercase tracking-widest flex items-center justify-center gap-2">
            <Clock size={16} /> Thời gian làm bài
          </p>
          <div className="text-5xl font-black text-blue-600 dark:text-blue-400 font-mono mb-2">
            {formatTime(timeTaken)}
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
            Trung bình: {timePerQuestion.toFixed(1)} giây/câu
          </p>
          <div className={`text-lg font-bold flex items-center justify-center gap-2 ${speedFeedback.color}`}>
            {speedFeedback.icon} {speedFeedback.text}
          </div>
        </div>

        {/* Stats row */}
        <div className="flex justify-center gap-4 text-xs mt-4">
          <div className="text-center">
            <span className="block text-green-600 dark:text-green-400 font-bold text-lg">
              {correctCount}
            </span>
            <span className="text-gray-600 dark:text-gray-400">Đúng</span>
          </div>
          <div className="text-center">
            <span className="block text-red-500 dark:text-red-400 font-bold text-lg">
              {incorrectCount}
            </span>
            <span className="text-gray-600 dark:text-gray-400">Sai</span>
          </div>
          <div className="text-center">
            <span className="block text-gray-500 dark:text-gray-400 font-bold text-lg">
              {skippedCount}
            </span>
            <span className="text-gray-600 dark:text-gray-400">Bỏ qua</span>
          </div>
        </div>
      </div>

      <hr className="border-gray-300 dark:border-zinc-700 my-4" />

      {/* --- CHÚ THÍCH MÀU SẮC --- */}
      <div className="mb-4 text-xs text-gray-600 dark:text-gray-400 flex flex-wrap gap-3 justify-center">
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 bg-green-100 dark:bg-green-900 border border-green-500 dark:border-green-700 rounded-sm"></span>{" "}
          Đúng
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 bg-red-100 dark:bg-red-900 border border-red-500 dark:border-red-700 rounded-sm"></span>{" "}
          Sai
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 bg-gray-300 dark:bg-zinc-600 border border-gray-400 dark:border-zinc-600 rounded-sm"></span>{" "}
          Bỏ qua
        </div>
      </div>

      {/* --- DANH SÁCH CÂU HỎI THEO PART --- */}
      <div className="pr-2 space-y-6">
        {parts?.map((part) => (
          <div key={part.id}>
            {/* Tên Part */}
            <h4 className="font-bold text-gray-900 dark:text-gray-200 text-xs uppercase mb-2 sticky top-0 bg-white dark:bg-zinc-900 py-1 z-10">
              {part.partName}
            </h4>
            
            {/* Grid câu hỏi của Part đó */}
            <div className="grid grid-cols-5 gap-2">
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
                      className={`h-8 w-8 text-xs font-medium rounded flex items-center justify-center border transition-all 
                        ${isCurrent ? "ring-2 ring-blue-400 dark:ring-blue-500 ring-offset-1" : ""} 
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
      <div className="mt-6 text-center space-y-2">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center justify-center gap-1"
        >
          <ArrowUp size={14} /> Lên đầu trang
        </button>
      </div>
      </div>
    </div>
  );
}