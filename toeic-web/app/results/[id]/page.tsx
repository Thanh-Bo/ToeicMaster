"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Check,
  X,
  BarChart3,
  Headphones,
  BookOpen,
  Circle,
  Languages,
  Loader2,
  FileText,
  Bookmark,
  Tag,
  Sparkles,
  ChevronUp,
  ChevronDown,
  Trophy,
  Award,
} from "lucide-react";
import { testService } from "../../services/testService";
import { bookmarkService } from "../../services/bookmarkService";
import { ResultDetail } from "../../types";
import ResultRightSidebar from "@/app/components/results/ResultRightSidebar";
import { CommentSection } from "@/app/components/comments/CommentSection";
import ResultQuestionItem from "@/app/components/results/ResultQuestionItem";
import BookmarkNoteModal from "@/app/components/boomarks/BookmarkNoteModal";
import AudioPlayer from "@/app/components/audio/AudioPlayer";
import { AnswerOptionResult } from "@/app/components/results/AnswerOptionResult";

const BASE_URL = "http://localhost:5298";

interface PartGroup {
  partNumber: number;
  partName: string;
  groups: {
    groupId: number;
    groupContent?: string;
    imageUrl?: string;
    audioUrl?: string;
    transcript?: string;
    questions: any[];
  }[];
}

export default function ResultPage() {
  const params = useParams();
  const router = useRouter();
  const attemptId = params.id as string; // Keep as string for UUID

  const [result, setResult] = useState<ResultDetail | null>(null);
  const [partGroups, setPartGroups] = useState<PartGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingExplainIds, setLoadingExplainIds] = useState<Set<number>>(
    new Set(),
  );
  const [currentQuestionId, setCurrentQuestionId] = useState<number | null>(
    null,
  );
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<Set<number>>(
    new Set(),
  );
  const [bookmarkLoading, setBookmarkLoading] = useState<number | null>(null);

  const [bookmarkModalOpen, setBookmarkModalOpen] = useState(false);
  const [pendingBookmarkId, setPendingBookmarkId] = useState<number | null>(
    null,
  );
  const [smartDefaultNote, setSmartDefaultNote] = useState("");
  const [showResultSidebar, setShowResultSidebar] = useState(false);

  // Passage translation state (keyed by groupId)
  const [translations, setTranslations] = useState<Record<number, string>>({});
  const [loadingTranslateIds, setLoadingTranslateIds] = useState<
    Record<number, boolean>
  >({});

  // Transcript translation state (keyed by groupId, for Part 3/4)
  const [transcriptTranslations, setTranscriptTranslations] = useState<
    Record<number, string>
  >({});
  const [loadingTranscriptTranslateIds, setLoadingTranscriptTranslateIds] =
    useState<Record<number, boolean>>({});

  // Visibility toggles (Set of groupIds where content is hidden)
  const [hiddenTranscripts, setHiddenTranscripts] = useState<Set<number>>(
    new Set(),
  );
  const [hiddenTranscriptTranslations, setHiddenTranscriptTranslations] =
    useState<Set<number>>(new Set());
  const [hiddenPassageTranslations, setHiddenPassageTranslations] = useState<
    Set<number>
  >(new Set());

  const toggleTranscript = (id: number) =>
    setHiddenTranscripts((prev) => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  const toggleTranscriptTranslation = (id: number) =>
    setHiddenTranscriptTranslations((prev) => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  const togglePassageTranslation = (id: number) =>
    setHiddenPassageTranslations((prev) => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });

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
                transcript: q.transcript,
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
            (a, b) => a.partNumber - b.partNumber,
          );
          setPartGroups(sortedParts);

          // Pre-populate cached translations from DB (avoid calling AI again)
          const cachedContent: Record<number, string> = {};
          const cachedTranscript: Record<number, string> = {};
          response.data.questions.forEach((q: any) => {
            if (q.groupId) {
              if (q.groupContentTranslation)
                cachedContent[q.groupId] = q.groupContentTranslation;
              if (q.transcriptTranslation)
                cachedTranscript[q.groupId] = q.transcriptTranslation;
            }
          });
          if (Object.keys(cachedContent).length > 0)
            setTranslations(cachedContent);
          if (Object.keys(cachedTranscript).length > 0)
            setTranscriptTranslations(cachedTranscript);
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
        (q: { questionId: number }) => q.questionId,
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
    } catch (error: any) {
      console.error(error);
      if (error?.response?.status === 403) {
        window.location.href = "/subscription";
        return;
      }
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

  // --- LOGIC: Dịch đoạn văn Part 6/7 ---
  const handleTranslatePassage = async (
    group: PartGroup["groups"][0],
    partNumber: number,
    force = false,
  ) => {
    if (translations[group.groupId] && !force) return; // Đã dịch rồi, không gọi lại
    if (!group.groupContent) return;

    // Xóa cache cũ nếu force re-translate
    if (force) {
      setTranslations((prev) => {
        const next = { ...prev };
        delete next[group.groupId];
        return next;
      });
    }

    setLoadingTranslateIds((prev) => ({
      ...prev,
      [group.groupId]: true,
    }));
    try {
      // 1. Giữ nguyên HTML (bao gồm <table>) để AI nhìn thấy cấu trúc bảng
      //    Chỉ thay thế blank answers trong text nodes, không strip toàn bộ HTML
      let htmlContent = group.groupContent;

      // 2. Thay thế mỗi blank "------- (N)" bằng đáp án đúng của câu hỏi N
      group.questions.forEach((q: any) => {
        const correctAnswer =
          q.answers?.find((a: any) => a.label === q.correctOption)?.content ??
          q.correctOption;
        // Tìm pattern ------- (questionNo) và thay bằng đáp án
        const regex = new RegExp(`-{3,}\\s*\\(${q.questionNo}\\)`, "g");
        htmlContent = htmlContent.replace(regex, correctAnswer);
      });

      // 3. Gọi API dịch và lưu vào DB (gửi HTML thay vì plain text)
      const result = await testService.translatePassage(
        htmlContent,
        group.groupId,
        "content",
        partNumber,
      );
      setTranslations((prev) => ({
        ...prev,
        [group.groupId]: result.translation,
      }));
    } catch (error) {
      console.error("Lỗi dịch đoạn văn:", error);
      alert("Không thể dịch đoạn văn lúc này.");
    } finally {
      setLoadingTranslateIds((prev) => {
        const next = { ...prev };
        next[group.groupId] = false;
        return next;
      });
    }
  };

  // --- LOGIC: Dịch transcript Part 3/4 ---
  const handleTranslateTranscript = async (group: PartGroup["groups"][0]) => {
    if (transcriptTranslations[group.groupId]) return;
    if (!group.transcript) return;

    setLoadingTranscriptTranslateIds((prev) => ({
      ...prev,
      [group.groupId]: true,
    }));
    try {
      // Gửi transcript thô và lưu vào DB
      const result = await testService.translatePassage(
        group.transcript,
        group.groupId,
        "transcript",
      );
      setTranscriptTranslations((prev) => ({
        ...prev,
        [group.groupId]: result.translation,
      }));
    } catch (error) {
      console.error("Lỗi dịch transcript:", error);
      alert("Không thể dịch transcript lúc này.");
    } finally {
      setLoadingTranscriptTranslateIds((prev) => {
        const next = { ...prev };
        next[group.groupId] = false;
        return next;
      });
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
        }),
      ),
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
    if (questionData.explanationLocked) {
      window.location.href = "/subscription";
      return;
    }

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
    setLoadingExplainIds((prev) => new Set(prev).add(qId));
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
      setLoadingExplainIds((prev) => {
        const next = new Set(prev);
        next.delete(qId);
        return next;
      });
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
            q.questionId === qId ? { ...q, isDetailOpen: !q.isDetailOpen } : q,
          ),
        })),
      })),
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

  // Helper function to format transcript translation with proper grid layout
  const formatTranscriptTranslationHTML = (text: string) => {
    if (!text || text.trim().length === 0) return "";

    // Normalize: replace <br> with newlines for consistent processing
    // Remove any double newlines or extra whitespace
    const normalizedText = text
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/\n\s*\n/g, "\n")
      .trim();

    return normalizedText
      .split("\n")
      .filter((line) => line.trim())
      .map((line) => {
        const trimmed = line.trim();
        const match = trimmed.match(/^(W\d?|M\d?|Man|Woman|Nam|Nữ|Narrator)\s*:\s*(.*)/i);
        if (match) {
          const label = match[1];
          const content = match[2];
          // Removed margin-bottom - use gap for spacing only
          return `<div style="display: grid; grid-template-columns: auto 1fr; gap: 0.5rem; align-items: start;"><span style="font-weight: bold; color: inherit; white-space: nowrap;">${label}:</span><span style="word-break: break-word; overflow-wrap: break-word;">${content}</span></div>`;
        }
        return `<p style="margin: 0; padding: 0;">${trimmed}</p>`;
      })
      .join("");
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 dark:border-zinc-700 border-t-gray-900 dark:border-t-white mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Đang tải kết quả...
          </p>
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
    (q: any) => q.isCorrect,
  ).length;
  const readingCorrect = readingQuestions.filter(
    (q: any) => q.isCorrect,
  ).length;

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 pb-24 lg:pb-10 font-sans">
      <header className="bg-white dark:bg-zinc-950 shadow-sm border-b border-gray-200 dark:border-zinc-700 sticky top-0 z-50">
        <div className="max-full px-4  flex justify-between items-center">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
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
            <BarChart3 className="inline mr-2" size={24} />
            {result.testTitle}
          </h1>

          <div className="w-20" />
        </div>

        <div className="max-w-7xl mx-auto px-4 pb-3">
          <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
            <span className="text-green-600 dark:text-green-400 font-bold flex items-center gap-1">
              <Check size={18} /> {correctCount} đúng
            </span>
            <span className="text-red-500 dark:text-red-400 font-bold flex items-center gap-1">
              <X size={18} /> {incorrectCount} sai
            </span>
            <span className="text-gray-500 dark:text-gray-500 flex items-center gap-1">
              <Circle size={14} /> {skippedCount} bỏ qua
            </span>
            <div className="flex-1 h-2 bg-gray-300 dark:bg-gray-400 rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-green-500 to-emerald-500"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            <span className="font-bold text-gray-900 dark:text-white">
              {percentage}%
            </span>
            <button
              onClick={() => setShowResultSidebar(!showResultSidebar)}
              className="hidden lg:flex items-center gap-2 bg-blue-500 dark:bg-blue-700 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors font-bold shadow-md ml-auto"
              title="Hiện/Ẩn tóm tắt kết quả"
            >
              <BarChart3 size={18} />
              <span className="text-sm">
                <span>{correctCount}</span>
                <span>/</span>
                <span>{totalQuestions}</span>
              </span>
            </button>
          </div>
        </div>
      </header>

      <div className="w-full mx-auto px-3 sm:px-4 mt-4 sm:mt-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
          {/* Card 1: Tổng điểm (Hero style) */}
          <div className="bg-blue-50/40 dark:bg-blue-950/10 border border-blue-200 dark:border-blue-800/60 p-4 sm:p-5 rounded-2xl shadow-xs transition hover:shadow-md">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-blue-600 dark:text-blue-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                {result.isFullTest === false ? "Câu đúng" : "Tổng điểm"}
              </span>
              <Trophy size={16} className="text-blue-500" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400 font-mono">
              {result.isFullTest === false ? correctCount : result.totalScore}
              <span className="text-sm sm:text-lg text-blue-400 dark:text-blue-500 font-normal">
                /{result.isFullTest === false ? totalQuestions : 990}
              </span>
            </p>
          </div>

          {/* Card 2: Điểm số chi tiết (LC / RC) */}
          <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md border border-gray-200 dark:border-zinc-700/80 p-4 sm:p-5 rounded-2xl shadow-xs transition hover:shadow-md">
            <span className="text-gray-400 dark:text-gray-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider block mb-1.5">
              Chi tiết điểm số
            </span>
            <div className="flex flex-col gap-1 sm:gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400 text-xs flex items-center gap-1">
                  <Headphones size={14} className="text-sky-500" /> Nghe:
                </span>
                <span className="text-sm sm:text-base font-extrabold text-gray-900 dark:text-white font-mono">
                  {result.isFullTest === false ? listeningCorrect : result.listeningScore || 0}
                  <span className="text-[10px] sm:text-xs text-gray-400 font-normal">
                    /{result.isFullTest === false ? listeningQuestions.length : 495}
                  </span>
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400 text-xs flex items-center gap-1">
                  <BookOpen size={14} className="text-emerald-500" /> Đọc:
                </span>
                <span className="text-sm sm:text-base font-extrabold text-gray-900 dark:text-white font-mono">
                  {result.isFullTest === false ? readingCorrect : result.readingScore || 0}
                  <span className="text-[10px] sm:text-xs text-gray-400 font-normal">
                    /{result.isFullTest === false ? readingQuestions.length : 495}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Listening Correct */}
          <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md border border-gray-200 dark:border-zinc-700/80 p-4 sm:p-5 rounded-2xl shadow-xs transition hover:shadow-md">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-gray-400 dark:text-gray-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                <Headphones size={12} className="text-sky-500" /> Câu đúng Nghe
              </span>
            </div>
            <p className="text-xl sm:text-3xl font-extrabold text-gray-900 dark:text-white font-mono">
              {listeningCorrect}
              <span className="text-sm sm:text-lg text-gray-400 dark:text-gray-500 font-normal">
                /{listeningQuestions.length}
              </span>
            </p>
          </div>

          {/* Card 4: Reading Correct */}
          <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md border border-gray-200 dark:border-zinc-700/80 p-4 sm:p-5 rounded-2xl shadow-xs transition hover:shadow-md">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-gray-400 dark:text-gray-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                <BookOpen size={12} className="text-emerald-500" /> Câu đúng Đọc
              </span>
            </div>
            <p className="text-xl sm:text-3xl font-extrabold text-gray-900 dark:text-white font-mono">
              {readingCorrect}
              <span className="text-sm sm:text-lg text-gray-400 dark:text-gray-500 font-normal">
                /{readingQuestions.length}
              </span>
            </p>
          </div>

          {/* Card 5: Tỉ lệ đúng (Accent style) */}
          <div className="bg-green-50/40 dark:bg-green-950/10 border border-green-200 dark:border-green-800/60 p-4 sm:p-5 rounded-2xl shadow-xs transition hover:shadow-md">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-green-600 dark:text-green-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                Tỉ lệ chính xác
              </span>
              <span className="text-green-500 text-xs font-bold font-mono">%</span>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-green-600 dark:text-green-400 font-mono">
              {percentage}%
            </p>
          </div>
        </div>
      </div>

      <div className="px-3 sm:px-4 mt-6 sm:mt-8 flex flex-col lg:flex-row gap-4 sm:gap-8">
        <div className="w-full space-y-10">
          {partGroups.map((part) => (
            <div key={part.partNumber} className="mb-10">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {part.partName}
                </h2>
                <div className="h-1 flex-1 bg-gray-300 dark:bg-zinc-900 rounded-full"></div>
                {part.partNumber <= 4 ? (
                  <span className="border border-gray-200 dark:border-zinc-700 text-gray-500 dark:text-gray-400 px-2 sm:px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit">
                    <Headphones size={12} className="sm:w-3.5 sm:h-3.5" /> Listening
                  </span>
                ) : (
                  <span className="border border-gray-200 dark:border-zinc-700 text-gray-500 dark:text-gray-400 px-2 sm:px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit">
                    <BookOpen size={12} className="sm:w-3.5 sm:h-3.5" /> Reading
                  </span>
                )}
              </div>

              {part.partNumber === 1 && (
                <div className="space-y-4 md:space-y-6">
                  {part.groups.map((group) => (
                    <div
                      key={group.groupId}
                      className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-700 overflow-hidden"
                    >
                      <div className="flex flex-col lg:flex-row">
                        {/* Left column: audio + image */}
                        <div className="w-full lg:w-1/2 bg-gray-100 dark:bg-zinc-900 flex flex-col border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-zinc-600">
                          {group.audioUrl && (
                            <AudioPlayer
                              src={
                                group.audioUrl.startsWith("http")
                                  ? group.audioUrl
                                  : `${BASE_URL}${group.audioUrl}`
                              }
                              label={`Conversation ${group.groupId}`}
                              className="rounded-none border-0 shadow-none"
                            />
                          )}
                          {group.imageUrl && (
                            <div className="flex items-center justify-center px-3 py-3 md:px-4 md:pb-4 md:pt-3">
                              <img
                                src={
                                  group.imageUrl.startsWith("http")
                                    ? group.imageUrl
                                    : `${BASE_URL}${group.imageUrl}`
                                }
                                alt="Part 1"
                                className="max-h-64 md:max-h-100 w-auto rounded-xl border border-gray-300 dark:border-zinc-600 shadow-sm object-contain"
                                loading="lazy"
                              />
                            </div>
                          )}
                        </div>
                        {/* Right column: questions */}
                        <div className="w-full lg:w-1/2 p-4 md:p-6 space-y-3 md:space-y-4">
                          {group.questions.map((q) => (
                            <div
                              key={q.questionId}
                              id={`question-${q.questionId}`}
                            >
                              <ResultQuestionItem
                                q={q}
                                currentQuestionId={currentQuestionId}
                                isBookmarked={bookmarkedQuestions.has(
                                  q.questionId,
                                )}
                                isBookmarkLoading={
                                  bookmarkLoading === q.questionId
                                }
                                isExplainLoading={loadingExplainIds.has(
                                  q.questionId,
                                )}
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
                <div className="space-y-4 md:space-y-6">
                  {part.groups.map((group, idx) => (
                    <div
                      key={group.groupId}
                      className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-700 overflow-hidden"
                    >
                      <div className="flex flex-col lg:flex-row">
                        {/* Left: audio player flush */}
                        <div className="w-full lg:w-1/2 bg-gray-100 dark:bg-zinc-900 flex flex-col border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-zinc-600">
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
                        {/* Right: questions in a column */}
                        <div className="w-full lg:w-1/2 p-4 md:p-6 space-y-3 md:space-y-4">
                          {group.questions.map((q) => (
                            <div
                              key={q.questionId}
                              id={`question-${q.questionId}`}
                            >
                              <ResultQuestionItem
                                q={q}
                                currentQuestionId={currentQuestionId}
                                isBookmarked={bookmarkedQuestions.has(
                                  q.questionId,
                                )}
                                isBookmarkLoading={
                                  bookmarkLoading === q.questionId
                                }
                                isExplainLoading={loadingExplainIds.has(
                                  q.questionId,
                                )}
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

              {(part.partNumber === 3 || part.partNumber === 4) && (
                <div className="space-y-6 md:space-y-8">
                  {part.groups.map((group) => (
                    <div
                      key={group.groupId}
                      className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-700 overflow-hidden"
                    >
                      <div className="flex flex-col lg:flex-row">
                        {(group.imageUrl ||
                          group.groupContent ||
                          group.audioUrl ||
                          group.transcript) && (
                          <div className="w-full lg:w-1/2 bg-gray-100 dark:bg-zinc-900 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-zinc-600 flex flex-col">
                            {group.audioUrl && (
                              <AudioPlayer
                                src={
                                  group.audioUrl.startsWith("http")
                                    ? group.audioUrl
                                    : `${BASE_URL}${group.audioUrl}`
                                }
                                label={`Conversation ${group.groupId}`}
                                className="rounded-none border-0 shadow-none"
                              />
                            )}
                            {(group.imageUrl ||
                              group.groupContent ||
                              group.transcript) && (
                              <div className="lg:sticky lg:top-20 px-3 md:px-6 pb-4 md:pb-6 pt-2 md:pt-3 space-y-3 md:space-y-4 max-h-[60vh] lg:max-h-[70vh] overflow-y-auto custom-scrollbar">
                                {group.imageUrl && (
                                  <img
                                    src={
                                      group.imageUrl.startsWith("http")
                                        ? group.imageUrl
                                        : `${BASE_URL}${group.imageUrl}`
                                    }
                                    alt="Part 3"
                                    className="rounded-lg shadow-sm max-h-64 md:max-h-100 w-auto object-contain"
                                  />
                                )}
                                {group.groupContent && (
                                  <div
                                    className="prose prose-sm max-w-none bg-white dark:bg-zinc-900 dark:[&_p]:text-white dark:[&_*]:text-white p-3 md:p-4 rounded-lg border border-gray-200 dark:border-zinc-600 text-sm md:text-base"
                                    dangerouslySetInnerHTML={{
                                      __html: group.groupContent,
                                    }}
                                  />
                                )}
                                {group.transcript && (
                                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-4">
                                    <div className="flex items-center justify-between mb-3">
                                      <span className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                                        <FileText className="w-4 h-4" />
                                        Transcript
                                      </span>
                                      <button
                                        onClick={() =>
                                          toggleTranscript(group.groupId)
                                        }
                                        className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                                      >
                                        {hiddenTranscripts.has(group.groupId)
                                          ? "Hiện"
                                          : "Ẩn"}
                                      </button>
                                    </div>
                                    {!hiddenTranscripts.has(group.groupId) && (
                                      <div className="text-base text-gray-800 dark:text-gray-200 leading-relaxed space-y-2">
                                        {group.transcript
                                          .split(
                                            /(?=(?:W\d?|M\d?|Man|Woman|Narrator)\s*:)/gi,
                                          )
                                          .filter((line: string) => line.trim())
                                          .map((line: string, i: number) => {
                                            const match = line.match(
                                              /^((?:W\d?|M\d?|Man|Woman|Narrator)\s*:)([\s\S]*)/i,
                                            );
                                            if (match) {
                                              return (
                                                <div
                                                  key={i}
                                                  className="grid grid-cols-[auto_1fr] gap-2 items-start"
                                                >
                                                  <span className="font-bold text-gray-900 dark:text-white whitespace-nowrap">
                                                    {match[1]}
                                                  </span>
                                                  <span className="break-words">
                                                    {match[2]}
                                                  </span>
                                                </div>
                                              );
                                            }
                                            return <p key={i}>{line.trim()}</p>;
                                          })}
                                      </div>
                                    )}
                                  </div>
                                )}

                                {/* Separate card: Dịch transcript */}
                                {group.transcript && (
                                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800 p-4">
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="flex items-center gap-1.5 text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                                        <Languages className="w-4 h-4" />
                                        Bản dịch Transcript
                                      </span>
                                      {transcriptTranslations[
                                        group.groupId
                                      ] && (
                                        <button
                                          onClick={() =>
                                            toggleTranscriptTranslation(
                                              group.groupId,
                                            )
                                          }
                                          className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border border-purple-300 dark:border-purple-700 transition-colors ${
                                            hiddenTranscriptTranslations.has(
                                              group.groupId,
                                            )
                                              ? "text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/40"
                                              : "text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/40"
                                          }`}
                                        >
                                          {hiddenTranscriptTranslations.has(
                                            group.groupId,
                                          )
                                            ? "Hiện"
                                            : "Ẩn"}
                                        </button>
                                      )}
                                    </div>
                                    {!transcriptTranslations[group.groupId] ? (
                                      <button
                                        onClick={() =>
                                          handleTranslateTranscript(group)
                                        }
                                        disabled={
                                          !!loadingTranscriptTranslateIds[
                                            group.groupId
                                          ]
                                        }
                                        className="flex items-center gap-2 text-base font-medium text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200 border border-purple-300 dark:border-purple-700 rounded-lg px-3 py-1.5 transition-colors disabled:opacity-50"
                                      >
                                        {!!loadingTranscriptTranslateIds[
                                          group.groupId
                                        ] ? (
                                          <>
                                            <Loader2
                                              size={13}
                                              className="animate-spin"
                                            />{" "}
                                            Đang dịch...
                                          </>
                                        ) : (
                                          <>
                                            <Languages size={13} /> Dịch
                                            transcript
                                          </>
                                        )}
                                      </button>
                                    ) : (
                                      !hiddenTranscriptTranslations.has(
                                        group.groupId,
                                      ) && (
                                        <div
                                          className="max-h-[30vh] space-y-1.5 overflow-y-auto custom-scrollbar text-base text-gray-700 dark:text-gray-300 leading-6"
                                          dangerouslySetInnerHTML={{
                                            __html:
                                              formatTranscriptTranslationHTML(
                                                transcriptTranslations[
                                                  group.groupId
                                                ] || "",
                                              ),
                                          }}
                                        ></div>
                                      )
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        <div
                          className={`${
                            group.imageUrl ||
                            group.groupContent ||
                            group.audioUrl ||
                            group.transcript
                              ? "w-full lg:w-1/2"
                              : "w-full"
                          } p-4 md:p-6 space-y-4 md:space-y-6 overflow-y-auto max-h-[60vh] lg:max-h-[80vh] custom-scrollbar`}
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
                                  q.questionId,
                                )}
                                isBookmarkLoading={
                                  bookmarkLoading === q.questionId
                                }
                                isExplainLoading={loadingExplainIds.has(
                                  q.questionId,
                                )}
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
                <div className="space-y-3 md:space-y-4">
                  {part.groups.map((group) => (
                    <div key={group.groupId}>
                      {group.questions.map((q) => (
                        <div
                          key={q.questionId}
                          id={`question-${q.questionId}`}
                          className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-700 overflow-hidden"
                        >
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-0">
                            {/* LEFT: Câu hỏi + Đáp án */}
                            <div className="p-4 md:p-6 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-zinc-700">
                              <div className="flex gap-2 md:gap-3 mb-3 md:mb-4">
                                <span
                                  className={`shrink-0 w-8 h-8 md:w-10 md:h-10 font-bold rounded-full flex items-center justify-center text-xs md:text-sm shadow-sm
                                    ${
                                      q.isCorrect
                                        ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-2 border-green-300 dark:border-green-700"
                                        : q.userSelected
                                        ? "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 border-2 border-red-300 dark:border-red-700"
                                        : "bg-gray-300 dark:bg-zinc-600 text-gray-600 dark:text-gray-300 border-2 border-gray-300 dark:border-zinc-600"
                                    }`}
                                >
                                  {q.questionNo}
                                </span>
                                <div className="flex-1 pt-0.5 md:pt-1">
                                  <p className="font-medium text-gray-900 dark:text-white text-base md:text-lg leading-relaxed">
                                    {q.content}
                                  </p>
                                </div>
                              </div>

                              {/* Đáp án */}
                              <div className="space-y-2 ml-10 md:ml-12">
                                {["A", "B", "C", "D"].map((label) => (
                                  <AnswerOptionResult
                                    key={label}
                                    q={q}
                                    label={label}
                                    content={
                                      q.answers && Array.isArray(q.answers)
                                        ? q.answers.find(
                                            (a: any) => a.label === label,
                                          )?.content || ""
                                        : q[`option${label}`] || ""
                                    }
                                  />
                                ))}
                              </div>
                            </div>

                            {/* RIGHT: Sticky - Nút + Giải thích */}
                            <div className="p-4 md:p-6 lg:sticky lg:top-4 lg:max-h-[90vh] overflow-y-auto custom-scrollbar">
                              {/* Nút Bookmark + Xem giải thích */}
                              <div className="flex flex-wrap gap-2 md:gap-3 mb-4 md:mb-6">
                                {/* Nút Bookmark */}
                                <button
                                  onClick={() => handleClickBookmark(q)}
                                  disabled={bookmarkLoading === q.questionId}
                                  className={`inline-flex items-center gap-1.5 md:gap-2 text-xs md:text-sm font-bold px-3 md:px-4 py-1.5 md:py-2 rounded-lg transition-colors
                                      ${
                                        bookmarkedQuestions.has(q.questionId)
                                          ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300"
                                          : "bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-gray-300"
                                      }`}
                                >
                                  {bookmarkLoading === q.questionId ? (
                                    <Loader2 className="h-3.5 w-3.5 md:h-4 md:w-4 animate-spin" />
                                  ) : bookmarkedQuestions.has(q.questionId) ? (
                                    <>
                                      <Bookmark size={14} className="md:w-4 md:h-4" /> <span className="hidden sm:inline">Đã lưu</span>
                                    </>
                                  ) : (
                                    <>
                                      <Tag size={14} className="md:w-4 md:h-4" /> <span className="hidden sm:inline">Đánh dấu</span>
                                    </>
                                  )}
                                </button>

                                {/* Nút Xem giải thích */}
                                <button
                                  onClick={() =>
                                    handleViewExplanation(q.questionId)
                                  }
                                  className={`inline-flex items-center gap-1.5 md:gap-2 text-xs md:text-sm font-bold px-3 md:px-4 py-1.5 md:py-2 rounded-lg transition-colors 
                                      ${
                                        q.isExplanationOpen
                                          ? "bg-red-600 hover:bg-red-700 text-white"
                                          : "bg-blue-600 hover:bg-blue-700 text-white"
                                      }`}
                                >
                                  {loadingExplainIds.has(q.questionId) ? (
                                    <>
                                      <Loader2 className="h-3.5 w-3.5 md:h-4 md:w-4 animate-spin" />
                                      <span className="hidden sm:inline">Phân tích...</span>
                                    </>
                                  ) : q.isExplanationOpen ? (
                                    <>
                                      <X size={14} className="md:w-4 md:h-4" /> <span className="hidden sm:inline">Đóng</span>
                                    </>
                                  ) : (
                                    <>
                                      <Sparkles size={14} className="md:w-4 md:h-4" /> <span className="hidden sm:inline">Giải thích</span>
                                    </>
                                  )}
                                </button>
                              </div>

                              {/* Phần giải thích */}
                              {q.isExplanationOpen && (
                                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 md:p-4 space-y-2 md:space-y-3">
                                  {q.shortExplanation && (
                                    <div>
                                      <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                                        <Languages size={12} className="md:w-3.5 md:h-3.5" /> Dịch câu hỏi
                                      </h4>
                                      <div className="text-xs md:text-sm text-gray-700 dark:text-gray-300 leading-relaxed prose prose-sm max-w-none dark:prose-invert [&_span.highlight-correct]:text-green-600 dark:[&_span.highlight-correct]:text-green-400 ">
                                        <div
                                          dangerouslySetInnerHTML={{
                                            __html: q.shortExplanation,
                                          }}
                                        />
                                      </div>
                                    </div>
                                  )}

                                  {q.fullExplanation && (
                                    <div className="border-t border-blue-200 dark:border-blue-800 pt-2 md:pt-3">
                                      <button
                                        onClick={() =>
                                          handleToggleDetail(q.questionId)
                                        }
                                        className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2 flex items-center gap-1 hover:text-blue-800 dark:hover:text-blue-300"
                                      >
                                        {q.isDetailOpen ? (
                                          <>
                                            <ChevronUp size={12} className="md:w-3.5 md:h-3.5" /> <span>Ẩn chi tiết</span>
                                          </>
                                        ) : (
                                          <>
                                            <ChevronDown size={12} className="md:w-3.5 md:h-3.5" /> <span>Xem chi tiết</span>
                                          </>
                                        )}
                                      </button>

                                      {q.isDetailOpen && (
                                        <div className="text-xs md:text-sm text-gray-700 dark:text-gray-300 leading-relaxed prose prose-sm max-w-none dark:prose-invert  [&_span.highlight-correct]:text-green-600 dark:[&_span.highlight-correct]:text-green-400 ">
                                          <div
                                            dangerouslySetInnerHTML={{
                                              __html: q.fullExplanation,
                                            }}
                                          />
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}

              {(part.partNumber === 6 || part.partNumber === 7) && (
                <div className="space-y-6 md:space-y-8">
                  {part.groups.map((group) => (
                    <div
                      key={group.groupId}
                      className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-700 overflow-hidden"
                    >
                      <div className="flex flex-col lg:flex-row">
                        <div
                          className={`w-full lg:w-5/10 bg-gray-100 dark:bg-zinc-900 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-zinc-600 p-4 md:p-6 transition-all duration-300 ${
                            translations[group.groupId] &&
                            !hiddenPassageTranslations.has(group.groupId)
                              ? "lg:max-h-[160vh]"
                              : ""
                          }`}
                        >
                          <div className="lg:sticky lg:top-4 space-y-3">
                            <div className="mb-2 md:mb-3 text-purple-600 dark:text-purple-400 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                              <BookOpen size={14} className="md:w-4 md:h-4" /> Reading Passage
                            </div>
                            {group.imageUrl && (
                              <img
                                src={
                                  group.imageUrl.startsWith("http")
                                    ? group.imageUrl
                                    : `${BASE_URL}${group.imageUrl}`
                                }
                                alt="Passage"
                                className="w-full rounded-lg border border-gray-300 dark:border-zinc-800 shadow-sm mb-3 md:mb-4"
                                loading="lazy"
                              />
                            )}
                            {group.groupContent && (
                              <div
                                className={`reading-content text-sm md:text-base overflow-y-auto custom-scrollbar max-w-none bg-white dark:bg-zinc-900 text-gray-700 dark:text-gray-300 p-3 md:p-5 rounded-lg border border-gray-200 dark:border-zinc-600 shadow-sm whitespace-pre-line [&_p]:mb-2 md:[&_p]:mb-3 [&_p]:leading-relaxed [&_table]:w-full [&_table]:border-collapse [&_table]:my-2 md:[&_table]:my-3 [&_table]:whitespace-normal [&_th]:border [&_th]:border-gray-400 dark:[&_th]:border-zinc-500 [&_th]:bg-gray-100 dark:[&_th]:bg-zinc-700 [&_th]:px-2 md:[&_th]:px-3 [&_th]:py-1 md:[&_th]:py-2 [&_th]:text-left [&_th]:font-bold [&_th]:whitespace-normal [&_td]:border [&_td]:border-gray-300 dark:[&_td]:border-zinc-600 [&_td]:px-2 md:[&_td]:px-3 [&_td]:py-1 md:[&_td]:py-2 [&_td]:whitespace-normal transition-all duration-300 ${
                                  translations[group.groupId] &&
                                  !hiddenPassageTranslations.has(group.groupId)
                                    ? "max-h-[70vh]"
                                    : "max-h-[60vh]"
                                }`}
                                dangerouslySetInnerHTML={{
                                  __html: group.groupContent,
                                }}
                              />
                            )}

                            {/* Nút Dịch đoạn văn */}
                            {group.groupContent && (
                              <div className="mt-2 md:mt-3">
                                {!translations[group.groupId] ? (
                                  <button
                                    onClick={() =>
                                      handleTranslatePassage(
                                        group,
                                        part.partNumber,
                                      )
                                    }
                                    disabled={
                                      !!loadingTranslateIds[group.groupId]
                                    }
                                    className="flex items-center gap-1.5 md:gap-2 text-xs font-medium text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200 border border-purple-300 dark:border-purple-700 rounded-lg px-2.5 md:px-3 py-1 md:py-1.5 transition-colors disabled:opacity-50"
                                  >
                                    {!!loadingTranslateIds[group.groupId] ? (
                                      <>
                                        <Loader2
                                          size={12} className="md:w-3 md:h-3 animate-spin"
                                        />{" "}
                                        Đang dịch...
                                      </>
                                    ) : (
                                      <>
                                        <Languages size={12} className="md:w-3 md:h-3" /> Dịch đoạn văn
                                      </>
                                    )}
                                  </button>
                                ) : (
                                  <div>
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="flex items-center gap-1.5 text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest">
                                        <Languages size={12} className="md:w-3 md:h-3" /> Bản dịch tiếng
                                        Việt
                                      </span>
                                      <div className="flex items-center gap-2">
                                        <button
                                          onClick={() =>
                                            togglePassageTranslation(
                                              group.groupId,
                                            )
                                          }
                                          className="flex items-center gap-1.5 md:gap-2 text-xs font-medium text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200 border border-purple-300 dark:border-purple-700 rounded-lg px-2.5 md:px-3 py-1 md:py-1.5 transition-colors disabled:opacity-50"
                                        >
                                          {hiddenPassageTranslations.has(
                                            group.groupId,
                                          )
                                            ? "Hiện"
                                            : "Ẩn"}
                                        </button>
                                      </div>
                                    </div>
                                    {!hiddenPassageTranslations.has(
                                      group.groupId,
                                    ) && (
                                      <div
                                        className="max-h-[50vh] md:max-h-[55vh] text-sm md:text-base reading-content overflow-y-auto custom-scrollbar p-3 md:p-4 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 leading-6 [&_p]:mb-2 md:[&_p]:mb-3 [&_p]:leading-relaxed [&_table]:w-full [&_table]:border-collapse [&_table]:my-2 md:[&_table]:my-3 [&_th]:border [&_th]:border-gray-400 dark:[&_th]:border-zinc-500 [&_th]:bg-gray-100 dark:[&_th]:bg-zinc-700 [&_th]:px-2 md:[&_th]:px-3 [&_th]:py-1 md:[&_th]:py-2 [&_th]:text-left [&_th]:font-bold [&_td]:border [&_td]:border-gray-300 dark:[&_td]:border-zinc-600 [&_td]:px-2 md:[&_td]:px-3 [&_td]:py-1 md:[&_td]:py-2 [&_b]:font-semibold [&_b]:text-gray-900 dark:[&_b]:text-gray-100"
                                        dangerouslySetInnerHTML={{
                                          __html:
                                            translations[group.groupId] || "",
                                        }}
                                      ></div>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        <div
                          className={`w-full lg:w-5/10 p-4 md:p-6 space-y-4 md:space-y-6 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-zinc-600 overflow-y-auto custom-scrollbar transition-all duration-300 ${
                            translations[group.groupId] &&
                            !hiddenPassageTranslations.has(group.groupId)
                              ? "max-h-[80vh] lg:max-h-[100vh]"
                              : "max-h-[60vh] lg:max-h-[80vh]"
                          }`}
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
                                  q.questionId,
                                )}
                                isBookmarkLoading={
                                  bookmarkLoading === q.questionId
                                }
                                isExplainLoading={loadingExplainIds.has(
                                  q.questionId,
                                )}
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
            <div className="mt-12 bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-700">
              <CommentSection testId={result.testId} />
            </div>
          )}
        </div>

        {/* Sidebar toggle panel - Slide từ phải */}
        <div
          className={`fixed right-0 top-0 h-full w-80 max-w-[85vw] bg-white dark:bg-zinc-900 shadow-2xl border-l border-gray-200 dark:border-zinc-700 z-40 transform transition-transform duration-300 overflow-y-auto custom-scrollbar ${
            showResultSidebar ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Close button */}
          <div className="sticky top-0 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-700 p-4 flex items-center justify-between">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <BarChart3 size={18} /> Tóm tắt
            </h3>
            <button
              onClick={() => setShowResultSidebar(false)}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
          <div className="p-4">
            <ResultRightSidebar
              parts={partGroups}
              timeTaken={actualTimeTaken}
              questions={result.questions || []}
              totalScore={result.totalScore}
              totalQuestions={totalQuestions}
              isFullTest={result.isFullTest !== false}
              onScrollToQuestion={handleScrollToQuestion}
              currentQuestionId={currentQuestionId}
            />
          </div>
        </div>

        {/* Overlay backdrop */}
        {showResultSidebar && (
          <div
            className="fixed inset-0 bg-black/20 z-30"
            onClick={() => setShowResultSidebar(false)}
          />
        )}
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
              <Check size={18} />
              {correctCount}
            </span>
            <span className="text-red-500 dark:text-red-400 font-bold text-sm flex items-center gap-1">
              <X size={18} />
              {incorrectCount}
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
