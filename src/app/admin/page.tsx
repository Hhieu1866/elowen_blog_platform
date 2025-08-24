"use client";

import { useRouter } from "next/navigation";
import { isAuthenticated, useAuth } from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Loading from "@/components/Loading";
import TagsSection from "./TagsSection";
import CategoriesSection from "./CategoriesSection";

const AdminDashboard = () => {
  const router = useRouter();
  const { isAuthenticated, isAdmin } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated.value) {
      router.push("/login");
      return;
    }

    if (!isAdmin()) {
      router.push("/");
      toast.error("Access denied. Admin privileges required.");
      return;
    }

    setIsLoading(false);
  }, [isAuthenticated.value, isAdmin, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-gray-50">
        <div className="flex items-center justify-center">
          <Loading />
        </div>
        <p className="text-lg text-gray-600">Loading admin dashboard...</p>
      </div>
    );
  }

  if (!isAuthenticated.value || !isAdmin()) {
    return null;
  }

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-7xl">
        {/* header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin dashboard</h1>
          <p className="text-lg text-gray-600">Manage your blog platform</p>
        </div>

        {/* tabs navigation */}
        <Tabs defaultValue="tags" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="tags">Tags</TabsTrigger>
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          {/* Categories Tab Content */}
          <TabsContent value="categories">
            <CategoriesSection />
          </TabsContent>

          {/* tags tab content */}
          <TabsContent value="tags">
            <TagsSection />
          </TabsContent>

          {/* posts tab content */}
          <TabsContent value="posts"></TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
