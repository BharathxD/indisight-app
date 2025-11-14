import type { Heading } from "@/lib/editor-utils";
import { PeopleAlsoRead } from "./people-also-read";
import { PopularCategories } from "./popular-categories";
import { SocialShare } from "./social-share";
import { TableOfContents } from "./table-of-contents";

type ArticleSidebarProps = {
  headings: Heading[];
  relatedArticles: Array<{
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
  }>;
  popularCategories: Array<{
    id: string;
    name: string;
    slug: string;
    articleCount: number;
    icon: string | null;
  }>;
  shareUrl: string;
  shareTitle: string;
};

export const ArticleSidebar = ({
  headings,
  relatedArticles,
  popularCategories,
  shareUrl,
  shareTitle,
}: ArticleSidebarProps) => (
  <aside className="lg:sticky lg:top-24 lg:h-fit">
    <div className="space-y-6 lg:space-y-8">
      <TableOfContents headings={headings} />
      <PeopleAlsoRead articles={relatedArticles} />
      <PopularCategories categories={popularCategories} />
      <SocialShare title={shareTitle} url={shareUrl} />
    </div>
  </aside>
);
