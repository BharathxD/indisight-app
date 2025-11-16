import { ArrowRight } from "lucide-react";
import Link from "next/link";

type NewsletterCtaProps = {
  signupUrl?: string;
};

export const NewsletterCta = ({
  signupUrl = "https://tally.so/r/w2YgzD",
}: NewsletterCtaProps) => (
  <div className="space-y-4 bg-foreground/80 p-4 text-background dark:bg-neutral-800 dark:text-neutral-100">
    <h3 className="font-bold text-xl leading-tight">
      Don't Miss the Next Big Story
    </h3>
    <p className="text-sm leading-relaxed opacity-90">
      Get exclusive conversations, deep-dive stories, and strategy insights,
      only what truly shapes tomorrow.
    </p>
    <Link
      className="inline-flex w-full items-center gap-2 bg-background px-6 py-3 font-medium text-foreground text-sm transition-colors hover:bg-background/90 dark:bg-neutral-950 dark:text-neutral-100 dark:hover:bg-neutral-900"
      href={signupUrl}
      rel="noopener noreferrer"
      target="_blank"
    >
      Subscribe To Newsletter
      <ArrowRight className="size-4" />
    </Link>
  </div>
);
