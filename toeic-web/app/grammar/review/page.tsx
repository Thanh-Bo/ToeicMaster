"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Grammar } from "@/app/types";
import { grammarService } from "@/app/services/grammarService";
import { GrammarFlashcard } from "@/app/components/grammar/GrammarFlashcard";
import { ArrowLeft, Loader } from "lucide-react";

export default function GrammarReviewPage() {
  const router = useRouter();
  const [grammars, setGrammars] = useState<Grammar[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [results, setResults] = useState({
    correct: 0,
    incorrect: 0,
    total: 0,
  });

  useEffect(() => {
    loadGrammarsForReview();
  }, []);

  const loadGrammarsForReview = async () => {
    try {
      setLoading(true);
      // Get grammars ready for review (SRS)
      const data = await grammarService.getForReview();
      if (data && data.length > 0) {
        setGrammars(data);
      } else {
        setCompleted(true);
      }
    } catch (error) {
      console.error("Error loading grammars for review:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMark = async (isCorrect: boolean) => {
    const currentGrammar = grammars[currentIndex];

    try {
      // Update user grammar progress
      await grammarService.updateProgress(currentGrammar.id, {
        isCorrect,
        level: isCorrect ? 3 : 1, // 3 = Mastered, 1 = Learning
      });

      // Update results
      setResults((prev) => ({
        ...prev,
        correct: prev.correct + (isCorrect ? 1 : 0),
        incorrect: prev.incorrect + (isCorrect ? 0 : 1),
        total: prev.total + 1,
      }));

      // Move to next or complete
      if (currentIndex < grammars.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setCompleted(true);
      }
    } catch (error) {
      console.error("Error updating grammar progress:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Đang tải thẻ flashcard...
          </p>
        </div>
      </div>
    );
  }

  if (grammars.length === 0 && !loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-900">
        <div className="max-w-2xl mx-auto px-4 py-12">
          <button
            onClick={() => router.push("/grammar")}
            className="inline-flex items-center gap-2 mb-8 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            Quay lại
          </button>
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
              Không có quy tắc nào sẵn sàng ôn tập
            </p>
            <p className="text-gray-500 dark:text-gray-500 text-sm">
              Hãy học thêm các quy tắc mới hoặc quay lại vào một lúc khác
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (completed) {
    const percentage = Math.round(
      (results.correct / (results.correct + results.incorrect)) * 100
    );
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-900">
        <div className="max-w-2xl mx-auto px-4 py-12">
          <button
            onClick={() => router.push("/grammar")}
            className="inline-flex items-center gap-2 mb-8 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            Quay lại
          </button>

          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Hoàn thành ôn tập!
            </h1>

            <div className="rounded-xl border-2 border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-8 my-8">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Đúng
                  </p>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {results.correct}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Sai
                  </p>
                  <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                    {results.incorrect}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Tỉ lệ
                  </p>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {percentage}%
                  </p>
                </div>
              </div>

              <div className="text-sm text-gray-600 dark:text-gray-400">
                Bạn đã ôn tập {results.total} quy tắc
              </div>
            </div>

            <button
              onClick={() => {
                setCurrentIndex(0);
                setCompleted(false);
                setResults({ correct: 0, incorrect: 0, total: 0 });
                loadGrammarsForReview();
              }}
              className="px-8 py-3 rounded-lg font-semibold border-2 border-blue-400 dark:border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all duration-200"
            >
              Ôn tập lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <button
          onClick={() => router.push("/grammar")}
          className="inline-flex items-center gap-2 mb-8 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          Quay lại
        </button>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Ôn tập flashcard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-12">
          Nhấp vào thẻ để lật và xem chi tiết quy tắc
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          <div className="rounded-lg border-2 border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-4 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Đúng
            </p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {results.correct}
            </p>
          </div>
          <div className="rounded-lg border-2 border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-4 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Sai
            </p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {results.incorrect}
            </p>
          </div>
          <div className="rounded-lg border-2 border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-4 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Tổng
            </p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {results.total}/{grammars.length}
            </p>
          </div>
        </div>

        {/* Flashcard */}
        <GrammarFlashcard
          grammar={grammars[currentIndex]}
          cardNumber={currentIndex + 1}
          totalCards={grammars.length}
          onMark={handleMark}
          isLast={currentIndex === grammars.length - 1}
        />
      </div>
    </div>
  );
}
