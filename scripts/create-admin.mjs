#!/usr/bin/env node

/**
 * Create Admin User Script
 *
 * Usage: node scripts/create-admin.mjs
 */

import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";

const prisma = new PrismaClient();

const EMAIL = "admin@abiball.de";
const PASSWORD = "AbiballAdmin2026!";
const NAME = "Admin User";

async function createAdmin() {
  try {
    // Check if admin already exists
    const existing = await prisma.admin.findUnique({
      where: { email: EMAIL },
    });

    if (existing) {
      console.log(`✅ Admin user already exists: ${EMAIL}`);
      console.log(`   Password: ${PASSWORD}`);
      return;
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(PASSWORD, 10);

    // Create admin
    const admin = await prisma.admin.create({
      data: {
        email: EMAIL,
        password: hashedPassword,
        name: NAME,
        role: "admin",
      },
    });

    console.log("✅ Admin user created successfully!");
    console.log("");
    console.log("Login Credentials:");
    console.log(`  Email:    ${EMAIL}`);
    console.log(`  Password: ${PASSWORD}`);
    console.log("");
    console.log("🔗 Access: http://localhost:3000/admin/login");
  } catch (error) {
    console.error("❌ Error creating admin:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
