"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import api from "@/lib/api";
import { toast } from "sonner";

interface Tag {
  id: string;
  name: string;
  createdAt: string;
}

const AdminDashboard = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();
  const [tags, setTags] = useState<Tag[]>([]);
  const [newTagName, setNewTagName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingTag, setIsCreatingTag] = useState(false);

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

    fetchTags();
  }, [isAuthenticated.value, isAdmin, router]);

  const fetchTags = async () => {
    try {
      const response = await api.get("/tags");
      setTags(response.data.tags);
    } catch (error) {
      console.error("Error fetching tags:", error);
      toast.error("Failed to fetch tags");
    }
  };

  const handleCreateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) {
      toast.error("Tag name is required");
      return;
    }

    setIsCreatingTag(true);
    try {
      await api.post("/tags", { name: newTagName.trim() });
      toast.success("Tag created successfully");
      setNewTagName("");
      fetchTags();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create tag");
    } finally {
      setIsCreatingTag(false);
    }
  };

  if (!isAuthenticated.value || !isAdmin()) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your blog platform</p>
        </div>

        <Tabs defaultValue="tags" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tags">Tags</TabsTrigger>
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          <TabsContent value="tags" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Create New Tag</CardTitle>
                <CardDescription>
                  Add a new tag that can be used for categorizing posts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateTag} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="tagName">Tag Name</Label>
                    <Input
                      id="tagName"
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      placeholder="Enter tag name"
                      disabled={isCreatingTag}
                    />
                  </div>
                  <Button type="submit" disabled={isCreatingTag}>
                    {isCreatingTag ? "Creating..." : "Create Tag"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>All Tags</CardTitle>
                <CardDescription>
                  Manage existing tags in your blog platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-4">Loading tags...</div>
                ) : tags.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    No tags found. Create your first tag above.
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {tags.map((tag) => (
                      <div
                        key={tag.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div>
                          <h3 className="font-medium">{tag.name}</h3>
                          <p className="text-sm text-gray-500">
                            Created: {new Date(tag.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="posts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Post Management</CardTitle>
                <CardDescription>
                  Manage and moderate blog posts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  Post management features coming soon...
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Manage user accounts and permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  User management features coming soon...
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
