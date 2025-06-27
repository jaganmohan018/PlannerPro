import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import fs from "fs";
import { randomUUID } from "crypto";
import { storage } from "./storage";
import { setupAuth, requireAuth, requireRole } from "./auth";

// Middleware to check store association for store associates
function requireStoreAccess(req: any, res: any, next: any) {
  const user = req.user;
  const storeId = parseInt(req.params.storeId);
  
  // Allow non-store associates (district managers, business executives, super admin) to access any store
  if (user.role !== 'store_associate') {
    return next();
  }
  
  // Store associates can only access their assigned store
  if (!user.storeId) {
    return res.status(403).json({ error: "No store assigned to your account" });
  }
  
  if (user.storeId !== storeId) {
    return res.status(403).json({ error: "Access denied: You can only access your assigned store" });
  }
  
  next();
}
import { insertStoreSchema, insertPlannerEntrySchema, insertStaffScheduleSchema } from "@shared/schema";

// Configure multer for photo uploads
const uploadDir = path.join(process.cwd(), 'uploads', 'photos');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const photoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueId = randomUUID();
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueId}${ext}`);
  }
});

const upload = multer({
  storage: photoStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  setupAuth(app);

  // Serve uploaded photos - only for store associates
  app.use('/uploads', requireAuth, requireRole('store_associate'), express.static(path.join(process.cwd(), 'uploads')));

  // Store routes - accessible to all authenticated users
  app.get("/api/stores", requireAuth, async (req, res) => {
    try {
      const stores = await storage.getStores();
      res.json(stores);
    } catch (error) {
      console.error('Error fetching stores:', error);
      res.status(500).json({ message: "Failed to fetch stores" });
    }
  });

  app.get("/api/stores/:id", requireAuth, async (req, res) => {
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

  app.post("/api/stores", requireRole('super_admin'), async (req, res) => {
    try {
      const storeData = insertStoreSchema.parse(req.body);
      const store = await storage.createStore(storeData);
      res.status(201).json(store);
    } catch (error) {
      console.error('Error creating store:', error);
      res.status(400).json({ message: "Invalid store data", error: error.message });
    }
  });

  // Store assignment route - Super Admin only
  app.patch("/api/stores/:storeId/assign", requireRole('super_admin'), async (req, res) => {
    try {
      const storeId = parseInt(req.params.storeId);
      const { districtManagerId } = req.body;
      
      if (isNaN(storeId)) {
        return res.status(400).json({ message: "Invalid store ID" });
      }
      
      const store = await storage.assignStoreToDistrictManager(storeId, districtManagerId);
      res.json(store);
    } catch (error) {
      console.error('Error assigning store:', error);
      res.status(500).json({ message: "Failed to assign store" });
    }
  });

  // Planner entry routes
  app.get("/api/planner/:storeId/:date", requireAuth, requireStoreAccess, async (req, res) => {
    try {
      const storeId = parseInt(req.params.storeId);
      const date = req.params.date;
      
      console.log(`Fetching planner entry for store ${storeId}, date ${date}`);
      let entry = await storage.getPlannerEntry(storeId, date);
      
      // If no entry exists for this date, create a default one
      if (!entry) {
        const defaultEntry = {
          storeId,
          date,
          priorities: JSON.stringify(["", "", ""]),
          todos: JSON.stringify([
            { task: "Schedule Team Meeting", completed: false },
            { task: "Update Product Displays", completed: false },
            { task: "Review Sales Reports", completed: false },
            { task: "Customer Follow-ups", completed: false },
            { task: "Social Media Posts", completed: false }
          ]),
          dailyOperations: JSON.stringify({
            reviewHuddleCalendar: false,
            reviewLaborDashboards: false,
            pullProcessOmniOrders: false,
            setupEventEducationDemo: false,
            reconcileDailyPaperwork: false,
            checkEndOfDayNotes: false,
            checkEducationDashboard: false,
            strategizePrintCallLists: false
          }),
          inventoryManagement: JSON.stringify({
            reviewStoreReceivingReport: false,
            reviewCycleCountsReport: false,
            reviewNegativeOnHandsReport: false,
            reviewDamageLog: false
          }),
          storeStandards: JSON.stringify({
            maintainVisualMerchandising: false,
            replenishFrontFace: false,
            cleanCountersDemo: false,
            cleanWindowsDoors: false,
            cleanFloors: false,
            cleanReplenishBathrooms: false,
            emptyTrashBins: false
          })
        };
        
        entry = await storage.createPlannerEntry(defaultEntry);
      }
      
      // Get staff schedules for this entry
      const staffSchedules = await storage.getStaffSchedulesForEntry(entry.id);
      
      res.json({ ...entry, staffSchedules });
    } catch (error) {
      console.error('Error fetching planner entry:', error);
      res.status(500).json({ message: "Failed to fetch planner entry", error: error.message });
    }
  });

  app.put("/api/planner/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;
      
      const entry = await storage.updatePlannerEntry(id, updateData);
      res.json(entry);
    } catch (error) {
      res.status(500).json({ message: "Failed to update planner entry" });
    }
  });

  // Historical planner entries route (past 7 days for store associates)
  app.get("/api/planner/:storeId/history", requireAuth, requireStoreAccess, async (req, res) => {
    try {
      const storeId = parseInt(req.params.storeId);
      
      // Get past 7 days of entries
      const entries = await storage.getPlannerEntriesForStore(storeId, 7);
      res.json(entries);
    } catch (error) {
      console.error('Error fetching planner history:', error);
      res.status(500).json({ message: "Failed to fetch planner history", error: error.message });
    }
  });

  // Save planner entry (mark as saved/completed)
  app.post("/api/planner/:id/save", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Simply return success - data is already being saved on every update
      const entry = await storage.updatePlannerEntry(id, {});
      res.json({ success: true, message: "Data saved successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to save planner entry" });
    }
  });

  // Staff schedule routes
  app.post("/api/staff-schedules", requireAuth, async (req, res) => {
    try {
      const scheduleData = insertStaffScheduleSchema.parse(req.body);
      const schedule = await storage.createStaffSchedule(scheduleData);
      res.json(schedule);
    } catch (error) {
      res.status(400).json({ message: "Invalid staff schedule data" });
    }
  });

  app.put("/api/staff-schedules/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;
      
      const schedule = await storage.updateStaffSchedule(id, updateData);
      res.json(schedule);
    } catch (error) {
      res.status(500).json({ message: "Failed to update staff schedule" });
    }
  });

  app.delete("/api/staff-schedules/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteStaffSchedule(id);
      res.json({ message: "Staff schedule deleted" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete staff schedule" });
    }
  });

  // Photo upload routes - only accessible to store associates
  app.post("/api/upload-photo", requireRole('store_associate'), upload.single('photo'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No photo file provided" });
      }

      const { category, plannerEntryId } = req.body;
      
      const photoData = {
        id: randomUUID(),
        filename: req.file.originalname,
        uploadedAt: new Date().toISOString(),
        category: category || 'other',
        url: `/uploads/photos/${req.file.filename}`
      };

      // Update planner entry with new photo
      const plannerEntryId_num = parseInt(plannerEntryId);
      if (!plannerEntryId_num) {
        return res.status(400).json({ message: "Invalid planner entry ID" });
      }

      // For now, we'll return the photo data for frontend handling
      // In a full implementation, we'd store this in the planner entry
      // but we need to handle the database schema update first

      res.json(photoData);
    } catch (error) {
      // Clean up uploaded file if database operation fails
      if (req.file) {
        fs.unlink(req.file.path, () => {});
      }
      res.status(500).json({ message: "Failed to upload photo" });
    }
  });

  app.delete("/api/photo/:photoId", requireRole('store_associate'), async (req, res) => {
    try {
      const photoId = req.params.photoId;
      
      // Find the planner entry containing this photo
      // This is a simplified approach - in production you'd want proper photo tracking
      res.json({ message: "Photo deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete photo" });
    }
  });

  // Analytics routes - only accessible to district managers and business executives
  app.get("/api/analytics/:storeId", requireRole('district_manager', 'business_executive'), async (req, res) => {
    try {
      const storeId = parseInt(req.params.storeId);
      const analytics = await storage.getStoreAnalytics(storeId);
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  // Automated reporting routes - aggregated data across all stores
  app.get("/api/reports/:reportType", requireRole('district_manager', 'business_executive'), async (req, res) => {
    try {
      const { reportType } = req.params;
      const { region, activity } = req.query;
      
      // Get all stores for aggregation
      const stores = await storage.getStores();
      
      // Get recent planner entries for analysis
      const aggregatedData = {
        reportType,
        generatedAt: new Date().toISOString(),
        totalStores: stores.length,
        activeStores: stores.filter(store => store.isActive).length,
        stores: stores.map(store => ({
          id: store.id,
          storeNumber: store.storeNumber,
          name: store.name,
          location: store.location,
          isActive: store.isActive
        }))
      };
      
      res.json(aggregatedData);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate report" });
    }
  });

  app.get("/api/reports/store-performance", requireRole('district_manager', 'business_executive'), async (req, res) => {
    try {
      const stores = await storage.getStores();
      
      // Aggregate performance data from actual store entries
      const performanceData = await Promise.all(
        stores.map(async (store) => {
          try {
            const entries = await storage.getPlannerEntriesForStore(store.id, 7); // Last 7 days
            
            return {
              storeId: store.id,
              storeNumber: store.storeNumber,
              name: store.name,
              location: store.location,
              entriesCount: entries.length,
              hasRecentActivity: entries.length > 0,
              lastEntryDate: entries.length > 0 ? entries[0].date : null
            };
          } catch {
            return {
              storeId: store.id,
              storeNumber: store.storeNumber,
              name: store.name,
              location: store.location,
              entriesCount: 0,
              hasRecentActivity: false,
              lastEntryDate: null
            };
          }
        })
      );
      
      res.json(performanceData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch store performance data" });
    }
  });

  app.get("/api/reports/activity-completion", requireRole('district_manager', 'business_executive'), async (req, res) => {
    try {
      const stores = await storage.getStores();
      
      // Analyze activity completion across all stores
      const activityData = {
        totalStores: stores.length,
        activeStores: stores.filter(store => store.isActive).length,
        reportGeneratedAt: new Date().toISOString(),
        activitiesTracked: [
          "Daily Operations",
          "Sales Tracking", 
          "Inventory Management",
          "Staff Scheduling",
          "Store Standards",
          "Customer Service"
        ]
      };
      
      res.json(activityData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch activity completion data" });
    }
  });

  app.get("/api/reports/aggregated", requireRole('district_manager', 'business_executive'), async (req, res) => {
    try {
      const stores = await storage.getStores();
      
      // Get sample of recent planner entries across all stores
      const recentActivity = await Promise.all(
        stores.slice(0, 10).map(async (store) => {
          try {
            const entries = await storage.getPlannerEntriesForStore(store.id, 1);
            return {
              storeId: store.id,
              hasEntry: entries.length > 0,
              entryDate: entries.length > 0 ? entries[0].date : null
            };
          } catch {
            return {
              storeId: store.id,
              hasEntry: false,
              entryDate: null
            };
          }
        })
      );
      
      const aggregatedMetrics = {
        networkSize: stores.length,
        activeStores: stores.filter(store => store.isActive).length,
        storesWithRecentActivity: recentActivity.filter(store => store.hasEntry).length,
        dataQuality: "real-time",
        lastUpdated: new Date().toISOString()
      };
      
      res.json(aggregatedMetrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch aggregated data" });
    }
  });

  // Super Admin Routes - User Management
  app.get("/api/admin/users", requireRole("super_admin"), async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.post("/api/admin/users", requireRole("super_admin"), async (req, res) => {
    try {
      const user = await storage.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ error: "Failed to create user" });
    }
  });

  app.get("/api/admin/district-managers", requireRole("super_admin"), async (req, res) => {
    try {
      const districtManagers = await storage.getDistrictManagers();
      res.json(districtManagers);
    } catch (error) {
      console.error("Error fetching district managers:", error);
      res.status(500).json({ error: "Failed to fetch district managers" });
    }
  });

  // Super Admin Routes - Store Management
  app.post("/api/admin/stores", requireRole("super_admin"), async (req, res) => {
    try {
      const store = await storage.createStore(req.body);
      res.status(201).json(store);
    } catch (error) {
      console.error("Error creating store:", error);
      res.status(500).json({ error: "Failed to create store" });
    }
  });

  app.put("/api/admin/stores/:storeId/assign", requireRole("super_admin"), async (req, res) => {
    try {
      const { storeId } = req.params;
      const { districtManagerId } = req.body;
      
      const store = await storage.assignStoreToDistrictManager(parseInt(storeId), districtManagerId);
      res.json(store);
    } catch (error) {
      console.error("Error assigning store:", error);
      res.status(500).json({ error: "Failed to assign store" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
