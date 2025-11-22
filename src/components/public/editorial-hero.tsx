"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { siteConfig } from "@/lib/config";

const intelligenceMetrics = [
  { label: "Intelligence", value: "24/7", status: "active", position: "top" },
  { label: "Signals", value: "1.2K+", trend: "up", position: "middle-right" },
  { label: "Global", value: "50+", subtitle: "Cities", position: "bottom" },
  { label: "Trust", value: "99.9%", subtitle: "Accuracy", position: "middle" },
];

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

const metricCardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
} as const;

const GridBackground = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-size-[32px_32px] opacity-20 dark:opacity-10" />
    <div className="absolute inset-0 bg-linear-to-b from-background/0 via-background/50 to-background" />
  </div>
);

const SignalWaves = () => (
  <div
    className="absolute inset-0 overflow-hidden"
    style={{ willChange: "transform" }}
  >
    <svg
      aria-hidden="true"
      className="absolute inset-0 size-full"
      preserveAspectRatio="none"
      style={{ transform: "translate3d(0, 0, 0)" }}
      viewBox="0 0 1000 1000"
    >
      <defs>
        <linearGradient id="wave-gradient-1" x1="0%" x2="100%" y1="0%" y2="0%">
          <stop
            offset="0%"
            stopColor="var(--muted-foreground)"
            stopOpacity="0"
          />
          <stop
            offset="50%"
            stopColor="var(--muted-foreground)"
            stopOpacity="0.12"
          />
          <stop
            offset="100%"
            stopColor="var(--muted-foreground)"
            stopOpacity="0"
          />
        </linearGradient>
        <linearGradient id="wave-gradient-2" x1="0%" x2="100%" y1="0%" y2="0%">
          <stop offset="0%" stopColor="var(--foreground)" stopOpacity="0" />
          <stop offset="50%" stopColor="var(--foreground)" stopOpacity="0.06" />
          <stop offset="100%" stopColor="var(--foreground)" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="wave-gradient-3" x1="0%" x2="100%" y1="0%" y2="0%">
          <stop
            offset="0%"
            stopColor="var(--muted-foreground)"
            stopOpacity="0"
          />
          <stop
            offset="50%"
            stopColor="var(--muted-foreground)"
            stopOpacity="0.09"
          />
          <stop
            offset="100%"
            stopColor="var(--muted-foreground)"
            stopOpacity="0"
          />
        </linearGradient>
      </defs>

      <motion.path
        animate={{
          d: [
            "M0,300 Q250,250 500,300 T1000,300 L1000,1000 L0,1000 Z",
            "M0,300 Q250,350 500,300 T1000,300 L1000,1000 L0,1000 Z",
            "M0,300 Q250,250 500,300 T1000,300 L1000,1000 L0,1000 Z",
          ],
        }}
        fill="url(#wave-gradient-1)"
        style={{ willChange: "d" }}
        transition={{
          duration: 8,
          ease: "easeInOut",
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "loop",
        }}
      />

      <motion.path
        animate={{
          d: [
            "M0,500 Q250,450 500,500 T1000,500 L1000,1000 L0,1000 Z",
            "M0,500 Q250,550 500,500 T1000,500 L1000,1000 L0,1000 Z",
            "M0,500 Q250,450 500,500 T1000,500 L1000,1000 L0,1000 Z",
          ],
        }}
        fill="url(#wave-gradient-2)"
        style={{ willChange: "d" }}
        transition={{
          duration: 10,
          ease: "easeInOut",
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "loop",
          delay: 0.5,
        }}
      />

      <motion.path
        animate={{
          d: [
            "M0,700 Q250,650 500,700 T1000,700 L1000,1000 L0,1000 Z",
            "M0,700 Q250,750 500,700 T1000,700 L1000,1000 L0,1000 Z",
            "M0,700 Q250,650 500,700 T1000,700 L1000,1000 L0,1000 Z",
          ],
        }}
        fill="url(#wave-gradient-3)"
        style={{ willChange: "d" }}
        transition={{
          duration: 12,
          ease: "easeInOut",
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "loop",
          delay: 1,
        }}
      />

      <motion.path
        animate={{
          d: [
            "M0,200 Q125,180 250,200 T500,200 T750,200 T1000,200",
            "M0,200 Q125,220 250,200 T500,200 T750,200 T1000,200",
            "M0,200 Q125,180 250,200 T500,200 T750,200 T1000,200",
          ],
        }}
        fill="none"
        stroke="var(--foreground)"
        strokeOpacity="0.06"
        strokeWidth="2"
        style={{ willChange: "d" }}
        transition={{
          duration: 6,
          ease: "easeInOut",
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "loop",
        }}
      />

      <motion.path
        animate={{
          d: [
            "M0,400 Q125,380 250,400 T500,400 T750,400 T1000,400",
            "M0,400 Q125,420 250,400 T500,400 T750,400 T1000,400",
            "M0,400 Q125,380 250,400 T500,400 T750,400 T1000,400",
          ],
        }}
        fill="none"
        stroke="var(--muted-foreground)"
        strokeOpacity="0.08"
        strokeWidth="1.5"
        style={{ willChange: "d" }}
        transition={{
          duration: 7,
          ease: "easeInOut",
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "loop",
          delay: 0.3,
        }}
      />
    </svg>
  </div>
);

const MetricCard = ({
  metric,
  index,
  isMobile,
}: {
  metric: (typeof intelligenceMetrics)[0];
  index: number;
  isMobile?: boolean;
}) => {
  const desktopPositions = {
    top: "top-[15%] left-[10%]",
    "middle-right": "top-[35%] right-[15%]",
    middle: "top-[50%] left-[15%]",
    bottom: "bottom-[20%] right-[10%]",
  };

  const mobilePositions = {
    top: "top-[8%] left-[5%]",
    "middle-right": "top-[28%] right-[5%]",
    middle: "top-[52%] left-[5%]",
    bottom: "bottom-[10%] right-[5%]",
  };

  const positionClasses = isMobile ? mobilePositions : desktopPositions;

  return (
    <motion.div
      animate="show"
      className={`absolute ${positionClasses[metric.position as keyof typeof positionClasses]} z-10`}
      custom={index}
      initial="hidden"
      style={{ willChange: "transform, opacity" }}
      variants={metricCardVariants}
    >
      <div className="border border-border bg-background/80 px-3 py-2 shadow-lg backdrop-blur-sm lg:px-4 lg:py-3">
        <div className="flex items-center gap-2 lg:gap-3">
          <div className="flex flex-col">
            <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-wider lg:text-[10px]">
              {metric.label}
            </span>
            <div className="flex items-baseline gap-1">
              <span className="font-semibold text-base text-foreground lg:text-lg">
                {metric.value}
              </span>
              {metric.subtitle && (
                <span className="font-mono text-[9px] text-muted-foreground lg:text-[10px]">
                  {metric.subtitle}
                </span>
              )}
            </div>
          </div>
          {metric.status === "active" && (
            <div className="size-1.5 animate-pulse rounded-full bg-green-500 lg:size-2" />
          )}
          {metric.trend === "up" && (
            <svg
              className="size-3 text-green-500 lg:size-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <title>Trending Up</title>
              <path
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const MetricCards = ({ isMobile }: { isMobile?: boolean }) => (
  <>
    {intelligenceMetrics.map((metric, index) => (
      <MetricCard
        index={index}
        isMobile={isMobile}
        key={metric.label}
        metric={metric}
      />
    ))}
  </>
);

const LiveIndicator = () => (
  <motion.div
    animate={{ opacity: 1 }}
    className="absolute top-4 left-4 z-20 lg:top-6 lg:left-6"
    initial={{ opacity: 0 }}
    transition={{ delay: 0.5, duration: 0.5 }}
  >
    <div className="flex items-center gap-2 border border-border bg-background/90 px-3 py-1.5 backdrop-blur-sm">
      <div className="size-2 animate-pulse rounded-full bg-green-500" />
      <span className="font-mono text-muted-foreground text-xs uppercase tracking-wider">
        Live Intelligence
      </span>
    </div>
  </motion.div>
);

const IntelligenceVisualization = ({ isMobile }: { isMobile?: boolean }) => (
  <div className="relative h-full w-full overflow-hidden bg-muted/10">
    <GridBackground />
    <SignalWaves />
    <MetricCards isMobile={isMobile} />
    <LiveIndicator />
  </div>
);

export const EditorialHero = () => (
  <section className="border-border border-b bg-background">
    <div className="mx-auto flex min-h-[calc(100vh-64px)] max-w-[1400px] flex-col border-border border-x lg:flex-row">
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
            <span className="text-muted-foreground italic">minds</span> shaping{" "}
            <br />
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
                aria-hidden="true"
                className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
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

      <div className="relative hidden w-full lg:block lg:w-[40%]">
        <div className="absolute inset-0 h-full w-full">
          <IntelligenceVisualization />
        </div>
      </div>

      <div className="relative block h-[400px] w-full overflow-hidden border-border border-t lg:hidden">
        <IntelligenceVisualization isMobile />
      </div>
    </div>
  </section>
);
