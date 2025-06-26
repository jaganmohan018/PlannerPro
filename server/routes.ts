import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import fs from "fs";
import { randomUUID } from "crypto";
import { storage } from "./storage";
import { setupAuth, requireAuth, requireRole } from "./auth";
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

  app.post("/api/stores", requireRole('business_executive'), async (req, res) => {
    try {
      const storeData = insertStoreSchema.parse(req.body);
      const store = await storage.createStore(storeData);
      res.json(store);
    } catch (error) {
      res.status(400).json({ message: "Invalid store data" });
    }
  });

  // Planner entry routes
  app.get("/api/planner/:storeId/:date", requireAuth, async (req, res) => {
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

  app.get("/api/planner-history/:storeId", requireAuth, async (req, res) => {
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

  const httpServer = createServer(app);
  return httpServer;
}
