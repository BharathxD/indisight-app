import Link from "next/link";

type PeopleAlsoReadProps = {
  articles: Array<{
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
  }>;
};

export const PeopleAlsoRead = ({ articles }: PeopleAlsoReadProps) => (
  <div className="space-y-2">
    <h3 className="font-medium text-base text-foreground/70">
      People Also Read
    </h3>
    {articles.length === 0 ? (
      <p className="text-muted-foreground text-sm">
        No related articles available yet.
      </p>
    ) : (
      <div className="space-y-2">
        {articles.map((article) => (
          <Link
            className="group block border-b pb-2 last:border-0 last:pb-0"
            href={`/articles/${article.slug}`}
            key={article.id}
          >
            <h4 className="font-normal text-base text-foreground leading-snug transition-colors hover:text-foreground/60">
              {article.title}
            </h4>
          </Link>
        ))}
      </div>
    )}
  </div>
);
