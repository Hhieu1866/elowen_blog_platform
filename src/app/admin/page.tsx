"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TagsSection from "./TagsSection";
import CategoriesSection from "./CategoriesSection";
import {
  ChartBarStacked,
  Loader2,
  NotebookPen,
  Tags,
  User,
} from "lucide-react";
import PostsSection from "./PostsSection";
import ListUsersSection from "./ListUsersSection";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
        <p className="text-lg text-gray-600">Loading admin dashboard...</p>
      </div>
    );
  }

  if (!isAuthenticated.value || !isAdmin()) {
    return null;
  }

  return (
    <div className="mt-14 min-h-screen">
      <div className="px-6 md:px-48">
        {/* header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin dashboard</h1>
          <p className="text-lg text-gray-600">Manage your blog platform</p>
        </div>

        {/* tabs navigation */}
        <Tabs
          defaultValue="users"
          orientation="vertical"
          className="w-full flex-row items-start gap-3"
        >
          <aside className="sticky top-6 self-start">
            <TabsList className="flex-col p-1">
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <TabsTrigger value="users" className="py-3">
                        <User size={16} aria-hidden="true" />
                      </TabsTrigger>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="px-2 py-1 text-xs">
                    Users
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <TabsTrigger value="posts" className="py-3">
                        <NotebookPen size={16} aria-hidden="true" />
                      </TabsTrigger>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="px-2 py-1 text-xs">
                    Posts
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <TabsTrigger value="categories" className="py-3">
                        <ChartBarStacked size={16} aria-hidden="true" />
                      </TabsTrigger>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="px-2 py-1 text-xs">
                    Categories
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <TabsTrigger value="tags" className="py-3">
                        <Tags size={16} aria-hidden="true" />
                      </TabsTrigger>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="px-2 py-1 text-xs">
                    Tags
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TabsList>
          </aside>

          <div className="flex-1 rounded-md border p-6 text-start">
            {/* Categories Tab Content */}
            <TabsContent value="categories">
              <CategoriesSection />
            </TabsContent>

            {/* tags tab content */}
            <TabsContent value="tags">
              <TagsSection />
            </TabsContent>

            {/* posts tab content */}
            <TabsContent value="posts">
              <PostsSection />
            </TabsContent>

            {/* users tab content */}
            <TabsContent value="users">
              <ListUsersSection />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
