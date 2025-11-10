import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/db";

export const auth = betterAuth({
  plugins: [nextCookies()],
  database: prismaAdapter(db, { provider: "postgresql" }),
  emailAndPassword: {
    enabled: true,
    signupEnabled: false,
  },
  redirects: { signIn: "/" },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "VIEWER",
        input: false,
      },
    },
  },
});
