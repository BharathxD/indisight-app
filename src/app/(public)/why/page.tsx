import Link from "next/link";
import { siteConfig } from "@/lib/config";

export const metadata = {
  title: "Why We Do What We Do | IndiSight - Our Mission & Purpose",
  description:
    "Our purpose: global business intelligence and leadership insights that help operators and investors make confident decisions. Covering global leadership, economic growth, startups, fintech, and innovation across US, EU, Asia, Africa, and LATAM.",
  keywords: [
    "business intelligence",
    "leadership insights",
    "global research",
    "economic analysis",
    "startup ecosystem",
    "fintech research",
    "innovation reports",
    "investor intelligence",
  ],
  openGraph: {
    title: "Why We Do What We Do | IndiSight",
    description:
      "Global business intelligence and leadership insights for operators and investors.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Why We Do What We Do | IndiSight",
    description:
      "Decision-ready analysis across markets—US, EU, Asia, Africa, and LATAM.",
  },
};

const sections = [
  {
    id: "global-leadership",
    title: "Global Leadership",
    subtitle: "Signals that matter now",
    content:
      "Leadership advantage in 2025 hinges on speed-to-insight, operating discipline, and cross-border pattern recognition. Executives who align capital allocation to verified demand, simplify product portfolios, and codify decision rights outperform peers by 200–400 bps of ROIC in mixed markets.",
    caseStudy:
      "US enterprise AI adoption is consolidating around measurable productivity gains; EU leaders navigate evolving regulation while scaling green industrial policy; Asia's supply-chain reconfiguration rewards firms that dual-source critical components.",
    link: { text: "Explore Thought Leadership", href: "/articles" },
  },
  {
    id: "worldwide-growth",
    title: "Worldwide Economic Growth 2025",
    subtitle: "Where momentum is durable",
    content:
      "We track consumption resilience, private capex pipelines, export baskets, and credit transmission to identify durable growth corridors. The US pivots from rate sensitivity to productivity-led expansion, the EU balances re-shoring with competitiveness.",
    caseStudy:
      "Portfolio leaders should stage market entry, prioritize unit economics over absolute GMV, and hedge commodity exposure via contracts rather than balance-sheet bets.",
    link: { text: "Download Global Report", href: "/articles" },
  },
  {
    id: "emerging-startups",
    title: "Emerging Market Startup Ecosystems",
    subtitle: "Playbooks from on-the-ground operators",
    content:
      "Founders in India, Southeast Asia, Africa, and LATAM are optimizing for capital efficiency, repeatable GTM motion, and disciplined hiring. The playbooks emphasize serviceable obtainable market clarity, customer payback within 12–18 months.",
    caseStudy:
      "Investors are recalibrating towards durable revenue quality and measured burn. We map sector readiness—from fintech rails to B2B SaaS and climate tech—and surface founder–market fit signals that travel across borders.",
    link: { text: "Read Startup Stories", href: "/articles" },
  },
  {
    id: "cross-border-innovation",
    title: "Cross-Border Innovation & Technology",
    subtitle: "Build, buy, or partner",
    content:
      "From AI copilots to semiconductor supply chains and logistics software, leaders must choose where to differentiate and where to leverage ecosystems. Our briefs outline capability roadmaps, vendor lock-in risks, and data governance patterns.",
    caseStudy:
      "Interoperability—across identity, payments, health, and trade—drives scale benefits. Standards emerging in the EU and fast-growing frameworks in Asia are shaping procurement and compliance.",
    link: { text: "Explore Technology Insights", href: "/articles" },
  },
  {
    id: "fintech-payments",
    title: "Fintech & Digital Payments",
    subtitle: "Rails, wallets, and regulation",
    content:
      "Digital public infrastructure, bank–fintech collaboration, and merchant acceptance are reshaping payments. Lessons from UPI-scale systems inform adoption in Africa and LATAM, while PSD2/PSD3 in the EU and FedNow in the US update the rules.",
    caseStudy:
      "Profit pools consolidate around data-driven risk, embedded finance, and merchant services. We quantify unit economics, corridor-by-corridor, and show where bundling creates defensibility.",
    link: { text: "Read Fintech Analysis", href: "/articles" },
  },
  {
    id: "unicorn-trends",
    title: "Global Unicorn Trends",
    subtitle: "Efficiency over excess",
    content:
      "The next cohort of global unicorns is defined by efficient growth, disciplined governance, and credible paths to cash generation. Valuations are rewarding contribution margin, low churn, and pricing power.",
    caseStudy:
      "Second-order effects—supply-chain localization, climate-linked capex, and AI-enabled productivity—are reshaping category boundaries. We track crossover capital rotations and late-stage round structures.",
    link: { text: "Subscribe for Updates", href: "/contact" },
  },
];

const WhyPage = () => (
  <>
    <script
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data is safe
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "Why We Do What We Do",
          description:
            "Our purpose: global business intelligence and leadership insights that help operators and investors make confident decisions.",
          url: `${siteConfig.url}/why`,
          mainEntity: {
            "@type": "Organization",
            name: siteConfig.name,
            url: siteConfig.url,
            description: siteConfig.description,
          },
        }),
      }}
      type="application/ld+json"
    />
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden border-border border-b bg-linear-to-b from-muted/50 to-background py-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-size-[64px_64px] opacity-20" />
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center md:px-12">
          <div className="mb-6 inline-flex items-center gap-2 border border-border bg-muted px-3 py-1 font-medium text-muted-foreground text-xs uppercase tracking-wider">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-foreground opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-foreground" />
            </span>
            Our Mission
          </div>
          <h1 className="mb-6 font-bold text-5xl text-foreground leading-tight tracking-tight lg:text-6xl">
            Why We Do{" "}
            <span className="bg-linear-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              What We Do
            </span>
          </h1>
          <p className="mx-auto max-w-3xl text-lg text-muted-foreground leading-relaxed">
            Our global business intelligence synthesizes macro trends, sector
            dynamics, and cultural context into practical leadership insights.
            In one place, executives get decision-ready analysis across
            markets—US, EU, Asia, Africa, and LATAM.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              className="inline-flex items-center justify-center gap-2 border border-border bg-foreground px-6 py-3 font-medium text-background text-sm transition-colors hover:bg-foreground/90"
              href="/contact"
            >
              Subscribe Now
              <svg
                aria-hidden="true"
                className="size-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              className="inline-flex items-center justify-center gap-2 border border-border bg-background px-6 py-3 font-medium text-foreground text-sm transition-colors hover:border-foreground"
              href="/articles"
            >
              Explore Research
            </Link>
          </div>
        </div>
      </section>

      <section className="border-border border-b bg-background py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6 md:px-12">
          <div className="space-y-20">
            {sections.map((section, index) => (
              <div
                className="grid gap-8 lg:grid-cols-12 lg:gap-12"
                key={section.id}
              >
                <div
                  className={`lg:col-span-5 ${index % 2 === 1 ? "lg:order-2" : ""}`}
                >
                  <div className="sticky top-24">
                    <div className="mb-4 inline-flex items-center gap-2 border border-border bg-muted px-3 py-1 font-medium text-muted-foreground text-xs uppercase tracking-wider">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <h2 className="mb-4 font-bold text-3xl text-foreground tracking-tight">
                      {section.title}
                    </h2>
                    <h3 className="mb-4 font-semibold text-foreground/80 text-lg">
                      {section.subtitle}
                    </h3>
                    <Link
                      className="group inline-flex items-center gap-2 border border-border bg-background px-4 py-2 font-medium text-foreground text-sm transition-colors hover:border-foreground"
                      href={section.link.href}
                    >
                      {section.link.text}
                      <svg
                        aria-hidden="true"
                        className="size-4 transition-transform group-hover:translate-x-1"
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

                <div
                  className={`lg:col-span-7 ${index % 2 === 1 ? "lg:order-1" : ""}`}
                >
                  <div className="space-y-6">
                    <div className="border border-border bg-muted p-6">
                      <p className="text-foreground leading-relaxed">
                        {section.content}
                      </p>
                    </div>
                    <div className="border-foreground border-l-2 bg-muted/50 p-6">
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {section.caseStudy}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-border border-b bg-muted py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-6 md:px-12">
          <h2 className="mb-8 text-center font-bold text-3xl text-foreground tracking-tight md:text-4xl">
            About Our Research
          </h2>
          <div className="space-y-6">
            <div className="border border-border bg-background p-6">
              <p className="text-foreground leading-relaxed">
                Our methodology blends quantitative macro and sector data with
                qualitative operator interviews to produce global,
                decision-grade insights. We source time-series from central
                banks, multilaterals, exchanges, and company filings; enrich
                them with alternative data—shipping, mobility, and marketplace
                signals; and validate through expert panels across the US, EU,
                Asia, Africa, and LATAM.
              </p>
            </div>
            <div className="border border-border bg-background p-6">
              <p className="text-foreground leading-relaxed">
                Authors bring multi-region operating and investing experience,
                combining product, policy, and P&L lenses. We adhere to E‑E‑A‑T
                principles: demonstrated experience, rigorous expertise,
                transparent sourcing, and a track record of trustworthy
                publication. Every chart links back to methods in the Research
                Hub, while narrative synthesis appears in IndiSight Originals.
              </p>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              className="inline-flex items-center justify-center gap-2 border border-border bg-foreground px-6 py-3 font-medium text-background text-sm transition-colors hover:bg-foreground/90"
              href="/contact"
            >
              Subscribe Now
            </Link>
            <Link
              className="inline-flex items-center justify-center gap-2 border border-border bg-background px-6 py-3 font-medium text-foreground text-sm transition-colors hover:border-foreground"
              href="/articles"
            >
              Download Global Report
            </Link>
            <Link
              className="inline-flex items-center justify-center gap-2 border border-border bg-background px-6 py-3 font-medium text-foreground text-sm transition-colors hover:border-foreground"
              href="/press"
            >
              Request Investor Briefing
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-background py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-6 text-center md:px-12">
          <div className="border border-border bg-muted p-8 md:p-12">
            <h2 className="mb-4 font-bold text-3xl text-foreground tracking-tight">
              Ready to get started?
            </h2>
            <p className="mb-8 text-lg text-muted-foreground leading-relaxed">
              Join thousands of executives and investors who rely on IndiSight
              for decision-ready intelligence.
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

export default WhyPage;
