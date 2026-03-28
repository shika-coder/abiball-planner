/*
  Warnings:

  - Added the required column `email` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `schoolName` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "placementLabel" TEXT NOT NULL,
    "urgencyLabel" TEXT NOT NULL,
    "venueType" TEXT NOT NULL,
    "featuredBadge" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "minimumGuests" INTEGER NOT NULL,
    "pricePerPerson" REAL NOT NULL,
    "description" TEXT NOT NULL,
    "idealFor" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "bookingLink" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "contactPhone" TEXT NOT NULL,
    "features" TEXT NOT NULL,
    "includedServices" TEXT NOT NULL,
    "styleTags" TEXT NOT NULL,
    "images" TEXT NOT NULL,
    "schoolsBooked" INTEGER NOT NULL DEFAULT 0,
    "isPopularWithSchools" BOOLEAN NOT NULL DEFAULT false,
    "isQuicklyBooked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SocialProofMetric" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "locationId" TEXT NOT NULL,
    "schoolsBooked" INTEGER NOT NULL DEFAULT 0,
    "isPopularWithSchools" BOOLEAN NOT NULL DEFAULT false,
    "isQuicklyBooked" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Booking" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "locationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "schoolName" TEXT NOT NULL,
    "guests" INTEGER NOT NULL,
    "preferredDate" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Booking" ("createdAt", "guests", "id", "locationId", "preferredDate", "updatedAt", "userId") SELECT "createdAt", "guests", "id", "locationId", "preferredDate", "updatedAt", "userId" FROM "Booking";
DROP TABLE "Booking";
ALTER TABLE "new_Booking" RENAME TO "Booking";
CREATE INDEX "Booking_locationId_idx" ON "Booking"("locationId");
CREATE INDEX "Booking_email_idx" ON "Booking"("email");
CREATE INDEX "Booking_status_idx" ON "Booking"("status");
CREATE INDEX "Booking_createdAt_idx" ON "Booking"("createdAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE INDEX "Location_city_idx" ON "Location"("city");

-- CreateIndex
CREATE INDEX "Location_featured_idx" ON "Location"("featured");

-- CreateIndex
CREATE UNIQUE INDEX "SocialProofMetric_locationId_key" ON "SocialProofMetric"("locationId");
