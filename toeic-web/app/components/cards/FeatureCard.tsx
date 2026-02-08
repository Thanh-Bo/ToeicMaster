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
      className="group relative bg-white dark:bg-zinc-800 rounded-2xl shadow-lg dark:shadow-xl border border-gray-200 dark:border-zinc-700 p-6 hover:shadow-2xl dark:hover:shadow-2xl transition-all duration-300 text-center overflow-hidden hover:-translate-y-2"
    >
      {/* Gradient Background on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent dark:from-blue-900/20 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

      {/* Border Gradient Effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/0 via-blue-400/0 to-blue-400/0 group-hover:from-blue-400/20 group-hover:via-blue-400/20 group-hover:to-transparent transition-all duration-500 pointer-events-none"></div>

      {/* Icon Container */}
      <div className="relative">
        <div
          className={`${iconBgColor} dark:bg-opacity-20 w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300 shadow-md dark:shadow-lg`}
        >
          <span className="text-3xl group-hover:animate-bounce">{icon}</span>
        </div>

        {/* Glow effect on hover */}
        <div className="absolute inset-0 rounded-xl bg-blue-400/30 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-150 pointer-events-none"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <h3 className="font-bold text-gray-800 dark:text-white text-base group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
          {title}
        </h3>
        {description && (
          <p className="text-gray-500 dark:text-gray-400 text-xs mt-2 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
            {description}
          </p>
        )}
      </div>

      {/* Arrow indicator */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-300 dark:text-gray-600 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all duration-300">
        →
      </div>
    </Link>
  );
}
