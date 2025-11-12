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
  const avatarContent = author.profileImageUrl ? (
    <Image
      alt={author.name}
      className="size-8 object-cover"
      height={32}
      src={author.profileImageUrl}
      width={32}
    />
  ) : (
    <div className="flex size-8 items-center justify-center bg-gray-200 font-semibold text-gray-600 text-xs">
      {author.name.charAt(0).toUpperCase()}
    </div>
  );

  const authorName = disableLinks ? (
    <span className="font-medium">{author.name}</span>
  ) : (
    <Link
      className="font-medium hover:text-gray-900"
      href={`/authors/${author.slug}`}
    >
      {author.name}
    </Link>
  );

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {showAvatar &&
        (disableLinks ? (
          <div className="shrink-0">{avatarContent}</div>
        ) : (
          <Link className="shrink-0" href={`/authors/${author.slug}`}>
            {avatarContent}
          </Link>
        ))}
      <div className="flex items-center gap-2 text-gray-600 text-sm">
        {authorName}
        {date && (
          <>
            <span className="text-gray-400">·</span>
            <time
              dateTime={typeof date === "string" ? date : date.toISOString()}
            >
              {formatDate(date)}
            </time>
          </>
        )}
        {readTime && (
          <>
            <span className="text-gray-400">·</span>
            <span>{readTime} min read</span>
          </>
        )}
      </div>
    </div>
  );
};
