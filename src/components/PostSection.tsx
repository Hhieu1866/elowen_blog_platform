/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "./ui/separator";
import { useCallback, useEffect, useState } from "react";
import api from "@/lib/api";
import { toast } from "sonner";
import { AspectRatio } from "./ui/aspect-ratio";
import Loading from "./Loading";
import { Skeleton } from "./ui/skeleton";

interface Post {
  id: string;
  title: string;
  content: string;
  published: boolean;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  thumbnailUrl?: string | null;
  category?: { id: string; name: string } | null;
  author?: { id: string; name: string | null } | null;
}

const POPULAR_POSTS = [
  {
    number: "01",
    title: "Street art festival",
    author: "Cristofer Vaccaro",
  },
  {
    number: "02",
    title: "Hope dies last",
    author: "Anne Henry",
  },
  {
    number: "03",
    title: "Artists who want to rise above",
    author: "Anna Nielsen",
  },
] as const;

const PostSection = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getReadTime = useCallback((content: string) => {
    const words = content?.trim()?.split(/\s+/)?.length ?? 0;
    return Math.max(1, Math.ceil(words / 200));
  }, []);

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get(
          "/posts?limit=5&sortBy=createdAt&sortOrder=desc&published=true",
        );
        setPosts(response.data?.data ?? []);
      } catch (err) {
        const message =
          (err as any)?.response?.data?.message ?? "Failed to load posts";
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="flex flex-col gap-10 px-6 md:flex-row md:gap-24 md:px-48 md:py-16">
      {/* LEFT */}

      <div className="w-full md:w-3/4">
        {loading ? (
          <div className="space-y-8">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <div className="flex flex-col gap-8 py-10 md:flex-row md:gap-12 md:py-12">
                  {/* Loading skeleton cho image */}
                  <div className="w-[240px]">
                    <Skeleton className="aspect-square w-full rounded-sm" />
                  </div>

                  {/* Loading skeleton cho content */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex flex-col gap-5">
                      <Skeleton className="h-8 w-3/4 rounded" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-full rounded" />
                        <Skeleton className="h-4 w-2/3 rounded" />
                        <Skeleton className="h-4 w-4/5 rounded" />
                      </div>
                    </div>

                    {/* Loading skeleton cho info line */}
                    <div className="mt-8 flex flex-col items-start justify-between md:mt-0 md:flex-row md:items-center">
                      <div className="flex flex-col md:flex-row md:items-center md:gap-7">
                        <div className="mb-2 flex items-center gap-2 md:mb-0">
                          <Skeleton className="h-4 w-8 rounded" />
                          <Skeleton className="h-4 w-16 rounded" />
                        </div>
                        <div className="mb-2 flex items-center gap-2 md:mb-0">
                          <Skeleton className="h-4 w-8 rounded" />
                          <Skeleton className="h-4 w-20 rounded" />
                        </div>
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-4 w-8 rounded" />
                          <Skeleton className="h-4 w-12 rounded" />
                        </div>
                      </div>

                      <Skeleton className="mt-3 h-8 w-20 rounded-full md:mt-0" />
                    </div>
                  </div>
                </div>
                {i < 3 && <div className="h-px w-full bg-black" />}
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            {posts.map((post, index) => (
              <div key={post.id}>
                <div className="flex flex-col gap-8 py-10 md:flex-row md:gap-12 md:py-12">
                  {/* image */}
                  <div className="w-[240px]">
                    <AspectRatio
                      ratio={1}
                      className="overflow-hidden rounded-sm"
                    >
                      {post.thumbnailUrl ? (
                        <Image
                          src={post.thumbnailUrl || "/fallback.webp"}
                          alt={post.title}
                          fill
                          className="object-cover"
                          priority
                        />
                      ) : (
                        <div className="h-full w-full bg-muted" />
                      )}
                    </AspectRatio>
                  </div>

                  {/* content */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex flex-col gap-5">
                      <h1 className="text-3xl font-bold">{post.title}</h1>
                      <p className="line-clamp-3 text-base">{post.content}</p>
                    </div>

                    {/* info line */}
                    <div className="mt-8 flex flex-col items-start justify-between md:mt-0 md:flex-row md:items-center">
                      <div className="flex flex-col md:flex-row md:items-center md:gap-7">
                        <div className="mb-2 flex items-center gap-2 md:mb-0">
                          <p className="font-semibold">Text</p>
                          <span className="underline">
                            {post.author?.name ?? "Unknown"}
                          </span>
                        </div>
                        <div className="mb-2 flex items-center gap-2 md:mb-0">
                          <p className="font-semibold">Date</p>
                          <span>{formatDate(post.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">Read</p>
                          <span>{getReadTime(post.content)} Min</span>
                        </div>
                      </div>

                      <Button className="btn-sweep-effect mt-3 rounded-full border border-black bg-white px-3 py-1 uppercase text-black before:bg-black hover:text-white md:mt-0">
                        <span>{post.category?.name ?? "General"}</span>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* divider */}
                {index < posts.length - 1 && <Separator className="bg-black" />}
              </div>
            ))}
          </>
        )}
      </div>

      {/* RIGHT */}
      <div className="w-full md:w-1/4">
        <div className="flex flex-col gap-4">
          <h3 className="text-base font-bold uppercase">Printmagazine</h3>
          <p className="text-5xl font-bold tracking-widest">03/2022</p>
          <Image
            src="/fyrre.png"
            alt="Magazine Cover 3/22"
            width={1920}
            height={1080}
          />
          <Button className="btn-sweep-effect rounded-none border border-black bg-black p-8 uppercase text-white before:bg-white hover:text-black">
            <span>Buy now</span>
          </Button>
        </div>

        {/* Popular posts */}
        <div className="mt-8 flex flex-col md:mt-16">
          <h3 className="text-base font-bold uppercase">Popular posts</h3>

          {POPULAR_POSTS.map((post, idx, arr) => (
            <div key={idx}>
              <div className="py-7">
                <div className="flex gap-8">
                  <p className="text-2xl font-bold">{post.number}</p>
                  <div className="space-y-3">
                    <p className="text-2xl font-bold">{post.title}</p>
                    <div className="space-x-2 text-sm">
                      <span className="font-bold">Author</span>
                      <span className="underline">{post.author}</span>
                    </div>
                  </div>
                </div>
              </div>

              {idx < arr.length - 1 && <Separator className="bg-black" />}
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <Card className="mt-8 rounded-none border-0 bg-zinc-100 shadow-none md:mt-16">
          <CardHeader>
            <CardTitle className="text-base font-bold uppercase">
              Newsletter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-3xl font-bold text-black">
              Design News to your inbox
            </CardDescription>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 rounded-none">
            <Input
              placeholder="Email"
              className="rounded-none border-0 bg-white py-7 text-start shadow-none"
            />
            <Button className="w-full rounded-none p-7">SIGN UP</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default PostSection;
