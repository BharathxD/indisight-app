import Link from "next/link";
import { siteConfig } from "@/lib/config";

export const metadata = {
  title: "Research & Reports | IndiSight - Data-Driven Business Intelligence",
  description:
    "Access flagship reports, thematic essays, and open data on India's leadership, innovation, and economic transformation. Data-driven analyses for journalists, educators, and operators.",
  keywords: [
    "business research",
    "india reports",
    "leadership insights",
    "data analysis",
    "economic research",
    "innovation reports",
    "flagship reports",
    "thematic essays",
  ],
  openGraph: {
    title: "Research & Reports | IndiSight",
    description:
      "Access flagship reports, thematic essays, and open data on India's leadership and innovation.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Research & Reports | IndiSight",
    description:
      "Data-driven analyses and evergreen references for decision-makers.",
  },
};

const flagshipReports = [
  {
    title: "Quiet Revolution: India's Infrastructure Builders",
    href: "#",
  },
  {
    title: "Beyond Unicorns: Real Innovation Story",
    href: "#",
  },
  {
    title: "Policy-Practice Gap: Implementation Leaders",
    href: "#",
  },
];

const thematicEssays = [
  {
    title: "Democracy of Commerce",
    href: "#",
  },
  {
    title: "Inheritance Dilemma",
    href: "#",
  },
];

const ResearchPage = () => (
  <>
    <script
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data is safe
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Research & Reports",
          description:
            "Data-driven analyses and evergreen references for journalists, educators, and operators.",
          url: `${siteConfig.url}/research`,
          publisher: {
            "@type": "Organization",
            name: siteConfig.name,
            url: siteConfig.url,
          },
          about: [
            {
              "@type": "Thing",
              name: "Business Research",
            },
            {
              "@type": "Thing",
              name: "Leadership Insights",
            },
            {
              "@type": "Thing",
              name: "Economic Analysis",
            },
          ],
        }),
      }}
      type="application/ld+json"
    />
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden border-border border-b py-24 md:py-32">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:64px_64px] opacity-20" />
        <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
          <div className="mb-8 inline-flex items-center gap-2 border border-border bg-muted px-3 py-1 font-medium text-muted-foreground text-xs uppercase tracking-wider">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-foreground opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-foreground" />
            </span>
            Knowledge Base
          </div>
          <h1 className="mb-6 max-w-4xl font-bold text-5xl text-foreground leading-tight tracking-tight md:text-6xl lg:text-7xl">
            Research & Reports
          </h1>
          <p className="mb-12 max-w-2xl text-muted-foreground text-xl leading-relaxed">
            Data-driven analyses and evergreen references for journalists,
            educators, and operators.
          </p>
        </div>
      </section>

      <section className="border-border border-b bg-background py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6 md:px-12">
          <div className="mb-8">
            <div className="mb-3 inline-flex items-center gap-2 border border-border bg-muted px-3 py-1 font-medium text-muted-foreground text-xs uppercase tracking-wider">
              01
            </div>
            <h2 className="font-bold text-3xl text-foreground tracking-tight md:text-4xl">
              Flagship
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {flagshipReports.map((report, index) => (
              <Link
                className="group border border-border bg-background p-6 transition-colors hover:border-foreground"
                href={report.href}
                key={report.title}
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-mono text-muted-foreground text-xs">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <svg
                    aria-hidden="true"
                    className="size-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-foreground"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
                <h3 className="font-bold text-foreground text-lg leading-tight">
                  {report.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-border border-b bg-muted py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6 md:px-12">
          <div className="mb-8">
            <div className="mb-3 inline-flex items-center gap-2 border border-border bg-background px-3 py-1 font-medium text-muted-foreground text-xs uppercase tracking-wider">
              02
            </div>
            <h2 className="font-bold text-3xl text-foreground tracking-tight md:text-4xl">
              Thematic Essays
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {thematicEssays.map((essay, index) => (
              <Link
                className="group border border-border bg-background p-8 transition-colors hover:border-foreground"
                href={essay.href}
                key={essay.title}
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-mono text-muted-foreground text-xs">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <svg
                    aria-hidden="true"
                    className="size-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-foreground"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
                <h3 className="font-bold text-foreground text-xl leading-tight">
                  {essay.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-border border-b bg-background py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6 md:px-12">
          <div className="grid gap-12 lg:grid-cols-1 lg:gap-16">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 border border-border bg-muted px-3 py-1 font-medium text-muted-foreground text-xs uppercase tracking-wider">
                03
              </div>
              <h2 className="mb-4 font-bold text-3xl text-foreground tracking-tight md:text-4xl">
                Embeds & Open Data
              </h2>
              <p className="mb-8 text-lg text-muted-foreground leading-relaxed">
                Use our charts and data with attribution.
              </p>
              <div className="space-y-4">
                <Link
                  className="group flex items-center justify-between border border-border bg-muted p-4 transition-colors hover:border-foreground"
                  href="/attribution"
                >
                  <div>
                    <h3 className="font-semibold text-foreground">
                      Attribution Guidelines
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      How to properly credit our work
                    </p>
                  </div>
                  <svg
                    aria-hidden="true"
                    className="size-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-foreground"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link
                  className="group flex items-center justify-between border border-border bg-muted p-4 transition-colors hover:border-foreground"
                  href="/feed.xml"
                >
                  <div>
                    <h3 className="font-semibold text-foreground">RSS Feed</h3>
                    <p className="text-muted-foreground text-sm">
                      Subscribe to updates via RSS
                    </p>
                  </div>
                  <svg
                    aria-hidden="true"
                    className="size-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-foreground"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-6 md:px-12">
          <div className="border border-border bg-background p-8 text-center md:p-12">
            <h2 className="mb-4 font-bold text-3xl text-foreground tracking-tight">
              Get Research Updates
            </h2>
            <p className="mb-8 text-lg text-muted-foreground leading-relaxed">
              Get weekly updates on new flagship reports, thematic essays, and
              data insights delivered to your inbox.
            </p>
            <Link
              className="inline-flex items-center justify-center gap-2 border border-border bg-foreground px-8 py-4 font-medium text-background transition-colors hover:bg-foreground/90"
              href="https://tally.so/r/w2YgzD"
              rel="noopener noreferrer"
              target="_blank"
            >
              Subscribe to Newsletter
              <svg
                aria-hidden="true"
                className="size-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  </>
);

export default ResearchPage;
