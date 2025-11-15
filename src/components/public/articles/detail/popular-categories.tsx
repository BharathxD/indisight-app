import Link from "next/link";

type PopularCategoriesProps = {
  categories: Array<{
    id: string;
    name: string;
    slug: string;
    articleCount: number;
    icon: string | null;
  }>;
};

export const PopularCategories = ({ categories }: PopularCategoriesProps) => {
  if (categories.length === 0) return null;

  return (
    <div className="rounded-lg border border-border bg-muted/30 p-5 lg:rounded-none lg:border-0 lg:border-t lg:bg-transparent lg:p-0 lg:pt-8">
      <h3 className="mb-4 font-semibold text-[0.8125rem] text-muted-foreground uppercase tracking-wider">
        Popular Categories
      </h3>
      <div className="space-y-2">
        {categories.map((category) => (
          <Link
            className="flex items-center justify-between rounded-md border border-border bg-background px-3 py-2.5 transition-all hover:border-foreground/40 hover:bg-muted lg:border-transparent lg:bg-transparent"
            href={`/categories/${category.slug}`}
            key={category.id}
          >
            <span className="text-[0.875rem] text-foreground">
              {category.name}
            </span>
            <span className="rounded-full bg-muted px-2 py-0.5 font-medium text-[0.75rem] text-muted-foreground">
              {category.articleCount}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};
