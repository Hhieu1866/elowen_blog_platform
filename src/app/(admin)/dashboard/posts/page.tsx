/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import { Eye, PencilLine, Plus, RefreshCw, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

interface Post {
  id: string;
  title: string;
  content: string;
  published: boolean;
  author: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  thumbnailUrl?: string | null;
  category?: { id: string; name: string } | null;
}

interface Category {
  id: string;
  name: string;
}

const POSTS_PER_PAGE = 10;

export default function UserPostsManager() {
  const { user: currentUser, isAdmin } = useAuth();

  // Check admin
  const userIsAdmin = currentUser.value && isAdmin();

  // State management
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter va pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "published" | "draft"
  >("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"createdAt" | "updatedAt" | "title">(
    "createdAt",
  );
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  // Delete state
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Admin access control
  useEffect(() => {
    if (currentUser.value && !userIsAdmin) {
      setError("Access denied. Admin privileges required.");
      setIsLoading(false);
    }
  }, [currentUser.value, userIsAdmin]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      if (!userIsAdmin) return;

      try {
        const response = await api.get("/categories");
        setCategories(response.data?.data || []);
      } catch (err: any) {
        console.error("Failed to load categories: ", err);
        const msg =
          err.response?.data?.message ||
          "Failed to fetch categories. Please try again later.";
        setError(msg);
        toast.error("Failed to load categories");
      }
    };

    if (userIsAdmin) {
      fetchCategories();
    }
  }, [userIsAdmin]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
      setCurrentPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Rf when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, statusFilter, categoryFilter, sortBy, sortOrder]);

  const fetchPosts = async () => {
    if (!userIsAdmin) return;

    setError(null);
    setIsFetching(true);

    try {
      const params = new URLSearchParams({
        page: String(currentPage),
        limit: String(POSTS_PER_PAGE),
        sortBy,
        sortOrder,
      });

      if (debouncedSearch) params.set("search", debouncedSearch);
      if (categoryFilter !== "all") params.set("categoryId", categoryFilter);
      if (statusFilter !== "all")
        params.set("published", String(statusFilter === "published"));

      const response = await api.get(`/admin/posts?${params.toString()}`);
      setPosts(response.data?.data || []);

      const totalPosts = response.data.pagination?.total || 0;
      setTotalPages(Math.max(1, Math.ceil(totalPosts / POSTS_PER_PAGE)));
    } catch (err: any) {
      console.error("Failed to fetch posts:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to load posts.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsFetching(false);
      setIsLoading(false);
    }
  };

  // Fetch posts when dependencies change
  useEffect(() => {
    if (userIsAdmin) {
      fetchPosts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentPage,
    debouncedSearch,
    statusFilter,
    categoryFilter,
    sortBy,
    sortOrder,
    userIsAdmin,
  ]);

  // Delete post handler
  const confirmDelete = async () => {
    if (!postToDelete) return;

    setIsDeleting(true);
    try {
      await api.delete(`/posts/${postToDelete.id}`);

      setPosts((prev) => prev.filter((p) => p.id !== postToDelete.id));
      toast.success("Post deleted successfully");
    } catch (err: any) {
      console.error("Failed to delete post: ", err);
      const errorMessage =
        err.response?.data?.message || "Failed to delete post";
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
      setPostToDelete(null);
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setCategoryFilter("all");
    setSortBy("createdAt");
    setSortOrder("desc");
  };

  // Loading state
  if (isLoading && posts.length === 0 && !error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <Skeleton className="h-10" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-[140px]" />
            <Skeleton className="h-10 w-[180px]" />
            <Skeleton className="h-10 w-[180px]" />
            <Skeleton className="h-10 w-[80px]" />
          </div>
        </div>

        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-16 w-16 rounded" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            <p className="text-lg font-medium">Error loading posts</p>
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={fetchPosts}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Manage Blog Posts</h1>
        <p className="text-sm font-medium text-gray-400">
          Create, edit, and organize blog posts in your admin dashboard.
        </p>
      </div>

      {/* Search va filters toolbar */}
      <div className="flex flex-col gap-3 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <Input
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex items-center gap-2">
          {/* Status filter */}
          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as any)}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>

          {/* Category filter */}
          <Select
            value={categoryFilter}
            onValueChange={(v) => setCategoryFilter(v)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((category) => (
                <SelectItem value={category.id} key={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort options */}
          <Select
            value={`${sortBy}:${sortOrder}`}
            onValueChange={(v) => {
              const [by, order] = v.split(":") as [
                "createdAt" | "updatedAt" | "title",
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
              <SelectItem value="title:asc">Title (A-Z)</SelectItem>
              <SelectItem value="title:desc">Title (Z-A)</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="ghost" onClick={resetFilters}>
            Reset
          </Button>
        </div>
      </div>

      {/* Results header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">
            {posts.length} {posts.length === 1 ? "post" : "posts"} on this page
            {isFetching && (
              <span className="ml-2 inline-flex items-center text-xs">
                <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
                updating…
              </span>
            )}
          </p>
        </div>
        <Button
          asChild
          className="btn-sweep-effect rounded-none border border-black bg-black text-white before:bg-white hover:text-black"
        >
          <Link href="/posts/create">
            <Plus />
            <span>Create new post</span>
          </Link>
        </Button>
      </div>

      {/* Posts table */}
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Thumbnail</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow
              key={post.id}
              className="transition-colors hover:bg-muted/50"
            >
              <TableCell>
                <div className="w-24">
                  <AspectRatio ratio={1} className="overflow-hidden rounded-sm">
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
              </TableCell>
              <TableCell className="font-medium">{post.title}</TableCell>
              <TableCell>
                <p>{post.author.name}</p>
              </TableCell>
              <TableCell>
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </TableCell>
              <TableCell>{post.category?.name || "Uncategorized"}</TableCell>
              <TableCell>
                <Badge variant={post.published ? "default" : "secondary"}>
                  {post.published ? "Published" : "Draft"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="inline-flex items-center gap-2">
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/posts/${post.id}`}>
                      <Eye className="mr-1 h-4 w-4" /> View
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/posts/${post.id}/edit`}>
                      <PencilLine className="mr-1 h-4 w-4" /> Edit
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPostToDelete(post)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="mr-1 h-4 w-4" /> Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className={
                  currentPage === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (page) =>
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1),
              )
              .map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => setCurrentPage(page)}
                    isActive={currentPage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Empty state */}
      {posts.length === 0 && !isLoading && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center pt-6">
            <p className="text-lg font-medium">No posts found</p>
            <p className="mb-4 text-muted-foreground">
              Try adjusting your filters or create a new post.
            </p>
            <Button asChild>
              <Link href="/posts/create">
                <Plus />
                <span>Create new post</span>
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Delete confirmation dialog */}
      <AlertDialog
        open={!!postToDelete}
        onOpenChange={(open) => {
          if (!open && !isDeleting) setPostToDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete post?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              post
              <span className="font-semibold">
                &quot;{postToDelete?.title}&quot;
              </span>
              and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-0" disabled={isDeleting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Deleting…
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
