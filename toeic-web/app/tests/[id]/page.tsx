"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { testService } from "@/app/services/testService";
import { CommentSection } from "@/app/components/comments/CommentSection";
import Link from "next/link";

const PARTS = [
  { id: 1, name: "Part 1: Photographs" },
  { id: 2, name: "Part 2: Question-Response" },
  { id: 3, name: "Part 3: Conversations" },
  { id: 4, name: "Part 4: Talks" },
  { id: 5, name: "Part 5: Incomplete Sentences" },
  { id: 6, name: "Part 6: Text Completion" },
  { id: 7, name: "Part 7: Reading Comprehension" },
];

const DURATIONS = [
  { label: "Mặc định (120 phút)", value: 120 },
  { label: "60 phút", value: 60 },
  { label: "30 phút", value: 30 },
  { label: "Không giới hạn thời gian", value: 0 },
];

export default function TestOverviewPage() {
  const params = useParams();
  const router = useRouter();
  const testId = Number(params.id);

  const [testInfo, setTestInfo] = useState<any>(null);
  const [selectedParts, setSelectedParts] = useState<number[]>([1, 2, 3, 4, 5, 6, 7]);
  const [duration, setDuration] = useState<number>(120);
  const [loading, setLoading] = useState(true);
  const [toggleAll, setToggleAll] = useState(false);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await testService.getTestFull(testId);
        setTestInfo(res.data);
      } catch (error) {
        console.error("Lỗi tải thông tin đề thi:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInfo();
  }, [testId]);

  const togglePart = (id: number) => {
    setSelectedParts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleToggleAll = () => {
    if (toggleAll) {
      setSelectedParts([]); // Deselect all
    } else {
      setSelectedParts(PARTS.map((part) => part.id)); // Select all
    }
    setToggleAll(!toggleAll);
  };

  const handleStart = () => {
    if (selectedParts.length === 0) {
      alert("Vui lòng chọn ít nhất một Part để luyện tập!");
      return;
    }
    // Chuyển sang trang làm bài với Query Params
    const partsParam = selectedParts.sort().join(",");
    router.push(`/tests/${testId}/start?parts=${partsParam}&duration=${duration}`);
  };

  if (loading) return <div className="p-10 text-center">Đang tải thông tin...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 p-8 text-white">
          <Link href="/" className="text-blue-100 hover:text-white mb-4 inline-block">
            ← Quay lại trang chủ
          </Link>
          <h1 className="text-3xl font-bold">{testInfo?.title}</h1>
          <p className="mt-2 opacity-80">Cấu trúc: 200 câu hỏi • 7 Parts</p>
        </div>

        <div className="p-8 space-y-8">
          {/* Chọn Parts */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Chọn phần luyện tập</h3>
              <button 
                onClick={handleToggleAll}
                className="text-sm text-blue-600 font-semibold hover:underline"
              >
                {toggleAll ? "Bỏ chọn tất cả" : "Chọn tất cả"}
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {PARTS.map((part) => (
                <label 
                  key={part.id} 
                  className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedParts.includes(part.id) 
                    ? "border-blue-500 bg-blue-50" 
                    : "border-gray-100 hover:border-gray-200"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedParts.includes(part.id)}
                    onChange={() => togglePart(part.id)}
                    className="hidden"
                  />
                  <span className={`w-6 h-6 rounded-md border-2 flex items-center justify-center mr-3 ${
                    selectedParts.includes(part.id) ? "bg-blue-600 border-blue-600" : "border-gray-300"
                  }`}>
                    {selectedParts.includes(part.id) && (
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </span>
                  <span className="font-medium text-gray-700">{part.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Chọn Thời gian */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Giới hạn thời gian</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {DURATIONS.map((d) => (
                <button
                  key={d.value}
                  onClick={() => setDuration(d.value)}
                  className={`p-3 rounded-xl border-2 text-sm font-bold transition-all ${
                    duration === d.value 
                    ? "border-blue-600 bg-blue-600 text-white shadow-lg" 
                    : "border-gray-100 text-gray-600 hover:border-gray-200"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Nút bắt đầu */}
          <button
            onClick={handleStart}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 rounded-2xl text-xl shadow-xl transition-all transform hover:-translate-y-1 active:scale-95"
          >
            BẮT ĐẦU LÀM BÀI 🚀
          </button>
        </div>
      </div>

      {/* Phần bình luận */}
      <div className="mt-10">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Thảo luận về đề thi</h3>
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          <CommentSection testId={testId} />
        </div>
      </div>
    </div>
  );
}