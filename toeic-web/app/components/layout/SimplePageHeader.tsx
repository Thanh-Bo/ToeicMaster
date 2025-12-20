"use client";

import Link from "next/link";

interface Props {
  /** Tiêu đề trang (có thể kèm emoji) */
  title: string;
  /** Mô tả ngắn */
  description?: string;
  /** Hiển thị nút quay về trang chủ */
  showBackButton?: boolean;
  /** Link quay về (mặc định "/") */
  backHref?: string;
  /** Text nút back */
  backText?: string;
  /** Extra content bên phải (ví dụ: nút hành động) */
  rightContent?: React.ReactNode;
}

export default function SimplePageHeader({
  title,
  description,
  showBackButton = true,
  backHref = "/",
  backText = "← Trang chủ",
  rightContent,
}: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{title}</h1>
        {description && (
          <p className="text-gray-600 mt-1">{description}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {rightContent}
        {showBackButton && (
          <Link
            href={backHref}
            className="px-4 py-2 bg-white rounded-lg shadow border border-gray-200 hover:shadow-md transition text-gray-700 font-medium text-sm"
          >
            {backText}
          </Link>
        )}
      </div>
    </div>
  );
}
