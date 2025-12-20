"use client";

import { Comment } from "@/app/types";
import { CommentItem } from "./CommentItem";

interface CommentListProps {
  comments: Comment[];
  testId: number;
  onCommentUpdated: (updatedComment: Comment) => void;
  onCommentDeleted: (commentId: number) => void;
  onReplyAdded: (newReply: Comment) => void;
}

export function CommentList({ 
    comments, 
    testId,
    onCommentUpdated,
    onCommentDeleted,
    onReplyAdded,
}: CommentListProps) {

  if (!comments || comments.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500">
        <p className="text-lg">💬 Chưa có bình luận nào</p>
        <p className="mt-1">Hãy là người đầu tiên bình luận!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          testId={testId}
          onCommentUpdated={onCommentUpdated}
          onCommentDeleted={onCommentDeleted}
          onReplyAdded={onReplyAdded}
        />
      ))}
    </div>
  );
}
