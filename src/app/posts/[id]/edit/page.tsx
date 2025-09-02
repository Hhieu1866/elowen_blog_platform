/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import api from "@/lib/api";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { cn } from "@/lib/utils";

type Category = { id: string; name: string };
type Tag = { id: string; name: string };

export default function EditPostPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  // Form states
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [published, setPublished] = useState<boolean>(true);

  // Data states
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await api.get("/categories");
        setCategories(res.data?.data ?? []);
      } catch (e: any) {
        const msg = resErr(e, "Failed to load categories");
        setErrorMsg(msg);
        toast.error(msg);
      }
    };
    loadCategories();
  }, []);

  // Load tags
  useEffect(() => {
    const loadTags = async () => {
      try {
        const res = await api.get("/tags");
        setTags(res.data?.data ?? []);
      } catch (e: any) {
        const msg = resErr(e, "Failed to load tags");
        setErrorMsg(msg);
        toast.error(msg);
      }
    };
    loadTags();
  }, []);

  // Load post data
  useEffect(() => {
    if (!id) return;

    const loadPost = async () => {
      try {
        setIsLoading(true);
        setErrorMsg(null);

        const res = await api.get(`/posts/${id}`);
        const postData = res.data?.data;

        if (postData) {
          setTitle(postData.title || "");
          setContent(postData.content || "");
          setThumbnailUrl(postData.thumbnailUrl || null);
          setCategoryId(postData.category?.id || undefined);
          setSelectedTagIds(postData.tags?.map((tag: Tag) => tag.id) || []);
          setPublished(postData.published || false);
        }
      } catch (e: any) {
        const msg = resErr(e, "Failed to load post");
        setErrorMsg(msg);
        toast.error(msg);
      } finally {
        setIsLoading(false);
      }
    };

    loadPost();
  }, [id]);

  const toggleTag = (tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId],
    );
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!title.trim() || !content.trim()) {
      const msg = "Please fill in title and content";
      setErrorMsg(msg);
      toast.error(msg);
      return;
    }

    try {
      setIsLoading(true);

      const payload: any = {
        title: title.trim(),
        content: content.trim(),
        published,
        ...(thumbnailUrl ? { thumbnailUrl } : {}),
        categoryId: categoryId ?? null,
        ...(selectedTagIds.length ? { tagIds: selectedTagIds } : {}),
      };

      await api.put(`/posts/${id}`, payload);

      toast.success("Post updated successfully");
      router.push(`/posts/${id}`);
    } catch (e: any) {
      const msg = resErr(e, "Failed to update post");
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-6 py-8 md:px-48">
      <Card className="mx-auto max-w-3xl">
        <CardHeader>
          <CardTitle>Edit Post</CardTitle>
          <CardDescription>
            Update your post title, content, image and settings.
          </CardDescription>
        </CardHeader>

        <form onSubmit={onSubmit}>
          <CardContent className="space-y-6">
            {errorMsg && (
              <div className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
                {errorMsg}
              </div>
            )}

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter your post title"
                required
                disabled={isLoading}
              />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                className="min-h-[200px]"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your post content here..."
                disabled={isLoading}
              />
            </div>

            {/* Thumbnail upload */}
            <div className="space-y-2">
              <Label>Post Image</Label>
              <div className="flex items-center gap-4">
                <CldUploadWidget
                  uploadPreset={uploadPreset}
                  options={{
                    multiple: false,
                    sources: ["local", "url"],
                    resourceType: "image",
                    singleUploadAutoClose: false,
                    showCompletedButton: true,
                    maxFileSize: 5000000, // 5MB
                    clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
                  }}
                  onSuccess={(result: any) => {
                    const url = result?.info?.secure_url as string | undefined;
                    if (url) {
                      setThumbnailUrl(url);
                      toast.success("Image uploaded successfully!");
                    }
                  }}
                >
                  {({ open }) => (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => open?.()}
                      disabled={isLoading}
                    >
                      {thumbnailUrl ? "Change Image" : "Upload Image"}
                    </Button>
                  )}
                </CldUploadWidget>

                {thumbnailUrl && (
                  <div className="relative">
                    <Image
                      src={thumbnailUrl}
                      alt="Post image"
                      width={100}
                      height={60}
                      className="h-15 w-25 rounded border object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => setThumbnailUrl(null)}
                      disabled={isLoading}
                      className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs"
                    >
                      ×
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={categoryId ?? "#"}
                onValueChange={(v) => setCategoryId(v === "#" ? undefined : v)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="#">No category</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tags */}
            <div className="space-y-3">
              <Label>Tags</Label>
              <div className="max-h-44 overflow-auto rounded-md">
                {tags.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No tags available
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => {
                      const isActive = selectedTagIds.includes(tag.id);
                      return (
                        <button
                          key={tag.id}
                          type="button"
                          disabled={isLoading}
                          onClick={() => toggleTag(tag.id)}
                          className={cn(
                            "rounded-full border px-4 py-1",
                            isActive
                              ? "border-black bg-black text-white"
                              : "border-black bg-white text-black hover:bg-black/5",
                          )}
                          aria-pressed={isActive}
                        >
                          {tag.name}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Selected: {selectedTagIds.length} tag(s)
              </p>
            </div>

            {/* Publish toggle */}
            <div className="flex items-center gap-2">
              <Checkbox
                id="published"
                checked={published}
                onCheckedChange={(v) => setPublished(Boolean(v))}
                disabled={isLoading}
              />
              <Label htmlFor="published">
                Publish this post (make it visible to everyone)
              </Label>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Post"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

function resErr(e: any, fallback: string) {
  return (
    e?.response?.data?.error ||
    e?.response?.data?.message ||
    e?.message ||
    fallback
  );
}
