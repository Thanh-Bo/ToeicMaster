"use client";

import { useState, useEffect } from "react";

interface Props {
  parts: any[]; // Dùng type Part của bạn
  userAnswers: Record<number, string>;
  onScrollToQuestion: (id: number) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export default function ExamRightSidebar({ 
  parts, 
  userAnswers, 
  onScrollToQuestion, 
  onSubmit,
  isSubmitting 
}: Props) {
  // --- TIMER LOGIC (Giả lập 2 tiếng = 7200 giây) ---
  const [timeLeft, setTimeLeft] = useState(7200); 

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format giây thành MM:SS
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sticky top-24">
      {/* 1. ĐỒNG HỒ & NỘP BÀI */}
      <div className="text-center mb-6">
        <p className="text-gray-500 text-sm mb-1 font-medium">Thời gian còn lại:</p>
        <div className="text-3xl font-bold text-gray-800 mb-4 tracking-wider">
          {formatTime(timeLeft)}
        </div>
        
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="w-full bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white py-2 rounded-lg font-bold transition-all uppercase text-sm"
        >
          {isSubmitting ? "Đang nộp..." : "Nộp bài"}
        </button>
      </div>

      <hr className="border-gray-100 my-4" />

      {/* 2. CHÚ THÍCH */}
      <div className="mb-4 text-xs text-gray-500">
        <span className="font-bold text-orange-500">Chú ý: </span>
        Bạn có thể click vào số thứ tự câu hỏi để chuyển đến câu hỏi đó.
      </div>

      {/* 3. DANH SÁCH CÂU HỎI (PALETTE) */}
      <div className="space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
        {parts.map((part) => (
          <div key={part.id}>
            <h4 className="font-bold text-gray-700 text-sm mb-3">{part.name}</h4>
            <div className="grid grid-cols-5 gap-2">
              {part.groups.flatMap((g: any) => g.questions).map((q: any) => {
                const isAnswered = !!userAnswers[q.id];
                
                return (
                  <button
                    key={q.id}
                    onClick={() => onScrollToQuestion(q.id)}
                    className={`h-8 w-8 text-xs font-bold rounded flex items-center justify-center border transition-all
                      ${isAnswered 
                        ? "bg-blue-600 text-white border-blue-600" 
                        : "bg-white text-gray-600 border-gray-300 hover:border-blue-400 hover:text-blue-500"
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