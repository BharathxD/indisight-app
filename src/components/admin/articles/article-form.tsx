"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArticleStatus } from "@prisma/client";
import type { Editor } from "@tiptap/react";
import {
  FileText,
  Hash,
  ImageIcon,
  Layers,
  Tag,
  Type,
  Users,
} from "lucide-react";

import { motion } from "motion/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import slugify from "slugify";
import { toast } from "sonner";
import { z } from "zod";
import { AuthorSelector } from "@/components/admin/articles/author-selector";
import { CategorySelector } from "@/components/admin/articles/category-selector";
import { EditorStatusBar } from "@/components/admin/articles/editor-status-bar";
import { ImageUploadDropzone } from "@/components/admin/articles/image-upload-dropzone";
import { PersonSelector } from "@/components/admin/articles/person-selector";
import { StickyActionBar } from "@/components/admin/articles/sticky-action-bar";
import { TagSelector } from "@/components/admin/articles/tag-selector";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { animationVariants } from "@/lib/animation-variants";
import { trpc } from "@/trpc/client";
import { useTrpcInvalidations } from "@/trpc/use-trpc-invalidations";

const MinimalTiptapEditor = dynamic(
  () => import("@/tiptap").then((mod) => mod.MinimalTiptapEditor),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[500px] space-y-3 rounded-md border p-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    ),
  }
);

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
  personIds: z.array(z.string()),
  status: z.nativeEnum(ArticleStatus),
});

type ArticleFormData = z.infer<typeof articleSchema>;

type ArticleFormProps = {
  mode: "create" | "edit";
  articleId?: string;
  initialData?: Partial<ArticleFormData>;
  editorRef?: React.RefObject<Editor | null>;
};

export const ArticleForm = ({
  mode,
  articleId,
  initialData,
  editorRef: externalEditorRef,
}: ArticleFormProps) => {
  const router = useRouter();
  const { invalidateArticleGraph } = useTrpcInvalidations();
  const internalEditorRef = useRef<Editor | null>(null);
  const editorRef = externalEditorRef || internalEditorRef;
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [useThumbnailAsFeatured, setUseThumbnailAsFeatured] = useState(false);

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
      personIds: initialData?.personIds || [],
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
  const personIds = watch("personIds");
  const featuredImageUrl = watch("featuredImageUrl");
  const thumbnailUrl = watch("thumbnailUrl");

  useEffect(() => {
    if (mode === "create" && title && !initialData?.slug) {
      const generatedSlug = slugify(title, { lower: true, strict: true });
      setValue("slug", generatedSlug);
    }
  }, [title, mode, initialData?.slug, setValue]);

  useEffect(() => {
    if (useThumbnailAsFeatured && thumbnailUrl) {
      setValue("featuredImageUrl", thumbnailUrl);
    }
  }, [useThumbnailAsFeatured, thumbnailUrl, setValue]);

  const createArticle = trpc.cms.article.create.useMutation({
    onSuccess: async () => {
      toast.success("Article created successfully");
      await invalidateArticleGraph();
      router.push("/admin/articles");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create article");
    },
  });

  const updateArticle = trpc.cms.article.update.useMutation({
    onSuccess: async () => {
      toast.success("Article updated successfully");
      await invalidateArticleGraph();
      setLastSaved(new Date());
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
      personIds: data.personIds,
      status: data.status,
    };

    if (mode === "edit" && articleId) {
      updateArticle.mutate({ id: articleId, ...payload });
    } else {
      createArticle.mutate(payload);
    }
  };

  const isPending = createArticle.isPending || updateArticle.isPending;

  const handleSaveDraft = () => {
    setValue("status", ArticleStatus.DRAFT);
    handleSubmit(onSubmit)();
  };

  const handlePublish = () => {
    setValue("status", ArticleStatus.PUBLISHED);
    handleSubmit(onSubmit)();
  };

  return (
    <>
      <motion.form
        animate="visible"
        className="mx-auto w-full max-w-3xl space-y-6 px-6 pt-6 pb-32 sm:px-8"
        initial="hidden"
        onSubmit={handleSubmit(onSubmit)}
        variants={animationVariants.staggerContainer}
      >
        <motion.div
          className="space-y-3"
          variants={animationVariants.staggerItem}
        >
          <Label
            className="flex items-center gap-2 font-medium text-sm"
            htmlFor="title"
          >
            <Type className="size-4" />
            Title <span className="text-destructive">*</span>
          </Label>
          <Input
            autoComplete="off"
            className="h-10 font-semibold text-2xl tracking-tight"
            id="title"
            placeholder="Enter article title..."
            {...register("title")}
            aria-invalid={!!errors.title}
            disabled={isPending}
          />
          {errors.title && (
            <motion.p
              animate={{ opacity: 1, y: 0 }}
              className="text-destructive text-sm"
              initial={{ opacity: 0, y: -4 }}
            >
              {errors.title.message}
            </motion.p>
          )}
        </motion.div>

        <motion.div
          className="space-y-3"
          variants={animationVariants.staggerItem}
        >
          <Label
            className="flex items-center gap-2 font-medium text-sm"
            htmlFor="slug"
          >
            <Hash className="size-4" />
            Slug <span className="text-destructive">*</span>
          </Label>
          <Input
            autoComplete="off"
            className="h-10 font-mono text-sm"
            id="slug"
            placeholder="article-slug"
            {...register("slug")}
            aria-invalid={!!errors.slug}
            disabled={isPending}
          />
          {errors.slug && (
            <motion.p
              animate={{ opacity: 1, y: 0 }}
              className="text-destructive text-sm"
              initial={{ opacity: 0, y: -4 }}
            >
              {errors.slug.message}
            </motion.p>
          )}
          <p className="text-muted-foreground text-xs">
            URL-friendly identifier. Auto-generated from title.
          </p>
        </motion.div>

        <motion.div
          className="space-y-3"
          variants={animationVariants.staggerItem}
        >
          <Label
            className="flex items-center gap-2 font-medium text-sm"
            htmlFor="subtitle"
          >
            <Type className="size-4 opacity-70" />
            Subtitle
          </Label>
          <Input
            autoComplete="off"
            className="h-10"
            id="subtitle"
            placeholder="Optional subtitle..."
            {...register("subtitle")}
            disabled={isPending}
          />
        </motion.div>

        <motion.div variants={animationVariants.staggerItem}>
          <EditorStatusBar
            editor={editorRef.current}
            isSaving={isPending}
            lastSaved={lastSaved}
          />
        </motion.div>

        <motion.div
          className="space-y-3"
          variants={animationVariants.staggerItem}
        >
          <Label className="flex items-center gap-2 font-medium text-sm">
            <FileText className="size-4" />
            Content <span className="text-destructive">*</span>
          </Label>
          <MinimalTiptapEditor
            className="min-h-[500px]"
            editorRef={editorRef}
            onChange={(value) => setValue("content", value)}
            value={content}
          />
          {errors.content && (
            <motion.p
              animate={{ opacity: 1, y: 0 }}
              className="text-destructive text-sm"
              initial={{ opacity: 0, y: -4 }}
            >
              {errors.content?.message as string}
            </motion.p>
          )}
        </motion.div>

        <motion.div
          className="space-y-3"
          variants={animationVariants.staggerItem}
        >
          <Label
            className="flex items-center gap-2 font-medium text-sm"
            htmlFor="excerpt"
          >
            <FileText className="size-4 opacity-70" />
            Excerpt
          </Label>
          <Textarea
            autoComplete="off"
            className="min-h-[100px]"
            id="excerpt"
            placeholder="Brief summary of the article..."
            {...register("excerpt")}
            disabled={isPending}
            rows={4}
          />
          <p className="text-muted-foreground text-xs">
            Shown in article previews and search results
          </p>
        </motion.div>

        <Separator />

        <motion.div variants={animationVariants.staggerItem}>
          <Card className="py-4">
            <CardContent className="space-y-4 px-4">
              <h3 className="flex items-center gap-2 font-medium text-base">
                <Users className="size-4" />
                People
              </h3>
              <AuthorSelector
                error={
                  errors.authorIds?.message || errors.primaryAuthorId?.message
                }
                onChange={(ids) => setValue("authorIds", ids)}
                onPrimaryChange={(id) => setValue("primaryAuthorId", id)}
                primaryAuthorId={primaryAuthorId}
                value={authorIds}
              />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={animationVariants.staggerItem}>
          <Card className="py-4">
            <CardContent className="space-y-4 px-4">
              <h3 className="flex items-center gap-2 font-medium text-base">
                <Layers className="size-4" />
                Organization
              </h3>
              <CategorySelector
                error={
                  errors.categoryIds?.message ||
                  errors.primaryCategoryId?.message
                }
                onChange={(ids) => setValue("categoryIds", ids)}
                onPrimaryChange={(id) => setValue("primaryCategoryId", id)}
                primaryCategoryId={primaryCategoryId}
                value={categoryIds}
              />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={animationVariants.staggerItem}>
          <Card className="py-4">
            <CardContent className="space-y-4 px-4">
              <h3 className="flex items-center gap-2 font-medium text-base">
                <Tag className="size-4" />
                Discovery
              </h3>
              <TagSelector
                onChange={(ids) => setValue("tagIds", ids)}
                value={tagIds}
              />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={animationVariants.staggerItem}>
          <Card className="py-4">
            <CardContent className="space-y-4 px-4">
              <h3 className="flex items-center gap-2 font-medium text-base">
                <Users className="size-4" />
                Featured People
              </h3>
              <PersonSelector
                onChange={(ids) => setValue("personIds", ids)}
                value={personIds}
              />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={animationVariants.staggerItem}>
          <Card className="py-4">
            <CardContent className="space-y-4 px-4">
              <h3 className="flex items-center gap-2 font-medium text-base">
                <ImageIcon className="size-4" />
                Media
              </h3>

              <ImageUploadDropzone
                disabled={isPending}
                folder="articles/thumbnails"
                label="Thumbnail"
                onChange={(url) => setValue("thumbnailUrl", url)}
                recommendedDimensions="300 × 300px"
                value={thumbnailUrl}
              />
              {errors.thumbnailUrl && (
                <motion.p
                  animate={{ opacity: 1, y: 0 }}
                  className="text-destructive text-sm"
                  initial={{ opacity: 0, y: -4 }}
                >
                  {errors.thumbnailUrl.message}
                </motion.p>
              )}

              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <Label className="font-medium text-sm">
                    Use thumbnail as featured image
                  </Label>
                  <p className="text-muted-foreground text-xs">
                    Automatically sync thumbnail to featured image
                  </p>
                </div>
                <Switch
                  checked={useThumbnailAsFeatured}
                  disabled={isPending || !thumbnailUrl}
                  onCheckedChange={setUseThumbnailAsFeatured}
                />
              </div>

              <ImageUploadDropzone
                disabled={isPending || useThumbnailAsFeatured}
                folder="articles/featured"
                label="Featured Image"
                onChange={(url) => setValue("featuredImageUrl", url)}
                recommendedDimensions="1200 × 628px"
                value={featuredImageUrl}
              />
              {errors.featuredImageUrl && (
                <motion.p
                  animate={{ opacity: 1, y: 0 }}
                  className="text-destructive text-sm"
                  initial={{ opacity: 0, y: -4 }}
                >
                  {errors.featuredImageUrl.message}
                </motion.p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.form>

      <StickyActionBar
        isPending={isPending}
        onBack={() => router.back()}
        onPublish={handlePublish}
        onSaveDraft={handleSaveDraft}
      />
    </>
  );
};
