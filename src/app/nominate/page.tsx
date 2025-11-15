import Link from "next/link";
import { PublicLayout } from "@/components/public/public-layout";
import { siteConfig } from "@/lib/config";

export const metadata = {
  title: "Nominate Leaders & Submit Stories | IndiSight - Write for Us",
  description:
    "Know someone whose story deserves to be told? Have insights to share? Help us discover the voices that matter by nominating leaders or submitting story ideas. We feature silent influencers, institution builders, and system thinkers.",
  keywords: [
    "nominate leaders",
    "submit stories",
    "write for us",
    "guest contributors",
    "leadership stories",
    "founder stories",
    "business insights",
    "editorial submissions",
  ],
  openGraph: {
    title: "Nominate Leaders & Submit Stories | IndiSight",
    description:
      "Help us discover the voices that matter. Nominate leaders or submit your story ideas.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nominate Leaders & Submit Stories | IndiSight",
    description:
      "Nominate silent influencers, institution builders, and system thinkers.",
  },
};

const NominatePage = () => (
  <PublicLayout>
    <div className="min-h-screen bg-background">
      <section className="border-border border-b bg-gradient-to-b from-muted/50 to-background py-20">
        <div className="mx-auto max-w-4xl px-6 text-center md:px-12">
          <div className="mb-6 inline-flex items-center gap-2 border border-border bg-muted px-3 py-1 font-medium text-muted-foreground text-xs uppercase tracking-wider">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-foreground opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-foreground" />
            </span>
            Submissions Open
          </div>

          <h1 className="mb-6 font-bold text-5xl text-foreground leading-tight tracking-tight md:text-7xl md:leading-tight">
            Nominate /{" "}
            <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Submit
            </span>
          </h1>

          <p className="mx-auto mb-8 max-w-3xl text-lg text-muted-foreground leading-relaxed">
            Know someone whose story deserves to be told? Have insights to
            share? Help us discover the voices that matter.
          </p>

          <div className="mx-auto max-w-2xl border border-border bg-muted p-6">
            <p className="mb-2 text-foreground text-lg">
              <span className="font-semibold">Write to us at:</span>{" "}
              <Link
                className="font-medium text-foreground underline decoration-muted-foreground underline-offset-4 transition-colors hover:decoration-foreground"
                href={`mailto:${siteConfig.contact.email}`}
              >
                {siteConfig.contact.email}
              </Link>
            </p>
            <p className="text-muted-foreground text-sm">
              Subject: Leader Nomination / Story Submission
            </p>
          </div>
        </div>
      </section>

      <section className="border-border border-b bg-background py-16 md:py-20">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <div className="grid gap-12 md:grid-cols-2">
            <div className="border border-border bg-muted p-8">
              <h2 className="mb-6 font-bold text-2xl text-foreground tracking-tight">
                Nominate a Voice
              </h2>
              <p className="mb-6 text-muted-foreground leading-relaxed">
                Recommend individuals whose work, insights, or impact deserve
                wider recognition. We're particularly interested in:
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="mt-[0.5rem] size-1.5 shrink-0 rounded-full bg-foreground" />
                  <span>Silent influencers working behind the scenes</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-[0.5rem] size-1.5 shrink-0 rounded-full bg-foreground" />
                  <span>Institution builders and system thinkers</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-[0.5rem] size-1.5 shrink-0 rounded-full bg-foreground" />
                  <span>Founders navigating complex challenges</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-[0.5rem] size-1.5 shrink-0 rounded-full bg-foreground" />
                  <span>
                    Policy practitioners bridging theory and implementation
                  </span>
                </li>
              </ul>
            </div>

            <div className="border border-border bg-muted p-8">
              <h2 className="mb-6 font-bold text-2xl text-foreground tracking-tight">
                Submit Your Story
              </h2>
              <p className="mb-6 text-muted-foreground leading-relaxed">
                Share your own experiences, frameworks, or reflections. We
                welcome contributions that offer:
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="mt-[0.5rem] size-1.5 shrink-0 rounded-full bg-foreground" />
                  <span>Practical wisdom from real-world experience</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-[0.5rem] size-1.5 shrink-0 rounded-full bg-foreground" />
                  <span>Unique perspectives on systemic challenges</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-[0.5rem] size-1.5 shrink-0 rounded-full bg-foreground" />
                  <span>Letters of guidance to the next generation</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-[0.5rem] size-1.5 shrink-0 rounded-full bg-foreground" />
                  <span>Decision-making frameworks and learnings</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="border-border border-b bg-muted py-16 md:py-20">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-bold text-3xl text-foreground tracking-tight md:text-4xl">
              Our Editorial Process
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              How we review, curate, and craft stories that matter
            </p>
          </div>

          <div className="mb-12 grid gap-8 md:grid-cols-3">
            <div className="border border-border bg-background p-8">
              <div className="mb-4 flex size-12 items-center justify-center border border-border bg-muted font-bold text-foreground text-xl">
                1
              </div>
              <h3 className="mb-3 font-semibold text-foreground text-lg">
                Review & Research
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Our editorial team carefully reviews each nomination and
                conducts thorough research to understand the nominee's impact
                and story.
              </p>
            </div>

            <div className="border border-border bg-background p-8">
              <div className="mb-4 flex size-12 items-center justify-center border border-border bg-muted font-bold text-foreground text-xl">
                2
              </div>
              <h3 className="mb-3 font-semibold text-foreground text-lg">
                Editorial Curation
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                We curate profiles that align with our mission of highlighting
                quiet architects and systems builders who create lasting change.
              </p>
            </div>

            <div className="border border-border bg-background p-8">
              <div className="mb-4 flex size-12 items-center justify-center border border-border bg-muted font-bold text-foreground text-xl">
                3
              </div>
              <h3 className="mb-3 font-semibold text-foreground text-lg">
                In-Depth Storytelling
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Selected stories are crafted into comprehensive profiles that
                capture not just achievements, but the thinking and principles
                behind them.
              </p>
            </div>
          </div>

          <div className="border border-border bg-background p-8 md:p-12">
            <h3 className="mb-6 font-bold text-2xl text-foreground tracking-tight">
              What We Look For
            </h3>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <h4 className="mb-2 font-semibold text-foreground">
                    Systems Thinking
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    Leaders who build frameworks and institutions
                  </p>
                </div>
                <div>
                  <h4 className="mb-2 font-semibold text-foreground">
                    Quiet Impact
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    Those who influence without seeking the spotlight
                  </p>
                </div>
                <div>
                  <h4 className="mb-2 font-semibold text-foreground">
                    Practical Wisdom
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    Real-world experience with actionable insights
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="mb-2 font-semibold text-foreground">
                    Long-term Vision
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    Builders focused on sustainable change
                  </p>
                </div>
                <div>
                  <h4 className="mb-2 font-semibold text-foreground">
                    Authentic Leadership
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    Values-driven decision making
                  </p>
                </div>
                <div>
                  <h4 className="mb-2 font-semibold text-foreground">
                    Teachable Moments
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    Stories that offer learning for others
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-6 text-center md:px-12">
          <p className="mb-8 text-muted-foreground leading-relaxed">
            We typically respond to submissions within 2-3 weeks. While we
            cannot feature every nomination, each one helps us better understand
            the landscape of leadership in India.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              className="inline-flex items-center gap-2 border border-border bg-foreground px-6 py-3 font-medium text-background transition-colors hover:bg-foreground/90"
              href={`mailto:${siteConfig.contact.email}?subject=Leader%20Nomination%20/%20Story%20Submission`}
            >
              Start Your Submission
              <svg
                aria-hidden="true"
                className="size-4"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              className="inline-flex items-center gap-2 border border-border bg-muted px-6 py-3 font-medium text-foreground transition-colors hover:border-foreground"
              href="https://tally.so/r/w2YgzD"
              rel="noopener noreferrer"
              target="_blank"
            >
              Subscribe to Newsletter
            </Link>
          </div>
        </div>
      </section>
    </div>
  </PublicLayout>
);

export default NominatePage;
