import { pgTable, serial, text, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";

export const opportunitiesTable = pgTable("opportunities", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  titleAr: text("title_ar").notNull(),
  type: text("type").notNull(), // 'scholarship' | 'migration'
  countryCode: text("country_code").notNull(),
  countryName: text("country_name").notNull(),
  countryNameAr: text("country_name_ar").notNull(),
  organization: text("organization").notNull(),
  degreeLevel: text("degree_level").notNull(),
  field: text("field").notNull(),
  funding: text("funding").notNull(),
  amount: text("amount"),
  duration: text("duration"),
  deadline: text("deadline").notNull(),
  description: text("description").notNull(),
  eligibility: text("eligibility"),
  benefits: jsonb("benefits").$type<string[]>().notNull().default([]),
  requirements: jsonb("requirements").$type<string[]>().notNull().default([]),
  applicationUrl: text("application_url"),
  tags: jsonb("tags").$type<string[]>().notNull().default([]),
  difficulty: integer("difficulty").default(3),
  acceptanceRate: integer("acceptance_rate").default(20),
  featured: boolean("featured").notNull().default(false),
  affiliateUrl: text("affiliate_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Opportunity = typeof opportunitiesTable.$inferSelect;
export type InsertOpportunity = typeof opportunitiesTable.$inferInsert;
