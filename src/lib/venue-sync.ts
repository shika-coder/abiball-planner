/**
 * Venue Sync Manager
 *
 * Orchestrates the full venue discovery pipeline:
 * 1. Scrape new venues
 * 2. Deduplicate against existing venues
 * 3. Enrich with generated data
 * 4. Merge with existing data
 * 5. Log results
 */

import type { Location } from "@/types/location";
import { scrapeNewVenues } from "./venue-scraper";
import { deduplicateVenues } from "./venue-deduplicator";
import { enrichVenues } from "./venue-enricher";

export interface SyncResult {
  totalFetched: number;
  newVenuesFound: number;
  duplicatesSkipped: number;
  enrichedVenues: Location[];
  timestamp: string;
  errors: string[];
}

/**
 * Full sync pipeline
 */
export async function syncVenues(existingVenues: Location[]): Promise<SyncResult> {
  const result: SyncResult = {
    totalFetched: 0,
    newVenuesFound: 0,
    duplicatesSkipped: 0,
    enrichedVenues: [],
    timestamp: new Date().toISOString(),
    errors: [],
  };

  try {
    // Step 1: Scrape
    console.log("[Sync] Starting venue sync...");
    const rawVenues = await scrapeNewVenues();
    result.totalFetched = rawVenues.length;

    if (rawVenues.length === 0) {
      result.errors.push("No venues found from scraper");
      console.log("[Sync] No venues fetched from sources");
      return result;
    }

    // Step 2: Deduplicate
    const { newVenues, duplicates } = deduplicateVenues(rawVenues, existingVenues);
    result.newVenuesFound = newVenues.length;
    result.duplicatesSkipped = duplicates.length;

    if (newVenues.length === 0) {
      console.log("[Sync] No new venues found (all duplicates)");
      return result;
    }

    // Step 3: Enrich
    const enrichedVenues = enrichVenues(newVenues);
    result.enrichedVenues = enrichedVenues;

    // Step 4: Log success
    console.log(
      `[Sync] ✅ Sync complete: ${enrichedVenues.length} new venues added`
    );

    return result;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    result.errors.push(errorMsg);
    console.error("[Sync] ❌ Error during sync:", errorMsg);

    return result;
  }
}

/**
 * Merges new venues with existing venues, avoiding duplicates
 */
export function mergeVenues(existing: Location[], newVenues: Location[]): Location[] {
  const existingIds = new Set(existing.map((v) => v.id));

  // Only add new venues that don't already exist
  const toAdd = newVenues.filter((v) => !existingIds.has(v.id));

  return [...existing, ...toAdd];
}

/**
 * Logs sync operation to console (and could log to database)
 */
export function logSyncOperation(result: SyncResult): void {
  console.log("\n========== VENUE SYNC SUMMARY ==========");
  console.log(`Timestamp: ${result.timestamp}`);
  console.log(`Total fetched: ${result.totalFetched}`);
  console.log(`New venues: ${result.newVenuesFound}`);
  console.log(`Duplicates skipped: ${result.duplicatesSkipped}`);
  console.log(`Enriched venues: ${result.enrichedVenues.length}`);

  if (result.errors.length > 0) {
    console.log("Errors:");
    result.errors.forEach((err) => console.log(`  - ${err}`));
  }

  console.log("========================================\n");
}
