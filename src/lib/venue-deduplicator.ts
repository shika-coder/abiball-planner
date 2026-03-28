/**
 * Venue Deduplicator
 *
 * Removes duplicate venues by:
 * 1. Exact name + address match
 * 2. Name similarity (Levenshtein distance)
 * 3. Address proximity
 */

import type { Location } from "@/types/location";
import type { RawVenue } from "./venue-scraper";

/**
 * Levenshtein distance - similarity between two strings
 * Returns: 0 (identical) to 1.0 (completely different)
 */
function levenshteinSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();

  if (s1 === s2) return 1.0;

  const len1 = s1.length;
  const len2 = s2.length;

  if (len1 === 0 || len2 === 0) return 0;

  const matrix: number[][] = [];

  for (let i = 0; i <= len2; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= len1; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= len2; i++) {
    for (let j = 1; j <= len1; j++) {
      const cost = s2[i - 1] === s1[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i][j - 1] + 1, // insertion
        matrix[i - 1][j] + 1, // deletion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }

  const distance = matrix[len2][len1];
  const maxLength = Math.max(len1, len2);
  return 1 - distance / maxLength;
}

/**
 * Extract city name from address
 */
function extractCity(address: string): string {
  // Try to get last part of address (usually city)
  const parts = address.split(",").map((p) => p.trim());
  return parts[parts.length - 1] || address;
}

/**
 * Normalize address for comparison (remove numbers, extra spaces)
 */
function normalizeAddress(address: string): string {
  return address
    .toLowerCase()
    .replace(/\d+[a-z]?/g, "") // Remove house numbers
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Check if two addresses are similar
 */
function addressesSimilar(addr1: string, addr2: string, threshold = 0.85): boolean {
  const norm1 = normalizeAddress(addr1);
  const norm2 = normalizeAddress(addr2);
  return levenshteinSimilarity(norm1, norm2) > threshold;
}

/**
 * Check if a new venue is a duplicate of an existing one
 */
function isDuplicate(
  newVenue: RawVenue,
  existingVenue: Location,
  nameSimilarityThreshold = 0.8
): boolean {
  // Exact name match (case-insensitive)
  if (newVenue.name.toLowerCase() === existingVenue.name.toLowerCase()) {
    return true;
  }

  // Name similarity check
  const nameSimilarity = levenshteinSimilarity(newVenue.name, existingVenue.name);
  if (nameSimilarity > nameSimilarityThreshold) {
    // If names are very similar, check address
    if (
      addressesSimilar(newVenue.address, existingVenue.address, 0.7)
    ) {
      return true;
    }
  }

  // Address exact match
  if (addressesSimilar(newVenue.address, existingVenue.address, 0.95)) {
    return true;
  }

  return false;
}

/**
 * Deduplicates new venues against existing venues
 * Returns only truly new venues
 */
export function deduplicateVenues(
  newVenues: RawVenue[],
  existingVenues: Location[]
): { newVenues: RawVenue[]; duplicates: RawVenue[] } {
  const duplicates: RawVenue[] = [];
  const unique: RawVenue[] = [];

  for (const newVenue of newVenues) {
    let isDup = false;

    // Check against all existing venues
    for (const existing of existingVenues) {
      if (isDuplicate(newVenue, existing)) {
        isDup = true;
        duplicates.push(newVenue);
        break;
      }
    }

    // Check against already processed new venues (to avoid dups within the batch)
    if (!isDup) {
      const dupInBatch = unique.find((v) => {
        // Simple check: if names are very similar and in same city, likely duplicate
        const nameSim = levenshteinSimilarity(v.name, newVenue.name);
        return (
          nameSim > 0.9 &&
          (v.city === newVenue.city || !v.city || !newVenue.city)
        );
      });

      if (dupInBatch) {
        duplicates.push(newVenue);
        isDup = true;
      }
    }

    if (!isDup) {
      unique.push(newVenue);
    }
  }

  console.log(
    `[Deduplicator] Found ${newVenues.length} venues, ${unique.length} unique, ${duplicates.length} duplicates`
  );

  return { newVenues: unique, duplicates };
}

/**
 * Generates a unique ID from venue name and city
 */
export function generateVenueId(name: string, city: string): string {
  return `${city.toLowerCase()}-${name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")}`;
}
