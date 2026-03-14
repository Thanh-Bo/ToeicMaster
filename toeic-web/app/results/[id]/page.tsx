"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Check, X } from "lucide-react";
import { testService } from "../../services/testService";
import { bookmarkService } from "../../services/bookmarkService";
import { ResultDetail } from "../../types";
import ResultRightSidebar from "@/app/components/results/ResultRightSidebar";
import { CommentSection } from "@/app/components/comments/CommentSection";
import ResultQuestionItem from "@/app/components/results/ResultQuestionItem";
import BookmarkNoteModal from "@/app/components/boomarks/BookmarkNoteModal";

const BASE_URL = "http://localhost:5298";

interface PartGroup {
  partNumber: number;
  partName: string;
  groups: {
    groupId: number;
    groupContent?: string;
    imageUrl?: string;
    audioUrl?: string;
    questions: any[];
  }[];
}

export default function ResultPage() {
  const params = useParams();
  const router = useRouter();
  const attemptId = Number(params.id);

  const [result, setResult] = useState<ResultDetail | null>(null);
  const [partGroups, setPartGroups] = useState<PartGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingExplainId, setLoadingExplainId] = useState<number | null>(null);
  const [currentQuestionId, setCurrentQuestionId] = useState<number | null>(
    null
  );
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<Set<number>>(
    new Set()
  );
  const [bookmarkLoading, setBookmarkLoading] = useState<number | null>(null);


  const [bookmarkModalOpen, setBookmarkModalOpen] = useState(false);
  const [pendingBookmarkId, setPendingBookmarkId] = useState<number | null>(null);
  const [smartDefaultNote, setSmartDefaultNote] = useState("");

  // Load kết quả và gom nhóm theo Part
  useEffect(() => {
    if (!attemptId) return;
    const fetchResult = async () => {
      try {
        const response = await testService.getResult(attemptId);
        setResult(response.data);

        if (response.data?.questions) {
          const partsMap = new Map<number, PartGroup>();

          response.data.questions.forEach((q: any) => {
            const partNum = q.partNumber || 5;
            const partName = q.partName || `Part ${partNum}`;

            if (!partsMap.has(partNum)) {
              partsMap.set(partNum, {
                partNumber: partNum,
                partName: partName,
                groups: [],
              });
            }

            const part = partsMap.get(partNum)!;
            let group = part.groups.find((g) => g.groupId === q.groupId);

            if (!group) {
              group = {
                groupId: q.groupId,
                groupContent: q.groupContent,
                imageUrl: q.imageUrl,
                audioUrl: q.audioUrl,
                questions: [],
              };
              part.groups.push(group);
            }

            // Khởi tạo thêm các cờ state cho UI
            group.questions.push({
              ...q,
              isExplanationOpen: false, // Trạng thái mở khung giải thích
              isDetailOpen: false, // Trạng thái mở chi tiết
            });
          });

          const sortedParts = Array.from(partsMap.values()).sort(
            (a, b) => a.partNumber - b.partNumber
          );
          setPartGroups(sortedParts);
        }
      } catch (error) {
        console.error("Lỗi tải kết quả:", error);
        alert("Không tìm thấy kết quả bài thi!");
        router.push("/");
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [attemptId, router]);

  const loadBookmarkStatus = useCallback(async (questionIds: number[]) => {
    try {
      const result = await bookmarkService.checkBatch(questionIds);
      setBookmarkedQuestions(new Set(result.bookmarkedIds));
    } catch (error) {
      console.error("Failed to load bookmark status:", error);
    }
  }, []);

  useEffect(() => {
    if (result?.questions) {
      const questionIds = result.questions.map(
        (q: { questionId: number }) => q.questionId
      );
      loadBookmarkStatus(questionIds);
    }
  }, [result, loadBookmarkStatus]);

  // 1. Hàm tính toán nội dung Note mặc định (Logic cốt lõi)
  const getSmartDefaultNote = (q: any) => {
    if (!q.userSelected) return "Chưa làm được"; // Bỏ qua
    if (q.isCorrect) return "Lưu để tham khảo"; // Đúng
    return "Cần ôn lại lỗi sai"; // Sai
  };

  // 2. Logic xử lý khi bấm nút Bookmark
  const handleClickBookmark = (q: any) => {
    // Nếu đã có trong bookmark -> Xóa ngay (như cũ)
    if (bookmarkedQuestions.has(q.questionId)) {
       handleRemoveBookmark(q.questionId);
       return;
    }

    // Nếu chưa có -> Chuẩn bị dữ liệu và mở Modal
    setPendingBookmarkId(q.questionId);
    setSmartDefaultNote(getSmartDefaultNote(q)); // <--- Tự động điền note
    setBookmarkModalOpen(true);
  };

  // 3. Hàm xóa bookmark (tách ra cho gọn)
  const handleRemoveBookmark = async (questionId: number) => {
    setBookmarkLoading(questionId);
    try {
      await bookmarkService.remove(questionId);
      setBookmarkedQuestions((prev) => {
        const next = new Set(prev);
        next.delete(questionId);
        return next;
      });
    } catch (error) {
      console.error(error);
    } finally {
      setBookmarkLoading(null);
    }
  };

  // 4. Hàm lưu bookmark (được gọi khi bấm Save trên Modal)
  const handleSaveBookmark = async (note: string) => {
    if (!pendingBookmarkId) return;
    
    // Đóng modal ngay cho mượt
    setBookmarkModalOpen(false); 
    setBookmarkLoading(pendingBookmarkId);

    try {
      await bookmarkService.add(pendingBookmarkId, note);
      setBookmarkedQuestions((prev) => new Set(prev).add(pendingBookmarkId));
    } catch (error) {
      console.error("Failed to add bookmark:", error);
      alert("Lỗi khi lưu bookmark");
    } finally {
      setBookmarkLoading(null);
      setPendingBookmarkId(null);
    }
  };

  // --- LOGIC MỚI: Xử lý Bật/Tắt Giải thích ---
  // --- LOGIC MỚI ĐÃ SỬA ---
  const handleViewExplanation = async (qId: number) => {
    // 1. Tìm vị trí câu hỏi trong mảng (Lưu index để update cho nhanh)
    let partIndex = -1,
      groupIndex = -1,
      qIndex = -1;
    let questionData: any = null;

    partGroups.forEach((p, pIdx) =>
      p.groups.forEach((g, gIdx) =>
        g.questions.forEach((q, qIdx) => {
          if (q.questionId === qId) {
            questionData = q;
            partIndex = pIdx;
            groupIndex = gIdx;
            qIndex = qIdx;
          }
        })
      )
    );

    if (!questionData) return;

    // CASE 1: Nếu đang MỞ -> Đóng lại ngay lập tức (Ưu tiên cao nhất)
    if (questionData.isExplanationOpen) {
      setPartGroups((prev) => {
        // Copy mảng để update (Immutable)
        const newParts = [...prev];
        // Lưu ý: Cần clone object ở các cấp độ sâu hơn nếu muốn chuẩn React strict mode,
        // nhưng ở đây ta làm nhanh bằng cách mutate object trong mảng copy (vẫn trigger render)
        const targetQ =
          newParts[partIndex].groups[groupIndex].questions[qIndex];
        targetQ.isExplanationOpen = false;
        return newParts;
      });
      return;
    }

    // CASE 2: Nếu đang ĐÓNG -> Muốn Mở
    // 2a. Nếu đã có dữ liệu rồi (không cần fetch lại)
    if (questionData.shortExplanation || questionData.fullExplanation) {
      setPartGroups((prev) => {
        const newParts = [...prev];
        const targetQ =
          newParts[partIndex].groups[groupIndex].questions[qIndex];
        targetQ.isExplanationOpen = true;
        return newParts;
      });
      return;
    }

    // 2b. Nếu chưa có dữ liệu -> Gọi API
    setLoadingExplainId(qId);
    try {
      const data = await testService.getQuestionExplanation(qId);
      setPartGroups((prev) => {
        const newParts = [...prev];
        const targetQ =
          newParts[partIndex].groups[groupIndex].questions[qIndex];

        targetQ.shortExplanation = data.shortExplanation;
        targetQ.fullExplanation = data.fullExplanation;
        targetQ.isExplanationOpen = true;

        return newParts;
      });
    } catch (error) {
      console.error(error);
      alert("Không thể tải giải thích lúc này.");
    } finally {
      setLoadingExplainId(null);
    }
  };

  // --- LOGIC MỚI: Xử lý Bật/Tắt Chi tiết (Premium) ---
  const handleToggleDetail = (qId: number) => {
    setPartGroups((prev) =>
      prev.map((part) => ({
        ...part,
        groups: part.groups.map((group) => ({
          ...group,
          questions: group.questions.map((q) =>
            q.questionId === qId ? { ...q, isDetailOpen: !q.isDetailOpen } : q
          ),
        })),
      }))
    );
  };

  const handleScrollToQuestion = (qId: number) => {
    const element = document.getElementById(`question-${qId}`);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      setCurrentQuestionId(qId);
      setShowMobileNav(false);
    }
  };

  useEffect(() => {
    if (!result) return;

    const handleScroll = () => {
      const questions = document.querySelectorAll('[id^="question-"]');
      let closestId: number | null = null;
      let closestDistance = Infinity;

      questions.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const distance = Math.abs(rect.top - 120);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestId = Number(el.id.replace("question-", ""));
        }
      });

      if (closestId) setCurrentQuestionId(closestId);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [result]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-900 bg-linear-to-br from-blue-50 dark:from-zinc-900 to-indigo-100 dark:to-zinc-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 dark:border-blue-500 mx-auto mb-4"></div>
          <p className="text-blue-600 dark:text-blue-400 font-bold text-lg">Đang tải kết quả...</p>
        </div>
      </div>
    );

  if (!result) return null;

  const calculateTimeTaken = () => {
    if (result?.timeTaken) return result.timeTaken; // Nếu Backend có trả về cái này

    // Nếu không, tính thủ công (Backup)
    const duration = result?.duration || 0; // Phút
    const timeLeft = result?.timeLeft || 0; // Giây
    if (duration === 0) return timeLeft; // Trường hợp không giới hạn thời gian

    return Math.max(0, duration * 60 - timeLeft);
  };

  const actualTimeTaken = calculateTimeTaken();
  const totalQuestions = result.questions?.length || 0;
  const correctCount =
    result.questions?.filter((q: any) => q.isCorrect).length || 0;
  const incorrectCount =
    result.questions?.filter((q: any) => q.userSelected && !q.isCorrect)
      .length || 0;
  const skippedCount =
    result.questions?.filter((q: any) => !q.userSelected).length || 0;
  const percentage =
    totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  const listeningQuestions =
    result.questions?.filter((q: any) => (q.partNumber || 5) <= 4) || [];
  const readingQuestions =
    result.questions?.filter((q: any) => (q.partNumber || 5) >= 5) || [];
  const listeningCorrect = listeningQuestions.filter(
    (q: any) => q.isCorrect
  ).length;
  const readingCorrect = readingQuestions.filter(
    (q: any) => q.isCorrect
  ).length;

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 pb-24 lg:pb-10 font-sans">
      <header className="bg-white dark:bg-zinc-900 shadow-sm border-b border-gray-200 dark:border-zinc-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span className="hidden sm:inline">Trang chủ</span>
          </Link>

          <h1 className="text-lg font-bold text-gray-900 dark:text-white truncate max-w-50 md:max-w-md">
            📊 {result.testTitle}
          </h1>

          <Link
            href="/history"
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            Lịch sử thi
          </Link>
        </div>

        <div className="max-w-7xl mx-auto px-4 pb-3">
          <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
            <span className="text-green-600 dark:text-green-400 font-bold flex items-center gap-1">
              <Check size={18} /> {correctCount} đúng
            </span>
            <span className="text-red-500 dark:text-red-400 font-bold flex items-center gap-1">
              <X size={18} /> {incorrectCount} sai
            </span>
            <span className="text-gray-500 dark:text-gray-500">○ {skippedCount} bỏ qua</span>
            <div className="flex-1 h-2 bg-gray-300 dark:bg-zinc-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-green-500 to-emerald-500"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            <span className="font-bold text-blue-600 dark:text-blue-400">{percentage}%</span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-linear-to-br from-blue-500 to-indigo-600 text-white p-5 rounded-2xl shadow-lg">
            <p className="text-blue-100 text-xs uppercase tracking-wider mb-1">
              Tổng điểm
            </p>
            <p className="text-3xl font-extrabold">
              {result.totalScore}
              <span className="text-lg opacity-70">/990</span>
            </p>
          </div>
          <div className="bg-linear-to-br from-green-500 to-emerald-600 text-white p-5 rounded-2xl shadow-lg">
            <p className="text-green-100 text-xs uppercase tracking-wider mb-1">
              🎧 Listening
            </p>
            <p className="text-3xl font-extrabold">
              {listeningCorrect}
              <span className="text-lg opacity-70">/445</span>
            </p>
          </div>
          <div className="bg-linear-to-br from-purple-500 to-violet-600 text-white p-5 rounded-2xl shadow-lg">
            <p className="text-purple-100 text-xs uppercase tracking-wider mb-1">
              📖 Reading
            </p>
            <p className="text-3xl font-extrabold">
              {readingCorrect}
              <span className="text-lg opacity-70">/445</span>
            </p>
          </div>
          <div className="bg-linear-to-br from-orange-500 to-amber-600 text-white p-5 rounded-2xl shadow-lg">
            <p className="text-orange-100 text-xs uppercase tracking-wider mb-1">
              Tỉ lệ đúng
            </p>
            <p className="text-3xl font-extrabold">{percentage}%</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8 flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-3/4 space-y-10">
          {partGroups.map((part) => (
            <div key={part.partNumber} className="mb-10">
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {part.partName}
                </h2>
                <div className="h-1 flex-1 bg-gray-300 dark:bg-zinc-900 rounded-full"></div>
                {part.partNumber <= 4 ? (
                  <span className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-xs font-bold">
                    🎧 Listening
                  </span>
                ) : (
                  <span className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full text-xs font-bold">
                    📖 Reading
                  </span>
                )}
              </div>

              {part.partNumber === 1 && (
                <div className="space-y-6">
                  {part.groups.map((group) => (
                    <div
                      key={group.groupId}
                      className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border  border-gray-200 dark:border-zinc-700 overflow-hidden"
                    >
                      {group.audioUrl && (
                        <div className=" bg-gray-900 dark:bg-zinc-900 text-white p-3 rounded-xl shadow-lg flex items-center gap-3 ">
                          <audio
                            controls
                            src={`${BASE_URL}${group.audioUrl}`}
                            className="w-full h-10"
                            style={{ filter: "invert(1)" }}
                          />
                        </div>
                      )}
                      <div className="flex flex-col lg:flex-row">
                        {group.imageUrl && (
                          <div className="lg:w-1/2 bg-gray-100 dark:bg-zinc-900 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-zinc-600 p-6">
                            <img
                              src={`${BASE_URL}${group.imageUrl}`}
                              alt="Part 1"
                              className="w-full rounded-xl border border-gray-300 dark:border-zinc-600 shadow-sm"
                              loading="lazy"
                            />
                          </div>
                        )}
                        <div
                          className={`${
                            group.imageUrl ? "lg:w-1/2" : "w-full"
                          } p-6 space-y-4`}
                        >
                          {group.questions.map((q) => (
                            <div
                              key={q.questionId}
                              id={`question-${q.questionId}`}
                            >
                              <ResultQuestionItem
                                q={q}
                                currentQuestionId={currentQuestionId}
                                isBookmarked={bookmarkedQuestions.has(
                                  q.questionId
                                )}
                                isBookmarkLoading={
                                  bookmarkLoading === q.questionId
                                }
                                isExplainLoading={
                                  loadingExplainId === q.questionId
                                }
                                canExplain={part.partNumber >= 5} 
                                // Truyền các hàm xử lý xuống
                                onToggleBookmark={() => handleClickBookmark(q)}
                                onViewExplanation={handleViewExplanation}
                                onToggleDetail={handleToggleDetail}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {part.partNumber === 2 && (
                <div className="space-y-4">
                  {part.groups.map((group) => (
                    <div
                      key={group.groupId}
                      className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-700 p-6"
                    >
                      {group.audioUrl && (
                        <div className="mb-4">
                          <audio
                            controls
                            src={`${BASE_URL}${group.audioUrl}`}
                            className="w-full h-12 rounded-lg"
                          />
                        </div>
                      )}
                      {group.questions.map((q) => (
                        <div key={q.questionId} id={`question-${q.questionId}`}>
                          <ResultQuestionItem
                            q={q}
                            currentQuestionId={currentQuestionId}
                            isBookmarked={bookmarkedQuestions.has(q.questionId)}
                            isBookmarkLoading={bookmarkLoading === q.questionId}
                            isExplainLoading={loadingExplainId === q.questionId}
                            // Truyền các hàm xử lý xuống
                            canExplain={part.partNumber >= 5} 
                            onToggleBookmark={() => handleClickBookmark(q)}
                            onViewExplanation={handleViewExplanation}
                            onToggleDetail={handleToggleDetail}
                          />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}

              {(part.partNumber === 3 || part.partNumber === 4) && (
                <div className="space-y-8">
                  {part.groups.map((group) => (
                    <div
                      key={group.groupId}
                      className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-700 overflow-hidden"
                    >
                      <div className=" text-white p-4">
                        <div className="flex items-center gap-4">
                          
                          {group.audioUrl && (
                            <audio
                              controls
                              src={`${BASE_URL}${group.audioUrl}`}
                              className="flex-1 h-10"
                              style={{ filter: "invert(1)" }}
                            />
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col lg:flex-row">
                        {(group.imageUrl || group.groupContent) && (
                          <div className="lg:w-1/2 bg-gray-100 dark:bg-zinc-900 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-zinc-600 p-6">
                            <div className="lg:sticky lg:top-36 space-y-4">
                              {group.imageUrl && (
                                <img
                                  src={`${BASE_URL}${group.imageUrl}`}
                                  alt="Visual"
                                  className="w-full rounded-xl border border-gray-300 dark:border-zinc-600 shadow-sm"
                                  loading="lazy"
                                />
                              )}
                              {group.groupContent && (
                                <div
                                  className="prose prose-sm max-w-none bg-white dark:bg-zinc-900 dark:[&_p]:text-white dark:[&_*]:text-white p-4 rounded-lg border border-gray-200 dark:border-zinc-600"
                                  dangerouslySetInnerHTML={{
                                    __html: group.groupContent,
                                  }}
                                />
                              )}
                            </div>
                          </div>
                        )}

                        <div
                          className={`${
                            group.imageUrl || group.groupContent
                              ? "lg:w-1/2"
                              : "w-full"
                          } p-6 space-y-6`}
                        >
                          {group.questions.map((q) => (
                            <div
                              key={q.questionId}
                              id={`question-${q.questionId}`}
                            >
                              <ResultQuestionItem
                                q={q}
                                canExplain={part.partNumber >= 5}
                                currentQuestionId={currentQuestionId}
                                isBookmarked={bookmarkedQuestions.has(
                                  q.questionId
                                )}
                                isBookmarkLoading={
                                  bookmarkLoading === q.questionId
                                }
                                isExplainLoading={
                                  loadingExplainId === q.questionId
                                }
                                // Truyền các hàm xử lý xuống
                                
                                onToggleBookmark={() => handleClickBookmark(q)}
                                onViewExplanation={handleViewExplanation}
                                onToggleDetail={handleToggleDetail}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {part.partNumber === 5 && (
                <div className="space-y-4">
                  {part.groups.map((group) => (
                    <div
                      key={group.groupId}
                      className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-700 p-6"
                    >
                      {group.questions.map((q) => (
                        <div key={q.questionId} id={`question-${q.questionId}`}>
                          <ResultQuestionItem
                            q={q}
                            currentQuestionId={currentQuestionId}
                            isBookmarked={bookmarkedQuestions.has(q.questionId)}
                            isBookmarkLoading={bookmarkLoading === q.questionId}
                            isExplainLoading={loadingExplainId === q.questionId}
                            // Truyền các hàm xử lý xuống
                            onToggleBookmark={() => handleClickBookmark(q)}
                            onViewExplanation={handleViewExplanation}
                            onToggleDetail={handleToggleDetail}
                          />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}

              {(part.partNumber === 6 || part.partNumber === 7) && (
                <div className="space-y-8">
                  {part.groups.map((group) => (
                    <div
                      key={group.groupId}
                      className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-700 overflow-hidden"
                    >
                      <div className="flex flex-col lg:flex-row">
                        <div className="lg:w-1/2 bg-gray-100 dark:bg-zinc-900 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-zinc-600 p-6">
                          <div className="lg:sticky lg:top-24 max-h-[80vh] overflow-y-auto custom-scrollbar">
                            <div className="mb-3 text-purple-600 dark:text-purple-400 font-bold text-xs uppercase tracking-widest">
                              📖 Reading Passage
                            </div>
                            {group.imageUrl && (
                              <img
                                src={`${BASE_URL}${group.imageUrl}`}
                                alt="Passage"
                                className="w-full rounded-lg border border-gray-300 dark:border-zinc-800 shadow-sm mb-4"
                                loading="lazy"
                              />
                            )}
                            {group.groupContent && (
                              <div
                                className="max-w-none bg-white dark:bg-zinc-900 dark:[&_p]:text-white dark:[&_*]:text-white p-5 rounded-lg border border-gray-200 dark:border-zinc-600 shadow-sm leading-7 whitespace-pre-line"
                                dangerouslySetInnerHTML={{
                                  __html: group.groupContent,
                                }}
                              />
                            )}
                          </div>
                        </div>

                        <div className="lg:w-1/2 p-6 space-y-6 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-zinc-600">
                          {group.questions.map((q) => (
                            <div
                              key={q.questionId}
                              id={`question-${q.questionId}`}
                            >
                              <ResultQuestionItem
                                q={q}
                                currentQuestionId={currentQuestionId}
                                isBookmarked={bookmarkedQuestions.has(
                                  q.questionId
                                )}
                                isBookmarkLoading={
                                  bookmarkLoading === q.questionId
                                }
                                isExplainLoading={
                                  loadingExplainId === q.questionId
                                }
                                // Truyền các hàm xử lý xuống
                                onToggleBookmark={() => handleClickBookmark(q)}
                                onViewExplanation={handleViewExplanation}
                                onToggleDetail={handleToggleDetail}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {result?.testId && (
            <div className="mt-12 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <CommentSection testId={result.testId} />
            </div>
          )}
        </div>

        <div className="hidden lg:block lg:w-1/4">
          <ResultRightSidebar
            parts={partGroups}
            timeTaken={actualTimeTaken}
            questions={result.questions || []}
            totalScore={result.totalScore}
            totalQuestions={totalQuestions}
            onScrollToQuestion={handleScrollToQuestion}
            currentQuestionId={currentQuestionId}
          />
        </div>
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-700 shadow-lg z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setShowMobileNav(!showMobileNav)}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <span className="font-medium">
              {correctCount}/{totalQuestions}
            </span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-green-600 dark:text-green-400 font-bold text-sm flex items-center gap-1">
              <Check size={18} />{correctCount}
            </span>
            <span className="text-red-500 dark:text-red-400 font-bold text-sm flex items-center gap-1">
              <X size={18} />{incorrectCount}
            </span>
          </div>

          <Link
            href="/"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm"
          >
            Trang chủ
          </Link>
        </div>

        {showMobileNav && (
          <div className="border-t border-gray-100 dark:border-zinc-700 p-4 max-h-[50vh] overflow-y-auto bg-gray-50 dark:bg-zinc-900">
            {partGroups.map((part) => (
              <div key={part.partNumber} className="mb-4">
                <h4 className="font-bold text-gray-700 dark:text-gray-300 text-sm mb-2">
                  {part.partName}
                </h4>
                <div className="grid grid-cols-8 gap-2">
                  {part.groups
                    .flatMap((g) => g.questions)
                    .map((q) => {
                      let colorClass =
                        "bg-gray-300 dark:bg-zinc-600 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-zinc-600";
                      if (q.userSelected) {
                        colorClass = q.isCorrect
                          ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-green-400 dark:border-green-700"
                          : "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 border-red-300 dark:border-red-700";
                      }
                      return (
                        <button
                          key={q.questionId}
                          onClick={() => handleScrollToQuestion(q.questionId)}
                          className={`h-9 w-9 text-xs font-bold rounded-lg flex items-center justify-center border transition-all
                          ${
                            currentQuestionId === q.questionId
                              ? "ring-2 ring-blue-400 dark:ring-blue-500"
                              : ""
                          } ${colorClass}`}
                        >
                          {q.questionNo}
                        </button>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* --- CHÈN MODAL VÀO CUỐI TRANG --- */}
       <BookmarkNoteModal 
         isOpen={bookmarkModalOpen}
         onClose={() => setBookmarkModalOpen(false)}
         onSave={handleSaveBookmark}
         defaultNote={smartDefaultNote}
       />
    </div>
  );
}
