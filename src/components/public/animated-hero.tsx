"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { siteConfig } from "@/lib/config";

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
  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const badge = {
  hidden: { opacity: 0, scale: 0.8, filter: "blur(4px)" },
  show: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const button = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export const AnimatedHero = () => (
  <motion.div
    animate="show"
    className="mx-auto max-w-4xl text-center"
    initial="hidden"
    variants={container}
  >
    <motion.div variants={badge}>
      <div className="mb-6 inline-flex items-center gap-2 border border-border bg-background px-4 py-2 text-muted-foreground text-sm shadow-sm">
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-muted-foreground/50 opacity-75" />
          <span className="relative inline-flex size-2 rounded-full bg-muted-foreground" />
        </span>
        Editorial Platform for Leaders & Innovators
      </div>
    </motion.div>

    <motion.h1
      className="mb-6 font-bold text-5xl text-foreground leading-tight tracking-tight md:text-7xl md:leading-tight"
      variants={item}
    >
      Capturing the minds shaping{" "}
      <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
        meaningful change
      </span>
    </motion.h1>

    <motion.p
      className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground leading-relaxed md:text-xl"
      variants={item}
    >
      {siteConfig.description}
    </motion.p>

    <motion.div
      className="flex flex-col items-center justify-center gap-4 sm:flex-row"
      variants={container}
    >
      <motion.div variants={button}>
        <Link
          className="inline-flex items-center justify-center border border-foreground bg-foreground px-8 py-3 font-medium text-background text-sm transition-all hover:bg-muted-foreground"
          href="/articles"
        >
          Explore Articles
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
      </motion.div>
      <motion.div variants={button}>
        <Link
          className="inline-flex items-center justify-center border border-border bg-muted px-8 py-3 font-medium text-foreground text-sm transition-all hover:border-foreground hover:bg-background"
          href="/about"
        >
          Learn More
        </Link>
      </motion.div>
    </motion.div>
  </motion.div>
);
