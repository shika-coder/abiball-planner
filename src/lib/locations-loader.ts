/**
 * Dynamic Locations Loader
 *
 * Combines:
 * - Static venues (hardcoded in locations.ts)
 * - Dynamic venues (from automatic sync)
 *
 * In production, this would load from database
 * For now, it merges static + dynamically discovered venues
 */

import { locations as staticLocations } from "@/data/locations";

// In production, dynamically discovered venues would come from database
// For MVP, we keep them in a separate file that gets updated by sync script

let dynamicLocations: any[] = [];

/**
 * Get all venues (static + dynamic)
 */
export function getAllLocations() {
  return [...staticLocations, ...dynamicLocations];
}

/**
 * Register dynamically discovered venues
 */
export function registerDynamicLocations(venues: any[]) {
  dynamicLocations = venues;
}

/**
 * Get only static venues
 */
export function getStaticLocations() {
  return staticLocations;
}

/**
 * Get only dynamic venues
 */
export function getDynamicLocations() {
  return dynamicLocations;
}

/**
 * Get count of all venues
 */
export function getVenueCount() {
  return staticLocations.length + dynamicLocations.length;
}
