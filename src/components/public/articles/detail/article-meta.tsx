import Image from "next/image";
import Link from "next/link";

type ArticleMetaProps = {
  author: {
    name: string;
    slug: string;
    profileImageUrl: string | null;
  };
  publishedAt: Date | null;
  readTime: number | null;
};

const formatDate = (date: Date | null) => {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
};

export const ArticleMeta = ({
  author,
  publishedAt,
  readTime,
}: ArticleMetaProps) => (
  <div className="mb-12 flex items-center gap-4 border-border border-b pb-6">
    <Link className="flex items-center gap-3" href={`/authors/${author.slug}`}>
      {author.profileImageUrl ? (
        <Image
          alt={author.name}
          className="size-11 rounded-full object-cover"
          height={44}
          src={author.profileImageUrl}
          width={44}
        />
      ) : (
        <div className="flex size-11 items-center justify-center rounded-full bg-muted font-semibold text-[0.9375rem] text-muted-foreground">
          {author.name.charAt(0).toUpperCase()}
        </div>
      )}
      <div>
        <div className="font-medium text-[0.9375rem] text-foreground transition-colors hover:text-muted-foreground">
          {author.name}
        </div>
        <div className="text-[0.8125rem] text-muted-foreground">
          {formatDate(publishedAt)}
          {readTime && ` · ${readTime} min read`}
        </div>
      </div>
    </Link>
  </div>
);
