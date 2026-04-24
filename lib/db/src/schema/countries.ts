import { pgTable, text, doublePrecision } from "drizzle-orm/pg-core";

export const countriesTable = pgTable("countries", {
  code: text("code").primaryKey(),
  name: text("name").notNull(),
  nameAr: text("name_ar").notNull(),
  flag: text("flag").notNull(),
  region: text("region").notNull(),
  description: text("description"),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
});

export type Country = typeof countriesTable.$inferSelect;
export type InsertCountry = typeof countriesTable.$inferInsert;
