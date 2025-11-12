import { cache } from "react";
import { appRouter } from "@/trpc/routers";
import { createCallerFactory } from "@/trpc/server";
import { createPublicTRPCContext } from "./context";

export const trpc = cache(() =>
  createCallerFactory(appRouter)(createPublicTRPCContext())
);
