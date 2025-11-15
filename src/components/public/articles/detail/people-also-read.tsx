import Link from "next/link";

type PeopleAlsoReadProps = {
  articles: Array<{
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
  }>;
};

export const PeopleAlsoRead = ({ articles }: PeopleAlsoReadProps) => {
  if (articles.length === 0) return null;

  return (
    <div className="rounded-lg border border-border bg-muted/30 p-5 lg:rounded-none lg:border-0 lg:border-t lg:bg-transparent lg:p-0 lg:pt-8">
      <h3 className="mb-4 font-semibold text-[0.8125rem] text-muted-foreground uppercase tracking-wider">
        People Also Read
      </h3>
      <div className="space-y-3 lg:space-y-4">
        {articles.map((article) => (
          <Link
            className="group block"
            href={`/articles/${article.slug}`}
            key={article.id}
          >
            <div className="rounded-md border border-border bg-background p-4 transition-all hover:border-foreground/20 hover:bg-muted">
              <h4 className="mb-2 font-medium text-[0.875rem] text-foreground leading-tight group-hover:text-muted-foreground">
                {article.title}
              </h4>
              {article.excerpt && (
                <p className="line-clamp-2 text-[0.8125rem] text-muted-foreground leading-relaxed">
                  {article.excerpt}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
