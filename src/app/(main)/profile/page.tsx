"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import React from "react";
import UserPostsManager from "./UserPostsManager";
import UserProfile from "./UserProfile";
import { useRouter } from "next/navigation";

export type ProfileTab = "profile" | "posts";

const ProfilePage = () => {
  const router = useRouter();

  return (
    <div>
      {/* <Navbar /> */}

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

        {/* tab navigation */}
        <Tabs
          defaultValue="profile"
          orientation="vertical"
          className="w-full flex-row items-start"
        >
          <aside className="sticky top-6 w-40 self-start">
            <TabsList className="flex-col rounded-none border-l bg-transparent p-0">
              <TabsTrigger
                value="profile"
                className="relative w-full justify-start rounded-none after:absolute after:inset-y-0 after:start-0 after:w-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary"
              >
                Profile
              </TabsTrigger>
              <TabsTrigger
                value="posts"
                className="relative w-full justify-start rounded-none after:absolute after:inset-y-0 after:start-0 after:w-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary"
              >
                Your Posts
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

          {/* tab content */}
          <div className="flex-1 rounded-md border p-6 text-start">
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
