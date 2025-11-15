import Image from "next/image";
import Link from "next/link";
import { PublicLayout } from "@/components/public/public-layout";
import { siteConfig } from "@/lib/config";

export const metadata = {
  title: "Press & Media Kit | IndiSight - Logos, Boilerplate & Media Resources",
  description:
    "Official IndiSight press kit with logos, boilerplate, and media resources for coverage. Download brand assets, access media contact information, and learn about our editorial platform.",
  keywords: [
    "press kit",
    "media kit",
    "brand assets",
    "logos",
    "media resources",
    "press contact",
    "media inquiries",
    "brand guidelines",
  ],
  openGraph: {
    title: "Press & Media Kit | IndiSight",
    description:
      "Official logos, boilerplate, and media resources for coverage. Download brand assets.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Press & Media Kit | IndiSight",
    description:
      "Official press kit with logos, boilerplate, and media resources.",
  },
};

const PressPage = () => (
  <PublicLayout>
    <div className="min-h-screen bg-background">
      <section className="border-border border-b bg-gradient-to-b from-muted/50 to-background py-20">
        <div className="mx-auto max-w-4xl px-6 text-center md:px-12">
          <h1 className="mb-6 font-bold text-5xl text-foreground leading-tight tracking-tight lg:text-6xl">
            Press & Media Kit
          </h1>
          <p className="mx-auto max-w-3xl text-lg text-muted-foreground leading-relaxed">
            Official logos, boilerplate, and media resources for coverage.
          </p>
        </div>
      </section>

      <section className="border-border border-b bg-background py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-6 md:px-12">
          <div className="mb-12">
            <h2 className="mb-6 font-bold text-3xl text-foreground tracking-tight">
              Boilerplate
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              IndiSight is a fact-based editorial platform documenting India's
              leadership, institutions, and economic transformation. We publish
              deeply researched profiles, data-driven reports, and practical
              frameworks for decision-makers across business and policy.
            </p>
          </div>

          <div className="mb-12">
            <h2 className="mb-6 font-bold text-3xl text-foreground tracking-tight">
              Logos
            </h2>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="border border-border bg-background p-8">
                <div className="mb-6 flex items-center justify-center bg-black p-8">
                  <Image
                    alt="IndiSight Logo - Light"
                    className="h-auto w-full max-w-[200px]"
                    height={60}
                    src="/logo/indisight-1.png"
                    width={200}
                  />
                </div>
                <a
                  className="inline-flex items-center gap-2 text-foreground text-sm underline decoration-muted-foreground underline-offset-4 transition-colors hover:decoration-foreground"
                  download
                  href="/logo/indisight-1.png"
                >
                  Download PNG
                </a>
              </div>

              <div className="border border-border bg-background p-8">
                <div className="mb-6 flex items-center justify-center bg-white p-8">
                  <Image
                    alt="IndiSight Logo - Dark"
                    className="h-auto w-full max-w-[200px]"
                    height={60}
                    src="/logo/indisight-2.png"
                    width={200}
                  />
                </div>
                <a
                  className="inline-flex items-center gap-2 text-foreground text-sm underline decoration-muted-foreground underline-offset-4 transition-colors hover:decoration-foreground"
                  download
                  href="/logo/indisight-2.png"
                >
                  Download PNG
                </a>
              </div>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="mb-6 font-bold text-3xl text-foreground tracking-tight">
              Media Contact
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              For interviews, quotes, and data requests:{" "}
              <Link
                className="font-medium text-foreground underline decoration-muted-foreground underline-offset-4 transition-colors hover:decoration-foreground"
                href={`mailto:${siteConfig.contact.email}`}
              >
                {siteConfig.contact.email}
              </Link>
            </p>
          </div>

          <div>
            <h2 className="mb-6 font-bold text-3xl text-foreground tracking-tight">
              Attribution
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Please credit "Source: IndiSight" and link to the original article
              when using our charts or excerpts.{" "}
              <Link
                className="font-medium text-foreground underline decoration-muted-foreground underline-offset-4 transition-colors hover:decoration-foreground"
                href="/attribution"
              >
                See Attribution & Embeds
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  </PublicLayout>
);

export default PressPage;
