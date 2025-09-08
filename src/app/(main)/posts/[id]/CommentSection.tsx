/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

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
import { useAuth } from "@/hooks/useAuth";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    name: string | null;
  };
  parentId: string | null;
}

interface CommentSectionProps {
  postId: string;
  initialComments: Comment[];
}

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

const CommentSection = ({
  postId,
  initialComments = [],
}: CommentSectionProps) => {
  const { user: currentUser } = useAuth();

  // Main data states - easy to understand what each one does
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");

  // Loading states - specific for each action
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [isDeletingComment, setIsDeletingComment] = useState<string | null>(
    null,
  );

  // UI states
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  // Reply states - grouped logically but separate for clarity
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isReplyingId, setIsReplyingId] = useState<string | null>(null);

  // Edit states - same pattern as reply
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [isSavingId, setIsSavingId] = useState<string | null>(null);

  // Load comments from API
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

  useEffect(() => {
    if (initialComments.length === 0) {
      loadComments();
    }
  }, [loadComments, initialComments.length]);

  // Check if user can edit/delete comment
  const canModify = (comment: Comment) => {
    return (
      !!currentUser?.value?.id && currentUser.value.id === comment.author?.id
    );
  };

  // Add new main comment
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
      const createdComment: Comment = response.data?.comment;
      setComments((prev) => [createdComment, ...prev]);
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

  // Toggle reply form for a comment
  const handleToggleReply = (parentId: string) => {
    setReplyText("");
    setReplyingTo((current) => (current === parentId ? null : parentId));
  };

  // Add reply to a comment
  const handleAddReply = async (parentId: string) => {
    const content = replyText.trim();
    if (!content) {
      toast.error("Please enter a reply");
      return;
    }

    try {
      setIsReplyingId(parentId);
      const response = await api.post(`/posts/${postId}/comments`, {
        content,
        parentId,
      });
      const createdReply: Comment = response.data?.comment;
      setComments((prev) => [...prev, createdReply]);
      setReplyText("");
      setReplyingTo(null);
      toast.success("Reply added!");
    } catch (err: any) {
      const message = err?.response?.data?.message || "Failed to add reply";
      setError(message);
      toast.error(message);
    } finally {
      setIsReplyingId(null);
    }
  };

  // Start editing a comment
  const handleStartEdit = (comment: Comment) => {
    setEditingId(comment.id);
    setEditText(comment.content);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  // Save edited comment
  const handleUpdateComment = async (id: string) => {
    const content = editText.trim();
    if (!content) {
      toast.error("Please enter content");
      return;
    }

    try {
      setIsSavingId(id);
      const response = await api.put(`/comments/${id}`, { content });
      const updatedComment: Comment = response.data?.comment;
      setComments((prev) =>
        prev.map((comment) => (comment.id === id ? updatedComment : comment)),
      );
      setEditingId(null);
      setEditText("");
      toast.success("Comment updated!");
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Failed to update comment";
      setError(message);
      toast.error(message);
    } finally {
      setIsSavingId(null);
    }
  };

  // Delete a comment and its replies
  const handleDeleteComment = async (commentId: string) => {
    try {
      setIsDeletingComment(commentId);
      await api.delete(`/comments/${commentId}`);
      setComments((prev) =>
        prev.filter(
          (comment) =>
            comment.id !== commentId && comment.parentId !== commentId,
        ),
      );
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

  // Get root comments (not replies)
  const rootComments = comments.filter((comment) => !comment.parentId);

  // Get replies for a specific comment
  const getReplies = (parentId: string) =>
    comments.filter((comment) => comment.parentId === parentId);

  // Comments to display (with show more/less)
  const displayComments = showAll ? rootComments : rootComments.slice(0, 5);
  const hasMoreComments = rootComments.length > 5;

  return (
    <div className="py-10 md:px-48 md:py-14">
      {/* Add comment form */}
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
            disabled={isAddingComment || !newComment.trim()}
            aria-label="Send comment"
          >
            {isAddingComment ? "Sending..." : "Send"}
            <SendHorizontal className="ml-2 size-4" />
          </Button>
        </div>

        {error && (
          <div className="mt-3 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}
      </div>

      {/* Comments section */}
      <div className="mt-8 space-y-10">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">Comments</h2>
          <span className="rounded-full bg-[#E65808] px-3 py-1 text-xs font-medium text-white">
            {comments.length}
          </span>
        </div>

        {/* Loading state */}
        {isLoadingComments && rootComments.length === 0 && (
          <div className="py-8 text-center text-gray-500">
            Loading comments...
          </div>
        )}

        {/* Empty state */}
        {!isLoadingComments && rootComments.length === 0 && (
          <div className="py-8 text-center text-gray-500">
            No comments yet. Be the first to comment!
          </div>
        )}

        {/* Comments list */}
        {displayComments.length > 0 && (
          <div className="space-y-8">
            {displayComments.map((comment, index) => {
              const replies = getReplies(comment.id);
              const isOwner = canModify(comment);
              const isDeleting = isDeletingComment === comment.id;
              const isEditing = editingId === comment.id;
              const isSaving = isSavingId === comment.id;

              return (
                <div key={comment.id}>
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>
                        {comment.author?.name?.charAt(0)?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold">
                          {comment.author?.name || "Anonymous"}
                        </h3>
                        <span className="text-sm text-gray-500">
                          {formatTime(comment.createdAt)}
                        </span>
                      </div>

                      {/* Comment content or edit form */}
                      {!isEditing ? (
                        <p className="whitespace-pre-line text-gray-800">
                          {comment.content}
                        </p>
                      ) : (
                        <div className="space-y-2">
                          <Textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            rows={3}
                            disabled={isSaving}
                            onKeyDown={(e) => {
                              if (
                                e.key === "Enter" &&
                                (e.ctrlKey || e.metaKey)
                              ) {
                                handleUpdateComment(comment.id);
                              }
                            }}
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleUpdateComment(comment.id)}
                              disabled={isSaving || !editText.trim()}
                            >
                              {isSaving ? "Saving..." : "Save"}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={handleCancelEdit}
                              disabled={isSaving}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Comment actions */}
                      <div className="flex items-center gap-8 text-sm">
                        <button className="flex items-center gap-2 text-gray-600">
                          <ThumbsUp className="size-4" />
                          <span>0</span>
                        </button>

                        <button
                          className="flex items-center gap-2 text-gray-600 transition-colors hover:text-[#E65808]"
                          onClick={() => handleToggleReply(comment.id)}
                          disabled={isDeleting || isEditing}
                        >
                          <MessageSquareText className="size-4" />
                          <span>Reply</span>
                        </button>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={isDeleting}
                              className="text-gray-600 hover:text-[#E65808]"
                            >
                              <Ellipsis className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start">
                            <DropdownMenuItem
                              disabled={!isOwner || isEditing}
                              onClick={() => handleStartEdit(comment)}
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteComment(comment.id)}
                              disabled={!isOwner || isDeleting}
                              className="text-red-600 focus:text-red-600"
                            >
                              {isDeleting ? "Deleting..." : "Delete"}
                            </DropdownMenuItem>
                            <DropdownMenuItem disabled>Report</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Reply form */}
                      {replyingTo === comment.id && (
                        <div className="relative mt-2 w-full">
                          <Textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            rows={5}
                            placeholder="Write a reply…"
                            disabled={isReplyingId === comment.id}
                            className="w-full resize-none border-none bg-zinc-200/70 p-5 text-lg italic focus-visible:border-0 focus-visible:ring-0"
                            onKeyDown={(e) => {
                              if (
                                e.key === "Enter" &&
                                (e.ctrlKey || e.metaKey)
                              ) {
                                handleAddReply(comment.id);
                              }
                            }}
                          />
                          <div className="absolute bottom-5 right-5 flex items-center gap-2">
                            <Button
                              size="sm"
                              className="rounded-full border border-[#E65808] bg-[#E65808] px-5 py-2 text-white transition-colors hover:bg-white hover:text-[#e66808]"
                              onClick={() => handleAddReply(comment.id)}
                              disabled={
                                isReplyingId === comment.id || !replyText.trim()
                              }
                            >
                              {isReplyingId === comment.id
                                ? "Sending..."
                                : "Reply"}
                              <SendHorizontal className="ml-2 size-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setReplyingTo(null);
                                setReplyText("");
                              }}
                              disabled={isReplyingId === comment.id}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Replies */}
                      {replies.length > 0 && (
                        <div className="mt-4 space-y-4 border-l pl-4">
                          {replies.map((reply) => {
                            const isReplyOwner = canModify(reply);
                            const isReplyDeleting =
                              isDeletingComment === reply.id;
                            const isReplyEditing = editingId === reply.id;
                            const isReplySaving = isSavingId === reply.id;

                            return (
                              <div
                                key={reply.id}
                                className="flex items-start gap-3"
                              >
                                <Avatar className="size-8">
                                  <AvatarImage src="https://github.com/shadcn.png" />
                                  <AvatarFallback>
                                    {reply.author?.name
                                      ?.charAt(0)
                                      ?.toUpperCase() || "U"}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 space-y-2">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold">
                                      {reply.author?.name || "Anonymous"}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      {formatTime(reply.createdAt)}
                                    </span>
                                  </div>

                                  {!isReplyEditing ? (
                                    <p className="whitespace-pre-line text-gray-800">
                                      {reply.content}
                                    </p>
                                  ) : (
                                    <div className="space-y-2">
                                      <Textarea
                                        value={editText}
                                        onChange={(e) =>
                                          setEditText(e.target.value)
                                        }
                                        rows={3}
                                        disabled={isReplySaving}
                                        onKeyDown={(e) => {
                                          if (
                                            e.key === "Enter" &&
                                            (e.ctrlKey || e.metaKey)
                                          ) {
                                            handleUpdateComment(reply.id);
                                          }
                                        }}
                                      />
                                      <div className="flex gap-2">
                                        <Button
                                          size="sm"
                                          onClick={() =>
                                            handleUpdateComment(reply.id)
                                          }
                                          disabled={
                                            isReplySaving || !editText.trim()
                                          }
                                        >
                                          {isReplySaving ? "Saving..." : "Save"}
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={handleCancelEdit}
                                          disabled={isReplySaving}
                                        >
                                          Cancel
                                        </Button>
                                      </div>
                                    </div>
                                  )}

                                  {isReplyOwner && (
                                    <div className="flex gap-3 text-sm">
                                      <button
                                        className="text-gray-600 hover:text-black"
                                        onClick={() => handleStartEdit(reply)}
                                        disabled={
                                          isReplyDeleting || isReplyEditing
                                        }
                                      >
                                        Edit
                                      </button>
                                      <button
                                        className="text-red-600 hover:text-red-700"
                                        onClick={() =>
                                          handleDeleteComment(reply.id)
                                        }
                                        disabled={isReplyDeleting}
                                      >
                                        {isReplyDeleting
                                          ? "Deleting..."
                                          : "Delete"}
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {index < displayComments.length - 1 && (
                    <Separator className="mt-6 bg-zinc-300" />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Show more/less button */}
        {hasMoreComments && (
          <div className="flex justify-center">
            <Button
              variant="ghost"
              className="flex items-center gap-2 text-[#E65808] transition-colors hover:text-[#d14907]"
              onClick={() => setShowAll(!showAll)}
              disabled={isLoadingComments}
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
