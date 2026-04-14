"use client";

import { useState } from "react";
import Link from "next/link";

import { useAuth } from "../../contexts/AuthContext";
import dynamic from "next/dynamic";
import {
  BookOpen,
  Mic,
  Eye,
  FileText,
  MoreHorizontal,
  ShoppingBag,
  Bell,
  LogOut,
  GraduationCap,
  Crown,
  MessageCircle,
} from "lucide-react";

import { useRouter } from "next/navigation";

// Load ThemeToggle dynamically with SSR disabled - to avoid ThemeProvider error on server
const ThemeToggle = dynamic(
  () => import("../common/ThemeToggle").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <div className="w-9 h-9" />, // Placeholder while loading
  },
);

// Load FeedbackModal dynamically
const FeedbackModal = dynamic(
  () => import("../feedback/FeedbackModal").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => null,
  },
);

interface NavLink {
  href: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface Props {
  /** Logo text - mặc định "TOEIC Master" */
  logoText?: string;
  /** Các links hiển thị trên nav */
  navLinks?: NavLink[];
  /** Có hiển thị các quick links mặc định không */
  showDefaultLinks?: boolean;
}

const defaultNavLinks: NavLink[] = [
  // { href: "/grammar", label: "Grammar", icon: BookOpen },
  // { href: "/vocabulary", label: "Vocab", icon: BookOpen },
  // { href: "/listening", label: "Listening", icon: Mic },
  // { href: "/reading", label: "Reading", icon: Eye },
  // { href: "/practice", label: "Test", icon: FileText },
];

export default function PageHeader({
  logoText = "TOEIC Master",
  navLinks,
  showDefaultLinks = true,
}: Props) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleUpgradeClick = () => {
    router.push("/subscription");
  };

  const links = navLinks || (showDefaultLinks ? defaultNavLinks : []);

  const handleLogout = () => {
    logout();
    setShowLogoutConfirm(false);
  };

  return (
    <header className="bg-white dark:bg-zinc-900  text-gray-700 dark:text-white shadow-sm dark:shadow-md sticky top-0 z-50 border-b  border-gray-200 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center gap-8">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-3 flex-shrink-0">
          <div className="size-15 flex items-center justify-center">
            <img src="/logo.ico" alt="TOEIC Master Logo" />
          </div>
          <span className="text-lg font-bold hidden sm:block">{logoText}</span>
        </Link>

        {/* Middle: Navigation */}
        <nav className="flex items-center gap-8">
          {/* Nav Links with Icons */}
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-2  transition font-medium text-sm hidden md:flex"
            >
              {link.icon && <link.icon className="w-5 h-5" />}
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>

        {/* Right: Actions */}
        {user ? (
          <div className="flex items-center gap-8 flex-shrink-0">
            {/* <button
              onClick={handleUpgradeClick}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-all text-sm"
            >
              <Crown size={16} />
              Nâng cấp PRO
            </button> */}
            <ThemeToggle />

            {/* Feedback Button */}
            <button
              onClick={() => setShowFeedback(true)}
              className="text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition"
              title="Gửi ý kiến"
            >
              <MessageCircle className="w-5 h-5" />
            </button>
            {showFeedback && <FeedbackModal onClose={() => setShowFeedback(false)} />}

            {/* Notification Bell */}

            {/* User Profile */}
            <Link
              href="/profile"
              className="flex items-center justify-center w-9 h-9 rounded-full text-white dark:text-gray-900 font-bold text-sm hover:opacity-80 transition overflow-hidden"
            >
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.fullName}
                  className="w-9 h-9 rounded-full object-cover"
                />
              ) : (
                <div className="w-9 h-9 bg-gray-900 dark:bg-white rounded-full flex items-center justify-center">
                  {user.fullName?.charAt(0)?.toUpperCase() || "U"}
                </div>
              )}
            </Link>

            {/* Logout Button */}
            <div className="relative">
              <button
                onClick={() => setShowLogoutConfirm((v) => !v)}
                className="text-gray-400 hover:text-red-400 transition"
                title="Đăng xuất"
              >
                <LogOut className="w-5 h-5" />
              </button>
              {showLogoutConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                  <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 max-w-sm mx-4 border border-gray-200 dark:border-zinc-700">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      Đăng xuất
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Bạn có chắc chắn muốn đăng xuất?
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowLogoutConfirm(false)}
                        className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-zinc-800 transition"
                      >
                        Hủy
                      </button>
                      <button
                        onClick={() => {
                          setShowLogoutConfirm(false);
                          logout();
                        }}
                        className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 dark:hover:bg-red-600 transition"
                      >
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 flex-shrink-0">
            <ThemeToggle />
            <Link
              href="/login"
              className="border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-lg transition font-medium text-sm px-3 py-2"
            >
              Đăng nhập
            </Link>
            <Link
              href="/register"
              className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-2 rounded-lg hover:opacity-90 transition font-medium text-sm"
            >
              Đăng ký
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
