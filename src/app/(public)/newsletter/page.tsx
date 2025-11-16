import Link from "next/link";

export const metadata = {
  title: "Newsletter | IndiSight - Subscribe for Leadership Insights",
  description:
    "Subscribe to IndiSight's newsletter for exclusive insights, stories, and research on leadership, innovation, and meaningful change. Join thousands of executives and investors.",
  keywords: [
    "newsletter subscription",
    "leadership insights",
    "business intelligence",
    "executive newsletter",
    "innovation updates",
    "research updates",
  ],
  openGraph: {
    title: "Newsletter | IndiSight",
    description:
      "Subscribe for exclusive insights, stories, and research on leadership and innovation.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Newsletter | IndiSight",
    description:
      "Join thousands of executives and investors. Get decision-ready intelligence.",
  },
};

const benefits = [
  {
    title: "Flagship Reports",
    description:
      "Deep-dive analyses on leadership, innovation, and transformation",
  },
  {
    title: "Exclusive Interviews",
    description: "Behind-the-scenes conversations with industry leaders",
  },
  {
    title: "Data Insights",
    description: "Research-backed intelligence for strategic decisions",
  },
  {
    title: "Early Access",
    description: "Be the first to read new stories and reports",
  },
];

const NewsletterPage = () => (
  <>
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden border-border border-b py-24 md:py-32">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:64px_64px] opacity-20" />
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center md:px-12">
          <div className="mb-8 inline-flex items-center gap-2 border border-border bg-muted px-3 py-1 font-medium text-muted-foreground text-xs uppercase tracking-wider">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-foreground opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-foreground" />
            </span>
            Free Newsletter
          </div>
          <h1 className="mb-6 max-w-3xl font-bold text-5xl text-foreground leading-tight tracking-tight md:text-6xl lg:text-7xl">
            Stay Ahead with IndiSight
          </h1>
          <p className="mx-auto mb-12 max-w-2xl text-lg text-muted-foreground leading-relaxed md:text-xl">
            Join thousands of executives, investors, and operators who rely on
            our insights to make confident decisions.
          </p>

          <div className="mx-auto max-w-xl">
            <div className="border border-border bg-muted p-8 md:p-10">
              <Link
                className="inline-flex w-full items-center justify-center gap-2 border border-border bg-foreground px-8 py-4 font-medium text-background transition-colors hover:bg-foreground/90"
                href="https://tally.so/r/w2YgzD"
                rel="noopener noreferrer"
                target="_blank"
              >
                Subscribe Now
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
              <p className="mt-4 text-muted-foreground text-sm">
                Free • No spam • Unsubscribe anytime
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-border border-b bg-background py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6 md:px-12">
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-bold text-3xl text-foreground tracking-tight md:text-4xl">
              What You'll Receive
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Curated content delivered to your inbox every week
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {benefits.map((benefit) => (
              <div
                className="border border-border bg-muted p-8"
                key={benefit.title}
              >
                <h3 className="mb-3 font-bold text-foreground text-xl tracking-tight">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  </>
);

export default NewsletterPage;
