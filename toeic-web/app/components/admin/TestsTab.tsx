"use client";

import { Plus, Eye, Zap, Trash2, Loader } from "lucide-react";
import type { AdminTest } from "@/app/types";

interface TestsTabProps {
  filteredTests: AdminTest[];
  getYearFilters: () => Array<{ year: string; count: number }>;
  selectedYearFilter: string;
  onYearFilterChange: (year: string) => void;
  processingActions: { explain: boolean; transcripts: boolean; passages: boolean };
  onViewQuestions: (testId: number) => void;
  onOpenActionTab: (testId: number) => void;
  onDeleteTest: (testId: number) => void;
}

export default function TestsTab({
  filteredTests,
  getYearFilters,
  selectedYearFilter,
  onYearFilterChange,
  processingActions,
  onViewQuestions,
  onOpenActionTab,
  onDeleteTest,
}: TestsTabProps) {
  return (
    <div className="space-y-4">
      {/* Year Filter Tabs */}
      <div className="flex gap-2 flex-wrap pb-4 border-b border-gray-200 dark:border-gray-700">
        {getYearFilters().map(({ year, count }) => (
          <button
            key={year}
            onClick={() => onYearFilterChange(year)}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-sm font-medium transition ${
              selectedYearFilter === year
                ? "bg-blue-600 text-white dark:bg-blue-600"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {year === 'all' ? `Tất cả (${count})` : `${year} (${count})`}
          </button>
        ))}
      </div>

      <div className="flex justify-end">
        <button className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium flex items-center gap-2 text-sm sm:text-base">
          <Plus size={18} /> <span className="hidden sm:inline">Thêm đề thi mới</span>
          <span className="sm:hidden">Thêm</span>
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="text-left px-4 sm:px-6 py-3 sm:py-4 text-gray-600 dark:text-gray-300 font-medium text-sm">ID</th>
                <th className="text-left px-4 sm:px-6 py-3 sm:py-4 text-gray-600 dark:text-gray-300 font-medium text-sm">Tiêu đề</th>
                <th className="text-left px-4 sm:px-6 py-3 sm:py-4 text-gray-600 dark:text-gray-300 font-medium text-sm">Loại</th>
                <th className="text-left px-4 sm:px-6 py-3 sm:py-4 text-gray-600 dark:text-gray-300 font-medium text-sm">Thời gian</th>
                <th className="text-left px-4 sm:px-6 py-3 sm:py-4 text-gray-600 dark:text-gray-300 font-medium text-sm">Số câu</th>
                <th className="text-left px-4 sm:px-6 py-3 sm:py-4 text-gray-600 dark:text-gray-300 font-medium text-sm">Trạng thái</th>
                <th className="text-left px-4 sm:px-6 py-3 sm:py-4 text-gray-600 dark:text-gray-300 font-medium text-sm">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredTests.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                  <td className="px-4 sm:px-6 py-3 sm:py-4 text-gray-500 dark:text-gray-400 text-sm">#{t.id}</td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 font-medium text-gray-800 dark:text-gray-100 text-sm">{t.title}</td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      t.type === "FULL_TEST" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400" : "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400"
                    }`}>
                      {t.type === "FULL_TEST" ? "Full Test" : "Mini Test"}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 text-gray-600 dark:text-gray-400 text-sm">{t.duration} phút</td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 text-gray-600 dark:text-gray-400 text-sm">{t.totalQuestions}</td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      t.isActive ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    }`}>
                      {t.isActive ? "Hoạt động" : "Ẩn"}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4">
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      <button
                        onClick={() => onViewQuestions(t.id)}
                        className="px-2 sm:px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-900/50 transition flex items-center gap-1"
                      >
                        <Eye size={14} className="sm:w-4 sm:h-4" /> <span className="hidden sm:inline">Xem câu hỏi</span>
                        <span className="sm:hidden">Xem</span>
                      </button>
                      
                      <button
                        onClick={() => onOpenActionTab(t.id)}
                        className="px-2 sm:px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg text-xs sm:text-sm font-medium hover:bg-green-200 dark:hover:bg-green-900/50 transition flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={processingActions.explain || processingActions.transcripts || processingActions.passages}
                        title="Mở bảng AI Giải thích"
                      >
                        {(processingActions.explain || processingActions.transcripts || processingActions.passages) ? <Loader size={14} className="animate-spin" /> : <Zap size={14} className="sm:w-4 sm:h-4" />}
                        <span className="hidden sm:inline">AI</span>
                      </button>

                      <button
                        onClick={() => onDeleteTest(t.id)}
                        className="px-2 sm:px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-xs sm:text-sm font-medium hover:bg-red-200 dark:hover:bg-red-900/50 transition flex items-center gap-1"
                      >
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
