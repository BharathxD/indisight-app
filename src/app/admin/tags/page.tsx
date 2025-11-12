"use client";

import { Hash, Plus } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import { Suspense, useState } from "react";
import { TagDialog } from "@/components/admin/tags/tag-dialog";
import { TagsError } from "@/components/admin/tags/tags-error";
import { TagsLoading } from "@/components/admin/tags/tags-loading";
import { TagsTable } from "@/components/admin/tags/tags-table";
import { DashboardContainer } from "@/components/dashboard-container";
import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/client";

type Tag = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isTrending: boolean;
  usageCount: number;
  createdAt: Date;
  updatedAt: Date;
};

const TagsPageContent = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [search] = useQueryState("search", parseAsString.withDefault(""));

  const { data, isLoading, error, refetch } = trpc.cms.tag.list.useQuery({
    limit: 100,
    search: search || undefined,
  });

  const handleEdit = (tag: Tag) => {
    setSelectedTag(tag);
    setDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedTag(null);
    setDialogOpen(true);
  };

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setSelectedTag(null);
    }
  };

  return (
    <DashboardContainer
      description="Organize and manage content tags"
      icon={Hash}
      title="Tags"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-lg">All Tags</h2>
            <p className="text-muted-foreground text-sm">
              {data
                ? `${data.tags.length} tag${data.tags.length !== 1 ? "s" : ""}`
                : "Loading..."}
            </p>
          </div>
          <Button onClick={handleCreate}>
            <Plus />
            Create Tag
          </Button>
        </div>

        {isLoading && <TagsLoading />}

        {error && (
          <TagsError
            error={new Error(error.message)}
            onRetry={() => refetch()}
          />
        )}

        {data && !isLoading && !error && (
          <TagsTable onEdit={handleEdit} pageCount={1} tags={data.tags} />
        )}

        <TagDialog
          onOpenChange={handleDialogClose}
          open={dialogOpen}
          tag={selectedTag}
        />
      </div>
    </DashboardContainer>
  );
};

const TagsPage = () => (
  <Suspense fallback={<TagsLoading />}>
    <TagsPageContent />
  </Suspense>
);

export default TagsPage;
