"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { practiceService, PartInfo } from "../services/practiceService";

export default function PracticePage() {
  const router = useRouter();
  const [parts, setParts] = useState<PartInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPart, setSelectedPart] = useState<number | null>(null);
  const [questionCount, setQuestionCount] = useState(10);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    loadParts();
  }, []);

  const loadParts = async () => {
    try {
      const data = await practiceService.getParts();
      setParts(data);
    } catch (error) {
      console.error("Failed to load parts:", error);
    } finally {
      setLoading(false);
    }
  };

  const startPractice = async () => {
    if (!selectedPart) return;
    
    setStarting(true);
    try {
      const session = await practiceService.start(selectedPart, questionCount);
      // Lưu session vào localStorage để trang practice session có thể đọc
      localStorage.setItem(`practice_${session.sessionId}`, JSON.stringify({
        questions: session.questions,
        partNumber: session.partNumber
      }));
      router.push(`/practice/${session.sessionId}`);
    } catch (error) {
      console.error("Failed to start practice:", error);
      alert("Không thể bắt đầu luyện tập. Vui lòng thử lại!");
    } finally {
      setStarting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">🎯 Luyện Tập Theo Part</h1>
            <p className="text-gray-600 mt-1">Chọn Part bạn muốn luyện tập (không tính điểm)</p>
          </div>
          <Link href="/" className="px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition text-gray-700">
            ← Trang chủ
          </Link>
        </div>

        {/* Parts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {parts.map((part) => (
            <div
              key={part.partNumber}
              onClick={() => setSelectedPart(part.partNumber)}
              className={`cursor-pointer p-6 rounded-2xl border-2 transition-all transform hover:scale-[1.02] ${
                selectedPart === part.partNumber
                  ? "border-blue-500 bg-blue-50 shadow-lg ring-2 ring-blue-200"
                  : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-md"
              }`}
            >
              <div className="flex items-start gap-4">
                <span className="text-4xl">{part.icon}</span>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-800">{part.name}</h3>
                  <p className="text-gray-500 text-sm mt-1">{part.description}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      part.type === "listening" 
                        ? "bg-purple-100 text-purple-700" 
                        : "bg-green-100 text-green-700"
                    }`}>
                      {part.type === "listening" ? "🎧 Listening" : "📖 Reading"}
                    </span>
                    <span className="text-gray-400 text-sm">
                      {part.totalQuestions} câu hỏi
                    </span>
                  </div>
                </div>
                {selectedPart === part.partNumber && (
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Settings & Start */}
        {selectedPart && (
          <div className="bg-white rounded-2xl shadow-lg p-6 animate-fadeIn">
            <h3 className="font-bold text-lg text-gray-800 mb-4">⚙️ Cài đặt luyện tập</h3>
            
            <div className="flex flex-wrap items-center gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Số câu hỏi</label>
                <div className="flex gap-2">
                  {[5, 10, 20, 30].map((num) => (
                    <button
                      key={num}
                      onClick={() => setQuestionCount(num)}
                      className={`px-4 py-2 rounded-lg font-medium transition ${
                        questionCount === num
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1"></div>

              <button
                onClick={startPractice}
                disabled={starting}
                className="px-8 py-3 bg-linear-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {starting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang tải...
                  </span>
                ) : (
                  "🚀 Bắt đầu luyện tập"
                )}
              </button>
            </div>
          </div>
        )}

        {/* Practice History Link */}
        <div className="mt-8 text-center">
          <Link 
            href="/practice/history" 
            className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-2"
          >
            📊 Xem lịch sử luyện tập
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
