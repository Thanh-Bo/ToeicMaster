"use client";

import React, { useState, useEffect } from "react";
import { useParams , useRouter } from "next/navigation";
import { ArrowRight, CheckCircle, X, Loader, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import Flashcard from "@/app/components/vocabulary/Flashcard";
import MatchingGame from "@/app/components/vocabulary/MatchingGame";
import { vocabularyService } from "@/app/services/vocabularyService";
import VocabularyTest from "@/app/components/vocabulary/VocabularyTest";
import WordDetailFeedback from "@/app/components/vocabulary/WordDetailFeedback";

type Phase = "LEARN" | "PRACTICE_GAME" | "TEST" | "COMPLETED";
type SubPhase = "FLASHCARD" | "LISTEN_WRITE" | "FILL_BLANK";

export default function TopicStudyPage() {
  const params = useParams();
  const topicId = params?.topicId as string;
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("LEARN");
  const [subPhase, setSubPhase] = useState<SubPhase>("FLASHCARD");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [words, setWords] = useState<any[]>([]);
  const [topicTitle, setTopicTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [userInput, setUserInput] = useState("");
  const [inputFeedback, setInputFeedback] = useState("");
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const data = await vocabularyService.getWordsByTopic(Number(topicId));
        setWords(data);

        // Lấy tên topic
        const topics = await vocabularyService.getTopics();
        const topic = topics.find((t) => t.id === Number(topicId));
        setTopicTitle(topic?.title || "Topic");
      } catch (err: any) {
        setError(err.message || "Lỗi khi tải từ vựng");
      } finally {
        setLoading(false);
      }
    };

    if (topicId) fetchWords();
  }, [topicId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-900 flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center p-4">
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-400 dark:border-red-600 rounded-2xl p-8 max-w-md text-center shadow-lg">
          <div className="text-5xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-red-700 dark:text-red-400 mb-3">Có lỗi xảy ra</h2>
          <p className="text-red-600 dark:text-red-300 mb-6 font-semibold">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-xl"
          >
            🔄 Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (words.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-900 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Không có từ vựng</p>
      </div>
    );
  }

  const handleNextCard = () => {
    if (subPhase === "FLASHCARD") {
      setSubPhase("LISTEN_WRITE");
      setUserInput("");
      setInputFeedback("");
      setIsAnswerChecked(false);
    } else if (subPhase === "LISTEN_WRITE") {
      setSubPhase("FILL_BLANK");
      setUserInput("");
      setInputFeedback("");
      setIsAnswerChecked(false);
    } else if (subPhase === "FILL_BLANK") {
      // Move to next word
      if (currentWordIndex < words.length - 1) {
        setCurrentWordIndex((prev) => prev + 1);
        setSubPhase("FLASHCARD");
        setUserInput("");
        setInputFeedback("");
        setIsAnswerChecked(false);
      } else {
        // All words completed
        if (
          confirm(
            "Bạn đã hoàn thành tất cả từ vựng. Chuyển sang phần Luyện tập nhé?"
          )
        ) {
          setPhase("PRACTICE_GAME");
          setSubPhase("FLASHCARD");
          setCurrentWordIndex(0);
          setIsAnswerChecked(false);
        }
      }
    }
  };

  const handlePreviousSubPhase = () => {
    if (subPhase === "LISTEN_WRITE") {
      setSubPhase("FLASHCARD");
      setUserInput("");
      setInputFeedback("");
    } else if (subPhase === "FILL_BLANK") {
      setSubPhase("LISTEN_WRITE");
      setUserInput("");
      setInputFeedback("");
    }
  };

  



  const handleCheckListenWrite = () => {
    if (!userInput.trim()) {
      setInputFeedback("❌ Vui lòng nhập từ!");
      return;
    }
    const isCorrect =
      userInput.toLowerCase().trim() ===
      words[currentWordIndex].word.toLowerCase().trim();
    setIsAnswerCorrect(isCorrect);
    setInputFeedback(
      isCorrect
        ? "✅ Chính xác!"
        : `❌ Sai rồi! Đáp án là: ${words[currentWordIndex].word}`
    );
    setIsAnswerChecked(true);
  };

  const handleCheckFillBlank = () => {
    if (!userInput.trim()) {
      setInputFeedback("❌ Vui lòng nhập từ!");
      return;
    }
    const isCorrect =
      userInput.toLowerCase().trim() ===
      words[currentWordIndex].word.toLowerCase().trim();
    setIsAnswerCorrect(isCorrect);
    setInputFeedback(
      isCorrect
        ? "✅ Chính xác!"
        : `❌ Sai rồi! Đáp án là: ${words[currentWordIndex].word}`
    );
    setIsAnswerChecked(true);
  };

  const handleContinueAfterCheck = () => {
    setIsAnswerChecked(false);
    setInputFeedback("");
    setUserInput("");
    handleNextCard();
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 p-4 md:p-8">
     
      {/* Header Process Bar & Exit Button */}
      <div className="max-w-4xl mx-auto mb-12">
         <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 mb-6 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors font-bold"
          >
            <ArrowLeft size={20} />
            <span>Quay lại</span>
          </button>
        <div className="bg-white dark:bg-zinc-900/70 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-gray-200 dark:border-zinc-800 flex items-center gap-4">
          
          {/* EXIT BUTTON */}
         

          {/* PROCESS STEPS (Flex-1 để chiếm hết phần còn lại) */}
          <div className="flex-1 flex justify-between items-center px-2">
            {[
              { phase: "LEARN", number: "1", label: "Học từ", icon: "📚" },
              {
                phase: "PRACTICE_GAME",
                number: "2",
                label: "Ghép thẻ",
                icon: "🎮",
              },
              { phase: "TEST", number: "3", label: "Kiểm tra", icon: "✍️" },
            ].map((step, idx) => (
              <React.Fragment key={step.phase}>
                <button
                  onClick={() => setPhase(step.phase as Phase)}
                  className={`flex flex-col items-center gap-2 transition-all ${
                    phase === step.phase ? "scale-110" : "hover:scale-105"
                  } cursor-pointer`}
                >
                  <div
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-sm transition-all ${
                      phase === step.phase
                        ? "bg-blue-600 text-white border-blue-600 shadow-lg"
                        : "border-gray-300 dark:border-zinc-600 text-gray-600 dark:text-gray-400 hover:border-blue-400 dark:hover:border-blue-500"
                    }`}
                  >
                    {step.number}
                  </div>
                  <span
                    className={`text-xs font-bold text-center transition-colors hidden md:block ${
                      phase === step.phase
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                    }`}
                  >
                    {step.label}
                  </span>
                </button>
                {idx < 2 && (
                  <div
                    className={`flex-1 h-1 mx-2 md:mx-4 rounded-full transition-all ${
                      phase === step.phase ||
                      (phase === "PRACTICE_GAME" && idx === 0) ||
                      (phase === "TEST" && idx < 1)
                        ? "bg-blue-600"
                        : "bg-gray-200 dark:bg-zinc-700"
                    }`}
                  ></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto">
        {phase === "LEARN" && (
          <div className="flex flex-col items-center">
            {/* Sub-phase indicator */}
            <div className="mb-6 text-center">
              <div className="inline-block bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg mb-4">
                Từ {currentWordIndex + 1} / {words.length}
              </div>
              <div className="flex gap-2 md:gap-3 justify-center flex-wrap">
                <button
                  onClick={() => setSubPhase("FLASHCARD")}
                  disabled={subPhase === "LISTEN_WRITE" || subPhase === "FILL_BLANK"}
                  className={`px-3 md:px-4 py-2 md:py-2 rounded-full text-xs md:text-sm font-bold transition-all cursor-pointer ${
                    subPhase === "FLASHCARD"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 dark:bg-zinc-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  }`}
                >
                  1️⃣ Flashcard
                </button>
                <button
                  onClick={() => setSubPhase("LISTEN_WRITE")}
                  disabled={subPhase === "FLASHCARD"}
                  className={`px-3 md:px-4 py-2 md:py-2 rounded-full text-xs md:text-sm font-bold transition-all cursor-pointer ${
                    subPhase === "LISTEN_WRITE"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 dark:bg-zinc-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  }`}
                >
                  2️⃣ Nghe & Viết
                </button>
                <button
                  onClick={() => setSubPhase("FILL_BLANK")}
                  disabled={subPhase === "FLASHCARD" || subPhase === "LISTEN_WRITE"}
                  className={`px-3 md:px-4 py-2 md:py-2 rounded-full text-xs md:text-sm font-bold transition-all cursor-pointer ${
                    subPhase === "FILL_BLANK"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 dark:bg-zinc-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  }`}
                >
                  3️⃣ Điền từ
                </button>
              </div>
            </div>

            {/* Sub-phase content */}
            {subPhase === "FLASHCARD" && (
              <div className="w-full animate-fadeIn">
                <Flashcard
                  word={words[currentWordIndex]}
                 
                  onBookmark={() => console.log("Bookmark")}
                />
              </div>
            )}

            {subPhase === "LISTEN_WRITE" && (
              <div className="w-full max-w-3xl animate-fadeIn pb-20 md:pb-0">
                <div className="bg-white dark:bg-zinc-900 text-gray-900 dark:text-white rounded-3xl border border-zinc-300 dark:border-zinc-700 p-6 md:p-12">
                  <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center">
                    🎧 Nghe và viết lại
                  </h2>

                  {/* Audio button */}
                  <div className="flex justify-center mb-8 md:mb-10">
                    <button
                      onClick={() => {
                        const audioUrl = words[currentWordIndex].audioUrl;
                        const word = words[currentWordIndex].word;

                        if (audioUrl) {
                          // Play audio file
                          const audio = new Audio(audioUrl);
                          audio
                            .play()
                            .then(() => {
                              console.log("Audio playing successfully");
                            })
                            .catch((e) => {
                              console.error("Audio play error:", e);
                              // Fallback to speech synthesis if audio file fails
                              const utterance = new SpeechSynthesisUtterance(
                                word
                              );
                              utterance.lang = "en-US";
                              window.speechSynthesis.speak(utterance);
                            });
                        } else {
                          // Use browser speech synthesis as fallback
                          const utterance = new SpeechSynthesisUtterance(word);
                          utterance.lang = "en-US";
                          window.speechSynthesis.speak(utterance);
                        }
                      }}
                      className="w-20 h-20 md:w-28 md:h-28 rounded-full flex items-center justify-center transition-all transform hover:scale-110 shadow-xl border-4 border-white/30 bg-linear-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                    >
                      <span className="text-4xl md:text-6xl">🔊</span>
                    </button>
                  </div>

                  {/* Instructions */}
                  <p className="text-center text-base md:text-lg mb-6 md:mb-8 font-semibold text-white">
                    Bạn nghe từ ở trên. Gõ lại từ bạn vừa nghe
                  </p>

                  {/* Input field */}
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => {
                      setUserInput(e.target.value);
                      setInputFeedback("");
                    }}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleCheckListenWrite();
                      }
                    }}
                    placeholder="Nhập từ ở đây..."
                    className="w-full px-4 md:px-6 py-3 md:py-4 rounded-2xl text-gray-900 dark:text-white border border-zinc-200 dark:border-zinc-700 text-center text-base md:text-xl font-semibold mb-6 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:focus:ring-blue-400 transition-all"
                  />

                  {/* Feedback Card */}
                  {isAnswerChecked ? (
                    <div
                      className={`rounded-2xl p-8 mb-6 border ${
                        isAnswerCorrect
                          ? "bg-green-100 border-green-400 dark:bg-green-900/40 dark:border-green-600" // Màu xanh dịu
                          : "bg-red-100 border-red-400 dark:bg-red-900/40 dark:border-red-600"
                      }`}
                    >
                      <p className="text-center text-2xl font-bold text-white mb-4">
                        <WordDetailFeedback word={words[currentWordIndex]} />
                      </p>
                    </div>
                  ) : (
                    <p className="text-center text-sm text-white/70">
                      Nhấn Enter hoặc bấm Tiếp theo để kiểm tra
                    </p>
                  )}

                  {/* Hint */}
                </div>
              </div>
            )}

            {subPhase === "FILL_BLANK" && (
              <div className="w-full max-w-3xl animate-fadeIn">
                <div className="bg-white dark:bg-zinc-900 text-gray-900 dark:text-white border border-gray-200 dark:border-zinc-800 rounded-3xl shadow-xl p-8 md:p-12 transition-all duration-300">
                  <h2 className="text-3xl font-extrabold mb-8 text-center bg-clip-text text-transparent bg-linear-to-br from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                    📝 Điền từ vào chỗ trống
                  </h2>

                  {/* Meaning Hint */}
                  <div className="bg-blue-50 dark:bg-zinc-900/20 border border-blue-100 dark:border-zinc-800 rounded-2xl p-6 mb-10 text-center shadow-sm">
                    <p className="text-xl md:text-2xl font-bold text-blue-700 dark:text-blue-300">
                      {words[currentWordIndex].meaning || "Không có định nghĩa"}
                    </p>
                  </div>

                  {/* Input Area */}
                  <div className="relative bg-gray-50 dark:bg-zinc-900 rounded-2xl p-8 mb-10 border-2 border-dashed border-gray-300 dark:border-zinc-700 hover:border-blue-400 dark:hover:border-blue-500 transition-colors group">
                    
                    {/* Visual Layer (Hiển thị ký tự) */}
                    <div className="flex justify-center flex-wrap gap-2 md:gap-3">
                      {words[currentWordIndex].word
                        .split("")
                        .map((char: string, idx: number) => {
                          const word = words[currentWordIndex].word;
                          const totalLen = word.length;
                          // Logic gợi ý: Hiện ký tự đầu, cuối và giữa
                          const isHint =
                            idx === 0 ||
                            idx === totalLen - 1 ||
                            idx === Math.floor(totalLen / 2);

                          const userChar = userInput[idx];
                          const displayChar = userChar ? userChar : (isHint ? char : "");
                          const isCurrentCursor = idx === userInput.length;

                          return (
                            <div
                              key={idx}
                              className={`
                                w-10 h-14 md:w-14 md:h-16 flex items-center justify-center text-3xl md:text-4xl font-mono font-bold rounded-lg transition-all duration-200 select-none
                                ${userChar 
                                  ? "bg-blue-600 text-white shadow-md transform scale-105" // Đã nhập
                                  : isHint 
                                    ? "bg-gray-200 dark:bg-zinc-800 text-gray-500 dark:text-zinc-500" // Gợi ý
                                    : "bg-gray-100 dark:bg-zinc-800 text-transparent border border-gray-300 dark:border-zinc-700" // Chưa nhập
                                }
                                ${isCurrentCursor ? "ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-zinc-900" : ""}
                              `}
                            >
                              {displayChar.toUpperCase()}
                            </div>
                          );
                        })}
                    </div>

                    {/* Input Logic (Invisible) */}
                    <input
                      type="text"
                      value={userInput}
                      autoFocus
                      maxLength={words[currentWordIndex].word.length}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^a-zA-Z]/g, "");
                        setUserInput(val.toLowerCase());
                        setInputFeedback("");
                        setIsAnswerChecked(false);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleCheckFillBlank();
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-text z-10"
                      autoComplete="off"
                      autoCorrect="off"
                      spellCheck="false"
                    />

                    <p className="text-center text-sm text-gray-400 mt-6 font-medium">
                      {words[currentWordIndex].word.length} ký tự • Hãy gõ trực tiếp
                    </p>
                  </div>

                  {/* Feedback Section */}
                  {isAnswerChecked ? (
                    <div
                      className={`rounded-2xl p-6 border-l-4 shadow-sm transition-all duration-500 animate-in fade-in slide-in-from-bottom-2 ${
                        isAnswerCorrect
                          ? "bg-green-50 border-green-500 dark:bg-green-900/20 dark:border-green-500"
                          : "bg-red-50 border-red-500 dark:bg-red-900/20 dark:border-red-500"
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2 mb-4">
                        <span className="text-2xl">{isAnswerCorrect ? "🎉" : "😢"}</span>
                        <h3 className={`text-xl font-bold ${
                          isAnswerCorrect 
                            ? "text-green-700 dark:text-green-400" 
                            : "text-red-700 dark:text-red-400"
                        }`}>
                          {isAnswerCorrect ? "Chính xác!" : "Chưa đúng, hãy xem lại nhé!"}
                        </h3>
                      </div>
                      
                      {/* Component chi tiết từ vựng (trong suốt) */}
                      <WordDetailFeedback word={words[currentWordIndex]} />
                    </div>
                  ) : (
                    <div className="text-center h-12 flex items-center justify-center text-gray-400 animate-pulse">
                      <span>⌨️ Nhập đủ từ rồi nhấn Enter</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="mt-8 md:mt-10 flex gap-3 md:gap-4 w-full max-w-md px-4 md:px-0">
              <button
                onClick={
                  subPhase === "FLASHCARD"
                    ? () => {
                        if (currentWordIndex > 0) {
                          setCurrentWordIndex((prev) => prev - 1);
                        }
                      }
                    : handlePreviousSubPhase
                }
                disabled={subPhase === "FLASHCARD" && currentWordIndex === 0}
                className="px-4 md:px-6 py-2 md:py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed font-bold transition-all border border-gray-300 dark:border-zinc-700 text-sm md:text-base"
              >
                ← Quay lại
              </button>
              <button
                onClick={() => {
                  if (subPhase === "LISTEN_WRITE") {
                    if (isAnswerChecked) {
                      handleContinueAfterCheck();
                    } else {
                      handleCheckListenWrite();
                    }
                  } else if (subPhase === "FILL_BLANK") {
                    if (isAnswerChecked) {
                      handleContinueAfterCheck();
                    } else {
                      handleCheckFillBlank();
                    }
                  } else {
                    handleNextCard();
                  }
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 md:py-3 rounded-xl shadow-xl flex items-center justify-center gap-2 transition-all hover:shadow-2xl text-sm md:text-base"
              >
                Tiếp theo <ArrowRight size={16} className="hidden md:inline" />
              </button>
            </div>
          </div>
        )}

        {phase === "PRACTICE_GAME" && (
          <div className="flex flex-col gap-4">
            <MatchingGame
              words={words}
              onComplete={() => {
                alert("Xuất sắc! Giờ hãy làm bài kiểm tra cuối cùng.");
                setPhase("TEST");
              }}
            />
            <button
              onClick={() => {
                if (confirm("⚠️ Bạn chắc chắn muốn bỏ qua phần luyện tập và đi kiểm tra? Điểm số sẽ không được tính.")) {
                  setPhase("TEST");
                }
              }}
              className="w-full max-w-md mx-auto px-6 py-3 bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-800 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl"
            >
              ⚠️ Bỏ qua và đi kiểm tra
            </button>
          </div>
        )}

        {phase === "TEST" && (
          <div className="text-center py-16 bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-gray-200 dark:border-zinc-800">
            <VocabularyTest
              topicId={Number(topicId)}
              topicTitle={topicTitle}
              onComplete={() => setPhase("COMPLETED")}
            />
          </div>
        )}

        {phase === "COMPLETED" && (
          <div className="text-center py-20 bg-white dark:bg-zinc-900  rounded-2xl shadow-lg border border-gray-200 dark:border-zinc-800">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-2">
              Chúc mừng!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Bạn đã hoàn thành chủ đề này.
            </p>
            <a
              href="/vocabulary"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg inline-block transition-all"
            >
              Về trang Từ vựng
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
