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
import RichMarkdownEditor from "@/components/RichMarkdownEditor";
import Image from "next/image";

// ⚠️ host gây lỗi -> bỏ
type Publication = { id: string; title: string };

export default function CreatePostPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [contentMd, setContentMd] = useState("# Hello world");
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);

  const [publications, setPublications] = useState<Publication[]>([]);
  const [selectedPublicationId, setSelectedPublicationId] =
    useState<string>("");
  const [publishNow, setPublishNow] = useState(false);

  const loading = useSignal(false);
  const errorMsg = useSignal<string | null>(null);
  const pubsLoading = useSignal(false);

  useEffect(() => {
    (async () => {
      try {
        pubsLoading.value = true;
        const res = await api.get("/hashnode/publications");
        setPublications(res.data?.data ?? []);
      } catch (e: any) {
        const msg = resErr(e, "Failed to load Hashnode publications");
        errorMsg.value = msg;
        toast.error(msg);
      } finally {
        pubsLoading.value = false;
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    errorMsg.value = null;

    if (!title.trim() || !contentMd.trim()) {
      const msg = "Please fill in title and content";
      errorMsg.value = msg;
      toast.error(msg);
      return;
    }

    try {
      loading.value = true;

      // 1) create post in DB
      const createRes = await api.post("/posts", {
        title,
        content: contentMd, // markdown -> Hashnode contentMarkdown
        thumbnailUrl, // cloudinary url
      });
      const postId: string | undefined = createRes?.data?.data?.id;

      // 2) optional publish to Hashnode
      if (publishNow) {
        if (!selectedPublicationId) {
          const msg = "Please select a Hashnode publication";
          errorMsg.value = msg;
          toast.error(msg);
          loading.value = false;
          return;
        }
        await api.post("/hashnode/publish", {
          postId,
          publicationId: selectedPublicationId,
        });
        toast.success("Published to Hashnode successfully!");
      } else {
        toast.success("Post created successfully");
      }

      router.push("/profile");
    } catch (e: any) {
      const msg = resErr(e, "Failed to create or publish post");
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
            Write your article, upload a thumbnail to Cloudinary, and optionally
            publish to Hashnode.
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

            {/* Content editor */}
            <div className="space-y-2">
              <Label>Content</Label>
              <RichMarkdownEditor
                value={contentMd}
                onChange={setContentMd}
                disabled={loading.value}
                className="min-h-[260px]"
              />
              <p className="text-xs text-muted-foreground">
                The editor stores content as <b>Markdown</b>. Hashnode API
                publishes via <code>contentMarkdown</code>.
              </p>
            </div>

            {/* Thumbnail upload via next-cloudinary */}
            <div className="space-y-2">
              <Label>Thumbnail</Label>
              <div className="flex items-center gap-4">
                <CldUploadWidget
                  // ✅ bắt buộc để tránh "Unknown API key undefined"
                  uploadPreset={uploadPreset}
                  options={{
                    multiple: false,
                    sources: ["local", "url", "camera"],
                    resourceType: "image",
                  }}
                  onUpload={(result: any) => {
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
                    width={128} // ✅ cần width/height
                    height={80}
                    unoptimized // ✅ không cần cấu hình images.domains ngay
                    className="h-20 w-32 rounded-md border object-cover"
                  />
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Uses <code>next-cloudinary</code> Upload Widget with your
                unsigned preset.
              </p>
            </div>

            {/* Hashnode publish options */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="publishNow"
                  checked={publishNow}
                  onCheckedChange={(v) => setPublishNow(Boolean(v))}
                  disabled={loading.value}
                />
                <Label htmlFor="publishNow">Publish to Hashnode now</Label>
              </div>

              <div
                className={`grid grid-cols-1 gap-2 ${publishNow ? "opacity-100" : "pointer-events-none opacity-50"}`}
              >
                <Label>Publication</Label>
                <Select
                  value={selectedPublicationId}
                  onValueChange={setSelectedPublicationId}
                  disabled={loading.value || pubsLoading.value}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        pubsLoading.value
                          ? "Loading..."
                          : "Select a publication"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {publications.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.title} {/* ✅ bỏ p.host */}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {pubsLoading.value && (
                  <p className="text-xs text-muted-foreground">
                    Loading publications…
                  </p>
                )}
              </div>
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
