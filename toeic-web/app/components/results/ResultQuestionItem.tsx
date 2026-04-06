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
        currentQuestionId === q.questionId ? "" : ""
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
          <div className="flex items-center gap-2 mb-2">
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
            {!q.userSelected && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 whitespace-nowrap">
                <AlertCircle size={14} /> Not Answered
              </span>
            )}
          </div>
        </div>
      </div>

      <div
        className={`space-y-2 ml-12 mb-4 ${
          partNum === 1 || partNum === 2 ? "space-y-2" : ""
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
                  className={`flex items-start gap-3 p-4 rounded-xl border font-medium text-sm ${btnClass}`}
                >
                  <span className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full font-bold text-base border-2 border-current">
                    {label}
                  </span>
                  <div className="flex-1 pt-1">
                    <div className="mt-1">
                      {isCorrect && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold">
                          <Check size={12} /> Đúng
                        </span>
                      )}
                      {isUserSelected && !isCorrect && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold">
                          <X size={12} /> Sai
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
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isBookmarked ? (
            <>
              <Bookmark size={16} /> Đã lưu
            </>
          ) : (
            <>
              <Tag size={16} /> Đánh dấu
            </>
          )}
        </button>

        {/* Nút Xem Giải Thích: Gọi hàm từ Props */}
        <button
          onClick={() => onViewExplanation(q.questionId)}
          className={`inline-flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-lg transition-colors 
              
              ${
                q.isExplanationOpen
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
        >
          {isExplainLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Đang phân tích...
            </>
          ) : q.isExplanationOpen ? (
            <>
              <X size={16} /> Đóng giải thích
            </>
          ) : (
            <>
              <Sparkles size={16} /> Xem giải thích
            </>
          )}
        </button>
      </div>

      {/* --- KHU VỰC HIỂN THỊ GIẢI THÍCH --- */}
      {q.isExplanationOpen && (
        <div className=" bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 ml-12 mt-4  p-5 rounded-xl animate-fadeIn relative">
          {/* GIẢI THÍCH NGẮN */}
          {q.shortExplanation && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Languages size={14} /> Dịch câu hỏi
                </h4>
              </div>
              <p
                className="text-zinc-900 dark:text-zinc-200 text-base leading-relaxed"
                dangerouslySetInnerHTML={{ __html: q.shortExplanation }}
              ></p>
            </div>
          )}

          {/* Nút Xem Chi Tiết & GIẢI THÍCH CHI TIẾT */}
          {q.fullExplanation && (
            <div className="border-t border-blue-200 dark:border-blue-800 pt-3">
              <button
                onClick={() => onToggleDetail(q.questionId)}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2 flex items-center gap-1 hover:text-blue-800 dark:hover:text-blue-300"
              >
                {q.isDetailOpen ? (
                  <>
                    <ChevronUp size={14} /> Ẩn chi tiết
                  </>
                ) : (
                  <>
                    <ChevronDown size={14} /> Xem chi tiết
                  </>
                )}
              </button>

              {q.isDetailOpen && (
                <div className="text-base text-gray-700 dark:text-gray-300 leading-relaxed prose prose-sm max-w-none dark:prose-invert [&_span.highlight-correct]:text-green-600 dark:[&_span.highlight-correct]:text-green-400">
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
