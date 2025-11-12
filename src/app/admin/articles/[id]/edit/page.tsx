"use client";

import { FileText } from "lucide-react";
import { use } from "react";
import { ArticleForm } from "@/components/admin/articles/article-form";
import { DashboardContainer } from "@/components/dashboard-container";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/trpc/client";

type EditArticlePageProps = {
  params: Promise<{ id: string }>;
};

const EditArticlePage = ({ params }: EditArticlePageProps) => {
  const { id } = use(params);
  const { data: article, isLoading } = trpc.cms.article.getById.useQuery({
    id,
  });

  if (isLoading) {
    return (
      <DashboardContainer
        description="Edit article"
        icon={FileText}
        title="Edit Article"
      >
        <div className="space-y-6">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </DashboardContainer>
    );
  }

  if (!article) {
    return (
      <DashboardContainer
        description="Article not found"
        icon={FileText}
        title="Edit Article"
      >
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-muted-foreground">Article not found</p>
        </div>
      </DashboardContainer>
    );
  }

  const initialData = {
    title: article.title,
    slug: article.slug,
    subtitle: article.subtitle || "",
    excerpt: article.excerpt || "",
    content: article.content,
    featuredImageUrl: article.featuredImageUrl || "",
    thumbnailUrl: article.thumbnailUrl || "",
    authorIds: article.articleAuthors.map(
      (aa: { authorId: string }) => aa.authorId
    ),
    primaryAuthorId:
      article.articleAuthors.find((aa: { isPrimary: boolean }) => aa.isPrimary)
        ?.authorId || "",
    categoryIds: article.articleCategories.map(
      (ac: { categoryId: string }) => ac.categoryId
    ),
    primaryCategoryId:
      article.articleCategories.find(
        (ac: { isPrimary: boolean }) => ac.isPrimary
      )?.categoryId || "",
    tagIds: article.articleTags.map((at: { tagId: string }) => at.tagId),
    status: article.status,
  };

  return (
    <DashboardContainer
      description="Edit article"
      icon={FileText}
      title="Edit Article"
    >
      <ArticleForm articleId={id} initialData={initialData} mode="edit" />
    </DashboardContainer>
  );
};

export default EditArticlePage;
