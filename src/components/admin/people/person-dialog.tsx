"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import slugify from "slugify";
import { toast } from "sonner";
import { z } from "zod";
import { ImageUploadDropzone } from "@/components/admin/articles/image-upload-dropzone";
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
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/trpc/client";
import { useTrpcInvalidations } from "@/trpc/use-trpc-invalidations";

const personSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  slug: z.string().min(1, "Slug is required").max(255),
  tagline: z.string().optional(),
  jobTitle: z.string().optional(),
  company: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.url("Invalid URL").optional().or(z.literal("")),
  imageAlt: z.string().optional(),
  linkedinUrl: z.url("Invalid URL").optional().or(z.literal("")),
});

type PersonFormData = z.infer<typeof personSchema>;

type Person = {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  jobTitle: string | null;
  company: string | null;
  description: string | null;
  imageUrl: string | null;
  imageAlt: string | null;
  linkedinUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type PersonDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  person?: Person | null;
};

export const PersonDialog = ({
  open,
  onOpenChange,
  person,
}: PersonDialogProps) => {
  const { invalidateArticleGraph } = useTrpcInvalidations();
  const [isAutoSlug, setIsAutoSlug] = useState(!person);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<PersonFormData>({
    resolver: zodResolver(personSchema),
    defaultValues: {
      name: person?.name || "",
      slug: person?.slug || "",
      tagline: person?.tagline || "",
      jobTitle: person?.jobTitle || "",
      company: person?.company || "",
      description: person?.description || "",
      imageUrl: person?.imageUrl || "",
      imageAlt: person?.imageAlt || "",
      linkedinUrl: person?.linkedinUrl || "",
    },
  });

  const name = watch("name");
  const imageUrl = watch("imageUrl");

  useEffect(() => {
    if (isAutoSlug && name) {
      const generatedSlug = slugify(name, { lower: true, strict: true });
      setValue("slug", generatedSlug);
    }
  }, [name, isAutoSlug, setValue]);

  useEffect(() => {
    if (open && person) {
      reset({
        name: person.name,
        slug: person.slug,
        tagline: person.tagline || "",
        jobTitle: person.jobTitle || "",
        company: person.company || "",
        description: person.description || "",
        imageUrl: person.imageUrl || "",
        imageAlt: person.imageAlt || "",
        linkedinUrl: person.linkedinUrl || "",
      });
      setIsAutoSlug(false);
    } else if (open && !person) {
      reset({
        name: "",
        slug: "",
        tagline: "",
        jobTitle: "",
        company: "",
        description: "",
        imageUrl: "",
        imageAlt: "",
        linkedinUrl: "",
      });
      setIsAutoSlug(true);
    }
  }, [open, person, reset]);

  const createPerson = trpc.cms.person.create.useMutation({
    onSuccess: async () => {
      toast.success("Person created successfully");
      await invalidateArticleGraph();
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create person");
    },
  });

  const updatePerson = trpc.cms.person.update.useMutation({
    onSuccess: async () => {
      toast.success("Person updated successfully");
      await invalidateArticleGraph();
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update person");
    },
  });

  const onSubmit = (data: PersonFormData) => {
    const payload = {
      name: data.name,
      slug: data.slug,
      tagline: data.tagline || undefined,
      jobTitle: data.jobTitle || undefined,
      company: data.company || undefined,
      description: data.description || undefined,
      imageUrl: data.imageUrl || undefined,
      imageAlt: data.imageAlt || undefined,
      linkedinUrl: data.linkedinUrl || undefined,
    };

    if (person) {
      updatePerson.mutate({ id: person.id, ...payload });
    } else {
      createPerson.mutate(payload);
    }
  };

  const isPending = createPerson.isPending || updatePerson.isPending;

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{person ? "Edit Person" : "Create Person"}</DialogTitle>
          <DialogDescription>
            {person
              ? "Update person information"
              : "Add a new person to feature in articles"}
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input id="name" placeholder="John Doe" {...register("name")} />
              {errors.name && (
                <p className="text-destructive text-sm">
                  {errors.name.message}
                </p>
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
                onChange={(e) => {
                  setIsAutoSlug(false);
                  setValue("slug", e.target.value);
                }}
              />
              {errors.slug && (
                <p className="text-destructive text-sm">
                  {errors.slug.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tagline">Tagline</Label>
              <Input
                id="tagline"
                placeholder="Innovator, Leader, Visionary"
                {...register("tagline")}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input
                  id="jobTitle"
                  placeholder="CEO"
                  {...register("jobTitle")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  placeholder="Acme Inc."
                  {...register("company")}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
              <Input
                id="linkedinUrl"
                placeholder="https://linkedin.com/in/username"
                type="url"
                {...register("linkedinUrl")}
              />
              {errors.linkedinUrl && (
                <p className="text-destructive text-sm">
                  {errors.linkedinUrl.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description about the person..."
                rows={4}
                {...register("description")}
              />
            </div>

            <div className="space-y-2">
              <Label>Profile Image</Label>
              <ImageUploadDropzone
                folder="people"
                label="Profile Image"
                onChange={(url: string) => setValue("imageUrl", url)}
                recommendedDimensions="400 × 400px"
                value={imageUrl}
              />
              {imageUrl && (
                <div className="flex items-center gap-3 rounded-md border p-3">
                  {imageUrl ? (
                    <div className="size-12 overflow-hidden rounded-full">
                      <div
                        className="size-full bg-center bg-cover"
                        style={{ backgroundImage: `url(${imageUrl})` }}
                      />
                    </div>
                  ) : (
                    <div className="flex size-12 items-center justify-center rounded-full bg-accent">
                      <User className="size-6" />
                    </div>
                  )}
                  <div className="flex-1">
                    <Input
                      placeholder="https://example.com/image.jpg"
                      {...register("imageUrl")}
                    />
                  </div>
                </div>
              )}
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
                placeholder="Profile photo of John Doe"
                {...register("imageAlt")}
              />
            </div>
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
              {isPending
                ? person
                  ? "Updating..."
                  : "Creating..."
                : person
                  ? "Update Person"
                  : "Create Person"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
