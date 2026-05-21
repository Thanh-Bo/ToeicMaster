import { useState, useEffect, useRef } from "react";
import { authService } from "../../services/authService";
import { Check, X, Pencil, Loader2, Upload } from "lucide-react";

interface User {
  fullName: string;
  email: string;
  isPremium: boolean;
  avatarUrl?: string;
}

interface ProfileInfoTabProps {
  user: User;
  onUpdateUser: (data: any) => void;
}

export default function ProfileInfoTab({
  user,
  onUpdateUser,
}: ProfileInfoTabProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ fullName: "", email: "" });
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    setEditForm({ fullName: user.fullName, email: user.email });
  }, [user]);

  const handleSaveProfile = async () => {
    if (!editForm.fullName.trim()) {
      setMessage({ type: "error", text: "Họ tên không được để trống" });
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      await authService.updateProfile({ fullName: editForm.fullName });
      onUpdateUser({ fullName: editForm.fullName });
      setIsEditing(false);
      setMessage({ type: "success", text: "Cập nhật thông tin thành công!" });
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Cập nhật thất bại",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    setMessage(null);
    try {
      const response = await authService.updateAvatar(file);
      onUpdateUser({ avatarUrl: response.data.avatarUrl });
      setMessage({ type: "success", text: "Cập nhật avatar thành công!" });
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Tải avatar thất bại",
      });
    } finally {
      setUploadingAvatar(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Avatar Section */}
      <div className="flex flex-col items-center gap-4 pb-6 border-b border-gray-100 dark:border-zinc-700">
        <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.fullName}
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-900 dark:bg-white flex items-center justify-center text-white dark:text-gray-900 text-2xl font-bold">
                {user.fullName?.charAt(0)?.toUpperCase()}
              </div>
            )}
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingAvatar}
            className="absolute bottom-0 right-0 p-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center"
            title="Thay đổi avatar"
          >
            {uploadingAvatar ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
          className="hidden"
        />
      </div>

      {/* Title row */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          Thông tin cá nhân
        </h3>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
          >
            <Pencil className="w-3.5 h-3.5" />
            Chỉnh sửa
          </button>
        )}
      </div>

      {/* Alert */}
      {message && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 border text-sm ${
            message.type === "success"
              ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300"
              : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300"
          }`}
        >
          {message.type === "success" ? (
            <Check className="w-4 h-4 flex-shrink-0" />
          ) : (
            <X className="w-4 h-4 flex-shrink-0" />
          )}
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="ml-auto">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Fields */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">
            Họ và tên
          </label>
          {isEditing ? (
            <input
              type="text"
              value={editForm.fullName}
              onChange={(e) =>
                setEditForm({ ...editForm, fullName: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white rounded-xl focus:border-gray-400 dark:focus:border-zinc-500 focus:ring-0 outline-none transition"
            />
          ) : (
            <p className="px-4 py-3 bg-gray-50 dark:bg-zinc-800 rounded-xl text-gray-900 dark:text-gray-200 border border-gray-100 dark:border-zinc-700">
              {user.fullName}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">
            Email
          </label>
          <p className="px-4 py-3 bg-gray-50 dark:bg-zinc-800 rounded-xl text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-zinc-700">
            {user.email}
            <span className="ml-2 text-xs text-gray-400 dark:text-gray-500">
              (Không thể thay đổi)
            </span>
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">
            Loại tài khoản
          </label>
          <p className="px-4 py-3 bg-gray-50 dark:bg-zinc-800 rounded-xl text-gray-900 dark:text-gray-200 border border-gray-100 dark:border-zinc-700">
            {user.isPremium ? "Premium" : "Miễn phí"}
          </p>
        </div>
      </div>

      {/* Edit actions */}
      {isEditing && (
        <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-zinc-700">
          <button
            onClick={() => {
              setIsEditing(false);
              setEditForm({ fullName: user.fullName, email: user.email });
            }}
            className="flex-1 py-2.5 border border-gray-200 dark:border-zinc-600 text-gray-600 dark:text-gray-400 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-zinc-800 transition"
          >
            Hủy
          </button>
          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className="flex-1 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-medium hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Đang lưu...
              </>
            ) : (
              "Lưu thay đổi"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
