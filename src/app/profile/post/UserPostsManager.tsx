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
import { Eye, MoreHorizontal, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useSignal } from "@preact/signals-react";

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

  // data
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // paging
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // error
  const [error, setError] = useState<string | null>(null);

  // search & filters
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState<"all" | "published" | "draft">("all");
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const [sortBy, setSortBy] = useState<"createdAt" | "updatedAt">("createdAt");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  // loading chỉ cho list
  const postsLoading = useSignal(true);

  // debounce search 500ms
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 500);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // load categories once
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

  // khi filter/sort/search đổi, về page 1
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, status, categoryId, sortBy, sortOrder]);

  // fetch khi deps đổi
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
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      await api.delete(`/posts/${postId}`);
      toast.success("Post deleted");
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
    <div className="space-y-6">
      {/* toolbar: search, filters, reset */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <Input
            placeholder="Search posts"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Select value={status} onValueChange={(v) => setStatus(v as any)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={categoryId ?? "#"}
            onValueChange={(v) => setCategoryId(v === "#" ? undefined : v)}
          >
            <SelectTrigger className="w-[180px]">
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
            <SelectTrigger className="w-[180px]">
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
          >
            Reset
          </Button>
        </div>
      </div>

      {/* header */}
      <div className="flex items-center justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-muted-foreground">
            {posts.length} {posts.length === 1 ? "post" : "posts"} total
          </p>
        </div>
        <Button
          asChild
          className="btn-sweep-effect rounded-none border border-black bg-black text-white before:bg-white hover:text-black"
        >
          <Link href="/profile/post/create">
            <Plus />
            <span>Create new post</span>
          </Link>
        </Button>
      </div>

      {/* list */}
      {postsLoading.value ? (
        <div>
          {Array.from({ length: postsPerPage }).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="p-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="mt-2 h-4 w-1/2" />
              </CardHeader>
              <CardContent className="p-4">
                <Skeleton className="h-20 w-full" />
              </CardContent>
              <CardFooter className="flex justify-between p-4">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </CardFooter>
            </Card>
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
                            .name || "Author"
                        );
                      } catch {
                        return "Author";
                      }
                    })()
                  : "Author";

              return (
                <div key={post.id}>
                  <div className="relative flex flex-col gap-8 py-10 md:flex-row md:gap-12 md:py-12">
                    {/* image: hình vuông 240px */}
                    <div className="w-full md:w-auto md:flex-shrink-0">
                      <div className="w-[240px]">
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
                              unoptimized
                            />
                          ) : (
                            <div className="h-full w-full bg-muted" />
                          )}
                        </AspectRatio>
                      </div>
                    </div>

                    {/* content */}
                    <div className="flex w-full flex-col justify-between md:flex-1">
                      <div className="flex flex-col gap-5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Link
                              href={`/posts/${post.id}`}
                              className="text-3xl font-bold"
                            >
                              {post.title}
                            </Link>
                            <Badge
                              variant={post.published ? "default" : "secondary"}
                            >
                              {post.published ? "Published" : "Draft"}
                            </Badge>
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                disabled={postsLoading.value}
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
                                  <Eye className="mr-2 size-4" /> Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleDeletePost(post.id)}
                              >
                                <Trash2 className="mr-2 size-4" /> Trash
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <p className="text-base">{post.content}</p>
                      </div>

                      {/* info line */}
                      <div className="mt-8 flex flex-col items-start justify-between md:mt-0 md:flex-row md:items-center">
                        <div className="flex flex-col md:flex-row md:items-center md:gap-7">
                          <div className="mb-2 flex items-center gap-3 md:mb-0">
                            <p className="font-semibold">Text</p>
                            <span className="underline">{authorName}</span>
                          </div>
                          <div className="mb-2 flex items-center gap-3 md:mb-0">
                            <p className="font-semibold">Date</p>
                            <span className="underline">
                              {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <p className="font-semibold">Read</p>
                            <span className="underline">{readMin} Min</span>
                          </div>
                        </div>

                        <span className="btn-sweep-effect mt-3 rounded-full border border-black bg-white px-3 py-1 uppercase text-black before:bg-black hover:text-white md:mt-0">
                          <span>
                            {post.category?.name ||
                              (post.published ? "Published" : "Draft")}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {idx < posts.length - 1 && (
                    <div className="h-px w-full bg-black" />
                  )}
                </div>
              );
            })}
          </div>

          {/* pagination */}
          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) setCurrentPage(currentPage - 1);
                    }}
                    className={
                      currentPage === 1 ? "pointer-events-none opacity-50" : ""
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
          )}
        </>
      ) : (
        <div>
          <p>No posts yet</p>
          <p>Get started by creating your first post</p>
          <Button asChild className="mt-6">
            <Link href="/create-post">Create your first post</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
