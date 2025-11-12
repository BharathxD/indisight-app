"use client";

import type { Variants } from "motion/react";
import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes, RefObject } from "react";
import { useCallback, useImperativeHandle, useRef } from "react";

import { cn } from "@/lib/utils";

export type HashIconHandle = {
  startAnimation: () => void;
  stopAnimation: () => void;
};

interface HashIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const lineVariants: Variants = {
  normal: {
    pathLength: 1,
    opacity: 1,
  },
  animate: (custom: number) => ({
    pathLength: [0, 1],
    opacity: [0, 1],
    transition: {
      duration: 0.4,
      delay: custom * 0.1,
      ease: "easeInOut",
    },
  }),
};

const HashIcon = ({
  onMouseEnter,
  onMouseLeave,
  className,
  size = 28,
  ref,
  ...props
}: HashIconProps & { ref?: RefObject<HashIconHandle | null> }) => {
  const controls = useAnimation();
  const isControlledRef = useRef(false);

  useImperativeHandle(ref, () => {
    isControlledRef.current = true;

    return {
      startAnimation: () => controls.start("animate"),
      stopAnimation: () => controls.start("normal"),
    };
  });

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isControlledRef.current) {
        onMouseEnter?.(e);
      } else {
        controls.start("animate");
      }
    },
    [controls, onMouseEnter]
  );

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isControlledRef.current) {
        onMouseLeave?.(e);
      } else {
        controls.start("normal");
      }
    },
    [controls, onMouseLeave]
  );

  return (
    <div
      aria-label="Hash icon"
      className={cn(className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="img"
      {...props}
    >
      <svg
        aria-hidden="true"
        fill="none"
        height={size}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width={size}
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.line
          animate={controls}
          custom={0}
          variants={lineVariants}
          x1="4"
          x2="20"
          y1="9"
          y2="9"
        />
        <motion.line
          animate={controls}
          custom={1}
          variants={lineVariants}
          x1="4"
          x2="20"
          y1="15"
          y2="15"
        />
        <motion.line
          animate={controls}
          custom={2}
          variants={lineVariants}
          x1="10"
          x2="8"
          y1="3"
          y2="21"
        />
        <motion.line
          animate={controls}
          custom={3}
          variants={lineVariants}
          x1="16"
          x2="14"
          y1="3"
          y2="21"
        />
      </svg>
    </div>
  );
};

HashIcon.displayName = "HashIcon";

export { HashIcon };
