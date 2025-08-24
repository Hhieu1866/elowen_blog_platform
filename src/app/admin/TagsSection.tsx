/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";
import { toast } from "sonner";
import Loading from "@/components/Loading";
import EditTagDialog from "./EditTagDialog";

interface Tag {
  id: string;
  name: string;
  _count?: {
    posts: number;
  };
}

const TagsSection = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [newTagName, setNewTagName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingTag, setIsCreatingTag] = useState(false);

  const fetchTags = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/tags");
      setTags(response.data.data);
    } catch (error: any) {
      console.error("Error fetching tags: ", error);
      toast.error(error.message?.data?.message || "Failed to fetch tags");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleCreateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) {
      toast.error("Tag name is required");
      return;
    }

    setIsCreatingTag(true);
    try {
      await api.post("/tags", { name: newTagName.trim() });
      toast.success("Tag created successfully");
      setNewTagName("");
      fetchTags();
    } catch (error: any) {
      console.error("Create tag error:", error);
      toast.error(error.response?.data?.message || "Failed to create tag");
    } finally {
      setIsCreatingTag(false);
    }
  };

  const handleDeleteTag = async (tagId: string, tagName: string) => {
    if (!confirm(`Are you sure you want to delete the tag "${tagName}"?`))
      return;

    try {
      await api.delete(`/tags/${tagId}`);
      toast.success("Tag deleted successfully");
      fetchTags();
    } catch (error: any) {
      console.error("Delete tag error:", error);
      toast.error(error.response?.data?.message || "Failed to delete tag");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create new tag</CardTitle>
          <CardDescription>
            Add a new tag for categorizing posts with specific keywords
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleCreateTag}>
            <div className="space-y-2">
              <Label htmlFor="tagName">Tag name</Label>
              <Input
                id="tagName"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="Enter tag name (e.g., React, Javascript, AI"
                disabled={isCreatingTag}
                className="max-w-md"
              />
            </div>
            <Button className="mt-3" type="submit" disabled={isCreatingTag}>
              {isCreatingTag ? "Creating..." : "Create tag"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* tags list card */}
      <Card>
        <CardHeader>
          <CardTitle>All tags</CardTitle>
          <CardDescription>Manage tags for your blog posts</CardDescription>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center gap-3 bg-gray-50">
              <div className="flex items-center justify-center">
                <Loading />
              </div>
              <p className="text-lg text-gray-600">
                Loading admin dashboard...
              </p>
            </div>
          ) : tags.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              <div className="mb-4 text-4xl">🏷️</div>
              <p className="text-lg font-medium">No tags found</p>
              <p className="text-sm">
                Create your first tag to categorize posts
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {tags.map((tag) => (
                <div
                  key={tag.id}
                  className="flex items-center justify-between rounded-lg border bg-white p-4 transition-shadow hover:shadow-md"
                >
                  <div className="flex-1">
                    <h3 className="text-lg font-medium">{tag.name}</h3>
                    <div className="flex items-center text-gray-500">
                      <span>{tag._count?.posts || 0}</span>
                      <span>.</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <EditTagDialog tag={tag} onTagUpdated={fetchTags} />
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteTag(tag.id, tag.name)}
                      disabled={
                        tag._count?.posts ? tag._count.posts > 0 : false
                      }
                      title={
                        tag._count?.posts && tag._count.posts > 0
                          ? "Cannot delete tag that is being used by posts"
                          : "Delete tag"
                      }
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TagsSection;
