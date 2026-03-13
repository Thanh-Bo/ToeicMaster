"use client";

import Link from "next/link";
import { ReactNode } from "react";

interface Props {
  /** Icon hoặc emoji, hoặc React component */
  icon: string | ReactNode;
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
      className="group relative text-gray-800 dark:text-white  rounded-2xl shadow-lg dark:shadow-xl border border-gray-200 dark:border-zinc-700 p-6 hover:shadow-2xl dark:hover:shadow-2xl transition-all duration-300 text-center overflow-hidden hover:-translate-y-2"
    >
      {/* Gradient Background on Hover */}
      <div className="absolute inset-0  transition-opacity duration-300 pointer-events-none"></div>

      {/* Border Gradient Effect */}
      <div className="absolute inset-0 rounded-2xl  transition-all duration-500 pointer-events-none"></div>

      {/* Icon Container */}
      <div className="relative mb-4">
        {typeof icon === 'string' ? (
          <span className="text-3xl group-hover:animate-bounce">{icon}</span>
        ) : (
          <div className="group-hover:animate-bounce transition-transform inline-block">
            {icon}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="relative z-10">
        <h3 className="font-bold text-gray-800 dark:text-white text-base  transition-colors duration-300">
          {title}
        </h3>
        {description && (
          <p className="text-gray-500 dark:text-gray-400 text-xs mt-2 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
            {description}
          </p>
        )}
      </div>

      
    </Link>
  );
}
