"use client";

import { Check, Instagram, Share2 } from "lucide-react";
import { toast } from "sonner";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

type SocialShareProps = {
  url: string;
  title: string;
};

export const SocialShare = ({ url, title }: SocialShareProps) => {
  const [copiedText, copy] = useCopyToClipboard();
  const isCopied = copiedText === url;

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    instagram: "https://www.instagram.com",
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
    twitter: `https://x.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  };

  const handleCopyLink = async () => {
    const success = await copy(url);
    if (success) {
      toast.success("Link copied to clipboard");
    } else {
      toast.error("Failed to copy link");
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url,
        });
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="space-y-2">
      <h3 className="font-medium text-base text-foreground/70">Share</h3>
      <div className="flex items-center gap-3">
        <a
          aria-label="Share on Facebook"
          className="flex size-10 items-center justify-center bg-foreground/80 text-background transition-colors hover:bg-foreground/70 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700"
          href={shareLinks.facebook}
          rel="noopener noreferrer"
          target="_blank"
        >
          <span className="sr-only">Share on Facebook</span>
          <svg
            aria-hidden="true"
            className="size-5"
            viewBox="0 0 50 50"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Facebook</title>
            <path
              d="M47.3,21.01c-0.58-1.6-1.3-3.16-2.24-4.66c-0.93-1.49-2.11-2.93-3.63-4.13c-1.51-1.19-3.49-2.09-5.59-2.26l-0.78-0.04	c-0.27,0.01-0.57,0.01-0.85,0.04c-0.57,0.06-1.11,0.19-1.62,0.34c-1.03,0.32-1.93,0.8-2.72,1.32c-1.42,0.94-2.55,2.03-3.57,3.15	c0.01,0.02,0.03,0.03,0.04,0.05l0.22,0.28c0.51,0.67,1.62,2.21,2.61,3.87c1.23-1.2,2.83-2.65,3.49-3.07	c0.5-0.31,0.99-0.55,1.43-0.68c0.23-0.06,0.44-0.11,0.64-0.12c0.1-0.02,0.19-0.01,0.3-0.02l0.38,0.02c0.98,0.09,1.94,0.49,2.85,1.19	c1.81,1.44,3.24,3.89,4.17,6.48c0.95,2.6,1.49,5.44,1.52,8.18c0,1.31-0.17,2.57-0.57,3.61c-0.39,1.05-1.38,1.45-2.5,1.45	c-1.63,0-2.81-0.7-3.76-1.68c-1.04-1.09-2.02-2.31-2.96-3.61c-0.78-1.09-1.54-2.22-2.26-3.37c-1.27-2.06-2.97-4.67-4.15-6.85	L25,16.35c-0.31-0.39-0.61-0.78-0.94-1.17c-1.11-1.26-2.34-2.5-3.93-3.56c-0.79-0.52-1.69-1-2.72-1.32	c-0.51-0.15-1.05-0.28-1.62-0.34c-0.18-0.02-0.36-0.03-0.54-0.03c-0.11,0-0.21-0.01-0.31-0.01l-0.78,0.04	c-2.1,0.17-4.08,1.07-5.59,2.26c-1.52,1.2-2.7,2.64-3.63,4.13C4,17.85,3.28,19.41,2.7,21.01c-1.13,3.2-1.74,6.51-1.75,9.93	c0.01,1.78,0.24,3.63,0.96,5.47c0.7,1.8,2.02,3.71,4.12,4.77c1.03,0.53,2.2,0.81,3.32,0.81c1.23,0.03,2.4-0.32,3.33-0.77	c1.87-0.93,3.16-2.16,4.33-3.4c2.31-2.51,4.02-5.23,5.6-8c0.44-0.76,0.86-1.54,1.27-2.33c-0.21-0.41-0.42-0.84-0.64-1.29	c-0.62-1.03-1.39-2.25-1.95-3.1c-0.83,1.5-1.69,2.96-2.58,4.41c-1.59,2.52-3.3,4.97-5.21,6.98c-0.95,0.98-2,1.84-2.92,2.25	c-0.47,0.2-0.83,0.27-1.14,0.25c-0.43,0-0.79-0.1-1.13-0.28c-0.67-0.35-1.3-1.1-1.69-2.15c-0.4-1.04-0.57-2.3-0.57-3.61	c0.03-2.74,0.57-5.58,1.52-8.18c0.93-2.59,2.36-5.04,4.17-6.48c0.91-0.7,1.87-1.1,2.85-1.19l0.38-0.02c0.11,0.01,0.2,0,0.3,0.02	c0.2,0.01,0.41,0.06,0.64,0.12c0.26,0.08,0.54,0.19,0.83,0.34c0.2,0.1,0.4,0.21,0.6,0.34c1,0.64,1.99,1.58,2.92,2.62	c0.72,0.81,1.41,1.71,2.1,2.63L25,25.24c0.75,1.55,1.53,3.09,2.39,4.58c1.58,2.77,3.29,5.49,5.6,8c0.68,0.73,1.41,1.45,2.27,2.1	c0.61,0.48,1.28,0.91,2.06,1.3c0.93,0.45,2.1,0.8,3.33,0.77c1.12,0,2.29-0.28,3.32-0.81c2.1-1.06,3.42-2.97,4.12-4.77	c0.72-1.84,0.95-3.69,0.96-5.47C49.04,27.52,48.43,24.21,47.3,21.01z"
              fill="currentColor"
            />
          </svg>
        </a>
        <a
          aria-label="Share on Instagram"
          className="flex size-10 items-center justify-center bg-foreground/80 text-background transition-colors hover:bg-foreground/70 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700"
          href={shareLinks.instagram}
          rel="noopener noreferrer"
          target="_blank"
        >
          <Instagram className="size-5" />
        </a>
        <a
          aria-label="Share on LinkedIn"
          className="flex size-10 items-center justify-center bg-foreground/80 text-background transition-colors hover:bg-foreground/70 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700"
          href={shareLinks.linkedin}
          rel="noopener noreferrer"
          target="_blank"
        >
          <span className="sr-only">Share on LinkedIn</span>
          <svg
            aria-hidden="true"
            className="size-9"
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>LinkedIn</title>
            <path
              d="M12 19H17V36H12zM14.485 17h-.028C12.965 17 12 15.888 12 14.499 12 13.08 12.995 12 14.514 12c1.521 0 2.458 1.08 2.486 2.499C17 15.887 16.035 17 14.485 17zM36 36h-5v-9.099c0-2.198-1.225-3.698-3.192-3.698-1.501 0-2.313 1.012-2.707 1.99C24.957 25.543 25 26.511 25 27v9h-5V19h5v2.616C25.721 20.5 26.85 19 29.738 19c3.578 0 6.261 2.25 6.261 7.274L36 36 36 36z"
              fill="currentColor"
            />
          </svg>
        </a>
        <a
          aria-label="Share on WhatsApp"
          className="flex size-10 items-center justify-center bg-foreground/80 text-background transition-colors hover:bg-foreground/70 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700"
          href={shareLinks.whatsapp}
          rel="noopener noreferrer"
          target="_blank"
        >
          <span className="sr-only">Share on WhatsApp</span>
          <svg
            aria-hidden="true"
            className="size-5 fill-current"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>WhatsApp</title>
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
        </a>
        <a
          aria-label="Share on X (Twitter)"
          className="flex size-10 items-center justify-center bg-foreground/80 text-background transition-colors hover:bg-foreground/70 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700"
          href={shareLinks.twitter}
          rel="noopener noreferrer"
          target="_blank"
        >
          <span className="sr-only">Share on X (Twitter)</span>
          <svg
            aria-hidden="true"
            className="size-4 fill-current"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>X (Twitter)</title>
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </a>
        <button
          aria-label="Share or copy link"
          className="flex size-10 items-center justify-center bg-foreground/80 text-background transition-colors hover:bg-foreground/70 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700"
          onClick={handleNativeShare}
          type="button"
        >
          {isCopied ? (
            <Check className="size-5" />
          ) : (
            <Share2 className="size-5" />
          )}
        </button>
      </div>
    </div>
  );
};
