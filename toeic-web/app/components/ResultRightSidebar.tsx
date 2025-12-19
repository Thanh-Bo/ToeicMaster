"use client";

interface Props {
  questions: any[];
  totalScore: number;
  totalQuestions: number;
  onScrollToQuestion: (id: number) => void;
  currentQuestionId?: number | null; // Thêm prop mới
}

export default function ResultRightSidebar({ 
  questions, 
  totalScore, 
  totalQuestions,
  onScrollToQuestion,
  currentQuestionId
}: Props) {
  
  // Tính toán thống kê
  const correctCount = questions.filter(q => q.isCorrect).length;
  const incorrectCount = questions.filter(q => q.userSelected && !q.isCorrect).length;
  const skippedCount = questions.filter(q => !q.userSelected).length;
  const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sticky top-24">
      {/* 1. KẾT QUẢ TỔNG QUAN */}
      <div className="text-center mb-6">
        <p className="text-gray-500 text-xs mb-2 font-medium uppercase tracking-wider">Tổng điểm</p>
        <div className="text-4xl font-extrabold text-blue-600 mb-2 font-mono">
          {totalScore}<span className="text-lg text-gray-400 font-normal">/{totalQuestions}</span>
        </div>
        
        {/* Progress circle */}
        <div className="relative w-20 h-20 mx-auto mb-3">
          <svg className="w-20 h-20 transform -rotate-90">
            <circle cx="40" cy="40" r="35" fill="none" stroke="#e5e7eb" strokeWidth="6" />
            <circle cx="40" cy="40" r="35" fill="none" stroke="#22c55e" strokeWidth="6"
              strokeDasharray={`${2 * Math.PI * 35}`}
              strokeDashoffset={`${2 * Math.PI * 35 * (1 - percentage / 100)}`}
              strokeLinecap="round" />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center font-bold text-lg text-gray-800">
            {percentage}%
          </span>
        </div>
        
        {/* Stats row */}
        <div className="flex justify-center gap-4 text-xs">
          <div className="text-center">
            <span className="block text-green-600 font-bold text-lg">{correctCount}</span>
            <span className="text-gray-500">Đúng</span>
          </div>
          <div className="text-center">
            <span className="block text-red-500 font-bold text-lg">{incorrectCount}</span>
            <span className="text-gray-500">Sai</span>
          </div>
          <div className="text-center">
            <span className="block text-gray-400 font-bold text-lg">{skippedCount}</span>
            <span className="text-gray-500">Bỏ qua</span>
          </div>
        </div>
      </div>

      <hr className="border-gray-100 my-4" />

      {/* 2. CHÚ THÍCH MÀU SẮC */}
      <div className="mb-4 text-xs text-gray-500 flex flex-wrap gap-3 justify-center">
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 bg-green-100 border border-green-500 rounded-sm"></span> Đúng
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 bg-red-50 border border-red-500 rounded-sm"></span> Sai
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 bg-gray-100 border border-gray-300 rounded-sm"></span> Bỏ qua
        </div>
      </div>

      {/* 3. LƯỚI CÂU HỎI (QUESTION PALETTE) */}
      <div className="max-h-[50vh] overflow-y-auto custom-scrollbar pr-1">
        <div className="grid grid-cols-5 gap-2">
          {questions.map((q) => {
            let colorClass = "bg-gray-50 text-gray-400 border-gray-200";
            
            if (q.userSelected) {
              if (q.isCorrect) {
                colorClass = "bg-green-100 text-green-700 border-green-400 hover:bg-green-200";
              } else {
                colorClass = "bg-red-50 text-red-600 border-red-300 hover:bg-red-100";
              }
            }

            const isCurrent = currentQuestionId === q.questionId;

            return (
              <button
                key={q.questionId}
                onClick={() => onScrollToQuestion(q.questionId)}
                className={`h-8 w-8 text-xs font-bold rounded flex items-center justify-center border transition-all 
                  ${isCurrent ? 'ring-2 ring-blue-400 ring-offset-1' : ''} ${colorClass}`}
              >
                {q.questionNo}
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Footer */}
      <div className="mt-6 text-center space-y-2">
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="text-xs text-blue-500 hover:underline"
        >
          ↑ Về đầu trang
        </button>
      </div>
    </div>
  );
}