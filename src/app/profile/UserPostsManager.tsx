import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import { Eye, MoreHorizontal, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

interface Post {
  id: string;
  title: string;
  content: string;
  published: boolean;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

const UserPostsManager = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const postsPerPage = 6;

  const fetchUserPosts = async (page: number) => {
    if (!user.value?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get(
        `/posts?authorId=${user.value.id}&page=${page}&limit=${postsPerPage}`,
      );
      setPosts(response.data.data || []);

      const totalPosts = response.data.pagination?.total || 0;
      const calculatedTotalPages = Math.ceil(totalPosts / postsPerPage);
      setTotalPages(calculatedTotalPages);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Failed to fetch posts:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to load posts.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserPosts(currentPage);
  }, [currentPage, user.value?.id]);

  const handleDeletePost = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      await api.delete(`/post/${postId}`);
      toast.success("Post delete successfully");
      fetchUserPosts(currentPage);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Failed to delete post: ", err);
      const errorMessage =
        err.response?.data?.message || "Failed to delete post";
      toast.error(errorMessage);
    }
  };

  if (isLoading) {
    return (
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
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent>
          <div>
            <p>Error loading posts</p>
            <p>{error}</p>
            <Button onClick={() => fetchUserPosts(currentPage)}>
              Try again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    // <div>
    //   <div className="">
    //     <h1 className="uppercase">My posts</h1>
    //     <p># posts found</p>
    //   </div>
    //   <Button className="flex items-center gap-2">
    //     <Plus className="size-4" />
    //     <p>Create post</p>
    //   </Button>
    // </div>

    <div className="space-y-6">
      {/* header */}
      <div className="flex items-center justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          {/* <h3>Your posts</h3> */}
          <p className="text-sm text-muted-foreground">
            {posts.length} {posts.length === 1 ? "post" : "posts"} total
          </p>
        </div>
        <Button asChild>
          <Link href="/create-post">
            <Plus />
            Create new post
          </Link>
        </Button>
      </div>

      {/* grid posts */}
      {posts.length > 0 ? (
        <>
          <div>
            {posts.map((post) => (
              <Card key={post.id}>
                <CardHeader>
                  <div>
                    <CardTitle>{post.title}</CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
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
                    </DropdownMenu>
                  </div>
                  <CardDescription>
                    {new Date(post.createdAt).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">
                    {post.content}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between p-4 pt-2">
                  <Badge variant={post.published ? "default" : "secondary"}>
                    {post.published ? "Published" : "Draft"}
                  </Badge>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/posts/${post.id}`}>Read more</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* phan trang */}
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
                    <Pagination key={page}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          (e.preventDefault(), setCurrentPage(page));
                        }}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    </Pagination>
                  ),
                )}

                {/* <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem> */}

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
        <Card>
          <CardContent>
            <div>
              <p>No posts yet</p>
              <p>Get started by creating your first post</p>
              <Button asChild className="mt-6">
                <Link href="/create-post">Create your first post</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserPostsManager;
