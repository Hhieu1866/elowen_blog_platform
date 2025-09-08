"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import React from "react";
import UserPostsManager from "./UserPostsManager";
import UserProfile from "./UserProfile";
import { useRouter } from "next/navigation";
import { useBreakpoint } from "@/hooks/useBreakpoint";

export type ProfileTab = "profile" | "posts";

const ProfilePage = () => {
  const router = useRouter();
  const isMobile = useBreakpoint();

  return (
    <div>
      {/* header */}
      <div className="px-6 md:px-48">
        <div className="flex items-center justify-between py-8">
          <div className="flex items-center gap-1">
            <ArrowLeft className="size-4" />
            <button
              onClick={() => router.back()}
              className="font-bold uppercase"
            >
              go back
            </button>
          </div>
          <p className="text-3xl font-bold">PROFILE</p>
        </div>

        {/* content */}
        <Tabs
          defaultValue="posts"
          orientation="vertical"
          className={`w-full ${isMobile ? "flex-col" : "flex-row items-start"}`}
        >
          {isMobile ? (
            <div className="w-full">
              <TabsList className="grid h-auto w-full grid-cols-4 rounded-none border-b bg-transparent p-0">
                <TabsTrigger
                  value="posts"
                  className="relative rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  Your Posts
                </TabsTrigger>
                <TabsTrigger
                  value="profile"
                  className="relative rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  Profile
                </TabsTrigger>
                <TabsTrigger
                  value="#"
                  className="relative rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  Setting
                </TabsTrigger>
                <TabsTrigger
                  value="##"
                  className="relative rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  Security
                </TabsTrigger>
              </TabsList>
            </div>
          ) : (
            /* Desktop: vertical tabs on left */
            <aside className="w-40 self-start md:sticky md:top-6">
              <TabsList className="flex-col rounded-none border-l bg-transparent p-0">
                <TabsTrigger
                  value="posts"
                  className="relative w-full justify-start rounded-none after:absolute after:inset-y-0 after:start-0 after:w-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary"
                >
                  Your Posts
                </TabsTrigger>
                <TabsTrigger
                  value="profile"
                  className="relative w-full justify-start rounded-none after:absolute after:inset-y-0 after:start-0 after:w-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary"
                >
                  Profile
                </TabsTrigger>
                <TabsTrigger
                  value="#"
                  className="relative w-full justify-start rounded-none after:absolute after:inset-y-0 after:start-0 after:w-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary"
                >
                  Setting
                </TabsTrigger>
                <TabsTrigger
                  value="##"
                  className="relative w-full justify-start rounded-none after:absolute after:inset-y-0 after:start-0 after:w-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary"
                >
                  Security
                </TabsTrigger>
              </TabsList>
            </aside>
          )}

          {/* tab content */}
          <div
            className={`w-full flex-1 rounded-md border p-6 text-start ${isMobile ? "mt-4" : ""}`}
          >
            <TabsContent value="profile" className="space-y-5">
              <div>
                <h1 className="text-2xl font-bold">Account</h1>
                <p>Manage settings related to your account</p>
              </div>
              <UserProfile />
            </TabsContent>

            <TabsContent value="posts">
              <div>
                <h1 className="text-2xl font-bold">Your posts</h1>
                <p>Manage your post</p>
              </div>
              <UserPostsManager />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfilePage;
