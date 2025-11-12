"use client";

import { FolderTree, Plus } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import { useState } from "react";
import { CategoriesError } from "@/components/admin/categories/categories-error";
import { CategoriesLoading } from "@/components/admin/categories/categories-loading";
import { CategoriesTable } from "@/components/admin/categories/categories-table";
import { CategoryDialog } from "@/components/admin/categories/category-dialog";
import { DashboardContainer } from "@/components/dashboard-container";
import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/client";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  imageAlt: string | null;
  icon: string | null;
  isActive: boolean;
  displayOrder: number;
  articleCount: number;
  parentId: string | null;
  seoMetaTitle: string | null;
  seoMetaDescription: string | null;
  createdAt: Date;
  updatedAt: Date;
  parent?: { id: string; name: string; slug: string } | null;
  children?: { id: string; name: string; slug: string }[];
};

const CategoriesPage = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [search] = useQueryState("search", parseAsString.withDefault(""));

  const { data, isLoading, error, refetch } = trpc.cms.category.list.useQuery({
    search: search || undefined,
  });

  const categories = data || [];

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedCategory(null);
    setDialogOpen(true);
  };

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setSelectedCategory(null);
    }
  };

  return (
    <DashboardContainer
      description="Organize content with hierarchical categories"
      icon={FolderTree}
      title="Categories"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-lg">All Categories</h2>
            <p className="text-muted-foreground text-sm">
              {data
                ? `${categories.length} categor${categories.length !== 1 ? "ies" : "y"}`
                : "Loading..."}
            </p>
          </div>
          <Button onClick={handleCreate}>
            <Plus />
            Create Category
          </Button>
        </div>

        {isLoading && <CategoriesLoading />}

        {error && (
          <CategoriesError
            error={new Error(error.message)}
            onRetry={() => refetch()}
          />
        )}

        {data && !isLoading && !error && (
          <CategoriesTable
            categories={categories}
            onEdit={handleEdit}
            pageCount={1}
          />
        )}

        <CategoryDialog
          category={selectedCategory}
          onOpenChange={handleDialogClose}
          open={dialogOpen}
        />
      </div>
    </DashboardContainer>
  );
};

export default CategoriesPage;
