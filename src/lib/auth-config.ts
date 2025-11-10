import "server-only";
import { env } from "@/env";

export const getSignupEnabled = () => env.SIGNUP_ENABLED === "true";
