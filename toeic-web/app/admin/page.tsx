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
  MoreVertical,
  ArrowLeft,
  MessageSquare,
  BookOpen,
} from "lucide-react";
import VocabularyManagement from "../components/admin/VocabularyManagement";
import AdminFeedbackPanel from "../components/feedback/AdminFeedbackPanel";
import DashboardTab from "../components/admin/DashboardTab";
import UsersTab from "../components/admin/UsersTab";
import TestsTab from "../components/admin/TestsTab";
import QuestionsTab from "../components/admin/QuestionsTab";
import VocabularyTab from "../components/admin/VocabularyTab";
import FeedbackTab from "../components/admin/FeedbackTab";
import TestActionsTab from "../components/admin/TestActionsTab";

type Tab = "dashboard" | "users" | "tests" | "questions" | "vocabulary" | "test-actions" | "feedback";

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
  const [selectedYearFilter, setSelectedYearFilter] = useState<string>("all");
  const [currentUsersPage, setCurrentUsersPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const usersPerPage = 10;
  
  // AI Generation States - track each action type independently
  const [processingActions, setProcessingActions] = useState({
    explain: false,
    transcripts: false,
    passages: false,
  });
  const [selectedTestForAction, setSelectedTestForAction] = useState<number | null>(null);
  const [backgroundTasks, setBackgroundTasks] = useState<{[key: string]: boolean}>({});
  const [notifications, setNotifications] = useState<Array<{id: string; message: string; type: 'info' | 'success' | 'error'}>>([]);

  // Check admin access
  useEffect(() => {
    if (user && user.role !== "Admin") {
      router.push("/");
    }
  }, [user, router]);

  // Notification helper
  const addNotification = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, message, type }]);
    // Auto-remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  // Extract year from test title (e.g., "ETS 2024 Test 1" -> "2024")
  const extractYear = (title: string): string | null => {
    const match = title.match(/(\d{4})/);
    return match ? match[1] : null;
  };

  // Get grouped tests by year with counts
  const getYearFilters = () => {
    const yearMap: { [key: string]: number } = { all: tests.length };
    
    tests.forEach(test => {
      const year = extractYear(test.title);
      if (year) {
        yearMap[year] = (yearMap[year] || 0) + 1;
      }
    });

    return Object.entries(yearMap)
      .sort(([keyA], [keyB]) => {
        if (keyA === 'all') return -1;
        return parseInt(keyB) - parseInt(keyA);
      })
      .map(([year, count]) => ({ year, count }));
  };

  // Fire-and-forget API call for background processing with polling
  const triggerBackgroundTask = (testId: number, type: string, partNumber?: number) => {
    const taskKey = `${type}-${testId}-${partNumber || 'all'}`;
    setBackgroundTasks(prev => ({ ...prev, [taskKey]: true }));

    let taskId: string = "";

    // Fire the request without awaiting it
    (async () => {
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

        if (response && response.taskId) {
          taskId = response.taskId;
          
          // Start polling for task completion
          const pollInterval = setInterval(async () => {
            try {
              const status = await adminService.getTaskStatus(taskId);
              
              if (status.isComplete) {
                clearInterval(pollInterval);
                
                // Task completed - update notification
                const completedMessage = 
                  type === "explain" ? `✅ Hoàn thành! ${status.completedItems} câu hỏi có giải thích` :
                  type === "translate-transcripts" ? `✅ Hoàn thành! ${status.completedItems} Transcript đã dịch` :
                  `✅ Hoàn thành! ${status.completedItems} Passage đã dịch`;
                
                addNotification(completedMessage, 'success');
                
                // Refresh the data after completion
                await loadTests();
                if (selectedTestId) {
                  await loadQuestions(selectedTestId);
                }
                
                setBackgroundTasks(prev => ({ ...prev, [taskKey]: false }));
              }
            } catch (error) {
              console.error("Error polling task status:", error);
            }
          }, 2000); // Poll every 2 seconds
        } else {
          addNotification(response?.message || "Started processing", 'info');
        }
      } catch (error: any) {
        console.error("Background task error:", error);
        addNotification(`❌ Lỗi: ${error.message || "Vui lòng thử lại."}`, 'error');
        setBackgroundTasks(prev => ({ ...prev, [taskKey]: false }));
      }
    })();
  };

  // Handler functions for AI generation - FIRE AND FORGET
  const handleGenerateAction = (testId: number, type: string, partNumber?: number) => {
    addNotification(`🚀 Bắt đầu xử lý...`, 'info');
    triggerBackgroundTask(testId, type, partNumber);
  };

  const openActionTab = (testId: number) => {
    setSelectedTestForAction(testId);
    setActiveTab("test-actions");
  };

  const handleQuickGenerate = (testId: number, type: "explain" | "translate-transcripts" | "translate-passages") => {
    addNotification(`🚀 Bắt đầu xử lý...`, 'info');
    triggerBackgroundTask(testId, type);
  };

  const loadDashboard = useCallback(async () => {
    try {
      const stats = await adminService.getDashboardStats();
      setStats(stats);
    } catch (error) {
      console.error("Failed to load dashboard:", error);
    }
  }, []);

  const loadUsers = useCallback(async (page: number = 1) => {
    try {
      const response = await adminService.getUsers(page, usersPerPage);
      setUsers(response.items);
      setTotalUsers(response.total);
    } catch (error) {
      console.error("Failed to load users:", error);
    }
  }, [usersPerPage]);

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
          await loadUsers(currentUsersPage);
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
  }, [activeTab, currentUsersPage, selectedTestId, loadDashboard, loadUsers, loadTests, loadQuestions]);

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

  // Reset to page 1 when search term changes
  useEffect(() => {
    setCurrentUsersPage(1);
  }, [searchTerm]);

  const filteredTests = tests.filter((t) => {
    // Filter by search term
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by year
    if (selectedYearFilter === "all") {
      return matchesSearch;
    } else {
      const testYear = extractYear(t.title);
      return matchesSearch && testYear === selectedYearFilter;
    }
  });

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
            { key: "feedback", label: "Quản lý Feedback", icon: MessageSquare },
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
        {/* Notifications */}
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 space-y-2 z-50 max-w-md">
          {notifications.map(notif => (
            <div
              key={notif.id}
              className={`p-4 rounded-lg shadow-lg animate-pulse ${
                notif.type === 'success' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' :
                notif.type === 'error' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200' :
                'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
              }`}
            >
              {notif.message}
            </div>
          ))}
        </div>

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
              {activeTab === "feedback" && (
                <>
                  <MessageSquare size={28} />
                  Quản lý Feedback
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
            {activeTab === "dashboard" && <DashboardTab stats={stats} />}

            {/* Users Tab */}
            {activeTab === "users" && (
              <UsersTab
                filteredUsers={filteredUsers}
                onToggleStatus={handleToggleUserStatus}
                currentPage={currentUsersPage}
                onPageChange={setCurrentUsersPage}
                totalUsers={totalUsers}
                usersPerPage={usersPerPage}
              />
            )}

            {/* Tests Tab */}
            {activeTab === "tests" && (
              <TestsTab
                filteredTests={filteredTests}
                getYearFilters={getYearFilters}
                selectedYearFilter={selectedYearFilter}
                onYearFilterChange={setSelectedYearFilter}
                processingActions={processingActions}
                onViewQuestions={(testId) => {
                  setSelectedTestId(testId);
                  setActiveTab("questions");
                }}
                onOpenActionTab={openActionTab}
                onDeleteTest={handleDeleteTest}
              />
            )}

            {/* Questions Tab */}
            {activeTab === "questions" && (
              <QuestionsTab
                selectedTestId={selectedTestId}
                tests={tests}
                questions={questions}
                onSelectTest={loadQuestions}
                onBack={() => setSelectedTestId(null)}
              />
            )}

            {/* Vocabulary Tab */}
            {activeTab === "vocabulary" && <VocabularyTab />}

            {/* Feedback Tab */}
            {activeTab === "feedback" && <FeedbackTab />}

            {/* Test Actions Tab */}
            {activeTab === "test-actions" && (
              <TestActionsTab
                tests={tests}
                selectedTestForAction={selectedTestForAction}
                processingActions={processingActions}
                onBack={() => {
                  setActiveTab("tests");
                  setSelectedTestForAction(null);
                }}
                onGenerateAction={handleGenerateAction}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
