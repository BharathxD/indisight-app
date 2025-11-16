import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type AuthorInfoProps = {
  author: {
    name: string;
    slug: string;
    profileImageUrl?: string | null;
  };
  date?: Date | string | null;
  readTime?: number | null;
  className?: string;
  showAvatar?: boolean;
  disableLinks?: boolean;
};

const formatDate = (date: Date | string) => {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d);
};

export const AuthorInfo = ({
  author,
  date,
  readTime,
  className,
  showAvatar = true,
  disableLinks = false,
}: AuthorInfoProps) => {
  const isSmall = className?.includes("text-xs");
  const avatarSize = isSmall ? 28 : 32;

  const avatarContent = author.profileImageUrl ? (
    <Image
      alt={author.name}
      className="rounded-full object-cover object-top"
      height={avatarSize}
      src={author.profileImageUrl}
      style={{ width: avatarSize, height: avatarSize }}
      width={avatarSize}
    />
  ) : (
    <div
      className="flex items-center justify-center rounded-full bg-muted font-semibold text-muted-foreground text-xs"
      style={{ width: avatarSize, height: avatarSize }}
    >
      {author.name.charAt(0).toUpperCase()}
    </div>
  );

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {showAvatar &&
        (disableLinks ? (
          <div className="shrink-0">{avatarContent}</div>
        ) : (
          <Link className="shrink-0" href={`/authors/${author.slug}`}>
            {avatarContent}
          </Link>
        ))}
      <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
        {disableLinks ? (
          <span className="font-medium text-foreground">{author.name}</span>
        ) : (
          <Link
            className="font-medium text-foreground transition-colors hover:text-muted-foreground"
            href={`/authors/${author.slug}`}
          >
            {author.name}
          </Link>
        )}
        {date && (
          <>
            <span className="text-border">·</span>
            <time
              dateTime={typeof date === "string" ? date : date.toISOString()}
            >
              {formatDate(date)}
            </time>
          </>
        )}
        {readTime && (
          <>
            <span className="text-border">·</span>
            <span>{readTime} min read</span>
          </>
        )}
      </div>
    </div>
  );
};
