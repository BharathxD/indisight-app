"use client";

import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { cn } from "@/lib/utils";

export const CopyButton = ({ textToCopy }: { textToCopy: string }) => {
  const [copiedText, copyToClipboard] = useCopyToClipboard();

  const handleCopy = async () => {
    try {
      await copyToClipboard(textToCopy);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            aria-label={copiedText ? "Copied" : "Copy to clipboard"}
            className="disabled:opacity-100"
            disabled={!!copiedText}
            onClick={handleCopy}
            size="icon"
            variant="outline"
          >
            <div
              className={cn(
                "transition-all",
                copiedText ? "scale-100 opacity-100" : "scale-0 opacity-0"
              )}
            >
              <Check
                aria-hidden="true"
                className="stroke-emerald-500"
                size={16}
                strokeWidth={2}
              />
            </div>
            <div
              className={cn(
                "absolute transition-all",
                copiedText ? "scale-0 opacity-0" : "scale-100 opacity-100"
              )}
            >
              <Copy aria-hidden="true" size={16} strokeWidth={2} />
            </div>
          </Button>
        </TooltipTrigger>
        <TooltipContent className="px-2 py-1 text-xs">
          Click to copy
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
