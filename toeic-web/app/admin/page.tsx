"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import axiosClient from "../services/axiosClient";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";

// Types
interface User {
  id: number;
  email: string;
  fullName: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  totalTests: number;
}

interface Test {
  id: number;
  title: string;
  type: string;
  duration: number;
  totalQuestions: number;
  isActive: boolean;
  createdAt: string;
}

interface Question {
  id: number;
  testId: number;
  partNumber: number;
  questionNo: number;
  content: string;
  correctOption: string;
}

interface DashboardStats {
  totalUsers: number;
  totalTests: number;
  totalQuestions: number;
  totalAttempts: number;
  activeUsers: number;
  newUsersToday: number;
}

type Tab = "dashboard" | "users" | "tests" | "questions";

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedTestId, setSelectedTestId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Check admin access
  useEffect(() => {
    if (user && user.role !== "Admin") {
      router.push("/");
    }
  }, [user, router]);

  const loadDashboard = useCallback(async () => {
    try {
      const response = await axiosClient.get<DashboardStats>("/admin/dashboard");
      setStats(response.data);
    } catch {
      // Mock data
      setStats({
        totalUsers: 156,
        totalTests: 12,
        totalQuestions: 2400,
        totalAttempts: 1250,
        activeUsers: 89,
        newUsersToday: 5,
      });
    }
  }, []);

  const loadUsers = useCallback(async () => {
    try {
      const response = await axiosClient.get<{ items: User[] }>("/admin/users");
      setUsers(response.data.items || []);
    } catch {
      // Mock data
      setUsers([
        { id: 1, email: "user1@example.com", fullName: "Nguyễn Văn A", role: "User", isActive: true, createdAt: "2024-01-15", totalTests: 5 },
        { id: 2, email: "user2@example.com", fullName: "Trần Thị B", role: "User", isActive: true, createdAt: "2024-01-20", totalTests: 3 },
        { id: 3, email: "admin@example.com", fullName: "Admin", role: "Admin", isActive: true, createdAt: "2024-01-01", totalTests: 0 },
      ]);
    }
  }, []);

  const loadTests = useCallback(async () => {
    try {
      const response = await axiosClient.get<{ items: Test[] }>("/admin/tests");
      setTests(response.data.items || []);
    } catch {
      // Mock data
      setTests([
        { id: 1, title: "ETS TOEIC 2024 Test 1", type: "FULL_TEST", duration: 120, totalQuestions: 200, isActive: true, createdAt: "2024-01-01" },
        { id: 2, title: "ETS TOEIC 2024 Test 2", type: "FULL_TEST", duration: 120, totalQuestions: 200, isActive: true, createdAt: "2024-01-05" },
        { id: 3, title: "Mini Test Part 5-6", type: "MINI_TEST", duration: 30, totalQuestions: 50, isActive: true, createdAt: "2024-01-10" },
      ]);
    }
  }, []);

  const loadQuestions = useCallback(async (testId: number) => {
    try {
      const response = await axiosClient.get<{ items: Question[] }>(`/admin/tests/${testId}/questions`);
      setQuestions(response.data.items || []);
    } catch {
      // Mock data
      setQuestions([
        { id: 1, testId: testId, partNumber: 1, questionNo: 1, content: "What is the woman doing?", correctOption: "A" },
        { id: 2, testId: testId, partNumber: 1, questionNo: 2, content: "Where is the conversation taking place?", correctOption: "B" },
        { id: 3, testId: testId, partNumber: 5, questionNo: 101, content: "The company _____ its quarterly report next week.", correctOption: "C" },
      ]);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      switch (activeTab) {
        case "dashboard":
          await loadDashboard();
          break;
        case "users":
          await loadUsers();
          break;
        case "tests":
          await loadTests();
          break;
        case "questions":
          if (selectedTestId) {
            await loadQuestions(selectedTestId);
          }
          break;
      }
      setLoading(false);
    };
    loadData();
  }, [activeTab, selectedTestId, loadDashboard, loadUsers, loadTests, loadQuestions]);

  const handleToggleUserStatus = async (userId: number) => {
    try {
      await axiosClient.post(`/admin/users/${userId}/toggle-status`);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, isActive: !u.isActive } : u))
      );
    } catch (error) {
      console.error("Failed to toggle user status:", error);
    }
  };

  const handleDeleteTest = async (testId: number) => {
    if (!confirm("Bạn có chắc muốn xóa đề thi này?")) return;
    try {
      await axiosClient.delete(`/admin/tests/${testId}`);
      setTests((prev) => prev.filter((t) => t.id !== testId));
    } catch (error) {
      console.error("Failed to delete test:", error);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTests = tests.filter((t) =>
    t.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Check if user is admin
  if (!user || user.role !== "Admin") {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Truy cập bị từ chối</h2>
          <p className="text-gray-600 mb-6">Bạn không có quyền truy cập trang quản trị</p>
          <Link href="/" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
            Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-gray-900 text-white p-4 z-50">
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-lg">
            T
          </div>
          <div>
            <h1 className="font-bold">TOEIC Master</h1>
            <p className="text-gray-400 text-xs">Admin Panel</p>
          </div>
        </div>

        <nav className="space-y-1">
          {[
            { key: "dashboard", label: "Dashboard", icon: "📊" },
            { key: "users", label: "Quản lý Users", icon: "👥" },
            { key: "tests", label: "Quản lý Đề thi", icon: "📝" },
            { key: "questions", label: "Quản lý Câu hỏi", icon: "❓" },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key as Tab)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition text-left ${
                activeTab === item.key
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-3 text-gray-400 hover:text-white transition"
          >
            ← Về trang chủ
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {activeTab === "dashboard" && "📊 Dashboard"}
              {activeTab === "users" && "👥 Quản lý Users"}
              {activeTab === "tests" && "📝 Quản lý Đề thi"}
              {activeTab === "questions" && "❓ Quản lý Câu hỏi"}
            </h2>
            <p className="text-gray-500">Xin chào, {user.fullName}</p>
          </div>

          {(activeTab === "users" || activeTab === "tests") && (
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border rounded-xl w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : (
          <>
            {/* Dashboard Tab */}
            {activeTab === "dashboard" && stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Tổng Users</p>
                      <p className="text-3xl font-bold text-gray-800">{stats.totalUsers}</p>
                      <p className="text-green-600 text-sm mt-1">+{stats.newUsersToday} hôm nay</p>
                    </div>
                    <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-2xl">
                      👥
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Users hoạt động</p>
                      <p className="text-3xl font-bold text-gray-800">{stats.activeUsers}</p>
                      <p className="text-gray-500 text-sm mt-1">{Math.round((stats.activeUsers / stats.totalUsers) * 100)}% tổng</p>
                    </div>
                    <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-2xl">
                      ✅
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Tổng Đề thi</p>
                      <p className="text-3xl font-bold text-gray-800">{stats.totalTests}</p>
                    </div>
                    <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center text-2xl">
                      📝
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Tổng Câu hỏi</p>
                      <p className="text-3xl font-bold text-gray-800">{stats.totalQuestions}</p>
                    </div>
                    <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center text-2xl">
                      ❓
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Tổng lượt thi</p>
                      <p className="text-3xl font-bold text-gray-800">{stats.totalAttempts}</p>
                    </div>
                    <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center text-2xl">
                      🎯
                    </div>
                  </div>
                </div>

                <div className="bg-linear-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-sm p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">Trung bình</p>
                      <p className="text-3xl font-bold">{Math.round(stats.totalAttempts / stats.totalUsers)} bài/user</p>
                    </div>
                    <div className="text-4xl">📈</div>
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === "users" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left px-6 py-4 text-gray-600 font-medium">ID</th>
                      <th className="text-left px-6 py-4 text-gray-600 font-medium">Họ tên</th>
                      <th className="text-left px-6 py-4 text-gray-600 font-medium">Email</th>
                      <th className="text-left px-6 py-4 text-gray-600 font-medium">Role</th>
                      <th className="text-left px-6 py-4 text-gray-600 font-medium">Bài thi</th>
                      <th className="text-left px-6 py-4 text-gray-600 font-medium">Trạng thái</th>
                      <th className="text-left px-6 py-4 text-gray-600 font-medium">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-gray-500">#{u.id}</td>
                        <td className="px-6 py-4 font-medium text-gray-800">{u.fullName}</td>
                        <td className="px-6 py-4 text-gray-600">{u.email}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            u.role === "Admin" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-700"
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{u.totalTests}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            u.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                          }`}>
                            {u.isActive ? "Hoạt động" : "Bị khóa"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleToggleUserStatus(u.id)}
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                              u.isActive
                                ? "bg-red-100 text-red-700 hover:bg-red-200"
                                : "bg-green-100 text-green-700 hover:bg-green-200"
                            }`}
                          >
                            {u.isActive ? "Khóa" : "Mở khóa"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Tests Tab */}
            {activeTab === "tests" && (
              <div className="space-y-4">
                <div className="flex justify-end">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium">
                    + Thêm đề thi mới
                  </button>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="text-left px-6 py-4 text-gray-600 font-medium">ID</th>
                        <th className="text-left px-6 py-4 text-gray-600 font-medium">Tiêu đề</th>
                        <th className="text-left px-6 py-4 text-gray-600 font-medium">Loại</th>
                        <th className="text-left px-6 py-4 text-gray-600 font-medium">Thời gian</th>
                        <th className="text-left px-6 py-4 text-gray-600 font-medium">Số câu</th>
                        <th className="text-left px-6 py-4 text-gray-600 font-medium">Trạng thái</th>
                        <th className="text-left px-6 py-4 text-gray-600 font-medium">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filteredTests.map((t) => (
                        <tr key={t.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-gray-500">#{t.id}</td>
                          <td className="px-6 py-4 font-medium text-gray-800">{t.title}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              t.type === "FULL_TEST" ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"
                            }`}>
                              {t.type === "FULL_TEST" ? "Full Test" : "Mini Test"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-600">{t.duration} phút</td>
                          <td className="px-6 py-4 text-gray-600">{t.totalQuestions}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              t.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                            }`}>
                              {t.isActive ? "Hoạt động" : "Ẩn"}
                            </span>
                          </td>
                          <td className="px-6 py-4 flex gap-2">
                            <button
                              onClick={() => {
                                setSelectedTestId(t.id);
                                setActiveTab("questions");
                              }}
                              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition"
                            >
                              Xem câu hỏi
                            </button>
                            <button
                              onClick={() => handleDeleteTest(t.id)}
                              className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition"
                            >
                              Xóa
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Questions Tab */}
            {activeTab === "questions" && (
              <div className="space-y-4">
                {!selectedTestId ? (
                  <div className="bg-white rounded-2xl p-12 text-center">
                    <div className="text-5xl mb-4">📝</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Chọn đề thi</h3>
                    <p className="text-gray-600 mb-6">Vui lòng chọn một đề thi để xem câu hỏi</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {tests.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setSelectedTestId(t.id)}
                          className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
                        >
                          {t.title}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => setSelectedTestId(null)}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        ← Quay lại
                      </button>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium">
                        + Thêm câu hỏi
                      </button>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                          <tr>
                            <th className="text-left px-6 py-4 text-gray-600 font-medium">Câu</th>
                            <th className="text-left px-6 py-4 text-gray-600 font-medium">Part</th>
                            <th className="text-left px-6 py-4 text-gray-600 font-medium">Nội dung</th>
                            <th className="text-left px-6 py-4 text-gray-600 font-medium">Đáp án</th>
                            <th className="text-left px-6 py-4 text-gray-600 font-medium">Thao tác</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {questions.map((q) => (
                            <tr key={q.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 font-medium text-gray-800">#{q.questionNo}</td>
                              <td className="px-6 py-4">
                                <span className="px-2 py-1 bg-gray-100 rounded-full text-sm">
                                  Part {q.partNumber}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-gray-600 max-w-md truncate">
                                {q.content || "(Câu hỏi nghe)"}
                              </td>
                              <td className="px-6 py-4">
                                <span className="w-8 h-8 bg-green-100 text-green-700 rounded-lg inline-flex items-center justify-center font-bold">
                                  {q.correctOption}
                                </span>
                              </td>
                              <td className="px-6 py-4 flex gap-2">
                                <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition">
                                  Sửa
                                </button>
                                <button className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition">
                                  Xóa
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
