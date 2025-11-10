import type { inferRouterOutputs } from "@trpc/server";
import { healthRouter } from "@/trpc/routers/health";
import { router } from "@/trpc/server";

export const appRouter = router({
  health: healthRouter,
});

export type AppRouter = typeof appRouter;
export type RouterOutput = inferRouterOutputs<typeof appRouter>;
