"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { testService } from "@/app/services/testService";
import { CommentSection } from "@/app/components/comments/CommentSection";
import Link from "next/link";
import { ArrowLeft, Clock, CheckSquare, Square, Check } from "lucide-react";
import { PageHeader } from "@/app/components";

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
  { label: "Không giới hạn", value: 0 },
];  

export default function TestOverviewPage() {
  const params = useParams();
  const router = useRouter();
  const testId = params.id as string;

  const [testInfo, setTestInfo] = useState<any>(null);
  const [selectedParts, setSelectedParts] = useState<number[]>([
    1, 2, 3, 4, 5, 6, 7,
  ]);
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
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  };

  const handleToggleAll = () => {
    if (toggleAll) {
      setSelectedParts([]);
    } else {
      setSelectedParts(PARTS.map((part) => part.id));
    }
    setToggleAll(!toggleAll);
  };

  const handleStart = () => {
    if (selectedParts.length === 0) {
      alert("Vui lòng chọn ít nhất một Part để luyện tập!");
      return;
    }
    const partsParam = selectedParts.sort().join(",");
    router.push(
      `/tests/${testId}/start?parts=${partsParam}&duration=${duration}`,
    );
  };

  if (loading)
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 dark:border-zinc-700 border-t-gray-900 dark:border-t-white" />
      </div>
    );

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <PageHeader />
      <div className="max-w-3xl mx-auto space-y-6 px-4 py-10">
        {/* Header Card */}
        <div className="border border-gray-200 dark:border-zinc-700 rounded-2xl overflow-hidden">
          {/* Top bar */}
          <div className="px-8 pt-8 pb-6 border-b border-gray-200 dark:border-zinc-700">
            <Link
              href="/practice"
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition mb-5"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại danh sách đề
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {testInfo?.title}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              200 câu hỏi · 7 Parts
            </p>
          </div>

          <div className="p-8 space-y-8">
            {/* Chọn Parts */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                  Chọn phần luyện tập
                </h3>
                <button
                  onClick={handleToggleAll}
                  className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
                >
                  {toggleAll ? (
                    <>
                      <Square className="w-4 h-4" /> Bỏ chọn tất cả
                    </>
                  ) : (
                    <>
                      <CheckSquare className="w-4 h-4" /> Chọn tất cả
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {PARTS.map((part) => {
                  const checked = selectedParts.includes(part.id);
                  return (
                    <label
                      key={part.id}
                      className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                        checked
                          ? "border-gray-400 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800"
                          : "border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-zinc-500 hover:text-gray-900 dark:hover:text-white"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => togglePart(part.id)}
                        className="hidden"
                      />
                      <span
                        className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-all ${
                          checked
                            ? "bg-blue-500 dark:bg-blue-500"
                            : "border border-gray-300 dark:border-zinc-600"
                        }`}
                      >
                        {checked && (
                          <Check
                            className={`w-3 h-3 ${
                              checked ? "text-white dark:text-gray-900" : ""
                            }`}
                          />
                        )}
                      </span>
                      <span
                        className={`text-sm font-medium ${
                          checked
                            ? "text-gray-900 dark:text-white"
                            : "text-gray-600 dark:text-gray-400"
                        }`}
                      >
                        {part.name}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Chọn Thời gian */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                Giới hạn thời gian
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {DURATIONS.map((d) => (
                  <button
                    key={d.value}
                    onClick={() => setDuration(d.value)}
                    className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                      duration === d.value
                        ? "bg-blue-500 dark:bg-blue-500 text-white dark:text-white border-white dark:border-white"
                        : "border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-zinc-500 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={handleStart}
              className="w-full bg-blue-500 dark:bg-blue-500 hover:opacity-90 text-white dark:text-white font-semibold py-4 rounded-xl text-base transition-all hover:scale-[1.01] active:scale-95"
            >
              BẮT ĐẦU LÀM BÀI
            </button>
          </div>
        </div>

        {/* Comment Section */}
        {/* <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Thảo luận về đề thi
          </h3>
          <div className="border border-gray-200 dark:border-zinc-700 rounded-2xl p-6">
            {testInfo !== null ? (
              <CommentSection testId={testInfo.id} />
            ) : null}
          </div>
        </div> */}
      </div>
    </div>
  );
}
