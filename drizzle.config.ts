import type { Config } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config();

const databaseUrl = process.env.DATABASE_URL!;
const isRemote =
  databaseUrl.startsWith("libsql://") || databaseUrl.startsWith("https://");

export default {
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dialect: isRemote ? "turso" : "sqlite",
  dbCredentials: isRemote
    ? {
        url: databaseUrl,
        authToken: process.env.DATABASE_AUTH_TOKEN!,
      }
    : {
        url: databaseUrl.replace("file:", ""),
      },
} satisfies Config;
