import { publicProcedure } from "@/trpc/procedure";
import { router } from "@/trpc/server";

export type HealthResponse = {
  status: "ok";
};

export const healthRouter = router({
  health: publicProcedure.query((): HealthResponse => ({ status: "ok" })),
});

export type HealthRouter = typeof healthRouter;
