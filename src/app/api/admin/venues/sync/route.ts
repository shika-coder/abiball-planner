import { NextRequest, NextResponse } from "next/server";
import { syncVenues, mergeVenues, logSyncOperation } from "@/lib/venue-sync";
import { locations } from "@/data/locations";
import { requireAdminAuth } from "@/lib/admin-auth";

/**
 * GET /api/admin/venues/sync
 * Returns current sync status and venue count
 */
async function handleGet(request: NextRequest) {
  try {
    await requireAdminAuth(request);

    return NextResponse.json({
      status: "ok",
      currentVenueCount: locations.length,
      lastSync: null, // Would come from database in production
      availableDaysUntilNextSync: 1,
    });
  } catch {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
}

/**
 * POST /api/admin/venues/sync
 * Triggers venue sync process
 */
async function handlePost(request: NextRequest) {
  try {
    await requireAdminAuth(request);

    const body = await request.json().catch(() => ({}));
    const dryRun = body.dryRun === true;

    // Run sync
    const result = await syncVenues(locations);
    logSyncOperation(result);

    if (dryRun) {
      // In dry-run mode, just return what would be synced
      return NextResponse.json({
        dryRun: true,
        ...result,
        message: "Dry run completed - no venues were actually added",
      });
    }

    // In production, would merge venues and save to database
    // For now, just return the result
    if (result.enrichedVenues.length > 0) {
      const merged = mergeVenues(locations, result.enrichedVenues);

      return NextResponse.json({
        success: true,
        message: `✅ Synced ${result.enrichedVenues.length} new venues`,
        totalVenues: merged.length,
        ...result,
      });
    }

    return NextResponse.json({
      success: true,
      message: "No new venues found",
      totalVenues: locations.length,
      ...result,
    });
  } catch (error) {
    console.error("[API] Venue sync error:", error);
    return NextResponse.json(
      {
        error: "Sync failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export const POST = handlePost;
export const GET = handleGet;
