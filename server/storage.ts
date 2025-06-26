import { 
  stores, 
  plannerEntries, 
  staffSchedules, 
  storeAnalytics, 
  users, 
  userStoreAssignments,
  type Store, 
  type InsertStore, 
  type PlannerEntry, 
  type InsertPlannerEntry, 
  type StaffSchedule, 
  type InsertStaffSchedule, 
  type StoreAnalytics, 
  type InsertStoreAnalytics,
  type User,
  type UpsertUser,
  type UserStoreAssignment,
  type InsertUserStoreAssignment
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, inArray } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Role-based user management
  getUsersByRole(role: string): Promise<User[]>;
  updateUserRole(userId: string, role: string, storeId?: number): Promise<User>;
  getStoreAssignments(userId: string): Promise<UserStoreAssignment[]>;
  addStoreAssignment(assignment: InsertUserStoreAssignment): Promise<UserStoreAssignment>;
  removeStoreAssignment(userId: string, storeId: number): Promise<void>;
  
  // Store operations (with access control)
  getStores(): Promise<Store[]>;
  getStoresForUser(userId: string, userRole: string): Promise<Store[]>;
  getStore(id: number): Promise<Store | undefined>;
  createStore(store: InsertStore): Promise<Store>;
  
  // Planner entry operations (with access control)
  getPlannerEntry(storeId: number, date: string): Promise<PlannerEntry | undefined>;
  getPlannerEntriesForStore(storeId: number, limit?: number): Promise<PlannerEntry[]>;
  getPlannerEntriesForUser(userId: string, userRole: string, limit?: number): Promise<PlannerEntry[]>;
  createPlannerEntry(entry: InsertPlannerEntry): Promise<PlannerEntry>;
  updatePlannerEntry(id: number, entry: Partial<InsertPlannerEntry>): Promise<PlannerEntry>;
  
  // Staff schedule operations
  getStaffSchedulesForEntry(plannerEntryId: number): Promise<StaffSchedule[]>;
  createStaffSchedule(schedule: InsertStaffSchedule): Promise<StaffSchedule>;
  updateStaffSchedule(id: number, schedule: Partial<InsertStaffSchedule>): Promise<StaffSchedule>;
  deleteStaffSchedule(id: number): Promise<void>;
  
  // Analytics operations (district managers and admins only)
  getStoreAnalytics(storeId: number): Promise<StoreAnalytics[]>;
  getMultiStoreAnalytics(storeIds: number[]): Promise<StoreAnalytics[]>;
  createStoreAnalytics(analytics: InsertStoreAnalytics): Promise<StoreAnalytics>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db.insert(users).values(userData).onConflictDoUpdate({
      target: users.id,
      set: {
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        updatedAt: new Date()
      }
    }).returning();
    return user;
  }

  // Role-based user management
  async getUsersByRole(role: string): Promise<User[]> {
    return await db.select().from(users).where(eq(users.role, role));
  }

  async updateUserRole(userId: string, role: string, storeId?: number): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ role, storeId, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async getStoreAssignments(userId: string): Promise<UserStoreAssignment[]> {
    return await db
      .select()
      .from(userStoreAssignments)
      .where(eq(userStoreAssignments.userId, userId));
  }

  async addStoreAssignment(assignment: InsertUserStoreAssignment): Promise<UserStoreAssignment> {
    const [result] = await db
      .insert(userStoreAssignments)
      .values(assignment)
      .returning();
    return result;
  }

  async removeStoreAssignment(userId: string, storeId: number): Promise<void> {
    await db
      .delete(userStoreAssignments)
      .where(
        and(
          eq(userStoreAssignments.userId, userId),
          eq(userStoreAssignments.storeId, storeId)
        )
      );
  }

  // Store operations with access control
  async getStores(): Promise<Store[]> {
    return await db.select().from(stores).where(eq(stores.isActive, true)).orderBy(stores.storeNumber);
  }

  async getStoresForUser(userId: string, userRole: string): Promise<Store[]> {
    if (userRole === "admin") {
      return this.getStores();
    }
    
    if (userRole === "store_associate") {
      const user = await this.getUser(userId);
      if (user?.storeId) {
        const store = await this.getStore(user.storeId);
        return store ? [store] : [];
      }
      return [];
    }
    
    if (userRole === "district_manager") {
      const assignments = await this.getStoreAssignments(userId);
      if (assignments.length === 0) return [];
      
      const storeIds = assignments.map(a => a.storeId);
      return await db.select().from(stores).where(inArray(stores.id, storeIds));
    }
    
    return [];
  }

  async getStore(id: number): Promise<Store | undefined> {
    const [store] = await db.select().from(stores).where(eq(stores.id, id));
    return store || undefined;
  }

  async createStore(insertStore: InsertStore): Promise<Store> {
    const [store] = await db.insert(stores).values(insertStore).returning();
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

  async getPlannerEntriesForUser(userId: string, userRole: string, limit = 30): Promise<PlannerEntry[]> {
    const userStores = await this.getStoresForUser(userId, userRole);
    if (userStores.length === 0) return [];
    
    const storeIds = userStores.map(store => store.id);
    return await db
      .select()
      .from(plannerEntries)
      .where(inArray(plannerEntries.storeId, storeIds))
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

  async getMultiStoreAnalytics(storeIds: number[]): Promise<StoreAnalytics[]> {
    if (storeIds.length === 0) return [];
    
    return await db
      .select()
      .from(storeAnalytics)
      .where(inArray(storeAnalytics.storeId, storeIds))
      .orderBy(desc(storeAnalytics.month));
  }

  async createStoreAnalytics(insertAnalytics: InsertStoreAnalytics): Promise<StoreAnalytics> {
    const [analytics] = await db.insert(storeAnalytics).values(insertAnalytics).returning();
    return analytics;
  }
}

export const storage = new DatabaseStorage();
