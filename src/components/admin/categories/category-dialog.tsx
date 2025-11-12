"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChevronDown,
  ChevronRight,
  Folder,
  Image,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import slugify from "slugify";
import { toast } from "sonner";
import { z } from "zod";
import { EntitySelector } from "@/components/admin/articles/entity-selector";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/trpc/client";

const categorySchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  slug: z.string().min(1, "Slug is required").max(255),
  description: z.string().optional(),
  icon: z.string().optional(),
  imageUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  imageAlt: z.string().optional(),
  isActive: z.boolean(),
  displayOrder: z.number().int(),
  parentId: z.string().optional(),
  seoMetaTitle: z.string().optional(),
  seoMetaDescription: z.string().optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

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

type CategoryDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category | null;
};

export const CategoryDialog = ({
  open,
  onOpenChange,
  category,
}: CategoryDialogProps) => {
  const utils = trpc.useUtils();
  const [isAutoSlug, setIsAutoSlug] = useState(!category);
  const [showSeoFields, setShowSeoFields] = useState(false);

  const { data: categoriesData } = trpc.cms.category.list.useQuery({});
  const allCategories = categoriesData || [];

  const availableParents = allCategories.filter((c) => {
    if (!category) return true;
    if (c.id === category.id) return false;
    const childIds = category.children?.map((child) => child.id) || [];
    return !childIds.includes(c.id);
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || "",
      slug: category?.slug || "",
      description: category?.description || "",
      icon: category?.icon || "",
      imageUrl: category?.imageUrl || "",
      imageAlt: category?.imageAlt || "",
      isActive: category?.isActive ?? true,
      displayOrder: category?.displayOrder || 0,
      parentId: category?.parentId || undefined,
      seoMetaTitle: category?.seoMetaTitle || "",
      seoMetaDescription: category?.seoMetaDescription || "",
    },
  });

  const name = watch("name");
  const isActive = watch("isActive");
  const parentId = watch("parentId");

  useEffect(() => {
    if (isAutoSlug && name) {
      const generatedSlug = slugify(name, { lower: true, strict: true });
      setValue("slug", generatedSlug);
    }
  }, [name, isAutoSlug, setValue]);

  useEffect(() => {
    if (open && category) {
      reset({
        name: category.name,
        slug: category.slug,
        description: category.description || "",
        icon: category.icon || "",
        imageUrl: category.imageUrl || "",
        imageAlt: category.imageAlt || "",
        isActive: category.isActive,
        displayOrder: category.displayOrder,
        parentId: category.parentId || undefined,
        seoMetaTitle: category.seoMetaTitle || "",
        seoMetaDescription: category.seoMetaDescription || "",
      });
      setIsAutoSlug(false);
      setShowSeoFields(
        !!(category.seoMetaTitle || category.seoMetaDescription)
      );
    } else if (open && !category) {
      reset({
        name: "",
        slug: "",
        description: "",
        icon: "",
        imageUrl: "",
        imageAlt: "",
        isActive: true,
        displayOrder: 0,
        parentId: undefined,
        seoMetaTitle: "",
        seoMetaDescription: "",
      });
      setIsAutoSlug(true);
      setShowSeoFields(false);
    }
  }, [open, category, reset]);

  const createCategory = trpc.cms.category.create.useMutation({
    onSuccess: () => {
      toast.success("Category created successfully");
      utils.cms.category.list.invalidate();
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create category");
    },
  });

  const updateCategory = trpc.cms.category.update.useMutation({
    onSuccess: () => {
      toast.success("Category updated successfully");
      utils.cms.category.list.invalidate();
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update category");
    },
  });

  const onSubmit = (data: CategoryFormData) => {
    const payload = {
      name: data.name,
      slug: data.slug,
      description: data.description || undefined,
      icon: data.icon || undefined,
      imageUrl: data.imageUrl || undefined,
      imageAlt: data.imageAlt || undefined,
      isActive: data.isActive,
      displayOrder: data.displayOrder,
      parentId: data.parentId || undefined,
      seoMetaTitle: data.seoMetaTitle || undefined,
      seoMetaDescription: data.seoMetaDescription || undefined,
    };

    if (category) {
      updateCategory.mutate({ id: category.id, ...payload });
    } else {
      createCategory.mutate(payload);
    }
  };

  const isPending = createCategory.isPending || updateCategory.isPending;

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {category ? "Edit Category" : "Create Category"}
          </DialogTitle>
          <DialogDescription>
            {category
              ? "Update the category information below."
              : "Add a new category to organize your content."}
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label htmlFor="name">
              Name <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Folder className="-translate-y-1/2 absolute top-1/2 left-3 size-4 text-muted-foreground" />
              <Input
                className="pl-9"
                id="name"
                placeholder="Technology"
                {...register("name")}
                aria-invalid={!!errors.name}
                disabled={isPending}
              />
            </div>
            {errors.name && (
              <p className="text-destructive text-sm">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">
              Slug <span className="text-destructive">*</span>
            </Label>
            <Input
              id="slug"
              placeholder="technology"
              {...register("slug")}
              aria-invalid={!!errors.slug}
              disabled={isPending}
              onChange={(e) => {
                setIsAutoSlug(false);
                register("slug").onChange(e);
              }}
            />
            {errors.slug && (
              <p className="text-destructive text-sm">{errors.slug.message}</p>
            )}
            <p className="text-muted-foreground text-xs">
              URL-friendly identifier. Auto-generated from name.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of this category..."
              {...register("description")}
              disabled={isPending}
              rows={3}
            />
          </div>

          <div className="space-y-3">
            <Label>Parent Category</Label>
            <EntitySelector
              emptyText="No parent categories available."
              entities={availableParents}
              helperText="Optional: Select a parent to create a subcategory"
              label=""
              onChange={(ids) => setValue("parentId", ids[0] || undefined)}
              placeholder="None (top-level category)"
              searchPlaceholder="Search categories..."
              value={parentId ? [parentId] : []}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="icon">Icon</Label>
              <Input
                id="icon"
                placeholder="📱"
                {...register("icon")}
                disabled={isPending}
              />
              <p className="text-muted-foreground text-xs">Emoji or icon name</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="displayOrder">Display Order</Label>
              <Input
                id="displayOrder"
                placeholder="0"
                type="number"
                {...register("displayOrder", { valueAsNumber: true })}
                disabled={isPending}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <div className="relative">
              <Image className="-translate-y-1/2 absolute top-1/2 left-3 size-4 text-muted-foreground" />
              <Input
                className="pl-9"
                id="imageUrl"
                placeholder="https://example.com/image.jpg"
                type="url"
                {...register("imageUrl")}
                aria-invalid={!!errors.imageUrl}
                disabled={isPending}
              />
            </div>
            {errors.imageUrl && (
              <p className="text-destructive text-sm">
                {errors.imageUrl.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageAlt">Image Alt Text</Label>
            <Input
              id="imageAlt"
              placeholder="Description for accessibility"
              {...register("imageAlt")}
              disabled={isPending}
            />
          </div>

          <div className="flex items-center justify-between rounded-md border p-3">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-muted-foreground" />
              <div className="space-y-0.5">
                <Label className="cursor-pointer" htmlFor="isActive">
                  Active Category
                </Label>
                <p className="text-muted-foreground text-xs">
                  Display this category on the site
                </p>
              </div>
            </div>
            <Switch
              checked={isActive}
              disabled={isPending}
              id="isActive"
              onCheckedChange={(checked) => setValue("isActive", checked)}
            />
          </div>

          <div className="space-y-3">
            <button
              className="flex w-full items-center justify-between rounded-md border p-3 text-left hover:bg-accent"
              onClick={() => setShowSeoFields(!showSeoFields)}
              type="button"
            >
              <span className="font-medium text-sm">SEO Settings</span>
              {showSeoFields ? (
                <ChevronDown className="size-4" />
              ) : (
                <ChevronRight className="size-4" />
              )}
            </button>

            {showSeoFields && (
              <div className="space-y-4 rounded-md border p-4">
                <div className="space-y-2">
                  <Label htmlFor="seoMetaTitle">Meta Title</Label>
                  <Input
                    id="seoMetaTitle"
                    placeholder="SEO-optimized title"
                    {...register("seoMetaTitle")}
                    disabled={isPending}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seoMetaDescription">Meta Description</Label>
                  <Textarea
                    id="seoMetaDescription"
                    placeholder="SEO-optimized description"
                    {...register("seoMetaDescription")}
                    disabled={isPending}
                    rows={3}
                  />
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              disabled={isPending}
              onClick={() => onOpenChange(false)}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button disabled={isPending} type="submit">
              {isPending ? "Saving..." : category ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

