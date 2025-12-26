"use client";

interface Props {
  parts: any[];
  userAnswers: Record<number, string>;
  onScrollToQuestion: (id: number) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  timeLeft: number;              // Nhận từ parent
  currentQuestionId: number | null; // Để highlight câu đang xem
}

export default function ExamRightSidebar({ 
  parts, 
  userAnswers, 
  onScrollToQuestion, 
  onSubmit,
  isSubmitting,
  timeLeft,
  currentQuestionId 
  
}: Props) {
  // Format giây thành HH:MM:SS hoặc MM:SS
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    }
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const isLowTime = timeLeft <= 300; // Dưới 5 phút

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sticky top-24">
      {/* 1. ĐỒNG HỒ & NỘP BÀI */}
      <div className="text-center mb-6">
        <p className="text-gray-500 text-sm mb-1 font-medium">Thời gian còn lại:</p>
        <div className={`text-3xl font-bold mb-4 tracking-wider transition-colors
          ${isLowTime ? 'text-red-600 animate-pulse' : 'text-gray-800'}`}>
          {formatTime(timeLeft)}
        </div>
        
        {isLowTime && (
          <div className="bg-red-50 text-red-600 text-xs p-2 rounded-lg mb-3 font-medium">
            ⚠️ Sắp hết giờ! Hãy nộp bài ngay.
          </div>
        )}
        
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className={`w-full py-2.5 rounded-lg font-bold transition-all uppercase text-sm
            ${isLowTime 
              ? 'bg-red-600 text-white hover:bg-red-700' 
              : 'bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
            }`}
        >
          {isSubmitting ? "Đang nộp..." : "Nộp bài"}
        </button>
      </div>

      <hr className="border-gray-100 my-4" />

      {/* 2. CHÚ THÍCH */}
      <div className="mb-4 text-xs text-gray-500">
        <span className="font-bold text-orange-500">Chú ý: </span>
        Click vào số câu hỏi để nhảy đến | Nhấn phím A/B/C/D để chọn nhanh
      </div>

      {/* 3. DANH SÁCH CÂU HỎI (PALETTE) */}
      <div className="space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
        {parts.map((part) => (
          <div key={part.id}>
            <h4 className="font-bold text-gray-700 text-sm mb-3">{part.name}</h4>
            <div className="grid grid-cols-5 gap-2">
              {part.groups.flatMap((g: any) => g.questions).map((q: any) => {
                const isAnswered = !!userAnswers[q.id];
                const isCurrent = currentQuestionId === q.id;
                
                return (
                  <button
                    key={q.id}
                    onClick={() => onScrollToQuestion(q.id)}
                    className={`h-8 w-8 text-xs font-bold rounded flex items-center justify-center border transition-all
                      ${isCurrent ? 'ring-2 ring-blue-400 ring-offset-1' : ''}
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