"use client";

import React, { useState, useEffect } from "react";
import { useParams , useRouter } from "next/navigation";
import { ArrowRight, CheckCircle, X, Loader, ArrowLeft, Gamepad2, PenTool, Volume2, Sparkles, FileText, Keyboard, SkipForward, BookText, Check, CircleCheckBig } from "lucide-react";
import toast from "react-hot-toast";
import Flashcard from "@/app/components/vocabulary/Flashcard";
import MatchingGame from "@/app/components/vocabulary/MatchingGame";
import { vocabularyService } from "@/app/services/vocabularyService";
import { useAuth } from "@/app/contexts/AuthContext";
import VocabularyTest from "@/app/components/vocabulary/VocabularyTest";
import WordDetailFeedback from "@/app/components/vocabulary/WordDetailFeedback";
import { playSound, playWordAudio } from "@/app/lib/audio";

type Phase = "LEARN" | "PRACTICE_GAME" | "TEST" | "COMPLETED";
type SubPhase = "FLASHCARD" | "LISTEN_WRITE" | "FILL_BLANK";

export default function TopicStudyPage() {
  const params = useParams();
  const topicId = params?.topicId as string;
  const router = useRouter();
  const { user } = useAuth();
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
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [completedPhases, setCompletedPhases] = useState<{
    matchingGame: boolean;
    test: boolean;
  }>({ matchingGame: false, test: false });
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);

  // Start session when entering page
  useEffect(() => {
    const startSession = async () => {
      if (user?.id) {
        try {
          const response = await vocabularyService.startSession(user.id);
          setSessionId(response.sessionId);
        } catch (error) {
          console.error("Error starting session:", error);
        }
      }
    };
    startSession();
  }, [user?.id]);

  // End session when leaving page
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (sessionId && user?.id) {
        // Use sendBeacon for reliable delivery on page close
        const url = `${process.env.NEXT_PUBLIC_API_URL || ''}/users/${user.id}/vocabulary/sessions/${sessionId}/end`;
        navigator.sendBeacon?.(url, '');
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // Also end session on component unmount
      if (sessionId && user?.id) {
        vocabularyService.endSession(user.id, sessionId).catch(console.error);
      }
    };
  }, [sessionId, user?.id]);

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const data = await vocabularyService.getWordsByTopic(topicId as string);
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
          <div className="flex justify-center mb-4"><X size={64} className="text-red-600 dark:text-red-400" /></div>
          <h2 className="text-2xl font-bold text-red-700 dark:text-red-400 mb-3">Có lỗi xảy ra</h2>
          <p className="text-red-600 dark:text-red-300 mb-6 font-semibold">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-xl"
          >
             Thử lại
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
      // Auto-play pronunciation of the word
      const currentWord = words[currentWordIndex];
      if (currentWord) {
        setTimeout(() => {
          playWordAudio(currentWord.word, currentWord.audioUrl);
        }, 300);
      }
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
      toast.error("Vui lòng nhập từ trước khi kiểm tra!");
      return;
    }
    const isCorrect =
      userInput.toLowerCase().trim() ===
      words[currentWordIndex].word.toLowerCase().trim();
    setIsAnswerCorrect(isCorrect);
    setInputFeedback(
      isCorrect
        ? "Chính xác!"
        : `Sai rồi! Đáp án là: ${words[currentWordIndex].word}`
    );
    setIsAnswerChecked(true);

    // Play sounds
    if (isCorrect) {
      playSound('correct');
    } else {
      playSound('wrong');
    }
    // Always play word pronunciation after check
    setTimeout(() => {
      playWordAudio(words[currentWordIndex].word, words[currentWordIndex].audioUrl);
    }, isCorrect ? 300 : 600);
  };

  const handleCheckFillBlank = () => {
    if (!userInput.trim()) {
      toast.error("Vui lòng nhập từ trước khi kiểm tra!");
      return;
    }
    const isCorrect =
      userInput.toLowerCase().trim() ===
      words[currentWordIndex].word.toLowerCase().trim();
    setIsAnswerCorrect(isCorrect);
    setInputFeedback(
      isCorrect
        ? "Chính xác!"
        : `Sai rồi! Đáp án là: ${words[currentWordIndex].word}`
    );
    setIsAnswerChecked(true);

    // Play sounds
    if (isCorrect) {
      playSound('correct');
    } else {
      playSound('wrong');
    }
    // Always play word pronunciation after check
    setTimeout(() => {
      playWordAudio(words[currentWordIndex].word, words[currentWordIndex].audioUrl);
    }, isCorrect ? 300 : 600);
  };

  const handleContinueAfterCheck = () => {
    setIsAnswerChecked(false);
    setInputFeedback("");
    setUserInput("");
    handleNextCard();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-800 p-2 md:p-4">
      {/* Header Section */}
      <div className="max-w-3xl mx-auto mb-4">
        {/* Back Button */}
        <button
          onClick={() => {
            // Only show alert if user hasn't completed ANY phase yet
            if (!completedPhases.matchingGame && !completedPhases.test) {
              const currentLevel = words[0]?.userVocabulary?.level || 1;
              const nextLevel = Math.min(currentLevel + 1, 5);
              
              if (window.confirm(`Bạn chưa hoàn thành Ghép thẻ hoặc Kiểm tra để tiến đến Giai đoạn ${nextLevel}.\n\nNhấn "OK" để thoát, "Cancel" để ở lại.`)) {
                router.back();
              }
              return;
            }
            router.back();
          }}
          className="flex items-center gap-2 px-2.5 py-1.5 mb-3 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800/50 rounded-lg transition-all font-semibold group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>Quay lại</span>
        </button>

        {/* Progress Bar Card */}
        <div className="bg-white dark:bg-zinc-900/70 backdrop-blur-sm p-3 rounded-xl shadow-md border border-gray-200 dark:border-zinc-800">
          {/* Title */}
          <h1 className="text-base md:text-lg font-bold text-gray-900 dark:text-white mb-3">
            {topicTitle}
          </h1>

          {/* Process Steps */}
          <div className="flex justify-between items-center gap-3">
            {[
              { phase: "LEARN", number: "1", label: "Học từ", icon: BookText  },
              { phase: "PRACTICE_GAME", number: "2", label: "Ghép thẻ", icon: Gamepad2 },
              { phase: "TEST", number: "3", label: "Kiểm tra", icon: PenTool },
            ].map((step, idx) => (
              <React.Fragment key={step.phase}>
                <button
                  onClick={() => setPhase(step.phase as Phase)}
                  className={`flex flex-col items-center gap-1.5 transition-all flex-1 cursor-pointer`}
                >
                  <div
                    className={`w-7 h-7 rounded-full border-2 flex items-center justify-center font-bold text-xs transition-all shadow-sm ${
                      phase === step.phase
                        ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white border-blue-600 shadow-lg scale-105"
                        : "border-gray-300 dark:border-zinc-600 text-gray-600 dark:text-gray-400 hover:border-blue-400 dark:hover:border-blue-500 hover:scale-105"
                    }`}
                  >
                    <step.icon size={12} />
                  </div>
                  <span
                    className={`text-[9px] font-bold text-center transition-colors hidden md:block ${
                      phase === step.phase
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {step.label}
                  </span>
                </button>
                {idx < 2 && (
                  <div
                    className={`h-1 flex-1 rounded-full transition-all ${
                      phase === step.phase || (phase === "PRACTICE_GAME" && idx === 0) || (phase === "TEST" && idx < 1)
                        ? "bg-gradient-to-r from-blue-600 to-blue-500"
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
      <div className="max-w-3xl mx-auto">
        {phase === "LEARN" && (
          <div className="flex flex-col items-center">
            {/* Progress Badge */}
            <div className="mb-3 flex flex-col items-center gap-2">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-1.5 rounded-full shadow-md">
                <span className="text-xs font-bold">Từ {currentWordIndex + 1} / {words.length}</span>
                <div className="h-1.5 w-20 bg-white/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white transition-all duration-300"
                    style={{ width: `${((currentWordIndex + 1) / words.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Sub-phase Tabs */}
              <div className="flex gap-1.5 justify-center flex-wrap">
                <button
                  onClick={() => setSubPhase("FLASHCARD")}
                  disabled={subPhase === "LISTEN_WRITE" || subPhase === "FILL_BLANK"}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                    subPhase === "FLASHCARD"
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md scale-105"
                      : "bg-white dark:bg-zinc-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-zinc-700 hover:border-blue-400 dark:hover:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  }`}
                >
                  <BookText  className="inline w-3 h-3 mr-1" />1. Thẻ học
                </button>
                <button
                  onClick={() => setSubPhase("LISTEN_WRITE")}
                  disabled={subPhase === "FLASHCARD"}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                    subPhase === "LISTEN_WRITE"
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md scale-105"
                      : "bg-white dark:bg-zinc-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-zinc-700 hover:border-blue-400 dark:hover:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  }`}
                >
                  <Volume2 className="inline w-3 h-3 mr-1" />2. Nghe & Viết
                </button>
                <button
                  onClick={() => setSubPhase("FILL_BLANK")}
                  disabled={subPhase === "FLASHCARD" || subPhase === "LISTEN_WRITE"}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                    subPhase === "FILL_BLANK"
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md scale-105"
                      : "bg-white dark:bg-zinc-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-zinc-700 hover:border-blue-400 dark:hover:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  }`}
                >
                  <FileText className="inline w-3 h-3 mr-1" />3. Điền từ
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
              <div className="w-full max-w-xl animate-fadeIn pb-6 md:pb-0">
                <div className="bg-white dark:bg-zinc-900 text-gray-900 dark:text-white rounded-xl border border-gray-200 dark:border-zinc-700 p-4 md:p-6 shadow-md">
                  <h2 className="text-base md:text-lg font-bold mb-3 text-center">
                    <Volume2 className="inline w-4 h-4 mr-2" />
                    Nghe và viết lại
                  </h2>

                  {/* Audio Button */}
                  <div className="flex justify-center mb-4">
                    <button
                      onClick={() => {
                        const audioUrl = words[currentWordIndex].audioUrl;
                        const word = words[currentWordIndex].word;

                        if (audioUrl) {
                          const audio = new Audio(audioUrl);
                          audio
                            .play()
                            .then(() => {
                              console.log("Audio playing successfully");
                            })
                            .catch((e) => {
                              console.error("Audio play error:", e);
                              const utterance = new SpeechSynthesisUtterance(word);
                              utterance.lang = "en-US";
                              window.speechSynthesis.speak(utterance);
                            });
                        } else {
                          const utterance = new SpeechSynthesisUtterance(word);
                          utterance.lang = "en-US";
                          window.speechSynthesis.speak(utterance);
                        }
                      }}
                      className="w-12 h-12 rounded-full flex items-center justify-center transition-all transform hover:scale-105 shadow-lg border-2 border-white/20 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 active:scale-95"
                    >
                      <Volume2 size={24} className="text-white" />
                    </button>
                  </div>

                  <p className="text-center text-xs md:text-sm mb-3 font-medium">
                    Bạn nghe từ ở trên. Gõ lại từ bạn vừa nghe
                  </p>

                  {/* Input */}
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => {
                      setUserInput(e.target.value);
                      setInputFeedback("");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        if (isAnswerChecked) {
                          // If already checked, proceed to next
                          handleContinueAfterCheck();
                        } else {
                          // First time - check answer
                          handleCheckListenWrite();
                        }
                      }
                    }}
                    placeholder="Nhập từ ở đây..."
                    className="w-full px-3 py-2.5 rounded-lg text-gray-900 dark:text-white border-2 border-gray-200 dark:border-zinc-700 text-center text-sm md:text-base font-semibold mb-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all bg-white dark:bg-zinc-800"
                  />

                  {/* Feedback */}
                  {isAnswerChecked ? (
                    <div
                      className={`rounded-lg p-3 border-l-4 shadow-sm transition-all ${
                        isAnswerCorrect
                          ? "bg-green-50 dark:bg-green-900/20 border-green-500"
                          : "bg-red-50 dark:bg-red-900/20 border-red-500"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {isAnswerCorrect ? (
                          <CircleCheckBig  size={20} className="text-green-600 dark:text-green-400" />
                        ) : (
                          <X size={20} className="text-red-600 dark:text-red-400" />
                        )}
                        <h3 className={`text-sm font-bold ${isAnswerCorrect ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}`}>
                          {isAnswerCorrect ? "Chính xác!" : "Chưa đúng!"}
                        </h3>
                      </div>
                      <WordDetailFeedback word={words[currentWordIndex]} />
                    </div>
                  ) : (
                    <p className="text-center text-xs text-gray-400"><Keyboard className="inline w-3 h-3 mr-1" />Nhấn Enter để kiểm tra</p>
                  )}
                </div>
              </div>
            )}

            {subPhase === "FILL_BLANK" && (
              <div className="w-full max-w-xl animate-fadeIn">
                <div className="bg-white dark:bg-zinc-900 text-gray-900 dark:text-white border border-gray-200 dark:border-zinc-700 rounded-xl shadow-md p-4 md:p-6 transition-all">
                  <h2 className="text-base md:text-lg font-bold mb-3 text-center">
                    <FileText className="inline w-4 h-4 mr-2" />
                    Điền từ vào chỗ trống
                  </h2>

                  {/* Meaning Hint */}
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700 rounded-lg p-3 mb-4">
                    <p className="text-sm md:text-base font-bold text-blue-700 dark:text-blue-300 text-center">
                      {words[currentWordIndex].meaning || "Không có định nghĩa"}
                    </p>
                  </div>

                  {/* Input Area */}
                  <div className="relative bg-gray-50 dark:bg-zinc-800 rounded-lg p-4 mb-4 border-2 border-dashed border-gray-300 dark:border-zinc-700">
                    {/* Visual Layer */}
                    <div className="flex justify-center flex-wrap gap-1.5 mb-3">
                      {words[currentWordIndex].word
                        .split("")
                        .map((char: string, idx: number) => {
                          const word = words[currentWordIndex].word;
                          const totalLen = word.length;
                          
                          // Dynamic hint based on word length
                          let isHint = false;
                          if (totalLen <= 4) {
                            // Short words: only 1 hint (first character)
                            isHint = idx === 0;
                          } else if (totalLen <= 6) {
                            // Medium words: 2 hints (first and last)
                            isHint = idx === 0 || idx === totalLen - 1;
                          } else {
                            // Long words: 3 hints (first, middle, last)
                            isHint = idx === 0 || idx === totalLen - 1 || idx === Math.floor(totalLen / 2);
                          }
                          
                          const userChar = userInput[idx];
                          const displayChar = userChar ? userChar : isHint ? char : "";
                          const isCurrentCursor = idx === userInput.length;

                          return (
                            <div
                              key={idx}
                              className={`w-6 h-8 md:w-8 md:h-10 flex items-center justify-center text-base md:text-lg font-bold rounded-md transition-all ${
                                userChar
                                  ? "bg-blue-600 text-white shadow-sm transform scale-105"
                                  : isHint
                                    ? "bg-gray-200 dark:bg-zinc-700 text-gray-600 dark:text-zinc-400"
                                    : "bg-white dark:bg-zinc-900 text-transparent border border-gray-300 dark:border-zinc-600"
                              } ${isCurrentCursor ? "ring-2 ring-blue-400 ring-offset-2 dark:ring-offset-zinc-900" : ""}`}
                            >
                              {displayChar.toUpperCase()}
                            </div>
                          );
                        })}
                    </div>

                    {/* Input Logic */}
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
                        if (e.key === "Enter") {
                          if (isAnswerChecked) {
                            // If already checked, proceed to next
                            handleContinueAfterCheck();
                          } else {
                            // First time - check answer
                            handleCheckFillBlank();
                          }
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-text"
                      autoComplete="off"
                      autoCorrect="off"
                      spellCheck="false"
                    />

                    <p className="text-center text-[11px] text-gray-500 dark:text-gray-400">
                      {words[currentWordIndex].word.length} ký tự • Nhấn Enter để kiểm tra
                    </p>
                  </div>

                  {/* Feedback */}
                  {isAnswerChecked ? (
                    <div
                      className={`rounded-lg p-3 border-l-4 shadow-sm transition-all ${
                        isAnswerCorrect
                          ? "bg-green-50 dark:bg-green-900/20 border-green-500"
                          : "bg-red-50 dark:bg-red-900/20 border-red-500"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {isAnswerCorrect ? (
                          <Sparkles size={20} className="text-green-600 dark:text-green-400" />
                        ) : (
                          <X size={20} className="text-red-600 dark:text-red-400" />
                        )}
                        <h3 className={`text-sm font-bold ${isAnswerCorrect ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}`}>
                          {isAnswerCorrect ? "Chính xác!" : "Chưa đúng!"}
                        </h3>
                      </div>
                      <WordDetailFeedback word={words[currentWordIndex]} />
                    </div>
                  ) : (
                    <div className="text-center h-8 flex items-center justify-center text-gray-400 animate-pulse text-xs">
                      <Keyboard className="inline w-3 h-3 mr-1" />
                      <span>Gõ để điền từ</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Navigation Buttons with Word Numbers */}
            <div className="mt-4 flex flex-col gap-3 w-full max-w-md px-2 md:px-0">
              {/* Word Number Navigation */}
              {subPhase === "FLASHCARD" && (
                <div className="flex items-center justify-center gap-1.5 flex-wrap">
                  {words.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentWordIndex(index);
                        setUserInput("");
                        setInputFeedback("");
                        setIsAnswerChecked(false);
                      }}
                      className={`w-8 h-8 rounded-lg font-bold text-xs transition-all ${
                        index === currentWordIndex
                          ? "bg-blue-600 text-white shadow-md"
                          : index < currentWordIndex
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-zinc-700"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              )}
              
              <div className="flex gap-2.5">
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
                  className="px-3 py-2 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800/70 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed font-bold transition-all border border-gray-300 dark:border-zinc-700 flex items-center justify-center gap-2"
                >
                  <ArrowLeft size={16} />
                  Quay lại
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
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-xs font-bold py-2 rounded-lg shadow-md flex items-center justify-center gap-2 transition-all hover:shadow-lg active:scale-95"
                >
                  Tiếp theo <ArrowRight size={16} className="hidden md:inline" />
                </button>
              </div>
            </div>
          </div>
        )}

        {phase === "PRACTICE_GAME" && (
          <div className="flex flex-col gap-6">
            <MatchingGame
              words={words}
              onComplete={async () => {
                setCompletedPhases(prev => ({ ...prev, matchingGame: true }));
                // Level up khi hoàn thành Matching Game (OR logic - chỉ cần 1 trong 2)
                try {
                  await vocabularyService.levelUp(Number(topicId));
                  toast.success("🎉 Chúc mừng! Bạn đã hoàn thành Ghép thẻ và được tăng level!");
                } catch (error) {
                  console.error("Error updating level:", error);
                  toast.success("Hoàn thành Ghép thẻ!");
                }
                setPhase("TEST");
              }}
              onSkip={() => {
                if (confirm("⚠️ Bạn có chắc chắn muốn bỏ qua phần luyện tập?")) {
                  setPhase("TEST");
                }
              }}
            />
          </div>
        )}

        {phase === "TEST" && (
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-md border border-gray-200 dark:border-zinc-800 p-4 md:p-6">
            <VocabularyTest
              topicId={Number(topicId)}
              topicTitle={topicTitle}
              skipLevelUp={completedPhases.matchingGame} // Skip nếu đã level up từ Matching Game
              onComplete={async () => {
                setCompletedPhases(prev => ({ ...prev, test: true }));
                // Chỉ hiện toast, không cần gọi API vì đã level up từ Matching Game
                if (completedPhases.matchingGame) {
                  toast.success("Hoàn thành Kiểm tra!");
                } else {
                  // Level up từ Test (chưa làm Matching Game)
                  toast.success("🎉 Chúc mừng! Bạn đã hoàn thành Kiểm tra và được tăng level!");
                }
                setPhase("COMPLETED");
              }}
            />
          </div>
        )}

        {phase === "COMPLETED" && (
          <div className="text-center py-8 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl shadow-md border border-green-200 dark:border-green-800">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle size={24} />
            </div>
            <h2 className="text-lg font-extrabold text-gray-900 dark:text-white mb-2">
              Chúc mừng! <Sparkles className="inline w-5 h-5" />
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-5 text-sm">
              Bạn đã hoàn thành chủ đề từ vựng này
            </p>
            <a
              href="/vocabulary"
              className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-md transition-all flex items-center gap-2"
            >
              
              Về trang Từ vựng
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
