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
    <div className={cn("flex items-start space-x-3", isReply && "mt-4")}>
      <UserAvatar user={comment} className={isReply ? "h-8 w-8" : "h-10 w-10"} />
      
      <div className="flex-1">
        {!isEditing ? (
          <>
            <div className="rounded-lg bg-gray-100 p-3">
              <div className="flex items-baseline justify-between">
                <div className="flex items-baseline">
                    <span className="font-semibold text-gray-800">{comment.userName}</span>
                    <span className="ml-3 text-xs text-gray-500">
                        {formatRelativeTime(comment.createdAt)}
                        {comment.updatedAt && " (đã chỉnh sửa)"}
                    </span>
                </div>
                 {isOwner && !isDeleting && (
                  <div className="relative" ref={menuRef}>
                    <button onClick={() => setShowMenu(!showMenu)} className="rounded-full p-1 text-gray-500 hover:bg-gray-200">
                      <MoreVertical size={16} />
                    </button>
                    {showMenu && (
                      <div className="absolute right-0 z-10 mt-1 w-32 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                        <button onClick={() => { setIsEditing(true); setShowMenu(false); }} className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          <Edit size={14} className="mr-2" /> Chỉnh sửa
                        </button>
                        <button onClick={handleDelete} className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                          <Trash2 size={14} className="mr-2" /> Xóa
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <p className="mt-1 text-sm text-gray-800 whitespace-pre-wrap">{comment.content}</p>
            </div>

            {/* Actions */}
            <div className="mt-1 flex items-center space-x-4 text-xs font-medium text-gray-500">
              <button onClick={handleLike} className={cn("inline-flex items-center hover:text-blue-600", isLiked && "text-blue-600")}>
                <ThumbsUp size={14} className={cn("mr-1", isLiked && "fill-current")} /> {likeCount}
              </button>
              {!isReply && (
                <button onClick={() => setIsReplying(!isReplying)} className="hover:text-gray-900">
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
          <div className="mt-3 space-y-3 border-l-2 border-gray-200 pl-4">
            {comment.replies.map(reply => (
              <CommentItem
                key={reply.id}
                comment={reply}
                testId={testId}
                onCommentUpdated={onCommentUpdated} // This should probably be handled at the top level
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
