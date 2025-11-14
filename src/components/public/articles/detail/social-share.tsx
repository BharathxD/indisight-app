"use client";

import { Facebook, Linkedin, Mail, Twitter, Link as LinkIcon } from "lucide-react";
import { useState } from "react";

type SocialShareProps = {
  url: string;
  title: string;
};

export const SocialShare = ({ url, title }: SocialShareProps) => {
  const [copied, setCopied] = useState(false);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`,
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="rounded-lg border border-border bg-muted/30 p-5 lg:rounded-none lg:border-0 lg:border-t lg:bg-transparent lg:p-0 lg:pt-8">
      <h3 className="mb-4 font-semibold text-[0.8125rem] text-muted-foreground uppercase tracking-wider">
        Share Article
      </h3>
      <div className="flex flex-wrap gap-2">
        <a
          className="flex size-10 items-center justify-center rounded-md border border-border bg-background text-foreground transition-all hover:border-foreground/40 hover:bg-muted"
          href={shareLinks.twitter}
          rel="noopener noreferrer"
          target="_blank"
          title="Share on Twitter"
        >
          <Twitter className="size-4" />
        </a>
        <a
          className="flex size-10 items-center justify-center rounded-md border border-border bg-background text-foreground transition-all hover:border-foreground/40 hover:bg-muted"
          href={shareLinks.linkedin}
          rel="noopener noreferrer"
          target="_blank"
          title="Share on LinkedIn"
        >
          <Linkedin className="size-4" />
        </a>
        <a
          className="flex size-10 items-center justify-center rounded-md border border-border bg-background text-foreground transition-all hover:border-foreground/40 hover:bg-muted"
          href={shareLinks.facebook}
          rel="noopener noreferrer"
          target="_blank"
          title="Share on Facebook"
        >
          <Facebook className="size-4" />
        </a>
        <a
          className="flex size-10 items-center justify-center rounded-md border border-border bg-background text-foreground transition-all hover:border-foreground/40 hover:bg-muted"
          href={shareLinks.email}
          title="Share via Email"
        >
          <Mail className="size-4" />
        </a>
        <button
          className="flex size-10 items-center justify-center rounded-md border border-border bg-background text-foreground transition-all hover:border-foreground/40 hover:bg-muted"
          onClick={handleCopyLink}
          title={copied ? "Copied!" : "Copy Link"}
          type="button"
        >
          <LinkIcon className="size-4" />
        </button>
      </div>
      {copied && (
        <p className="mt-2 text-[0.75rem] text-muted-foreground">
          Link copied to clipboard!
        </p>
      )}
    </div>
  );
};

