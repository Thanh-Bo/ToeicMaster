"use client";

import { Lock, X } from "lucide-react";
import Link from "next/link";

interface ProFeatureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProFeatureModal({ isOpen, onClose }: ProFeatureModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 mx-4 w-full max-w-md rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40">
          <Lock className="w-7 h-7 text-amber-600 dark:text-amber-400" />
        </div>

        {/* Title */}
        <h2 className="text-center text-lg font-extrabold text-zinc-900 dark:text-white mb-3">
          Tính năng PRO
        </h2>

        {/* Description */}
        <p className="text-center text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
          Bộ lọc thời gian chỉ dành cho PRO. Tài khoản thường vẫn xem được tiến
          độ ở mục{" "}
          <span className="font-semibold text-zinc-800 dark:text-zinc-200">
            Tất cả
          </span>
          .
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/subscription"
            onClick={onClose}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/20"
          >
            Nâng cấp PRO
          </Link>
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-5 py-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            Để sau
          </button>
        </div>
      </div>
    </div>
  );
}
