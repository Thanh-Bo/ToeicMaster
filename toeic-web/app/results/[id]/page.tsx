"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { testService } from "../../services/testService";
import { ResultDetail } from "../../types";
// Import component con vừa tạo
import { QuestionItem } from "../../components/QuestionItem"; 

export default function ResultPage() {
  const params = useParams();
  const router = useRouter();
  const attemptId = Number(params.id);

  const [result, setResult] = useState<ResultDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingExplainId, setLoadingExplainId] = useState<number | null>(null);

  // 1. Load kết quả bài thi khi vào trang
  useEffect(() => {
    if (!attemptId) return;
    const fetchResult = async () => {
      try {
        const response = await testService.getResult(attemptId);
        setResult(response.data);
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

  // 2. Hàm xử lý khi bấm nút "Xem giải thích" (Truyền xuống con)
  const handleViewExplanation = async (qId: number) => {
    setLoadingExplainId(qId); // Bật trạng thái loading cho đúng câu hỏi đó
    try {
      const data = await testService.getQuestionExplanation(qId);

      // CẬP NHẬT STATE: Điền giải thích mới vào danh sách câu hỏi hiện tại
      setResult((prev) => {
        if (!prev) return prev;
        const updatedQuestions = prev.questions.map((q) => {
          if (q.questionId === qId) {
            return {
              ...q,
              shortExplanation: data.shortExplanation,
              fullExplanation: data.fullExplanation,
            };
          }
          return q;
        });
        return { ...prev, questions: updatedQuestions };
      });
    } catch (error) {
      console.error(error);
      alert("AI đang bận, vui lòng thử lại sau giây lát.");
    } finally {
      setLoadingExplainId(null); // Tắt loading
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl font-medium text-blue-600 animate-pulse">
          ⏳ Đang tải kết quả bài làm...
        </div>
      </div>
    );

  if (!result) return null;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      {/* HEADER: Tổng điểm */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
            <div>
                <h1 className="text-xl font-bold text-gray-800">{result.testTitle}</h1>
                <p className="text-sm text-gray-500">Hoàn thành lúc: {new Date(result.completedAt).toLocaleString('vi-VN')}</p>
            </div>
            
            <div className="text-right">
                <div className="text-xs text-gray-500 uppercase tracking-wide">Tổng điểm</div>
                <div className="text-3xl font-extrabold text-blue-600">
                    {result.totalScore} <span className="text-base text-gray-400 font-normal">/ {result.totalQuestions}</span>
                </div>
            </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-6">
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 hover:underline mb-6 font-medium transition-colors">
            ← Quay lại trang chủ
        </Link>

        {/* BODY: Danh sách câu hỏi */}
        <div className="space-y-6">
          {result.questions.map((q) => (
            <QuestionItem 
                key={q.questionId} 
                q={q} 
                onExplain={handleViewExplanation} 
                isExplaining={loadingExplainId === q.questionId} // Chỉ loading đúng câu đang bấm
            />
          ))}
        </div>
      </div>
    </div>
  );
}