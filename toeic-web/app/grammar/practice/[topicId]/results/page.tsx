"use client";

import { useRouter, useSearchParams, useParams } from "next/navigation";
import { ArrowLeft, RotateCcw, ArrowRight, CheckCircle, Trophy } from "lucide-react";

export default function TestResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const topicId = params.topicId as string;

  const score = parseInt(searchParams.get("score") || "0");
  const correct = parseInt(searchParams.get("correct") || "0");
  const total = parseInt(searchParams.get("total") || "0");

  const getPerformanceMessage = () => {
    if (score === 100) {
      return "🎉 Xuất sắc! Bạn nắm vững tất cả các quy tắc!";
    } else if (score >= 80) {
      return "👏 Tốt lắm! Bạn hiểu rõ hầu hết các quy tắc.";
    } else if (score >= 60) {
      return "📚 Ổn. Hãy ôn tập lại những phần còn yếu.";
    } else if (score >= 40) {
      return "💪 Hãy tiếp tục luyện tập thêm.";
    } else {
      return "📖 Quay lại học thêm trước khi kiểm tra.";
    }
  };

  const getScoreColor = () => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-blue-600 dark:text-blue-400";
    if (score >= 40) return "text-orange-600 dark:text-orange-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <button
          onClick={() => router.push("/grammar/practice")}
          className="inline-flex items-center gap-2 mb-8 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          Quay lại
        </button>

        {/* Results Summary */}
        <div className="text-center mb-12">
          <div className="mb-6">
            {score >= 80 ? (
              <Trophy className="w-24 h-24 mx-auto text-yellow-500 mb-4" />
            ) : (
              <CheckCircle className="w-24 h-24 mx-auto text-blue-500 mb-4" />
            )}
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Hoàn thành bài kiểm tra!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            {getPerformanceMessage()}
          </p>

          {/* Score Display */}
          <div className="rounded-2xl border-2 border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-8 mb-8">
            <div className="inline-block text-center">
              <div className={`text-6xl font-bold mb-2 ${getScoreColor()}`}>
                {score}%
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">
                Điểm của bạn
              </p>

              <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                {correct}/{total} đúng
              </div>
            </div>
          </div>

          {/* Score Breakdown */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="rounded-lg border-2 border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950/30 p-4">
              <p className="text-sm text-green-600 dark:text-green-400 font-semibold mb-1">
                Câu đúng
              </p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {correct}
              </p>
            </div>

            <div className="rounded-lg border-2 border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 p-4">
              <p className="text-sm text-red-600 dark:text-red-400 font-semibold mb-1">
                Câu sai
              </p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {total - correct}
              </p>
            </div>
          </div>

          {/* Feedback Message */}
          <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 border-2 border-blue-200 dark:border-blue-900 p-4 mb-8">
            <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold">
              {score >= 80
                ? "✨ Tiếp tục duy trì phong độ này!"
                : score >= 60
                  ? "💡 Hãy ôn lại những quy tắc chưa thuộc và làm lại."
                  : "📚 Nên quay lại học thêm trước khi kiểm tra lần nữa."}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-center flex-wrap">
            <button
              onClick={() =>
                router.push(`/grammar/practice/${topicId}`)
              }
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold border-2 border-blue-400 dark:border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all duration-200"
            >
              <RotateCcw className="w-5 h-5" />
              Làm lại
            </button>

            <button
              onClick={() => router.push("/grammar")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold border-2 border-gray-400 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-950/30 transition-all duration-200"
            >
              <ArrowRight className="w-5 h-5" />
              Về trang chủ
            </button>
          </div>

          {/* Tips */}
          <div className="mt-12 rounded-lg bg-gray-50 dark:bg-gray-950/30 border-2 border-gray-200 dark:border-gray-800 p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-3">
              💡 Mẹo cải thiện kỹ năng
            </h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2 text-left">
              <li>📖 Đọc lại các quy tắc sai</li>
              <li>✍️ Viết ví dụ của riêng bạn</li>
              <li>🎧 Nghe phát âm của các ví dụ</li>
              <li>🔄 Ôn lại sau 1 ngày</li>
              <li>⏰ Kiểm tra lại sau 3 ngày</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
