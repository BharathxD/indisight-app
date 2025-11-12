"use client";

import { FileText, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { parseAsString, useQueryState } from "nuqs";
import { Suspense } from "react";
import { ArticlesError } from "@/components/admin/articles/articles-error";
import { ArticlesLoading } from "@/components/admin/articles/articles-loading";
import { ArticlesTable } from "@/components/admin/articles/articles-table";
import { DashboardContainer } from "@/components/dashboard-container";
import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/client";

const ArticlesPageContent = () => {
  const router = useRouter();
  const [search] = useQueryState("search", parseAsString.withDefault(""));

  const { data, isLoading, error, refetch } = trpc.cms.article.list.useQuery({
    limit: 50,
    search: search || undefined,
  });

  return (
    <DashboardContainer
      description="Manage your blog posts and articles"
      icon={FileText}
      title="Articles"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-lg">All Articles</h2>
            <p className="text-muted-foreground text-sm">
              {data
                ? `${data.articles.length} article${data.articles.length !== 1 ? "s" : ""}`
                : "Loading..."}
            </p>
          </div>
          <Button onClick={() => router.push("/admin/articles/new")}>
            <Plus />
            Create Article
          </Button>
        </div>

        {isLoading && <ArticlesLoading />}

        {error && (
          <ArticlesError
            error={new Error(error.message)}
            onRetry={() => refetch()}
          />
        )}

        {data && !isLoading && !error && (
          <ArticlesTable articles={data.articles} pageCount={1} />
        )}
      </div>
    </DashboardContainer>
  );
};

const ArticlesPage = () => (
  <Suspense fallback={<ArticlesLoading />}>
    <ArticlesPageContent />
  </Suspense>
);

export default ArticlesPage;
