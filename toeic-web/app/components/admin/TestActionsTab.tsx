"use client";

import { ArrowLeft, Zap, Loader } from "lucide-react";
import type { AdminTest } from "@/app/types";

interface TestActionsTabProps {
  tests: AdminTest[];
  selectedTestForAction: number | null;
  processingActions: { explain: boolean; transcripts: boolean; passages: boolean };
  onBack: () => void;
  onGenerateAction: (testId: number, type: string, partNumber?: number) => void;
}

export default function TestActionsTab({
  tests,
  selectedTestForAction,
  processingActions,
  onBack,
  onGenerateAction,
}: TestActionsTabProps) {
  if (!selectedTestForAction) return null;

  const currentTest = tests.find(t => t.id === selectedTestForAction);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
          Chọn hành động cho: {currentTest?.title}
        </h3>
        <button
          onClick={onBack}
          className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 flex items-center gap-2"
        >
          <ArrowLeft size={20} /> Quay lại
        </button>
      </div>

      {/* Loading Notification */}
      {(processingActions.explain || processingActions.transcripts || processingActions.passages) && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 dark:border-blue-400 p-4 rounded-lg flex items-center gap-3 animate-pulse">
          <Loader className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-spin" />
          <div>
            <p className="font-semibold text-blue-900 dark:text-blue-200">Đang xử lý...</p>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              {processingActions.explain && "Giải thích AI "}
              {processingActions.transcripts && "Dịch âm bản "}
              {processingActions.passages && "Dịch đoạn văn"}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tạo Giải Thích */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100">Tạo Giải Thích</h4>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">Tạo giải thích AI cho các câu hỏi</p>
          <div className="space-y-2">
            <button
              onClick={() => onGenerateAction(selectedTestForAction, "explain")}
              disabled={processingActions.explain}
              className="w-full px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition font-medium disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {processingActions.explain ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" /> Đang xử lý...
                </>
              ) : (
                "Toàn bộ đề"
              )}
            </button>
            {[1, 2, 3, 4, 5, 6, 7].map((part) => (
              <button
                key={part}
                onClick={() => onGenerateAction(selectedTestForAction, "explain", part)}
                disabled={processingActions.explain}
                className="w-full px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition font-medium disabled:opacity-50 text-sm flex items-center justify-center gap-2"
              >
                {processingActions.explain ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" /> Đang xử lý...
                  </>
                ) : (
                  `Part ${part}`
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Dịch Âm Bản */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100">Dịch Âm Bản</h4>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">Dịch transcript cho Part 3/4</p>
          <div className="space-y-2">
            <button
              onClick={() => onGenerateAction(selectedTestForAction, "translate-transcripts")}
              disabled={processingActions.transcripts}
              className="w-full px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition font-medium disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {processingActions.transcripts ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" /> Đang xử lý...
                </>
              ) : (
                "Toàn bộ đề"
              )}
            </button>
            {[3, 4].map((part) => (
              <button
                key={part}
                onClick={() => onGenerateAction(selectedTestForAction, "translate-transcripts", part)}
                disabled={processingActions.transcripts}
                className="w-full px-4 py-2 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/40 transition font-medium disabled:opacity-50 text-sm flex items-center justify-center gap-2"
              >
                {processingActions.transcripts ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" /> Đang xử lý...
                  </>
                ) : (
                  `Part ${part}`
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Dịch Đoạn Văn */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100">Dịch Đoạn Văn</h4>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">Dịch passage cho Part 6/7</p>
          <div className="space-y-2">
            <button
              onClick={() => onGenerateAction(selectedTestForAction, "translate-passages")}
              disabled={processingActions.passages}
              className="w-full px-4 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-lg hover:bg-orange-200 dark:hover:bg-orange-900/50 transition font-medium disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {processingActions.passages ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" /> Đang xử lý...
                </>
              ) : (
                "Toàn bộ đề"
              )}
            </button>
            {[6, 7].map((part) => (
              <button
                key={part}
                onClick={() => onGenerateAction(selectedTestForAction, "translate-passages", part)}
                disabled={processingActions.passages}
                className="w-full px-4 py-2 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/40 transition font-medium disabled:opacity-50 text-sm flex items-center justify-center gap-2"
              >
                {processingActions.passages ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" /> Đang xử lý...
                  </>
                ) : (
                  `Part ${part}`
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
