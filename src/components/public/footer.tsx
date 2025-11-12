"use client";

import Link from "next/link";
import { useState } from "react";
import { siteConfig } from "@/lib/config";

type FooterProps = {
  categories?: Array<{
    name: string;
    slug: string;
  }>;
};

export const Footer = ({ categories = [] }: FooterProps) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    await new Promise((resolve) => setTimeout(resolve, 1000));

    setMessage("Thanks for subscribing!");
    setEmail("");
    setIsSubmitting(false);

    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <footer className="border-gray-200 border-t bg-white">
      <div className="mx-auto max-w-[1280px] px-6 py-12 md:px-12 md:py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-4 font-bold text-gray-900 text-lg">
              {siteConfig.name}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Insights and stories about leadership, innovation, and business.
            </p>
          </div>

          {categories.length > 0 && (
            <div>
              <h4 className="mb-4 font-semibold text-gray-900 text-sm uppercase tracking-wider">
                Categories
              </h4>
              <ul className="space-y-2">
                {categories.slice(0, 6).map((category) => (
                  <li key={category.slug}>
                    <Link
                      className="text-gray-600 text-sm transition-colors hover:text-gray-900"
                      href={`/categories/${category.slug}`}
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h4 className="mb-4 font-semibold text-gray-900 text-sm uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  className="text-gray-600 text-sm transition-colors hover:text-gray-900"
                  href="/about"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-600 text-sm transition-colors hover:text-gray-900"
                  href="/contact"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-600 text-sm transition-colors hover:text-gray-900"
                  href="/feed.xml"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  RSS Feed
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-600 text-sm transition-colors hover:text-gray-900"
                  href="/admin"
                >
                  Admin
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-gray-900 text-sm uppercase tracking-wider">
              Newsletter
            </h4>
            <p className="mb-4 text-gray-600 text-sm">
              Get the latest articles delivered to your inbox.
            </p>
            <form className="space-y-2" onSubmit={handleSubmit}>
              <input
                className="w-full border border-gray-300 bg-white px-4 py-2 text-gray-900 text-sm placeholder-gray-500 transition-colors focus:border-gray-900 focus:outline-none"
                disabled={isSubmitting}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                type="email"
                value={email}
              />
              <button
                className="w-full bg-gray-900 px-4 py-2 font-medium text-sm text-white transition-colors hover:bg-gray-700 disabled:bg-gray-400"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? "Subscribing..." : "Subscribe"}
              </button>
              {message && <p className="text-green-600 text-sm">{message}</p>}
            </form>
          </div>
        </div>

        <div className="mt-12 border-gray-200 border-t pt-8">
          <p className="text-center text-gray-600 text-sm">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
