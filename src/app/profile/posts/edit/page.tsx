/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-expressions */
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
import { useSignal } from "@preact/signals-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type Category = { id: string; name: string };
type Tag = { id: string; name: string };

type PostForEdit = {
  id: string;
  title: string;
  content: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  thumbnailUrl?: string | null;
  category?: { id: string; name: string } | null;
  tags?: { id: string; name: string }[];
};

export default function EditPostPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  // form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState(""); // tạm textarea
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [published, setPublished] = useState<boolean>(true);

  // keep original for diff (optional)
  const [original, setOriginal] = useState<PostForEdit | null>(null);

  // signals
  const pageLoading = useSignal(true); // load post detail
  const saving = useSignal(false); // submit PUT
  const catsLoading = useSignal(false);
  const tagsLoading = useSignal(false);
  const errorMsg = useSignal<string | null>(null);

  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

  // load categories
  useEffect(() => {
    (async () => {
      try {
        catsLoading.value = true;
        const res = await api.get("/categories");
        setCategories(res.data?.data ?? []);
      } catch (e: any) {
        const msg = resErr(e, "Failed to load categories");
        errorMsg.value = msg;
        toast.error(msg);
      } finally {
        catsLoading.value = false;
      }
    })();
  }, []);

  // load tags
  useEffect(() => {
    (async () => {
      try {
        tagsLoading.value = true;
        const res = await api.get("/tags");
        setTags(res.data?.data ?? []);
      } catch (e: any) {
        const msg = resErr(e, "Failed to load tags");
        errorMsg.value = msg;
        toast.error(msg);
      } finally {
        tagsLoading.value = false;
      }
    })();
  }, []);

  // load post detail
  useEffect(() => {
    if (!id) return;
    let alive = true;
    (async () => {
      try {
        pageLoading.value = true;
        errorMsg.value = null;

        const res = await api.get(`/posts/${id}`);
        if (!alive) return;

        const p: PostForEdit = res.data?.data;
        setOriginal(p);

        // set form
        setTitle(p.title || "");
        setContent(p.content || "");
        setThumbnailUrl(p.thumbnailUrl ?? null);
        setCategoryId(p.category?.id ?? undefined);
        setSelectedTagIds((p.tags ?? []).map((t) => t.id));
        setPublished(Boolean(p.published));
      } catch (e: any) {
        const msg = resErr(e, "Failed to load post");
        errorMsg.value = msg;
        toast.error(msg);
      } finally {
        pageLoading.value = false;
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  const toggleTag = (tid: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tid) ? prev.filter((x) => x !== tid) : [...prev, tid],
    );
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    if (!title.trim() || !content.trim()) {
      const msg = "Please fill in title and content";
      errorMsg.value = msg;
      toast.error(msg);
      return;
    }

    try {
      saving.value = true;
      errorMsg.value = null;

      // gửi tối giản: chỉ các field đang có (API của bạn chấp nhận optional)
      const payload: any = {
        title,
        content,
        published,
        thumbnailUrl: thumbnailUrl || undefined,
        categoryId: categoryId ?? null, // null để gỡ category
        tagIds: selectedTagIds, // set list
      };

      await api.put(`/posts/${id}`, payload);

      toast.success("Post updated successfully");
      router.push(`/profile/posts/${id}`); // hoặc router.back()
    } catch (e: any) {
      const msg = resErr(e, "Failed to update post");
      errorMsg.value = msg;
      toast.error(msg);
    } finally {
      saving.value = false;
    }
  };

  return (
    <div className="px-6 py-8 md:px-48">
      <Card className="mx-auto max-w-3xl">
        <CardHeader>
          <CardTitle>Edit post</CardTitle>
          <CardDescription>
            Update the content, cover image, category & tags. (Textarea for now)
          </CardDescription>
        </CardHeader>

        <form onSubmit={onSubmit}>
          <CardContent className="space-y-6">
            {pageLoading.value && (
              <div className="rounded-md border px-3 py-2 text-sm">
                Loading post…
              </div>
            )}
            {errorMsg.value && !pageLoading.value && (
              <div className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
                {errorMsg.value}
              </div>
            )}

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={saving.value || pageLoading.value}
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
                disabled={saving.value || pageLoading.value}
              />
            </div>

            {/* Thumbnail */}
            <div className="space-y-2">
              <Label>Thumbnail</Label>
              <div className="flex items-center gap-4">
                <CldUploadWidget
                  uploadPreset={uploadPreset}
                  options={{
                    multiple: false,
                    sources: ["local", "url", "camera"],
                    resourceType: "image",
                    singleUploadAutoClose: false,
                    showCompletedButton: true,
                  }}
                  onSuccess={(result: any) => {
                    const url = result?.info?.secure_url as string | undefined;
                    if (url) {
                      setThumbnailUrl(url);
                      toast.success("Thumbnail uploaded");
                    }
                  }}
                >
                  {({ open }) => (
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => open?.()}
                      disabled={saving.value || pageLoading.value}
                    >
                      Upload new thumbnail
                    </Button>
                  )}
                </CldUploadWidget>

                {thumbnailUrl && (
                  <Image
                    src={thumbnailUrl}
                    alt="thumbnail preview"
                    width={128}
                    height={80}
                    unoptimized
                    className="h-20 w-32 rounded-md border object-cover"
                  />
                )}
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={categoryId ?? "#"}
                onValueChange={(v) => setCategoryId(v === "#" ? undefined : v)}
                disabled={
                  saving.value || pageLoading.value || catsLoading.value
                }
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      catsLoading.value ? "Loading..." : "Select a category"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="#">No category</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tags */}
            <div className="space-y-3">
              <Label>Tags</Label>
              <div className="max-h-44 overflow-auto rounded-md">
                {tagsLoading.value ? (
                  <p className="text-sm text-muted-foreground">Loading tags…</p>
                ) : tags.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No tags yet</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => {
                      const active = selectedTagIds.includes(tag.id);
                      return (
                        <button
                          key={tag.id}
                          type="button"
                          onClick={() => toggleTag(tag.id)}
                          disabled={saving.value || pageLoading.value}
                          className={cn(
                            "rounded-full border px-4 py-1",
                            active
                              ? "border-black bg-black text-white"
                              : "border-black bg-white text-black hover:bg-black/5",
                          )}
                          aria-pressed={active}
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

            {/* Publish */}
            <div className="flex items-center gap-2">
              <Checkbox
                id="published"
                checked={published}
                onCheckedChange={(v) => setPublished(Boolean(v))}
                disabled={saving.value || pageLoading.value}
              />
              <Label htmlFor="published">Published</Label>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.back()}
              disabled={saving.value}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving.value || pageLoading.value}>
              {saving.value ? "Saving…" : "Save changes"}
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
