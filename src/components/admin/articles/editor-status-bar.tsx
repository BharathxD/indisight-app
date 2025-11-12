"use client";

import type { Editor } from "@tiptap/react";
import { Check, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { animationVariants } from "@/lib/animation-variants";
import {
  calculateReadingTime,
  formatReadingTime,
  formatTimeAgo,
  formatWordCount,
  getWordCount,
} from "@/lib/editor-utils";
import { cn } from "@/lib/utils";

type EditorStatusBarProps = {
  editor: Editor | null;
  lastSaved?: Date | null;
  isSaving?: boolean;
  className?: string;
};

export const EditorStatusBar = ({
  editor,
  lastSaved,
  isSaving = false,
  className,
}: EditorStatusBarProps) => {
  const [wordCount, setWordCount] = useState(0);
  const [showReadingTime, setShowReadingTime] = useState(false);

  useEffect(() => {
    if (!editor) return;

    const updateWordCount = () => {
      const count = getWordCount(editor);
      setWordCount(count);
      setShowReadingTime(count > 100);
    };

    updateWordCount();

    editor.on("update", updateWordCount);
    return () => {
      editor.off("update", updateWordCount);
    };
  }, [editor]);

  const readingTime = calculateReadingTime(wordCount);

  return (
    <motion.div
      animate="visible"
      className={cn(
        "flex items-center justify-between rounded-lg border bg-card px-4 py-2 text-sm",
        className
      )}
      initial="hidden"
      variants={animationVariants.staggerContainer}
    >
      <div className="flex items-center gap-3">
        <motion.div
          animate={wordCount > 0 ? "update" : "initial"}
          className="text-muted-foreground"
          variants={animationVariants.statusBar.wordCount}
        >
          {formatWordCount(wordCount)}
        </motion.div>

        {showReadingTime && (
          <>
            <Separator className="h-4" orientation="vertical" />
            <motion.div
              animate="visible"
              className="text-muted-foreground"
              initial="hidden"
              variants={animationVariants.statusBar.readingTime}
            >
              {formatReadingTime(readingTime)}
            </motion.div>
          </>
        )}

        <Separator className="h-4" orientation="vertical" />

        <motion.div
          animate={isSaving ? { opacity: [0.7, 1, 0.7] } : { opacity: 1 }}
          className="flex items-center gap-2 text-muted-foreground"
          transition={
            isSaving
              ? {
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }
              : undefined
          }
        >
          {isSaving ? (
            <>
              <Loader2 className="size-3 animate-spin" />
              <span>Saving...</span>
            </>
          ) : lastSaved ? (
            <>
              <Check className="size-3" />
              <span>Saved {formatTimeAgo(lastSaved)}</span>
            </>
          ) : (
            <span>Not saved</span>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};
