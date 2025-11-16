"use client";

import Link from "next/link";
import { siteConfig } from "@/lib/config";

const exploreLinks = [
  { label: "All Articles", href: "/" },
  { label: "Editorial Archive", href: "/articles" },
  { label: "Research Hub", href: "/research" },
  { label: "Attribution & Embeds", href: "/attribution" },
  { label: "Why we do what we do", href: "/why" },
  { label: "RSS Feed", href: "/feed.xml" },
  { label: "Press Kit", href: "/press" },
];

const connectLinks = [
  { label: "About IndiSight", href: "/contact#our-mission" },
  { label: "Write for Us", href: "/nominate" },
  { label: "Contact", href: "/contact" },
  { label: "Newsletter", href: "/newsletter" },
];

const legalLinks = [
  { label: "Curated Conversations", href: "/conversations" },
  { label: "Terms of Service", href: "/terms" },
];

export const Footer = () => (
  <footer className="border-border border-t bg-background">
    <div className="mx-auto max-w-[1400px] px-6 py-10 md:px-12 md:py-12">
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <h3 className="mb-3 font-medium text-foreground text-lg uppercase tracking-wider">
            {siteConfig.name}
          </h3>
          <p className="max-w-sm text-muted-foreground text-sm leading-relaxed">
            {siteConfig.name} captures the minds shaping meaningful change. We
            document people, institutions, and ideas through the lens of intent,
            resilience, and quiet conviction. Not for headlines — but for those
            who care how things are truly built.
          </p>
        </div>

        <div>
          <h4 className="mb-3 font-medium text-foreground text-sm uppercase tracking-wide">
            Explore
          </h4>
          <ul className="space-y-2">
            {exploreLinks.map((link) => (
              <li key={link.href}>
                <Link
                  className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                  href={link.href}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-3 font-medium text-foreground text-sm uppercase tracking-wide">
            Connect
          </h4>
          <ul className="space-y-2">
            {connectLinks.map((link) => (
              <li key={link.href}>
                <Link
                  className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                  href={link.href}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-3 font-medium text-foreground text-sm uppercase tracking-wide">
            Legal
          </h4>
          <ul className="space-y-2">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link
                  className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                  href={link.href}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-10 border-border border-t pt-6">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <Link
              aria-label="LinkedIn"
              className="text-muted-foreground transition-colors hover:text-foreground"
              href={siteConfig.links.linkedin}
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
            </Link>
            <Link
              aria-label="X (Twitter)"
              className="text-muted-foreground transition-colors hover:text-foreground"
              href={siteConfig.links.twitter}
              rel="noopener noreferrer"
              target="_blank"
            >
              <svg
                aria-hidden="true"
                className="size-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </Link>
          </div>

          <div className="flex flex-col gap-1.5 md:items-end">
            <p className="text-muted-foreground text-xs leading-relaxed">
              All content on {siteConfig.name} is protected by intellectual
              property rights. Written permission is required to republish,
              redistribute, or repurpose any content for commercial use.
            </p>
            <p className="text-muted-foreground text-xs">
              © {new Date().getFullYear()} {siteConfig.name}. All rights
              reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  </footer>
);
