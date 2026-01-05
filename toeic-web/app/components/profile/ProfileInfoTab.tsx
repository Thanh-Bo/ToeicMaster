import { useState, useEffect } from "react";
import { authService } from "../../services/authService";

interface User {
  fullName: string;
  email: string;
  isPremium: boolean;
}

interface ProfileInfoTabProps {
  user: User;
  onUpdateUser: (data: any) => void;
}

export default function ProfileInfoTab({ user, onUpdateUser }: ProfileInfoTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ fullName: "", email: "" });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

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
      setMessage({ type: "error", text: error.response?.data?.message || "Cập nhật thất bại" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white">Thông tin cá nhân</h3>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-500 font-medium text-sm flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Chỉnh sửa
          </button>
        )}
      </div>

      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 ${
          message.type === "success" ? "bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 text-green-700 dark:text-green-300" : "bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300"
        }`}>
          {message.type === "success" ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          {message.text}
          <button onClick={() => setMessage(null)} className="ml-auto">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Họ và tên</label>
          {isEditing ? (
            <input
              type="text"
              value={editForm.fullName}
              onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          ) : (
            <p className="px-4 py-3 bg-gray-50 dark:bg-zinc-800 rounded-xl text-gray-800 dark:text-gray-200">{user.fullName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
          <p className="px-4 py-3 bg-gray-50 dark:bg-zinc-800 rounded-xl text-gray-600 dark:text-gray-400">
            {user.email}
            <span className="ml-2 text-xs text-gray-400">(Không thể thay đổi)</span>
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Loại tài khoản</label>
          <p className="px-4 py-3 bg-gray-50 dark:bg-zinc-800 rounded-xl text-gray-800 dark:text-gray-200">
            {user.isPremium ? "🌟 Premium" : "Miễn phí"}
          </p>
        </div>
      </div>

      {isEditing && (
        <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-zinc-700">
          <button
            onClick={() => {
              setIsEditing(false);
              setEditForm({ fullName: user.fullName, email: user.email });
            }}
            className="flex-1 py-2.5 border border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang lưu...
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
