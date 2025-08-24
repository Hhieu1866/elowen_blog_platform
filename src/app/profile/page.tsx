"use client";

import Navbar from "@/components/Navbar";
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

export type ProfileTab = "profile" | "posts";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState<ProfileTab>("profile");

  return (
    <div>
      <Navbar />

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
            <Card>
              <CardHeader>
                <CardTitle>Thông tin cá nhân</CardTitle>
                <CardDescription>
                  Quản lý thông tin hồ sơ của bạn
                </CardDescription>
              </CardHeader>
              <CardContent>{/* <ProfileInfo /> */}</CardContent>
            </Card>
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
