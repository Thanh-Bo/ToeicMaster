"use client";

import Link from "next/link";

interface Props {
  /** Icon hoặc emoji */
  icon: string;
  /** Tiêu đề */
  title: string;
  /** Mô tả ngắn */
  description?: string;
  /** Link đến trang */
  href: string;
  /** Màu nền icon */
  iconBgColor?: string;
}

export default function FeatureCard({
  icon,
  title,
  description,
  href,
  iconBgColor = "bg-blue-100",
}: Props) {
  return (
    <Link
      href={href}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 hover:shadow-xl hover:border-blue-200 transition-all group text-center"
    >
      <div
        className={`w-12 h-12 ${iconBgColor} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}
      >
        <span className="text-2xl">{icon}</span>
      </div>
      <h3 className="font-bold text-gray-800 text-sm group-hover:text-blue-600 transition">
        {title}
      </h3>
      {description && (
        <p className="text-gray-500 text-xs mt-1">{description}</p>
      )}
    </Link>
  );
}
