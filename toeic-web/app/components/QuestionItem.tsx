// File: toeic-web/app/components/QuestionItem.tsx
"use client";

import { useState } from "react";
import { ResultDetail } from "../types"; 

interface QuestionItemProps {
  q: ResultDetail["questions"][0];
  onExplain: (questionId: number) => void; // Hàm gọi API từ cha
  isExplaining: boolean; // Trạng thái đang load của câu này
}

export const QuestionItem = ({ q, onExplain, isExplaining }: QuestionItemProps) => {
  const [showFull, setShowFull] = useState(false);

  const handleViewClick = () => {
    // Nếu chưa có giải thích thì gọi API tải về
    if (!q.fullExplanation && !q.shortExplanation) {
      onExplain(q.questionId);
    }
    // Mở rộng vùng hiển thị
    setShowFull(true);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6 transition-all hover:shadow-md">
      {/* 1. Header: Số câu & Nội dung */}
      <div className="flex gap-4 mb-4">
        <span
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shadow-sm
          ${q.isCorrect ? "bg-green-500" : "bg-red-500"}`}
        >
          {q.questionNo}
        </span>
        <div className="flex-1">
          <p className="font-medium text-gray-800 text-lg leading-snug">{q.content}</p>
          <span
            className={`text-xs font-bold px-2 py-1 rounded mt-2 inline-block
            ${q.isCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
          >
            {q.isCorrect ? "CHÍNH XÁC" : "SAI RỒI"}
          </span>
        </div>
      </div>

      {/* 2. Danh sách đáp án */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-12 mb-4">
        {q.answers.map((ans) => {
          let bgClass = "bg-white border-gray-200 hover:bg-gray-50";
          let textClass = "text-gray-700";

          // Tô màu đáp án
          if (ans.label === q.correctOption) {
            bgClass = "bg-green-50 border-green-500";
            textClass = "text-green-800 font-bold";
          } else if (ans.label === q.userSelected && !q.isCorrect) {
            bgClass = "bg-red-50 border-red-500";
            textClass = "text-red-800 font-bold";
          } else if (ans.label === q.userSelected) {
            bgClass = "bg-blue-50 border-blue-500";
          }

          return (
            <div
              key={ans.label}
              className={`px-4 py-3 border rounded-lg flex items-center transition-colors ${bgClass}`}
            >
              <span className={`font-bold mr-3 w-5 ${textClass}`}>{ans.label}.</span>
              <span className={`flex-1 ${textClass}`}>{ans.content}</span>
              
              {ans.label === q.correctOption && <span className="text-green-600 text-lg">✔</span>}
              {ans.label === q.userSelected && ans.label !== q.correctOption && (
                <span className="text-red-600 text-lg">✖</span>
              )}
            </div>
          );
        })}
      </div>

      {/* 3. Khu vực AI Giải thích */}
      <div className="ml-12">
        {/* Gợi ý nhanh (Nếu có sẵn) */}
        {q.shortExplanation && (
          <div className="mb-3 text-sm text-green-800 bg-green-50 p-3 rounded-lg border border-green-200 flex items-start gap-2">
            <span className="text-lg">💡</span>
            <div>
              <strong>Gợi ý nhanh: </strong> {q.shortExplanation}
            </div>
          </div>
        )}

        {/* Nút bấm xem chi tiết */}
        {!showFull && (
          <button
            onClick={handleViewClick}
            disabled={isExplaining}
            className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline disabled:opacity-50"
          >
            {isExplaining ? (
              <>
                <svg className="animate-spin h-4 w-4 text-blue-600" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang hỏi AI...
              </>
            ) : (
              <>
                👉 Xem giải thích chi tiết bởi AI
              </>
            )}
          </button>
        )}

        {/* Nội dung chi tiết (Mở ra khi showFull = true) */}
        {showFull && (
          <div className="mt-3 p-5 bg-slate-800 rounded-lg border border-slate-700 shadow-inner text-slate-200 text-sm leading-relaxed animate-fade-in">
            <div className="flex justify-between items-center mb-3 border-b border-slate-600 pb-2">
              <h4 className="text-yellow-400 font-bold flex items-center gap-2">
                🤖 Phân tích chi tiết
              </h4>
              <button onClick={() => setShowFull(false)} className="text-gray-400 hover:text-white text-xs">
                ✕ Thu gọn
              </button>
            </div>

            {/* Logic hiển thị: Nếu đang load thì hiện Spinner, có dữ liệu thì hiện HTML */}
            {isExplaining ? (
              <div className="flex flex-col items-center justify-center py-4 text-gray-400">
                 <svg className="animate-spin h-6 w-6 mb-2 text-yellow-500" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
                 AI đang viết câu trả lời...
              </div>
            ) : q.fullExplanation ? (
              <div dangerouslySetInnerHTML={{ __html: q.fullExplanation }} />
            ) : (
              // Trường hợp đã bấm nhưng API lỗi hoặc chưa trả về
              <div className="text-red-400 italic">Chưa tải được giải thích. Vui lòng thử lại sau.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};