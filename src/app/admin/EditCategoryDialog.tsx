/* eslint-disable @typescript-eslint/no-explicit-any */
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";
import React, { useState } from "react";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  _count?: {
    posts: number;
  };
}

interface EditCategoryDialogProps {
  category: Category;
  onCategoryUpdated: () => void;
}

const EditCategoryDialog = ({
  category,
  onCategoryUpdated,
}: EditCategoryDialogProps) => {
  const [name, setName] = useState(category.name);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    try {
      await api.put(`/categories/${category.id}`, {
        name: name.trim(),
      });
      toast.success("Category updated successfully");
      onCategoryUpdated();
      setOpen(false);
    } catch (error: any) {
      console.error("Update category error:", error);
      toast.error(error.response?.data?.message || "Failed to update category");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit category</DialogTitle>
          <DialogDescription>
            Update the category name. Changes will be applied immediately
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="category-name">Category name</Label>
            <Input
              id="category-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter category name"
              disabled={isLoading}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              disabled={isLoading}
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loading /> Updating...
                </>
              ) : (
                "Update category"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCategoryDialog;
