import "dotenv/config";
import path from "node:path";
import type { PrismaConfig } from "prisma";
import { env } from "./src/env";

export default {
  schema: path.join("src", "db", "schema"),
  migrations: {
    path: path.join("src", "db", "migrations"),
  },
  engine: "classic",
  datasource: { url: env.DATABASE_URL },
} satisfies PrismaConfig;
