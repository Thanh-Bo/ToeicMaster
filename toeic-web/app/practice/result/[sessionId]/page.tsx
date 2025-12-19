"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { practiceService } from "../../../services/practiceService";

interface PracticeResultData {
  sessionId: number;
  partNumber: number;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  timeSpent: number;
  completedAt: string;
}

export default function PracticeResultPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = use(params);
  const router = useRouter();
  const [result, setResult] = useState<PracticeResultData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResult();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  const loadResult = async () => {
    try {
      // Lấy kết quả từ API (complete đã được gọi trước đó)
      const history = await practiceService.getHistory(1, 10);
      const session = history.items.find((s: PracticeResultData) => s.sessionId === parseInt(sessionId));
      if (session) {
        setResult(session);
      }
    } catch (error) {
      console.error("Failed to load result:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} phút ${secs} giây`;
  };

  const getGrade = (accuracy: number) => {
    if (accuracy >= 90) return { text: "Xuất sắc!", emoji: "🏆", color: "text-yellow-600" };
    if (accuracy >= 75) return { text: "Tốt lắm!", emoji: "🌟", color: "text-green-600" };
    if (accuracy >= 60) return { text: "Khá tốt!", emoji: "👍", color: "text-blue-600" };
    if (accuracy >= 40) return { text: "Cố gắng thêm!", emoji: "💪", color: "text-orange-600" };
    return { text: "Cần cải thiện!", emoji: "📚", color: "text-red-600" };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Không tìm thấy kết quả</p>
          <Link href="/practice" className="text-blue-600 hover:underline">
            Quay lại luyện tập
          </Link>
        </div>
      </div>
    );
  }

  const grade = getGrade(result.accuracy);

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Result Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-linear-to-r from-blue-500 to-indigo-600 p-8 text-center text-white">
            <div className="text-6xl mb-4">{grade.emoji}</div>
            <h1 className="text-3xl font-bold mb-2">{grade.text}</h1>
            <p className="opacity-90">Part {result.partNumber} - Luyện tập hoàn thành</p>
          </div>

          {/* Stats */}
          <div className="p-8">
            {/* Accuracy Circle */}
            <div className="flex justify-center mb-8">
              <div className="relative w-40 h-40">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="#e5e7eb"
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke={result.accuracy >= 60 ? "#22c55e" : "#ef4444"}
                    strokeWidth="12"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${(result.accuracy / 100) * 440} 440`}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-gray-800">{result.accuracy}%</span>
                  <span className="text-gray-500 text-sm">Chính xác</span>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-green-50 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-green-600">{result.correctAnswers}</div>
                <div className="text-green-700 text-sm">Đúng</div>
              </div>
              <div className="bg-red-50 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-red-600">
                  {result.totalQuestions - result.correctAnswers}
                </div>
                <div className="text-red-700 text-sm">Sai</div>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-blue-600">{result.totalQuestions}</div>
                <div className="text-blue-700 text-sm">Tổng câu</div>
              </div>
            </div>

            {/* Time */}
            <div className="bg-gray-50 rounded-xl p-4 text-center mb-8">
              <span className="text-gray-500">⏱️ Thời gian: </span>
              <span className="font-medium text-gray-800">{formatTime(result.timeSpent)}</span>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={() => router.push("/practice")}
                className="flex-1 py-3 bg-linear-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition"
              >
                🔄 Luyện tiếp
              </button>
              <Link
                href="/"
                className="flex-1 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl text-center hover:bg-gray-200 transition"
              >
                🏠 Trang chủ
              </Link>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="font-bold text-gray-800 mb-3">💡 Gợi ý</h3>
          {result.accuracy < 60 ? (
            <p className="text-gray-600">
              Bạn nên ôn lại phần này và thực hành thêm. Hãy thử xem lại các câu sai và bookmark 
              những câu khó để ôn tập sau nhé!
            </p>
          ) : result.accuracy < 80 ? (
            <p className="text-gray-600">
              Kết quả khá tốt! Hãy tiếp tục luyện tập để nâng cao độ chính xác. 
              Thử thách bản thân với nhiều câu hỏi hơn nhé!
            </p>
          ) : (
            <p className="text-gray-600">
              Tuyệt vời! Bạn đã nắm vững phần này. Hãy thử luyện tập các Part khác 
              hoặc làm bài thi thử để kiểm tra năng lực tổng thể!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
