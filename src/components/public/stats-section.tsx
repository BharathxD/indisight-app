"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";

type StatItem = {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
};

type StatsSectionProps = {
  stats: StatItem[];
};

const StatItem = ({ stat, index }: { stat: StatItem; index: number }) => (
  <motion.div
    animate={{ opacity: 1, y: 0 }}
    className="group relative flex flex-col items-center justify-center px-6 py-10 transition-colors hover:bg-muted/50"
    initial={{ opacity: 0, y: 12 }}
    transition={{
      duration: 0.4,
      delay: index * 0.1,
      ease: [0.21, 0.47, 0.32, 0.98],
    }}
  >
    <div className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-size-[16px_16px] opacity-20" />
    </div>
    <motion.div
      animate={{ opacity: 1, scale: 1 }}
      className="relative mb-3 font-bold text-5xl text-foreground tracking-tight transition-transform group-hover:scale-105 md:text-6xl"
      initial={{ opacity: 0, scale: 0.9 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1 + 0.1,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
    >
      {stat.prefix}
      {stat.value.toLocaleString()}
      {stat.suffix}
    </motion.div>
    <motion.div
      animate={{ opacity: 1 }}
      className="relative font-medium text-muted-foreground text-xs uppercase tracking-widest"
      initial={{ opacity: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.1 + 0.2,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
    >
      {stat.label}
    </motion.div>
  </motion.div>
);

export const StatsSection = ({ stats }: StatsSectionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div className="relative overflow-hidden py-16 md:py-20" ref={ref}>
      <motion.div
        animate={{ opacity: isInView ? 0.4 : 0 }}
        className="-z-10 absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-size-[64px_64px]"
        initial={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
      />

      {/* Removed inner max-w container and px since parent handles it */}
      <motion.div
        animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
        className="overflow-hidden border-border border-y bg-background"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
      >
        <div className="grid grid-cols-2 divide-x divide-y divide-border lg:grid-cols-4 lg:divide-y-0">
          {isInView &&
            stats.map((stat, index) => (
              <StatItem index={index} key={stat.label} stat={stat} />
            ))}
        </div>
      </motion.div>
    </div>
  );
};
