"use client";

import { useEffect, useState } from "react";
import feedbackService, { FeedbackResponse } from "@/app/services/feedbackService";
import { Loader2, AlertCircle, MessageSquare, Trash2, Check, Bug, Sparkles, Palette, Lightbulb, Clock, Eye, CheckCircle, XCircle, User, MapPin } from "lucide-react";

export default function AdminFeedbackPanel() {
  const [feedbacks, setFeedbacks] = useState<FeedbackResponse[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [adminResponse, setAdminResponse] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [filter, setFilter] = useState("pending");

  useEffect(() => {
    loadFeedbacks();
  }, [filter]);

  const loadFeedbacks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const status = filter === "all" ? undefined : filter;
      const data = await feedbackService.getAllFeedbacks(status);
      setFeedbacks(data as any);
      if (data && data.length > 0) {
        setSelected(data[0].id);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selected || !newStatus) return;

    try {
      setIsUpdating(true);
      await feedbackService.updateFeedbackStatus(
        selected,
        newStatus,
        adminResponse || undefined,
        undefined
      );

      // Reload list
      await loadFeedbacks();
      setAdminResponse("");
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa?")) return;

    try {
      await feedbackService.deleteFeedback(id);
      await loadFeedbacks();
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const selectedFeedback = feedbacks.find((f) => f.id === selected);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* List */}
      <div className="lg:col-span-1">
        <div className="space-y-3">
          <div className="flex gap-2 flex-wrap">
            {["pending", "reviewing", "resolved", "all"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                  filter === status
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 dark:bg-zinc-800 text-gray-700 dark:text-gray-300"
                }`}
              >
                {status.toUpperCase()}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
          ) : error ? (
            <div className="p-3 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded text-sm">
              {error}
            </div>
          ) : (
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {feedbacks.map((fb) => (
                <button
                  key={fb.id}
                  onClick={() => setSelected(fb.id)}
                  className={`w-full p-3 rounded-lg text-left border-2 transition-all ${
                    selected === fb.id
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
                      : "border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600"
                  }`}
                >
                  <div className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-2">
                    {fb.title}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {fb.userName || "Ẩn danh"}
                  </div>
                  <div className="flex gap-1 mt-2">
                    <span
                      className={`px-2 py-1 text-xs rounded font-medium flex items-center gap-1 ${
                        fb.status === "pending"
                          ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300"
                          : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                      }`}
                    >
                      {fb.status === "pending" ? <Clock className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                      {fb.status}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Detail */}
      <div className="lg:col-span-2">
        {selectedFeedback ? (
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border border-gray-200 dark:border-zinc-700">
            {/* Header */}
            <div className="flex items-start justify-between mb-4 pb-4 border-b border-gray-200 dark:border-zinc-700">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {selectedFeedback.title}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  ID: {selectedFeedback.id} • Type: {selectedFeedback.feedbackType}
                </p>
              </div>
              <button
                onClick={() => handleDelete(selectedFeedback.id)}
                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded transition-colors"
                title="Xóa"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            {/* User Info */}
            <div className="mb-6 p-4 bg-gray-50 dark:bg-zinc-800 rounded-lg">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <User className="w-5 h-5" />
                Người gửi
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {selectedFeedback.userName || "Ẩn danh"}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {selectedFeedback.userEmail}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                Gửi: {new Date(selectedFeedback.createdAt).toLocaleString("vi-VN")}
              </p>
            </div>

            {/* Content */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Nội dung
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                {selectedFeedback.content}
              </p>
            </div>

            {/* Page Info */}
            {selectedFeedback.currentPage && (
              <div className="mb-6 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg text-sm">
                <p className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Trang: <code className="text-xs">{selectedFeedback.currentPage}</code>
                </p>
              </div>
            )}

            {/* Admin Response */}
            {selectedFeedback.adminResponse && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/30 rounded-lg">
                <h3 className="font-semibold text-green-900 dark:text-green-300 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Phản hồi Admin
                </h3>
                <p className="text-sm text-green-800 dark:text-green-400">
                  {selectedFeedback.adminResponse}
                </p>
                <p className="text-xs text-green-700 dark:text-green-500 mt-2">
                  Từ: {selectedFeedback.respondedByName} •{" "}
                  {new Date(selectedFeedback.respondedAt!).toLocaleString("vi-VN")}
                </p>
              </div>
            )}

            {/* Update Form */}
            <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-zinc-700">
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Trạng thái
                </label>
                <select
                  value={newStatus || selectedFeedback.status}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white rounded-lg text-sm"
                  disabled={isUpdating}
                >
                  <option value="pending">⏳ Chưa xử lý</option>
                  <option value="reviewing">👀 Đang xem xét</option>
                  <option value="resolved">✅ Đã xử lý</option>
                  <option value="rejected">❌ Bị từ chối</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Phản hồi
                </label>
                <textarea
                  value={adminResponse}
                  onChange={(e) => setAdminResponse(e.target.value)}
                  placeholder="Gửi phản hồi cho user..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white rounded-lg text-sm resize-none"
                  disabled={isUpdating}
                />
              </div>

              <button
                onClick={handleUpdateStatus}
                disabled={isUpdating || (!newStatus && !adminResponse)}
                className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isUpdating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                {isUpdating ? "Đang cập nhật..." : "Cập nhật"}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-96 text-gray-500 dark:text-gray-400">
            <MessageSquare className="w-12 h-12 opacity-30" />
          </div>
        )}
      </div>
    </div>
  );
}
