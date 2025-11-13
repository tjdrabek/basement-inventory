import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "@/db/schema";

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL is missing in your .env file");
}

const client = createClient({
  url,
  authToken: process.env.DATABASE_AUTH_TOKEN, // only used for Turso
});

// One DB instance, no dialect switching needed
export const db = drizzle(client, { schema });
