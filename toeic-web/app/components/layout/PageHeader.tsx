"use client";

import Link from "next/link";

import { useAuth } from "../../contexts/AuthContext";
import dynamic from "next/dynamic";
import { BookOpen, Mic, Eye, FileText, MoreHorizontal, ShoppingBag, Bell, LogOut, GraduationCap, Crown } from "lucide-react";

// Load ThemeToggle dynamically with SSR disabled - to avoid ThemeProvider error on server
const ThemeToggle = dynamic(
  () => import("../common/ThemeToggle").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <div className="w-9 h-9" />, // Placeholder while loading
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
  { href: "/grammar", label: "Grammar", icon: BookOpen },
  { href: "/vocabulary", label: "Vocab", icon: BookOpen },
  { href: "/listening", label: "Listening", icon: Mic },
  { href: "/reading", label: "Reading", icon: Eye },
  { href: "/practice", label: "Test", icon: FileText },
  
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
    <header className="bg-white dark:bg-zinc-900  text-gray-700 dark:text-white shadow-sm dark:shadow-md sticky top-0 z-50 border-b  border-gray-200 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center gap-8">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-3 flex-shrink-0">
          <div className="size-15 flex items-center justify-center">
            <img 
              src="/logo.ico" 
              alt="TOEIC Master Logo" 
             
            />
          </div>
          <span className="text-lg font-bold hidden sm:block">
            {logoText}
          </span>
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
          <div className="flex items-center gap-4 flex-shrink-0">
            

           
            <ThemeToggle />
            {/* Notification Bell */}
            

            {/* User Profile */}
            <Link
              href="/profile"
              className="flex items-center justify-center w-9 h-9 bg-linear-to-br from-blue-500 to-blue-700 rounded-full text-white font-bold text-sm hover:from-blue-600 hover:to-blue-800 transition"
            >
              {user.fullName?.charAt(0)?.toUpperCase() || "U"}
            </Link>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-red-400 transition"
              title="Đăng xuất"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3 flex-shrink-0">
            <ThemeToggle />
            <Link
              href="/login"
              className="bg-zinc-900 dark:bg-white text-gray-200 dark:text-gray-800 rounded-lg hover:text-blue-400 transition font-medium text-sm px-3 py-2"
            >
              Đăng nhập
            </Link>
            <Link
              href="/register"
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition font-medium text-sm shadow-lg shadow-blue-500/30"
            >
              Đăng ký
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
