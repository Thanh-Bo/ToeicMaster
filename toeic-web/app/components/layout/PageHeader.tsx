"use client";

import Link from "next/link";
import { useAuth } from "../../contexts/AuthContext";

interface NavLink {
  href: string;
  label: string;
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
  { href: "/", label: "Đề thi" },
  { href: "/practice", label: "Luyện tập" },
  { href: "/vocabulary", label: "Từ vựng" },
  { href: "/bookmarks", label: "Đánh dấu" },
  { href: "/statistics", label: "Thống kê" },
  { href: "/leaderboard", label: "Xếp hạng" },
  { href: "/history", label: "Lịch sử" },
];

export default function PageHeader({
  logoText = "TOEIC Master",
  navLinks,
  showDefaultLinks = true,
}: Props) {
  const { user, logout } = useAuth();

  const links = navLinks || (showDefaultLinks ? defaultNavLinks : []);

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-gray-800 hidden sm:block">
            {logoText}
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-4">
          {/* Nav Links */}
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-600 hover:text-blue-600 font-medium text-sm hidden md:block"
            >
              {link.label}
            </Link>
          ))}

          {/* User Section */}
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/profile"
                className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100 transition"
              >
                <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {user.fullName?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <span className="font-medium text-gray-700 text-sm hidden sm:block">
                  {user.fullName}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-500 hover:text-red-600 transition"
                title="Đăng xuất"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="text-gray-600 hover:text-blue-600 font-medium text-sm px-3 py-2"
              >
                Đăng nhập
              </Link>
              <Link
                href="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium text-sm shadow-md shadow-blue-200"
              >
                Đăng ký miễn phí
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
