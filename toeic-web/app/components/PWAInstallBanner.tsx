"use client";

import { useEffect, useState } from "react";
import { Smartphone, Download, X, Apple, Chrome } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PWAInstallBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isMobile, setIsMobile] = useState(true);
  const [os, setOs] = useState<"ios" | "android" | "other">("other");

  useEffect(() => {
    // Detect OS
    const ua = navigator.userAgent;
    const mobile = /Android|iPhone|iPad|iPod/i.test(ua);
    setIsMobile(mobile);

    if (/iPhone|iPad|iPod/.test(ua)) {
      setOs("ios");
    } else if (/Android/.test(ua)) {
      setOs("android");
    }

    // Check if already in standalone mode
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches || 
                         (navigator as any).standalone;
    if (isStandalone) return;

    // Listen for install prompt (Android/Chrome)
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };
    window.addEventListener("beforeinstallprompt", handler);

    // Always show banner after a delay (except if already installed)
    const timer = setTimeout(() => setShowBanner(true), 3000);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setShowBanner(false);
      }
      setDeferredPrompt(null);
    } else {
      // iOS: show manual guide
      setShowGuide(true);
    }
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Banner */}
      <div className="fixed bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom duration-300">
        <div className="mx-auto max-w-lg rounded-2xl border border-zinc-200 bg-white/80 backdrop-blur-md p-4 shadow-lg dark:border-zinc-800 dark:bg-zinc-900/80">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">
              <Smartphone className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-extrabold text-zinc-900 dark:text-white">
                Học TOEIC mọi lúc, không cần mở trình duyệt
              </p>
              <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                Cài TOEIC Masters vào màn hình chính để truy cập nhanh hơn.
              </p>
              <button
                onClick={handleInstall}
                className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-zinc-900 px-4 py-2 text-xs font-bold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                <Download className="h-3.5 w-3.5" />
                {deferredPrompt ? "Cài đặt ngay" : "Hướng dẫn cài đặt"}
              </button>
            </div>
            <button
              onClick={() => setShowBanner(false)}
              className="shrink-0 rounded-lg p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Guide Modal */}
      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowGuide(false)}
          />
          <div className="relative z-10 mx-4 mb-4 w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 sm:mb-0 animate-in slide-in-from-bottom duration-200">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-zinc-900 dark:text-white">
                Hướng dẫn cài đặt
              </h3>
              <button
                onClick={() => setShowGuide(false)}
                className="rounded-lg p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* iOS Guide */}
            <div className="mb-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                  <Apple className="h-4 w-4" />
                </div>
                <p className="text-sm font-bold text-zinc-900 dark:text-white">Trên iOS (Safari)</p>
              </div>
              <ol className="ml-11 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                <li>1. Mở trang bằng <strong>Safari</strong></li>
                <li>2. Nhấn nút <strong>Chia sẻ</strong> ở thanh dưới</li>
                <li>3. Chọn <strong>"Thêm vào Màn hình chính"</strong></li>
                <li>4. Nhấn <strong>Thêm</strong></li>
              </ol>
            </div>

            {/* Divider */}
            <div className="mb-6 border-t border-zinc-200 dark:border-zinc-800" />

            {/* Android Guide */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                  <Chrome className="h-4 w-4" />
                </div>
                <p className="text-sm font-bold text-zinc-900 dark:text-white">Trên Android (Chrome)</p>
              </div>
              <ol className="ml-11 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                <li>1. Nhấn <strong>⋮</strong> (3 chấm) góc trên phải</li>
                <li>2. Chọn <strong>"Cài đặt ứng dụng"</strong></li>
                <li>3. Nhấn <strong>Cài đặt</strong></li>
              </ol>
            </div>

            <button
              onClick={() => setShowGuide(false)}
              className="mt-6 w-full rounded-xl bg-zinc-900 py-3 text-sm font-bold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Đã hiểu
            </button>
          </div>
        </div>
      )}
    </>
  );
}
