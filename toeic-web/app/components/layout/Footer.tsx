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
  copyright = `© ${new Date().getFullYear()} TOEIC Master. All rights reserved.`,
}: Props) {
  return (
    <footer className="bg-white dark:bg-zinc-900 text-gray-700 dark:text-gray-400 py-12 mt-12 border-t border-gray-200 dark:border-zinc-800">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              TOEIC Master
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-gray-200 transition text-sm"
              >
                {link.label}
              </Link>
            ))}
            <div className="border-gray-200 dark:border-zinc-700">
              <FeedbackSection />
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 dark:border-zinc-700 mt-8 pt-8 text-center text-sm text-gray-600 dark:text-gray-500">
          {copyright}
        </div>
      </div>
    </footer>
  );
}
