import Image from "next/image";
import Link from "next/link";
import { ContactGlobe } from "@/components/contact-globe";
import { siteConfig } from "@/lib/config";

export const metadata = {
  title: "Contact IndiSight | Get in Touch with Our Editorial Team",
  description:
    "Get in touch with IndiSight. Reach out for editorial inquiries, partnerships, story nominations, or general questions. Our team spans 8 cities across 4 countries.",
  keywords: [
    "contact indisight",
    "editorial inquiries",
    "media partnerships",
    "story nominations",
    "leadership platform",
    "business intelligence contact",
  ],
  openGraph: {
    title: "Contact IndiSight | Get in Touch",
    description:
      "Reach out for editorial inquiries, partnerships, or story nominations. Our team spans 8 cities across 4 countries.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact IndiSight | Get in Touch",
    description:
      "Reach out for editorial inquiries, partnerships, or story nominations.",
  },
};

const ContactPage = () => (
  <>
    <script
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data is safe
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: "Contact IndiSight",
          description:
            "Get in touch with IndiSight for editorial inquiries, partnerships, or story nominations.",
          url: `${siteConfig.url}/contact`,
          mainEntity: {
            "@type": "Organization",
            name: siteConfig.name,
            email: siteConfig.contact.email,
            url: siteConfig.url,
            areaServed: [
              "Hyderabad",
              "Bangalore",
              "Mumbai",
              "Delhi",
              "Chennai",
              "Dubai",
              "Singapore",
              "New York",
            ],
          },
        }),
      }}
      type="application/ld+json"
    />
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden border-border border-b bg-background">
        <div className="-z-10 absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-size-[64px_64px] opacity-50" />

        <div className="relative z-10 mx-auto max-w-[1400px] px-6 py-20 md:px-12 md:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 border border-border bg-background px-4 py-2 text-muted-foreground text-sm shadow-sm">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-muted-foreground/50 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-muted-foreground" />
              </span>
              Get in Touch
            </div>

            <h1 className="mb-6 font-bold text-5xl text-foreground leading-tight tracking-tight md:text-7xl md:leading-tight">
              Let's start a{" "}
              <span className="bg-linear-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                conversation
              </span>
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground leading-relaxed md:text-xl">
              Whether you have a story to share, want to collaborate, or simply
              want to connect — we're here to listen.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                className="inline-flex items-center justify-center border border-foreground bg-foreground px-8 py-3 font-medium text-background text-sm transition-all hover:bg-muted-foreground"
                href={`mailto:${siteConfig.contact.email}`}
              >
                Email Us
                <svg
                  aria-hidden="true"
                  className="ml-2 size-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
              <Link
                className="inline-flex items-center justify-center border border-border bg-muted px-8 py-3 font-medium text-foreground text-sm transition-all hover:border-foreground hover:bg-background"
                href="/articles"
              >
                Explore Articles
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-border border-b bg-background py-16 md:py-20">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-bold text-3xl text-foreground tracking-tight md:text-4xl">
              Leadership Team
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Meet the minds behind IndiSight's editorial vision
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {siteConfig.team.map((member, index) => (
              <div
                className={`group border border-border bg-muted p-8 transition-colors hover:border-foreground ${
                  index === siteConfig.team.length - 1 &&
                  siteConfig.team.length % 2 !== 0
                    ? "md:col-span-2"
                    : ""
                }`}
                key={member.name}
              >
                <div className="mb-6 flex items-start gap-6">
                  <div className="relative size-24 shrink-0 overflow-hidden border border-border bg-background">
                    <Image
                      alt={member.name}
                      className="object-cover object-top"
                      fill
                      sizes="96px"
                      src={member.image}
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-center">
                    <h3 className="mb-1 font-bold text-foreground text-xl tracking-tight">
                      {member.name}
                    </h3>
                    <p className="mb-3 font-medium text-muted-foreground text-sm">
                      {member.role}
                    </p>
                    <Link
                      aria-label={`${member.name} on LinkedIn`}
                      className="inline-flex items-center gap-2 text-muted-foreground text-sm transition-colors hover:text-foreground"
                      href={member.linkedin}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <svg
                        aria-hidden="true"
                        className="size-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                      LinkedIn
                    </Link>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-border border-b bg-muted py-16 md:py-20">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <div className="relative mb-8 text-center">
            <span className="-top-100 absolute" id="our-mission" />
            <h2 className="mb-2 font-bold text-3xl text-foreground tracking-tight">
              Our Mission
            </h2>
            <p className="text-muted-foreground text-sm">
              Why we exist and what drives us forward
            </p>
          </div>

          <div className="mx-auto max-w-3xl space-y-6 text-center">
            <p className="text-muted-foreground leading-relaxed">
              IndiSight exists to chronicle the stories that matter—the
              strategic decisions, leadership moments, and cultural shifts that
              define contemporary India. We believe that understanding how
              change happens is essential for those who want to create it.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Through deep-dive narratives, exclusive conversations, and
              analytical frameworks, we bridge the gap between surface-level
              reporting and the strategic intelligence that leaders actually
              need.
            </p>
          </div>
        </div>
      </section>

      <section className="border-border border-b bg-background py-12 md:py-16">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="group border border-border bg-muted p-6 transition-colors hover:border-foreground">
              <h3 className="mb-2 font-semibold text-foreground text-lg tracking-tight">
                Long-form Storytelling
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Deep narratives that go beyond headlines to reveal strategic
                thinking and decision-making processes
              </p>
            </div>
            <div className="group border border-border bg-muted p-6 transition-colors hover:border-foreground">
              <h3 className="mb-2 font-semibold text-foreground text-lg tracking-tight">
                Strategic Intelligence
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Insights that help leaders understand systems, timing, and the
                context behind major decisions
              </p>
            </div>
            <div className="group border border-border bg-muted p-6 transition-colors hover:border-foreground">
              <h3 className="mb-2 font-semibold text-foreground text-lg tracking-tight">
                Exclusive Access
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Behind-the-scenes conversations with India's most influential
                figures and institutions
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-border border-b bg-muted py-16 md:py-20">
        <div className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-12">
          <div className="mb-8 text-center">
            <h2 className="mb-4 font-bold text-3xl text-foreground tracking-tight md:text-4xl">
              Global Presence
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Our team spans across continents, bringing diverse perspectives to
              every story
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <ContactGlobe />

            <div className="space-y-6">
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { city: "Hyderabad", country: "India" },
                  { city: "Bangalore", country: "India" },
                  { city: "Mumbai", country: "India" },
                  { city: "Delhi", country: "India" },
                  { city: "Chennai", country: "India" },
                  { city: "Dubai", country: "UAE" },
                  { city: "Singapore", country: "Singapore" },
                  { city: "New York", country: "USA" },
                ].map((location) => (
                  <div
                    className="border border-border bg-background p-4 transition-colors hover:border-foreground"
                    key={location.city}
                  >
                    <div className="flex items-start gap-3">
                      <span className="mt-1.5 size-2 rounded-full bg-foreground" />
                      <div>
                        <h3 className="font-semibold text-foreground text-sm">
                          {location.city}
                        </h3>
                        <p className="text-muted-foreground text-xs">
                          {location.country}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border border-border bg-background p-6 text-center">
                <p className="text-muted-foreground text-sm">
                  <span className="font-semibold text-foreground">
                    8 cities
                  </span>{" "}
                  •{" "}
                  <span className="font-semibold text-foreground">
                    4 countries
                  </span>{" "}
                  •{" "}
                  <span className="font-semibold text-foreground">
                    3 continents
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-6 md:px-12">
          <div className="border border-border bg-muted p-8 text-center md:p-12">
            <h2 className="mb-4 font-bold text-3xl text-foreground tracking-tight">
              Stay Updated
            </h2>
            <p className="mb-8 text-lg text-muted-foreground leading-relaxed">
              Get the latest insights, stories, and research delivered weekly to
              your inbox. Join our community of leaders and innovators.
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

export default ContactPage;
