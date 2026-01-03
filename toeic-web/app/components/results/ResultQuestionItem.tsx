"use client";

import { AnswerOptionResult } from "./AnswerOptionResult";

const BASE_URL = "http://localhost:5298"; // Hoặc import từ file config

interface Props {
  q: any;
  currentQuestionId: number | null;
  // Các dữ liệu cần thiết từ cha truyền xuống
  isBookmarked: boolean;
  isBookmarkLoading: boolean;
  isExplainLoading: boolean;
  
  // Các hành động (Callback) gửi ngược lên cha
  onToggleBookmark: (id: number) => void;
  onViewExplanation: (id: number) => void;
  onToggleDetail: (id: number) => void;
}

export default function ResultQuestionItem({
  q,
  currentQuestionId,
  isBookmarked,
  isBookmarkLoading,
  isExplainLoading,
  onToggleBookmark,
  onViewExplanation,
  onToggleDetail,
}: Props) {
  const partNum = q.partNumber || 5;
  const options = partNum === 2 ? ["A", "B", "C"] : ["A", "B", "C", "D"];

  const getAnswerContent = (label: string) => {
    if (q.answers && Array.isArray(q.answers)) {
      const ans = q.answers.find((a: any) => a.label === label);
      return ans ? ans.content : "";
    }
    return q[`option${label}`] || "";
  };

  return (
    <div
      className={`p-4 rounded-xl transition-colors ${
        currentQuestionId === q.questionId
          ? ""
          : ""
      }`}
    >
      <div className="flex gap-3 mb-4">
        <span
          className={`shrink-0 w-10 h-10 font-bold rounded-full flex items-center justify-center text-sm shadow-sm
            ${
              q.isCorrect
                ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-2 border-green-300 dark:border-green-700"
                : q.userSelected
                ? "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 border-2 border-red-300 dark:border-red-700"
                : "bg-gray-300 dark:bg-zinc-600 text-gray-600 dark:text-gray-300 border-2 border-gray-300 dark:border-zinc-600"
            }`}
        >
          {q.questionNo}
        </span>
        <div className="flex-1 pt-1">
          {partNum === 1 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm italic">
              Chọn đáp án mô tả đúng bức tranh
            </p>
          ) : partNum === 2 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm italic">
              Chọn câu trả lời phù hợp nhất
            </p>
          ) : (
            <p className="font-medium text-gray-900 dark:text-white text-lg leading-relaxed">
              {q.content}
            </p>
          )}
        </div>
      </div>

      <div
        className={`space-y-2 ml-12 mb-4 ${
          partNum === 1 || partNum === 2 ? "flex gap-3 space-y-0" : ""
        }`}
      >
        {partNum === 1 || partNum === 2
          ? options.map((label) => {
              const userSelected = (q.userSelected || "")
                .toString()
                .toUpperCase();
              const isUserSelected = userSelected === label;
              const correctOpt = (q.correctOption || "")
                .toString()
                .toUpperCase();
              const isCorrect = correctOpt === label;

              let btnClass = "border-gray-300 dark:border-zinc-600 bg-gray-200 dark:bg-zinc-900 text-gray-600 dark:text-gray-300";
              if (isCorrect)
                btnClass =
                  "border-green-500 dark:border-green-700 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 ring-2 ring-green-300 dark:ring-green-700";
              else if (isUserSelected && !isCorrect)
                btnClass =
                  "border-red-500 dark:border-red-700 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 ring-1 ring-red-300 dark:ring-red-700";

              return (
                <div
                  key={label}
                  className={`flex-1 p-4 rounded-xl border-1 font-bold text-lg text-center ${btnClass}`}
                >
                  {label}
                  {isCorrect && (
                    <span className="block text-xs mt-1">✔ Đúng</span>
                  )}
                  {isUserSelected && !isCorrect && (
                    <span className="block text-xs mt-1">✖ Sai</span>
                  )}
                </div>
              );
            })
          : options.map((label) => (
              <AnswerOptionResult
                key={label}
                q={q}
                label={label}
                content={getAnswerContent(label)}
              />
            ))}
      </div>

      {/* --- KHU VỰC NÚT TƯƠNG TÁC --- */}
      <div className="ml-12 flex flex-wrap items-center gap-3">
        {/* Nút Bookmark: Gọi hàm từ Props */}
        <button
          onClick={() => onToggleBookmark(q.questionId)}
          disabled={isBookmarkLoading}
          className={`inline-flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-lg transition-colors
              ${
                isBookmarked
                  ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300"
                  : "bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-gray-300"
              }`}
        >
          {isBookmarkLoading ? (
            <svg
              className="animate-spin h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              ></path>
            </svg>
          ) : isBookmarked ? (
            <>🔖 Đã lưu</>
          ) : (
            <>🏷️ Đánh dấu</>
          )}
        </button>

        {/* Nút Xem Giải Thích: Gọi hàm từ Props */}
        <button
          onClick={() => onViewExplanation(q.questionId)}
          disabled={isExplainLoading}
          className={`inline-flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-lg transition-colors
              ${
                q.isExplanationOpen
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
        >
          {isExplainLoading ? (
            <>
              <svg
                className="animate-spin h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Đang phân tích...
            </>
          ) : q.isExplanationOpen ? (
            <>✖ Đóng giải thích</>
          ) : (
            <>✨ Xem giải thích</>
          )}
        </button>
      </div>

      {/* --- KHU VỰC HIỂN THỊ GIẢI THÍCH --- */}
      {q.isExplanationOpen && (
        <div className="ml-12 mt-4  p-5 rounded-xl border border-zinc-200 dark:border-zinc-700 animate-fadeIn relative">
          {/* GIẢI THÍCH NGẮN */}
          {q.shortExplanation && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-blue-600 dark:bg-blue-700 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                  Gợi ý
                </span>
                <h4 className="font-bold text-zinc-900 dark:text-zinc-300 text-sm">
                  Giải thích ngắn
                </h4>
              </div>
              <p className="text-zinc-900 dark:text-zinc-200 font-medium leading-relaxed">
                {q.shortExplanation}
              </p>
            </div>
          )}

          {/* Nút Xem Chi Tiết */}
          <div className="flex items-center justify-center my-4 relative">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-zinc-300 dark:border-zinc-700"></div>
            </div>
            <div className="relative flex justify-center">
              <button
                onClick={() => onToggleDetail(q.questionId)}
                className="bg-white dark:bg-zinc-700 border border-zinc-400 dark:border-zinc-700 text-gray-900 dark:text-gray-100 text-xs font-bold px-4 py-1.5 rounded-full transition-all flex items-center gap-1 shadow-xs"
              >
                {q.isDetailOpen ? (
                  <>Thu gọn chi tiết ▲</>
                ) : (
                  <>Xem giải thích chi tiết (Premium) ▼</>
                )}
              </button>
            </div>
          </div>

          {/* GIẢI THÍCH CHI TIẾT */}
          {q.isDetailOpen && q.fullExplanation && (
            <div className="pt-2 animate-fadeIn">
              <div className="bg-white dark:bg-zinc-900 p-4 rounded-lg border border-zinc-200 dark:border-zinc-700 shadow-xs text-gray-900 dark:text-gray-100">
                <div
                  className=" max-w-none text-gray-700 dark:text-white leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: q.fullExplanation }}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}