"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";
import { authService } from "../services/authService";

export default function ProfilePage() {
  const { user, loading, logout, updateUser, refreshUser } = useAuth();
  const router = useRouter();

  // Tab state
  const [activeTab, setActiveTab] = useState<"info" | "password" | "stats">("info");

  // Edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ fullName: "", email: "" });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Password form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [changingPassword, setChangingPassword] = useState(false);

  // Stats
  const [stats, setStats] = useState({
    totalTests: 0,
    avgScore: 0,
    bestScore: 0,
    totalTime: 0,
  });

  // Init edit form when user loads
  useEffect(() => {
    if (user) {
      setEditForm({ fullName: user.fullName, email: user.email });
    }
  }, [user]);

  // Load stats
  useEffect(() => {
    const loadStats = async () => {
      try {
        // TODO: Implement stats API
        // const response = await authService.getStats();
        // setStats(response.data);
      } catch (error) {
        console.error("Load stats error:", error);
      }
    };
    if (user) loadStats();
  }, [user]);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/profile");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) return null;

  // Handle save profile
  const handleSaveProfile = async () => {
    if (!editForm.fullName.trim()) {
      setMessage({ type: "error", text: "Họ tên không được để trống" });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      await authService.updateProfile({ fullName: editForm.fullName });
      updateUser({ fullName: editForm.fullName });
      setIsEditing(false);
      setMessage({ type: "success", text: "Cập nhật thông tin thành công!" });
    } catch (error: any) {
      setMessage({ type: "error", text: error.response?.data?.message || "Cập nhật thất bại" });
    } finally {
      setSaving(false);
    }
  };

  // Handle change password
  const handleChangePassword = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwordForm;

    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage({ type: "error", text: "Vui lòng điền đầy đủ thông tin" });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: "error", text: "Mật khẩu mới phải có ít nhất 6 ký tự" });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Mật khẩu xác nhận không khớp" });
      return;
    }

    setChangingPassword(true);
    setMessage(null);

    try {
      await authService.changePassword({ currentPassword, newPassword });
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setMessage({ type: "success", text: "Đổi mật khẩu thành công!" });
    } catch (error: any) {
      setMessage({ type: "error", text: error.response?.data?.message || "Đổi mật khẩu thất bại" });
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            <span className="font-medium">Trang chủ</span>
          </Link>
          <h1 className="text-lg font-bold text-gray-800">Tài khoản của tôi</h1>
          <button onClick={logout} className="text-red-500 hover:text-red-600 font-medium text-sm">
            Đăng xuất
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
            message.type === "success" ? "bg-green-50 border border-green-200 text-green-700" : "bg-red-50 border border-red-200 text-red-700"
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

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Avatar & Quick Info */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center">
              {/* Avatar */}
              <div className="relative mx-auto w-28 h-28 mb-4">
                <div className="w-28 h-28 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                  {user.fullName.charAt(0).toUpperCase()}
                </div>
                {user.isPremium && (
                  <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full shadow">
                    ⭐ PREMIUM
                  </div>
                )}
              </div>

              <h2 className="text-xl font-bold text-gray-800">{user.fullName}</h2>
              <p className="text-gray-500 text-sm">{user.email}</p>

              {/* Premium Status */}
              <div className={`mt-4 p-3 rounded-xl ${user.isPremium ? "bg-yellow-50 border border-yellow-200" : "bg-gray-50 border border-gray-200"}`}>
                {user.isPremium ? (
                  <>
                    <p className="text-yellow-700 font-medium text-sm">🌟 Tài khoản Premium</p>
                    {user.premiumExpiredAt && (
                      <p className="text-yellow-600 text-xs mt-1">
                        Hết hạn: {new Date(user.premiumExpiredAt).toLocaleDateString("vi-VN")}
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <p className="text-gray-600 font-medium text-sm">Tài khoản Miễn phí</p>
                    <button className="mt-2 text-blue-600 text-xs font-bold hover:underline">
                      Nâng cấp Premium →
                    </button>
                  </>
                )}
              </div>

              {/* Balance */}
              <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-blue-600 text-xs uppercase tracking-wider">Số dư</p>
                <p className="text-2xl font-bold text-blue-700">{(user.balance || 0).toLocaleString("vi-VN")} đ</p>
              </div>

              {/* Quick Links */}
              <div className="mt-6 space-y-2">
                <Link href="/history" className="block w-full py-2.5 px-4 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 font-medium text-sm transition-colors">
                  📋 Lịch sử làm bài
                </Link>
              </div>
            </div>
          </div>

          {/* Right: Tabs Content */}
          <div className="lg:w-2/3">
            {/* Tab Buttons */}
            <div className="flex gap-2 mb-6 bg-white rounded-xl p-1 shadow-sm border border-gray-200">
              <button
                onClick={() => setActiveTab("info")}
                className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all ${
                  activeTab === "info" ? "bg-blue-600 text-white shadow" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                👤 Thông tin
              </button>
              <button
                onClick={() => setActiveTab("password")}
                className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all ${
                  activeTab === "password" ? "bg-blue-600 text-white shadow" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                🔒 Mật khẩu
              </button>
              <button
                onClick={() => setActiveTab("stats")}
                className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all ${
                  activeTab === "stats" ? "bg-blue-600 text-white shadow" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                📊 Thống kê
              </button>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              {/* TAB: Thông tin */}
              {activeTab === "info" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-800">Thông tin cá nhân</h3>
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        Chỉnh sửa
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Họ và tên</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.fullName}
                          onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        />
                      ) : (
                        <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-800">{user.fullName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                      <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-600">
                        {user.email}
                        <span className="ml-2 text-xs text-gray-400">(Không thể thay đổi)</span>
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Loại tài khoản</label>
                      <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-800">
                        {user.isPremium ? "🌟 Premium" : "Miễn phí"}
                      </p>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex gap-3 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setEditForm({ fullName: user.fullName, email: user.email });
                        }}
                        className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
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
              )}

              {/* TAB: Đổi mật khẩu */}
              {activeTab === "password" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-gray-800">Đổi mật khẩu</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Mật khẩu hiện tại</label>
                      <input
                        type="password"
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="Nhập mật khẩu hiện tại"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Mật khẩu mới</label>
                      <input
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="Tối thiểu 6 ký tự"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Xác nhận mật khẩu mới</label>
                      <input
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="Nhập lại mật khẩu mới"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleChangePassword}
                    disabled={changingPassword}
                    className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {changingPassword ? (
                      <>
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Đang xử lý...
                      </>
                    ) : (
                      "Đổi mật khẩu"
                    )}
                  </button>
                </div>
              )}

              {/* TAB: Thống kê */}
              {activeTab === "stats" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-gray-800">Thống kê học tập</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-linear-to-br from-blue-500 to-indigo-600 text-white p-5 rounded-2xl">
                      <p className="text-blue-100 text-xs uppercase tracking-wider">Tổng bài thi</p>
                      <p className="text-3xl font-bold mt-1">{stats.totalTests}</p>
                    </div>
                    <div className="bg-linear-to-br from-green-500 to-emerald-600 text-white p-5 rounded-2xl">
                      <p className="text-green-100 text-xs uppercase tracking-wider">Điểm TB</p>
                      <p className="text-3xl font-bold mt-1">{stats.avgScore}</p>
                    </div>
                    <div className="bg-linear-to-br from-purple-500 to-violet-600 text-white p-5 rounded-2xl">
                      <p className="text-purple-100 text-xs uppercase tracking-wider">Điểm cao nhất</p>
                      <p className="text-3xl font-bold mt-1">{stats.bestScore}</p>
                    </div>
                    <div className="bg-linear-to-br from-orange-500 to-amber-600 text-white p-5 rounded-2xl">
                      <p className="text-orange-100 text-xs uppercase tracking-wider">Tổng giờ học</p>
                      <p className="text-3xl font-bold mt-1">{Math.round(stats.totalTime / 60)}h</p>
                    </div>
                  </div>

                  <div className="text-center pt-4">
                    <Link href="/history" className="text-blue-600 hover:underline font-medium text-sm">
                      Xem chi tiết lịch sử làm bài →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
