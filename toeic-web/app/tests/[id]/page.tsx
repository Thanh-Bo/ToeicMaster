"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import { testService } from "../../services/testService";
import { TestDetail } from "@/app/types";
import ExamRightSidebar from "@/app/components/ExamRightSidebar"; 
import AnswerOption from "@/app/components/AnswerOption";

export default function ExamPage() {
  const params = useParams();
  const testId = Number(params.id);
  const router = useRouter();

  const BASE_URL = "http://localhost:5298";
  
  // --- STATE ---
  const [testData, setTestData] = useState<TestDetail | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [currentQuestionId, setCurrentQuestionId] = useState<number | null>(null);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const hasAutoSubmitted = useRef(false);

  // --- Tính tổng số câu hỏi ---
  const totalQuestions = testData?.parts.reduce(
    (sum, part) => sum + part.groups.reduce((s, g) => s + g.questions.length, 0), 0
  ) || 0;
  const answeredCount = Object.keys(userAnswers).length;

  // --- EFFECT: Load data ---
  useEffect(() => {
    const userCookie = Cookies.get("user");
    if (userCookie) setUser(JSON.parse(userCookie));

    if (testId) {
      testService.getDetail(testId)
        .then((res) => {
          const data = res.data.data;
          setTestData(data);
          // Set timer từ duration (phút -> giây)
          const durationMinutes = data.duration || 120;
          setTimeLeft(durationMinutes * 60);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          alert("Lỗi tải đề thi!");
          setLoading(false);
        });
    }
  }, [testId]);

  // --- EFFECT: Timer countdown ---
  useEffect(() => {
    if (timeLeft <= 0 || loading) return;
    
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [loading]);

  // --- EFFECT: Auto submit khi hết giờ ---
  useEffect(() => {
    if (timeLeft === 0 && !hasAutoSubmitted.current && testData) {
      hasAutoSubmitted.current = true;
      alert("⏰ Hết giờ! Bài thi sẽ được nộp tự động.");
      handleForceSubmit();
    }
  }, [timeLeft, testData]);

  // --- Format time ---
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    }
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // --- HANDLERS ---
  const handleSelectAnswer = (questionId: number, option: string) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleScrollToQuestion = (qId: number) => {
    const element = document.getElementById(`question-${qId}`);
    if (element) {
      const headerOffset = 100; 
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      setCurrentQuestionId(qId);
      setShowMobileNav(false);
    }
  };

  const handleForceSubmit = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        testId: testId,
        answers: Object.entries(userAnswers).map(([qId, opt]) => ({
          questionId: Number(qId),
          selectedOption: opt
        }))
      };
      const res = await testService.submit(payload);
      router.push(`/results/${res.data.attemptId}`);
    } catch (error: any) {
      console.error(error);
      alert("Nộp bài thất bại!");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      alert("Bạn cần đăng nhập để nộp bài!");
      router.push("/login");
      return;
    }
    
    const unanswered = totalQuestions - answeredCount;
    const confirmMsg = unanswered > 0 
      ? `Bạn còn ${unanswered} câu chưa trả lời. Bạn có chắc chắn muốn nộp bài?`
      : "Bạn có chắc chắn muốn nộp bài?";
    
    if (!confirm(confirmMsg)) return;

    await handleForceSubmit();
  };

  // --- Keyboard shortcuts ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!currentQuestionId) return;
      
      const key = e.key.toUpperCase();
      if (['A', 'B', 'C', 'D'].includes(key)) {
        handleSelectAnswer(currentQuestionId, key);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQuestionId]);

  // --- Track current question on scroll ---
  useEffect(() => {
    if (!testData) return;
    
    const handleScroll = () => {
      const questions = document.querySelectorAll('[id^="question-"]');
      let closestId: number | null = null;
      let closestDistance = Infinity;
      
      questions.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const distance = Math.abs(rect.top - 120);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestId = Number(el.id.replace('question-', ''));
        }
      });
      
      if (closestId) setCurrentQuestionId(closestId);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [testData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-600 font-bold text-lg">⏳ Đang tải đề thi...</p>
        </div>
      </div>
    );
  }
  
  if (!testData) return <div className="p-10 text-center text-red-500">Không tìm thấy đề thi.</div>;

  // Helper: Check part type
  const getPartNumber = (partName: string): number => {
    const match = partName.match(/part\s*(\d)/i);
    return match ? parseInt(match[1]) : 0;
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-24 lg:pb-20 font-sans">
      {/* HEADER Sticky */}
      <header className="bg-white shadow-sm border-b border-gray-200 p-3 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4">
          <Link href="/" className="text-gray-500 hover:text-blue-600 font-medium flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            <span className="hidden sm:inline">Thoát</span>
          </Link>
          
          {/* Center: Title + Timer (mobile) */}
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-gray-800 truncate max-w-37.5 md:max-w-md">
              {testData.title}
            </h1>
            {/* Mobile Timer */}
            <div className={`lg:hidden px-3 py-1 rounded-full font-bold text-sm
              ${timeLeft <= 300 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-blue-100 text-blue-600'}`}>
              ⏱️ {formatTime(timeLeft)}
            </div>
          </div>
          
          {/* Progress + Submit */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
              <span className="font-bold text-blue-600">{answeredCount}</span>
              <span>/</span>
              <span>{totalQuestions}</span>
            </div>
            <button onClick={handleSubmit} disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm font-bold transition-colors disabled:opacity-50">
              {submitting ? "Đang nộp..." : "Nộp bài"}
            </button>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="max-w-7xl mx-auto px-4 mt-2">
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-linear-to-r from-blue-500 to-indigo-500 transition-all duration-300"
              style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
            ></div>
          </div>
        </div>
      </header>

      {/* Warning when time is low */}
      {timeLeft <= 300 && timeLeft > 0 && (
        <div className="bg-red-500 text-white text-center py-2 text-sm font-medium animate-pulse">
          ⚠️ Còn {Math.ceil(timeLeft / 60)} phút! Hãy hoàn thành và nộp bài.
        </div>
      )}

      {/* --- MAIN LAYOUT --- */}
      <div className="max-w-7xl mx-auto p-4 md:p-6 flex flex-col lg:flex-row gap-8">
        
        {/* 1. CỘT TRÁI: NỘI DUNG ĐỀ THI */}
        <div className="w-full lg:w-3/4">
          {testData.parts.map((part) => {
            const partNum = getPartNumber(part.name);
            
            return (
              <div key={part.id} className="mb-12">
                {/* Tiêu đề Part */}
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">{part.name}</h2>
                  <div className="h-1 flex-1 bg-gray-200 rounded-full"></div>
                  {partNum <= 4 && (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                      🎧 Listening
                    </span>
                  )}
                  {partNum >= 5 && (
                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold">
                      📖 Reading
                    </span>
                  )}
                </div>

                {/* === PART 1: Photographs === */}
                {partNum === 1 && (
                  <>
                    {/* Audio chung Part 1 */}
                    {part.groups[0]?.audioUrl && (
                      <div className="sticky top-20 z-40 mb-6">
                        <div className="bg-linear-to-r from-green-600 to-teal-600 text-white p-4 rounded-2xl shadow-lg">
                          <div className="flex items-center gap-4">
                            <div className="bg-white/20 p-2.5 rounded-full">
                              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                              </svg>
                            </div>
                            <span className="font-medium text-sm">Part 1 Audio</span>
                            <audio controls src={`${BASE_URL}${part.groups[0].audioUrl}`} 
                              className="flex-1 h-10" style={{ filter: 'invert(1) brightness(1.2)' }} />
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-8">
                      {part.groups.map((group) => (
                        <div key={group.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                          <div className="flex flex-col lg:flex-row">
                            {/* Ảnh */}
                            <div className="lg:w-1/2 bg-gray-50 border-b lg:border-b-0 lg:border-r border-gray-200 p-6">
                              <div className="lg:sticky lg:top-36">
                                {group.imageUrl && (
                                  <img src={`${BASE_URL}${group.imageUrl}`} alt="Part 1" 
                                    className="w-full h-auto rounded-xl border border-gray-300 shadow-sm" loading="lazy" />
                                )}
                              </div>
                            </div>
                            {/* Câu hỏi */}
                            <div className="lg:w-1/2 p-6 space-y-4">
                              {group.questions.map((q) => (
                                <div key={q.id} id={`question-${q.id}`} 
                                  className={`p-4 rounded-xl transition-colors ${currentQuestionId === q.id ? 'bg-blue-50 ring-2 ring-blue-200' : ''}`}>
                                  <div className="flex gap-3 mb-3">
                                    <span className={`shrink-0 w-9 h-9 font-bold rounded-full flex items-center justify-center text-sm
                                      ${userAnswers[q.id] ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 border'}`}>
                                      {q.questionNo}
                                    </span>
                                    <p className="text-gray-600 text-sm pt-2">Chọn đáp án mô tả đúng bức tranh</p>
                                  </div>
                                  <div className="grid grid-cols-2 gap-2 ml-12">
                                    {['A', 'B', 'C', 'D'].map((label) => (
                                      <button key={label} onClick={() => handleSelectAnswer(q.id, label)}
                                        className={`p-3 rounded-xl border-2 font-bold transition-all
                                          ${userAnswers[q.id] === label 
                                            ? "border-blue-500 bg-blue-600 text-white" 
                                            : "border-gray-200 hover:border-blue-300 text-gray-600"}`}>
                                        {label}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* === PART 2: Question-Response === */}
                {partNum === 2 && (
                  <div className="space-y-4">
                    {part.groups.map((group) => (
                      <div key={group.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        {/* Audio cho mỗi câu */}
                        {group.audioUrl && (
                          <div className="mb-4">
                            <audio controls src={`${BASE_URL}${group.audioUrl}`} className="w-full h-12 rounded-lg" />
                          </div>
                        )}
                        {group.questions.map((q) => (
                          <div key={q.id} id={`question-${q.id}`}
                            className={`p-4 rounded-xl transition-colors ${currentQuestionId === q.id ? 'bg-blue-50 ring-2 ring-blue-200' : ''}`}>
                            <div className="flex gap-3 mb-4">
                              <span className={`shrink-0 w-10 h-10 font-bold rounded-full flex items-center justify-center
                                ${userAnswers[q.id] ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 border'}`}>
                                {q.questionNo}
                              </span>
                              <p className="text-gray-500 text-sm pt-2 italic">Nghe câu hỏi và chọn câu trả lời phù hợp nhất</p>
                            </div>
                            {/* Part 2: Chỉ 3 đáp án A, B, C */}
                            <div className="flex gap-3 ml-12">
                              {['A', 'B', 'C'].map((label) => (
                                <button key={label} onClick={() => handleSelectAnswer(q.id, label)}
                                  className={`flex-1 p-4 rounded-xl border-2 font-bold text-lg transition-all
                                    ${userAnswers[q.id] === label 
                                      ? "border-blue-500 bg-blue-600 text-white shadow-lg" 
                                      : "border-gray-200 hover:border-blue-300 text-gray-600 hover:bg-gray-50"}`}>
                                  {label}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}

                {/* === PART 3 & 4: Conversations & Talks === */}
                {(partNum === 3 || partNum === 4) && (
                  <div className="space-y-8">
                    {part.groups.map((group) => (
                      <div key={group.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        {/* Audio header */}
                        <div className="bg-linear-to-r from-green-600 to-teal-600 text-white p-4">
                          <div className="flex items-center gap-4">
                            <div className="bg-white/20 p-2 rounded-full">
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                              </svg>
                            </div>
                            <span className="font-medium text-sm">
                              {partNum === 3 ? '🗣️ Conversation' : '🎤 Talk'} - Questions {group.questions[0]?.questionNo}-{group.questions[group.questions.length-1]?.questionNo}
                            </span>
                            {group.audioUrl && (
                              <audio controls src={`${BASE_URL}${group.audioUrl}`} 
                                className="flex-1 h-10" style={{ filter: 'invert(1) brightness(1.2)' }} />
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-col lg:flex-row">
                          {/* Cột trái: Ảnh/Transcript (nếu có) */}
                          {(group.imageUrl || group.textContent) && (
                            <div className="lg:w-1/2 bg-gray-50 border-b lg:border-b-0 lg:border-r border-gray-200 p-6">
                              <div className="lg:sticky lg:top-36 space-y-4">
                                {group.imageUrl && (
                                  <img src={`${BASE_URL}${group.imageUrl}`} alt="Visual" 
                                    className="w-full rounded-xl border shadow-sm" loading="lazy" />
                                )}
                                {group.textContent && (
                                  <div className="prose prose-sm max-w-none bg-white p-4 rounded-lg border"
                                    dangerouslySetInnerHTML={{ __html: group.textContent }} />
                                )}
                              </div>
                            </div>
                          )}
                          
                          {/* Cột phải: Câu hỏi */}
                          <div className={`${(group.imageUrl || group.textContent) ? 'lg:w-1/2' : 'w-full'} p-6 space-y-6`}>
                            {group.questions.map((q) => (
                              <div key={q.id} id={`question-${q.id}`}
                                className={`p-4 rounded-xl transition-colors ${currentQuestionId === q.id ? 'bg-blue-50 ring-2 ring-blue-200' : ''}`}>
                                <div className="flex gap-3 mb-3">
                                  <span className={`shrink-0 w-9 h-9 font-bold rounded-full flex items-center justify-center text-sm
                                    ${userAnswers[q.id] ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 border'}`}>
                                    {q.questionNo}
                                  </span>
                                  <p className="font-medium text-gray-800 pt-1">{q.content}</p>
                                </div>
                                <div className="space-y-2 ml-12">
                                  {q.answers.map((ans) => (
                                    <AnswerOption key={ans.label} q={q} ans={ans}
                                      isSelected={userAnswers[q.id] === ans.label}
                                      onSelect={() => handleSelectAnswer(q.id, ans.label)} />
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* === PART 5: Incomplete Sentences === */}
                {partNum === 5 && (
                  <div className="space-y-4">
                    {part.groups.map((group) => (
                      <div key={group.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        {group.questions.map((q) => (
                          <div key={q.id} id={`question-${q.id}`}
                            className={`p-4 rounded-xl transition-colors ${currentQuestionId === q.id ? 'bg-blue-50 ring-2 ring-blue-200' : ''}`}>
                            <div className="flex gap-4 mb-4">
                              <span className={`shrink-0 w-10 h-10 font-bold rounded-full flex items-center justify-center
                                ${userAnswers[q.id] ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 border'}`}>
                                {q.questionNo}
                              </span>
                              <p className="font-medium text-gray-800 text-lg pt-1 leading-relaxed">{q.content}</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-14">
                              {q.answers.map((ans) => (
                                <AnswerOption key={ans.label} q={q} ans={ans}
                                  isSelected={userAnswers[q.id] === ans.label}
                                  onSelect={() => handleSelectAnswer(q.id, ans.label)} />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}

                {/* === PART 6 & 7: Text Completion & Reading === */}
                {(partNum === 6 || partNum === 7) && (
                  <div className="space-y-8">
                    {part.groups.map((group) => (
                      <div key={group.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="flex flex-col lg:flex-row">
                          {/* Cột trái: Đoạn văn */}
                          <div className="lg:w-1/2 bg-gray-50 border-b lg:border-b-0 lg:border-r border-gray-200 p-6">
                            <div className="lg:sticky lg:top-24 max-h-[80vh] overflow-y-auto custom-scrollbar">
                              <div className="mb-3 text-purple-600 font-bold text-xs uppercase tracking-widest">
                                📖 Reading Passage
                              </div>
                              {group.imageUrl && (
                                <img src={`${BASE_URL}${group.imageUrl}`} alt="Passage" 
                                  className="w-full rounded-lg border shadow-sm mb-4" loading="lazy" />
                              )}
                              {group.textContent && (
                                <div className="prose prose-sm max-w-none bg-white p-5 rounded-lg border shadow-sm leading-7 whitespace-pre-line"
                                  dangerouslySetInnerHTML={{ __html: group.textContent }} />
                              )}
                            </div>
                          </div>
                          
                          {/* Cột phải: Câu hỏi */}
                          <div className="lg:w-1/2 p-6 space-y-6">
                            {group.questions.map((q) => (
                              <div key={q.id} id={`question-${q.id}`}
                                className={`p-4 rounded-xl transition-colors ${currentQuestionId === q.id ? 'bg-blue-50 ring-2 ring-blue-200' : ''}`}>
                                <div className="flex gap-3 mb-3">
                                  <span className={`shrink-0 w-9 h-9 font-bold rounded-full flex items-center justify-center text-sm
                                    ${userAnswers[q.id] ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 border'}`}>
                                    {q.questionNo}
                                  </span>
                                  <p className="font-medium text-gray-800 pt-1">{q.content}</p>
                                </div>
                                <div className="space-y-2 ml-12">
                                  {q.answers.map((ans) => (
                                    <AnswerOption key={ans.label} q={q} ans={ans}
                                      isSelected={userAnswers[q.id] === ans.label}
                                      onSelect={() => handleSelectAnswer(q.id, ans.label)} />
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 2. CỘT PHẢI: SIDEBAR (Desktop) */}
        <div className="hidden lg:block lg:w-1/4">
          {testData && (
            <ExamRightSidebar 
              parts={testData.parts}
              userAnswers={userAnswers}
              onScrollToQuestion={handleScrollToQuestion}
              onSubmit={handleSubmit}
              isSubmitting={submitting}
              timeLeft={timeLeft}
              currentQuestionId={currentQuestionId}
            />
          )}
        </div>
      </div>

      {/* MOBILE BOTTOM NAV */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={() => setShowMobileNav(!showMobileNav)}
            className="flex items-center gap-2 text-gray-600">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span className="font-medium">{answeredCount}/{totalQuestions}</span>
          </button>
          
          <div className={`font-bold ${timeLeft <= 300 ? 'text-red-600' : 'text-gray-800'}`}>
            ⏱️ {formatTime(timeLeft)}
          </div>
          
          <button onClick={handleSubmit} disabled={submitting}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm">
            Nộp bài
          </button>
        </div>
        
        {/* Mobile Question Palette */}
        {showMobileNav && (
          <div className="border-t border-gray-100 p-4 max-h-[50vh] overflow-y-auto bg-gray-50">
            {testData.parts.map((part) => (
              <div key={part.id} className="mb-4">
                <h4 className="font-bold text-gray-700 text-sm mb-2">{part.name}</h4>
                <div className="grid grid-cols-8 gap-2">
                  {part.groups.flatMap((g) => g.questions).map((q) => (
                    <button key={q.id} onClick={() => handleScrollToQuestion(q.id)}
                      className={`h-9 w-9 text-xs font-bold rounded-lg flex items-center justify-center border transition-all
                        ${currentQuestionId === q.id ? 'ring-2 ring-blue-400' : ''}
                        ${userAnswers[q.id] 
                          ? "bg-blue-600 text-white border-blue-600" 
                          : "bg-white text-gray-600 border-gray-300"}`}>
                      {q.questionNo}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
