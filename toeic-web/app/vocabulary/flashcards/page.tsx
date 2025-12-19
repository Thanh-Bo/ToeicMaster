"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { vocabularyService, Flashcard } from "../../services/vocabularyService";

export default function FlashcardsPage() {
  const router = useRouter();
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [stats, setStats] = useState({ correct: 0, incorrect: 0, total: 0 });
  const [completed, setCompleted] = useState(false);

  const loadFlashcards = useCallback(async () => {
    try {
      const data = await vocabularyService.getFlashcards(20);
      if (data.cards.length === 0) {
        router.push("/vocabulary");
        return;
      }
      setCards(data.cards);
      setStats({ correct: 0, incorrect: 0, total: data.cards.length });
    } catch (error) {
      console.error("Failed to load flashcards:", error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadFlashcards();
  }, [loadFlashcards]);

  const currentCard = cards[currentIndex];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleResponse = async (remembered: boolean) => {
    if (!currentCard || submitting) return;

    setSubmitting(true);
    try {
      await vocabularyService.reviewFlashcard(currentCard.id, remembered);
      
      setStats((prev) => ({
        ...prev,
        correct: prev.correct + (remembered ? 1 : 0),
        incorrect: prev.incorrect + (remembered ? 0 : 1)
      }));

      if (currentIndex < cards.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setIsFlipped(false);
      } else {
        setCompleted(true);
      }
    } catch (error) {
      console.error("Failed to submit review:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setCompleted(false);
    setStats({ correct: 0, incorrect: 0, total: cards.length });
    loadFlashcards();
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        if (!isFlipped) {
          handleFlip();
        }
      } else if (e.key === "ArrowRight" || e.key === "1") {
        if (isFlipped) handleResponse(true);
      } else if (e.key === "ArrowLeft" || e.key === "2") {
        if (isFlipped) handleResponse(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFlipped, currentIndex]);

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-50 to-pink-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
      </div>
    );
  }

  if (completed) {
    const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
    
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-50 to-pink-100 flex items-center justify-center py-8">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="bg-linear-to-r from-purple-500 to-pink-600 p-8 text-center text-white">
              <div className="text-6xl mb-4">🎉</div>
              <h1 className="text-2xl font-bold">Hoàn thành!</h1>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-green-600">{stats.correct}</div>
                  <div className="text-green-700 text-sm">Nhớ</div>
                </div>
                <div className="bg-red-50 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-red-600">{stats.incorrect}</div>
                  <div className="text-red-700 text-sm">Chưa nhớ</div>
                </div>
              </div>

              <div className="text-center mb-8">
                <div className="text-5xl font-bold text-gray-800">{accuracy}%</div>
                <div className="text-gray-500">Tỷ lệ nhớ</div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleRestart}
                  className="flex-1 py-3 bg-linear-to-r from-purple-500 to-pink-600 text-white font-bold rounded-xl"
                >
                  🔄 Học tiếp
                </button>
                <Link
                  href="/vocabulary"
                  className="flex-1 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl text-center"
                >
                  📚 Từ vựng
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentCard) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Chưa có từ vựng</h3>
          <Link href="/vocabulary" className="text-purple-600 hover:underline">
            Quay lại
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 to-pink-100 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/vocabulary" className="text-gray-600 hover:text-gray-800 flex items-center gap-2">
            ← Quay lại
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">
              {currentIndex + 1} / {cards.length}
            </span>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                ✓ {stats.correct}
              </span>
              <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                ✗ {stats.incorrect}
              </span>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="h-2 bg-gray-200 rounded-full mb-8">
          <div
            className="h-full bg-linear-to-r from-purple-500 to-pink-500 rounded-full transition-all"
            style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
          />
        </div>

        {/* Flashcard */}
        <div 
          className="perspective-1000 h-80 mb-8"
          onClick={handleFlip}
        >
          <div
            className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d cursor-pointer ${
              isFlipped ? "rotate-y-180" : ""
            }`}
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Front */}
            <div
              className="absolute w-full h-full bg-white rounded-3xl shadow-xl p-8 flex flex-col items-center justify-center backface-hidden"
              style={{ backfaceVisibility: "hidden" }}
            >
              {currentCard.isNew && (
                <span className="absolute top-4 right-4 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                  Từ mới
                </span>
              )}
              {currentCard.isDueReview && (
                <span className="absolute top-4 right-4 px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                  Ôn tập
                </span>
              )}
              
              <h2 className="text-4xl font-bold text-gray-800 mb-4">{currentCard.word}</h2>
              
              {currentCard.pronunciation && (
                <p className="text-gray-500 text-lg mb-4">{currentCard.pronunciation}</p>
              )}
              
              {currentCard.partOfSpeech && (
                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                  {currentCard.partOfSpeech}
                </span>
              )}

              {currentCard.audioUrl && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    new Audio(currentCard.audioUrl!).play();
                  }}
                  className="mt-4 p-3 bg-purple-100 text-purple-600 rounded-full hover:bg-purple-200 transition"
                >
                  🔊
                </button>
              )}

              <p className="absolute bottom-4 text-gray-400 text-sm">
                Nhấn để xem nghĩa
              </p>
            </div>

            {/* Back */}
            <div
              className="absolute w-full h-full bg-linear-to-br from-purple-500 to-pink-600 rounded-3xl shadow-xl p-8 flex flex-col items-center justify-center text-white backface-hidden rotate-y-180"
              style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
            >
              <h2 className="text-3xl font-bold mb-4">{currentCard.meaning}</h2>
              
              {currentCard.example && (
                <div className="text-center mt-4">
                  <p className="text-white/90 italic">&ldquo;{currentCard.example}&rdquo;</p>
                  {currentCard.exampleTranslation && (
                    <p className="text-white/70 text-sm mt-2">→ {currentCard.exampleTranslation}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Controls */}
        {isFlipped && (
          <div className="flex gap-4 animate-fadeIn">
            <button
              onClick={() => handleResponse(false)}
              disabled={submitting}
              className="flex-1 py-4 bg-red-500 text-white font-bold rounded-xl shadow-lg hover:bg-red-600 transition disabled:opacity-50"
            >
              ❌ Chưa nhớ
            </button>
            <button
              onClick={() => handleResponse(true)}
              disabled={submitting}
              className="flex-1 py-4 bg-green-500 text-white font-bold rounded-xl shadow-lg hover:bg-green-600 transition disabled:opacity-50"
            >
              ✓ Đã nhớ
            </button>
          </div>
        )}

        {/* Keyboard hints */}
        <div className="text-center text-gray-400 text-sm mt-6">
          <p>⌨️ Space/Enter: Lật thẻ | ← Chưa nhớ | → Đã nhớ</p>
        </div>
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
      `}</style>
    </div>
  );
}
