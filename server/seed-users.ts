import { storage } from "./storage";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function seedUsers() {
  try {
    console.log("Creating test users for different roles...");

    // Store Associate
    const storeAssociatePassword = await hashPassword("password123");
    await storage.createUser({
      username: "store_associate",
      password: storeAssociatePassword,
      email: "associate@saloncentric.com",
      firstName: "Sarah",
      lastName: "Johnson",
      role: "store_associate",
      storeId: 1, // Associated with Beverly Hills store
    });
    console.log("✓ Store Associate user created (username: store_associate, password: password123)");

    // District Manager
    const districtManagerPassword = await hashPassword("password123");
    await storage.createUser({
      username: "district_manager",
      password: districtManagerPassword,
      email: "manager@saloncentric.com",
      firstName: "Michael",
      lastName: "Davis",
      role: "district_manager",
      storeId: null, // Can access multiple stores
    });
    console.log("✓ District Manager user created (username: district_manager, password: password123)");

    // Business Executive
    const executivePassword = await hashPassword("password123");
    await storage.createUser({
      username: "business_executive",
      password: executivePassword,
      email: "executive@saloncentric.com",
      firstName: "Jennifer",
      lastName: "Smith",
      role: "business_executive",
      storeId: null, // Can access all stores and analytics
    });
    console.log("✓ Business Executive user created (username: business_executive, password: password123)");

    // Super Admin
    const superAdminPassword = await hashPassword("password123");
    await storage.createUser({
      username: "super_admin",
      password: superAdminPassword,
      email: "admin@saloncentric.com",
      firstName: "System",
      lastName: "Administrator",
      role: "super_admin",
      storeId: null, // Can manage all users and stores
    });
    console.log("✓ Super Admin user created (username: super_admin, password: password123)");

    console.log("\nTest users created successfully!");
    console.log("You can now log in with any of these accounts to test different role permissions.");
    
  } catch (error) {
    console.error("Error creating test users:", error);
  }
}

export { seedUsers };

// Run the seed function
seedUsers();