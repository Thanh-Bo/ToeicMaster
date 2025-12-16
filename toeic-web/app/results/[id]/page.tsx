"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { testService } from "../../services/testService";

// 1. Cập nhật Interface khớp với Backend mới
interface ResultDetail {
  attemptId: number;
  testTitle: string;
  totalScore: number;
  totalQuestions: number;
  completedAt: string;
  questions: {
    questionId: number;
    questionNo: number;
    content: string;
    userSelected: string;
    correctOption: string;
    isCorrect: boolean;
    shortExplanation: string | null; // Mới
    fullExplanation: string | null;  // Mới
    answers: { label: string; content: string }[];
  }[];
}

// 2. Tạo Component con để quản lý việc "Bấm xem chi tiết" cho từng câu
const QuestionItem = ({ q }: { q: ResultDetail["questions"][0] }) => {
  const [showFull, setShowFull] = useState(false);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
      {/* Tiêu đề câu hỏi */}
      <div className="flex gap-3 mb-4">
        <span
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white
          ${q.isCorrect ? "bg-green-500" : "bg-red-500"}`}
        >
          {q.questionNo}
        </span>
        <div>
          <p className="font-medium text-gray-800 text-lg">{q.content}</p>
          <span
            className={`text-xs font-bold px-2 py-1 rounded mt-1 inline-block
            ${q.isCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
          >
            {q.isCorrect ? "CHÍNH XÁC" : "SAI RỒI"}
          </span>
        </div>
      </div>

      {/* Danh sách đáp án */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-11 mb-4">
        {q.answers.map((ans) => {
          let bgClass = "bg-white border-gray-200";
          let textClass = "text-gray-700";

          if (ans.label === q.correctOption) {
            bgClass = "bg-green-100 border-green-500";
            textClass = "text-green-800 font-bold";
          } else if (ans.label === q.userSelected && !q.isCorrect) {
            bgClass = "bg-red-100 border-red-500";
            textClass = "text-red-800 font-bold";
          } else if (ans.label === q.userSelected) {
            bgClass = "bg-blue-50 border-blue-500";
          }

          return (
            <div
              key={ans.label}
              className={`px-4 py-3 border rounded-lg flex items-center ${bgClass}`}
            >
              <span className={`font-bold mr-3 ${textClass}`}>{ans.label}.</span>
              <span className={textClass}>{ans.content}</span>
              {ans.label === q.correctOption && (
                <span className="ml-auto text-green-600">✔</span>
              )}
              {ans.label === q.userSelected && ans.label !== q.correctOption && (
                <span className="ml-auto text-red-600">✖</span>
              )}
            </div>
          );
        })}
      </div>

      {/* KHU VỰC GIẢI THÍCH (LOGIC MỚI) */}
      <div className="ml-11">
        {/* 1. Luôn hiện giải thích ngắn (nếu có) */}
        {q.shortExplanation && (
          <div className="mb-2 text-sm text-green-700 bg-green-50 p-3 rounded border border-green-200">
            <strong>💡 Gợi ý nhanh:</strong> {q.shortExplanation}
          </div>
        )}

        {/* 2. Nút bấm xem chi tiết */}
        {!showFull && (
          <button
            onClick={() => setShowFull(true)}
            className="text-blue-600 text-sm hover:underline font-medium flex items-center gap-1"
          >
            👉 Xem giải thích chi tiết bởi AI
          </button>
        )}

        {/* 3. Nội dung chi tiết (Hiện khi showFull = true) */}
        {showFull && (
          <div className="mt-2 p-4 bg-gray-800 rounded border border-gray-700 animate-fadeIn">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-yellow-400 font-bold text-sm">🤖 Phân tích chi tiết:</h4>
              <button
                onClick={() => setShowFull(false)}
                className="text-gray-400 hover:text-white text-xs"
              >
                ✕ Thu gọn
              </button>
            </div>

            {q.fullExplanation ? (
              <div
                className="text-gray-300 text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: q.fullExplanation }}
              />
            ) : (
              <span className="text-gray-500 text-sm italic">
                Đang cập nhật lời giải chi tiết...
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// 3. Component chính
export default function ResultPage() {
  const params = useParams();
  const router = useRouter();
  const attemptId = Number(params.id);

  const [result, setResult] = useState<ResultDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (attemptId) {
      testService
        .getResult(attemptId)
        .then((res) => {
          setResult(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          alert("Không thể tải kết quả. Có thể bạn không có quyền truy cập.");
          router.push("/");
        });
    }
  }, [attemptId, router]);

  if (loading)
    return <div className="text-center p-10">⏳ Đang chấm điểm và tải kết quả...</div>;
  if (!result) return null;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* HEADER: Tổng điểm */}
      <div className="bg-white shadow p-6 mb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{result.testTitle}</h1>
        <p className="text-gray-500 mb-4">Kết quả bài làm của bạn</p>

        <div className="inline-block bg-blue-50 px-8 py-4 rounded-xl border border-blue-100">
          <span className="block text-sm text-blue-600 font-bold uppercase tracking-wider">
            Tổng Điểm
          </span>
          <span className="text-4xl font-extrabold text-blue-700">
            {result.totalScore}{" "}
            <span className="text-lg text-gray-400">/ {result.totalQuestions}</span>
          </span>
        </div>

        <div className="mt-6">
          <Link href="/" className="text-blue-600 hover:underline font-medium">
            ← Quay lại trang chủ
          </Link>
        </div>
      </div>

      {/* BODY: Danh sách câu hỏi */}
      <div className="max-w-4xl mx-auto px-4">
        {result.questions.map((q) => (
          <QuestionItem key={q.questionId} q={q} />
        ))}
      </div>
    </div>
  );
}