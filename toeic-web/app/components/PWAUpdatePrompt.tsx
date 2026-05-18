"use client";

import { useEffect, useState } from "react";
import { RefreshCw, X } from "lucide-react";

export function PWAUpdatePrompt() {
  const [showUpdate, setShowUpdate] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    // Lắng nghe update từ Service Worker
    const handleUpdate = (event: MessageEvent) => {
      if (event.data.type === "NEW_VERSION_AVAILABLE") {
        setShowUpdate(true);
      }
    };

    navigator.serviceWorker.addEventListener("message", handleUpdate);

    // Kiểm tra update mỗi khi focus lại trang
    const checkForUpdates = () => {
      navigator.serviceWorker.ready.then((registration) => {
        registration.update();
      });
    };

    window.addEventListener("focus", checkForUpdates);

    return () => {
      navigator.serviceWorker.removeEventListener("message", handleUpdate);
      window.removeEventListener("focus", checkForUpdates);
    };
  }, []);

  const handleUpdate = () => {
    // Reload để áp dụng phiên bản mới
    window.location.reload();
  };

  const handleDismiss = () => {
    setShowUpdate(false);
  };

  if (!showUpdate) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-50">
      <div className="bg-blue-500 text-white rounded-xl shadow-lg p-4 flex items-center gap-3">
        <div className="flex-shrink-0">
          <RefreshCw className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm">Có phiên bản mới!</p>
          <p className="text-xs text-blue-100">Bấm cập nhật để sử dụng tính năng mới</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleUpdate}
            className="px-3 py-1.5 bg-white text-blue-500 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
          >
            Cập nhật
          </button>
          <button
            onClick={handleDismiss}
            className="p-1.5 hover:bg-blue-600 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
