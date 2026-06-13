import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const analytics = pgTable("analytics", {
  id: uuid("id").primaryKey().defaultRandom(),
  path: text("path").notNull(),
  referrer: text("referrer"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});