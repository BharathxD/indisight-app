"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Globe, Linkedin, Mail, Star, Twitter, User } from "lucide-react";
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

const socialLinksSchema = z.object({
  twitter: z.url().optional().or(z.literal("")),
  linkedin: z.url().optional().or(z.literal("")),
  website: z.url().optional().or(z.literal("")),
});

const authorSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  slug: z.string().min(1, "Slug is required").max(255),
  bio: z.string().optional(),
  email: z.email("Invalid email").optional().or(z.literal("")),
  profileImageUrl: z.url("Invalid URL").optional().or(z.literal("")),
  socialLinks: socialLinksSchema,
  isFeatured: z.boolean(),
});

type AuthorFormData = z.infer<typeof authorSchema>;

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

type AuthorDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  author?: Author | null;
};

export const AuthorDialog = ({
  open,
  onOpenChange,
  author,
}: AuthorDialogProps) => {
  const utils = trpc.useUtils();
  const [isAutoSlug, setIsAutoSlug] = useState(!author);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<AuthorFormData>({
    resolver: zodResolver(authorSchema),
    defaultValues: {
      name: author?.name || "",
      slug: author?.slug || "",
      bio: author?.bio || "",
      email: author?.email || "",
      profileImageUrl: author?.profileImageUrl || "",
      socialLinks: {
        twitter: (author?.socialLinks as Record<string, string>)?.twitter || "",
        linkedin:
          (author?.socialLinks as Record<string, string>)?.linkedin || "",
        website: (author?.socialLinks as Record<string, string>)?.website || "",
      },
      isFeatured: author?.isFeatured,
    },
  });

  const name = watch("name");
  const isFeatured = watch("isFeatured");

  useEffect(() => {
    if (isAutoSlug && name) {
      const generatedSlug = slugify(name, { lower: true, strict: true });
      setValue("slug", generatedSlug);
    }
  }, [name, isAutoSlug, setValue]);

  useEffect(() => {
    if (open && author) {
      reset({
        name: author.name,
        slug: author.slug,
        bio: author.bio || "",
        email: author.email || "",
        profileImageUrl: author.profileImageUrl || "",
        socialLinks: {
          twitter:
            (author.socialLinks as Record<string, string>)?.twitter || "",
          linkedin:
            (author.socialLinks as Record<string, string>)?.linkedin || "",
          website:
            (author.socialLinks as Record<string, string>)?.website || "",
        },
        isFeatured: author.isFeatured,
      });
      setIsAutoSlug(false);
    } else if (open && !author) {
      reset({
        name: "",
        slug: "",
        bio: "",
        email: "",
        profileImageUrl: "",
        socialLinks: {
          twitter: "",
          linkedin: "",
          website: "",
        },
        isFeatured: false,
      });
      setIsAutoSlug(true);
    }
  }, [open, author, reset]);

  const createAuthor = trpc.cms.author.create.useMutation({
    onSuccess: () => {
      toast.success("Author created successfully");
      utils.cms.author.list.invalidate();
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create author");
    },
  });

  const updateAuthor = trpc.cms.author.update.useMutation({
    onSuccess: () => {
      toast.success("Author updated successfully");
      utils.cms.author.list.invalidate();
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update author");
    },
  });

  const onSubmit = (data: AuthorFormData) => {
    const socialLinks = {
      ...(data.socialLinks.twitter && { twitter: data.socialLinks.twitter }),
      ...(data.socialLinks.linkedin && { linkedin: data.socialLinks.linkedin }),
      ...(data.socialLinks.website && { website: data.socialLinks.website }),
    };

    const payload = {
      name: data.name,
      slug: data.slug,
      bio: data.bio || undefined,
      email: data.email || undefined,
      profileImageUrl: data.profileImageUrl || undefined,
      socialLinks:
        Object.keys(socialLinks).length > 0 ? socialLinks : undefined,
      isFeatured: data.isFeatured,
    };

    if (author) {
      updateAuthor.mutate({ id: author.id, ...payload });
    } else {
      createAuthor.mutate(payload);
    }
  };

  const isPending = createAuthor.isPending || updateAuthor.isPending;

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{author ? "Edit Author" : "Create Author"}</DialogTitle>
          <DialogDescription>
            {author
              ? "Update the author information below."
              : "Add a new author to your content management system."}
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label htmlFor="name">
              Name <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <User className="-translate-y-1/2 absolute top-1/2 left-3 size-4 text-muted-foreground" />
              <Input
                className="pl-9"
                id="name"
                placeholder="John Doe"
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
              placeholder="john-doe"
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
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="-translate-y-1/2 absolute top-1/2 left-3 size-4 text-muted-foreground" />
              <Input
                className="pl-9"
                id="email"
                placeholder="john@example.com"
                type="email"
                {...register("email")}
                aria-invalid={!!errors.email}
                disabled={isPending}
              />
            </div>
            {errors.email && (
              <p className="text-destructive text-sm">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Author biography..."
              {...register("bio")}
              disabled={isPending}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="profileImageUrl">Profile Image URL</Label>
            <Input
              id="profileImageUrl"
              placeholder="https://example.com/image.jpg"
              type="url"
              {...register("profileImageUrl")}
              aria-invalid={!!errors.profileImageUrl}
              disabled={isPending}
            />
            {errors.profileImageUrl && (
              <p className="text-destructive text-sm">
                {errors.profileImageUrl.message}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <Label>Social Links</Label>
            <div className="space-y-2">
              <div className="relative">
                <Twitter className="-translate-y-1/2 absolute top-1/2 left-3 size-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="Twitter URL"
                  {...register("socialLinks.twitter")}
                  aria-invalid={!!errors.socialLinks?.twitter}
                  disabled={isPending}
                />
              </div>
              {errors.socialLinks?.twitter && (
                <p className="text-destructive text-sm">
                  {errors.socialLinks.twitter.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <div className="relative">
                <Linkedin className="-translate-y-1/2 absolute top-1/2 left-3 size-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="LinkedIn URL"
                  {...register("socialLinks.linkedin")}
                  aria-invalid={!!errors.socialLinks?.linkedin}
                  disabled={isPending}
                />
              </div>
              {errors.socialLinks?.linkedin && (
                <p className="text-destructive text-sm">
                  {errors.socialLinks.linkedin.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <div className="relative">
                <Globe className="-translate-y-1/2 absolute top-1/2 left-3 size-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="Website URL"
                  {...register("socialLinks.website")}
                  aria-invalid={!!errors.socialLinks?.website}
                  disabled={isPending}
                />
              </div>
              {errors.socialLinks?.website && (
                <p className="text-destructive text-sm">
                  {errors.socialLinks.website.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between rounded-md border p-3">
            <div className="flex items-center gap-2">
              <Star className="size-4 text-muted-foreground" />
              <div className="space-y-0.5">
                <Label className="cursor-pointer" htmlFor="isFeatured">
                  Featured Author
                </Label>
                <p className="text-muted-foreground text-xs">
                  Display this author prominently
                </p>
              </div>
            </div>
            <Switch
              checked={isFeatured}
              disabled={isPending}
              id="isFeatured"
              onCheckedChange={(checked) => setValue("isFeatured", checked)}
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
              {isPending ? "Saving..." : author ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
