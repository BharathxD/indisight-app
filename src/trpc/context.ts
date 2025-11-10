import { auth } from "@/auth/server";
import { db } from "@/db";

export const createTRPCContext = async (opts: { headers: Headers }) => {
  const session = await auth.api.getSession({ headers: opts.headers });
  return { db, user: session?.user };
};

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;
