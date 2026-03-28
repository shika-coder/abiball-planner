import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminAuth, successResponse, errorResponse } from "@/lib/admin-helpers";
import {
  updateLocationPrice,
  verifyLocationPrice,
  getStaleLocations,
  getPriceHistory,
  getAllPricesWithStatus,
} from "@/lib/price-tracking";

/**
 * GET /api/admin/prices
 * Get all locations with price status (stale detection)
 */
export async function GET(request: NextRequest) {
  const adminAuth = await requireAdminAuth(request);
  if (adminAuth instanceof NextResponse) return adminAuth;

  try {
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get("action");
    const locationId = searchParams.get("locationId");

    // Get price history for a specific location
    if (action === "history" && locationId) {
      const history = await getPriceHistory(locationId);
      return successResponse({ history });
    }

    // Get all stale prices
    if (action === "stale") {
      const stale = await getStaleLocations();
      return successResponse({
        count: stale.length,
        locations: stale,
      });
    }

    // Get all prices with status
    const allPrices = await getAllPricesWithStatus();
    return successResponse({
      count: allPrices.length,
      prices: allPrices,
    });
  } catch (error) {
    console.error("Fetch prices error:", error);
    return errorResponse("Failed to fetch prices", 500);
  }
}

/**
 * POST /api/admin/prices
 * Update price and record history
 */
export async function POST(request: NextRequest) {
  const adminAuth = await requireAdminAuth(request);
  if (adminAuth instanceof NextResponse) return adminAuth;

  try {
    const body = (await request.json()) as Record<string, any>;
    const { locationId, newPrice, reason, verifiedBy } = body;

    if (!locationId || newPrice === undefined) {
      return errorResponse("locationId and newPrice are required", 400);
    }

    if (isNaN(newPrice) || newPrice < 0) {
      return errorResponse("newPrice must be a valid positive number", 400);
    }

    const location = await prisma.location.findUnique({
      where: { id: locationId },
    });

    if (!location) {
      return errorResponse("Location not found", 404);
    }

    await updateLocationPrice(
      locationId,
      newPrice,
      reason || "manual update",
      verifiedBy
    );

    return successResponse({
      message: "Price updated successfully",
      location: {
        id: locationId,
        name: location.name,
        oldPrice: location.pricePerPerson,
        newPrice,
      },
    });
  } catch (error) {
    console.error("Update price error:", error);
    return errorResponse("Failed to update price", 500);
  }
}

/**
 * PUT /api/admin/prices
 * Mark price as verified without changing it
 */
export async function PUT(request: NextRequest) {
  const adminAuth = await requireAdminAuth(request);
  if (adminAuth instanceof NextResponse) return adminAuth;

  try {
    const body = (await request.json()) as Record<string, any>;
    const { locationId, verifiedBy } = body;

    if (!locationId) {
      return errorResponse("locationId is required", 400);
    }

    const location = await prisma.location.findUnique({
      where: { id: locationId },
    });

    if (!location) {
      return errorResponse("Location not found", 404);
    }

    await verifyLocationPrice(locationId, verifiedBy);

    return successResponse({
      message: "Price verified successfully",
      location: {
        id: locationId,
        name: location.name,
        pricePerPerson: location.pricePerPerson,
      },
    });
  } catch (error) {
    console.error("Verify price error:", error);
    return errorResponse("Failed to verify price", 500);
  }
}
