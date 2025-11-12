import type { UserRole } from "@prisma/client";
import type { User } from "better-auth";
import { auth } from "@/auth/server";
import { db } from "@/db";

type UserWithRole = User & { role: UserRole };

export const createTRPCContext = async (opts: { headers: Headers }) => {
  const session = await auth.api.getSession({ headers: opts.headers });
  const user: UserWithRole | null = session?.user as UserWithRole | null;
  return { db, user };
};

export const createPublicTRPCContext = () => ({ db, user: null });

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;
