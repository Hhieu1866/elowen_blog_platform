/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import { toast } from "sonner";
import api from "@/lib/api";
import { CldUploadWidget } from "next-cloudinary";
import { useSignal } from "@preact/signals-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  BtnBold,
  BtnBulletList,
  BtnClearFormatting,
  BtnItalic,
  BtnLink,
  BtnNumberedList,
  BtnRedo,
  BtnStrikeThrough,
  BtnStyles,
  BtnUnderline,
  BtnUndo,
  Editor,
  EditorProvider,
  HtmlButton,
  Separator,
  Toolbar,
} from "react-simple-wysiwyg";

type Category = { id: string; name: string };
type Tag = { id: string; name: string };

export default function CreatePostPage() {
  const router = useRouter();

  // form
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);

  // category & tags
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

  // publish toggle
  const [published, setPublished] = useState<boolean>(true);

  // signals
  const loading = useSignal(false);
  const errorMsg = useSignal<string | null>(null);
  const catsLoading = useSignal(false);
  const tagsLoading = useSignal(false);

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

  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

  const toggleTag = (id: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
    );
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    errorMsg.value = null;

    if (!title.trim() || !content.trim()) {
      const msg = "Please fill in title and content";
      errorMsg.value = msg;
      toast.error(msg);
      return;
    }

    try {
      loading.value = true;

      const payload: any = {
        title,
        content,
        published,
        ...(thumbnailUrl ? { thumbnailUrl } : {}),
        categoryId: categoryId ?? null,
        ...(selectedTagIds.length ? { tagIds: selectedTagIds } : {}),
      };

      await api.post("/posts", payload);

      toast.success("Post created successfully");
      router.push(`/profile`);
    } catch (e: any) {
      const msg = resErr(e, "Failed to create post");
      errorMsg.value = msg;
      toast.error(msg);
    } finally {
      loading.value = false;
    }
  };

  return (
    <div className="px-6 py-8 md:px-48">
      <Card className="mx-auto max-w-3xl">
        <CardHeader>
          <CardTitle>Create new post</CardTitle>
          <CardDescription>
            Write with a textarea for now, upload a thumbnail to Cloudinary,
            choose category & tags.
          </CardDescription>
        </CardHeader>

        <form onSubmit={onSubmit}>
          <CardContent className="space-y-6">
            {errorMsg.value && (
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
                placeholder="My first blog post"
                required
                disabled={loading.value}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <div>
                <EditorProvider>
                  <Editor
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write something..."
                    containerProps={{
                      style: {
                        minHeight: "200px",
                        resize: "vertical",
                        overflow: "auto",
                      },
                    }}
                    className="flex items-center justify-between"
                  >
                    <Toolbar
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <BtnUndo />
                      <BtnRedo />
                      <Separator />
                      <BtnBold />
                      <BtnItalic />
                      <BtnUnderline />
                      <BtnStrikeThrough />
                      <Separator />
                      <BtnNumberedList />
                      <BtnBulletList />
                      <Separator />
                      <BtnLink />
                      <BtnClearFormatting />
                      <HtmlButton />
                      <Separator />
                      <BtnStyles />
                    </Toolbar>
                  </Editor>
                </EditorProvider>
              </div>
            </div>

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
                    maxFileSize: 5000000, // 5MB
                    clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
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
                      disabled={loading.value}
                    >
                      Upload thumbnail
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
              <p className="text-xs text-muted-foreground">
                Uses <code>next-cloudinary</code> Upload Widget with your
                unsigned preset.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={categoryId ?? undefined}
                onValueChange={(v) => setCategoryId(v === "#" ? undefined : v)}
                disabled={loading.value || catsLoading.value}
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
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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
                      // <label
                      //   key={tag.id}
                      //   className="flex items-center gap-2 text-sm"
                      // >
                      //   <Checkbox
                      //     checked={selectedTagIds.includes(tag.id)}
                      //     onCheckedChange={() => toggleTag(tag.id)}
                      //     disabled={loading.value}
                      //   />
                      //   <span>{tag.name}</span>
                      // </label>
                      return (
                        <button
                          key={tag.id}
                          type="button"
                          disabled={loading.value}
                          onClick={() => toggleTag(tag.id)}
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

            <div className="flex items-center gap-2">
              <Checkbox
                id="published"
                checked={published}
                onCheckedChange={(v) => setPublished(Boolean(v))}
              />
              <Label htmlFor="published">Publish now</Label>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.back()}
              disabled={loading.value}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading.value}>
              {loading.value ? "Saving…" : "Create post"}
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
