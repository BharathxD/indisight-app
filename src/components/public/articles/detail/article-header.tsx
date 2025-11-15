import Image from "next/image";

type ArticleHeaderProps = {
  title: string;
  excerpt: string | null;
  featuredImageUrl: string | null;
  featuredImageAlt: string | null;
  primaryCategory: {
    category: {
      name: string;
    };
  } | null;
};

export const ArticleHeader = ({
  title,
  excerpt,
  featuredImageUrl,
  featuredImageAlt,
  primaryCategory,
}: ArticleHeaderProps) => (
  <div className="border-border border-b bg-black py-12 md:py-20 lg:py-24">
    <div className="mx-auto max-w-[1400px] px-6 md:px-12">
      <div className="flex flex-col items-start gap-8 md:gap-10 lg:flex-row lg:items-start lg:gap-12 xl:gap-16">
        <div className="order-2 w-full lg:order-1 lg:flex-1 lg:pt-4">
          {primaryCategory && (
            <div className="mb-6">
              <span className="rounded-full border border-white/20 bg-white/5 px-4 py-1.5 font-medium text-[0.8125rem] text-white/90 uppercase tracking-wider backdrop-blur-sm">
                {primaryCategory.category.name}
              </span>
            </div>
          )}
          <h1 className="mb-6 font-bold text-[2.25rem] text-white leading-[1.15] tracking-[-0.03em] sm:text-[2.75rem] md:text-[3.25rem] lg:text-[3.75rem] lg:leading-[1.1]">
            {title}
          </h1>
          {excerpt && (
            <p className="text-[1rem] text-white/70 leading-[1.65] sm:text-[1.125rem] md:text-[1.25rem] md:leading-[1.6]">
              {excerpt}
            </p>
          )}
        </div>
        {featuredImageUrl && (
          <div className="order-1 w-full lg:order-2 lg:w-[420px] lg:shrink-0 xl:w-[480px]">
            <div className="relative aspect-4/3 w-full overflow-hidden rounded-lg sm:aspect-square">
              <Image
                alt={featuredImageAlt || title}
                className="h-full w-full object-cover"
                fill
                priority
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 480px"
                src={featuredImageUrl}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);
