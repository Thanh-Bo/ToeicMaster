"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { testService } from "@/app/services/testService";
import { CommentSection } from "@/app/components/comments/CommentSection";
import Link from "next/link";
import { ArrowLeft, Clock, CheckSquare, Square, Check, Headphones, BookOpen } from "lucide-react";
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

const PART_METADATA: Record<number, { type: 'listening' | 'reading', icon: any, label: string }> = {
  1: { type: 'listening', icon: Headphones, label: "Listening" },
  2: { type: 'listening', icon: Headphones, label: "Listening" },
  3: { type: 'listening', icon: Headphones, label: "Listening" },
  4: { type: 'listening', icon: Headphones, label: "Listening" },
  5: { type: 'reading', icon: BookOpen, label: "Reading" },
  6: { type: 'reading', icon: BookOpen, label: "Reading" },
  7: { type: 'reading', icon: BookOpen, label: "Reading" },
};

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
      <div className="min-h-screen bg-gray-50/50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 dark:border-zinc-700 border-t-gray-900 dark:border-t-white" />
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950">
      <PageHeader />
      <div className="max-w-3xl mx-auto space-y-4 px-4 py-4 sm:py-6">
        {/* Header Card */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/80 rounded-2xl overflow-hidden shadow-[0_4px_20px_rgb(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgb(0,0,0,0.15)]">
          {/* Top bar */}
          <div className="px-5 py-4 sm:px-6 sm:pt-5 sm:pb-4 border-b border-gray-100 dark:border-zinc-800/50">
            <Link
              href="/practice"
              className="inline-flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400 font-bold uppercase tracking-wider transition mb-2.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Quay lại danh sách đề
            </Link>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              {testInfo?.title}
            </h1>
            <div className="flex flex-wrap gap-2 mt-2.5">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border border-blue-100/50 dark:border-blue-900/30">
                200 câu hỏi
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100/50 dark:border-emerald-900/30">
                7 Parts
              </span>
            </div>
          </div>

          <div className="p-5 sm:p-6 space-y-5 sm:space-y-6">
            {/* Chọn Parts */}
            <div>
              <div className="flex justify-between items-center mb-2.5">
                <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                  Chọn phần luyện tập
                </h3>
                <button
                  onClick={handleToggleAll}
                  className="inline-flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 font-bold transition"
                >
                  {toggleAll ? (
                    <>
                      <Square className="w-3.5 h-3.5" /> Bỏ chọn tất cả
                    </>
                  ) : (
                    <>
                      <CheckSquare className="w-3.5 h-3.5" /> Chọn tất cả
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {PARTS.map((part) => {
                  const checked = selectedParts.includes(part.id);
                  const meta = PART_METADATA[part.id];
                  const IconComponent = meta.icon;
                  return (
                    <label
                      key={part.id}
                      className={`group flex items-center justify-between gap-2.5 p-2.5 sm:p-3 rounded-xl border cursor-pointer transition-all duration-200 active:scale-[0.99] ${
                        checked
                          ? "border-blue-500 bg-blue-50/40 dark:bg-blue-950/20 text-blue-900 dark:text-blue-100"
                          : "border-gray-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/40 text-gray-700 dark:text-gray-400 hover:border-gray-300 dark:hover:border-zinc-700 hover:bg-gray-50/50 dark:hover:bg-zinc-900/70"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => togglePart(part.id)}
                        className="hidden"
                      />
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`w-4.5 h-4.5 rounded flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                            checked
                              ? "bg-blue-600 text-white"
                              : "border-2 border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 group-hover:border-gray-400"
                          }`}
                        >
                          {checked && (
                            <Check
                              className="w-3 h-3 stroke-[3] text-white"
                            />
                          )}
                        </span>
                        <div className="flex flex-col">
                          <span className="text-xs sm:text-sm font-bold tracking-tight">{part.name}</span>
                          <span className="text-[9px] font-semibold text-gray-400 dark:text-gray-500 flex items-center gap-1 mt-0.5 uppercase tracking-wider">
                            <IconComponent className="w-3 h-3 flex-shrink-0" />
                            {meta.label}
                          </span>
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Chọn Thời gian */}
            <div>
              <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white mb-2.5 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500" />
                Giới hạn thời gian
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {DURATIONS.map((d) => {
                  const active = duration === d.value;
                  return (
                    <button
                      key={d.value}
                      type="button"
                      onClick={() => setDuration(d.value)}
                      className={`py-2 px-3 rounded-xl border text-xs sm:text-sm font-bold transition-all duration-200 active:scale-[0.97] ${
                        active
                          ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                          : "border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-zinc-700 hover:bg-gray-50/50 dark:hover:bg-zinc-900/60"
                      }`}
                    >
                      {d.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={handleStart}
              className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-bold py-3 rounded-xl text-sm transition-all duration-200 shadow-md shadow-blue-600/10 hover:shadow-lg hover:shadow-blue-600/20 active:scale-[0.99] tracking-wider uppercase"
            >
              Bắt đầu làm bài
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
