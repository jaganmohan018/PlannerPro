import { users, stores, plannerEntries, staffSchedules, storeAnalytics, type User, type InsertUser, type Store, type InsertStore, type PlannerEntry, type InsertPlannerEntry, type StaffSchedule, type InsertStaffSchedule, type StoreAnalytics, type InsertStoreAnalytics } from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, gte, lte } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  getDistrictManagers(): Promise<User[]>;
  
  // Store operations
  getStores(): Promise<Store[]>;
  getStore(id: number): Promise<Store | undefined>;
  createStore(store: InsertStore): Promise<Store>;
  assignStoreToDistrictManager(storeId: number, districtManagerId: number | null): Promise<Store>;
  
  // Planner entry operations
  getPlannerEntry(storeId: number, date: string): Promise<PlannerEntry | undefined>;
  getPlannerEntriesForStore(storeId: number, limit?: number): Promise<PlannerEntry[]>;
  createPlannerEntry(entry: InsertPlannerEntry): Promise<PlannerEntry>;
  updatePlannerEntry(id: number, entry: Partial<InsertPlannerEntry>): Promise<PlannerEntry>;
  
  // Staff schedule operations
  getStaffSchedulesForEntry(plannerEntryId: number): Promise<StaffSchedule[]>;
  createStaffSchedule(schedule: InsertStaffSchedule): Promise<StaffSchedule>;
  updateStaffSchedule(id: number, schedule: Partial<InsertStaffSchedule>): Promise<StaffSchedule>;
  deleteStaffSchedule(id: number): Promise<void>;
  
  // Analytics operations
  getStoreAnalytics(storeId: number): Promise<StoreAnalytics[]>;
  createStoreAnalytics(analytics: InsertStoreAnalytics): Promise<StoreAnalytics>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async getDistrictManagers(): Promise<User[]> {
    return await db.select().from(users).where(eq(users.role, 'district_manager'));
  }

  async getStores(): Promise<Store[]> {
    return await db.select().from(stores).where(eq(stores.isActive, true)).orderBy(stores.storeNumber);
  }

  async getStore(id: number): Promise<Store | undefined> {
    const [store] = await db.select().from(stores).where(eq(stores.id, id));
    return store || undefined;
  }

  async createStore(insertStore: InsertStore): Promise<Store> {
    const [store] = await db.insert(stores).values(insertStore).returning();
    return store;
  }

  async assignStoreToDistrictManager(storeId: number, districtManagerId: number | null): Promise<Store> {
    const [store] = await db
      .update(stores)
      .set({ districtManagerId })
      .where(eq(stores.id, storeId))
      .returning();
    return store;
  }

  async getPlannerEntry(storeId: number, date: string): Promise<PlannerEntry | undefined> {
    const [entry] = await db
      .select()
      .from(plannerEntries)
      .where(and(eq(plannerEntries.storeId, storeId), eq(plannerEntries.date, date)));
    return entry || undefined;
  }

  async getPlannerEntriesForStore(storeId: number, limit = 30): Promise<PlannerEntry[]> {
    return await db
      .select()
      .from(plannerEntries)
      .where(eq(plannerEntries.storeId, storeId))
      .orderBy(desc(plannerEntries.date))
      .limit(limit);
  }

  async createPlannerEntry(insertEntry: InsertPlannerEntry): Promise<PlannerEntry> {
    const [entry] = await db.insert(plannerEntries).values(insertEntry).returning();
    return entry;
  }

  async updatePlannerEntry(id: number, updateEntry: Partial<InsertPlannerEntry>): Promise<PlannerEntry> {
    const [entry] = await db
      .update(plannerEntries)
      .set({ ...updateEntry, updatedAt: new Date() })
      .where(eq(plannerEntries.id, id))
      .returning();
    return entry;
  }

  async getStaffSchedulesForEntry(plannerEntryId: number): Promise<StaffSchedule[]> {
    return await db
      .select()
      .from(staffSchedules)
      .where(eq(staffSchedules.plannerEntryId, plannerEntryId));
  }

  async createStaffSchedule(insertSchedule: InsertStaffSchedule): Promise<StaffSchedule> {
    const [schedule] = await db.insert(staffSchedules).values(insertSchedule).returning();
    return schedule;
  }

  async updateStaffSchedule(id: number, updateSchedule: Partial<InsertStaffSchedule>): Promise<StaffSchedule> {
    const [schedule] = await db
      .update(staffSchedules)
      .set(updateSchedule)
      .where(eq(staffSchedules.id, id))
      .returning();
    return schedule;
  }

  async deleteStaffSchedule(id: number): Promise<void> {
    await db.delete(staffSchedules).where(eq(staffSchedules.id, id));
  }

  async getStoreAnalytics(storeId: number): Promise<StoreAnalytics[]> {
    return await db
      .select()
      .from(storeAnalytics)
      .where(eq(storeAnalytics.storeId, storeId))
      .orderBy(desc(storeAnalytics.month));
  }

  async createStoreAnalytics(insertAnalytics: InsertStoreAnalytics): Promise<StoreAnalytics> {
    const [analytics] = await db.insert(storeAnalytics).values(insertAnalytics).returning();
    return analytics;
  }
}

export const storage = new DatabaseStorage();
