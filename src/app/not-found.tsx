import { FileQuestion } from "lucide-react";
import Link from "next/link";

const NotFound = () => (
  <div className="flex min-h-screen items-center justify-center bg-background px-6">
    <div className="mx-auto max-w-2xl text-center">
      <div className="mb-8 inline-flex items-center justify-center rounded-full bg-muted p-6">
        <FileQuestion className="size-12 text-muted-foreground" />
      </div>

      <h1 className="mb-4 font-bold text-5xl text-foreground tracking-tight md:text-6xl">
        404
      </h1>

      <h2 className="mb-4 font-semibold text-2xl text-foreground md:text-3xl">
        Page Not Found
      </h2>

      <p className="mb-8 text-lg text-muted-foreground leading-relaxed">
        The page you're looking for doesn't exist or has been moved. Let's get
        you back on track.
      </p>

      <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Link
          className="inline-flex items-center justify-center border border-foreground bg-foreground px-8 py-3 font-medium text-background transition-all hover:bg-muted-foreground"
          href="/"
        >
          Return Home
        </Link>
        <Link
          className="inline-flex items-center justify-center border border-border bg-muted px-8 py-3 font-medium text-foreground transition-all hover:border-foreground hover:bg-background"
          href="/articles"
        >
          Browse Articles
        </Link>
      </div>
    </div>
  </div>
);

export default NotFound;
