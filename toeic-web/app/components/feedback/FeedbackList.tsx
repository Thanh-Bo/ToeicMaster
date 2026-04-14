"use client";

import { useEffect, useState } from "react";
import feedbackService, { FeedbackListResponse } from "@/app/services/feedbackService";
import { Loader2, AlertCircle, Bug, Sparkles, Palette, Lightbulb, Clock, Eye, CheckCircle, XCircle } from "lucide-react";

export default function FeedbackList() {
  const [feedbacks, setFeedbacks] = useState<FeedbackListResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadFeedbacks();
  }, [filter]);

  const loadFeedbacks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const status = filter === "all" ? undefined : filter;
      const data = await feedbackService.getAllFeedbacks(status);
      setFeedbacks(data);
    } catch (err: any) {
      setError(err.message || "Failed to load feedbacks");
    } finally {
      setIsLoading(false);
    }
  };

  const statusConfig: Record<string, { bg: string; text: string; label: string; icon: React.ComponentType<{ className?: string }> }> = {
    pending: { bg: "bg-yellow-50 dark:bg-yellow-950", text: "text-yellow-700 dark:text-yellow-300", label: "Chưa xử lý", icon: Clock },
    reviewing: {
      bg: "bg-blue-50 dark:bg-blue-950",
      text: "text-blue-700 dark:text-blue-300",
      label: "Đang xem xét",
      icon: Eye,
    },
    resolved: {
      bg: "bg-green-50 dark:bg-green-950",
      text: "text-green-700 dark:text-green-300",
      label: "Đã xử lý",
      icon: CheckCircle,
    },
    rejected: {
      bg: "bg-red-50 dark:bg-red-950",
      text: "text-red-700 dark:text-red-300",
      label: "Bị từ chối",
      icon: XCircle,
    },
  };

  const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    bug: Bug,
    feature: Sparkles,
    ui_ux: Palette,
    other: Lightbulb,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex gap-2 p-4 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400">
        <AlertCircle className="w-5 h-5 flex-shrink-0" />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter Buttons */}
      <div className="flex gap-2 flex-wrap">
        {["all", "pending", "reviewing", "resolved", "rejected"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              filter === status
                ? "bg-blue-500 text-white shadow-md"
                : "bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700"
            }`}
          >
            {status === "all" ? "Tất cả" : statusConfig[status]?.label}
          </button>
        ))}
      </div>

      {/* Feedbacks List */}
      {feedbacks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">Không có feedback</p>
        </div>
      ) : (
        <div className="space-y-3">
          {feedbacks.map((feedback) => {
            const status = statusConfig[feedback.status] || statusConfig.pending;
            const TypeIcon = typeIcons[feedback.feedbackType];
            const StatusIcon = status.icon;
            return (
              <div
                key={feedback.id}
                className={`p-4 rounded-lg border border-gray-200 dark:border-zinc-700 ${status.bg}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {TypeIcon && <TypeIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />}
                      <h3 className="font-semibold text-gray-900 dark:text-white">{feedback.title}</h3>
                      <span className={`px-2 py-0.5 text-xs rounded-full font-medium flex items-center gap-1 ${status.text}`}>
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Từ: <span className="font-medium">{feedback.userName || "Ẩn danh"}</span>
                    </p>

                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      Ngày: {new Date(feedback.createdAt).toLocaleDateString("vi-VN")}
                      {feedback.respondedAt && (
                        <span className="ml-2">
                          • Phản hồi: {new Date(feedback.respondedAt).toLocaleDateString("vi-VN")}
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    {[1, 2, 3].map((p) => (
                      <div
                        key={p}
                        className={`w-2 h-8 rounded ${
                          p <= feedback.priority ? "bg-orange-500" : "bg-gray-300 dark:bg-zinc-700"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
