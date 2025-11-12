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
    <header className="sticky top-0 z-50 border-gray-200 border-b bg-white">
      <div className="mx-auto max-w-[1280px] px-6 md:px-12">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link
              className="font-bold text-gray-900 text-xl tracking-tight transition-colors hover:text-gray-600"
              href="/"
            >
              {siteConfig.name}
            </Link>

            <nav className="hidden items-center gap-6 md:flex">
              <Link
                className="font-medium text-gray-700 text-sm transition-colors hover:text-gray-900"
                href="/"
              >
                Home
              </Link>
              <Link
                className="font-medium text-gray-700 text-sm transition-colors hover:text-gray-900"
                href="/articles"
              >
                All Articles
              </Link>
              {categories.slice(0, 5).map((category) => (
                <Link
                  className="font-medium text-gray-700 text-sm transition-colors hover:text-gray-900"
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
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
            >
              {mobileMenuOpen ? (
                <X className="size-6 text-gray-900" />
              ) : (
                <Menu className="size-6 text-gray-900" />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="border-gray-200 border-t py-4 md:hidden">
            <div className="flex flex-col gap-4">
              <Link
                className="font-medium text-gray-700 text-sm transition-colors hover:text-gray-900"
                href="/"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                className="font-medium text-gray-700 text-sm transition-colors hover:text-gray-900"
                href="/articles"
                onClick={() => setMobileMenuOpen(false)}
              >
                All Articles
              </Link>
              {categories.map((category) => (
                <Link
                  className="font-medium text-gray-700 text-sm transition-colors hover:text-gray-900"
                  href={`/categories/${category.slug}`}
                  key={category.slug}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
              <Link
                className="font-medium text-gray-700 text-sm transition-colors hover:text-gray-900"
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
