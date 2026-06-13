import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL;

// Gracefully handle missing DATABASE_URL — DB features are optional
function createDb() {
  if (!databaseUrl) {
    return null;
  }

  try {
    const client = postgres(databaseUrl);
    return drizzle(client, { schema });
  } catch {
    console.warn("Failed to connect to database. Analytics features disabled.");
    return null;
  }
}

export const db = createDb();