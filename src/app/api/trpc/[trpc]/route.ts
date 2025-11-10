import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { headers } from "next/headers";
import type { NextRequest } from "next/server";
import { createTRPCContext } from "@/trpc/context";
import { appRouter as router } from "@/trpc/routers";

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router,
    createContext: async () => createTRPCContext({ headers: await headers() }),
  });

export {
  handler as DELETE,
  handler as GET,
  handler as OPTIONS,
  handler as PATCH,
  handler as POST,
  handler as PUT,
};
