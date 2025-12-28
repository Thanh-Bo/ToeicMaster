"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";

import { TestDetail } from "@/app/types"; // Đảm bảo bạn có type này
import ExamRightSidebar from "@/app/components/ExamRightSidebar";
import AnswerOption from "@/app/components/AnswerOption";
import { ListChecks, PlayCircle } from "lucide-react";
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
    null
  );
  

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const hasAutoSubmitted = useRef(false);

  // --- TÍNH TOÁN ---
  const totalQuestions =
    testData?.parts.reduce(
      (sum, part) =>
        sum + part.groups.reduce((s, g) => s + g.questions.length, 0),
      0
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

  const handleScrollToQuestion = (id: number) => {
    const element = document.getElementById(`question-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      setCurrentQuestionId(id);
    }
    setShowMobileNav(false);
  };

  // --- EFFECT 1: Load Data ---
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
    if (durationParam !== "0" && timeLeft === 0 && !loading && testData && !hasAutoSubmitted.current) {
      hasAutoSubmitted.current = true;
      alert(" Hết giờ! Bài thi sẽ được nộp tự động.");
      handleForceSubmit();
    }
  }, [timeLeft, loading, testData , durationParam ]);

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
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-600 font-bold text-lg">
            ⏳ Đang tải đề thi...
          </p>
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
    <main className="min-h-screen bg-gray-50 pb-24 lg:pb-20 font-sans">
      {/* HEADER Sticky */}
      <header className="bg-white shadow-sm border-b border-gray-200 p-3 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4">
          <Link
            href="/"
            className="text-gray-500 hover:text-blue-600 font-medium flex items-center gap-2"
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
          </Link>

          {/* Center: Title + Timer (mobile) */}
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-gray-800 truncate max-w-50 md:max-w-md">
              {testData.title}
            </h1>
            {/* Mobile Timer Badge */}
            <div
              className={`lg:hidden px-3 py-1 rounded-full font-bold text-sm ${
                timeLeft <= 300
                  ? "bg-red-100 text-red-600 animate-pulse"
                  : "bg-blue-100 text-blue-600"
              }`}
            >
              {durationParam === "0" ? " Đã làm: " : " Còn lại: "}
              {formatTime(timeLeft)}
            </div>
          </div>

          {/* Right: Progress + Submit */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
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
        <div className="max-w-7xl mx-auto px-4 mt-2">
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
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
        <div className="bg-red-500 text-white text-center py-2 text-sm font-medium animate-pulse sticky top-17.5 z-40">
          ⚠️ Còn dưới {Math.ceil(timeLeft / 60)} phút! Hãy kiểm tra và nộp bài.
        </div>
      )}

      {/* --- MAIN CONTENT --- */}
      <div className="max-w-7xl mx-auto p-4 md:p-6 flex flex-col lg:flex-row gap-8">
        {/* CỘT TRÁI: NỘI DUNG ĐỀ THI */}
        <div className="w-full lg:w-3/4">
          {testData.parts.map((part) => {
            const partNum = getPartNumber(part.name);

            return (
              <div key={part.id} className="mb-12">
                {/* Header của Part */}
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {part.name}
                  </h2>
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
                    {/* Audio Player chung cho Part */}
                    {part.groups[0]?.audioUrl && (
                      <div className="sticky top-24 z-30 mb-6">
                        <div className="bg-gray-800 text-white p-3 rounded-xl shadow-lg flex items-center gap-3">
                          <PlayCircle className="text-green-400" />
                          <span className="text-sm font-medium">
                            Part 1 Audio
                          </span>
                          <audio
                            controls
                            src={`${BASE_URL}${part.groups[0].audioUrl}`}
                            className="h-8 flex-1"
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-8">
                      {part.groups.map((group) => (
                        <div
                          key={group.id}
                          className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
                        >
                          <div className="flex flex-col md:flex-row">
                            <div className="md:w-1/2 bg-gray-50 p-4 flex items-center justify-center">
                              {group.imageUrl && (
                                <img
                                  src={`${BASE_URL}${group.imageUrl}`}
                                  alt="Part 1"
                                  className="rounded-lg shadow-sm max-h-100 w-auto"
                                />
                              )}
                            </div>
                            <div className="md:w-1/2 p-6 space-y-6">
                              {group.questions.map((q) => (
                                <div
                                  key={q.id}
                                  id={`question-${q.id}`}
                                  onClick={() => setCurrentQuestionId(q.id)}
                                  className={`p-4 rounded-xl transition-all ${
                                    currentQuestionId === q.id
                                      ? "bg-blue-50 ring-2 ring-blue-200"
                                      : ""
                                  }`}
                                >
                                  <div className="flex items-center gap-3 mb-3">
                                    <span
                                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                                        userAnswers[q.id]
                                          ? "bg-blue-600 text-white"
                                          : "bg-gray-200 text-gray-700"
                                      }`}
                                    >
                                      {q.questionNo}
                                    </span>
                                    <p className="text-gray-500 text-sm">
                                      Chọn đáp án đúng:
                                    </p>
                                  </div>
                                  <div className="grid grid-cols-2 gap-3 ml-11">
                                    {["A", "B", "C", "D"].map((label) => (
                                      <button
                                        key={label}
                                        onClick={() =>
                                          handleSelectAnswer(q.id, label)
                                        }
                                        className={`py-2 px-4 rounded-lg border font-bold transition-all ${
                                          userAnswers[q.id] === label
                                            ? "bg-blue-600 text-white border-blue-600"
                                            : "hover:bg-gray-100 border-gray-300 text-gray-700"
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
                  </>
                )}

                {/* === PART 2: Question-Response === */}
                {partNum === 2 && (
                  <>
                    {part.groups[0]?.audioUrl && (
                      <div className="sticky top-24 z-30 mb-6">
                        <div className="bg-gray-800 text-white p-3 rounded-xl shadow-lg flex items-center gap-3">
                          <PlayCircle className="text-green-400" />
                          <span className="text-sm font-medium">
                            Part 2 Audio
                          </span>
                          <audio
                            controls
                            src={`${BASE_URL}${part.groups[0].audioUrl}`}
                            className="h-8 flex-1"
                          />
                        </div>
                      </div>
                    )}
                    <div className="space-y-4">
                      {part.groups.map((group) => (
                        <div
                          key={group.id}
                          className="bg-white rounded-xl shadow-sm border p-6"
                        >
                          {group.questions.map((q) => (
                            <div
                              key={q.id}
                              id={`question-${q.id}`}
                              onClick={() => setCurrentQuestionId(q.id)}
                              className={`p-4 rounded-lg ${
                                currentQuestionId === q.id ? "bg-blue-50" : ""
                              }`}
                            >
                              <div className="flex gap-4 items-center mb-3">
                                <span
                                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                                    userAnswers[q.id]
                                      ? "bg-blue-600 text-white"
                                      : "bg-gray-200"
                                  }`}
                                >
                                  {q.questionNo}
                                </span>
                                <span className="text-gray-500 italic text-sm">
                                  Nghe và chọn đáp án
                                </span>
                              </div>
                              <div className="flex gap-4 ml-12">
                                {["A", "B", "C"].map((label) => (
                                  <button
                                    key={label}
                                    onClick={() =>
                                      handleSelectAnswer(q.id, label)
                                    }
                                    className={`flex-1 py-3 rounded-lg border font-bold ${
                                      userAnswers[q.id] === label
                                        ? "bg-blue-600 text-white border-blue-600"
                                        : "hover:bg-gray-50 border-gray-300"
                                    }`}
                                  >
                                    {label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* === PART 3 & 4 & 6 & 7 (Reading/Listening with Context) === */}
                {(partNum === 3 ||
                  partNum === 4 ||
                  partNum === 6 ||
                  partNum === 7) && (
                  <>
                    {/* Chỉ hiện Audio cho Part 3, 4 */}
                    {(partNum === 3 || partNum === 4) &&
                      part.groups[0]?.audioUrl && (
                        <div className="sticky top-24 z-30 mb-6">
                          <div className="bg-gray-800 text-white p-3 rounded-xl shadow-lg flex items-center gap-3">
                            <PlayCircle className="text-green-400" />
                            <span className="text-sm font-medium">
                              Part {partNum} Audio
                            </span>
                            <audio
                              controls
                              src={`${BASE_URL}${part.groups[0].audioUrl}`}
                              className="h-8 flex-1"
                            />
                          </div>
                        </div>
                      )}

                    <div className="space-y-8">
                      {part.groups.map((group) => (
                        <div
                          key={group.id}
                          className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
                        >
                          {/* Group Context (Image/Text) */}
                          <div className="flex flex-col lg:flex-row">
                            {(group.imageUrl || group.textContent) && (
                              <div className="lg:w-1/2 bg-gray-50 p-6 border-b lg:border-b-0 lg:border-r border-gray-200">
                                <div className="lg:sticky lg:top-36 max-h-[80vh] overflow-y-auto">
                                  {group.imageUrl && (
                                    <img
                                      src={`${BASE_URL}${group.imageUrl}`}
                                      alt="Context"
                                      className="w-full rounded mb-4"
                                    />
                                  )}
                                  {group.textContent && (
                                    <div
                                      className="prose prose-sm max-w-none bg-white p-4 rounded border text-gray-800"
                                      dangerouslySetInnerHTML={{
                                        __html: group.textContent,
                                      }}
                                    />
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Questions */}
                            <div
                              className={`${
                                group.imageUrl || group.textContent
                                  ? "lg:w-1/2"
                                  : "w-full"
                              } p-6 space-y-6`}
                            >
                              {group.questions.map((q) => (
                                <div
                                  key={q.id}
                                  id={`question-${q.id}`}
                                  onClick={() => setCurrentQuestionId(q.id)}
                                  className={`p-4 rounded-xl transition-colors ${
                                    currentQuestionId === q.id
                                      ? "bg-blue-50 ring-2 ring-blue-200"
                                      : ""
                                  }`}
                                >
                                  <div className="flex gap-3 mb-3">
                                    <span
                                      className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                                        userAnswers[q.id]
                                          ? "bg-blue-600 text-white"
                                          : "bg-gray-200"
                                      }`}
                                    >
                                      {q.questionNo}
                                    </span>
                                    <p className="font-medium text-gray-800 pt-1">
                                      {q.content}
                                    </p>
                                  </div>
                                  <div className="space-y-2 ml-11">
                                    {q.answers.map((ans) => (
                                      <AnswerOption
                                        key={ans.label}
                                        q={q}
                                        ans={ans}
                                        isSelected={
                                          userAnswers[q.id] === ans.label
                                        }
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
                  </>
                )}

                {/* === PART 5: Incomplete Sentences === */}
                {partNum === 5 && (
                  <div className="space-y-4">
                    {part.groups.map((group) => (
                      <div
                        key={group.id}
                        className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
                      >
                        {group.questions.map((q) => (
                          <div
                            key={q.id}
                            id={`question-${q.id}`}
                            onClick={() => setCurrentQuestionId(q.id)}
                            className={`p-4 rounded-xl transition-colors ${
                              currentQuestionId === q.id
                                ? "bg-blue-50 ring-2 ring-blue-200"
                                : ""
                            }`}
                          >
                            <div className="flex gap-3 mb-4">
                              <span
                                className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                                  userAnswers[q.id]
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-200"
                                }`}
                              >
                                {q.questionNo}
                              </span>
                              <p className="font-medium text-gray-800 text-lg pt-1">
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
        <div className="hidden lg:block lg:w-1/4">
          {testData && (
            <div className="sticky top-24">
              <ExamRightSidebar
                parts={testData.parts}
                userAnswers={userAnswers}
                onScrollToQuestion={handleScrollToQuestion}
                onSubmit={handleSubmit}
                isSubmitting={submitting}
                timeLeft={timeLeft}
                currentQuestionId={currentQuestionId}
                durationParam={durationParam}
              />
            </div>
          )}
        </div>
      </div>
          
      {/* MOBILE BOTTOM NAV */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setShowMobileNav(!showMobileNav)}
            className="flex items-center gap-2 text-gray-600"
          >
            <ListChecks className="w-6 h-6" />
            <span className="font-medium">
              {answeredCount}/{totalQuestions}
            </span>
          </button>

          <div
            className={`font-bold ${
              timeLeft <= 300 ? "text-red-600" : "text-gray-800"
            }`}
          >
            {formatTime(timeLeft)}
          </div>

          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold"
          >
            Nộp bài
          </button>
        </div>
      </div>

      {/* MOBILE NAVIGATION DRAWER (Optional logic to show Question Palette) */}
      {showMobileNav && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-50"
          onClick={() => setShowMobileNav(false)}
        >
          <div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-4 max-h-[70vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold mb-4">Danh sách câu hỏi</h3>
            <ExamRightSidebar
              parts={testData?.parts || []}
              userAnswers={userAnswers}
              onScrollToQuestion={handleScrollToQuestion}
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
