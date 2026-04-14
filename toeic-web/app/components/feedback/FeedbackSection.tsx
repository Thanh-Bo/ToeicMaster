"use client";

import { useState } from "react";
import FeedbackModal from "./FeedbackModal";
import { MessageSquare } from "lucide-react";

export default function FeedbackSection() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex gap-1 items-center">
      <button
        onClick={() => setIsOpen(true)}
        className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm font-medium"
      >
        Gửi ý kiến
      </button>
      {isOpen && <FeedbackModal onClose={() => setIsOpen(false)} />}
    </div>
  );
}
