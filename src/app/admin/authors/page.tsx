"use client";

import { Plus, Users } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import { useState } from "react";
import { AuthorDialog } from "@/components/admin/authors/author-dialog";
import { AuthorsError } from "@/components/admin/authors/authors-error";
import { AuthorsLoading } from "@/components/admin/authors/authors-loading";
import { AuthorsTable } from "@/components/admin/authors/authors-table";
import { DashboardContainer } from "@/components/dashboard-container";
import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/client";

type Author = {
  id: string;
  name: string;
  slug: string;
  email: string | null;
  bio: string | null;
  profileImageUrl: string | null;
  socialLinks: unknown;
  isFeatured: boolean;
  articleCount: number;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    id: string;
    name: string;
    email: string;
  } | null;
};

const AuthorsPage = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);
  const [search] = useQueryState("search", parseAsString.withDefault(""));

  const { data, isLoading, error, refetch } = trpc.cms.author.list.useQuery({
    limit: 50,
    search: search || undefined,
  });

  const handleEdit = (author: Author) => {
    setSelectedAuthor(author);
    setDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedAuthor(null);
    setDialogOpen(true);
  };

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setSelectedAuthor(null);
    }
  };

  return (
    <DashboardContainer
      description="Manage content contributors and authors"
      icon={Users}
      title="Authors"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-lg">All Authors</h2>
            <p className="text-muted-foreground text-sm">
              {data
                ? `${data.authors.length} author${data.authors.length !== 1 ? "s" : ""}`
                : "Loading..."}
            </p>
          </div>
          <Button onClick={handleCreate}>
            <Plus />
            Create Author
          </Button>
        </div>

        {isLoading && <AuthorsLoading />}

        {error && (
          <AuthorsError
            error={new Error(error.message)}
            onRetry={() => refetch()}
          />
        )}

        {data && !isLoading && !error && (
          <AuthorsTable
            authors={data.authors}
            onEdit={handleEdit}
            pageCount={1}
          />
        )}

        <AuthorDialog
          author={selectedAuthor}
          onOpenChange={handleDialogClose}
          open={dialogOpen}
        />
      </div>
    </DashboardContainer>
  );
};

export default AuthorsPage;
