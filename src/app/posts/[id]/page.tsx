/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/api";
import { useSignal } from "@preact/signals-react";
import {
  ArrowLeft,
  ArrowRight,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import CommentSection from "./CommentSection";

type Post = {
  id: string;
  title: string;
  content: string;
  published: boolean;
  createdAt: string;
  thumbnailUrl?: string | null;
  author: { id: string; name: string | null };
  category: { id: string; name: string } | null;
  tags: { id: string; name: string }[];
  comments: {
    id: string;
    content: string;
    createdAt: string;
    author: { id: string; name: string | null };
  }[];
};

type SimplePost = {
  id: string;
  title: string;
  createdAt: string;
  thumbnailUrl?: string | null;
  category?: { id: string; name: string } | null;
};

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  // signals
  const isLoading = useSignal(true);
  const isError = useSignal<string | null>(null);

  // state
  const [post, setPost] = useState<Post | null>(null);
  const [latest, setLatest] = useState<SimplePost[]>([]);

  // derived
  const readMin = useMemo(() => {
    const words = post?.content?.trim()?.split(/\s+/).length ?? 0;
    return Math.max(1, Math.ceil(words / 200));
  }, [post?.content]);

  const shareUrl =
    typeof window !== "undefined"
      ? window.location.href
      : "https://example.com";

  // fetch main post
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        isLoading.value = true;
        isError.value = null;

        const res = await api.get(`/posts/${id}`);
        if (!mounted) return;

        const p = res.data?.data as Post | undefined;
        if (!p) {
          isError.value = "Post not found";
          setPost(null);
          return;
        }
        setPost(p);
      } catch (e: any) {
        if (!mounted) return;
        const msg =
          e?.response?.data?.message ||
          e?.message ||
          "Failed to load post details";
        isError.value = msg;
        setPost(null);
        toast.error(msg);
      } finally {
        if (mounted) isLoading.value = false;
      }
    })();

    return () => {
      mounted = false;
    };
  }, [id]);

  // fetch latest (3 bài, exclude current id)
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        // lấy 3 bài mới nhất, published=true
        const res = await api.get(
          `/posts?limit=3&sortBy=createdAt&sortOrder=desc&published=true`,
        );
        if (!alive) return;
        const arr: SimplePost[] = (res.data?.data ?? [])
          .filter((p: SimplePost) => p.id !== id)
          .slice(0, 3);
        setLatest(arr);
      } catch {}
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  // ---- loading skeleton ----
  if (isLoading.value) {
    return (
      <div className="px-6 py-8 md:px-48">
        <div className="flex items-center justify-between py-8">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-5 w-24" />
          </div>
          <Skeleton className="h-7 w-24" />
        </div>

        <Skeleton className="mx-auto h-12 w-3/4" />
        <div className="mt-6 flex items-center justify-center gap-6">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-7 w-20" />
        </div>

        <div className="mt-10">
          <Skeleton className="aspect-video w-full" />
        </div>

        <div className="flex flex-col gap-16 py-10 md:flex-row md:justify-between md:px-48 md:py-24">
          <div className="md:w-1/3">
            <Skeleton className="h-20 w-full" />
            <Separator className="my-9 bg-black" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
          </div>

          <div className="space-y-3 md:w-2/3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-10/12" />
            <Skeleton className="h-4 w-9/12" />
            <Skeleton className="h-4 w-8/12" />
          </div>
        </div>
      </div>
    );
  }

  // ---- error / not found ----
  if (!post || isError.value) {
    return (
      <div className="px-6 py-12 md:px-48">
        <div className="mb-6 flex items-center gap-2">
          <ArrowLeft className="size-4" />
          <Button variant="link" onClick={() => router.back()} className="p-0">
            Go back
          </Button>
        </div>
        <p className="text-lg font-semibold">Post not found</p>
        <p className="text-sm text-muted-foreground">
          {isError.value ?? "The post you’re looking for doesn’t exist."}
        </p>
        <div className="mt-6">
          <Button asChild>
            <Link href="/profile">Back to profile</Link>
          </Button>
        </div>
      </div>
    );
  }

  // ---- render ----
  return (
    <div className="px-6 md:px-48">
      {/* header bar */}
      <div className="flex items-center justify-between py-8">
        <button
          className="flex cursor-pointer items-center gap-1"
          onClick={() => router.back()}
        >
          <ArrowLeft className="size-4" />
          <p className="font-bold uppercase">go back</p>
        </button>
        <p className="text-2xl font-bold md:text-3xl">POSTS</p>
      </div>

      {/* title */}
      <h1 className="mt-8 text-center text-4xl font-bold uppercase md:mt-14 md:text-8xl">
        {post.title}
      </h1>

      {/* meta row */}
      <div className="mt-16 flex flex-col items-start justify-between md:flex-row md:items-center">
        <div className="flex flex-col md:flex-row md:items-center md:gap-7">
          <div className="mb-2 flex items-center gap-2 md:mb-0">
            <p className="font-semibold">Text</p>
            <span className="underline">{post.author?.name ?? "Author"}</span>
          </div>
          <div className="mb-2 flex items-center gap-2 md:mb-0">
            <p className="font-semibold">Date</p>
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <p className="font-semibold">Read</p>
            <span>{readMin} Min</span>
          </div>
        </div>
        <span className="btn-sweep-effect mt-3 rounded-full border border-black bg-white px-3 py-1 uppercase text-black before:bg-black hover:text-white md:mt-0">
          <span>{post.category?.name ?? "General"}</span>
        </span>
      </div>

      {/* thumbnail */}
      <div className="mt-10 w-full">
        {post.thumbnailUrl ? (
          <AspectRatio ratio={16 / 9} className="w-full">
            <Image
              src={post.thumbnailUrl}
              alt={post.title}
              fill
              priority
              className="object-cover"
              unoptimized
            />
          </AspectRatio>
        ) : (
          <AspectRatio ratio={16 / 9} className="w-full">
            <Image
              src={"/hero_img.png"}
              alt={post.title}
              fill
              priority
              className="object-cover"
            />
          </AspectRatio>
        )}
      </div>

      {/* content zone */}
      <div className="flex flex-col gap-16 py-10 md:flex-row md:justify-between md:px-48 md:py-24">
        {/* left - post info */}
        <div className="md:w-1/3">
          <div className="md:sticky md:top-10">
            <div className="flex items-center gap-4">
              <div className="relative size-20 overflow-hidden rounded-full">
                <Image
                  src="/louise_jensen.png"
                  alt={post.author?.name ?? "Author"}
                  fill
                  className="object-cover"
                />
              </div>
              <p className="min-w-0 text-3xl font-bold">
                {post.author?.name ?? "Author"}
              </p>
            </div>

            <Separator className="my-9 bg-black" />

            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <p className="font-bold">Date</p>
                <p>{new Date(post.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-bold">Read</p>
                <p>{readMin} Min</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-bold">Share</p>
                <div className="flex gap-4">
                  <Link
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                      shareUrl,
                    )}&text=${encodeURIComponent(post.title)}`}
                    target="_blank"
                    aria-label="Share on Twitter"
                  >
                    <Twitter className="size-5" />
                  </Link>
                  <Link
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                      shareUrl,
                    )}`}
                    target="_blank"
                    aria-label="Share on Facebook"
                  >
                    <Facebook className="size-5" />
                  </Link>
                  <Link
                    href={`https://www.instagram.com/`}
                    target="_blank"
                    aria-label="Open Instagram"
                  >
                    <Instagram className="size-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* right - post content */}
        <div className="prose max-w-none text-justify md:w-2/3">
          <p style={{ whiteSpace: "pre-line" }}>{post.content}</p>
        </div>
      </div>

      <Separator className="bg-black" />

      {/* COMMENT SECTION */}
      <CommentSection postId={post.id} initialComments={post.comments ?? []} />

      <Separator className="bg-black" />

      {/* Latest Posts */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="py-10 text-4xl font-bold uppercase md:text-6xl lg:text-8xl">
          Latest Posts
        </h1>
        <Button variant="link" className="flex h-auto items-center gap-2 p-0">
          <span className="hidden text-base font-bold uppercase md:block">
            See all
          </span>
          <ArrowRight className="size-5" />
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {latest.length === 0
          ? // fallback skeleton cho latest
            Array.from({ length: 3 }).map((_, i) => (
              <Card
                key={i}
                className="flex w-full flex-col gap-6 rounded-none border border-black p-6 shadow-none md:p-11"
              >
                <Skeleton className="h-5 w-28" />
                <Skeleton className="aspect-video w-full" />
                <CardHeader className="space-y-3 p-0">
                  <Skeleton className="h-8 w-5/6" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/6" />
                </CardHeader>
                <CardFooter className="flex items-center gap-7 p-0 text-sm">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-24" />
                </CardFooter>
              </Card>
            ))
          : latest.map((p) => (
              <Card
                key={p.id}
                className="flex w-full flex-col gap-10 rounded-none border border-black p-6 shadow-none md:p-11"
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </p>
                  <span className="btn-sweep-effect mt-3 rounded-full border border-black bg-white px-3 py-1 uppercase text-black before:bg-black hover:text-white md:mt-0">
                    <span>{p.category?.name ?? "General"}</span>
                  </span>
                </div>

                <div className="overflow-hidden">
                  <AspectRatio ratio={1 / 1}>
                    <Image
                      src={p.thumbnailUrl || "/hero_img.png"}
                      alt={p.title}
                      fill
                      className="object-cover transition-transform duration-300 ease-in-out hover:scale-110"
                      unoptimized={!p.thumbnailUrl}
                    />
                  </AspectRatio>
                </div>

                <CardHeader className="space-y-3 p-0">
                  <CardTitle className="line-clamp-2 text-3xl font-bold">
                    <Link href={`/posts/${p.id}`}>{p.title}</Link>
                  </CardTitle>
                </CardHeader>

                <CardFooter className="flex flex-col items-start gap-3 p-0 text-sm md:flex-row md:items-center md:gap-7">
                  <div className="space-x-2">
                    <span className="font-bold">Date</span>
                    <span>{new Date(p.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="space-x-2">
                    <span className="font-bold">Category</span>
                    <span>{p.category?.name ?? "—"}</span>
                  </div>
                </CardFooter>
              </Card>
            ))}
      </div>
    </div>
  );
}
