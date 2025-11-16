"use client";

import { ImageIcon, ImageOff, Loader2, X } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { animationVariants } from "@/lib/animation-variants";
import { isValidImageUrl } from "@/lib/editor-utils";
import { cn } from "@/lib/utils";

type ImagePreviewCardProps = {
  url: string;
  onRemove?: () => void;
  className?: string;
};

type ImageState = "loading" | "loaded" | "error" | "empty";

export const ImagePreviewCard = ({
  url,
  onRemove,
  className,
}: ImagePreviewCardProps) => {
  const [imageState, setImageState] = useState<ImageState>("empty");
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (!url) {
      setImageState("empty");
      setShowPreview(false);
      return;
    }

    if (!isValidImageUrl(url)) {
      setImageState("error");
      setShowPreview(true);
      return;
    }

    setImageState("loading");
    setShowPreview(true);

    const img = new window.Image();
    img.onload = () => setImageState("loaded");
    img.onerror = () => setImageState("error");
    img.src = url;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [url]);

  if (!showPreview) return null;

  return (
    <motion.div
      animate="visible"
      className={cn("relative overflow-hidden rounded-lg border", className)}
      initial="hidden"
      variants={animationVariants.imagePreview}
    >
      <div className="relative h-60 w-full bg-muted">
        {imageState === "loading" && (
          <div className="flex h-full items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            >
              <Loader2 className="size-8 text-muted-foreground" />
            </motion.div>
          </div>
        )}

        {imageState === "loaded" && (
          <motion.div
            animate={{ opacity: 1 }}
            className="h-full w-full"
            initial={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <Image
              alt="Preview"
              className="h-full w-full object-cover object-top"
              height={240}
              src={url}
              width={400}
            />
          </motion.div>
        )}

        {imageState === "error" && (
          <motion.div
            animate="visible"
            className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground"
            initial="hidden"
            variants={{
              hidden: { opacity: 0, scale: 0.95 },
              visible: { opacity: 1, scale: 1 },
            }}
          >
            <ImageOff className="size-12" />
            <p className="text-sm">Invalid image URL</p>
          </motion.div>
        )}

        {imageState === "empty" && (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <ImageIcon className="size-12" />
          </div>
        )}

        {onRemove && (
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-2 right-2"
            initial={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              className="size-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
              onClick={onRemove}
              size="icon"
              type="button"
              variant="ghost"
            >
              <X className="size-4" />
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
