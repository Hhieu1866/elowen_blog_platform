"use client";

// import Navbar from "@/components/Navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import React, { useState } from "react";
import UserPostsManager from "./UserPostsManager";
import UserProfile from "./UserProfile";

export type ProfileTab = "profile" | "posts";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState<ProfileTab>("profile");

  return (
    <div>
      {/* <Navbar /> */}

      {/* header */}
      <div className="px-6 md:px-48">
        <div className="flex items-center justify-between py-8">
          <div className="flex items-center gap-1">
            <ArrowLeft className="size-4" />
            <p className="font-bold uppercase">go back</p>
          </div>
          <p className="text-3xl font-bold">PROFILE</p>
        </div>

        {/* content */}

        {/* tab navigation */}
        <Tabs
          defaultValue="post"
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as ProfileTab)}
          className="space-y-6"
        >
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="posts">Your Posts</TabsTrigger>
            <TabsTrigger value="#">Setting</TabsTrigger>
            <TabsTrigger value="#">Security</TabsTrigger>
          </TabsList>

          {/* tab content */}
          <TabsContent value="profile">
            <h1 className="text-xl font-bold">Account</h1>
            <p>Manage settings related to your account</p>
            <UserProfile />
          </TabsContent>
          <TabsContent value="posts">
            <Card>
              <CardHeader>
                <CardTitle>Your posts</CardTitle>
                <CardDescription>Manage your post</CardDescription>
              </CardHeader>
              <CardContent>
                <UserPostsManager />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfilePage;
