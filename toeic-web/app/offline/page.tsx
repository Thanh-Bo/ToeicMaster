"use client";

import { useRouter } from "next/navigation";
import { WifiOff, RefreshCw, BookOpen } from "lucide-react";

export default function OfflinePage() {
  const router = useRouter();

  const handleRetry = () => {
    router.refresh();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto rounded-full bg-blue-100 dark:bg-blue-950/30 flex items-center justify-center">
            <WifiOff className="w-12 h-12 text-blue-600 dark:text-blue-400" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Mất kết nối
        </h1>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
          Bạn đang ngoại tuyến. Một số tính năng có thể không khả dụng. 
          Vui lòng kiểm tra kết nối internet và thử lại.
        </p>

        {/* Features available offline */}
        <div className="bg-gray-50 dark:bg-zinc-800 rounded-xl p-6 mb-8 border-2 border-gray-200 dark:border-zinc-700">
          <div className="flex items-center gap-2 mb-4 text-gray-700 dark:text-gray-300">
            <BookOpen className="w-5 h-5" />
            <span className="font-semibold">Có thể sử dụng offline:</span>
          </div>
          <ul className="text-left text-sm text-gray-600 dark:text-gray-400 space-y-2">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Xem bài học đã tải
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Luyện tập câu hỏi đã cache
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Xem từ vựng đã lưu
            </li>
          </ul>
        </div>

        {/* Retry Button */}
        <button
          onClick={handleRetry}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-blue-500 hover:bg-blue-600 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg"
        >
          <RefreshCw className="w-5 h-5" />
          Thử lại
        </button>

        {/* Back to home */}
        <button
          onClick={() => router.push("/")}
          className="block w-full sm:w-auto mt-4 mx-auto text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 font-medium transition-colors"
        >
          Về trang chủ
        </button>
      </div>
    </div>
  );
}