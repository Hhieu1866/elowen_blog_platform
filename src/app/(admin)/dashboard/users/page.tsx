/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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
import { RefreshCw, Search, Eye, PencilLine, Trash2 } from "lucide-react";

/** ---- Types ---- */
type Role = "ADMIN" | "USER";
type HasPosts = "all" | "yes" | "no";
type SortBy = "createdAt" | "name" | "email" | "postsCount";
type SortOrder = "asc" | "desc";

interface UserRow {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  createdAt: string;
  postsCount: number;
}

const PAGE_SIZE = 10;
const formatDate = (iso: string) => new Date(iso).toLocaleDateString();

export default function AdminUsersManager() {
  const { user: currentUser, isAdmin } = useAuth();

  // Check admin status once - avoid function calls in effects
  const userIsAdmin = currentUser.value && isAdmin();

  // data
  const [users, setUsers] = useState<UserRow[]>([]);

  // loading & error
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // filters
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | Role>("all");
  const [hasPosts, setHasPosts] = useState<HasPosts>("all");
  const [createdFrom, setCreatedFrom] = useState("");
  const [createdTo, setCreatedTo] = useState("");

  // sort & pagination
  const [sortBy, setSortBy] = useState<SortBy>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // delete state
  const [userToDelete, setUserToDelete] = useState<UserRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Keyboard shortcut: '/' to focus search
  const searchRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "/" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, []);

  // Admin access control - separate effect
  useEffect(() => {
    if (currentUser.value && !userIsAdmin) {
      setError("Access denied. Admin privileges required.");
      setIsLoading(false);
    }
  }, [currentUser.value, userIsAdmin]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
      setCurrentPage(1); // Reset to first page on search
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [roleFilter, hasPosts, createdFrom, createdTo, sortBy, sortOrder]);

  // Main fetch function
  const fetchUsers = async () => {
    // Early return if not admin
    if (!userIsAdmin) return;

    setError(null);
    setIsFetching(true);

    try {
      const params = new URLSearchParams({
        page: String(currentPage),
        limit: String(PAGE_SIZE),
        sortBy,
        sortOrder,
      });

      // Add optional filters
      if (debouncedSearch) params.set("search", debouncedSearch);
      if (roleFilter !== "all") params.set("role", roleFilter);
      if (hasPosts !== "all")
        params.set("hasPosts", String(hasPosts === "yes"));
      if (createdFrom) params.set("createdFrom", createdFrom);
      if (createdTo) params.set("createdTo", createdTo);

      const res = await api.get(`/users?${params.toString()}`);
      const data = (res.data?.data ?? []) as UserRow[];
      setUsers(data);

      const total = Number(res.data?.pagination?.total ?? data.length);
      setTotalPages(Math.max(1, Math.ceil(total / PAGE_SIZE)));
    } catch (err: any) {
      console.error("Fetch users error:", err);
      const msg = err?.response?.data?.message || "Failed to load users.";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsFetching(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userIsAdmin) {
      fetchUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentPage,
    debouncedSearch,
    roleFilter,
    hasPosts,
    createdFrom,
    createdTo,
    sortBy,
    sortOrder,
    userIsAdmin,
  ]);

  const resetFilters = () => {
    setSearchTerm("");
    setRoleFilter("all");
    setHasPosts("all");
    setCreatedFrom("");
    setCreatedTo("");
    setSortBy("createdAt");
    setSortOrder("desc");
  };

  // Delete user handler
  const confirmDelete = async () => {
    if (!userToDelete) return;

    setIsDeleting(true);
    try {
      await api.delete(`/users/${userToDelete.id}`);

      // Optimistic update
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
      toast.success("User deleted successfully");
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to delete user.";
      console.error("Delete user error:", err);
      toast.error(msg);
    } finally {
      setIsDeleting(false);
      setUserToDelete(null);
    }
  };

  // Initial loading state
  if (isLoading && users.length === 0 && !error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <Skeleton className="h-10" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-[140px]" />
            <Skeleton className="h-10 w-[140px]" />
            <Skeleton className="h-10 w-[180px]" />
            <Skeleton className="h-10 w-[180px]" />
            <Skeleton className="h-10 w-[80px]" />
          </div>
        </div>
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-6 w-72" />
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-28" />
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
            <p className="text-lg font-medium">Error loading users</p>
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={fetchUsers}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (users.length === 0 && !isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Manage Blog Posts</h1>
          <p className="text-sm font-medium text-gray-400">
            Create, edit, and organize blog posts in your admin dashboard.
          </p>
        </div>
        {/* Keep the toolbar visible so users can adjust filters */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-2">
            <div className="relative w-full">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 opacity-60" />
              <Input
                ref={searchRef}
                placeholder="Search users (name, email)… — press / to focus"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Role Filter */}
            <Select
              value={roleFilter}
              onValueChange={(v) => setRoleFilter(v as "all" | Role)}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All roles</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="USER">User</SelectItem>
              </SelectContent>
            </Select>

            {/* Posts Filter */}
            <Select
              value={hasPosts}
              onValueChange={(v) => setHasPosts(v as HasPosts)}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Has posts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All users</SelectItem>
                <SelectItem value="yes">Has posts</SelectItem>
                <SelectItem value="no">No posts</SelectItem>
              </SelectContent>
            </Select>

            {/* Date Range */}
            <Input
              type="date"
              value={createdFrom}
              onChange={(e) => setCreatedFrom(e.target.value)}
              className="w-[180px]"
            />
            <Input
              type="date"
              value={createdTo}
              onChange={(e) => setCreatedTo(e.target.value)}
              className="w-[180px]"
            />

            {/* Sort Options */}
            <Select
              value={`${sortBy}:${sortOrder}`}
              onValueChange={(v) => {
                const [by, order] = v.split(":") as [SortBy, SortOrder];
                setSortBy(by);
                setSortOrder(order);
              }}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt:desc">Newest</SelectItem>
                <SelectItem value="createdAt:asc">Oldest</SelectItem>
                <SelectItem value="name:asc">Name (A–Z)</SelectItem>
                <SelectItem value="name:desc">Name (Z–A)</SelectItem>
                <SelectItem value="email:asc">Email (A–Z)</SelectItem>
                <SelectItem value="email:desc">Email (Z–A)</SelectItem>
                <SelectItem value="postsCount:desc">Most posts</SelectItem>
                <SelectItem value="postsCount:asc">Fewest posts</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="ghost" onClick={resetFilters}>
              Reset
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            0 users found
            {isFetching && (
              <span className="ml-2 inline-flex items-center text-xs">
                <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
                updating…
              </span>
            )}
          </p>
          <Button asChild>
            <Link href="/users/create">Create user</Link>
          </Button>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center pt-6">
            <p className="text-lg font-medium">No users found</p>
            <p className="mb-4 text-muted-foreground">
              Try adjusting your search or filters above.
            </p>
            <Button onClick={fetchUsers}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main render
  return (
    <div className="space-y-6">
      {/* Search & Filters Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative w-full">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 opacity-60" />
            <Input
              ref={searchRef}
              placeholder="Search users (name, email)… — press / to focus"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Role Filter */}
          <Select
            value={roleFilter}
            onValueChange={(v) => setRoleFilter(v as "all" | Role)}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All roles</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="USER">User</SelectItem>
            </SelectContent>
          </Select>

          {/* Posts Filter */}
          <Select
            value={hasPosts}
            onValueChange={(v) => setHasPosts(v as HasPosts)}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Has posts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All users</SelectItem>
              <SelectItem value="yes">Has posts</SelectItem>
              <SelectItem value="no">No posts</SelectItem>
            </SelectContent>
          </Select>

          {/* Date Range */}
          <Input
            type="date"
            value={createdFrom}
            onChange={(e) => setCreatedFrom(e.target.value)}
            className="w-[180px]"
          />
          <Input
            type="date"
            value={createdTo}
            onChange={(e) => setCreatedTo(e.target.value)}
            className="w-[180px]"
          />

          {/* Sort Options */}
          <Select
            value={`${sortBy}:${sortOrder}`}
            onValueChange={(v) => {
              const [by, order] = v.split(":") as [SortBy, SortOrder];
              setSortBy(by);
              setSortOrder(order);
            }}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt:desc">Newest</SelectItem>
              <SelectItem value="createdAt:asc">Oldest</SelectItem>
              <SelectItem value="name:asc">Name (A–Z)</SelectItem>
              <SelectItem value="name:desc">Name (Z–A)</SelectItem>
              <SelectItem value="email:asc">Email (A–Z)</SelectItem>
              <SelectItem value="email:desc">Email (Z–A)</SelectItem>
              <SelectItem value="postsCount:desc">Most posts</SelectItem>
              <SelectItem value="postsCount:asc">Fewest posts</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="ghost" onClick={resetFilters}>
            Reset
          </Button>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {users.length} {users.length === 1 ? "user" : "users"} on this page
          {isFetching && (
            <span className="ml-2 inline-flex items-center text-xs">
              <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
              updating…
            </span>
          )}
        </p>
        <Button asChild>
          <Link href="/users/create">Create user</Link>
        </Button>
      </div>

      {/* Users Table */}
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Posts</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => {
            const initial = (
              user.name?.charAt(0) ?? user.email.charAt(0)
            ).toUpperCase();

            return (
              <TableRow
                key={user.id}
                className="transition-colors hover:bg-muted/50"
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <span className="text-sm font-medium">{initial}</span>
                    </div>
                    <div>
                      <div className="font-medium">
                        {user.name || "(No name)"}
                      </div>
                      <span className="mt-0.5 text-xs text-muted-foreground">
                        @
                        {(user.name || user.email)
                          .toLowerCase()
                          .replace(/\s+/g, "")}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {user.email}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={user.role === "ADMIN" ? "default" : "secondary"}
                  >
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>{user.postsCount}</TableCell>
                <TableCell>{formatDate(user.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <div className="inline-flex items-center gap-2">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/users/${user.id}`}>
                        <Eye className="mr-1 h-4 w-4" /> View
                      </Link>
                    </Button>
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/users/${user.id}/edit`}>
                        <PencilLine className="mr-1 h-4 w-4" /> Edit
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setUserToDelete(user)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="mr-1 h-4 w-4" /> Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
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
                (p) =>
                  p === 1 ||
                  p === totalPages ||
                  (p >= currentPage - 1 && p <= currentPage + 1),
              )
              .map((p) => (
                <PaginationItem key={p}>
                  <PaginationLink
                    onClick={() => setCurrentPage(p)}
                    isActive={currentPage === p}
                    className="cursor-pointer"
                  >
                    {p}
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!userToDelete}
        onOpenChange={(open) => {
          if (!open && !isDeleting) setUserToDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete user?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              user{" "}
              <span className="font-semibold">
                {userToDelete?.name || userToDelete?.email}
              </span>
              .
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
