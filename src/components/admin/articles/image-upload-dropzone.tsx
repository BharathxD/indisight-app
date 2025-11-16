"use client";

import { ImageIcon, Link2, Loader2, Upload, X } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { animationVariants } from "@/lib/animation-variants";
import { isValidImageUrl } from "@/lib/editor-utils";
import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { ImageCropper } from "./image-cropper";

import "react-image-crop/dist/ReactCrop.css";

type ImageUploadDropzoneProps = {
  value?: string;
  onChange: (url: string) => void;
  label: string;
  recommendedDimensions: string;
  disabled?: boolean;
  folder?: string;
};

type UploadState = "idle" | "uploading" | "complete";
type ImageState = "loading" | "loaded" | "error" | "empty";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export const ImageUploadDropzone = ({
  value,
  onChange,
  label,
  recommendedDimensions,
  disabled = false,
  folder = "articles",
}: ImageUploadDropzoneProps) => {
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [imageState, setImageState] = useState<ImageState>("empty");
  const [urlInput, setUrlInput] = useState("");
  const [isDragActive, setIsDragActive] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [imageForCropping, setImageForCropping] = useState<string | null>(null);
  const [originalFileName, setOriginalFileName] = useState<string>("");

  const uploadMutation = trpc.file.uploadFile.useMutation({
    onSuccess: (data) => {
      onChange(data.publicUrl);
      setUploadState("complete");
      setShowSuccessToast(true);
    },
    onError: (error) => {
      setUploadState("idle");
      toast.error(error.message || "Failed to upload image");
    },
  });

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("Image size must be less than 10MB");
      return;
    }

    setOriginalFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result?.toString();
      if (!dataUrl) {
        toast.error("Failed to read file");
        return;
      }
      setImageForCropping(dataUrl);
      setCropDialogOpen(true);
    };

    reader.onerror = () => {
      toast.error("Failed to process file");
    };

    reader.readAsDataURL(file);
  }, []);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const {
    getRootProps,
    getInputProps,
    isDragActive: dropzoneActive,
  } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
    disabled: disabled || uploadState === "uploading",
    noClick: false,
    noKeyboard: false,
  });

  useEffect(() => {
    setIsDragActive(dropzoneActive);
  }, [dropzoneActive]);

  useEffect(() => {
    if (!value) {
      setImageState("empty");
      setUploadState("idle");
      setShowSuccessToast(false);
      return;
    }

    if (!isValidImageUrl(value)) {
      setImageState("error");
      return;
    }

    setImageState("loading");
    setUploadState("complete");

    const img = new window.Image();
    img.onload = () => {
      setImageState("loaded");
      if (showSuccessToast) {
        toast.success("Image uploaded successfully");
        setShowSuccessToast(false);
      }
    };
    img.onerror = () => setImageState("error");
    img.src = value;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [value, showSuccessToast]);

  const handleUrlSubmit = useCallback(async () => {
    const trimmedUrl = urlInput.trim();
    if (!trimmedUrl) return;

    if (!isValidImageUrl(trimmedUrl)) {
      toast.error("Please enter a valid image URL");
      return;
    }

    try {
      const response = await fetch(trimmedUrl);
      if (!response.ok) {
        toast.error("Failed to fetch image from URL");
        return;
      }

      const blob = await response.blob();
      if (!blob.type.startsWith("image/")) {
        toast.error("URL does not point to a valid image");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result?.toString();
        if (!dataUrl) {
          toast.error("Failed to read image");
          return;
        }
        setOriginalFileName(`url-image-${Date.now()}.jpg`);
        setImageForCropping(dataUrl);
        setCropDialogOpen(true);
        setUrlInput("");
      };

      reader.onerror = () => {
        toast.error("Failed to process image");
      };

      reader.readAsDataURL(blob);
    } catch {
      toast.error("Failed to fetch image. Check CORS or URL validity.");
    }
  }, [urlInput]);

  const handleCropComplete = useCallback(
    (croppedImageBase64: string) => {
      const base64Data = croppedImageBase64.split(",")[1];
      if (!base64Data) {
        toast.error("Failed to process cropped image");
        return;
      }

      setUploadState("uploading");
      uploadMutation.mutate({
        filename: originalFileName || `cropped-${Date.now()}.jpg`,
        contentType: "image/jpeg",
        content: base64Data,
        folder,
      });

      setImageForCropping(null);
      setCropDialogOpen(false);
    },
    [folder, originalFileName, uploadMutation]
  );

  const handleCropCancel = useCallback(() => {
    setImageForCropping(null);
    setCropDialogOpen(false);
    setOriginalFileName("");
  }, []);

  const handleRemove = useCallback(() => {
    onChange("");
    setUrlInput("");
    setUploadState("idle");
  }, [onChange]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleUrlSubmit();
      }
    },
    [handleUrlSubmit]
  );

  const hasImage = value && uploadState === "complete";
  const isDisabled = disabled || uploadState === "uploading";

  if (hasImage && imageState === "loaded") {
    return (
      <div className="space-y-3">
        <Label className="flex items-center gap-2 font-medium text-sm">
          <ImageIcon className="size-3.5 opacity-70" />
          {label}
        </Label>

        <motion.div
          animate="visible"
          className="relative overflow-hidden rounded-lg border"
          initial="hidden"
          variants={animationVariants.imagePreview}
        >
          <div className="group relative h-48 w-full bg-muted">
            <motion.div
              animate={{ opacity: 1 }}
              className="h-full w-full"
              initial={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <Image
                alt="Preview"
                className="h-full w-full object-cover object-top transition-transform duration-200 group-hover:scale-105"
                height={192}
                src={value}
                width={400}
              />
            </motion.div>

            <motion.div
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black/0 transition-colors duration-200 group-hover:bg-black/5"
              initial={{ opacity: 0 }}
            />

            <motion.div
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-2 right-2"
              initial={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                className="size-8 rounded-full bg-background/90 backdrop-blur-sm hover:bg-background"
                disabled={disabled}
                onClick={handleRemove}
                size="icon"
                type="button"
                variant="ghost"
              >
                <X className="size-4" />
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Label className="flex items-center gap-2 font-medium text-sm">
        <ImageIcon className="size-3.5 opacity-70" />
        {label}
      </Label>

      <div className="space-y-3">
        <motion.div
          // biome-ignore lint/suspicious/noExplicitAny: to ignore the type error on motion.div
          {...(getRootProps() as any)}
          animate={isDragActive ? "dragActive" : "idle"}
          className={cn(
            "relative cursor-pointer rounded-lg border-2 border-neutral-300 border-dashed bg-neutral-50/50 p-8 transition-all duration-150",
            "dark:border-neutral-700 dark:bg-neutral-900/50",
            isDragActive &&
              "border-neutral-900 bg-neutral-100/50 dark:border-neutral-400 dark:bg-neutral-800/50",
            disabled && "cursor-not-allowed opacity-50",
            uploadState === "uploading" && "cursor-wait"
          )}
          variants={animationVariants.dropzone}
        >
          <input {...getInputProps()} />

          {uploadState === "uploading" ? (
            <div className="flex flex-col items-center justify-center gap-3 text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              >
                <Loader2 className="size-8 text-neutral-600 dark:text-neutral-400" />
              </motion.div>
              <div className="space-y-1">
                <p className="font-medium text-neutral-900 text-sm dark:text-neutral-100">
                  Uploading...
                </p>
                <p className="text-neutral-500 text-xs dark:text-neutral-400">
                  Please wait while we upload your image
                </p>
              </div>
            </div>
          ) : (
            <motion.div
              animate="visible"
              className="flex flex-col items-center justify-center gap-3 text-center"
              initial="hidden"
              variants={animationVariants.dropzone.content}
            >
              <motion.div
                animate={isDragActive ? "active" : "idle"}
                className="rounded-full bg-neutral-100 p-3 dark:bg-neutral-800"
                variants={animationVariants.dropzone.uploadIcon}
              >
                <Upload className="size-5 text-neutral-600 dark:text-neutral-400" />
              </motion.div>
              <div className="space-y-1">
                <p className="font-medium text-neutral-900 text-sm dark:text-neutral-100">
                  Drop an image here, or click to browse
                </p>
                <p className="text-neutral-500 text-xs dark:text-neutral-400">
                  Recommended: {recommendedDimensions} • Max 10MB
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>

        <motion.div
          animate="visible"
          className="flex items-center gap-2"
          initial="hidden"
          variants={animationVariants.dropzone.divider}
        >
          <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
          <span className="text-neutral-400 text-xs dark:text-neutral-500">
            or
          </span>
          <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
        </motion.div>

        <motion.div
          animate="visible"
          className="flex gap-2"
          initial="hidden"
          variants={animationVariants.dropzone.urlSection}
        >
          <div className="relative flex-1">
            <Link2 className="-translate-y-1/2 absolute top-1/2 left-3 size-4 text-neutral-400 dark:text-neutral-500" />
            <Input
              className="h-9 pl-9"
              disabled={isDisabled}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Paste image URL"
              type="url"
              value={urlInput}
            />
          </div>
          <Button
            className="h-9"
            disabled={!urlInput.trim() || isDisabled}
            onClick={handleUrlSubmit}
            size="sm"
            type="button"
            variant="secondary"
          >
            Add
          </Button>
        </motion.div>
      </div>

      {imageForCropping && (
        <ImageCropper
          dialogOpen={cropDialogOpen}
          imageUrl={imageForCropping}
          onCancel={handleCropCancel}
          onCropComplete={handleCropComplete}
          recommendedDimensions={recommendedDimensions}
          setDialogOpen={setCropDialogOpen}
        />
      )}
    </div>
  );
};
