/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowDown,
  Ellipsis,
  MessageSquareText,
  SendHorizontal,
  ThumbsUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import api from "@/lib/api";

// Types
interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    name: string | null;
  };
}

interface CommentSectionProps {
  postId: string;
  initialComments: Comment[];
}

const CommentSection = ({ postId, initialComments }: CommentSectionProps) => {
  // States - Tách loading states cho UX tốt hơn
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [isDeletingComment, setIsDeletingComment] = useState<string | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  // Format time - Đơn giản hóa
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60),
    );

    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return `${Math.floor(diffMinutes / 1440)}d ago`;
  };

  // Load comments - Dùng khi cần refresh
  const loadComments = useCallback(async () => {
    if (!postId) return;

    try {
      setIsLoadingComments(true);
      setError(null);
      const response = await api.get(`/posts/${postId}/comments`);
      setComments(response.data?.comments || []);
    } catch (err: any) {
      const message = err?.response?.data?.message || "Failed to load comments";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoadingComments(false);
    }
  }, [postId]);

  // Add comment - Loading riêng cho add action
  const handleAddComment = async () => {
    if (!newComment.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    try {
      setIsAddingComment(true);
      setError(null);

      const response = await api.post(`/posts/${postId}/comments`, {
        content: newComment.trim(),
      });

      // Thêm comment mới vào đầu list
      const newCommentData = {
        ...response.data?.comment,
        author: response.data?.comment?.author || { id: "temp", name: "You" },
      };

      setComments((prev) => [newCommentData, ...prev]);
      setNewComment("");
      toast.success("Comment added!");
    } catch (err: any) {
      const message = err?.response?.data?.message || "Failed to add comment";
      setError(message);
      toast.error(message);
    } finally {
      setIsAddingComment(false);
    }
  };

  // Delete comment - Loading riêng cho từng comment
  const handleDeleteComment = async (commentId: string) => {
    try {
      setIsDeletingComment(commentId); // Track comment đang delete
      await api.delete(`/comments/${commentId}`);
      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
      toast.success("Comment deleted!");
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Failed to delete comment";
      setError(message);
      toast.error(message);
    } finally {
      setIsDeletingComment(null);
    }
  };

  useEffect(() => {
    if (initialComments.length === 0) {
      loadComments();
    }
  }, [postId]);

  const displayComments = showAll ? comments : comments.slice(0, 5);

  const hasMoreComments = comments.length > 5;

  return (
    <div className="py-10 md:px-48 md:py-14">
      {/* Input Section */}
      <div className="mb-8">
        <div className="relative w-full">
          <Textarea
            placeholder="Enter your comment..."
            className="w-full resize-none border-none bg-zinc-200/70 p-5 text-lg italic focus-visible:border-0 focus-visible:ring-0"
            rows={5}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={isAddingComment}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                handleAddComment();
              }
            }}
          />
          <Button
            type="button"
            className="absolute bottom-5 right-5 rounded-full border border-[#E65808] bg-[#E65808] px-5 py-2 text-white transition-colors hover:bg-white hover:text-[#e66808]"
            onClick={handleAddComment}
            disabled={isAddingComment || !newComment.trim()} // Chỉ disable khi đang add
          >
            {isAddingComment ? "Sending..." : "Send"}
            <SendHorizontal className="ml-2 size-4" />
          </Button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-3 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}
      </div>

      {/* Comments Section */}
      <div className="mt-8 space-y-10">
        {/* Header */}
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">Comments</h2>
          <span className="rounded-full bg-[#E65808] px-3 py-1 text-xs font-medium text-white">
            {comments.length}
          </span>
        </div>

        {/* Loading comments */}
        {isLoadingComments && comments.length === 0 && (
          <div className="py-8 text-center text-gray-500">
            Loading comments...
          </div>
        )}

        {/* Empty state */}
        {!isLoadingComments && comments.length === 0 && (
          <div className="py-8 text-center text-gray-500">
            No comments yet. Be the first to comment!
          </div>
        )}

        {/* Comments List */}
        {displayComments.length > 0 && (
          <div className="space-y-8">
            {displayComments.map((comment, index) => (
              <div key={comment.id}>
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>
                      {comment.author?.name?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-3">
                    {/* Author & Time */}
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">
                        {comment.author?.name || "Anonymous"}
                      </h3>
                      <span className="text-sm text-gray-500">
                        {formatTime(comment.createdAt)}
                      </span>
                    </div>

                    {/* Content */}
                    <p className="whitespace-pre-line text-gray-800">
                      {comment.content}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center gap-8">
                      {/* Like */}
                      <button className="flex items-center gap-2 text-gray-600 transition-colors hover:text-[#E65808]">
                        <ThumbsUp className="size-4" />
                        <span>0</span>
                      </button>

                      {/* Reply */}
                      <button className="flex items-center gap-2 text-gray-600 transition-colors hover:text-[#E65808]">
                        <MessageSquareText className="size-4" />
                        <span>Reply</span>
                      </button>

                      {/* More actions */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={isDeletingComment === comment.id} // Chỉ disable comment đang delete
                            className="text-gray-600 hover:text-[#E65808]"
                          >
                            <Ellipsis className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          <DropdownMenuItem
                            onClick={() => handleDeleteComment(comment.id)}
                            className="text-red-600 focus:text-red-600"
                            disabled={isDeletingComment === comment.id}
                          >
                            {isDeletingComment === comment.id
                              ? "Deleting..."
                              : "Delete"}
                          </DropdownMenuItem>
                          <DropdownMenuItem disabled>Report</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>

                {/* Separator */}
                {index < displayComments.length - 1 && (
                  <Separator className="mt-6 bg-zinc-300" />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Show More/Less Button */}
        {hasMoreComments && (
          <div className="flex justify-center">
            <Button
              variant="ghost"
              className="flex items-center gap-2 text-[#E65808] transition-colors hover:text-[#d14907]"
              onClick={() => setShowAll(!showAll)}
              disabled={isLoadingComments} // Chỉ disable khi đang load comments
            >
              <span className="font-semibold">
                {showAll ? "Show less" : "Show more comments"}
              </span>
              {!showAll && <ArrowDown className="size-4" />}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
