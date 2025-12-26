"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { testService } from "../../services/testService";
import { bookmarkService } from "../../services/bookmarkService";
import { ResultDetail } from "../../types";
import ResultRightSidebar from "@/app/components/ResultRightSidebar";
import SaveVocabularyModal from "@/app/components/SaveVocabularyModal";
import { CommentSection } from "@/app/components/comments/CommentSection";

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
  const [currentQuestionId, setCurrentQuestionId] = useState<number | null>(null);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<Set<number>>(new Set());
  const [bookmarkLoading, setBookmarkLoading] = useState<number | null>(null);
  const [vocabModalOpen, setVocabModalOpen] = useState(false);
  const [selectedQuestionForVocab, setSelectedQuestionForVocab] = useState<{
    questionId: number;
    content: string;
  } | null>(null);

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
                groups: []
              });
            }
            
            const part = partsMap.get(partNum)!;
            let group = part.groups.find(g => g.groupId === q.groupId);
            
            if (!group) {
              group = {
                groupId: q.groupId,
                groupContent: q.groupContent,
                imageUrl: q.imageUrl,
                audioUrl: q.audioUrl,
                questions: []
              };
              part.groups.push(group);
            }
            
            // Khởi tạo thêm các cờ state cho UI
            group.questions.push({
                ...q,
                isExplanationOpen: false, // Trạng thái mở khung giải thích
                isDetailOpen: false       // Trạng thái mở chi tiết
            });
          });
          
          const sortedParts = Array.from(partsMap.values()).sort((a, b) => a.partNumber - b.partNumber);
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
      const questionIds = result.questions.map((q: { questionId: number }) => q.questionId);
      loadBookmarkStatus(questionIds);
    }
  }, [result, loadBookmarkStatus]);

  const handleToggleBookmark = async (questionId: number) => {
    setBookmarkLoading(questionId);
    try {
      const isBookmarked = bookmarkedQuestions.has(questionId);
      if (isBookmarked) {
        await bookmarkService.remove(questionId);
        setBookmarkedQuestions((prev) => {
          const next = new Set(prev);
          next.delete(questionId);
          return next;
        });
      } else {
        await bookmarkService.add(questionId);
        setBookmarkedQuestions((prev) => new Set(prev).add(questionId));
      }
    } catch (error) {
      console.error("Failed to toggle bookmark:", error);
    } finally {
      setBookmarkLoading(null);
    }
  };

  const handleOpenVocabModal = (q: any) => {
    setSelectedQuestionForVocab({
      questionId: q.questionId,
      content: q.content || ""
    });
    setVocabModalOpen(true);
  };

  // --- LOGIC MỚI: Xử lý Bật/Tắt Giải thích ---
  // --- LOGIC MỚI ĐÃ SỬA ---
  const handleViewExplanation = async (qId: number) => {
    // 1. Tìm vị trí câu hỏi trong mảng (Lưu index để update cho nhanh)
    let partIndex = -1, groupIndex = -1, qIndex = -1;
    let questionData: any = null;

    partGroups.forEach((p, pIdx) => p.groups.forEach((g, gIdx) => g.questions.forEach((q, qIdx) => {
        if (q.questionId === qId) {
            questionData = q;
            partIndex = pIdx; groupIndex = gIdx; qIndex = qIdx;
        }
    })));

    if (!questionData) return;

    // CASE 1: Nếu đang MỞ -> Đóng lại ngay lập tức (Ưu tiên cao nhất)
    if (questionData.isExplanationOpen) {
        setPartGroups(prev => {
            // Copy mảng để update (Immutable)
            const newParts = [...prev]; 
            // Lưu ý: Cần clone object ở các cấp độ sâu hơn nếu muốn chuẩn React strict mode,
            // nhưng ở đây ta làm nhanh bằng cách mutate object trong mảng copy (vẫn trigger render)
            const targetQ = newParts[partIndex].groups[groupIndex].questions[qIndex];
            targetQ.isExplanationOpen = false; 
            return newParts;
        });
        return;
    }

    // CASE 2: Nếu đang ĐÓNG -> Muốn Mở
    // 2a. Nếu đã có dữ liệu rồi (không cần fetch lại)
    if (questionData.shortExplanation || questionData.fullExplanation) {
        setPartGroups(prev => {
            const newParts = [...prev];
            const targetQ = newParts[partIndex].groups[groupIndex].questions[qIndex];
            targetQ.isExplanationOpen = true;
            return newParts;
        });
        return;
    }

    // 2b. Nếu chưa có dữ liệu -> Gọi API
    setLoadingExplainId(qId);
    try {
      const data = await testService.getQuestionExplanation(qId);
      setPartGroups(prev => {
        const newParts = [...prev];
        const targetQ = newParts[partIndex].groups[groupIndex].questions[qIndex];
        
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
    setPartGroups(prev => prev.map(part => ({
      ...part,
      groups: part.groups.map(group => ({
        ...group,
        questions: group.questions.map(q => 
          q.questionId === qId 
            ? { ...q, isDetailOpen: !q.isDetailOpen }
            : q
        )
      }))
    })));
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
          closestId = Number(el.id.replace('question-', ''));
        }
      });
      
      if (closestId) setCurrentQuestionId(closestId);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [result]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 mx-auto mb-4"></div>
        <p className="text-blue-600 font-bold text-lg">Đang tải kết quả...</p>
      </div>
    </div>
  );

  if (!result) return null;

  const totalQuestions = result.questions?.length || 0;
  const correctCount = result.questions?.filter((q: any) => q.isCorrect).length || 0;
  const incorrectCount = result.questions?.filter((q: any) => q.userSelected && !q.isCorrect).length || 0;
  const skippedCount = result.questions?.filter((q: any) => !q.userSelected).length || 0;
  const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  const listeningQuestions = result.questions?.filter((q: any) => (q.partNumber || 5) <= 4) || [];
  const readingQuestions = result.questions?.filter((q: any) => (q.partNumber || 5) >= 5) || [];
  const listeningCorrect = listeningQuestions.filter((q: any) => q.isCorrect).length;
  const readingCorrect = readingQuestions.filter((q: any) => q.isCorrect).length;

  const AnswerOptionResult = ({ q, label, content }: { q: any; label: string; content: string }) => {
    const userSelected = (q.userSelected || "").toString().toUpperCase();
    const isUserSelected = userSelected === label;
    const correctOpt = (q.correctOption || "").toString().toUpperCase();
    const isCorrect = correctOpt === label;
    
    let containerClass = "border-gray-200 bg-white opacity-60";
    let badgeClass = "bg-gray-100 text-gray-400 border-gray-200";
    let statusText = null;

    if (isCorrect) {
      containerClass = "border-green-500 bg-green-50 ring-1 ring-green-500 opacity-100";
      badgeClass = "bg-green-600 text-white border-green-600";
      statusText = <span className="text-green-700 text-xs font-bold ml-auto">✔ Đáp án đúng</span>;
    } else if (isUserSelected) {
      containerClass = "border-red-500 bg-red-50 ring-1 ring-red-500 opacity-100";
      badgeClass = "bg-red-600 text-white border-red-600";
      statusText = <span className="text-red-600 text-xs font-bold ml-auto">✖ Bạn chọn</span>;
    }

    return (
      <div className={`flex items-center px-4 py-3 border rounded-xl transition-all ${containerClass}`}>
        <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold mr-3 border shrink-0 ${badgeClass}`}>
          {label}
        </span>
        <span className={`text-base flex-1 ${isCorrect || isUserSelected ? 'font-medium text-gray-900' : 'text-gray-500'}`}>
          {content}
        </span>
        {statusText}
      </div>
    );
  };

  const ResultQuestionItem = ({ q }: { q: any }) => {
    const partNum = q.partNumber || 5;
    const options = partNum === 2 ? ['A', 'B', 'C'] : ['A', 'B', 'C', 'D'];
    
    const getAnswerContent = (label: string) => {
      if (q.answers && Array.isArray(q.answers)) {
        const ans = q.answers.find((a: any) => a.label === label);
        return ans ? ans.content : "";
      }
      return q[`option${label}`] || "";
    };

    return (
      <div className={`p-4 rounded-xl transition-colors ${currentQuestionId === q.questionId ? 'bg-blue-50 ring-2 ring-blue-200' : ''}`}>
        <div className="flex gap-3 mb-4">
          <span className={`shrink-0 w-10 h-10 font-bold rounded-full flex items-center justify-center text-sm shadow-sm
            ${q.isCorrect 
              ? 'bg-green-100 text-green-700 border-2 border-green-300' 
              : q.userSelected 
                ? 'bg-red-50 text-red-600 border-2 border-red-300'
                : 'bg-gray-100 text-gray-400 border-2 border-gray-200'
            }`}>
            {q.questionNo}
          </span>
          <div className="flex-1 pt-1">
            {partNum === 1 ? (
              <p className="text-gray-500 text-sm italic">Chọn đáp án mô tả đúng bức tranh</p>
            ) : partNum === 2 ? (
              <p className="text-gray-500 text-sm italic">Chọn câu trả lời phù hợp nhất</p>
            ) : (
              <p className="font-medium text-gray-800 text-lg leading-relaxed">{q.content}</p>
            )}
          </div>
        </div>

        <div className={`space-y-2 ml-12 mb-4 ${(partNum === 1 || partNum === 2) ? 'flex gap-3 space-y-0' : ''}`}>
          {(partNum === 1 || partNum === 2) ? (
            options.map((label) => {
              const userSelected = (q.userSelected || "").toString().toUpperCase();
              const isUserSelected = userSelected === label;
              const correctOpt = (q.correctOption || "").toString().toUpperCase();
              const isCorrect = correctOpt === label;
              
              let btnClass = "border-gray-200 bg-gray-50 text-gray-400";
              if (isCorrect) btnClass = "border-green-500 bg-green-100 text-green-700 ring-2 ring-green-300";
              else if (isUserSelected && !isCorrect) btnClass = "border-red-500 bg-red-100 text-red-600 ring-2 ring-red-300";
              
              return (
                <div key={label} className={`flex-1 p-4 rounded-xl border-2 font-bold text-lg text-center ${btnClass}`}>
                  {label}
                  {isCorrect && <span className="block text-xs mt-1">✔ Đúng</span>}
                  {isUserSelected && !isCorrect && <span className="block text-xs mt-1">✖ Sai</span>}
                </div>
              );
            })
          ) : (
            options.map((label) => (
              <AnswerOptionResult key={label} q={q} label={label} content={getAnswerContent(label)} />
            ))
          )}
        </div>

        {/* --- KHU VỰC NÚT TƯƠNG TÁC --- */}
        <div className="ml-12 flex flex-wrap items-center gap-3">
          {/* Nút Bookmark */}
          <button
            onClick={() => handleToggleBookmark(q.questionId)}
            disabled={bookmarkLoading === q.questionId}
            className={`inline-flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-lg transition-colors
              ${bookmarkedQuestions.has(q.questionId)
                ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
          >
            {bookmarkLoading === q.questionId ? (
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
            ) : bookmarkedQuestions.has(q.questionId) ? (
              <>🔖 Đã lưu</>
            ) : (
              <>🏷️ Đánh dấu</>
            )}
          </button>

          {/* --- NÚT BẬT/TẮT GIẢI THÍCH CHÍNH --- */}
          <button 
            onClick={() => handleViewExplanation(q.questionId)}
            disabled={loadingExplainId === q.questionId}
            className={`inline-flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-lg transition-colors
              ${q.isExplanationOpen 
                ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200' // Style nút Đóng
                : 'bg-blue-50 text-blue-600 hover:text-blue-800 hover:bg-blue-100 border border-blue-200' // Style nút Xem
              }`}
          >
            {loadingExplainId === q.questionId ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang phân tích...
              </>
            ) : q.isExplanationOpen ? (
              <>✖ Đóng giải thích</>
            ) : (
              <>✨ Xem giải thích</>
            )}
          </button>
        </div>

        {/* --- KHU VỰC HIỂN THỊ GIẢI THÍCH --- */}
        {q.isExplanationOpen && (
          <div className="ml-12 mt-4 bg-linear-to-br from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-100 animate-fadeIn relative">
             {/* 1. GIẢI THÍCH NGẮN (Luôn hiện khi mở) */}
            {q.shortExplanation && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                    <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Gợi ý</span>
                    <h4 className="font-bold text-blue-900 text-sm">Giải thích ngắn</h4>
                </div>
                <p className="text-blue-900 font-medium leading-relaxed">{q.shortExplanation}</p>
              </div>
            )}

            {/* Nút phân cách để mở chi tiết */}
            <div className="flex items-center justify-center my-4 relative">
                 <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-blue-200"></div>
                 </div>
                 <div className="relative flex justify-center">
                    <button 
                        onClick={() => handleToggleDetail(q.questionId)}
                        className="bg-white border border-blue-300 text-blue-700 text-xs font-bold px-4 py-1.5 rounded-full hover:bg-blue-50 hover:border-blue-400 transition-all flex items-center gap-1 shadow-xs"
                    >
                        {q.isDetailOpen ? (
                            <>Thu gọn chi tiết ▲</>
                        ) : (
                            <>Xem giải thích chi tiết (Premium) ▼</>
                        )}
                    </button>
                 </div>
            </div>

            {/* 2. GIẢI THÍCH CHI TIẾT (Hiện khi bấm nút Xem chi tiết) */}
            {q.isDetailOpen && q.fullExplanation && (
              <div className="pt-2 animate-fadeIn">
                 <div className="bg-white p-4 rounded-lg border border-blue-100 shadow-xs">
                    <div className="prose prose-sm prose-blue max-w-none text-gray-700 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: q.fullExplanation }} />
                 </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 lg:pb-10 font-sans">
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-blue-600 font-medium transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            <span className="hidden sm:inline">Trang chủ</span>
          </Link>
          
          <h1 className="text-lg font-bold text-gray-800 truncate max-w-50 md:max-w-md">
            📊 {result.testTitle}
          </h1>
          
          <Link href="/history" className="text-sm text-blue-600 hover:underline font-medium">
            Lịch sử thi
          </Link>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 pb-3">
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="text-green-600 font-bold">✓ {correctCount} đúng</span>
            <span className="text-red-500 font-bold">✗ {incorrectCount} sai</span>
            <span className="text-gray-400">○ {skippedCount} bỏ qua</span>
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-linear-to-r from-green-500 to-emerald-500" style={{ width: `${percentage}%` }}></div>
            </div>
            <span className="font-bold text-blue-600">{percentage}%</span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-linear-to-br from-blue-500 to-indigo-600 text-white p-5 rounded-2xl shadow-lg">
            <p className="text-blue-100 text-xs uppercase tracking-wider mb-1">Tổng điểm</p>
            <p className="text-3xl font-extrabold">{result.totalScore}<span className="text-lg opacity-70">/{totalQuestions}</span></p>
          </div>
          <div className="bg-linear-to-br from-green-500 to-emerald-600 text-white p-5 rounded-2xl shadow-lg">
            <p className="text-green-100 text-xs uppercase tracking-wider mb-1">🎧 Listening</p>
            <p className="text-3xl font-extrabold">{listeningCorrect}<span className="text-lg opacity-70">/{listeningQuestions.length}</span></p>
          </div>
          <div className="bg-linear-to-br from-purple-500 to-violet-600 text-white p-5 rounded-2xl shadow-lg">
            <p className="text-purple-100 text-xs uppercase tracking-wider mb-1">📖 Reading</p>
            <p className="text-3xl font-extrabold">{readingCorrect}<span className="text-lg opacity-70">/{readingQuestions.length}</span></p>
          </div>
          <div className="bg-linear-to-br from-orange-500 to-amber-600 text-white p-5 rounded-2xl shadow-lg">
            <p className="text-orange-100 text-xs uppercase tracking-wider mb-1">Tỉ lệ đúng</p>
            <p className="text-3xl font-extrabold">{percentage}%</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8 flex flex-col lg:flex-row gap-8">
        
        <div className="w-full lg:w-3/4 space-y-10">
          {partGroups.map((part) => (
            <div key={part.partNumber} className="mb-10">
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-800">{part.partName}</h2>
                <div className="h-1 flex-1 bg-gray-200 rounded-full"></div>
                {part.partNumber <= 4 ? (
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">🎧 Listening</span>
                ) : (
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold">📖 Reading</span>
                )}
              </div>

              {part.partNumber === 1 && (
                <div className="space-y-6">
                  {part.groups.map((group) => (
                    <div key={group.groupId} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                      {group.audioUrl && (
                        <div className="bg-linear-to-r from-green-600 to-teal-600 text-white p-4">
                          <audio controls src={`${BASE_URL}${group.audioUrl}`} className="w-full h-10" style={{ filter: 'invert(1)' }} />
                        </div>
                      )}
                      <div className="flex flex-col lg:flex-row">
                        {group.imageUrl && (
                          <div className="lg:w-1/2 bg-gray-50 border-b lg:border-b-0 lg:border-r border-gray-200 p-6">
                            <img src={`${BASE_URL}${group.imageUrl}`} alt="Part 1" className="w-full rounded-xl border shadow-sm" loading="lazy" />
                          </div>
                        )}
                        <div className={`${group.imageUrl ? 'lg:w-1/2' : 'w-full'} p-6 space-y-4`}>
                          {group.questions.map((q) => (
                            <div key={q.questionId} id={`question-${q.questionId}`}>
                              <ResultQuestionItem q={q} />
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
                    <div key={group.groupId} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                      {group.audioUrl && (
                        <div className="mb-4">
                          <audio controls src={`${BASE_URL}${group.audioUrl}`} className="w-full h-12 rounded-lg" />
                        </div>
                      )}
                      {group.questions.map((q) => (
                        <div key={q.questionId} id={`question-${q.questionId}`}>
                          <ResultQuestionItem q={q} />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}

              {(part.partNumber === 3 || part.partNumber === 4) && (
                <div className="space-y-8">
                  {part.groups.map((group) => (
                    <div key={group.groupId} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                      <div className="bg-linear-to-r from-green-600 to-teal-600 text-white p-4">
                        <div className="flex items-center gap-4">
                          <span className="font-medium text-sm">
                            {part.partNumber === 3 ? '🗣️ Conversation' : '🎤 Talk'}
                          </span>
                          {group.audioUrl && (
                            <audio controls src={`${BASE_URL}${group.audioUrl}`} className="flex-1 h-10" style={{ filter: 'invert(1)' }} />
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col lg:flex-row">
                        {(group.imageUrl || group.groupContent) && (
                          <div className="lg:w-1/2 bg-gray-50 border-b lg:border-b-0 lg:border-r border-gray-200 p-6">
                            <div className="lg:sticky lg:top-36 space-y-4">
                              {group.imageUrl && (
                                <img src={`${BASE_URL}${group.imageUrl}`} alt="Visual" className="w-full rounded-xl border shadow-sm" loading="lazy" />
                              )}
                              {group.groupContent && (
                                <div className="prose prose-sm max-w-none bg-white p-4 rounded-lg border"
                                  dangerouslySetInnerHTML={{ __html: group.groupContent }} />
                              )}
                            </div>
                          </div>
                        )}
                        
                        <div className={`${(group.imageUrl || group.groupContent) ? 'lg:w-1/2' : 'w-full'} p-6 space-y-6`}>
                          {group.questions.map((q) => (
                            <div key={q.questionId} id={`question-${q.questionId}`}>
                              <ResultQuestionItem q={q} />
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
                    <div key={group.groupId} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                      {group.questions.map((q) => (
                        <div key={q.questionId} id={`question-${q.questionId}`}>
                          <ResultQuestionItem q={q} />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}

              {(part.partNumber === 6 || part.partNumber === 7) && (
                <div className="space-y-8">
                  {part.groups.map((group) => (
                    <div key={group.groupId} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                      <div className="flex flex-col lg:flex-row">
                        <div className="lg:w-1/2 bg-gray-50 border-b lg:border-b-0 lg:border-r border-gray-200 p-6">
                          <div className="lg:sticky lg:top-24 max-h-[80vh] overflow-y-auto custom-scrollbar">
                            <div className="mb-3 text-purple-600 font-bold text-xs uppercase tracking-widest">📖 Reading Passage</div>
                            {group.imageUrl && (
                              <img src={`${BASE_URL}${group.imageUrl}`} alt="Passage" className="w-full rounded-lg border shadow-sm mb-4" loading="lazy" />
                            )}
                            {group.groupContent && (
                              <div className="prose prose-sm max-w-none bg-white p-5 rounded-lg border shadow-sm leading-7 whitespace-pre-line"
                                dangerouslySetInnerHTML={{ __html: group.groupContent }} />
                            )}
                          </div>
                        </div>
                        
                        <div className="lg:w-1/2 p-6 space-y-6">
                          {group.questions.map((q) => (
                            <div key={q.questionId} id={`question-${q.questionId}`}>
                              <ResultQuestionItem q={q} />
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
            questions={result.questions || []}
            totalScore={result.totalScore}
            totalQuestions={totalQuestions}
            onScrollToQuestion={handleScrollToQuestion}
            currentQuestionId={currentQuestionId}
          />
        </div>
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={() => setShowMobileNav(!showMobileNav)} className="flex items-center gap-2 text-gray-600">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span className="font-medium">{correctCount}/{totalQuestions}</span>
          </button>
          
          <div className="flex items-center gap-2">
            <span className="text-green-600 font-bold text-sm">✓{correctCount}</span>
            <span className="text-red-500 font-bold text-sm">✗{incorrectCount}</span>
          </div>
          
          <Link href="/" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm">
            Trang chủ
          </Link>
        </div>
        
        {showMobileNav && (
          <div className="border-t border-gray-100 p-4 max-h-[50vh] overflow-y-auto bg-gray-50">
            {partGroups.map((part) => (
              <div key={part.partNumber} className="mb-4">
                <h4 className="font-bold text-gray-700 text-sm mb-2">{part.partName}</h4>
                <div className="grid grid-cols-8 gap-2">
                  {part.groups.flatMap((g) => g.questions).map((q) => {
                    let colorClass = "bg-gray-50 text-gray-400 border-gray-200";
                    if (q.userSelected) {
                      colorClass = q.isCorrect 
                        ? "bg-green-100 text-green-700 border-green-400" 
                        : "bg-red-50 text-red-600 border-red-300";
                    }
                    return (
                      <button key={q.questionId} onClick={() => handleScrollToQuestion(q.questionId)}
                        className={`h-9 w-9 text-xs font-bold rounded-lg flex items-center justify-center border transition-all
                          ${currentQuestionId === q.questionId ? 'ring-2 ring-blue-400' : ''} ${colorClass}`}>
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

      <SaveVocabularyModal
        isOpen={vocabModalOpen}
        onClose={() => {
          setVocabModalOpen(false);
          setSelectedQuestionForVocab(null);
        }}
        questionId={selectedQuestionForVocab?.questionId || 0}
        initialExample={selectedQuestionForVocab?.content || ""}
      />
    </div>
  );
}