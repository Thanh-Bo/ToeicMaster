"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import { testService } from "../../services/testService";

// Định nghĩa Type (Nên tách ra file types.ts nếu dự án lớn)
interface Answer { label: string; content: string; }
interface Question { id: number; questionNo: number; content: string; answers: Answer[]; }
interface Group { id: number; textContent: string | null; questions: Question[]; }
interface Part { id: number; name: string; groups: Group[]; }
interface TestDetail { id: number; title: string; parts: Part[]; }

export default function ExamPage() {
  const params = useParams(); 
  const testId = Number(params.id); 
  const router = useRouter();

  // --- STATE ---
  const [testData, setTestData] = useState<TestDetail | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false); // Trạng thái đang nộp bài

  // State lưu đáp án người dùng: { [questionId]: "A" }
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});

  // --- EFFECT: LOAD DATA ---
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

  // --- HÀM XỬ LÝ ---

  // 1. Khi người dùng chọn đáp án
  const handleSelectAnswer = (questionId: number, option: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: option, // Lưu: Câu ID 101 chọn "B"
    }));
  };

  // 2. Khi bấm Nộp bài
  const handleSubmit = async () => {
    if (!user) {
      alert("Bạn cần đăng nhập để nộp bài!");
      router.push("/login");
      return;
    }

    // Hỏi xác nhận
    if (!confirm("Bạn có chắc chắn muốn nộp bài?")) return;

    setSubmitting(true);

    try {
      // Chuẩn bị dữ liệu đúng format Backend yêu cầu
      const payload = {
        testId: testId,
        answers: Object.entries(userAnswers).map(([qId, opt]) => ({
          questionId: Number(qId),
          selectedOption: opt
        }))
      };

      // Gọi API Nộp bài
      const res = await testService.submit(payload);

      // Backend trả về: { totalScore: 5, totalQuestions: 5, message: "..." }
      const result = res.data;
      
      router.push(`/results/${result.attemptId}`);
    } catch (error: any) {
      console.error(error);
      alert("Nộp bài thất bại: " + (error.response?.data?.message || "Lỗi Server"));
    } finally {
      setSubmitting(false);
    }
  };

  // --- RENDER ---
  if (loading) return <div className="p-10 text-center">⏳ Đang tải đề thi...</div>;
  if (!testData) return <div className="p-10 text-center text-red-500">❌ Không tìm thấy đề thi.</div>;

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* HEADER Sticky */}
      <header className="bg-white shadow p-4 mb-6 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link href="/" className="font-bold text-gray-500 hover:text-blue-600">← Thoát</Link>
          <h1 className="text-lg font-bold text-blue-800 truncate max-w-md hidden md:block">
            {testData.title}
          </h1>
          
          <button 
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-green-600 text-white px-6 py-2 rounded-full font-bold shadow hover:bg-green-700 disabled:bg-gray-400 transition"
          >
            {submitting ? "Đang chấm..." : "NỘP BÀI"}
          </button>
        </div>
      </header>

      {/* NỘI DUNG ĐỀ THI */}
      <div className="max-w-4xl mx-auto p-4 bg-white shadow rounded-lg">
        {testData.parts.map((part) => (
          <div key={part.id} className="mb-10">
            <h2 className="text-xl font-bold text-white bg-blue-600 p-3 rounded-t-lg">
              {part.name}
            </h2>
            
            <div className="border-x border-b p-4 rounded-b-lg">
              {part.groups.map((group) => (
                <div key={group.id} className="mb-8 border-b last:border-0 pb-6 last:pb-0">
                  {/* Bài đọc */}
                  {group.textContent && (
                    <div className="bg-gray-100 p-4 rounded mb-4 text-sm font-serif leading-relaxed whitespace-pre-line border-l-4 border-gray-400">
                      {group.textContent}
                    </div>
                  )}

                  {/* Danh sách câu hỏi */}
                  {group.questions.map((q) => (
                    <div key={q.id} className="mb-6">
                      <div className="flex gap-3 mb-3">
                        <span className={`flex-shrink-0 w-8 h-8 font-bold rounded-full flex items-center justify-center ${userAnswers[q.id] ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'}`}>
                          {q.questionNo}
                        </span>
                        <p className="font-medium text-gray-800 mt-1">{q.content}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-11">
                        {q.answers.map((ans) => {
                          const isSelected = userAnswers[q.id] === ans.label;
                          return (
                            <button
                              key={ans.label}
                              onClick={() => handleSelectAnswer(q.id, ans.label)}
                              className={`text-left px-4 py-2 border rounded-lg transition-all flex items-center group
                                ${isSelected 
                                  ? "bg-blue-600 border-blue-600 text-white shadow-md" 
                                  : "border-gray-200 hover:bg-blue-50 hover:border-blue-300 text-gray-700"
                                }`}
                            >
                              <span className={`font-bold mr-2 ${isSelected ? "text-white" : "text-gray-500 group-hover:text-blue-600"}`}>
                                {ans.label}.
                              </span>
                              <span>{ans.content}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
        
        {/* Nút nộp bài dưới cùng cho tiện */}
        <div className="mt-8 text-center">
             <button 
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-green-600 text-white px-10 py-3 rounded-lg font-bold text-lg shadow-lg hover:bg-green-700 disabled:bg-gray-400"
              >
                {submitting ? "Đang xử lý..." : "NỘP BÀI THI NGAY"}
              </button>
        </div>
      </div>
    </main>
  );
}