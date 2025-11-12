"use client";

import { ArrowLeft, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { animationVariants } from "@/lib/animation-variants";
import { cn } from "@/lib/utils";

type StickyActionBarProps = {
  onBack: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
  isPending?: boolean;
  className?: string;
};

export const StickyActionBar = ({
  onBack,
  onSaveDraft,
  onPublish,
  isPending = false,
  className,
}: StickyActionBarProps) => (
  <motion.div
    animate={{ y: 0 }}
    className={cn(
      "sticky right-0 bottom-0 left-0 z-100 border-t bg-background/80 shadow-lg backdrop-blur-sm",
      className
    )}
    initial={{ y: "100%" }}
    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
  >
    <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4 sm:px-8">
      <motion.div
        animate={{ opacity: 1, x: 0 }}
        initial={{ opacity: 0, x: -4 }}
        transition={{ duration: 0.25, delay: 0.1 }}
      >
        <Button onClick={onBack} size="sm" type="button" variant="ghost">
          <ArrowLeft className="size-4" />
          Back
        </Button>
      </motion.div>

      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
        initial={{ opacity: 0, y: 4 }}
        transition={{ duration: 0.25, delay: 0.15 }}
      >
        <motion.div
          animate="initial"
          variants={animationVariants.button}
          whileHover="hover"
          whileTap="tap"
        >
          <Button
            disabled={isPending}
            onClick={onSaveDraft}
            size="sm"
            type="button"
            variant="outline"
          >
            Save Draft
          </Button>
        </motion.div>

        <motion.div
          animate="initial"
          variants={animationVariants.publishButton}
          whileHover="hover"
          whileTap="tap"
        >
          <Button
            disabled={isPending}
            onClick={onPublish}
            size="sm"
            type="button"
          >
            {isPending && <Loader2 className="size-4 animate-spin" />}
            Publish
          </Button>
        </motion.div>
      </motion.div>
    </div>
  </motion.div>
);
