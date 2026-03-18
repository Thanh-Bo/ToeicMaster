"use client";

import { useEffect, useState, useRef } from "react";

import { useRouter, useParams, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";

import { TestDetail } from "@/app/types"; // Đảm bảo bạn có type này
import ExamRightSidebar from "@/app/components/tests/ExamRightSidebar";
import AnswerOption from "@/app/components/tests/AnswerOption";
import AudioPlayer from "@/app/components/audio/AudioPlayer";
import { ListChecks, PlayCircle, Trash } from "lucide-react";
import { testService } from "@/app/services/testService";
// import { CommentSection } from "@/app/components/comments/CommentSection"; // Chưa dùng tới trong UI này

export default function ExamPage() {
  const searchParams = useSearchParams();
  const partsParam = searchParams.get("parts"); // Kết quả: "1"
  const durationParam = searchParams.get("duration"); // Kết quả: "60"
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
  const [currentQuestionId, setCurrentQuestionId] = useState<number | null>(
    null,
  );

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const hasAutoSubmitted = useRef(false);
  const STORAGE_KEY = `exam_progress_${testId}`;

  // --- TÍNH TOÁN ---
  const totalQuestions =
    testData?.parts.reduce(
      (sum, part) =>
        sum + part.groups.reduce((s, g) => s + g.questions.length, 0),
      0,
    ) || 0;
  const answeredCount = Object.keys(userAnswers).length;

  // --- HELPER FUNCTIONS ---
  // Thay thế hàm formatTime cũ
  // Thay thế hàm formatTime cũ
  const formatTime = (seconds: number) => {
    // Tính tổng số phút (không chia ra giờ)
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;

    // Trả về dạng MM:SS (Ví dụ: 0:00, 5:30, 120:00)
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };
  const getPartNumber = (partName: string): number => {
    const match = partName.match(/part\s*(\d)/i);
    return match ? parseInt(match[1]) : 0;
  };

  const handleSelectAnswer = (questionId: number, option: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const handleClearAllAnswers = () => {
    setUserAnswers({});
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleScrollToQuestion = (id: number) => {
    const element = document.getElementById(`question-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      setCurrentQuestionId(id);
    }
    setShowMobileNav(false);
  };

  // --- EFFECT 1: Load Data ---
  useEffect(() => {
    const userCookie = Cookies.get("user");
    if (userCookie) setUser(JSON.parse(userCookie));

    if (testId) {
      setLoading(true);
      testService
        .getTestFull(testId, partsParam)
        .then((res) => {
          const data = res.data.data;
          setTestData(data);

          // DEBUG: Log audio URLs for each part
          console.log("[TestPage] Loaded test data:", data);
          data.parts.forEach((part: any) => {
            console.log(`[TestPage] Part ${part.name}:`, {
              id: part.id,
              groupCount: part.groups.length,
              groups: part.groups.map((g: any) => ({
                id: g.id,
                audioUrl: g.audioUrl,
                hasAudio: !!g.audioUrl,
              })),
            });
          });

          // Load saved answers from localStorage
          const savedAnswers = localStorage.getItem(STORAGE_KEY);
          if (savedAnswers) {
            try {
              setUserAnswers(JSON.parse(savedAnswers));
            } catch (e) {
              console.error("Lỗi parse localStorage:", e);
            }
          }

          // LOGIC MỚI Ở ĐÂY:
          if (durationParam === "0") {
            // Nếu không giới hạn: Bắt đầu từ 0 để đếm lên
            setTimeLeft(0);
          } else if (durationParam && Number(durationParam) > 0) {
            // Nếu có giới hạn: Set thời gian đếm ngược
            setTimeLeft(Number(durationParam) * 60);
          } else {
            // Mặc định từ DB
            setTimeLeft((data.duration || 120) * 60);
          }
        })
        .catch((err) => {
          console.error(err);
          alert("Lỗi tải đề thi!");
        })
        .finally(() => setLoading(false));
    }
  }, [testId, partsParam, durationParam]);

  // --- EFFECT: Auto-save answers to localStorage ---
  useEffect(() => {
    if (Object.keys(userAnswers).length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userAnswers));
    }
  }, [userAnswers, STORAGE_KEY]);

  // --- EFFECT 2: Timer Logic ---
  useEffect(() => {
    if (loading) return; // Bỏ check timeLeft <= 0 ở đây để cho phép đếm lên từ 0

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        // TRƯỜNG HỢP 1: Không giới hạn thời gian -> Đếm TĂNG dần
        if (durationParam === "0") {
          return prev + 1;
        }

        // TRƯỜNG HỢP 2: Có giới hạn -> Đếm GIẢM dần
        if (prev <= 0) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [loading, durationParam]);

  // --- EFFECT 3: Auto Submit ---
  useEffect(() => {
    if (
      durationParam !== "0" &&
      timeLeft === 0 &&
      !loading &&
      testData &&
      !hasAutoSubmitted.current
    ) {
      hasAutoSubmitted.current = true;
      alert(" Hết giờ! Bài thi sẽ được nộp tự động.");
      handleForceSubmit();
    }
  }, [timeLeft, loading, testData, durationParam]);

  // --- EFFECT 4: Keyboard Shortcuts (A, B, C, D) ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!currentQuestionId) return;
      const key = e.key.toUpperCase();
      if (["A", "B", "C", "D"].includes(key)) {
        handleSelectAnswer(currentQuestionId, key);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentQuestionId]);

  // --- HANDLERS ---
  const handleForceSubmit = async () => {
    if (!user) {
      alert("Phiên đăng nhập hết hạn. Kết quả sẽ được lưu tạm.");
      router.push("/login");
      return;
    }
    setSubmitting(true);
    try {
      let timeSpent = 0;
      if (durationParam === "0") {
        // Nếu không giới hạn: timeLeft chính là thời gian đã làm
        timeSpent = timeLeft;
      } else {
        // Nếu có giới hạn: Tổng thời gian - Thời gian còn lại
        const totalTime =
          (Number(durationParam) || testData?.duration || 120) * 60;
        timeSpent = totalTime - timeLeft;
      }

      const payload = {
        testId: testId,
        answers: Object.entries(userAnswers).map(([qId, opt]) => ({
          questionId: Number(qId),
          selectedOption: opt,
        })),
        duration: timeSpent, // Gửi thời gian thực tế đã làm
      };
      const res = await testService.submit(payload);
      if (res.data && res.data.attemptId) {
        // Clear localStorage after successful submission
        localStorage.removeItem(STORAGE_KEY);
        router.push(`/results/${res.data.attemptId}`);
      } else {
        router.push("/results"); // Fallback
      }
    } catch (error: any) {
      console.error(error);
      alert("Nộp bài thất bại! Vui lòng thử lại.");
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
    const confirmMsg = `Bạn đã làm ${answeredCount}/${totalQuestions} câu. Bạn có chắc chắn muốn nộp bài?`;
    if (!confirm(confirmMsg)) return;

    await handleForceSubmit();
  };

  // --- RENDER ---
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-zinc-700 mx-auto mb-4"></div>
          <p className="text-blue-600 font-bold text-lg">Đang tải đề thi...</p>
        </div>
      </div>
    );
  }

  if (!testData)
    return (
      <div className="p-10 text-center text-red-500">
        Không tìm thấy dữ liệu đề thi.
      </div>
    );

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-900 pb-24 lg:pb-20 font-sans">
      {/* HEADER Sticky */}
      <header className="bg-white dark:bg-zinc-900 shadow-sm border-b border-gray-200 dark:border-zinc-700 p-3 sticky top-0 z-50">
        <div className="w-full flex justify-between items-center px-4">
          <button
            onClick={() => {
              if (Object.keys(userAnswers).length > 0) {
                const confirmExit = window.confirm(
                  "Bạn chưa nộp bài. Dữ liệu sẽ được lưu. Bạn có chắc chắn muốn thoát?",
                );
                if (confirmExit) router.push("/");
              } else {
                router.push("/");
              }
            }}
            className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 font-medium flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              ></path>
            </svg>
            <span className="hidden md:inline">Thoát</span>
          </button>

          {/* Center: Title + Timer (mobile) */}
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-gray-900 dark:text-white truncate max-w-50 md:max-w-md">
              {testData.title}
            </h1>
            {/* Mobile Timer Badge */}
            <div
              className={`lg:hidden px-3 py-1 rounded-full font-bold text-sm ${
                timeLeft <= 300
                  ? "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 animate-pulse"
                  : "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
              }`}
            >
              {durationParam === "0" ? " Đã làm: " : " Còn lại: "}
              {formatTime(timeLeft)}
            </div>
          </div>

          {/* Right: Progress + Submit */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-400">
              <span className="font-bold text-blue-600">{answeredCount}</span>
              <span>/</span>
              <span>{totalQuestions}</span>
            </div>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm font-bold transition-colors disabled:opacity-50"
            >
              {submitting ? "Đang nộp..." : "Nộp bài"}
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full px-4 mt-2">
          <div className="h-1.5 bg-gray-200 dark:bg-zinc-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{
                width: `${
                  totalQuestions > 0
                    ? (answeredCount / totalQuestions) * 100
                    : 0
                }%`,
              }}
            ></div>
          </div>
        </div>
      </header>

      {/* Warning when time is low */}
      {durationParam !== "0" && timeLeft <= 300 && timeLeft > 0 && (
        <div className="bg-red-500 dark:bg-red-600 text-white text-center py-2 text-sm font-medium animate-pulse sticky top-17.5 z-40">
          Còn dưới {Math.ceil(timeLeft / 60)} phút! Hãy kiểm tra và nộp bài.
        </div>
      )}

      {/* --- MAIN CONTENT --- */}
      <div className="w-full p-4 md:p-6 flex flex-col lg:flex-row gap-8">
        {/* CỘT TRÁI: NỘI DUNG ĐỀ THI */}
        <div className="w-full lg:w-5/6">
          {testData.parts.map((part) => {
            const partNum = getPartNumber(part.name);

            return (
              <div key={part.id} className="mb-12">
                {/* Header của Part */}
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {part.name}
                  </h2>
                  <div className="h-1 flex-1 bg-gray-200 dark:bg-zinc-700 rounded-full"></div>
                </div>

                {/* === PART 1: Photographs === */}
                {partNum === 1 && (
                  <div className="space-y-8">
                    {part.groups.map((group, idx) => (
                      <div
                        key={group.id}
                        className="rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-700 overflow-hidden"
                      >
                        <div className="flex flex-col md:flex-row">
                          {/* Left: audio flush + image */}
                          <div className="md:w-1/2 bg-gray-100 dark:bg-zinc-900 flex flex-col border-b md:border-b-0 md:border-r border-gray-200 dark:border-zinc-600">
                            {group.audioUrl && (
                              <AudioPlayer
                                src={
                                  group.audioUrl.startsWith("http")
                                    ? group.audioUrl
                                    : `${BASE_URL}${group.audioUrl}`
                                }
                                label={`Question ${idx + 1} Audio`}
                                className="rounded-none border-0 shadow-none"
                              />
                            )}
                            {group.imageUrl && (
                              <div className="flex items-center justify-center px-4 pb-4 pt-3">
                                <img
                                  src={
                                    group.imageUrl.startsWith("http")
                                      ? group.imageUrl
                                      : `${BASE_URL}${group.imageUrl}`
                                  }
                                  alt="Part 1"
                                  className="rounded-lg shadow-sm max-h-100 w-auto"
                                />
                              </div>
                            )}
                          </div>
                          {/* Right: answers */}
                          <div className="md:w-1/2 bg-white dark:bg-zinc-900 p-6 space-y-6">
                            {group.questions.map((q) => (
                              <div
                                key={q.id}
                                id={`question-${q.id}`}
                                onClick={() => setCurrentQuestionId(q.id)}
                                className="p-4 rounded-xl"
                              >
                                <div className="flex items-center gap-3 mb-3">
                                  <span
                                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                                      userAnswers[q.id]
                                        ? "bg-blue-600 text-white"
                                        : "bg-zinc-700 text-gray-300"
                                    }`}
                                  >
                                    {q.questionNo}
                                  </span>
                                  <p className="text-gray-700 dark:text-gray-400 text-sm">
                                    Chọn đáp án đúng:
                                  </p>
                                </div>
                                <div className="flex flex-col gap-3 ml-11">
                                  {["A", "B", "C", "D"].map((label) => (
                                    <button
                                      key={label}
                                      onClick={() => handleSelectAnswer(q.id, label)}
                                      className={`p-4 rounded-xl border font-bold text-lg text-center transition-all ${
                                        userAnswers[q.id] === label
                                          ? "bg-blue-600 text-white border-blue-600"
                                          : "hover:bg-gray-100 dark:hover:bg-zinc-700 border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-gray-300"
                                      }`}
                                    >
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
                )}

                {/* === PART 2: Question-Response === */}
                {partNum === 2 && (
                  <div className="space-y-6">
                    {part.groups.map((group, idx) => (
                      <div
                        key={group.id}
                        className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-700 overflow-hidden"
                      >
                        <div className="flex flex-col lg:flex-row">
                          {/* Left: audio flush */}
                          <div className="lg:w-1/2 bg-gray-100 dark:bg-zinc-900 flex flex-col border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-zinc-600">
                            {group.audioUrl && (
                              <AudioPlayer
                                src={
                                  group.audioUrl.startsWith("http")
                                    ? group.audioUrl
                                    : `${BASE_URL}${group.audioUrl}`
                                }
                                label={`Question ${idx + 1} Audio`}
                                className="rounded-none border-0 shadow-none"
                              />
                            )}
                          </div>
                          {/* Right: questions column */}
                          <div className="lg:w-1/2 p-6 space-y-4">
                            {group.questions.map((q) => (
                              <div
                                key={q.id}
                                id={`question-${q.id}`}
                                onClick={() => setCurrentQuestionId(q.id)}
                                className="p-4 rounded-lg"
                              >
                                <div className="flex gap-4 items-center mb-3">
                                  <span
                                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                                      userAnswers[q.id]
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-gray-300"
                                    }`}
                                  >
                                    {q.questionNo}
                                  </span>
                                  <span className="text-gray-600 dark:text-gray-400 italic text-sm">
                                    Nghe và chọn đáp án
                                  </span>
                                </div>
                                <div className="flex flex-col gap-3 ml-12">
                                  {["A", "B", "C"].map((label) => (
                                    <button
                                      key={label}
                                      onClick={() => handleSelectAnswer(q.id, label)}
                                      className={`p-4 rounded-xl border font-bold text-lg text-center transition-all ${
                                        userAnswers[q.id] === label
                                          ? "bg-blue-600 text-white border-blue-600"
                                          : "hover:bg-gray-100 dark:hover:bg-zinc-700 border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-gray-300"
                                      }`}
                                    >
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
                )}

                {/* === PART 3 & 4 & 6 & 7 (Reading/Listening with Context) === */}
                {(partNum === 3 ||
                  partNum === 4 ||
                  partNum === 6 ||
                  partNum === 7) && (
                  <div className="space-y-8">
                    {part.groups.map((group) => (
                      <div
                        key={group.id}
                        className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-700 overflow-hidden"
                      >
                        <div className="flex flex-col lg:flex-row">
                          {/* Left: audio flush + content/image */}
                          {(group.audioUrl || group.imageUrl || group.textContent) && (
                            <div className="lg:w-1/2 bg-gray-50 dark:bg-zinc-900 flex flex-col border-b lg:border-b-0 lg:border-r border-gray-300 dark:border-zinc-600">
                              {/* Audio flush at top for listening parts */}
                              {(partNum === 3 || partNum === 4) && group.audioUrl && (
                                <AudioPlayer
                                  src={
                                    group.audioUrl.startsWith("http")
                                      ? group.audioUrl
                                      : `${BASE_URL}${group.audioUrl}`
                                  }
                                  label={`Conversation ${group.id}`}
                                  className="rounded-none border-0 shadow-none"
                                />
                              )}
                              {/* Sticky image/text below audio */}
                              {(group.imageUrl || group.textContent) && (
                                <div className="lg:sticky lg:top-20 px-6 pb-6 pt-3 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
                                  {group.imageUrl && (
                                    <img
                                      src={
                                        group.imageUrl.startsWith("http")
                                          ? group.imageUrl
                                          : `${BASE_URL}${group.imageUrl}`
                                      }
                                      alt="Part context"
                                      className="rounded-lg shadow-sm max-h-100 w-auto"
                                    />
                                  )}
                                  {group.textContent && (
                                    <div
                                      className="whitespace-pre-wrap max-w-none bg-white dark:bg-zinc-900 p-5 rounded-lg border-2 border-gray-300 dark:border-zinc-600 text-gray-900 dark:text-white leading-relaxed text-base [&_p]:mb-3 [&_p]:text-gray-900 dark:[&_p]:text-white [&_*]:text-gray-900 dark:[&_*]:text-white"
                                      dangerouslySetInnerHTML={{
                                        __html: group.textContent,
                                      }}
                                    />
                                  )}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Right: questions with scrollbar */}
                          <div
                            className={`${
                              group.audioUrl || group.imageUrl || group.textContent
                                ? "lg:w-1/2"
                                : "w-full"
                            } p-6 space-y-6 overflow-y-auto max-h-[80vh] custom-scrollbar`}
                          >
                            {group.questions.map((q) => (
                              <div
                                key={q.id}
                                id={`question-${q.id}`}
                                onClick={() => setCurrentQuestionId(q.id)}
                                className="p-4 rounded-xl transition-colors"
                              >
                                <div className="flex gap-3 mb-3">
                                  <span
                                    className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                                      userAnswers[q.id]
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-gray-300"
                                    }`}
                                  >
                                    {q.questionNo}
                                  </span>
                                  <p className="font-medium text-gray-900 dark:text-white pt-1">
                                    {q.content}
                                  </p>
                                </div>
                                <div className="space-y-2 ml-11">
                                  {q.answers.map((ans) => (
                                    <AnswerOption
                                      key={ans.label}
                                      q={q}
                                      ans={ans}
                                      isSelected={userAnswers[q.id] === ans.label}
                                      onSelect={() =>
                                        handleSelectAnswer(q.id, ans.label)
                                      }
                                    />
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
                      <div
                        key={group.id}
                        className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-700 p-6"
                      >
                        {group.questions.map((q) => (
                          <div
                            key={q.id}
                            id={`question-${q.id}`}
                            onClick={() => setCurrentQuestionId(q.id)}
                            className={`p-4 rounded-xl transition-colors ${
                              currentQuestionId === q.id ? "" : ""
                            }`}
                          >
                            <div className="flex gap-3 mb-4">
                              <span
                                className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                                  userAnswers[q.id]
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-gray-300"
                                }`}
                              >
                                {q.questionNo}
                              </span>
                              <p className="font-medium text-gray-900 dark:text-white text-lg pt-1">
                                {q.content}
                              </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-11">
                              {q.answers.map((ans) => (
                                <AnswerOption
                                  key={ans.label}
                                  q={q}
                                  ans={ans}
                                  isSelected={userAnswers[q.id] === ans.label}
                                  onSelect={() =>
                                    handleSelectAnswer(q.id, ans.label)
                                  }
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CỘT PHẢI: SIDEBAR (Desktop) */}
        <div className="hidden lg:block lg:w-1/6">
        {testData && (
            <ExamRightSidebar
              parts={testData.parts}
              userAnswers={userAnswers}
              onScrollToQuestion={handleScrollToQuestion}
              onSubmit={handleSubmit}
              onClearAll={handleClearAllAnswers}
              isSubmitting={submitting}
              timeLeft={timeLeft}
              currentQuestionId={currentQuestionId}
              durationParam={durationParam}
            />
          )}
        </div>
      </div>

      {/* MOBILE BOTTOM NAV */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-700 shadow-lg z-50">
        <div className="flex items-center justify-between px-3 py-2 gap-2">
          <button
            onClick={() => setShowMobileNav(!showMobileNav)}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm"
          >
            <ListChecks className="w-5 h-5" />
            <span className="font-medium">
              {answeredCount}/{totalQuestions}
            </span>
          </button>

          <div
            className={`font-bold text-sm ${
              timeLeft <= 300
                ? "text-red-600 dark:text-red-400"
                : "text-gray-800 dark:text-white"
            }`}
          >
            {formatTime(timeLeft)}
          </div>

          <button
            onClick={() => {
              if (confirm("Bạn có chắc chắn muốn xóa tất cả đáp án đã chọn?")) {
                handleClearAllAnswers();
              }
            }}
            className="bg-red-600 text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-red-700"
          >
            <Trash />
          </button>

          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-blue-700"
          >
            Nộp
          </button>
        </div>
      </div>

      {/* MOBILE NAVIGATION DRAWER (Optional logic to show Question Palette) */}
      {showMobileNav && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setShowMobileNav(false)}
        >
          <div
            className="absolute bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 rounded-t-2xl p-4 max-h-[70vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold mb-4 text-gray-900 dark:text-white">
              Danh sách câu hỏi
            </h3>
            <ExamRightSidebar
              parts={testData?.parts || []}
              userAnswers={userAnswers}
              onScrollToQuestion={handleScrollToQuestion}
              onClearAll={handleClearAllAnswers}
              onSubmit={handleSubmit}
              isSubmitting={submitting}
              timeLeft={timeLeft}
              currentQuestionId={currentQuestionId}
              // Add props to sidebar to make it simpler on mobile if needed
            />
          </div>
        </div>
      )}
    </main>
  );
}
