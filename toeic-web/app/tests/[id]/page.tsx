"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import { testService } from "../../services/testService";
import { Answer, Question, TestDetail } from "@/app/types";
import ExamRightSidebar from "@/app/components/ExamRightSidebar"; 

export default function ExamPage() {
  const params = useParams();
  const testId = Number(params.id);
  const router = useRouter();

  // --- STATE ---
  const [testData, setTestData] = useState<TestDetail | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});

  // --- EFFECT ---
  useEffect(() => {
    const userCookie = Cookies.get("user");
    if (userCookie) setUser(JSON.parse(userCookie));

    if (testId) {
      testService.getDetail(testId)
        .then((res) => {
          setTestData(res.data.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          alert("Lỗi tải đề thi!");
          setLoading(false);
        });
    }
  }, [testId]);

  // --- HANDLERS ---
  const handleSelectAnswer = (questionId: number, option: string) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  // Hàm cuộn đến câu hỏi khi bấm ở Sidebar
  const handleScrollToQuestion = (qId: number) => {
    const element = document.getElementById(`question-${qId}`);
    if (element) {
      const headerOffset = 100; 
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      alert("Bạn cần đăng nhập để nộp bài!");
      router.push("/login");
      return;
    }
    if (!confirm("Bạn có chắc chắn muốn nộp bài?")) return;

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
      alert("Nộp bài thất bại: " + (error.response?.data?.message || "Lỗi Server"));
    } finally {
      setSubmitting(false);
    }
  };

  // --- COMPONENT CON: NÚT CHỌN ĐÁP ÁN ---
  const AnswerOption = ({ q, ans, isSelected, onSelect }: { q: Question, ans: Answer, isSelected: boolean, onSelect: () => void }) => (
    <button
      onClick={onSelect}
      className={`w-full text-left px-4 py-3 border rounded-xl transition-all flex items-center group
        ${isSelected
          ? "bg-blue-600 border-blue-600 text-white shadow-md ring-2 ring-blue-200"
          : "border-gray-200 bg-white hover:bg-blue-50 hover:border-blue-300 text-gray-700"
        }`}
    >
      <span className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold mr-3 border
         ${isSelected ? "bg-white text-blue-600 border-transparent" : "bg-gray-100 text-gray-500 border-gray-200"}`}>
        {ans.label}
      </span>
      <span className="text-sm font-medium">{ans.content}</span>
    </button>
  );

  if (loading) return <div className="min-h-screen flex items-center justify-center text-blue-600 font-bold">⏳ Đang tải đề thi...</div>;
  if (!testData) return <div className="p-10 text-center text-red-500">Không tìm thấy đề thi.</div>;

  return (
    <main className="min-h-screen bg-gray-50 pb-20 font-sans">
      {/* HEADER Sticky (Chỉ giữ lại tên đề thi và nút thoát, nút Nộp bài đã chuyển sang Sidebar) */}
      <header className="bg-white shadow-sm border-b border-gray-200 p-3 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4">
          <Link href="/" className="text-gray-500 hover:text-blue-600 font-medium flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Thoát
          </Link>
          <h1 className="text-lg font-bold text-gray-800 truncate max-w-md hidden md:block">
            {testData.title}
          </h1>
          {/* Trên Mobile thì hiện nút nộp bài nhỏ ở đây */}
          <button onClick={handleSubmit} className="lg:hidden bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-bold">
            Nộp bài
          </button>
        </div>
      </header>

      {/* --- MAIN LAYOUT: CHIA 2 CỘT --- */}
      <div className="max-w-7xl mx-auto p-4 md:p-6 flex flex-col lg:flex-row gap-8">
        
        {/* 1. CỘT TRÁI: NỘI DUNG ĐỀ THI (Chiếm 3/4) */}
        <div className="w-full lg:w-3/4">
          {testData.parts.map((part) => (
            <div key={part.id} className="mb-12">
               <div className="flex items-center gap-4 mb-6">
                 <h2 className="text-2xl font-bold text-gray-800">{part.name}</h2>
                 <div className="h-1 flex-1 bg-gray-200 rounded-full"></div>
               </div>

               <div className="space-y-8">
                {part.groups.map((group) => {
                  const hasTextContent = group.textContent && group.textContent.trim().length > 0;
                  const isSplitLayout = hasTextContent; 

                  return (
                    <div key={group.id} className={`bg-white rounded-2xl shadow-sm border border-gray-200  
                        ${isSplitLayout ? "p-0" : "p-6"}`}>
                      
                      {/* --- TRƯỜNG HỢP 1: PART 6, 7 (CHIA 2 CỘT: BÀI ĐỌC - CÂU HỎI) --- */}
                      {isSplitLayout ? (
                        <div className="flex flex-col lg:flex-row h-full items-stretch">
                          {/* Cột Bài Đọc (Sticky) */}
                          <div className="lg:w-1/2 bg-gray-50 border-b lg:border-b-0 lg:border-r border-gray-200 p-6 lg:p-8">
                            <div className="lg:sticky lg:top-24 max-h-[85vh] overflow-y-auto custom-scrollbar">
                               <div className="mb-3 flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest">
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                                  Reading Passage
                               </div>
                               <div 
                                  className="prose prose-blue max-w-none text-gray-800 leading-7 font-serif"
                                  dangerouslySetInnerHTML={{ __html: group.textContent || "" }}
                               />
                            </div>
                          </div>

                          {/* Cột Câu Hỏi */}
                          <div className="lg:w-1/2 p-6 lg:p-8 bg-white space-y-8">
                            {group.questions.map((q) => (
                              <div key={q.id} id={`question-${q.id}`}> {/* <--- ID ĐỂ SCROLL TỚI */}
                                 <div className="flex gap-4 mb-4">
                                    <span className={`flex-shrink-0 w-8 h-8 font-bold rounded-full flex items-center justify-center shadow-sm text-sm transition-colors
                                      ${userAnswers[q.id] ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 border border-gray-200'}`}>
                                      {q.questionNo}
                                    </span>
                                    <p className="font-medium text-gray-800 text-lg leading-snug pt-1">{q.content}</p>
                                 </div>
                                 <div className="grid grid-cols-1 gap-3 ml-12">
                                    {q.answers.map((ans) => (
                                      <AnswerOption 
                                        key={ans.label} q={q} ans={ans} 
                                        isSelected={userAnswers[q.id] === ans.label} 
                                        onSelect={() => handleSelectAnswer(q.id, ans.label)} 
                                      />
                                    ))}
                                 </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        
                        // --- TRƯỜNG HỢP 2: PART 5 (1 CỘT DUY NHẤT) ---
                        <div className="space-y-8">
                           {group.questions.map((q) => (
                              <div key={q.id} id={`question-${q.id}`}> {/* <--- ID ĐỂ SCROLL TỚI */}
                                 <div className="flex gap-4 mb-3">
                                    <span className={`flex-shrink-0 w-9 h-9 font-bold rounded-full flex items-center justify-center shadow-sm text-sm
                                      ${userAnswers[q.id] ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 border border-gray-200'}`}>
                                      {q.questionNo}
                                    </span>
                                    <p className="font-medium text-gray-800 text-lg pt-1">{q.content}</p>
                                 </div>

                                 <div className="space-y-3 ml-12">
                                    {q.answers.map((ans) => (
                                      <AnswerOption 
                                        key={ans.label} q={q} ans={ans} 
                                        isSelected={userAnswers[q.id] === ans.label} 
                                        onSelect={() => handleSelectAnswer(q.id, ans.label)} 
                                      />
                                    ))}
                                 </div>
                              </div>
                           ))}
                        </div>
                      )}
                    </div>
                  );
                })}
               </div>
            </div>
          ))}
        </div>

        {/* 2. CỘT PHẢI: SIDEBAR (Chiếm 1/4 - Ẩn trên Mobile) */}
        <div className="hidden lg:block lg:w-1/4">
          {testData && (
             <ExamRightSidebar 
                parts={testData.parts}
                userAnswers={userAnswers}
                onScrollToQuestion={handleScrollToQuestion}
                onSubmit={handleSubmit}
                isSubmitting={submitting}
             />
          )}
        </div>

      </div>
    </main>
  );
}