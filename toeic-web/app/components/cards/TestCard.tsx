"use client";

import Link from "next/link";

interface Props {
  /** ID của test */
  id: number;
  /** Tiêu đề */
  title: string;
  /** Thời gian làm bài (phút) */
  duration: number;
  /** Số câu hỏi */
  totalQuestions: number;
  /** Số người đã làm */
  totalParticipants?: number;
  /** Loại test */
  type?: string;
  /** Màu gradient header */
  color?: "blue" | "green" | "purple" | "orange";
}

const colorClasses = {
  blue: "from-blue-500 to-blue-700",
  green: "from-green-500 to-green-700",
  purple: "from-purple-500 to-purple-700",
  orange: "from-orange-500 to-orange-700",
};

export default function TestCard({
  id,
  title,
  duration,
  totalQuestions,
  totalParticipants,
  type,
  color = "blue",
}: Props) {
  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-blue-200 transition-all duration-300">
      {/* Header gradient */}
      <div
        className={`h-24 bg-linear-to-br ${colorClasses[color]} p-4 flex flex-col justify-between relative overflow-hidden`}
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        {type && (
          <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-2 py-0.5 rounded-full self-start">
            {type}
          </span>
        )}
        <div className="text-white/90 text-xs">
          {totalParticipants ? `${totalParticipants.toLocaleString()} lượt thi` : "Mới"}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition line-clamp-2">
          {title}
        </h3>

        {/* Info badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-medium">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {duration} phút
          </span>
          <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-medium">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            {totalQuestions} câu
          </span>
        </div>

        {/* CTA Button */}
        <Link
          href={`/tests/${id}`}
          className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-colors text-sm shadow-md shadow-blue-100"
        >
          Làm bài ngay →
        </Link>
      </div>
    </div>
  );
}
