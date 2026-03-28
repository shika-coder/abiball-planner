#!/usr/bin/env node

/**
 * Price Update Script
 * Usage:
 *   node update-prices.mjs --location <id> --price <amount> --reason "reason"
 *   node update-prices.mjs --file prices.csv
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { parse } from "csv-parse/sync";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Import Prisma - adjust path as needed for your project
const prismaPath = path.join(__dirname, "../lib/prisma.ts");

async function updatePrice(locationId, newPrice, reason, verifiedBy) {
  try {
    // Dynamic import of prisma module
    const module = await import("@/lib/prisma");
    const prisma = module.default;

    const location = await prisma.location.findUnique({
      where: { id: locationId },
    });

    if (!location) {
      console.error(`❌ Location ${locationId} not found`);
      return false;
    }

    // Record price change
    await prisma.priceHistory.create({
      data: {
        locationId,
        oldPrice: location.pricePerPerson,
        newPrice,
        reason,
        verifiedBy,
      },
    });

    // Update location
    await prisma.location.update({
      where: { id: locationId },
      data: {
        pricePerPerson: newPrice,
        lastVerified: new Date(),
      },
    });

    console.log(
      `✓ ${location.name}: €${location.pricePerPerson} → €${newPrice}`
    );
    return true;
  } catch (error) {
    console.error(`Error updating ${locationId}:`, error.message);
    return false;
  }
}

async function updateFromCsv(filePath, verifiedBy) {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const records = parse(content, {
      columns: true,
      skip_empty_lines: true,
    });

    let updated = 0;
    for (const record of records) {
      const { locationId, price, reason } = record;

      if (!locationId || !price) {
        console.warn(
          `⚠ Skipping record with missing locationId or price:`,
          record
        );
        continue;
      }

      const success = await updatePrice(
        locationId,
        parseFloat(price),
        reason || "csv bulk update",
        verifiedBy
      );
      if (success) updated++;
    }

    console.log(`\n📊 Updated ${updated}/${records.length} prices`);
  } catch (error) {
    console.error("Error reading CSV:", error.message);
  }
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
📋 Price Update Script

Usage:
  node update-prices.mjs --location <id> --price <amount> [--reason "reason"] [--verified-by "email"]
  node update-prices.mjs --file <path.csv> [--verified-by "email"]

Examples:
  node update-prices.mjs --location cch-congress-center-hamburg --price 135 --reason "venue update"
  node update-prices.mjs --file prices.csv --verified-by admin@example.com

CSV Format:
  locationId,price,reason
  cch-congress-center-hamburg,135,venue update
  fischauktionshalle-hamburg,86,market adjustment
    `);
    return;
  }

  // Parse arguments
  let mode = null;
  let locationId = null;
  let price = null;
  let reason = "manual update";
  let filePath = null;
  let verifiedBy = null;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--location") {
      mode = "single";
      locationId = args[++i];
    } else if (args[i] === "--price") {
      price = parseFloat(args[++i]);
    } else if (args[i] === "--reason") {
      reason = args[++i];
    } else if (args[i] === "--file") {
      mode = "csv";
      filePath = args[++i];
    } else if (args[i] === "--verified-by") {
      verifiedBy = args[++i];
    }
  }

  if (mode === "single") {
    if (!locationId || !price) {
      console.error(
        "❌ Missing required arguments: --location and --price"
      );
      process.exit(1);
    }
    await updatePrice(locationId, price, reason, verifiedBy);
  } else if (mode === "csv") {
    if (!filePath) {
      console.error("❌ Missing required argument: --file");
      process.exit(1);
    }
    await updateFromCsv(filePath, verifiedBy);
  }
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
