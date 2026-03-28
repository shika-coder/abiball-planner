/**
 * Venue Scoring System
 *
 * Airbnb-style smart ranking:
 * Scores venues on multiple dimensions to provide intelligent recommendations
 *
 * Score components:
 * - Budget alignment
 * - Capacity match
 * - Feature matching
 * - Popularity/featured status
 * - Data quality
 */

import type { Location } from "@/types/location";
import type { Preferences } from "@/types/preferences";

export interface VenueScore {
  venueId: string;
  totalScore: number;
  matchPercent: number;
  budgetScore: number;
  capacityScore: number;
  featureScore: number;
  popularityScore: number;
  qualityScore: number;
  breakdown: string;
}

// Scoring constants
const BUDGET_PERFECT = 3;
const BUDGET_SLIGHT = 1;
const BUDGET_NONE = 0;

const CAPACITY_PERFECT = 3;
const CAPACITY_SLIGHT = 2;
const CAPACITY_POOR = 1;
const CAPACITY_NONE = 0;

const FEATURE_PER_MATCH = 1;

const POPULARITY_FEATURED = 2;
const POPULARITY_BONUS = 1;

const QUALITY_GOOD = 2;
const QUALITY_BASIC = 1;

/**
 * Calculate budget score
 */
function calculateBudgetScore(
  location: Location,
  preferences: Preferences
): number {
  const totalEstimate = location.pricePerPerson * preferences.guests;

  // Check against total budget if specified
  if (preferences.totalBudget > 0) {
    const diff = preferences.totalBudget - totalEstimate;
    if (diff >= 0) {
      // Within or under budget
      return BUDGET_PERFECT; // +3 points
    } else if (diff >= -preferences.totalBudget * 0.1) {
      // Within 10% over budget
      return BUDGET_SLIGHT; // +1 point
    } else {
      // Far over budget
      return BUDGET_NONE; // 0 points
    }
  }

  // Fallback to per-person budget
  if (location.pricePerPerson <= preferences.budgetPerPerson) {
    return BUDGET_PERFECT; // +3 points
  } else if (location.pricePerPerson <= preferences.budgetPerPerson * 1.15) {
    // Up to 15% over per-person budget
    return BUDGET_SLIGHT; // +1 point
  } else {
    return BUDGET_NONE; // 0 points
  }
}

/**
 * Calculate capacity score
 */
function calculateCapacityScore(
  location: Location,
  preferences: Preferences
): number {
  const hasCapacity = location.capacity >= preferences.guests;

  if (!hasCapacity) {
    return CAPACITY_NONE; // 0 points if can't fit guests
  }

  // Capacity is sufficient, now score based on how well it fits
  const ratio = location.capacity / preferences.guests;

  if (ratio <= 1.15) {
    // Perfect fit (15% overhead)
    return CAPACITY_PERFECT; // +3 points
  } else if (ratio <= 1.5) {
    // Good fit (50% overhead)
    return CAPACITY_SLIGHT; // +2 points
  } else {
    // Oversized but acceptable
    return CAPACITY_POOR; // +1 point
  }
}

/**
 * Count how many user preferences are matched by this venue
 */
function countFeatureMatches(location: Location, preferences: Preferences): number {
  let matches = 0;

  for (const feature of preferences.features) {
    // Check location features
    if (location.features.includes(feature as any)) {
      matches++;
      continue;
    }

    // Check style tags
    if (location.styleTags.includes(feature as any)) {
      matches++;
      continue;
    }

    // Special cases for feature matching
    if (feature === "Stage/Dancefloor") {
      if (
        location.features.includes("Stage / DJ equipment") ||
        location.features.includes("Dance floor")
      ) {
        matches++;
      }
      continue;
    }
  }

  return matches;
}

/**
 * Calculate feature match score
 */
function calculateFeatureScore(
  location: Location,
  preferences: Preferences
): number {
  const matches = countFeatureMatches(location, preferences);
  // +1 point per matching feature (capped at feature count)
  return Math.min(matches * FEATURE_PER_MATCH, preferences.features.length * 2);
}

/**
 * Calculate popularity score
 */
function calculatePopularityScore(location: Location): number {
  let score = 0;

  // Featured venues get boost
  if (location.featured) {
    score += POPULARITY_FEATURED; // +2 points
  }

  // Popular with schools (based on bookings)
  if (location.isPopularWithSchools) {
    score += POPULARITY_BONUS; // +1 point
  }

  // New venues get slight random boost to encourage discovery
  if (location.placementLabel === "Neu") {
    score += Math.random() * 0.5; // +0 to 0.5 points
  }

  return Math.min(score, POPULARITY_FEATURED + POPULARITY_BONUS);
}

/**
 * Calculate data quality score
 */
function calculateQualityScore(location: Location): number {
  let score = 0;

  // Multiple images = better quality
  if (location.images.length >= 3) {
    score += QUALITY_GOOD; // +2 points
  } else if (location.images.length >= 1) {
    score += QUALITY_BASIC; // +1 point
  }

  // Good description length (at least 50 chars)
  if (location.description && location.description.length >= 50) {
    score += QUALITY_BASIC; // +1 point
  }

  // Included services
  if (location.includedServices && location.includedServices.length >= 2) {
    score += QUALITY_BASIC; // +1 point
  }

  return Math.min(score, QUALITY_GOOD * 2);
}

/**
 * Main scoring function
 */
export function scoreVenue(
  location: Location,
  preferences: Preferences
): VenueScore {
  const budgetScore = calculateBudgetScore(location, preferences);
  const capacityScore = calculateCapacityScore(location, preferences);
  const featureScore = calculateFeatureScore(location, preferences);
  const popularityScore = calculatePopularityScore(location);
  const qualityScore = calculateQualityScore(location);

  const totalScore = budgetScore + capacityScore + featureScore + popularityScore + qualityScore;

  // Max possible score
  const maxScore =
    BUDGET_PERFECT +
    CAPACITY_PERFECT +
    preferences.features.length * 2 +
    POPULARITY_FEATURED +
    POPULARITY_BONUS +
    QUALITY_GOOD * 2;

  const matchPercent = Math.round((totalScore / Math.max(1, maxScore)) * 100);

  return {
    venueId: location.id,
    totalScore,
    matchPercent: Math.min(100, matchPercent),
    budgetScore,
    capacityScore,
    featureScore,
    popularityScore,
    qualityScore,
    breakdown: `Budget:${budgetScore}|Capacity:${capacityScore}|Features:${featureScore}|Popularity:${popularityScore}|Quality:${qualityScore}`,
  };
}

/**
 * Score all venues and return sorted by relevance
 */
export function scoreAllVenues(
  locations: Location[],
  preferences: Preferences
): Array<Location & VenueScore> {
  return locations
    .map((location) => ({
      ...location,
      ...scoreVenue(location, preferences),
    }))
    .sort((a, b) => {
      // Primary: match percentage
      if (b.matchPercent !== a.matchPercent) {
        return b.matchPercent - a.matchPercent;
      }
      // Tiebreaker: total score
      return b.totalScore - a.totalScore;
    });
}

/**
 * Get top 3 recommendations with special categories
 */
export function getTopRecommendations(
  scored: Array<Location & VenueScore>
): {
  topMatch: Location & VenueScore;
  bestValue: Location & VenueScore;
  premium: Location & VenueScore;
} {
  // Top match = highest match percentage
  const topMatch = scored[0];

  // Best value = best price per guest ratio with decent capacity
  const bestValue = scored
    .filter((v) => v.capacityScore > 0) // Must fit capacity
    .reduce((prev, current) => {
      const prevValue = prev.capacity / prev.pricePerPerson;
      const currentValue = current.capacity / current.pricePerPerson;
      return currentValue > prevValue ? current : prev;
    });

  // Premium = highest capacity + highest quality
  const premium = scored.reduce((prev, current) => {
    const prevScore = prev.capacity + prev.qualityScore;
    const currentScore = current.capacity + current.qualityScore;
    return currentScore > prevScore ? current : prev;
  });

  return {
    topMatch: topMatch || scored[0],
    bestValue: bestValue || scored[1] || scored[0],
    premium: premium || scored[2] || scored[0],
  };
}

/**
 * Get match tag based on percentage
 */
export function getMatchTag(matchPercent: number): string {
  if (matchPercent >= 85) return "Top Match";
  if (matchPercent >= 70) return "Gute Wahl";
  if (matchPercent >= 50) return "Passt";
  return "Alternative";
}
