"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Hash, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import slugify from "slugify";
import { toast } from "sonner";
import { z } from "zod";
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
import { useTrpcInvalidations } from "@/trpc/use-trpc-invalidations";

const tagSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  slug: z.string().min(1, "Slug is required").max(255),
  description: z.string().optional(),
  isTrending: z.boolean(),
});

type TagFormData = z.infer<typeof tagSchema>;

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

type TagDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tag?: Tag | null;
};

export const TagDialog = ({ open, onOpenChange, tag }: TagDialogProps) => {
  const { invalidateTagGraph } = useTrpcInvalidations();
  const [isAutoSlug, setIsAutoSlug] = useState(!tag);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<TagFormData>({
    resolver: zodResolver(tagSchema),
    defaultValues: {
      name: tag?.name || "",
      slug: tag?.slug || "",
      description: tag?.description || "",
      isTrending: tag?.isTrending,
    },
  });

  const name = watch("name");
  const isTrending = watch("isTrending");

  useEffect(() => {
    if (isAutoSlug && name) {
      const generatedSlug = slugify(name, { lower: true, strict: true });
      setValue("slug", generatedSlug);
    }
  }, [name, isAutoSlug, setValue]);

  useEffect(() => {
    if (open && tag) {
      reset({
        name: tag.name,
        slug: tag.slug,
        description: tag.description || "",
        isTrending: tag.isTrending,
      });
      setIsAutoSlug(false);
    } else if (open && !tag) {
      reset({
        name: "",
        slug: "",
        description: "",
        isTrending: false,
      });
      setIsAutoSlug(true);
    }
  }, [open, tag, reset]);

  const createTag = trpc.cms.tag.create.useMutation({
    onSuccess: async () => {
      toast.success("Tag created successfully");
      await invalidateTagGraph();
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create tag");
    },
  });

  const updateTag = trpc.cms.tag.update.useMutation({
    onSuccess: async () => {
      toast.success("Tag updated successfully");
      await invalidateTagGraph();
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update tag");
    },
  });

  const onSubmit = (data: TagFormData) => {
    const payload = {
      name: data.name,
      slug: data.slug,
      description: data.description || undefined,
      isTrending: data.isTrending,
    };

    if (tag) {
      updateTag.mutate({ id: tag.id, ...payload });
    } else {
      createTag.mutate(payload);
    }
  };

  const isPending = createTag.isPending || updateTag.isPending;

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{tag ? "Edit Tag" : "Create Tag"}</DialogTitle>
          <DialogDescription>
            {tag
              ? "Update the tag information below."
              : "Add a new tag to organize your content."}
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label htmlFor="name">
              Name <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Hash className="-translate-y-1/2 absolute top-1/2 left-3 size-4 text-muted-foreground" />
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
              placeholder="Brief description of this tag..."
              {...register("description")}
              disabled={isPending}
              rows={3}
            />
          </div>

          <div className="flex items-center justify-between rounded-md border p-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="size-4 text-muted-foreground" />
              <div className="space-y-0.5">
                <Label className="cursor-pointer" htmlFor="isTrending">
                  Trending Tag
                </Label>
                <p className="text-muted-foreground text-xs">
                  Highlight this tag as trending
                </p>
              </div>
            </div>
            <Switch
              checked={isTrending}
              disabled={isPending}
              id="isTrending"
              onCheckedChange={(checked) => setValue("isTrending", checked)}
            />
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
              {isPending ? "Saving..." : tag ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
