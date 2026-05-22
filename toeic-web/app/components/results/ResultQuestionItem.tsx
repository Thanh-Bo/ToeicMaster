"use client";

import {
  Loader2,
  Bookmark,
  Tag,
  X,
  Sparkles,
  Check,
  ChevronUp,
  ChevronDown,
  Languages,
  AlertCircle,
  Lock,
} from "lucide-react";
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
  const isExplanationLocked = q.explanationLocked && !q.shortExplanation && !q.fullExplanation;
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
      className={`p-2 xs:p-3 sm:p-4 rounded-lg xs:rounded-xl transition-colors ${
        currentQuestionId === q.questionId ? "" : ""
      }`}
    >
      <div className="flex gap-2 xs:gap-2.5 sm:gap-3 mb-2 xs:mb-3 sm:mb-4">
        <span
          className={`shrink-0 w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 font-bold rounded-full flex items-center justify-center text-xs xs:text-sm sm:text-sm shadow-sm
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
        <div className="flex-1 pt-0.5 xs:pt-0.5 sm:pt-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 xs:gap-1.5 sm:gap-2 mb-1 xs:mb-1.5 sm:mb-2">
            {partNum === 1 ? (
              <p className="text-gray-500 dark:text-gray-400 text-xs xs:text-xs sm:text-sm italic">
                Chọn đáp án mô tả đúng bức tranh
              </p>
            ) : partNum === 2 ? (
              <p className="text-gray-500 dark:text-gray-400 text-xs xs:text-xs sm:text-sm italic">
                Chọn câu trả lời phù hợp nhất
              </p>
            ) : (
              <p className="font-medium text-gray-900 dark:text-white text-xs xs:text-sm sm:text-base md:text-lg leading-relaxed">
                {q.content}
              </p>
            )}
            {!q.userSelected && (
              <span className="inline-flex items-center gap-0.5 xs:gap-1 px-1.5 xs:px-2 sm:px-2.5 py-0.5 xs:py-0.5 sm:py-1 rounded-full text-[9px] xs:text-[10px] sm:text-xs font-semibold bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 whitespace-nowrap w-fit">
                <AlertCircle size={10} className="xs:w-3 xs:h-3 sm:w-3.5 sm:h-3.5" /> Not Answered
              </span>
            )}
          </div>
        </div>
      </div>

      <div
        className={`space-y-1.5 xs:space-y-1.5 sm:space-y-2 ml-8 xs:ml-10 sm:ml-12 mb-2 xs:mb-3 sm:mb-4 ${
          partNum === 1 || partNum === 2 ? "space-y-1.5 xs:space-y-1.5 sm:space-y-2" : ""
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

              let btnClass =
                "border-gray-300 dark:border-zinc-600 bg-gray-200 dark:bg-zinc-900 text-gray-600 dark:text-gray-300";
              if (isCorrect)
                btnClass =
                  "border-green-500 dark:border-green-700 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 ring-2 ring-green-300 dark:ring-green-700";
              else if (isUserSelected && !isCorrect)
                btnClass =
                  "border-red-500 dark:border-red-700 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 ring-1 ring-red-300 dark:ring-red-700";

              return (
                <div
                  key={label}
                  className={`flex items-start gap-2 xs:gap-2.5 sm:gap-3 p-2.5 xs:p-3 sm:p-4 rounded-lg xs:rounded-xl border font-medium text-xs xs:text-sm sm:text-sm ${btnClass}`}
                >
                  <span className="shrink-0 w-7 h-7 xs:w-7.5 xs:h-7.5 sm:w-8 sm:h-8 flex items-center justify-center rounded-full font-bold text-sm xs:text-base sm:text-base border-2 border-current">
                    {label}
                  </span>
                  <div className="flex-1 pt-0.5 xs:pt-0.5 sm:pt-1">
                    <div className="mt-0.5 xs:mt-0.5 sm:mt-1">
                      {isCorrect && (
                        <span className="inline-flex items-center gap-0.5 xs:gap-1 text-[10px] xs:text-xs sm:text-xs font-bold">
                          <Check size={10} className="xs:w-3 xs:h-3 sm:w-3" /> Đúng
                        </span>
                      )}
                      {isUserSelected && !isCorrect && (
                        <span className="inline-flex items-center gap-0.5 xs:gap-1 text-[10px] xs:text-xs sm:text-xs font-bold">
                          <X size={10} className="xs:w-3 xs:h-3 sm:w-3" /> Sai
                        </span>
                      )}
                    </div>
                  </div>
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
      <div className="ml-8 xs:ml-10 sm:ml-12 flex flex-wrap items-center gap-1.5 xs:gap-2 sm:gap-3">
        {/* Nút Bookmark: Gọi hàm từ Props */}
        <button
          onClick={() => onToggleBookmark(q.questionId)}
          disabled={isBookmarkLoading}
          className={`inline-flex items-center gap-1 xs:gap-1.5 sm:gap-2 text-xs xs:text-sm sm:text-sm font-bold px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 sm:py-2 rounded-md xs:rounded-lg sm:rounded-lg transition-colors
              ${
                isBookmarked
                  ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300"
                  : "bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-gray-300"
              }`}
        >
          {isBookmarkLoading ? (
            <Loader2 className="h-3 xs:h-4 w-3 xs:w-4 animate-spin" />
          ) : isBookmarked ? (
            <>
              <Bookmark size={14} className="xs:w-4 xs:h-4 sm:w-4 sm:h-4" /> <span className="hidden xs:inline">Đã lưu</span>
            </>
          ) : (
            <>
              <Tag size={14} className="xs:w-4 xs:h-4 sm:w-4 sm:h-4" /> <span className="hidden xs:inline">Đánh dấu</span>
            </>
          )}
        </button>

        {/* Nút Xem Giải Thích: Gọi hàm từ Props */}
        <button
          onClick={() => {
            if (isExplanationLocked) {
              window.location.href = "/subscription";
              return;
            }
            onViewExplanation(q.questionId);
          }}
          className={`inline-flex items-center gap-1 xs:gap-1.5 sm:gap-2 text-xs xs:text-sm sm:text-sm font-bold px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 sm:py-2 rounded-md xs:rounded-lg sm:rounded-lg transition-colors 
              
              ${
                q.isExplanationOpen
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
        >
          {isExplainLoading ? (
            <>
              <Loader2 className="h-3 xs:h-4 w-3 xs:w-4 animate-spin" />
              <span className="hidden xs:inline">Đang phân tích...</span>
            </>
          ) : q.isExplanationOpen ? (
            <>
              <X size={14} className="xs:w-4 xs:h-4 sm:w-4 sm:h-4" /> <span className="hidden xs:inline">Đóng</span>
            </>
          ) : (
            <>
              {isExplanationLocked ? (
                <Lock size={14} className="xs:w-4 xs:h-4 sm:w-4 sm:h-4" />
              ) : (
                <Sparkles size={14} className="xs:w-4 xs:h-4 sm:w-4 sm:h-4" />
              )}
              <span className="hidden xs:inline">{isExplanationLocked ? "Mở Premium" : "Xem giải thích"}</span>
            </>
          )}
        </button>
      </div>

      {isExplanationLocked && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 ml-8 xs:ml-10 sm:ml-12 mt-2 xs:mt-3 sm:mt-4 p-2.5 xs:p-3 sm:p-5 rounded-lg xs:rounded-xl sm:rounded-xl">
          <div className="flex items-start gap-2">
            <Lock className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-yellow-800 dark:text-yellow-200">
                Giải thích dành cho Premium
              </p>
              <p className="text-xs sm:text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                Bạn vẫn có thể luyện đề và xem đáp án. Nâng cấp Premium để mở toàn bộ giải thích chi tiết.
              </p>
              <button
                onClick={() => (window.location.href = "/subscription")}
                className="mt-3 px-3 py-1.5 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-bold transition"
              >
                Nâng cấp ngay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- KHU VỰC HIỂN THỊ GIẢI THÍCH --- */}
      {q.isExplanationOpen && !isExplanationLocked && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 ml-8 xs:ml-10 sm:ml-12 mt-2 xs:mt-3 sm:mt-4 p-2.5 xs:p-3 sm:p-5 rounded-lg xs:rounded-xl sm:rounded-xl animate-fadeIn relative">
          {/* GIẢI THÍCH NGẮN */}
          {q.shortExplanation && (
            <div className="mb-2 xs:mb-3 sm:mb-4">
              <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2 mb-1.5 xs:mb-2 sm:mb-2">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-0.5 xs:gap-1 sm:gap-1">
                  <Languages size={11} className="xs:w-3 xs:h-3 sm:w-3.5 sm:h-3.5" /> <span className=" xs:inline">Dịch câu hỏi</span>
                </h4>
              </div>
              <p
                className="text-zinc-900 dark:text-zinc-200 text-xs xs:text-sm sm:text-base leading-relaxed"
                dangerouslySetInnerHTML={{ __html: q.shortExplanation }}
              ></p>
            </div>
          )}

          {/* Nút Xem Chi Tiết & GIẢI THÍCH CHI TIẾT */}
          {q.fullExplanation && (
            <div className="border-t border-blue-200 dark:border-blue-800 pt-1.5 xs:pt-2 sm:pt-3">
              <button
                onClick={() => onToggleDetail(q.questionId)}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1.5 xs:mb-2 sm:mb-2 flex items-center gap-1 hover:text-blue-800 dark:hover:text-blue-300"
              >
                {q.isDetailOpen ? (
                  <>
                    <ChevronUp size={11} className="xs:w-3 xs:h-3 sm:w-3.5 sm:h-3.5" /> <span className=" xs:inline">Ẩn chi tiết</span>
                  </>
                ) : (
                  <>
                    <ChevronDown size={11} className="xs:w-3 xs:h-3 sm:w-3.5 sm:h-3.5" /> <span className=" xs:inline">Xem chi tiết</span>
                  </>
                )}
              </button>

              {q.isDetailOpen && (
                <div className="text-xs xs:text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed prose prose-sm max-w-none dark:prose-invert [&_span.highlight-correct]:text-green-600 dark:[&_span.highlight-correct]:text-green-400">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: q.fullExplanation,
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
