"use client";

import { useMemo } from "react";
import { Clock, Zap, ArrowUp } from "lucide-react";

interface Props {
  parts: any[]; // Cấu trúc đề thi (để lấy tên Part và danh sách ID câu hỏi)
  timeTaken : number; 
  questions: any[]; // Kết quả làm bài (chứa isCorrect, userSelected...)
  totalScore: number;
  totalQuestions: number;
  isFullTest?: boolean;
  onScrollToQuestion: (id: number) => void;
  currentQuestionId?: number | null;
}

export default function ResultRightSidebar({
  parts,
  timeTaken,
  questions,
  totalScore,
  totalQuestions,
  isFullTest = true,
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
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // Calculate speed feedback (seconds per question)
  const timePerQuestion = totalQuestions > 0 ? timeTaken / totalQuestions : 0;
  const getSpeedFeedback = (timePerQ: number) => {
    if (timePerQ < 2.5) return { text: "Rất nhanh!", icon: <Zap size={14} className="fill-current" />, color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10" };
    if (timePerQ < 4) return { text: "Bình thường", icon: <Clock size={14} />, color: "text-blue-600 dark:text-blue-400 bg-blue-500/10" };
    return { text: "Cần cải thiện", icon: <Clock size={14} />, color: "text-amber-600 dark:text-amber-400 bg-amber-500/10" };
  };

  const speedFeedback = getSpeedFeedback(timePerQuestion);

  // 3. Tạo Map để tra cứu kết quả nhanh hơn (O(1)) khi render theo Part
  const questionResultsMap = useMemo(() => {
    const map: Record<number, any> = {};
    questions.forEach((q) => {
      map[q.questionId] = q;
    });
    return map;
  }, [questions]);

  return (
    <div className="bg-white/80 dark:bg-zinc-900/60 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200/50 dark:border-zinc-800/80 overflow-y-auto custom-scrollbar max-h-[calc(100vh-6rem)] transition-colors duration-300">
      <div className="p-4 sm:p-6">
        {/* --- KẾT QUẢ TỔNG QUAN --- */}
        <div className="text-center mb-6">
          <p className="text-zinc-500 dark:text-zinc-500 text-[10px] sm:text-xs font-black uppercase tracking-wider mb-1">
            {isFullTest ? "Tổng điểm" : "Câu đúng"}
          </p>
          <div className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white mb-1 font-mono tracking-tight">
            {isFullTest ? totalScore : correctCount}
            <span className="text-base sm:text-lg text-zinc-400 dark:text-zinc-500 font-normal">
              /{isFullTest ? 990 : totalQuestions}
            </span>
          </div>
          <p className="text-zinc-500 dark:text-zinc-400 text-xs font-bold mb-4">
            ({correctCount}/{totalQuestions} câu đúng)
          </p>

          {/* Progress circle */}
          <div className="relative w-20 sm:w-24 h-20 sm:h-24 mx-auto mb-4">
            <svg className="w-20 sm:w-24 h-20 sm:h-24 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="currentColor"
                className="text-zinc-100 dark:text-zinc-800"
                strokeWidth="6"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="currentColor"
                className="text-emerald-500 dark:text-emerald-400"
                strokeWidth="6"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${
                  2 * Math.PI * 40 * (1 - percentage / 100)
                }`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-extrabold text-base sm:text-xl text-zinc-900 dark:text-white font-mono">
                {percentage}%
              </span>
            </div>
          </div>

          {/* TIMER CARD */}
          <div className="bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-200/40 dark:border-zinc-800/60 rounded-2xl p-4 sm:p-5 mb-4 text-center">
            <p className="text-zinc-500 dark:text-zinc-450 text-[10px] sm:text-xs mb-2 font-bold uppercase tracking-wider flex items-center justify-center gap-1.5">
              <Clock size={14} className="text-zinc-400 dark:text-zinc-500" /> 
              <span>Thời gian làm bài</span>
            </p>
            <div className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white font-mono mb-1.5">
              {formatTime(timeTaken)}
            </div>
            
            {/* Speed feedback badge */}
            <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${speedFeedback.color} mt-1`}>
              {speedFeedback.icon}
              <span>{speedFeedback.text}</span>
            </div>
            <p className="text-[10px] sm:text-xs text-zinc-400 dark:text-zinc-500 mt-2 font-medium">
              Trung bình: <span className="font-bold text-zinc-700 dark:text-zinc-300">{timePerQuestion.toFixed(1)}s</span> / câu
            </p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2 text-xs border border-zinc-250/20 dark:border-zinc-800/45 rounded-xl p-3 bg-zinc-50/20 dark:bg-zinc-950/10">
            <div className="text-center border-r border-zinc-200/50 dark:border-zinc-800/40 last:border-r-0">
              <span className="block text-emerald-600 dark:text-emerald-400 font-black text-sm sm:text-base font-mono">
                {correctCount}
              </span>
              <span className="text-zinc-500 dark:text-zinc-500 text-[10px] font-bold">Đúng</span>
            </div>
            <div className="text-center border-r border-zinc-200/50 dark:border-zinc-800/40 last:border-r-0">
              <span className="block text-rose-500 dark:text-rose-450 font-black text-sm sm:text-base font-mono">
                {incorrectCount}
              </span>
              <span className="text-zinc-500 dark:text-zinc-500 text-[10px] font-bold">Sai</span>
            </div>
            <div className="text-center last:border-r-0">
              <span className="block text-zinc-500 dark:text-zinc-400 font-black text-sm sm:text-base font-mono">
                {skippedCount}
              </span>
              <span className="text-zinc-500 dark:text-zinc-500 text-[10px] font-bold">Bỏ qua</span>
            </div>
          </div>
        </div>

        <hr className="border-zinc-200/60 dark:border-zinc-800/60 my-4" />

        {/* --- CHÚ THÍCH MÀU SẮC --- */}
        <div className="mb-4 text-[10px] sm:text-xs text-zinc-500 dark:text-zinc-400 flex flex-wrap gap-2.5 justify-center font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-md"></span>
            <span>Đúng</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-rose-500/10 border border-rose-500/30 rounded-md"></span>
            <span>Sai</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-md"></span>
            <span>Bỏ qua</span>
          </div>
        </div>

        {/* --- DANH SÁCH CÂU HỎI THEO PART --- */}
        <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-1 custom-scrollbar">
          {parts?.map((part) => (
            <div key={part.id} className="bg-zinc-50/30 dark:bg-zinc-950/5 border border-zinc-150/30 dark:border-zinc-900/30 rounded-xl p-3">
              {/* Tên Part */}
              <h4 className="font-extrabold text-zinc-800 dark:text-zinc-300 text-xs uppercase mb-2 tracking-wide">
                {part.partName}
              </h4>
              
              {/* Grid câu hỏi của Part đó */}
              <div className="grid grid-cols-5 gap-1.5">
                {part.groups
                  .flatMap((g: any) => g.questions)
                  .map((rawQ: any) => {
                    const resultQ = questionResultsMap[rawQ.questionId];
                    
                    let colorClass = "bg-zinc-100 dark:bg-zinc-800 text-zinc-650 dark:text-zinc-300 border-zinc-200/50 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700";

                    if (resultQ) {
                      if (resultQ.userSelected) {
                        if (resultQ.isCorrect) {
                          colorClass =
                            "bg-emerald-500/10 dark:bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20";
                        } else {
                          colorClass =
                            "bg-rose-500/10 dark:bg-rose-500/5 text-rose-600 dark:text-rose-450 border-rose-500/30 hover:bg-rose-500/20";
                        }
                      } else {
                        colorClass = "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 border-zinc-200/50 dark:border-zinc-750 hover:bg-zinc-200 dark:hover:bg-zinc-700";
                      }
                    }

                    const isCurrent = currentQuestionId === rawQ.questionId;

                    return (
                      <button
                        key={rawQ.questionId}
                        onClick={() => onScrollToQuestion(rawQ.questionId)}
                        className={`h-8 w-8 text-xs font-black rounded-lg flex items-center justify-center border transition-all duration-200 
                          ${isCurrent ? "ring-4 ring-blue-500/20 border-blue-500 text-blue-600 dark:text-blue-400" : ""} 
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
        <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/40 text-center">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="w-full py-2 text-xs font-bold text-zinc-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center justify-center gap-1.5 hover:bg-zinc-100/50 dark:hover:bg-zinc-850 rounded-lg transition-all duration-200"
          >
            <ArrowUp size={14} /> 
            <span>Lên đầu trang</span>
          </button>
        </div>
      </div>
    </div>
  );
}