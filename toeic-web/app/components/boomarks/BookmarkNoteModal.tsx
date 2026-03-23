// app/components/BookmarkNoteModal.tsx
"use client";

import { useState, useEffect, useRef } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: string) => void;
  defaultNote: string; // Nội dung mặc định (Smart Default)
}

export default function BookmarkNoteModal({ isOpen, onClose, onSave, defaultNote }: Props) {
  const [note, setNote] = useState(defaultNote);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Mỗi khi mở modal, reset note về defaultNote
  useEffect(() => {
    if (isOpen) {
      setNote(defaultNote);
      // Auto focus vào ô nhập để gõ được luôn
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, defaultNote]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fadeIn">
      <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-xl w-full max-w-sm p-6 transform transition-all scale-100">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">📝 Thêm ghi chú</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Lưu lại để ôn tập sau này.</p>
        
        <textarea
          ref={inputRef}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full border border-gray-300 dark:border-zinc-600 rounded-lg p-3 text-sm dark:bg-zinc-700  text-gray-500 dark:text-gray-300 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none mb-4 min-h-[80px]"
          placeholder="Nhập ghi chú của bạn..."
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg transition"
          >
            Hủy
          </button>
          <button
            onClick={() => onSave(note)}
            className="px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 rounded-lg shadow-md transition"
          >
            Lưu Bookmark
          </button>
        </div>
      </div>
    </div>
  );
}