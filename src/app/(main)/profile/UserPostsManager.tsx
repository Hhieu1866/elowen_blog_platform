/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import { Eye, MoreHorizontal, PencilLine, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useSignal } from "@preact/signals-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";

interface Post {
  id: string;
  title: string;
  content: string;
  published: boolean;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  thumbnailUrl?: string | null;
  category?: { id: string; name: string } | null;
}

type Category = { id: string; name: string };

const postsPerPage = 6;

export default function UserPostsManager() {
  const { user } = useAuth();

  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState<"all" | "published" | "draft">("all");
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const [sortBy, setSortBy] = useState<"createdAt" | "updatedAt">("createdAt");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [deletePostId, setDeletePostId] = useState<string | null>(null);

  const postsLoading = useSignal(true);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 500);
    return () => clearTimeout(t);
  }, [searchTerm]);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/categories");
        setCategories(res.data?.data ?? []);
      } catch {
        console.error("Failed to load categories");
      }
    })();
  }, []);

  const fetchUserPosts = async (page: number) => {
    if (!user.value?.id) return;

    postsLoading.value = true;
    setError(null);

    try {
      const params = new URLSearchParams({
        authorId: user.value.id,
        page: String(page),
        limit: String(postsPerPage),
        sortBy,
        sortOrder,
      });
      if (debouncedSearch) params.set("search", debouncedSearch);
      if (categoryId) params.set("categoryId", categoryId);
      if (status !== "all")
        params.set("published", String(status === "published"));

      const response = await api.get(`/posts?${params.toString()}`);

      setPosts(response.data.data || []);

      const totalPosts = response.data.pagination?.total || 0;
      setTotalPages(Math.ceil(totalPosts / postsPerPage));
    } catch (err: any) {
      console.error("Failed to fetch posts:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to load posts.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      postsLoading.value = false;
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, status, categoryId, sortBy, sortOrder]);

  useEffect(() => {
    fetchUserPosts(currentPage);
  }, [
    currentPage,
    user.value?.id,
    debouncedSearch,
    status,
    categoryId,
    sortBy,
    sortOrder,
  ]);

  const handleDeletePost = async (postId: string) => {
    try {
      await api.delete(`/posts/${postId}`);
      toast.success("Post deleted");
      setDeletePostId(null);
      fetchUserPosts(currentPage);
    } catch (err: any) {
      console.error("Failed to delete post: ", err);
      const errorMessage =
        err.response?.data?.message || "Failed to delete post";
      toast.error(errorMessage);
    }
  };

  if (error) {
    return (
      <Card>
        <CardContent>
          <div>
            <p>Error loading posts</p>
            <p>{error}</p>
            <Button onClick={() => fetchUserPosts(currentPage)}>Retry</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mt-5 space-y-6">
      {/* toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 max-sm:order-1">
          <Input
            placeholder="Search posts"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-sm:h-10"
          />
        </div>

        <div className="max-sm:no-scrollbar flex items-center gap-2 max-sm:order-2 max-sm:-mx-3 max-sm:overflow-x-auto max-sm:px-3 max-sm:py-1">
          {/* Status */}
          <Select value={status} onValueChange={(v) => setStatus(v as any)}>
            <SelectTrigger className="w-[140px] max-sm:h-9 max-sm:w-[120px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>

          {/* Category */}
          <Select
            value={categoryId ?? "#"}
            onValueChange={(v) => setCategoryId(v === "#" ? undefined : v)}
          >
            <SelectTrigger className="w-[180px] max-sm:h-9 max-sm:w-[140px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="#">All categories</SelectItem>
              {categories.map((category) => (
                <SelectItem value={category.id} key={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select
            value={`${sortBy}:${sortOrder}`}
            onValueChange={(v) => {
              const [by, order] = v.split(":") as [
                "createdAt" | "updatedAt",
                "asc" | "desc",
              ];
              setSortBy(by);
              setSortOrder(order);
            }}
          >
            <SelectTrigger className="w-[180px] max-sm:h-9 max-sm:w-[160px]">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt:desc">Newest</SelectItem>
              <SelectItem value="createdAt:asc">Oldest</SelectItem>
              <SelectItem value="updatedAt:desc">Recently updated</SelectItem>
              <SelectItem value="updatedAt:asc">
                Least recently updated
              </SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            onClick={() => {
              setSearchTerm("");
              setStatus("all");
              setCategoryId(undefined);
              setSortBy("createdAt");
              setSortOrder("desc");
            }}
            className="max-sm:h-9"
          >
            Reset
          </Button>
        </div>
      </div>

      {/* header */}
      <div className="flex items-center justify-between gap-4 max-sm:flex-col max-sm:items-stretch sm:flex-row sm:items-center">
        <p className="text-sm text-muted-foreground max-sm:text-xs">
          {posts.length} {posts.length === 1 ? "post" : "posts"} total
        </p>
        <Button
          asChild
          className="btn-sweep-effect rounded-none border border-black bg-black text-white before:bg-white hover:text-black max-sm:h-10 max-sm:w-full"
        >
          <Link href="/posts/create">
            <Plus />
            <span>Create new post</span>
          </Link>
        </Button>
      </div>

      {/* list */}
      {postsLoading.value ? (
        <div className="space-y-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i}>
              <div className="flex flex-col gap-8 py-5 max-sm:grid max-sm:grid-cols-[96px_1fr_auto] max-sm:items-start max-sm:gap-4 max-sm:py-4 md:flex-row">
                {/* Thumb skeleton */}
                <div className="w-full max-sm:col-span-1 md:w-auto md:flex-shrink-0">
                  <div className="w-[150px] max-sm:w-[96px]">
                    <AspectRatio
                      ratio={1}
                      className="overflow-hidden rounded-sm"
                    >
                      <Skeleton className="h-full w-full" />
                    </AspectRatio>
                  </div>
                </div>

                {/* Content + right column skeleton */}
                <div className="flex w-full items-center justify-between max-sm:col-span-1">
                  {/* LEFT: title + badge + excerpt + category */}
                  <div className="flex max-w-[400px] flex-col gap-3 max-sm:max-w-full max-sm:gap-2">
                    {/* Title + Badge */}
                    <div className="flex items-center gap-3 max-sm:gap-2">
                      <Skeleton className="h-7 w-64 max-sm:h-5 max-sm:w-40" />
                      <Skeleton className="h-5 w-20 rounded-full max-sm:h-4 max-sm:w-16" />
                    </div>

                    {/* Excerpt (1 dòng desktop, 2 dòng mobile) */}
                    <Skeleton className="h-4 w-96 max-sm:w-full" />

                    {/* Category pill */}
                    <div className="mt-3 max-sm:mt-1">
                      <Skeleton className="h-6 w-16 rounded-full max-sm:h-5" />
                    </div>

                    {/* Meta rút gọn cho mobile */}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground md:hidden">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-3 w-3 rounded-full" />
                      <Skeleton className="h-3 w-12" />
                    </div>
                  </div>

                  {/* RIGHT (desktop): menu trên, meta dưới */}
                  <div className="hidden h-full md:flex md:flex-col md:items-end md:justify-between">
                    {/* Menu (… ) */}
                    <Skeleton className="h-8 w-8 rounded-full" />

                    {/* Meta 3 dòng */}
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-3 w-12" />
                        <Skeleton className="h-3 w-28" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-3 w-12" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-3 w-12" />
                        <Skeleton className="h-3 w-10" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px w-full bg-black/60" />
            </div>
          ))}
        </div>
      ) : posts.length > 0 ? (
        <>
          <div>
            {posts.map((post, idx) => {
              const words = post.content
                ? post.content.trim().split(/\s+/).length
                : 0;
              const readMin = Math.max(1, Math.ceil(words / 200));

              const authorName =
                typeof window !== "undefined" && localStorage.getItem("user")
                  ? (() => {
                      try {
                        return (
                          JSON.parse(localStorage.getItem("user") || "{}")
                            .name || "Admin User"
                        );
                      } catch {
                        return "Admin User";
                      }
                    })()
                  : "Admin User";

              return (
                <div key={post.id}>
                  <div className="flex flex-col gap-8 py-5 max-sm:grid max-sm:grid-cols-[96px_1fr_auto] max-sm:items-start max-sm:gap-4 max-sm:py-4 md:flex-row">
                    {/* Thumbnail */}
                    <div className="w-full max-sm:col-span-1 md:w-auto md:flex-shrink-0">
                      <Link href={`/posts/${post.id}`}>
                        <div className="w-[150px] max-sm:w-[96px]">
                          <AspectRatio
                            ratio={1}
                            className="overflow-hidden rounded-sm"
                          >
                            {post.thumbnailUrl ? (
                              <Image
                                src={post.thumbnailUrl}
                                alt={post.title}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="h-full w-full bg-muted" />
                            )}
                          </AspectRatio>
                        </div>
                      </Link>
                    </div>

                    {/* Content + meta + actions */}
                    <div className="flex w-full items-center justify-between max-sm:col-span-1 max-sm:items-start max-sm:justify-start">
                      {/* LEFT: Title + badge + excerpt + category */}
                      <div className="flex max-w-[400px] flex-col items-start justify-center gap-3 max-sm:max-w-full max-sm:gap-2">
                        {/* Title + Badge */}
                        <div className="flex items-center gap-3 max-sm:gap-2">
                          <Link href={`/posts/${post.id}`}>
                            <h3 className="line-clamp-1 text-2xl font-bold max-sm:text-base">
                              {post.title}
                            </h3>
                          </Link>
                          <Badge
                            variant={post.published ? "default" : "secondary"}
                            className="max-sm:px-2 max-sm:py-0.5 max-sm:text-[10px]"
                          >
                            {post.published ? "Published" : "Draft"}
                          </Badge>
                        </div>

                        {/* Excerpt: 1 dòng desktop, 2 dòng mobile */}
                        <p
                          className="line-clamp-1 text-base max-sm:line-clamp-2 max-sm:text-sm"
                          dangerouslySetInnerHTML={{ __html: post.content }}
                        />

                        {/* Category pill */}
                        <span className="btn-sweep-effect mt-3 rounded-full border border-black bg-white px-3 py-1 uppercase text-black before:bg-black hover:text-white max-sm:mt-1 max-sm:px-2 max-sm:py-0.5 max-sm:text-[11px] md:mt-0">
                          <span className="text-sm max-sm:text-[11px]">
                            {post.category?.name ||
                              (post.published ? "Published" : "Draft")}
                          </span>
                        </span>

                        {/* Meta rút gọn mobile */}
                        <div className="flex items-center gap-3 text-xs text-muted-foreground md:hidden">
                          <span>
                            {new Date(post.createdAt).toLocaleDateString()}
                          </span>
                          <span>•</span>
                          <span>{readMin} min</span>
                        </div>
                      </div>

                      {/* RIGHT (DESKTOP): menu trên cùng, meta dưới cùng */}
                      <div className="hidden h-full md:flex md:flex-col md:items-end md:justify-between">
                        {/* Menu ở trên cùng */}
                        <div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                disabled={postsLoading.value}
                                className="h-8 w-8"
                                aria-label="Open menu"
                                title="Open menu"
                              >
                                <MoreHorizontal className="size-5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/posts/${post.id}`}>
                                  <Eye className="mr-2 size-4" /> View
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/posts/${post.id}/edit`}>
                                  <PencilLine className="mr-2 size-4" /> Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive"
                                onSelect={(e) => {
                                  e.preventDefault();
                                  setDeletePostId(post.id);
                                }}
                              >
                                <Trash2 className="mr-2 size-4" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        {/* Meta list ở dưới cùng, căn phải */}
                        <div className="flex flex-col items-end gap-2 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">
                              Author:
                            </span>
                            <Link
                              href={`/users/${post.authorId}`}
                              className="underline"
                            >
                              {authorName}
                            </Link>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">Date:</span>
                            <span>
                              {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">Read:</span>
                            <span>{readMin} min</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {idx < posts.length - 1 && (
                    <Separator className="bg-black" />
                  )}
                </div>
              );
            })}
          </div>

          {/* pagination */}
          {totalPages > 1 && (
            <div className="max-sm:no-scrollbar max-sm:-mx-3 max-sm:overflow-x-auto max-sm:px-3">
              <Pagination>
                <PaginationContent className="max-sm:gap-1">
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) setCurrentPage(currentPage - 1);
                      }}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(page);
                          }}
                          isActive={currentPage === page}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ),
                  )}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages)
                          setCurrentPage(currentPage + 1);
                      }}
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-14 max-sm:py-10">
          <p className="max-sm:text-sm">No posts yet</p>
          <p className="text-muted-foreground max-sm:text-xs">
            Get started by creating your first post
          </p>
        </div>
      )}

      {/* Global AlertDialog for delete confirmation */}
      <AlertDialog
        open={!!deletePostId}
        onOpenChange={(open) => !open && setDeletePostId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this post?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. It will permanently delete the post
              and remove it from your profile.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletePostId(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletePostId && handleDeletePost(deletePostId)}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Yes, delete it
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
