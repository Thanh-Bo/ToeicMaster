"use client";

import { ArrowLeft, Plus, Edit2, Trash2, FileText } from "lucide-react";
import type { AdminTest, AdminQuestion } from "@/app/types";

interface QuestionsTabProps {
  selectedTestId: number | null;
  tests: AdminTest[];
  questions: AdminQuestion[];
  onSelectTest: (testId: number) => void;
  onBack: () => void;
}

export default function QuestionsTab({
  selectedTestId,
  tests,
  questions,
  onSelectTest,
  onBack,
}: QuestionsTabProps) {
  if (!selectedTestId) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border border-gray-100 dark:border-gray-700">
        <div className="text-5xl mb-4 flex justify-center">
          <FileText className="w-16 h-16 text-blue-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Chọn đề thi</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Vui lòng chọn một đề thi để xem câu hỏi</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {tests.map((t) => (
            <button
              key={t.id}
              onClick={() => onSelectTest(t.id)}
              className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition"
            >
              {t.title}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 flex items-center gap-2 text-sm sm:text-base"
        >
          <ArrowLeft size={18} className="sm:w-5 sm:h-5" /> Quay lại
        </button>
        <button className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium flex items-center gap-2 text-sm sm:text-base w-full sm:w-auto justify-center">
          <Plus size={16} className="sm:w-[18px] sm:h-[18px]" /> Thêm câu hỏi
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="text-left px-4 sm:px-6 py-3 sm:py-4 text-gray-600 dark:text-gray-300 font-medium text-sm">Câu</th>
                <th className="text-left px-4 sm:px-6 py-3 sm:py-4 text-gray-600 dark:text-gray-300 font-medium text-sm">Part</th>
                <th className="text-left px-4 sm:px-6 py-3 sm:py-4 text-gray-600 dark:text-gray-300 font-medium text-sm">Nội dung</th>
                <th className="text-left px-4 sm:px-6 py-3 sm:py-4 text-gray-600 dark:text-gray-300 font-medium text-sm">Đáp án</th>
                <th className="text-left px-4 sm:px-6 py-3 sm:py-4 text-gray-600 dark:text-gray-300 font-medium text-sm">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {questions.map((q) => (
                <tr key={q.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                  <td className="px-4 sm:px-6 py-3 sm:py-4 font-medium text-gray-800 dark:text-gray-100 text-sm">#{q.questionNo}</td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4">
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs sm:text-sm">
                      Part {q.partNumber}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 text-gray-600 dark:text-gray-400 text-sm max-w-[200px] sm:max-w-md truncate">
                    {q.content || "(Câu hỏi nghe)"}
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4">
                    <span className="w-7 h-7 sm:w-8 sm:h-8 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg inline-flex items-center justify-center font-bold text-sm">
                      {q.correctOption}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4">
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      <button className="px-2 sm:px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-900/50 transition flex items-center gap-1">
                        <Edit2 size={14} className="sm:w-4 sm:h-4" /> <span className="hidden sm:inline">Sửa</span>
                      </button>
                      <button className="px-2 sm:px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-xs sm:text-sm font-medium hover:bg-red-200 dark:hover:bg-red-900/50 transition flex items-center gap-1">
                        <Trash2 size={14} className="sm:w-4 sm:h-4" /> <span className="hidden sm:inline">Xóa</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
