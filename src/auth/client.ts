import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { env } from "@/env";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_APP_URL,
  plugins: [
    inferAdditionalFields({
      user: {
        role: {
          type: "string",
          required: false,
          defaultValue: "VIEWER",
          input: false,
        },
      },
    }),
  ],
});

export const { useSession, signIn, signUp, signOut } = authClient;
