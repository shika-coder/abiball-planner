"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";

import { scoreAllVenues, getTopRecommendations, getMatchTag } from "@/lib/venue-scorer";
import { CompareDrawer } from "@/components/compare-drawer";
import { PreferenceFlow } from "@/components/preference-flow";
import { QuickViewModal } from "@/components/quick-view-modal";
import { RecommendationResults } from "@/components/recommendation-results";
import { StickyCTABar } from "@/components/sticky-cta-bar";
import { locations as baseLocations, supportedCities } from "@/data/locations";
import { DEFAULT_BUDGET_PER_PERSON, DEFAULT_GUESTS, DEFAULT_TOTAL_BUDGET } from "@/lib/defaults";
import type { Location, LocationFeature, LocationStyle } from "@/types/location";
import type { Preferences, PreferenceFeature } from "@/types/preferences";
import type { Recommendation } from "@/types/recommendation";
import { getEstimatedTotal } from "@/lib/utils";

const stylePreferences: PreferenceFeature[] = ["Modern", "Industrial", "Luxury"];
const stageKeywords: LocationFeature[] = ["Dance floor", "Stage / DJ equipment"];

function countFeatureMatch(feature: PreferenceFeature, location: Location) {
  if (feature === "Waterfront") {
    return location.features.includes("Waterfront") ? 1 : 0;
  }

  if (feature === "Outdoor") {
    return location.features.includes("Outdoor") ? 1 : 0;
  }

  if (feature === "Stage/Dancefloor") {
    return stageKeywords.some((keyword) => location.features.includes(keyword)) ? 1 : 0;
  }

  if (stylePreferences.includes(feature)) {
    return location.styleTags.includes(feature as LocationStyle) ? 1 : 0;
  }

  return 0;
}

function buildRecommendation(location: Location, preferences: Preferences): Recommendation {
  const estimatedTotal = getEstimatedTotal(location, preferences.guests);
  const withinBudget =
    preferences.totalBudget > 0
      ? estimatedTotal <= preferences.totalBudget
      : location.pricePerPerson <= preferences.budgetPerPerson;

  const hasCapacity = location.capacity >= preferences.guests;

  // Use the new Airbnb-style scoring
  const scored = scoreAllVenues([location], preferences)[0];

  return {
    location,
    score: scored.totalScore,
    matchPercent: scored.matchPercent,
    matchTag: getMatchTag(scored.matchPercent),
    withinBudget,
    hasCapacity,
  };
}

function computeRecommendations(locations: Location[], preferences: Preferences): Recommendation[] {
  // Get venues from selected city
  const allVenues = locations.filter((location) => location.city === preferences.city);

  // Score all venues with the new Airbnb-style system
  const scored = scoreAllVenues(allVenues, preferences);

  // Map to recommendations format
  const recommendations: Recommendation[] = scored.map((venue) => ({
    location: venue,
    score: venue.totalScore,
    matchPercent: venue.matchPercent,
    matchTag: getMatchTag(venue.matchPercent),
    withinBudget:
      preferences.totalBudget > 0
        ? venue.pricePerPerson * preferences.guests <= preferences.totalBudget
        : venue.pricePerPerson <= preferences.budgetPerPerson,
    hasCapacity: venue.capacity >= preferences.guests,
  }));

  if (typeof window !== 'undefined') {
    console.log(`[Search] Cities: ${locations.map(l => l.city).join(', ')}`);
    console.log(`[Search] Total locations: ${locations.length}, Hamburg venues: ${allVenues.length}, Recommendations: ${recommendations.length}`);
  }

  return recommendations;
}

const favoritesKey = "abiball.favorites";
const compareKey = "abiball.compare";
const customKey = "abiball.customLocations";

export function SearchExperience() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [customLocations, setCustomLocations] = useState<Location[]>([]);
  const [quickViewId, setQuickViewId] = useState<string | null>(null);

  const defaultPreferences: Preferences = {
    city: supportedCities[0],
    guests: DEFAULT_GUESTS,
    budgetPerPerson: DEFAULT_BUDGET_PER_PERSON,
    totalBudget: DEFAULT_TOTAL_BUDGET,
    features: []
  };
  const [wizardPreferences, setWizardPreferences] = useState<Preferences>(defaultPreferences);
  const [activePreferences, setActivePreferences] = useState<Preferences | null>(null);

  useEffect(() => {
    setFavorites(JSON.parse(localStorage.getItem(favoritesKey) || "[]") as string[]);
    setCompareIds(JSON.parse(localStorage.getItem(compareKey) || "[]") as string[]);
    setCustomLocations(JSON.parse(localStorage.getItem(customKey) || "[]") as Location[]);
  }, []);

  useEffect(() => {
    localStorage.setItem(favoritesKey, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem(compareKey, JSON.stringify(compareIds));
  }, [compareIds]);

  const locations = useMemo(() => [...customLocations, ...baseLocations], [customLocations]);

  const recommendations = useMemo(() => {
    if (!activePreferences) {
      return [];
    }

    return computeRecommendations(locations, activePreferences);
  }, [activePreferences, locations]);

  const compareLocations = useMemo(
    () => locations.filter((location) => compareIds.includes(location.id)),
    [compareIds, locations]
  );
  const quickViewLocation = useMemo(
    () => locations.find((location) => location.id === quickViewId) ?? null,
    [locations, quickViewId]
  );

  function handlePreferenceSubmit(values: Preferences) {
    setWizardPreferences(values);
    setActivePreferences(values);
  }

  function handleChangeFilters() {
    setActivePreferences(null);
  }

  function toggleFavorite(id: string) {
    setFavorites((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  }

  function toggleCompare(id: string) {
    setCompareIds((current) => {
      if (current.includes(id)) {
        return current.filter((item) => item !== id);
      }

      return [...current, id];
    });
  }

  return (
    <main className="grain">
      {!activePreferences ? (
        <PreferenceFlow initialPreferences={wizardPreferences} onSubmit={handlePreferenceSubmit} />
      ) : (
        <>
          <RecommendationResults
            recommendations={recommendations}
            onChangeFilters={handleChangeFilters}
            onToggleFavorite={toggleFavorite}
            onToggleCompare={toggleCompare}
            onQuickView={setQuickViewId}
            favoriteIds={favorites}
            compareIds={compareIds}
            guests={activePreferences.guests}
            budgetPerPerson={activePreferences.budgetPerPerson}
            totalBudget={activePreferences.totalBudget}
          />
          <CompareDrawer
            locations={compareLocations}
            onRemove={(id) => setCompareIds((current) => current.filter((item) => item !== id))}
          />
        </>
      )}

      <AnimatePresence>
        {quickViewLocation && activePreferences ? (
          <QuickViewModal
            location={quickViewLocation}
            guests={activePreferences.guests}
            budgetPerPerson={activePreferences.budgetPerPerson}
            totalBudget={activePreferences.totalBudget}
            isFavorite={favorites.includes(quickViewLocation.id)}
            isComparing={compareIds.includes(quickViewLocation.id)}
            onClose={() => setQuickViewId(null)}
            onToggleFavorite={toggleFavorite}
            onToggleCompare={toggleCompare}
          />
         ) : null}
      </AnimatePresence>

      {/* Sticky CTA Bar */}
      <StickyCTABar recommendation={recommendations[0] ?? null} isVisible={!!activePreferences} />
    </main>
  );
}
