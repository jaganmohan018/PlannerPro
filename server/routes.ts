import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated, requireRole, requireStoreAccess } from "./auth";
import { insertStoreSchema, insertPlannerEntrySchema, insertStaffScheduleSchema, insertUserSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Admin routes - User management
  app.get("/api/admin/users", isAuthenticated, requireRole(['admin']), async (req, res) => {
    try {
      const { role } = req.query;
      const users = role ? await storage.getUsersByRole(role as string) : await storage.getUsersByRole('store_associate');
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.put("/api/admin/users/:userId/role", isAuthenticated, requireRole(['admin']), async (req, res) => {
    try {
      const { userId } = req.params;
      const { role, storeId } = req.body;
      const user = await storage.updateUserRole(userId, role, storeId);
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user role" });
    }
  });

  app.post("/api/admin/store-assignments", isAuthenticated, requireRole(['admin']), async (req, res) => {
    try {
      const assignment = await storage.addStoreAssignment(req.body);
      res.json(assignment);
    } catch (error) {
      res.status(500).json({ message: "Failed to create store assignment" });
    }
  });

  // Store routes with role-based access
  app.get("/api/stores", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const dbUser = await storage.getUser(userId);
      if (!dbUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const stores = await storage.getStoresForUser(userId, dbUser.role);
      res.json(stores);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stores" });
    }
  });

  app.get("/api/stores/:id", isAuthenticated, requireStoreAccess('id'), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const store = await storage.getStore(id);
      if (!store) {
        return res.status(404).json({ message: "Store not found" });
      }
      res.json(store);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch store" });
    }
  });

  app.post("/api/stores", isAuthenticated, requireRole(['admin']), async (req, res) => {
    try {
      const storeData = insertStoreSchema.parse(req.body);
      const store = await storage.createStore(storeData);
      res.json(store);
    } catch (error) {
      res.status(400).json({ message: "Invalid store data" });
    }
  });

  // Planner entry routes with role-based access
  app.get("/api/planner/:storeId/:date", isAuthenticated, requireStoreAccess('storeId'), async (req, res) => {
    try {
      const storeId = parseInt(req.params.storeId);
      const date = req.params.date;
      
      let entry = await storage.getPlannerEntry(storeId, date);
      
      // If no entry exists for this date, create a default one
      if (!entry) {
        const defaultEntry = {
          storeId,
          date,
          priorities: ["", "", ""],
          todos: [
            { task: "Schedule Team Meeting", completed: false },
            { task: "Update Product Displays", completed: false },
            { task: "Review Sales Reports", completed: false },
            { task: "Customer Follow-ups", completed: false },
            { task: "Social Media Posts", completed: false }
          ],
          dailyOperations: {
            storeOpening: false,
            tillCount: false,
            staffMeeting: false,
            customerService: false,
            displayMaintenance: false,
            safetyCheck: false
          },
          inventoryManagement: {
            stockLevelReview: false,
            reorderProcessing: false,
            newArrivals: false,
            expiryMonitoring: false
          },
          storeStandards: {
            visualMerchandising: false,
            cleanliness: false,
            productOrganization: false,
            signageUpdates: false
          }
        };
        
        entry = await storage.createPlannerEntry(defaultEntry);
      }
      
      // Get staff schedules for this entry
      const staffSchedules = await storage.getStaffSchedulesForEntry(entry.id);
      
      res.json({ ...entry, staffSchedules });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch planner entry" });
    }
  });

  app.put("/api/planner/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;
      
      const entry = await storage.updatePlannerEntry(id, updateData);
      res.json(entry);
    } catch (error) {
      res.status(500).json({ message: "Failed to update planner entry" });
    }
  });

  app.get("/api/planner-history/:storeId", async (req, res) => {
    try {
      const storeId = parseInt(req.params.storeId);
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 30;
      
      const entries = await storage.getPlannerEntriesForStore(storeId, limit);
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch planner history" });
    }
  });

  // Staff schedule routes
  app.post("/api/staff-schedules", async (req, res) => {
    try {
      const scheduleData = insertStaffScheduleSchema.parse(req.body);
      const schedule = await storage.createStaffSchedule(scheduleData);
      res.json(schedule);
    } catch (error) {
      res.status(400).json({ message: "Invalid staff schedule data" });
    }
  });

  app.put("/api/staff-schedules/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;
      
      const schedule = await storage.updateStaffSchedule(id, updateData);
      res.json(schedule);
    } catch (error) {
      res.status(500).json({ message: "Failed to update staff schedule" });
    }
  });

  app.delete("/api/staff-schedules/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteStaffSchedule(id);
      res.json({ message: "Staff schedule deleted" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete staff schedule" });
    }
  });

  // Analytics routes
  app.get("/api/analytics/:storeId", async (req, res) => {
    try {
      const storeId = parseInt(req.params.storeId);
      const analytics = await storage.getStoreAnalytics(storeId);
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
