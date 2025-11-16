import { CopyButton } from "@/components/ui/copy-button";
import { siteConfig } from "@/lib/config";

export const metadata = {
  title: "Attribution & Embeds | IndiSight - Usage Guidelines & Open Data",
  description:
    "Use our work freely with proper credit. Learn how to attribute IndiSight research, embed our charts, and access open data. Non-commercial reuse allowed with attribution. Commercial licensing available.",
  keywords: [
    "attribution guidelines",
    "embed charts",
    "open data",
    "data licensing",
    "research attribution",
    "commercial use",
    "media licensing",
  ],
  openGraph: {
    title: "Attribution & Embeds | IndiSight",
    description:
      "Use our work freely with proper credit. Learn attribution guidelines and access open data.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Attribution & Embeds | IndiSight",
    description:
      "Non-commercial reuse allowed with attribution. Commercial licensing available.",
  },
};

const AttributionPage = () => (
  <>
    <div className="min-h-screen bg-background">
      <section className="border-border border-b bg-gradient-to-b from-muted/50 to-background py-20">
        <div className="mx-auto max-w-4xl px-6 text-center md:px-12">
          <h1 className="mb-6 font-bold text-5xl text-foreground leading-tight tracking-tight lg:text-6xl">
            Attribution & Embeds
          </h1>
          <p className="mx-auto max-w-3xl text-lg text-muted-foreground leading-relaxed">
            Use our work freely with proper credit. Commercial reuse requires
            written permission.
          </p>
        </div>
      </section>

      <section className="border-border border-b bg-background py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-6 md:px-12">
          <div className="mb-12">
            <h2 className="mb-6 font-bold text-3xl text-foreground tracking-tight">
              How to Attribute
            </h2>
            <p className="mb-6 text-muted-foreground leading-relaxed">
              Include a visible link near the chart/quote:
            </p>
            <div className="relative border border-border bg-muted p-6">
              <div className="absolute top-4 right-4">
                <CopyButton
                  textToCopy={`<a href="https://indisight.com" title="IndiSight research">Source: IndiSight</a>`}
                />
              </div>
              <code className="text-foreground text-sm">
                {`<a href="https://indisight.com" title="IndiSight research">Source: IndiSight</a>`}
              </code>
            </div>
          </div>

          <div>
            <h2 className="mb-6 font-bold text-3xl text-foreground tracking-tight">
              Usage Policy
            </h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="mt-[0.6rem] size-1.5 shrink-0 rounded-full bg-foreground" />
                <span className="text-muted-foreground leading-relaxed">
                  Non-commercial reuse allowed with attribution.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-[0.6rem] size-1.5 shrink-0 rounded-full bg-foreground" />
                <span className="text-muted-foreground leading-relaxed">
                  Do not alter data without stating modifications.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-[0.6rem] size-1.5 shrink-0 rounded-full bg-foreground" />
                <span className="text-muted-foreground leading-relaxed">
                  Link back to the original IndiSight page.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-background py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-6 text-center md:px-12">
          <h2 className="mb-4 font-bold text-2xl text-foreground tracking-tight">
            Need Permission for Commercial Use?
          </h2>
          <p className="mb-8 text-muted-foreground">
            For commercial licensing or custom usage rights, reach out to our
            team.
          </p>
          <a
            className="inline-flex items-center gap-2 border border-border bg-foreground px-6 py-3 font-medium text-background text-sm transition-colors hover:bg-foreground/90"
            href={`mailto:${siteConfig.contact.email}`}
          >
            Contact Us
          </a>
        </div>
      </section>
    </div>
  </>
);

export default AttributionPage;
