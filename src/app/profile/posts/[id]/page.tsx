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
import { useEffect, useState } from "react";
import { toast } from "sonner";

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

const latestPosts = [
  {
    img: "/ep05.png",
    alt: "The Problem of today’s cultural development",
    title: "The Problem of today’s cultural development",
    date: "January 21, 2022",
    duration: "45 Min",
  },
  {
    img: "/ep04.png",
    alt: "The hidden messages of Jack Nielson",
    title: "The hidden messages of Jack Nielson",
    date: "January 21, 2022",
    duration: "1h 4Min",
  },
  {
    img: "/ep03.png",
    alt: "Behind the scenes of the street art culture",
    title: "Behind the scenes of the street art culture",
    date: "January 21, 2022",
    duration: "56 Min",
  },
];

const PostDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const isLoading = useSignal(true);
  const isError = useSignal<string | null>(null);

  const [post, setPost] = useState<Post | null>(null);

  // useEffect(() => {
  //   let mounted = true;
  //   (async () => {
  //     try {
  //       isLoading.value = true;
  //       isError.value = null;

  //       const res = await api.get(`/posts/${id}`);
  //       if (!mounted) return;

  //       setPost(res.data?.data ?? null);
  //       if (!res.data?.data) {
  //         isError.value = "Post not found";
  //       }
  //     } catch (e: any) {
  //       if (!mounted) return;
  //       const msg =
  //         e?.response?.data?.message ||
  //         e?.message ||
  //         "Failed to load post details";
  //       isError.value = msg;
  //       toast.error(msg);
  //       setPost(null);
  //     } finally {
  //       if (mounted) isLoading.value = false;
  //     }
  //   })();
  //   return () => {
  //     mounted = false;
  //   };
  // }, [id]);

  // if (isLoading.value)
  //   return (
  //     <div className="px-6 py-8 md:px-48">
  //       <div className="flex flex-col gap-8 md:flex-row md:gap-12">
  //         <div className="w-full md:w-auto md:flex-shrink-0">
  //           <div className="w-full md:w-[360px]">
  //             <Skeleton className="aspect-square w-full rounded-sm" />
  //           </div>
  //         </div>
  //         <div className="flex-1 space-y-4">
  //           <Skeleton className="h-10 w-2/3" />
  //           <Skeleton className="h-4 w-full" />
  //           <Skeleton className="h-4 w-5/6" />
  //           <Skeleton className="h-4 w-4/6" />
  //         </div>
  //       </div>
  //       <div className="mt-10 space-y-3">
  //         <Skeleton className="h-4 w-full" />
  //         <Skeleton className="h-4 w-11/12" />
  //         <Skeleton className="h-4 w-10/12" />
  //       </div>
  //     </div>
  //   );

  // // error or not found
  // if (!post || isError.value) {
  //   return (
  //     <div className="px-6 py-12 md:px-48">
  //       <p className="text-lg font-semibold">Post not found</p>
  //       <p className="text-sm text-muted-foreground">
  //         {isError.value ?? "The post you’re looking for doesn’t exist."}
  //       </p>
  //       <div className="mt-6">
  //         <Button asChild>
  //           <Link href="/profile">Back to profile</Link>
  //         </Button>
  //       </div>
  //     </div>
  //   );
  // }

  // // computed
  // const words = post.content?.trim()?.split(/\s+/).length ?? 0;
  // const readMin = Math.max(1, Math.ceil(words / 200));

  return (
    <div className="px-6 md:px-48">
      <div className="flex items-center justify-between py-8">
        <div
          className="flex cursor-pointer items-center gap-1"
          onClick={() => router.back()}
        >
          <ArrowLeft className="size-4" />
          <p className="font-bold uppercase">go back</p>
        </div>
        <p className="text-2xl font-bold md:text-3xl">POSTS</p>
      </div>

      <div className="">
        <h1 className="text-center text-4xl font-bold uppercase md:text-8xl">
          Hope dies last
        </h1>

        <div className="mt-16 flex flex-col items-start justify-between md:flex-row md:items-center">
          <div className="flex flex-col md:flex-row md:items-center md:gap-7">
            <div className="mb-2 flex items-center gap-2 md:mb-0">
              <p className="font-semibold">Text</p>
              <span className="underline">Anne Henry</span>
            </div>
            <div className="mb-2 flex items-center gap-2 md:mb-0">
              <p className="font-semibold">Date</p>
              <span className="underline">October 15, 2022</span>
            </div>
            <div className="flex items-center gap-2">
              <p className="font-semibold">Read</p>
              <span className="underline">10 Min</span>
            </div>
          </div>
          <span className="btn-sweep-effect mt-3 rounded-full border border-black bg-white px-3 py-1 uppercase text-black before:bg-black hover:text-white md:mt-0">
            <span>Art</span>
          </span>
        </div>

        {/* thumbnail */}
        <AspectRatio ratio={16 / 9} className="mt-10 w-full">
          <Image
            src={"/hero_img.png"}
            alt="post.title"
            fill
            priority
            className="object-cover"
            // unoptimized
          />
        </AspectRatio>

        {/* content */}
        <div className="flex flex-col gap-16 py-10 md:flex-row md:justify-between md:px-48 md:py-24">
          {/* left - post info */}
          <div className="md:w-1/3">
            <div className="md:sticky md:top-10">
              <div className="flex items-center gap-4">
                <div className="relative size-20 overflow-hidden rounded-full">
                  <div>
                    <Image
                      src="/louise_jensen.png"
                      alt="Louise Jensen"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <p className="min-w-0 text-3xl font-bold">Anne Henry</p>
              </div>

              <Separator className="my-9 bg-black" />

              <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <p className="font-bold">Date</p>
                  <p>October 15, 2022</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="font-bold">Read</p>
                  <p>10 Min</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="font-bold">Share</p>
                  <div className="flex gap-4">
                    <Instagram className="size-5" />
                    <Twitter className="size-5" />
                    <Facebook className="size-5" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* right - post content */}
          <div className="text-justify md:w-2/3">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Egestas
            dui id ornare arcu odio ut sem. Cras ornare arcu dui vivamus arcu
            felis bibendum ut. Porttitor leo a diam. Porttitor rhoncus dolor
            purus non enim praesent elementum. Eget dolor morbi non arcu risus
            quis varius. Posuere ac ut consequat semper viverra nam libero. In
            ornare quam viverra orci sagittis eu. Tristique risus nec feugiat in
            fermentum posuere urna nec. Tempus quam pellentesque nec nam aliquam
            sem et. Convallis a cras semper auctor neque vitae tempus quam
            pellentesque. Sollicitudin ac orci phasellus egestas tellus rutrum
            tellus pellentesque. Sed egestas egestas fringilla phasellus
            faucibus scelerisque eleifend donec pretium. Sit amet porttitor eget
            dolor morbi non arcu risus. Justo eget magna fermentum iaculis eu
            non diam phasellus. Sit amet luctus venenatis lectus magna
            fringilla. Neque vitae tempus quam pellentesque nec nam. Tellus orci
            ac auctor augue mauris augue neque gravida. Tempus imperdiet nulla
            malesuada pellentesque elit eget gravida cum sociis. Id eu nisl nunc
            mi ipsum faucibus vitae aliquet. Duis convallis convallis tellus id
            interdum velit laoreet id. Vulputate mi sit amet mauris commodo
            quis. Semper viverra nam libero justo laoreet sit amet. Eget nullam
            non nisi est sit. Nibh cras pulvinar mattis nunc sed blandit libero.
            Ac felis donec et odio pellentesque diam volutpat. Quis varius quam
            quisque id diam vel quam elementum. Felis bibendum ut tristique et
            egestas quis ipsum suspendisse ultrices. Id diam vel quam elementum
            pulvinar etiam non. Non consectetur a erat nam at lectus urna duis
            convallis. Lorem ipsum dolor sit amet, consectetur adipiscing elit,
            sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            Egestas dui id ornare arcu odio ut sem. Cras ornare arcu dui vivamus
            arcu felis bibendum ut. Porttitor leo a diam. Porttitor rhoncus
            dolor purus non enim praesent elementum. Eget dolor morbi non arcu
            risus quis varius. Posuere ac ut consequat semper viverra nam
            libero. In ornare quam viverra orci sagittis eu. Tristique risus nec
            feugiat in fermentum posuere urna nec. Tempus quam pellentesque nec
            nam aliquam sem et. Convallis a cras semper auctor neque vitae
            tempus quam pellentesque. Sollicitudin ac orci phasellus egestas
            tellus rutrum tellus pellentesque. Sed egestas egestas fringilla
            phasellus faucibus scelerisque eleifend donec pretium. Sit amet
            porttitor eget dolor morbi non arcu risus. Justo eget magna
            fermentum iaculis eu non diam phasellus. Sit amet luctus venenatis
            lectus magna fringilla. Neque vitae tempus quam pellentesque nec
            nam. Tellus orci ac auctor augue mauris augue neque gravida. Tempus
            imperdiet nulla malesuada pellentesque elit eget gravida cum sociis.
            Id eu nisl nunc mi ipsum faucibus vitae aliquet. Duis convallis
            convallis tellus id interdum velit laoreet id. Vulputate mi sit amet
            mauris commodo quis. Semper viverra nam libero justo laoreet sit
            amet. Eget nullam non nisi est sit. Nibh cras pulvinar mattis nunc
            sed blandit libero. Ac felis donec et odio pellentesque diam
            volutpat. Quis varius quam quisque id diam vel quam elementum. Felis
            bibendum ut tristique et egestas quis ipsum suspendisse ultrices. Id
            diam vel quam elementum pulvinar etiam non. Non consectetur a erat
            nam at lectus urna duis convallis.
          </div>
        </div>

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

        <div className="grid grid-cols-1 md:grid-cols-3">
          {latestPosts.map((pod, idx) => (
            <Card
              key={idx}
              className="flex w-full flex-col gap-10 rounded-none border border-black p-6 shadow-none md:p-11"
            >
              <div className="flex items-center justify-between">
                <p className="font-semibold">{pod.date}</p>
                <span className="btn-sweep-effect mt-3 rounded-full border border-black bg-white px-3 py-1 uppercase text-black before:bg-black hover:text-white md:mt-0">
                  <span>Art</span>
                </span>
              </div>

              {/* Image */}
              <div className="overflow-hidden">
                <Image
                  src={pod.img}
                  alt={pod.alt}
                  width={1920}
                  height={1080}
                  className="h-auto w-full transition-transform duration-300 ease-in-out hover:scale-110"
                />
              </div>

              {/* Title */}
              <CardHeader className="space-y-3 p-0">
                <CardTitle className="line-clamp-2 text-3xl font-bold">
                  {pod.title}
                </CardTitle>
                <p className="line-clamp-3">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Egestas dui id ornare arcu odio ut sem. Cras ornare arcu dui
                  vivamus arcu felis bibendum ut. Porttitor leo a diam.
                </p>
              </CardHeader>

              {/* Meta */}
              <CardFooter className="flex flex-col items-start gap-3 p-0 text-sm md:flex-row md:items-center md:gap-7">
                <div className="space-x-2">
                  <span className="font-bold">Text</span>
                  <span>Anne Henry</span>
                </div>
                <div className="space-x-2">
                  <span className="font-bold">Duration</span>
                  <span>{pod.duration}</span>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostDetailPage;
