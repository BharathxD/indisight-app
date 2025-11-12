import type { inferRouterOutputs } from "@trpc/server";
import { cmsRouter } from "@/trpc/routers/cms";
import { fileRouter } from "@/trpc/routers/file";
import { healthRouter } from "@/trpc/routers/health";
import { router } from "@/trpc/server";

export const appRouter = router({
  health: healthRouter,
  cms: cmsRouter,
  file: fileRouter,
});

export type AppRouter = typeof appRouter;
export type RouterOutput = inferRouterOutputs<typeof appRouter>;
