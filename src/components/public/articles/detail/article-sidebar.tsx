import type { Heading } from "@/lib/editor-utils";
import { ArticlePersonProfile } from "./article-person-profile";
import { NewsletterCta } from "./newsletter-cta";
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
  people: Array<{
    name: string;
    slug: string;
    tagline: string | null;
    jobTitle: string | null;
    company: string | null;
    description: string | null;
    imageUrl: string | null;
    linkedinUrl: string | null;
  }>;
  shareUrl: string;
  shareTitle: string;
};

export const ArticleSidebar = ({
  headings,
  relatedArticles,
  popularCategories,
  people,
  shareUrl,
  shareTitle,
}: ArticleSidebarProps) => (
  <aside className="lg:sticky lg:top-24 lg:h-fit">
    <div className="space-y-4 lg:space-y-5">
      <ArticlePersonProfile people={people} />
      <TableOfContents headings={headings} />
      <PeopleAlsoRead articles={relatedArticles} />
      <PopularCategories categories={popularCategories} />
      <SocialShare title={shareTitle} url={shareUrl} />
      <NewsletterCta />
    </div>
  </aside>
);
