"use client";

import slugify from "slugify";
import { toast } from "sonner";
import { EntitySelector } from "@/components/admin/articles/entity-selector";
import { trpc } from "@/trpc/client";

type TagSelectorProps = {
  value: string[];
  onChange: (tagIds: string[]) => void;
};

export const TagSelector = ({ value, onChange }: TagSelectorProps) => {
  const utils = trpc.useUtils();
  const { data: tagsData } = trpc.cms.tag.list.useQuery({ limit: 100 });
  const tags = tagsData?.tags || [];

  const createTag = trpc.cms.tag.create.useMutation({
    onMutate: async (newTag) => {
      await utils.cms.tag.list.cancel();
      const previousData = utils.cms.tag.list.getData({ limit: 100 });

      const optimisticTag = {
        id: `temp-${Date.now()}`,
        name: newTag.name,
        slug: newTag.slug,
        description: null,
        isTrending: false,
        usageCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      utils.cms.tag.list.setData({ limit: 100 }, (old) => ({
        tags: [...(old?.tags || []), optimisticTag],
        nextCursor: old?.nextCursor,
      }));

      onChange([...value, optimisticTag.id]);

      return { previousData, optimisticTag };
    },
    onSuccess: (data, _, context) => {
      const newValue = value.map((id) =>
        id === context.optimisticTag.id ? data.id : id
      );
      onChange(newValue);
      toast.success(`Tag "${data.name}" created`);
    },
    onError: (error, _, context) => {
      if (context?.previousData) {
        utils.cms.tag.list.setData({ limit: 100 }, context.previousData);
      }
      onChange(value.filter((id) => id !== context?.optimisticTag.id));
      toast.error(error.message || "Failed to create tag");
    },
    onSettled: () => {
      utils.cms.tag.list.invalidate();
    },
  });

  const handleCreate = (name: string) => {
    const slug = slugify(name, { lower: true, strict: true });
    createTag.mutate({ name, slug });
  };

  return (
    <EntitySelector
      allowCreate
      emptyText="No tags found."
      entities={tags}
      helperText="Optional: Add relevant tags to improve discoverability"
      isCreating={createTag.isPending}
      label="Tags"
      onChange={onChange}
      onCreate={handleCreate}
      placeholder="Select tags"
      searchPlaceholder="Search tags..."
      value={value}
    />
  );
};
