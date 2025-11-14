import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type ArticleAuthorBioProps = {
  author: {
    name: string;
    slug: string;
    bio: string | null;
    profileImageUrl: string | null;
  };
};

export const ArticleAuthorBio = ({ author }: ArticleAuthorBioProps) => {
  if (!author.bio) return null;

  return (
    <div className="mt-12 rounded-lg border border-border bg-muted/30 p-8">
      <div className="flex gap-6">
        {author.profileImageUrl ? (
          <Image
            alt={author.name}
            className="size-20 shrink-0 rounded-full object-cover"
            height={80}
            src={author.profileImageUrl}
            width={80}
          />
        ) : (
          <div className="flex size-20 shrink-0 items-center justify-center rounded-full bg-background font-semibold text-muted-foreground text-xl">
            {author.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="flex-1">
          <h3 className="mb-3 font-bold text-[1.125rem] text-foreground leading-tight">
            About {author.name}
          </h3>
          <p className="mb-4 text-[0.9375rem] text-muted-foreground leading-[1.6]">
            {author.bio}
          </p>
          <Link
            className="inline-flex items-center gap-1.5 font-medium text-[0.875rem] text-foreground transition-colors hover:text-muted-foreground"
            href={`/authors/${author.slug}`}
          >
            View all articles
            <ArrowRightIcon className="size-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

