"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { adminService } from "../services/adminService";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";
import type { DashboardStats, AdminUser, AdminTest, AdminQuestion } from "../types";
import {
  BarChart3,
  Users,
  FileText,
  HelpCircle,
  Lock,
  CheckCircle,
  Target,
  TrendingUp,
  ArrowLeft,
  Edit2,
  Trash2,
  Eye,
  Plus,
  BookOpen,
  MoreVertical,
  Zap,
  Loader,
} from "lucide-react";
import VocabularyManagement from "../components/admin/VocabularyManagement";

type Tab = "dashboard" | "users" | "tests" | "questions" | "vocabulary" | "test-actions";

export default function AdminPage() {
  const { user } = useAuth();

  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [tests, setTests] = useState<AdminTest[]>([]);
  const [questions, setQuestions] = useState<AdminQuestion[]>([]);
  const [selectedTestId, setSelectedTestId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // AI Generation States - track each action type independently
  const [processingActions, setProcessingActions] = useState({
    explain: false,
    transcripts: false,
    passages: false,
  });
  const [selectedTestForAction, setSelectedTestForAction] = useState<number | null>(null);

  // Check admin access
  useEffect(() => {
    if (user && user.role !== "Admin") {
      router.push("/");
    }
  }, [user, router]);

  // Handler functions for AI generation
  const handleGenerateAction = async (testId: number, type: string, partNumber?: number) => {
    // Set the specific action type as processing
    setProcessingActions(prev => ({ ...prev, [type]: true }));
    try {
      let response;
      if (type === "explain") {
        if (partNumber) {
          response = await adminService.generateExplanationsForPart(testId, partNumber);
        } else {
          response = await adminService.generateExplanationsForTest(testId);
        }
      } else if (type === "translate-transcripts") {
        if (partNumber) {
          response = await adminService.translateTranscriptsForPart(testId, partNumber);
        } else {
          response = await adminService.translateTranscriptsForTest(testId);
        }
      } else if (type === "translate-passages") {
        if (partNumber) {
          response = await adminService.translatePassagesForPart(testId, partNumber);
        } else {
          response = await adminService.translatePassagesForTest(testId);
        }
      }
      
      if (response) {
        // Show success alert with the message from backend
        alert(`✅ ${response.message}`);
      }
    } catch (error: any) {
      console.error("Error:", error);
      alert(`❌ Có lỗi xảy ra: ${error.message || "Vui lòng thử lại."}`);
    } finally {
      // Clear the specific action type from processing
      setProcessingActions(prev => ({ ...prev, [type]: false }));
    }
  };

  const openActionTab = (testId: number) => {
    setSelectedTestForAction(testId);
    setActiveTab("test-actions");
  };

  const handleQuickGenerate = async (testId: number, type: "explain" | "translate-transcripts" | "translate-passages") => {
    setProcessingActions(prev => ({ ...prev, [type]: true }));
    try {
      let response;
      if (type === "explain") {
        response = await adminService.generateExplanationsForTest(testId);
      } else if (type === "translate-transcripts") {
        response = await adminService.translateTranscriptsForTest(testId);
      } else if (type === "translate-passages") {
        response = await adminService.translatePassagesForTest(testId);
      }
      
      if (response) {
        alert(`✅ ${response.message}`);
      }
    } catch (error: any) {
      console.error("Error:", error);
      alert(`❌ Có lỗi xảy ra: ${error.message || "Vui lòng thử lại."}`);
    } finally {
      setProcessingActions(prev => ({ ...prev, [type]: false }));
    }
  };

  const loadDashboard = useCallback(async () => {
    try {
      const stats = await adminService.getDashboardStats();
      setStats(stats);
    } catch (error) {
      console.error("Failed to load dashboard:", error);
    }
  }, []);

  const loadUsers = useCallback(async () => {
    try {
      const users = await adminService.getUsers();
      setUsers(users);
    } catch (error) {
      console.error("Failed to load users:", error);
    }
  }, []);

  const loadTests = useCallback(async () => {
    try {
      const tests = await adminService.getTests();
      setTests(tests);
    } catch (error) {
      console.error("Failed to load tests:", error);
    }
  }, []);

  const loadQuestions = useCallback(async (testId: number) => {
    try {
      const questions = await adminService.getQuestionsByTest(testId);
      setQuestions(questions);
    } catch (error) {
      console.error("Failed to load questions:", error);
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
      await adminService.toggleUserStatus(userId);
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
      await adminService.deleteTest(testId);
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

  // Check if user is admin (case-insensitive)
  const isAdmin = user && user.role && user.role.toLowerCase() === "admin";
  
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg text-center max-w-md border border-gray-200 dark:border-gray-700">
          <div className="text-5xl mb-4 flex justify-center">
            <Lock className="w-16 h-16 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Truy cập bị từ chối</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Bạn không có quyền truy cập trang quản trị</p>
          <p className="text-gray-500 dark:text-gray-500 text-sm mb-4">
            {user ? `(Vai trò hiện tại: ${user.role})` : "(Chưa đăng nhập)"}
          </p>
          <Link href="/" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
            Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-gray-900 dark:bg-gray-950 text-white p-4 z-50">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-lg">
              T
            </div>
            <div>
              <h1 className="font-bold">TOEIC Master</h1>
              <p className="text-gray-400 text-xs">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="space-y-1">
          {[
            { key: "dashboard", label: "Dashboard", icon: BarChart3 },
            { key: "users", label: "Quản lý Users", icon: Users },
            { key: "tests", label: "Quản lý Đề thi", icon: FileText },
            { key: "questions", label: "Quản lý Câu hỏi", icon: HelpCircle },
            { key: "vocabulary", label: "Quản lý Vocabulary", icon: BookOpen },
          ].map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key as Tab)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition text-left ${
                  activeTab === item.key
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <IconComponent size={20} />
                {item.label}
              </button>
            );
          })}
          
          
          
          
        </nav>

        <div className="absolute bottom-4 left-4 right-4 space-y-3">
          {/* Theme Toggle */}
          

          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-3 text-gray-400 hover:text-white transition w-full"
          >
            <ArrowLeft size={18} />
            Về trang chủ
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-3">
              {activeTab === "dashboard" && (
                <>
                  <BarChart3 size={28} />
                  Dashboard
                </>
              )}
              {activeTab === "users" && (
                <>
                  <Users size={28} />
                  Quản lý Users
                </>
              )}
              {activeTab === "tests" && (
                <>
                  <FileText size={28} />
                  Quản lý Đề thi
                </>
              )}
              {activeTab === "questions" && (
                <>
                  <HelpCircle size={28} />
                  Quản lý Câu hỏi
                </>
              )}
              {activeTab === "vocabulary" && (
                <>
                  <BookOpen size={28} />
                  Quản lý Vocabulary
                </>
              )}
            </h2>
            <p className="text-gray-500 dark:text-gray-400">Xin chào, {user.fullName}</p>
          </div>

          {(activeTab === "users" || activeTab === "tests" || activeTab === "test-actions") && (
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
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
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Tổng Users</p>
                      <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">{stats.totalUsers}</p>
                      <p className="text-green-600 dark:text-green-400 text-sm mt-1">+{stats.newUsersToday} hôm nay</p>
                    </div>
                    <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center">
                      <Users className="w-7 h-7 text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Users hoạt động</p>
                      <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">{stats.activeUsers}</p>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{Math.round((stats.activeUsers / stats.totalUsers) * 100)}% tổng</p>
                    </div>
                    <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center">
                      <CheckCircle className="w-7 h-7 text-green-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Tổng Đề thi</p>
                      <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">{stats.totalTests}</p>
                    </div>
                    <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center">
                      <FileText className="w-7 h-7 text-purple-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Tổng Câu hỏi</p>
                      <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">{stats.totalQuestions}</p>
                    </div>
                    <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center">
                      <HelpCircle className="w-7 h-7 text-orange-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Tổng lượt thi</p>
                      <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">{stats.totalAttempts}</p>
                    </div>
                    <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center">
                      <Target className="w-7 h-7 text-indigo-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-linear-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-sm p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">Trung bình</p>
                      <p className="text-3xl font-bold">{Math.round(stats.totalAttempts / stats.totalUsers)} bài/user</p>
                    </div>
                    <div className="w-12 h-12 flex items-center justify-center">
                      <TrendingUp className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === "users" && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                    <tr>
                      <th className="text-left px-6 py-4 text-gray-600 dark:text-gray-300 font-medium">ID</th>
                      <th className="text-left px-6 py-4 text-gray-600 dark:text-gray-300 font-medium">Họ tên</th>
                      <th className="text-left px-6 py-4 text-gray-600 dark:text-gray-300 font-medium">Email</th>
                      <th className="text-left px-6 py-4 text-gray-600 dark:text-gray-300 font-medium">Role</th>
                      <th className="text-left px-6 py-4 text-gray-600 dark:text-gray-300 font-medium">Bài thi</th>
                      <th className="text-left px-6 py-4 text-gray-600 dark:text-gray-300 font-medium">Trạng thái</th>
                      <th className="text-left px-6 py-4 text-gray-600 dark:text-gray-300 font-medium">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">#{u.id}</td>
                        <td className="px-6 py-4 font-medium text-gray-800 dark:text-gray-100">{u.fullName}</td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{u.email}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            u.role === "Admin" ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400" : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{u.totalTests}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            u.isActive ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                          }`}>
                            {u.isActive ? "Hoạt động" : "Bị khóa"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleToggleUserStatus(u.id)}
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                              u.isActive
                                ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50"
                                : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50"
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
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium flex items-center gap-2">
                    <Plus size={18} /> Thêm đề thi mới
                  </button>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                      <tr>
                        <th className="text-left px-6 py-4 text-gray-600 dark:text-gray-300 font-medium">ID</th>
                        <th className="text-left px-6 py-4 text-gray-600 dark:text-gray-300 font-medium">Tiêu đề</th>
                        <th className="text-left px-6 py-4 text-gray-600 dark:text-gray-300 font-medium">Loại</th>
                        <th className="text-left px-6 py-4 text-gray-600 dark:text-gray-300 font-medium">Thời gian</th>
                        <th className="text-left px-6 py-4 text-gray-600 dark:text-gray-300 font-medium">Số câu</th>
                        <th className="text-left px-6 py-4 text-gray-600 dark:text-gray-300 font-medium">Trạng thái</th>
                        <th className="text-left px-6 py-4 text-gray-600 dark:text-gray-300 font-medium">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {filteredTests.map((t) => (
                        <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                          <td className="px-6 py-4 text-gray-500 dark:text-gray-400">#{t.id}</td>
                          <td className="px-6 py-4 font-medium text-gray-800 dark:text-gray-100">{t.title}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              t.type === "FULL_TEST" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400" : "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400"
                            }`}>
                              {t.type === "FULL_TEST" ? "Full Test" : "Mini Test"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{t.duration} phút</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{t.totalQuestions}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              t.isActive ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                            }`}>
                              {t.isActive ? "Hoạt động" : "Ẩn"}
                            </span>
                          </td>
                          <td className="px-6 py-4 flex gap-2 relative">
                            <button
                              onClick={() => {
                                setSelectedTestId(t.id);
                                setActiveTab("questions");
                              }}
                              className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-900/50 transition flex items-center gap-1"
                            >
                              <Eye size={16} /> Xem câu hỏi
                            </button>
                            
                            {/* AI Button - Direct Click to Open Test Actions Tab */}
                            <button
                              onClick={() => openActionTab(t.id)}
                              className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg text-sm font-medium hover:bg-green-200 dark:hover:bg-green-900/50 transition flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={processingActions.explain || processingActions.transcripts || processingActions.passages}
                              title="Mở bảng AI Giải thích"
                            >
                              {(processingActions.explain || processingActions.transcripts || processingActions.passages) ? <Loader size={16} className="animate-spin" /> : <Zap size={16} />}
                              AI
                            </button>

                            <button
                              onClick={() => handleDeleteTest(t.id)}
                              className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-sm font-medium hover:bg-red-200 dark:hover:bg-red-900/50 transition flex items-center gap-1"
                            >
                              <Trash2 size={16} /> Xóa
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
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border border-gray-100 dark:border-gray-700">
                    <div className="text-5xl mb-4 flex justify-center">
                      <FileText className="w-16 h-16 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Chọn đề thi</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">Vui lòng chọn một đề thi để xem câu hỏi</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {tests.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setSelectedTestId(t.id)}
                          className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition"
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
                        className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 flex items-center gap-2"
                      >
                        <ArrowLeft size={20} /> Quay lại
                      </button>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium flex items-center gap-2">
                        <Plus size={18} /> Thêm câu hỏi
                      </button>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                          <tr>
                            <th className="text-left px-6 py-4 text-gray-600 dark:text-gray-300 font-medium">Câu</th>
                            <th className="text-left px-6 py-4 text-gray-600 dark:text-gray-300 font-medium">Part</th>
                            <th className="text-left px-6 py-4 text-gray-600 dark:text-gray-300 font-medium">Nội dung</th>
                            <th className="text-left px-6 py-4 text-gray-600 dark:text-gray-300 font-medium">Đáp án</th>
                            <th className="text-left px-6 py-4 text-gray-600 dark:text-gray-300 font-medium">Thao tác</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          {questions.map((q) => (
                            <tr key={q.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                              <td className="px-6 py-4 font-medium text-gray-800 dark:text-gray-100">#{q.questionNo}</td>
                              <td className="px-6 py-4">
                                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                                  Part {q.partNumber}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-gray-600 dark:text-gray-400 max-w-md truncate">
                                {q.content || "(Câu hỏi nghe)"}
                              </td>
                              <td className="px-6 py-4">
                                <span className="w-8 h-8 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg inline-flex items-center justify-center font-bold">
                                  {q.correctOption}
                                </span>
                              </td>
                              <td className="px-6 py-4 flex gap-2">
                                <button className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-900/50 transition flex items-center gap-1">
                                  <Edit2 size={16} /> Sửa
                                </button>
                                <button className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-sm font-medium hover:bg-red-200 dark:hover:bg-red-900/50 transition flex items-center gap-1">
                                  <Trash2 size={16} /> Xóa
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

            {/* Vocabulary Tab */}
            {activeTab === "vocabulary" && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <VocabularyManagement />
              </div>
            )}
          </>
        )}

            {/* Test Actions Tab */}
            {activeTab === "test-actions" && selectedTestForAction && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                    Chọn hành động cho: {tests.find(t => t.id === selectedTestForAction)?.title}
                  </h3>
                  <button
                    onClick={() => {
                      setActiveTab("tests");
                      setSelectedTestForAction(null);
                    }}
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 flex items-center gap-2"
                  >
                    <ArrowLeft size={20} /> Quay lại
                  </button>
                </div>

                {/* Loading Notification */}
                {(processingActions.explain || processingActions.transcripts || processingActions.passages) && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 dark:border-blue-400 p-4 rounded-lg flex items-center gap-3 animate-pulse">
                    <Loader className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-spin" />
                    <div>
                      <p className="font-semibold text-blue-900 dark:text-blue-200">Đang xử lý...</p>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        {processingActions.explain && "Giải thích AI "}
                        {processingActions.transcripts && "Dịch âm bản "}
                        {processingActions.passages && "Dịch đoạn văn"}
                      </p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Tạo Giải Thích */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100">Tạo Giải Thích</h4>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">Tạo giải thích AI cho các câu hỏi</p>
                    <div className="space-y-2">
                      <button
                        onClick={() => handleGenerateAction(selectedTestForAction, "explain")}
                        disabled={processingActions.explain}
                        className="w-full px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {processingActions.explain ? (
                          <>
                            <Loader className="w-4 h-4 animate-spin" /> Đang xử lý...
                          </>
                        ) : (
                          "Toàn bộ đề"
                        )}
                      </button>
                      {[1, 2, 3, 4, 5, 6, 7].map((part) => (
                        <button
                          key={part}
                          onClick={() => handleGenerateAction(selectedTestForAction, "explain", part)}
                          disabled={processingActions.explain}
                          className="w-full px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition font-medium disabled:opacity-50 text-sm flex items-center justify-center gap-2"
                        >
                          {processingActions.explain ? (
                            <>
                              <Loader className="w-4 h-4 animate-spin" /> Đang xử lý...
                            </>
                          ) : (
                            `Part ${part}`
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dịch Âm Bản */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                        <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100">Dịch Âm Bản</h4>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">Dịch transcript cho Part 3/4</p>
                    <div className="space-y-2">
                      <button
                        onClick={() => handleGenerateAction(selectedTestForAction, "translate-transcripts")}
                        disabled={processingActions.transcripts}
                        className="w-full px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {processingActions.transcripts ? (
                          <>
                            <Loader className="w-4 h-4 animate-spin" /> Đang xử lý...
                          </>
                        ) : (
                          "Toàn bộ đề"
                        )}
                      </button>
                      {[3, 4].map((part) => (
                        <button
                          key={part}
                          onClick={() => handleGenerateAction(selectedTestForAction, "translate-transcripts", part)}
                          disabled={processingActions.transcripts}
                          className="w-full px-4 py-2 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/40 transition font-medium disabled:opacity-50 text-sm flex items-center justify-center gap-2"
                        >
                          {processingActions.transcripts ? (
                            <>
                              <Loader className="w-4 h-4 animate-spin" /> Đang xử lý...
                            </>
                          ) : (
                            `Part ${part}`
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dịch Đoạn Văn */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                        <Zap className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                      </div>
                      <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100">Dịch Đoạn Văn</h4>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">Dịch passage cho Part 6/7</p>
                    <div className="space-y-2">
                      <button
                        onClick={() => handleGenerateAction(selectedTestForAction, "translate-passages")}
                        disabled={processingActions.passages}
                        className="w-full px-4 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-lg hover:bg-orange-200 dark:hover:bg-orange-900/50 transition font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {processingActions.passages ? (
                          <>
                            <Loader className="w-4 h-4 animate-spin" /> Đang xử lý...
                          </>
                        ) : (
                          "Toàn bộ đề"
                        )}
                      </button>
                      {[6, 7].map((part) => (
                        <button
                          key={part}
                          onClick={() => handleGenerateAction(selectedTestForAction, "translate-passages", part)}
                          disabled={processingActions.passages}
                          className="w-full px-4 py-2 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/40 transition font-medium disabled:opacity-50 text-sm flex items-center justify-center gap-2"
                        >
                          {processingActions.passages ? (
                            <>
                              <Loader className="w-4 h-4 animate-spin" /> Đang xử lý...
                            </>
                          ) : (
                            `Part ${part}`
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
      </main>
    </div>
  );
}
