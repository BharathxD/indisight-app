"use client";

import Link from "next/link";
import { siteConfig } from "@/lib/config";

const exploreLinks = [
  { label: "All Articles", href: "/" },
  { label: "Research Hub", href: "/categories/research" },
  { label: "Editorial Archive", href: "/articles" },
  { label: "Attribution & Embeds", href: "/attribution" },
  { label: "Why we do what we do", href: "/about" },
  { label: "RSS Feed", href: "/feed.xml" },
  { label: "Press Kit", href: "/press" },
];

const connectLinks = [
  { label: "About IndiSight", href: "/about" },
  { label: "Write for Us", href: "/write" },
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
              href="https://linkedin.com"
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
              aria-label="YouTube"
              className="text-muted-foreground transition-colors hover:text-foreground"
              href="https://youtube.com"
              rel="noopener noreferrer"
              target="_blank"
            >
              <svg
                aria-hidden="true"
                className="size-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
              </svg>
            </Link>
            <Link
              aria-label="Instagram"
              className="text-muted-foreground transition-colors hover:text-foreground"
              href="https://instagram.com"
              rel="noopener noreferrer"
              target="_blank"
            >
              <svg
                aria-hidden="true"
                className="size-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
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
