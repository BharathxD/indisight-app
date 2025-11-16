import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of Service for Indisight - Editorial content platform covering leadership, innovation, and business.",
};

const TermsPage = () => (
  <div className="min-h-screen bg-white">
    <div className="mx-auto max-w-3xl px-6 py-16 md:px-12 md:py-24">
      <div className="mb-12">
        <h1 className="mb-4 font-bold text-4xl text-gray-900 md:text-5xl">
          Terms of Service
        </h1>
        <p className="text-gray-600 text-sm">Effective Date: July 16, 2025</p>
      </div>

      <div className="prose prose-gray max-w-none">
        <section className="mb-12">
          <h2 className="mb-4 font-semibold text-2xl text-gray-900">
            1. Acceptance of Terms
          </h2>
          <p className="mb-4 text-gray-700 leading-relaxed">
            By accessing or using Indisight's website, newsletters, or any
            affiliated services ("Services"), you agree to be bound by these
            Terms of Service and our Privacy Policy.
          </p>
          <p className="text-gray-700 leading-relaxed">
            If you do not agree, please do not use our Services.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="mb-4 font-semibold text-2xl text-gray-900">
            2. Use of Content
          </h2>
          <p className="mb-6 text-gray-700 leading-relaxed">
            All content published on Indisight - including articles, interviews,
            graphics, and commentary - is owned by Indisight or its contributors
            and protected under copyright law.
          </p>

          <div className="mb-6">
            <p className="mb-3 font-medium text-gray-900">You may:</p>
            <ul className="ml-6 list-disc space-y-2 text-gray-700">
              <li>
                Share our content via social media with proper attribution
              </li>
              <li>
                Quote excerpts (under 100 words) with a link back to the full
                article
              </li>
            </ul>
          </div>

          <div>
            <p className="mb-3 font-medium text-gray-900">You may not:</p>
            <ul className="ml-6 list-disc space-y-2 text-gray-700">
              <li>Republish full articles without written permission</li>
              <li>Use our content for commercial purposes without licensing</li>
              <li>Use automated bots to scrape or download our site</li>
            </ul>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="mb-4 font-semibold text-2xl text-gray-900">
            3. User Conduct
          </h2>
          <p className="mb-4 text-gray-700 leading-relaxed">
            When engaging with our platform (e.g., via comments or submissions),
            you agree not to:
          </p>
          <ul className="mb-4 ml-6 list-disc space-y-2 text-gray-700">
            <li>Post offensive, defamatory, or unlawful content</li>
            <li>Impersonate another person or entity</li>
            <li>
              Disrupt or compromise the security or integrity of our website
            </li>
          </ul>
          <p className="text-gray-700 leading-relaxed">
            We reserve the right to moderate or remove user-submitted content at
            our discretion.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="mb-4 font-semibold text-2xl text-gray-900">
            4. Disclaimer
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Indisight provides editorial content for informational purposes
            only. We do not offer financial, legal, or investment advice. Any
            reliance on the information provided is at your own risk.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="mb-4 font-semibold text-2xl text-gray-900">
            5. Limitation of Liability
          </h2>
          <p className="mb-4 text-gray-700 leading-relaxed">
            We do our best to ensure accurate and timely content. However,
            Indisight and its team are not liable for:
          </p>
          <ul className="ml-6 list-disc space-y-2 text-gray-700">
            <li>Any errors or omissions in content</li>
            <li>
              Any direct or indirect damages arising from the use of our
              Services
            </li>
            <li>Service interruptions or data loss</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="mb-4 font-semibold text-2xl text-gray-900">
            6. External Links
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Our content may contain links to third-party sites. We are not
            responsible for the privacy practices or content of those websites.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="mb-4 font-semibold text-2xl text-gray-900">
            7. Governing Law
          </h2>
          <p className="text-gray-700 leading-relaxed">
            These Terms are governed by the laws of India. Any disputes will be
            subject to the jurisdiction of the courts in Hyderabad, Telangana.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="mb-4 font-semibold text-2xl text-gray-900">
            8. Contact
          </h2>
          <p className="text-gray-700 leading-relaxed">
            For questions about these Terms, reach out to us at{" "}
            <Link
              className="font-medium text-gray-900 underline transition-colors hover:text-gray-600"
              href="mailto:legal@indisight.in"
            >
              legal@indisight.in
            </Link>
          </p>
        </section>
      </div>

      <div className="mt-16 border-gray-200 border-t pt-8">
        <Link
          className="inline-flex items-center text-gray-600 text-sm transition-colors hover:text-gray-900"
          href="/"
        >
          <svg
            aria-label="Back arrow"
            className="mr-2 h-4 w-4"
            fill="none"
            role="img"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <title>Back arrow</title>
            <path
              d="M19 12H5M12 19l-7-7 7-7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back to Home
        </Link>
      </div>
    </div>
  </div>
);

export default TermsPage;
