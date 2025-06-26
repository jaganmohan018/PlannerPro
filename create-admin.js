import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { db } from "./server/db.js";
import { users } from "./shared/schema.js";

const scryptAsync = promisify(scrypt);

async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
}

async function createAdmin() {
  try {
    const hashedPassword = await hashPassword("admin123");
    
    const adminUser = await db.insert(users).values({
      id: "1",
      username: "admin",
      password: hashedPassword,
      email: "admin@saloncentric.com",
      firstName: "Admin",
      lastName: "User",
      role: "admin"
    }).returning();
    
    console.log("Admin user created successfully:", adminUser[0]);
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin user:", error);
    process.exit(1);
  }
}

createAdmin();