import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const adEventsTable = pgTable("ad_events", {
  id: serial("id").primaryKey(),
  slot: text("slot").notNull(),
  event: text("event").notNull(), // 'impression' | 'click'
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type AdEvent = typeof adEventsTable.$inferSelect;
export type InsertAdEvent = typeof adEventsTable.$inferInsert;
