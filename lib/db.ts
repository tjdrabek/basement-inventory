import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "@/db/schema";

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL is missing in your .env file");
}

// Handle different URL formats for different environments
let clientUrl = url;
if (url.startsWith("file:")) {
  // For local development, convert file: URLs to proper paths
  const isWindows = process.platform === "win32";
  const filePath = url.replace("file:", "");

  // In Docker, use the container path; locally use relative path
  if (
    process.env.NODE_ENV === "production" ||
    process.env.DOCKER_ENV === "true"
  ) {
    clientUrl = `file:${filePath}`;
  } else {
    // For local development
    const localPath = isWindows
      ? filePath.replace("/app/", "./")
      : filePath.replace("/app/", "./");
    clientUrl = `file:${localPath}`;
  }
}

const client = createClient({
  url: clientUrl,
  authToken: process.env.DATABASE_AUTH_TOKEN, // only used for Turso
});

export const db = drizzle(client, { schema });
