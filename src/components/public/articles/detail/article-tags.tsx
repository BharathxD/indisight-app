import Link from "next/link";

type ArticleTagsProps = {
  tags: Array<{
    tag: {
      id: string;
      name: string;
      slug: string;
    };
  }>;
};

export const ArticleTags = ({ tags }: ArticleTagsProps) => {
  if (tags.length === 0) return null;

  return (
    <div className="border-border border-t pt-10">
      <h3 className="mb-5 font-semibold text-[0.8125rem] text-muted-foreground uppercase tracking-wider">
        Tagged
      </h3>
      <div className="flex flex-wrap gap-2">
        {tags.map(({ tag }) => (
          <Link
            className="rounded-md border border-border bg-background px-3 py-1.5 font-medium text-[0.8125rem] text-foreground transition-all hover:border-foreground/40 hover:bg-muted"
            href={`/tags/${tag.slug}`}
            key={tag.id}
          >
            {tag.name}
          </Link>
        ))}
      </div>
    </div>
  );
};
