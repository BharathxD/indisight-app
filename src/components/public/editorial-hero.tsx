"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { siteConfig } from "@/lib/config";

// --- Data ---

type Portrait = {
  id: number;
  src: string;
  height: number;
  name?: string;
  role?: string;
};

const portraits: Portrait[] = [
  {
    id: 1,
    src: "/people/1.png",
    height: 280,
    name: "Aditi Rao",
    role: "Founder, BlueSky",
  },
  {
    id: 2,
    src: "/people/2.png",
    height: 320,
    name: "Rajesh Kumar",
    role: "CEO, TechFlow",
  },
  {
    id: 3,
    src: "/people/3.png",
    height: 240,
    name: "Sarah Chen",
    role: "Architect",
  },
  {
    id: 4,
    src: "/people/4.png",
    height: 300,
    name: "Michael Ross",
    role: "Director",
  },
  {
    id: 5,
    src: "/people/5.png",
    height: 260,
    name: "Priya Patel",
    role: "Innovator",
  },
  {
    id: 6,
    src: "/people/6.png",
    height: 290,
    name: "David Kim",
    role: "Designer",
  },
];

// --- Animation Variants ---

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
} as const;

// --- Components ---

const MonitorCard = ({ portrait }: { portrait: Portrait }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="group relative aspect-3/4 w-full overflow-hidden bg-muted">
      <Image
        alt={portrait.name || "Portrait"}
        className={`size-full object-cover transition-all duration-700 ${
          isLoaded ? "scale-100 blur-0" : "scale-105 blur-lg"
        } group-hover:scale-105`}
        fill
        onLoad={() => setIsLoaded(true)}
        sizes="(max-width: 768px) 50vw, 33vw"
        src={portrait.src}
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="absolute bottom-0 left-0 w-full translate-y-2 p-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        <p className="font-medium text-white text-xs">{portrait.name}</p>
        <p className="text-[10px] text-white/70 uppercase tracking-wider">
          {portrait.role}
        </p>
      </div>
    </div>
  );
};

const HeroMonitor = () => {
  // Split portraits into columns for the monitor view
  const col1 = [portraits[0], portraits[3], portraits[5]];
  const col2 = [portraits[1], portraits[4], portraits[2]];

  return (
    <div className="relative h-full w-full overflow-hidden bg-muted/10 p-4 lg:p-6">
      <div className="mb-4 flex items-center justify-between border-border border-b pb-2">
        <div className="flex items-center gap-2">
          <div className="size-2 animate-pulse rounded-full bg-green-500" />
          <span className="font-mono text-muted-foreground text-xs uppercase tracking-wider">
            Live Monitor
          </span>
        </div>
        <span className="font-mono text-muted-foreground text-xs">
          EST. 2025
        </span>
      </div>

      <div className="grid h-full grid-cols-2 gap-4 overflow-hidden pb-12">
        <div className="hover:paused flex animate-scroll-up flex-col gap-4">
          {[...col1, ...col1].map((p, i) => (
            <MonitorCard key={`${p.id}-col1-${i}`} portrait={p} />
          ))}
        </div>
        <div
          className="hover:paused flex animate-scroll-up flex-col gap-4"
          style={{ animationDuration: "45s", animationDelay: "-5s" }}
        >
          {[...col2, ...col2].map((p, i) => (
            <MonitorCard key={`${p.id}-col2-${i}`} portrait={p} />
          ))}
        </div>
      </div>

      {/* Gradient overlays to mask scroll edges */}
      <div className="pointer-events-none absolute top-14 left-0 z-10 h-16 w-full bg-linear-to-b from-background to-transparent" />
      <div className="pointer-events-none absolute bottom-0 left-0 z-10 h-32 w-full bg-linear-to-t from-background to-transparent" />
    </div>
  );
};

export const EditorialHero = () => {
  return (
    <section className="border-border border-b bg-background">
      <div className="mx-auto flex min-h-[calc(100vh-64px)] max-w-[1400px] flex-col border-border border-x lg:flex-row">
        {/* Primary Column (Left) */}
        <div className="flex flex-col justify-center border-border border-r-0 p-6 lg:w-[60%] lg:border-r lg:p-12 xl:p-16">
          <motion.div
            animate="show"
            className="space-y-6"
            initial="hidden"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <div className="inline-flex items-center gap-2 border border-border bg-muted/30 px-3 py-1 font-medium text-muted-foreground text-xs uppercase tracking-wider">
                <span className="h-px w-4 bg-foreground/50" />
                The New Standard
              </div>
            </motion.div>

            <motion.h1
              className="font-medium font-serif text-5xl text-foreground leading-[1.1] tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl"
              variants={itemVariants}
            >
              Capturing the <br />
              <span className="text-muted-foreground italic">minds</span>{" "}
              shaping <br />
              change.
            </motion.h1>

            <motion.p
              className="max-w-lg text-lg text-muted-foreground leading-relaxed md:text-xl"
              variants={itemVariants}
            >
              {siteConfig.description}
            </motion.p>
          </motion.div>

          <motion.div
            animate="show"
            className="mt-6 flex flex-wrap items-center gap-4"
            initial="hidden"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <Link
                className="group inline-flex h-11.5 items-center justify-center gap-2 border border-foreground bg-foreground px-8 font-medium text-background text-sm transition-all hover:bg-background hover:text-foreground"
                href="/articles"
              >
                Explore Articles
                <svg
                  className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <title>Arrow Right</title>
                  <path
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </Link>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Link
                className="inline-flex h-12 items-center justify-center border px-8 font-medium text-muted-foreground text-sm transition-colors hover:text-foreground"
                href="/why"
              >
                Our Manifesto
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Secondary Column (Right) - The "Monitor" */}
        <div className="relative hidden w-full lg:block lg:w-[40%]">
          <div className="absolute inset-0 h-full w-full">
            <HeroMonitor />
            {/* Grid Overlay Lines */}
            <div className="absolute top-0 left-1/2 h-full w-px bg-border/50" />
          </div>
        </div>

        {/* Mobile Monitor Fallback (Simplified) */}
        <div className="relative block h-[300px] w-full overflow-hidden border-border border-t lg:hidden">
          <HeroMonitor />
        </div>
      </div>
    </section>
  );
};
