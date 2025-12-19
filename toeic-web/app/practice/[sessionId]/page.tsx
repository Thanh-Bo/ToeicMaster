"use client";

import { useState, useEffect, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import { practiceService, PracticeQuestion } from "../../services/practiceService";

interface AnswerResult {
  isCorrect: boolean;
  correctOption: string;
  explanation: string | null;
}

export default function PracticeSessionPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = use(params);
  const router = useRouter();
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [results, setResults] = useState<Record<number, AnswerResult>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [partNumber, setPartNumber] = useState(0);

  useEffect(() => {
    // Timer
    const timer = setInterval(() => {
      setTimeSpent((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const loadSession = useCallback(async () => {
    // Practice mode thường bắt đầu từ /practice, không load lại session
    // Dùng localStorage để lưu tạm questions nếu cần
    const cached = localStorage.getItem(`practice_${sessionId}`);
    if (cached) {
      const data = JSON.parse(cached);
      setQuestions(data.questions);
      setPartNumber(data.partNumber);
      setLoading(false);
    } else {
      // Nếu không có cache, redirect về trang practice
      router.push("/practice");
    }
  }, [sessionId, router]);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  // Lưu session vào localStorage khi bắt đầu (từ trang practice)
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === `practice_${sessionId}` && e.newValue) {
        const data = JSON.parse(e.newValue);
        setQuestions(data.questions);
        setPartNumber(data.partNumber);
        setLoading(false);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [sessionId]);

  const currentQuestion = questions[currentIndex];

  const handleSelect = async (option: string) => {
    if (!currentQuestion || results[currentQuestion.id]) return;
    
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: option }));
    setSubmitting(true);

    try {
      const result = await practiceService.submitAnswer(
        parseInt(sessionId),
        currentQuestion.id,
        option
      );
      setResults((prev) => ({ ...prev, [currentQuestion.id]: result }));
      setShowResult(true);
    } catch (error) {
      console.error("Failed to submit answer:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowResult(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowResult(!!results[questions[currentIndex - 1]?.id]);
    }
  };

  const handleComplete = async () => {
    try {
      await practiceService.complete(parseInt(sessionId), timeSpent);
      localStorage.removeItem(`practice_${sessionId}`);
      router.push(`/practice/result/${sessionId}`);
    } catch (error) {
      console.error("Failed to complete:", error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải câu hỏi...</p>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Không tìm thấy câu hỏi</p>
          <button onClick={() => router.push("/practice")} className="text-blue-600 hover:underline">
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  const currentResult = results[currentQuestion.id];
  const correctCount = Object.values(results).filter((r) => r.isCorrect).length;

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                if (confirm("Bạn có chắc muốn thoát? Tiến độ sẽ được lưu.")) {
                  router.push("/practice");
                }
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <div>
              <span className="font-bold text-gray-800">Part {partNumber}</span>
              <span className="text-gray-400 mx-2">|</span>
              <span className="text-gray-600">
                Câu {currentIndex + 1}/{questions.length}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-green-600 font-medium">
              ✓ {correctCount}/{Object.keys(results).length}
            </div>
            <div className="bg-gray-100 px-3 py-1 rounded-full text-gray-700 font-mono">
              ⏱️ {formatTime(timeSpent)}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-gray-200">
          <div
            className="h-full bg-linear-to-r from-blue-500 to-indigo-500 transition-all"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Group content if exists */}
        {currentQuestion.groupContent && (
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
            <p className="text-gray-700 whitespace-pre-line">{currentQuestion.groupContent}</p>
            {currentQuestion.groupImageUrl && (
              <img src={currentQuestion.groupImageUrl} alt="Group" className="mt-4 max-w-full rounded-lg" />
            )}
          </div>
        )}

        {/* Audio if exists */}
        {(currentQuestion.audioUrl || currentQuestion.groupAudioUrl) && (
          <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
            <audio
              controls
              className="w-full"
              src={currentQuestion.audioUrl || currentQuestion.groupAudioUrl || undefined}
            />
          </div>
        )}

        {/* Question */}
        <div className="bg-white rounded-2xl shadow-lg border p-8">
          <div className="flex items-start gap-4 mb-6">
            <span className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg shrink-0">
              {currentIndex + 1}
            </span>
            <p className="text-lg text-gray-800 pt-1">{currentQuestion.content || "Chọn đáp án đúng:"}</p>
          </div>

          {/* Options */}
          <div className="space-y-3 ml-14">
            {currentQuestion.answers.map((answer) => {
              const isSelected = answers[currentQuestion.id] === answer.label;
              const isCorrect = currentResult?.correctOption?.toUpperCase() === answer.label.toUpperCase();
              const isWrong = isSelected && currentResult && !currentResult.isCorrect;

              let optionClass = "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50";
              if (currentResult) {
                if (isCorrect) {
                  optionClass = "border-green-500 bg-green-50 ring-2 ring-green-200";
                } else if (isWrong) {
                  optionClass = "border-red-500 bg-red-50 ring-2 ring-red-200";
                } else {
                  optionClass = "border-gray-200 bg-gray-50 opacity-60";
                }
              } else if (isSelected) {
                optionClass = "border-blue-500 bg-blue-50 ring-2 ring-blue-200";
              }

              return (
                <button
                  key={answer.label}
                  onClick={() => handleSelect(answer.label)}
                  disabled={!!currentResult || submitting}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${optionClass} disabled:cursor-not-allowed`}
                >
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm border ${
                    isCorrect ? "bg-green-500 text-white border-green-500" :
                    isWrong ? "bg-red-500 text-white border-red-500" :
                    isSelected ? "bg-blue-500 text-white border-blue-500" :
                    "bg-gray-100 text-gray-600 border-gray-300"
                  }`}>
                    {answer.label}
                  </span>
                  <span className="flex-1">{answer.content}</span>
                  {isCorrect && <span className="text-green-600 font-bold">✓</span>}
                  {isWrong && <span className="text-red-600 font-bold">✗</span>}
                </button>
              );
            })}
          </div>

          {/* Result & Explanation */}
          {showResult && currentResult && (
            <div className={`mt-6 ml-14 p-4 rounded-xl ${currentResult.isCorrect ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-lg ${currentResult.isCorrect ? "text-green-600" : "text-red-600"}`}>
                  {currentResult.isCorrect ? "🎉 Chính xác!" : "❌ Sai rồi!"}
                </span>
                {!currentResult.isCorrect && (
                  <span className="text-gray-600">
                    Đáp án đúng: <strong className="text-green-600">{currentResult.correctOption}</strong>
                  </span>
                )}
              </div>
              {currentResult.explanation && (
                <p className="text-gray-700 text-sm">{currentResult.explanation}</p>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="px-6 py-3 bg-white border rounded-xl text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            ← Câu trước
          </button>

          <div className="flex gap-2">
            {questions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentIndex(idx);
                  setShowResult(!!results[questions[idx].id]);
                }}
                className={`w-8 h-8 rounded-full text-sm font-medium transition ${
                  idx === currentIndex
                    ? "bg-blue-500 text-white"
                    : results[questions[idx].id]
                    ? results[questions[idx].id].isCorrect
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          {currentIndex === questions.length - 1 ? (
            <button
              onClick={handleComplete}
              className="px-6 py-3 bg-linear-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition"
            >
              Hoàn thành ✓
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!currentResult}
              className="px-6 py-3 bg-blue-500 text-white font-medium rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Câu tiếp →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
