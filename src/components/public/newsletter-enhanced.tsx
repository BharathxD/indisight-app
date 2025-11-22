"use client";

import { motion, useInView } from "motion/react";
import Link from "next/link";
import { useRef } from "react";

type NewsletterEnhancedProps = {
  subscriberCount?: string;
  signupUrl: string;
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const benefits = [
  "Exclusive interviews with industry leaders",
  "Deep-dive analysis on meaningful change",
  "Early access to new editorial content",
  "Curated insights delivered weekly",
];

export const NewsletterEnhanced = ({
  subscriberCount = "2,000+",
  signupUrl,
}: NewsletterEnhancedProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="border-border bg-background py-16 md:py-16">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12">
        <motion.div
          animate={isInView ? "show" : "hidden"}
          className="relative overflow-hidden border border-border bg-muted"
          initial="hidden"
          ref={ref}
          variants={container}
        >
          <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-size-[64px_64px] opacity-30" />

          <div className="relative grid gap-10 p-8 md:grid-cols-5 md:gap-12 md:p-12 lg:gap-16 lg:p-16">
            <motion.div
              className="flex flex-col justify-center border-border md:col-span-2 md:border-r md:pr-12 lg:pr-16"
              variants={item}
            >
              <div className="mb-6 inline-flex w-fit items-center gap-2 border border-border bg-background px-3 py-1.5 text-muted-foreground text-xs">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-foreground opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-foreground" />
                </span>
                Weekly Newsletter
              </div>
              <div className="mb-3 font-bold text-5xl text-foreground tracking-tight md:text-6xl lg:text-7xl">
                {subscriberCount}
              </div>
              <p className="font-medium text-base text-muted-foreground md:text-lg">
                leaders already subscribed
              </p>
            </motion.div>

            <motion.div
              className="flex flex-col justify-center md:col-span-3"
              variants={item}
            >
              <h2 className="mb-4 font-bold text-3xl text-foreground tracking-tight md:text-4xl">
                Join Our Community
              </h2>
              <p className="mb-8 text-base text-muted-foreground leading-relaxed md:text-lg">
                Get exclusive insights, stories, and research delivered to your
                inbox. Stay connected with the minds shaping meaningful change.
              </p>

              <ul className="mb-10 space-y-4">
                {benefits.map((benefit) => (
                  <li
                    className="flex items-start gap-3 text-foreground text-sm"
                    key={benefit}
                  >
                    <svg
                      aria-hidden="true"
                      className="mt-0.5 size-5 shrink-0 text-foreground"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M5 13l4 4L19 7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {benefit}
                  </li>
                ))}
              </ul>

              <Link
                className="inline-flex w-full items-center justify-center gap-2 border border-foreground bg-foreground px-8 py-4 font-medium text-background transition-all hover:bg-muted-foreground md:w-auto"
                href={signupUrl}
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
                  <path
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
