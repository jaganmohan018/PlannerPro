import { pgTable, text, serial, integer, boolean, timestamp, decimal, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const stores = pgTable("stores", {
  id: serial("id").primaryKey(),
  storeNumber: text("store_number").notNull().unique(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const plannerEntries = pgTable("planner_entries", {
  id: serial("id").primaryKey(),
  storeId: integer("store_id").notNull().references(() => stores.id),
  date: text("date").notNull(), // YYYY-MM-DD format
  
  // Sales tracking data
  dailySales: decimal("daily_sales", { precision: 10, scale: 2 }),
  wtdActual: decimal("wtd_actual", { precision: 10, scale: 2 }),
  mtdActual: decimal("mtd_actual", { precision: 10, scale: 2 }),
  ytdActual: decimal("ytd_actual", { precision: 10, scale: 2 }),
  aifServiceGoal: integer("aif_service_goal"),
  adtAvgTransaction: decimal("adt_avg_transaction", { precision: 8, scale: 2 }),
  npsScore: integer("nps_score"),
  
  // Today's Plan content
  contests: text("contests"),
  upcomingSales: text("upcoming_sales"),
  endOfDayNotes: text("end_of_day_notes"),
  
  // Priorities and todos (stored as JSON arrays)
  priorities: jsonb("priorities"), // ["Priority 1", "Priority 2", "Priority 3"]
  todos: jsonb("todos"), // [{"task": "Task", "completed": false}]
  
  // Activity sections (stored as JSON objects)
  dailyOperations: jsonb("daily_operations"), // {"storeOpening": true, "tillCount": false, ...}
  inventoryManagement: jsonb("inventory_management"),
  storeStandards: jsonb("store_standards"),
  
  // Additional fields
  inventoryBenches: text("inventory_benches"),
  upcomingEducation: text("upcoming_education"),
  educationToSold: text("education_to_sold"),
  socialPosts: text("social_posts"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const staffSchedules = pgTable("staff_schedules", {
  id: serial("id").primaryKey(),
  plannerEntryId: integer("planner_entry_id").notNull().references(() => plannerEntries.id),
  staffName: text("staff_name").notNull(),
  slot8to9: text("slot_8_to_9").default("Open"), // "Open", "Scheduled", "Break"
  slot9to12: text("slot_9_to_12").default("Open"),
  slot12to4: text("slot_12_to_4").default("Open"),
  slot4to8: text("slot_4_to_8").default("Open"),
});

export const storeAnalytics = pgTable("store_analytics", {
  id: serial("id").primaryKey(),
  storeId: integer("store_id").notNull().references(() => stores.id),
  month: text("month").notNull(), // YYYY-MM format
  
  salesTrend: decimal("sales_trend", { precision: 5, scale: 2 }),
  staffPerformance: decimal("staff_performance", { precision: 5, 2 }),
  goalProgress: decimal("goal_progress", { precision: 5, scale: 2 }),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const storesRelations = relations(stores, ({ many }) => ({
  plannerEntries: many(plannerEntries),
  analytics: many(storeAnalytics),
}));

export const plannerEntriesRelations = relations(plannerEntries, ({ one, many }) => ({
  store: one(stores, {
    fields: [plannerEntries.storeId],
    references: [stores.id],
  }),
  staffSchedules: many(staffSchedules),
}));

export const staffSchedulesRelations = relations(staffSchedules, ({ one }) => ({
  plannerEntry: one(plannerEntries, {
    fields: [staffSchedules.plannerEntryId],
    references: [plannerEntries.id],
  }),
}));

export const storeAnalyticsRelations = relations(storeAnalytics, ({ one }) => ({
  store: one(stores, {
    fields: [storeAnalytics.storeId],
    references: [stores.id],
  }),
}));

// Insert schemas
export const insertStoreSchema = createInsertSchema(stores).omit({
  id: true,
  createdAt: true,
});

export const insertPlannerEntrySchema = createInsertSchema(plannerEntries).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertStaffScheduleSchema = createInsertSchema(staffSchedules).omit({
  id: true,
});

export const insertStoreAnalyticsSchema = createInsertSchema(storeAnalytics).omit({
  id: true,
  createdAt: true,
});

// Types
export type Store = typeof stores.$inferSelect;
export type InsertStore = z.infer<typeof insertStoreSchema>;
export type PlannerEntry = typeof plannerEntries.$inferSelect;
export type InsertPlannerEntry = z.infer<typeof insertPlannerEntrySchema>;
export type StaffSchedule = typeof staffSchedules.$inferSelect;
export type InsertStaffSchedule = z.infer<typeof insertStaffScheduleSchema>;
export type StoreAnalytics = typeof storeAnalytics.$inferSelect;
export type InsertStoreAnalytics = z.infer<typeof insertStoreAnalyticsSchema>;
