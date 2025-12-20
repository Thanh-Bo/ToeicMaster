"use client";

import { useState, useEffect } from "react";
import { Comment, CommentListResponse } from "@/app/types";
import commentService from "@/app/services/commentService";
import { CommentForm } from "./CommentForm";
import { CommentList } from "./CommentList";
import LoadingSpinner from "../common/LoadingSpinner";
import AlertMessage from "../common/AlertMessage";

interface CommentSectionProps {
  testId: number;
  defaultSort?: 'newest' | 'mostLiked';
}

export function CommentSection({ testId, defaultSort = 'newest' }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInitialComments = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await commentService.getComments({ 
          testId, 
          page: 1,
          sortBy: defaultSort 
        });
        setComments(response.items);
        setPagination({
          page: response.page,
          totalPages: response.totalPages,
          total: response.total,
        });
      } catch (err) {
        console.error("Failed to fetch comments", err);
        setError("Không thể tải bình luận. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialComments();
  }, [testId]);

  const handleLoadMore = async () => {
    if (pagination.page >= pagination.totalPages || isLoadingMore) return;

    try {
        setIsLoadingMore(true);
        setError(null);
        const nextPage = pagination.page + 1;
        const response = await commentService.getComments({ testId, page: nextPage });
        setComments(prev => [...prev, ...response.items]);
        setPagination(prev => ({ ...prev, page: response.page }));
    } catch (err) {
        console.error("Failed to load more comments", err);
        setError("Không thể tải thêm bình luận. Vui lòng thử lại sau.");
    } finally {
        setIsLoadingMore(false);
    }
  };

  const addComment = async (content: string) => {
    try {
      setIsSubmitting(true);
      const newComment = await commentService.createComment(testId, { content });
      setComments(prev => [newComment, ...prev]);
      setPagination(prev => ({ ...prev, total: prev.total + 1 }));
    } catch (err) {
      console.error("Failed to post comment", err);
      alert("Gửi bình luận thất bại. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const updateCommentState = (updatedComment: Comment) => {
    setComments(prev => prev.map(c => c.id === updatedComment.id ? updatedComment : c));
  };

  const deleteCommentState = (commentId: number) => {
    setComments(prev => prev.filter(c => c.id !== commentId));
    setPagination(prev => ({ ...prev, total: prev.total - 1 }));
  };

  const addReplyState = (newReply: Comment) => {
      setComments(prevComments => 
        prevComments.map(comment => {
            if (comment.id === newReply.parentCommentId) {
                // Check if reply already exists to prevent duplicates from optimistic updates
                if (comment.replies.some(r => r.id === newReply.id)) {
                    return comment;
                }
                return {
                    ...comment,
                    replies: [...comment.replies, newReply]
                };
            }
            return comment;
        })
      );
  };

  return (
    <div className="mt-8 rounded-lg bg-white p-6 shadow-md">
      <h2 className="text-xl font-bold text-gray-800">
        📝 Thảo luận ({pagination.total})
      </h2>
      
      <div className="mt-6">
        <CommentForm onSubmit={addComment} isSubmitting={isSubmitting} />
      </div>

      <div className="mt-8">
        {isLoading ? (
          <LoadingSpinner />
        ) : error ? (
          <AlertMessage type="error" message={error} />
        ) : (
          <CommentList 
            comments={comments} 
            testId={testId}
            onCommentUpdated={updateCommentState}
            onCommentDeleted={deleteCommentState}
            onReplyAdded={addReplyState}
          />
        )}
      </div>
      
      {!isLoading && pagination.page < pagination.totalPages && (
        <div className="mt-8 text-center">
            <button
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="rounded-full bg-gray-100 px-6 py-2 font-semibold text-gray-700 hover:bg-gray-200 disabled:cursor-wait disabled:opacity-70"
            >
                {isLoadingMore ? "Đang tải..." : "Xem thêm bình luận"}
            </button>
        </div>
      )}
    </div>
  );
}
