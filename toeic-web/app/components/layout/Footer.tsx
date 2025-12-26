"use client";

import Link from "next/link";

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
    <footer className="bg-gray-900 text-gray-400 py-12 mt-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
           
            <span className="text-xl font-bold text-white">TOEIC Master</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-400 hover:text-white transition text-sm"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          {copyright}
        </div>
      </div>
    </footer>
  );
}
