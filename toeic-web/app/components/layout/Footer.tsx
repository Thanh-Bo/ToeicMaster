import Link from "next/link";

interface Props {
  copyright?: string;
  className?: string;
  links?: { label: string; href: string }[];
}

const navLinks = [
  { label: "Trang chủ", href: "/" },
  { label: "Luyện đề", href: "/tests" },
  { label: "Luyện đọc", href: "/reading" },
  { label: "Từ vựng", href: "/vocabulary" },
  { label: "Ngữ pháp", href: "/grammar" },
];

export default function Footer({
  copyright = `© ${new Date().getFullYear()} TOEIC Masters. All rights reserved.`,
  className = "mt-16",
  links,
}: Props) {
  const displayLinks = links || navLinks;
  return (
    <footer className={`bg-white/80 dark:bg-zinc-950/60 backdrop-blur-md text-gray-700 dark:text-gray-400 py-12 border-t border-slate-200 dark:border-zinc-900 transition-colors duration-300 ${className}`}>
      <div className="max-w-6xl mx-auto px-6">
        {/* 3-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {/* Cột 1: Thương hiệu */}
          <div>
            <h3 className="text-lg font-black text-blue-600 dark:text-blue-400 mb-3">
              TOEIC Masters
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Luyện TOEIC theo từng phần: Ngữ pháp, Từ vựng, Luyện đọc và Luyện đề.
            </p>
          </div>

          {/* Cột 2: Liên kết */}
          <div>
            <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider mb-3">
              Liên kết
            </h3>
            <ul className="space-y-2">
              {displayLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cột 3: Liên hệ & Góp ý */}
          <div className="sm:col-span-2 md:col-span-1">
            <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider mb-3">
              Liên hệ & Góp ý
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-1">
              Bạn phát hiện lỗi bài tập, lỗi đáp án hoặc muốn góp ý tính năng mới?
            </p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
              Hãy liên hệ TOEIC Masters qua Email hoặc Fanpage.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-3 mb-4">
              <a
                href="mailto:support.toeicmasters@gmail.com"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 text-sm font-semibold"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Gửi Email
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61590290857712&locale=vi_VN"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0866FF] text-white hover:bg-[#0760e0] transition-colors duration-200 text-sm font-semibold"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Nhắn Fanpage
              </a>
            </div>

            <p className="text-xs text-zinc-500 dark:text-zinc-500">
              support.toeicmasters@gmail.com
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-slate-200 dark:border-zinc-900 mt-10 pt-8 text-center text-xs sm:text-sm text-zinc-500 dark:text-zinc-500 font-medium">
          {copyright}
        </div>
      </div>
    </footer>
  );
}
