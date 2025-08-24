/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/categories/CategoriesSection.tsx
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";
import { toast } from "sonner";
import Loading from "@/components/Loading";
import EditCategoryDialog from "./EditCategoryDialog";

interface Category {
  id: string;
  name: string;
  _count?: {
    posts: number;
  };
}

const CategoriesSection = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/categories");
      setCategories(response.data.data);
    } catch (error: any) {
      console.error("Error fetching categories: ", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch categories",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      toast.error("Category name is required");
      return;
    }

    setIsCreatingCategory(true);
    try {
      await api.post("/categories", { name: newCategoryName.trim() });
      toast.success("Category created successfully");
      setNewCategoryName("");
      fetchCategories();
    } catch (error: any) {
      console.error("Create category error:", error);
      toast.error(error.response?.data?.message || "Failed to create category");
    } finally {
      setIsCreatingCategory(false);
    }
  };

  const handleDeleteCategory = async (
    categoryId: string,
    categoryName: string,
  ) => {
    if (
      !confirm(
        `Are you sure you want to delete the category "${categoryName}"?`,
      )
    )
      return;

    try {
      await api.delete(`/categories/${categoryId}`);
      toast.success("Category deleted successfully");
      fetchCategories();
    } catch (error: any) {
      console.error("Delete category error:", error);
      toast.error(error.response?.data?.message || "Failed to delete category");
    }
  };

  return (
    <div className="space-y-6">
      {/* Create Category Card */}
      <Card>
        <CardHeader>
          <CardTitle>Create new category</CardTitle>
          <CardDescription>
            Add a new category for organizing posts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateCategory}>
            <div className="space-y-2">
              <Label htmlFor="categoryName">Category name</Label>
              <Input
                id="categoryName"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Enter category name (e.g., Technology, Lifestyle)"
                disabled={isCreatingCategory}
                className="max-w-md"
              />
            </div>
            <Button
              className="mt-3"
              type="submit"
              disabled={isCreatingCategory}
            >
              {isCreatingCategory ? (
                <>
                  <Loading /> Creating...
                </>
              ) : (
                "Create category"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Categories List Card */}
      <Card>
        <CardHeader>
          <CardTitle>All categories</CardTitle>
          <CardDescription>
            Manage categories for your blog posts
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-8">
              <Loading />
              <p className="text-lg text-gray-600">Loading categories...</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              <div className="mb-4 text-4xl">📂</div>
              <p className="text-lg font-medium">No categories found</p>
              <p className="text-sm">
                Create your first category to organize posts
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between rounded-lg border bg-white p-4 transition-shadow hover:shadow-md"
                >
                  <div className="flex-1">
                    <h3 className="text-lg font-medium">{category.name}</h3>
                    <p className="text-sm text-gray-500">
                      {category._count?.posts || 0} posts
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <EditCategoryDialog
                      category={category}
                      onCategoryUpdated={fetchCategories}
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() =>
                        handleDeleteCategory(category.id, category.name)
                      }
                      disabled={
                        category._count?.posts
                          ? category._count.posts > 0
                          : false
                      }
                      title={
                        category._count?.posts && category._count.posts > 0
                          ? "Cannot delete category that is being used by posts"
                          : "Delete category"
                      }
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoriesSection;
