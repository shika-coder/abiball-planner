import { prisma } from "@/lib/prisma";

const PRICE_STALENESS_DAYS = 60; // Flag prices not verified in 60 days

/**
 * Check if a location's price is stale (not verified recently)
 */
export async function isPriceStale(locationId: string): Promise<boolean> {
  const location = await prisma.location.findUnique({
    where: { id: locationId },
  });

  if (!location?.lastVerified) {
    return true; // Never verified
  }

  const daysSinceVerified = Math.floor(
    (Date.now() - location.lastVerified.getTime()) / (1000 * 60 * 60 * 24)
  );

  return daysSinceVerified > PRICE_STALENESS_DAYS;
}

/**
 * Get all stale prices
 */
export async function getStaleLocations(): Promise<
  Array<{ id: string; name: string; daysSinceVerified: number | null }>
> {
  const locations = await prisma.location.findMany({
    select: { id: true, name: true, lastVerified: true },
  });

  return locations
    .map((loc) => ({
      id: loc.id,
      name: loc.name,
      daysSinceVerified: loc.lastVerified
        ? Math.floor(
            (Date.now() - loc.lastVerified.getTime()) / (1000 * 60 * 60 * 24)
          )
        : null,
    }))
    .filter(
      (loc) =>
        !loc.daysSinceVerified || loc.daysSinceVerified > PRICE_STALENESS_DAYS
    );
}

/**
 * Update a location's price and record history
 */
export async function updateLocationPrice(
  locationId: string,
  newPrice: number,
  reason: string = "manual update",
  verifiedBy?: string
): Promise<void> {
  const location = await prisma.location.findUnique({
    where: { id: locationId },
  });

  if (!location) {
    throw new Error(`Location ${locationId} not found`);
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
}

/**
 * Mark a location's price as verified without changing it
 */
export async function verifyLocationPrice(
  locationId: string,
  verifiedBy?: string
): Promise<void> {
  await prisma.location.update({
    where: { id: locationId },
    data: { lastVerified: new Date() },
  });
}

/**
 * Get price history for a location
 */
export async function getPriceHistory(locationId: string) {
  return prisma.priceHistory.findMany({
    where: { locationId },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Get all prices with staleness info
 */
export async function getAllPricesWithStatus() {
  const locations = await prisma.location.findMany({
    select: {
      id: true,
      name: true,
      pricePerPerson: true,
      lastVerified: true,
    },
  });

  return locations.map((loc) => ({
    ...loc,
    daysSinceVerified: loc.lastVerified
      ? Math.floor(
          (Date.now() - loc.lastVerified.getTime()) / (1000 * 60 * 60 * 24)
        )
      : null,
    isStale: !loc.lastVerified
      ? true
      : Math.floor(
          (Date.now() - loc.lastVerified.getTime()) / (1000 * 60 * 60 * 24)
        ) > PRICE_STALENESS_DAYS,
  }));
}
