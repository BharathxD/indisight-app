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
    <div className="space-y-2">
      <h3 className="font-medium text-base text-foreground/70">
        Famous Categories
      </h3>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Link
            className="inline-flex items-center bg-muted px-4 py-2 text-foreground text-sm transition-colors hover:bg-muted/70"
            href={`/categories/${category.slug}`}
            key={category.id}
          >
            {category.name}
          </Link>
        ))}
      </div>
    </div>
  );
};
