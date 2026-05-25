"use client";

import Link from "next/link";
import dynamic from "next/dynamic";

const FeedbackSection = dynamic(
  () => import("../feedback/FeedbackSection").then((mod) => mod.default),
  {
    ssr: false,
  },
);

interface FooterLink {
  label: string;
  href: string;
}

interface Props {
  /** Các links footer */
  links?: FooterLink[];
  /** Text copyright */
  copyright?: string;
}

const defaultLinks: FooterLink[] = [
  { label: "Điều khoản", href: "/terms" },
  { label: "Bảo mật", href: "/privacy" },
  { label: "Liên hệ", href: "/contact" },
];

export default function Footer({
  links = defaultLinks,
  copyright = `© ${new Date().getFullYear()} TOEIC Masters. All rights reserved.`,
}: Props) {
  return (
    <footer className="bg-white/80 dark:bg-zinc-950/60 backdrop-blur-md text-gray-700 dark:text-gray-400 py-10 mt-16 border-t border-gray-250/30 dark:border-zinc-900/60 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-xl font-black text-blue-600 dark:text-blue-400">
              TOEIC Masters
            </span>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 text-sm font-semibold"
              >
                {link.label}
              </Link>
            ))}
            <div className="border-l border-zinc-200 dark:border-zinc-800 pl-6 h-5 flex items-center">
              <FeedbackSection />
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-zinc-150/40 dark:border-zinc-900/50 mt-8 pt-8 text-center text-xs sm:text-sm text-zinc-500 dark:text-zinc-550 font-medium">
          {copyright}
        </div>
      </div>
    </footer>
  );
}
