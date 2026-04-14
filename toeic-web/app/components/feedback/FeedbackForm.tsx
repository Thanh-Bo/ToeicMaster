"use client";

import { useState } from "react";
import feedbackService, { CreateFeedbackRequest } from "@/app/services/feedbackService";
import { useAuth } from "@/app/contexts/AuthContext";
import { AlertCircle, CheckCircle, Loader2, Bug, Sparkles, Palette, Lightbulb } from "lucide-react";

interface FeedbackFormProps {
  onSuccess?: () => void;
}

const feedbackTypes = [
  { value: "bug", label: "Lỗi (Bug)", icon: Bug, color: "bg-red-50 dark:bg-red-950" },
  { value: "feature", label: "Tính năng mới", icon: Sparkles, color: "bg-purple-50 dark:bg-purple-950" },
  { value: "ui_ux", label: "Cải thiện UI/UX", icon: Palette, color: "bg-blue-50 dark:bg-blue-950" },
  { value: "other", label: "Khác", icon: Lightbulb, color: "bg-amber-50 dark:bg-amber-950" },
];

export default function FeedbackForm({ onSuccess }: FeedbackFormProps) {
  const { user } = useAuth();
  const [feedbackType, setFeedbackType] = useState<"bug" | "feature" | "ui_ux" | "other">("bug");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [priority, setPriority] = useState(2);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!title.trim()) {
      setError("Vui lòng nhập tiêu đề");
      return;
    }

    if (!content.trim()) {
      setError("Vui lòng nhập nội dung chi tiết");
      return;
    }

    if (content.trim().length < 10) {
      setError("Nội dung phải có ít nhất 10 ký tự");
      return;
    }

    try {
      setIsLoading(true);

      const request: CreateFeedbackRequest = {
        feedbackType,
        title: title.trim(),
        content: content.trim(),
        email: email || undefined,
        currentPage: window.location.pathname,
        priority: priority as 1 | 2 | 3,
      };

      await feedbackService.createFeedback(request);
      setSuccess(true);

      // Reset form
      setTimeout(() => {
        setTitle("");
        setContent("");
        setFeedbackType("bug");
        setPriority(2);
        onSuccess?.();
      }, 500);
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-4">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
        <p className="text-gray-700 dark:text-gray-300 font-medium">Cảm ơn bạn!</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Error Alert */}
      {error && (
        <div className="flex gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Feedback Type Selection */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
          Loại Feedback
        </label>
        <div className="grid grid-cols-2 gap-2">
          {feedbackTypes.map((type) => {
            const IconComponent = type.icon;
            return (
              <button
                key={type.value}
                type="button"
                onClick={() => setFeedbackType(type.value as any)}
                className={`p-3 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                  feedbackType === type.value
                    ? `${type.color} ring-2 ring-blue-500 dark:ring-blue-400`
                    : `${type.color} text-gray-700 dark:text-gray-300 hover:shadow-sm`
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span>{type.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
          Tiêu đề <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Tiêu đề ngắn gọn"
          className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
          disabled={isLoading}
        />
      </div>

      {/* Content */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
          Nội dung chi tiết <span className="text-red-500">*</span>
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Mô tả chi tiết vấn đề hoặc gợi ý của bạn..."
          rows={4}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all resize-none"
          disabled={isLoading}
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {content.length}/500 ký tự
        </p>
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
          Email (để follow-up)
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
          disabled={isLoading}
        />
      </div>

      {/* Priority (Optional) */}
      {feedbackType === "bug" && (
        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Mức độ ưu tiên
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(Number(e.target.value) as 1 | 2 | 3)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
            disabled={isLoading}
          >
            <option value={1}>🟢 Thấp</option>
            <option value={2}>🟡 Bình thường</option>
            <option value={3}>🔴 Cao</option>
          </select>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || !title.trim() || !content.trim()}
        className="w-full py-2.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-2
          bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 
          text-white disabled:opacity-50 disabled:cursor-not-allowed
          hover:shadow-lg active:scale-95"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Đang gửi...
          </>
        ) : (
          <>📨 Gửi Feedback</>
        )}
      </button>

      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
        Chúng tôi sẽ xem xét ý kiến của bạn trong vòng 24 giờ.
      </p>
    </form>
  );
}
