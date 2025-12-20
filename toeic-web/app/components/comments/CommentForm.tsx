"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { User, Send, LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils"; // Assuming you have a utility for classnames

// Let's create a dummy cn function if it doesn't exist
// and a utils file for it. For now, I'll define it here.
// const cn = (...inputs: any[]) => inputs.filter(Boolean).join(' ');

import { UserAvatar } from "./UserAvatar";

interface CommentFormProps {
  onSubmit: (content: string) => Promise<void>;
  isSubmitting?: boolean;
  placeholder?: string;
  submitLabel?: string;
  initialContent?: string;
  onCancel?: () => void;
  autoFocus?: boolean;
}


export function CommentForm({
  onSubmit,
  isSubmitting = false,
  placeholder = "Viết bình luận của bạn...",
  submitLabel = "Đăng bình luận",
  initialContent = "",
  onCancel,
  autoFocus = false,
}: CommentFormProps) {
  const { user, isAuthenticated } = useAuth();
  const [content, setContent] = useState(initialContent);
  const [isFocused, setIsFocused] = useState(autoFocus);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus) {
      textareaRef.current?.focus();
    }
  }, [autoFocus]);
  
  useEffect(() => {
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content, isFocused]);

  const handleFocus = () => setIsFocused(true);

  const handleCancel = () => {
    setContent("");
    setIsFocused(false);
    if (onCancel) {
      onCancel();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;

    await onSubmit(content);

    // Clear content only if it's not a reply form that gets unmounted
    if (!onCancel) {
      setContent("");
      setIsFocused(false);
    }
  };
  
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center rounded-lg border-2 border-dashed bg-gray-50 p-6 text-center text-gray-500">
        <a href="/login" className="font-semibold text-blue-600 hover:underline">
          Đăng nhập
        </a>
        &nbsp;để tham gia thảo luận.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full items-start space-x-4">
      <div className="flex-shrink-0">
        <UserAvatar user={user} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={handleFocus}
            placeholder={placeholder}
            className={cn(
              "w-full resize-none overflow-hidden rounded-lg border-gray-300 shadow-sm transition-all",
              "focus:border-blue-500 focus:ring-blue-500",
              !isFocused && "min-h-[42px] cursor-pointer",
              isFocused && "min-h-[80px]"
            )}
            rows={isFocused ? 3 : 1}
          />
        </div>
        {isFocused && (
          <div className="mt-2 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={!content.trim() || isSubmitting}
              className={cn(
                "inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm",
                "hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                "disabled:cursor-not-allowed disabled:bg-blue-300"
              )}
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  Đang gửi...
                </>
              ) : (
                submitLabel
              )}
            </button>
          </div>
        )}
      </div>
    </form>
  );
}
