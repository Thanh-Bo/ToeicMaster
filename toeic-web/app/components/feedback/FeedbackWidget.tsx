"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import FeedbackModal from "./FeedbackModal";

export default function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 rounded-full bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
        title="Gửi ý kiến"
      >
        <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </button>

      {/* Modal Feedback */}
      {isOpen && <FeedbackModal onClose={() => setIsOpen(false)} />}
    </>
  );
}
