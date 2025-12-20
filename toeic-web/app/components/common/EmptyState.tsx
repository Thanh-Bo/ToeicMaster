"use client";

import Link from "next/link";

interface Props {
  /** Icon hiển thị (emoji hoặc component) */
  icon?: string;
  /** Tiêu đề */
  title: string;
  /** Mô tả chi tiết */
  description?: string;
  /** Văn bản nút CTA */
  actionText?: string;
  /** Link cho nút CTA */
  actionHref?: string;
  /** Callback khi click nút (thay thế cho actionHref) */
  onAction?: () => void;
}

export default function EmptyState({
  icon = "📝",
  title,
  description,
  actionText,
  actionHref,
  onAction,
}: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
      <div className="text-6xl mb-4">{icon}</div>
      <h2 className="text-xl font-semibold text-gray-700 mb-2">{title}</h2>
      {description && (
        <p className="text-gray-500 mb-6">{description}</p>
      )}
      {actionText && (actionHref || onAction) && (
        actionHref ? (
          <Link
            href={actionHref}
            className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-full font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
          >
            {actionText}
          </Link>
        ) : (
          <button
            onClick={onAction}
            className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-full font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
          >
            {actionText}
          </button>
        )
      )}
    </div>
  );
}
