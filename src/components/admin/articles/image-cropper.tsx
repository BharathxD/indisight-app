"use client";

import { CropIcon, Trash2Icon } from "lucide-react";
import Image from "next/image";
import { type SyntheticEvent, useRef, useState } from "react";
import ReactCrop, {
  type Crop,
  centerCrop,
  makeAspectCrop,
  type PixelCrop,
} from "react-image-crop";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";

import "react-image-crop/dist/ReactCrop.css";

type ImageCropperProps = {
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  imageUrl: string;
  recommendedDimensions: string;
  onCropComplete: (croppedImageBase64: string) => void;
  onCancel: () => void;
};

const parseAspectRatio = (dimensions: string): number => {
  const parts = dimensions.split("x").map((d) => d.trim());
  if (parts.length === 2) {
    const width = Number.parseInt(parts[0], 10);
    const height = Number.parseInt(parts[1], 10);
    if (!(Number.isNaN(width) || Number.isNaN(height)) && height !== 0) {
      return width / height;
    }
  }
  return 1;
};

const centerAspectCrop = (
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
): Crop =>
  centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );

export const ImageCropper = ({
  dialogOpen,
  setDialogOpen,
  imageUrl,
  recommendedDimensions,
  onCropComplete,
  onCancel,
}: ImageCropperProps) => {
  const aspect = parseAspectRatio(recommendedDimensions);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [croppedImageUrl, setCroppedImageUrl] = useState<string>("");

  const onImageLoad = (e: SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, aspect));
  };

  const onCropCompleteHandler = (crop: PixelCrop) => {
    if (imgRef.current && crop.width && crop.height) {
      const croppedUrl = getCroppedImg(imgRef.current, crop);
      setCroppedImageUrl(croppedUrl);
    }
  };

  const getCroppedImg = (image: HTMLImageElement, crop: PixelCrop): string => {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;

    const ctx = canvas.getContext("2d");

    if (ctx) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width * scaleX,
        crop.height * scaleY
      );
    }

    return canvas.toDataURL("image/jpeg", 0.95);
  };

  const handleCrop = () => {
    if (croppedImageUrl) {
      onCropComplete(croppedImageUrl);
      setDialogOpen(false);
    }
  };

  const handleCancel = () => {
    onCancel();
    setDialogOpen(false);
    setCrop(undefined);
    setCroppedImageUrl("");
  };

  return (
    <Dialog onOpenChange={setDialogOpen} open={dialogOpen}>
      <DialogContent className="max-w-3xl gap-0 p-0">
        <div className="size-full p-6">
          <div className="mb-4">
            <DialogTitle className="font-semibold text-foreground text-lg">
              Crop Image
            </DialogTitle>
            <p className="text-muted-foreground text-sm">
              Adjust the crop area to fit the recommended dimensions (
              {recommendedDimensions})
            </p>
          </div>
          <ReactCrop
            aspect={aspect}
            className="w-full"
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => onCropCompleteHandler(c)}
          >
            <div className="relative w-full">
              <Image
                alt="Image to crop"
                className="max-h-[500px] w-full object-contain"
                height={500}
                onLoad={onImageLoad}
                ref={imgRef}
                src={imageUrl}
                width={800}
              />
            </div>
          </ReactCrop>
        </div>
        <DialogFooter className="justify-center p-6 pt-0">
          <DialogClose asChild>
            <Button
              className="w-fit"
              onClick={handleCancel}
              size="sm"
              type="reset"
              variant="outline"
            >
              <Trash2Icon className="mr-1.5 size-4" />
              Cancel
            </Button>
          </DialogClose>
          <Button
            className="w-fit"
            disabled={!croppedImageUrl}
            onClick={handleCrop}
            size="sm"
            type="submit"
          >
            <CropIcon className="mr-1.5 size-4" />
            Crop & Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
