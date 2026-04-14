"use client";

import { useState } from "react";
import { X, CheckCircle } from "lucide-react";
import FeedbackForm from "./FeedbackForm";

interface FeedbackModalProps {
  onClose: () => void;
}

export default function FeedbackModal({ onClose }: FeedbackModalProps) {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 max-w-sm w-full animate-in fade-in zoom-in-95 border border-gray-200 dark:border-zinc-700">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>

            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Cảm ơn bạn!
            </h3>

            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Ý kiến của bạn rất quan trọng với chúng tôi. Chúng tôi sẽ xem xét và cải thiện
              website dựa trên phản hồi của bạn.
            </p>

            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="w-full px-4 py-2.5 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-zinc-700 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            💬 Gửi Ý Kiến
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <FeedbackForm onSuccess={() => setSubmitted(true)} />
        </div>
      </div>
    </div>
  );
}
