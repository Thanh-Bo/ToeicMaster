"use client";

import { useState, useEffect, useRef } from "react";
import { Comment } from "@/app/types";
import { useAuth } from "@/app/contexts/AuthContext";
import commentService from "@/app/services/commentService";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/lib/date";

import { UserAvatar } from "./UserAvatar";
import { CommentForm } from "./CommentForm";
import { ThumbsUp, MessageSquare, MoreVertical, Trash2, Edit, LoaderCircle } from "lucide-react";

interface CommentItemProps {
  comment: Comment;
  testId: number;
  onCommentUpdated: (updatedComment: Comment) => void;
  onCommentDeleted: (commentId: number) => void;
  onReplyAdded: (newReply: Comment) => void;
  isReply?: boolean;
}

export function CommentItem({
  comment,
  testId,
  onCommentUpdated,
  onCommentDeleted,
  onReplyAdded,
  isReply = false,
}: CommentItemProps) {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(comment.isLikedByCurrentUser);
  const [likeCount, setLikeCount] = useState(comment.likeCount);
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isOwner = user?.id === comment.userId;

  useEffect(() => {
    // Close menu when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLike = async () => {
    if (!user) return; // Or redirect to login

    const originalLiked = isLiked;
    const originalLikeCount = likeCount;

    // Optimistic update
    setIsLiked(!originalLiked);
    setLikeCount(originalLiked ? originalLikeCount - 1 : originalLikeCount + 1);

    try {
      const response = originalLiked
        ? await commentService.unlikeComment(testId, comment.id)
        : await commentService.likeComment(testId, comment.id);
      
      // Sync with server state
      setLikeCount(response.likeCount);
    } catch (error) {
      console.error("Failed to update like status", error);
      // Revert on error
      setIsLiked(originalLiked);
      setLikeCount(originalLikeCount);
    }
  };

  const handleDelete = async () => {
    if (!isOwner || isDeleting) return;

    if (window.confirm("Bạn có chắc muốn xóa bình luận này? Hành động này không thể hoàn tác.")) {
      setIsDeleting(true);
      try {
        await commentService.deleteComment(testId, comment.id);
        onCommentDeleted(comment.id);
      } catch (error) {
        console.error("Failed to delete comment", error);
        alert("Xóa bình luận thất bại. Vui lòng thử lại.");
        setIsDeleting(false);
      }
    }
    setShowMenu(false);
  };
  
  const handleReplySubmit = async (content: string) => {
    const payload = { content, parentCommentId: comment.id };
    const newReply = await commentService.createComment(testId, payload);
    onReplyAdded(newReply);
    setIsReplying(false);
  };

  const handleUpdateSubmit = async (content: string) => {
    const updatedComment = await commentService.updateComment(testId, comment.id, { content });
    // The backend only returns a message, so we create a new comment object
    const newCommentData = { ...comment, content, updatedAt: new Date().toISOString() };
    onCommentUpdated(newCommentData);
    setIsEditing(false);
  };

  return (
    <div className={cn("flex items-start gap-3", isReply && "mt-3")}>
      <UserAvatar user={comment} className={isReply ? "h-8 w-8" : "h-10 w-10"} />
      
      <div className="flex-1 min-w-0">
        {!isEditing ? (
          <>
            <div className="rounded-xl bg-gray-50 dark:bg-zinc-700/50 border border-gray-200 dark:border-zinc-600 p-3 hover:border-gray-300 dark:hover:border-zinc-500 transition-colors">
              <div className="flex items-baseline justify-between gap-2">
                <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="font-semibold text-gray-900 dark:text-white text-sm">{comment.userName}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {formatRelativeTime(comment.createdAt)}
                        {comment.updatedAt && <span className="ml-1">(đã chỉnh sửa)</span>}
                    </span>
                </div>
                 {isOwner && !isDeleting && (
                  <div className="relative" ref={menuRef}>
                    <button onClick={() => setShowMenu(!showMenu)} className="rounded-full p-1.5 text-gray-400 dark:text-gray-500 hover:bg-gray-200 dark:hover:bg-zinc-600 transition-colors flex-shrink-0">
                      <MoreVertical size={16} />
                    </button>
                    {showMenu && (
                      <div className="absolute right-0 top-full z-20 mt-2 w-40 rounded-lg bg-white dark:bg-zinc-800 py-1 shadow-lg border border-gray-200 dark:border-zinc-700 animate-fadeIn">
                        <button onClick={() => { setIsEditing(true); setShowMenu(false); }} className="flex w-full items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors">
                          <Edit size={14} className="mr-2.5" /> Chỉnh sửa
                        </button>
                        <button onClick={handleDelete} className="flex w-full items-center px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                          <Trash2 size={14} className="mr-2.5" /> Xóa
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <p className="mt-2 text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">{comment.content}</p>
            </div>

            {/* Actions */}
            <div className="mt-2 flex items-center gap-4 text-xs font-medium text-gray-600 dark:text-gray-400">
              <button onClick={handleLike} className={cn("inline-flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors", isLiked && "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30")}>
                <ThumbsUp size={14} className={cn(isLiked && "fill-current")} /> 
                <span>{likeCount}</span>
              </button>
              {!isReply && (
                <button onClick={() => setIsReplying(!isReplying)} className="px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700 hover:text-gray-900 dark:hover:text-gray-200 transition-colors">
                  Trả lời
                </button>
              )}
              {isDeleting && <LoaderCircle size={14} className="animate-spin" />}
            </div>
          </>
        ) : (
          <CommentForm
            onSubmit={handleUpdateSubmit}
            initialContent={comment.content}
            submitLabel="Lưu thay đổi"
            onCancel={() => setIsEditing(false)}
            autoFocus
          />
        )}
        
        {isReplying && !isEditing && (
          <div className="mt-3">
            <CommentForm
                onSubmit={handleReplySubmit}
                placeholder="Viết câu trả lời của bạn..."
                submitLabel="Gửi trả lời"
                onCancel={() => setIsReplying(false)}
                autoFocus
            />
          </div>
        )}
        
        {/* Render Replies */}
        {!isReply && comment.replies && comment.replies.length > 0 && (
          <div className="mt-3 space-y-3 border-l-2 border-gray-300 dark:border-zinc-600 pl-4">
            {comment.replies.map(reply => (
              <CommentItem
                key={reply.id}
                comment={reply}
                testId={testId}
                onCommentUpdated={onCommentUpdated}
                onCommentDeleted={onCommentDeleted}
                onReplyAdded={onReplyAdded}
                isReply
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
