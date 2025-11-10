import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import z, { ZodError } from "zod";
import type { createTRPCContext } from "./context";

export const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError
            ? z.treeifyError(error.cause).errors
            : null,
      },
    };
  },
});

export const createCallerFactory = t.createCallerFactory;
export const router = t.router;
