"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArticleStatus } from "@prisma/client";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import slugify from "slugify";
import { toast } from "sonner";
import { z } from "zod";
import { AuthorSelector } from "@/components/admin/articles/author-selector";
import { CategorySelector } from "@/components/admin/articles/category-selector";
import { TagSelector } from "@/components/admin/articles/tag-selector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { MinimalTiptapEditor } from "@/tiptap";
import { trpc } from "@/trpc/client";

const articleSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  slug: z.string().min(1, "Slug is required").max(255),
  subtitle: z.string().optional(),
  excerpt: z.string().optional(),
  content: z.any(),
  featuredImageUrl: z.url("Invalid URL").optional().or(z.literal("")),
  thumbnailUrl: z.url("Invalid URL").optional().or(z.literal("")),
  authorIds: z.array(z.string()).min(1, "At least one author is required"),
  primaryAuthorId: z.string().min(1, "Primary author is required"),
  categoryIds: z.array(z.string()).min(1, "At least one category is required"),
  primaryCategoryId: z.string().min(1, "Primary category is required"),
  tagIds: z.array(z.string()),
  status: z.enum(ArticleStatus),
});

type ArticleFormData = z.infer<typeof articleSchema>;

type ArticleFormProps = {
  mode: "create" | "edit";
  articleId?: string;
  initialData?: Partial<ArticleFormData>;
};

export const ArticleForm = ({
  mode,
  articleId,
  initialData,
}: ArticleFormProps) => {
  const router = useRouter();
  const utils = trpc.useUtils();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      subtitle: initialData?.subtitle || "",
      excerpt: initialData?.excerpt || "",
      content: initialData?.content || null,
      featuredImageUrl: initialData?.featuredImageUrl || "",
      thumbnailUrl: initialData?.thumbnailUrl || "",
      authorIds: initialData?.authorIds || [],
      primaryAuthorId: initialData?.primaryAuthorId || "",
      categoryIds: initialData?.categoryIds || [],
      primaryCategoryId: initialData?.primaryCategoryId || "",
      tagIds: initialData?.tagIds || [],
      status: initialData?.status || ArticleStatus.DRAFT,
    },
  });

  const title = watch("title");
  const content = watch("content");
  const authorIds = watch("authorIds");
  const primaryAuthorId = watch("primaryAuthorId");
  const categoryIds = watch("categoryIds");
  const primaryCategoryId = watch("primaryCategoryId");
  const tagIds = watch("tagIds");

  useEffect(() => {
    if (mode === "create" && title && !initialData?.slug) {
      const generatedSlug = slugify(title, { lower: true, strict: true });
      setValue("slug", generatedSlug);
    }
  }, [title, mode, initialData?.slug, setValue]);

  const createArticle = trpc.cms.article.create.useMutation({
    onSuccess: () => {
      toast.success("Article created successfully");
      utils.cms.article.list.invalidate();
      router.push("/admin/articles");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create article");
    },
  });

  const updateArticle = trpc.cms.article.update.useMutation({
    onSuccess: () => {
      toast.success("Article updated successfully");
      utils.cms.article.list.invalidate();
      router.push("/admin/articles");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update article");
    },
  });

  const onSubmit = (data: ArticleFormData) => {
    const payload = {
      title: data.title,
      slug: data.slug,
      subtitle: data.subtitle || undefined,
      excerpt: data.excerpt || undefined,
      content: data.content,
      featuredImageUrl: data.featuredImageUrl || undefined,
      thumbnailUrl: data.thumbnailUrl || undefined,
      authorIds: data.authorIds,
      primaryAuthorId: data.primaryAuthorId,
      categoryIds: data.categoryIds,
      primaryCategoryId: data.primaryCategoryId,
      tagIds: data.tagIds,
      status: data.status,
    };

    if (mode === "edit" && articleId) {
      updateArticle.mutate({ id: articleId, ...payload });
    } else {
      createArticle.mutate(payload);
    }
  };

  const isPending = createArticle.isPending || updateArticle.isPending;

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex items-center justify-between">
        <Button
          onClick={() => router.back()}
          size="sm"
          type="button"
          variant="ghost"
        >
          <ArrowLeft />
          Back
        </Button>
        <div className="flex items-center gap-2">
          <Button
            disabled={isPending}
            onClick={() => setValue("status", ArticleStatus.DRAFT)}
            type="submit"
            variant="outline"
          >
            Save as Draft
          </Button>
          <Button
            disabled={isPending}
            onClick={() => setValue("status", ArticleStatus.PUBLISHED)}
            type="submit"
          >
            {isPending && <Loader2 className="animate-spin" />}
            {mode === "create" ? "Publish" : "Update"}
          </Button>
        </div>
      </div>

      <Separator />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="space-y-2">
            <Label htmlFor="title">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              placeholder="Enter article title..."
              {...register("title")}
              aria-invalid={!!errors.title}
              disabled={isPending}
            />
            {errors.title && (
              <p className="text-destructive text-sm">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">
              Slug <span className="text-destructive">*</span>
            </Label>
            <Input
              id="slug"
              placeholder="article-slug"
              {...register("slug")}
              aria-invalid={!!errors.slug}
              disabled={isPending}
            />
            {errors.slug && (
              <p className="text-destructive text-sm">{errors.slug.message}</p>
            )}
            <p className="text-muted-foreground text-xs">
              URL-friendly identifier. Auto-generated from title.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subtitle">Subtitle</Label>
            <Input
              id="subtitle"
              placeholder="Optional subtitle..."
              {...register("subtitle")}
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label>
              Content <span className="text-destructive">*</span>
            </Label>
            <div className="rounded-md border">
              <MinimalTiptapEditor
                className="min-h-[400px]"
                onChange={(value) => setValue("content", value)}
                value={content}
              />
            </div>
            {errors.content && (
              <p className="text-destructive text-sm">
                {errors.content?.message as string}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              placeholder="Brief summary of the article..."
              {...register("excerpt")}
              disabled={isPending}
              rows={3}
            />
            <p className="text-muted-foreground text-xs">
              Shown in article previews and search results
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-4 rounded-md border p-4">
            <h3 className="font-medium">Relationships</h3>

            <AuthorSelector
              error={
                errors.authorIds?.message || errors.primaryAuthorId?.message
              }
              onChange={(ids) => setValue("authorIds", ids)}
              onPrimaryChange={(id) => setValue("primaryAuthorId", id)}
              primaryAuthorId={primaryAuthorId}
              value={authorIds}
            />

            <CategorySelector
              error={
                errors.categoryIds?.message || errors.primaryCategoryId?.message
              }
              onChange={(ids) => setValue("categoryIds", ids)}
              onPrimaryChange={(id) => setValue("primaryCategoryId", id)}
              primaryCategoryId={primaryCategoryId}
              value={categoryIds}
            />

            <TagSelector
              onChange={(ids) => setValue("tagIds", ids)}
              value={tagIds}
            />
          </div>

          <div className="space-y-4 rounded-md border p-4">
            <h3 className="font-medium">Images</h3>

            <div className="space-y-2">
              <Label htmlFor="featuredImageUrl">Featured Image URL</Label>
              <Input
                id="featuredImageUrl"
                placeholder="https://..."
                type="url"
                {...register("featuredImageUrl")}
                aria-invalid={!!errors.featuredImageUrl}
                disabled={isPending}
              />
              {errors.featuredImageUrl && (
                <p className="text-destructive text-sm">
                  {errors.featuredImageUrl.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="thumbnailUrl">Thumbnail URL</Label>
              <Input
                id="thumbnailUrl"
                placeholder="https://..."
                type="url"
                {...register("thumbnailUrl")}
                aria-invalid={!!errors.thumbnailUrl}
                disabled={isPending}
              />
              {errors.thumbnailUrl && (
                <p className="text-destructive text-sm">
                  {errors.thumbnailUrl.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
