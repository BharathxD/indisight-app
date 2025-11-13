"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { StandaloneThemeToggle } from "@/components/ui/standalone-theme-toggle";
import { siteConfig } from "@/lib/config";

type HeaderProps = {
  categories?: Array<{
    name: string;
    slug: string;
  }>;
};

export const Header = ({ categories = [] }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-border border-b bg-background">
      <div className="mx-auto max-w-[1280px] px-6 md:px-12">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link
              className="font-bold text-foreground text-xl tracking-tight transition-colors hover:text-muted-foreground"
              href="/"
            >
              {siteConfig.name}
            </Link>

            <nav className="hidden items-center gap-6 md:flex">
              <Link
                className="font-medium text-muted-foreground text-sm transition-colors hover:text-foreground"
                href="/"
              >
                Home
              </Link>
              <Link
                className="font-medium text-muted-foreground text-sm transition-colors hover:text-foreground"
                href="/articles"
              >
                All Articles
              </Link>
              {categories.slice(0, 5).map((category) => (
                <Link
                  className="font-medium text-muted-foreground text-sm transition-colors hover:text-foreground"
                  href={`/categories/${category.slug}`}
                  key={category.slug}
                >
                  {category.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <StandaloneThemeToggle />

            <button
              aria-label="Toggle menu"
              className="text-foreground md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
            >
              {mobileMenuOpen ? (
                <X className="size-6" />
              ) : (
                <Menu className="size-6" />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="border-border border-t py-4 md:hidden">
            <div className="flex flex-col gap-4">
              <Link
                className="font-medium text-muted-foreground text-sm transition-colors hover:text-foreground"
                href="/"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                className="font-medium text-muted-foreground text-sm transition-colors hover:text-foreground"
                href="/articles"
                onClick={() => setMobileMenuOpen(false)}
              >
                All Articles
              </Link>
              {categories.map((category) => (
                <Link
                  className="font-medium text-muted-foreground text-sm transition-colors hover:text-foreground"
                  href={`/categories/${category.slug}`}
                  key={category.slug}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
              <Link
                className="font-medium text-muted-foreground text-sm transition-colors hover:text-foreground"
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};
