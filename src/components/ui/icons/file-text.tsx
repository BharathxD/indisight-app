"use client";

import { motion, useAnimation } from "motion/react";
import type React from "react";
import type { HTMLAttributes } from "react";
import { useCallback, useImperativeHandle, useRef } from "react";

import { cn } from "@/lib/utils";

export type FileTextIconHandle = {
  startAnimation: () => void;
  stopAnimation: () => void;
};

interface FileTextIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const FileText = ({
  onMouseEnter,
  onMouseLeave,
  className,
  size = 28,
  ref,
  ...props
}: FileTextIconProps & {
  ref?: React.RefObject<FileTextIconHandle | null>;
}) => {
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
      aria-label="File text icon"
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
        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
        <path d="M14 2v4a2 2 0 0 0 2 2h4" />

        <motion.line
          animate={controls}
          variants={{
            normal: {
              pathLength: 1,
              opacity: 1,
            },
            animate: {
              pathLength: [0, 1],
              opacity: [0, 1],
              transition: {
                duration: 0.4,
                delay: 0.1,
              },
            },
          }}
          x1="8"
          x2="10"
          y1="9"
          y2="9"
        />
        <motion.line
          animate={controls}
          variants={{
            normal: {
              pathLength: 1,
              opacity: 1,
            },
            animate: {
              pathLength: [0, 1],
              opacity: [0, 1],
              transition: {
                duration: 0.4,
                delay: 0.2,
              },
            },
          }}
          x1="8"
          x2="16"
          y1="13"
          y2="13"
        />
        <motion.line
          animate={controls}
          variants={{
            normal: {
              pathLength: 1,
              opacity: 1,
            },
            animate: {
              pathLength: [0, 1],
              opacity: [0, 1],
              transition: {
                duration: 0.4,
                delay: 0.3,
              },
            },
          }}
          x1="8"
          x2="16"
          y1="17"
          y2="17"
        />
      </svg>
    </div>
  );
};

FileText.displayName = "FileTextIcon";

export { FileText as FileTextIcon };
