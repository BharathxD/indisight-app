"use client";

import { motion, useInView } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";

type TeamMember = {
  readonly name: string;
  readonly role: string;
  readonly linkedin: string;
  readonly image: string;
  readonly bio: string;
};

type TeamPreviewProps = {
  team: readonly TeamMember[];
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const TeamMemberCard = ({ member }: { member: TeamMember }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="group flex flex-col gap-6 md:flex-row md:items-start"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      variants={item}
    >
      <div className="relative h-[240px] w-full shrink-0 overflow-hidden border border-border bg-muted md:h-[200px] md:w-[200px]">
        <Image
          alt={member.name}
          className="object-cover object-top transition-all duration-500"
          fill
          sizes="(max-width: 768px) 100vw, 200px"
          src={member.image}
          style={{
            filter: isHovered ? "grayscale(0%)" : "grayscale(100%)",
            transform: isHovered ? "scale(1.05)" : "scale(1)",
          }}
        />
      </div>
      <div className="flex flex-1 flex-col">
        <div className="mb-3">
          <h3 className="mb-1 font-bold text-foreground text-xl tracking-tight">
            {member.name}
          </h3>
          <p className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
            {member.role}
          </p>
        </div>
        <p className="mb-4 line-clamp-3 text-muted-foreground text-sm leading-relaxed">
          {member.bio}
        </p>
        <Link
          className="inline-flex items-center gap-2 font-medium text-foreground text-sm transition-colors hover:text-muted-foreground"
          href={member.linkedin}
          rel="noopener noreferrer"
          target="_blank"
        >
          Connect on LinkedIn
          <svg
            aria-hidden="true"
            className="size-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>
    </motion.div>
  );
};

export const TeamPreview = ({ team }: TeamPreviewProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="border-border border-t bg-background py-12 md:py-16">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12">
        <motion.div
          animate={isInView ? "show" : "hidden"}
          initial="hidden"
          ref={ref}
          variants={container}
        >
          <motion.div className="mb-8" variants={item}>
            <h2 className="mb-2 font-bold text-2xl text-foreground tracking-tight md:text-3xl">
              The minds behind IndiSight
            </h2>
            <p className="max-w-2xl text-muted-foreground text-sm leading-relaxed md:text-base">
              Meet the people shaping our editorial vision and bringing stories
              of meaningful change to life.
            </p>
          </motion.div>

          <div className="space-y-8 md:space-y-10">
            {team.map((member) => (
              <TeamMemberCard key={member.name} member={member} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
