import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import { Plus } from "lucide-react";
import React, { useState } from "react";

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
        `/api/posts?authorId=${user.value.id}&page=${page}&limit=${postsPerPage}`,
      );
      setPosts(response.data.posts || []);

      const totalPosts = response.data.pagination?.total || 0;
      const calculatedTotalPages = Math.cell(totalPosts / postsPerPage);
      setTotalPages(calculatedTotalPages);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Failed to fetch posts: ", err);
      setError(err.response?.data?.message || "Failed to load posts");
    }
  };

  return (
    <div>
      <div className="">
        <h1 className="uppercase">My posts</h1>
        <p># posts found</p>
      </div>
      <Button className="flex items-center gap-2">
        <Plus className="size-4" />
        <p>Create post</p>
      </Button>
    </div>
  );
};

export default UserPostsManager;
