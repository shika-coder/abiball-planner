"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";

import { scoreAllVenues, getTopRecommendations, getMatchTag } from "@/lib/venue-scorer";
import { CompareDrawer } from "@/components/compare-drawer";
import { LocationCard } from "@/components/location-card";
import { PreferenceFlow } from "@/components/preference-flow";
import { RecommendationResults } from "@/components/recommendation-results";
import { StickyCTABar } from "@/components/sticky-cta-bar";
import { DEFAULT_BUDGET_PER_PERSON, DEFAULT_GUESTS, DEFAULT_TOTAL_BUDGET } from "@/lib/defaults";
import type { Location, LocationFeature, LocationStyle } from "@/types/location";
import type { Preferences, PreferenceFeature } from "@/types/preferences";
import type { Recommendation } from "@/types/recommendation";
import { getEstimatedTotal } from "@/lib/utils";
import { getLocations } from "@/lib/location-api";

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
  const [locations, setLocations] = useState<Location[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [locationsError, setLocationsError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [customLocations, setCustomLocations] = useState<Location[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const defaultPreferences: Preferences = {
    city: "Hamburg",
    guests: DEFAULT_GUESTS,
    budgetPerPerson: DEFAULT_BUDGET_PER_PERSON,
    totalBudget: DEFAULT_TOTAL_BUDGET,
    features: []
  };
  const [wizardPreferences, setWizardPreferences] = useState<Preferences>(defaultPreferences);
  const [activePreferences, setActivePreferences] = useState<Preferences | null>(null);

  useEffect(() => {
    let mounted = true;
    const loadLocations = async () => {
      try {
        const data = await getLocations();
        if (mounted) setLocations(data);
      } catch {
        if (mounted) {
          setLocations([]);
          setLocationsError("No locations available yet.");
        }
      } finally {
        if (mounted) setLoadingLocations(false);
      }
    };

    loadLocations();
    setFavorites(JSON.parse(localStorage.getItem(favoritesKey) || "[]") as string[]);
    setCompareIds(JSON.parse(localStorage.getItem(compareKey) || "[]") as string[]);
    setCustomLocations(JSON.parse(localStorage.getItem(customKey) || "[]") as Location[]);

    const channel = typeof BroadcastChannel !== "undefined" ? new BroadcastChannel("locations-updated") : null;
    channel?.addEventListener("message", loadLocations);

    return () => {
      mounted = false;
      channel?.removeEventListener("message", loadLocations);
      channel?.close();
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(favoritesKey, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem(compareKey, JSON.stringify(compareIds));
  }, [compareIds]);

  const allLocations = useMemo(() => [...customLocations, ...locations], [customLocations, locations]);

  const recommendations = useMemo(() => {
    if (!activePreferences) {
      return [];
    }

    return computeRecommendations(allLocations, activePreferences);
  }, [activePreferences, allLocations]);

  const compareLocations = useMemo(
    () => allLocations.filter((location) => compareIds.includes(location.id)),
    [compareIds, allLocations]
  );

  const defaultRecommendations = useMemo(
    () => allLocations.map((location) => buildRecommendation(location, defaultPreferences)),
    [allLocations]
  );

  function handlePreferenceSubmit(values: Preferences) {
    setWizardPreferences(values);
    setActivePreferences(values);
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

  const displayedRecommendations = activePreferences ? recommendations : defaultRecommendations;

  return (
    <main className="grain">
      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Locations</p>
            <h1 className="headline text-3xl font-bold text-slate-950">Alle Venues auf einen Blick</h1>
            <p className="text-sm text-slate-600">
              {loadingLocations ? "Lade Locations..." : `${locations.length + customLocations.length} verfügbare Locations`}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setFiltersOpen((current) => !current)}
              className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-900"
            >
              {filtersOpen ? "Filter verbergen" : "Filter anzeigen"}
            </button>
            <button
              type="button"
              onClick={() => setActivePreferences(null)}
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
            >
              Filter zurücksetzen
            </button>
          </div>
        </div>

        {filtersOpen ? (
          <div className="mt-5">
            <PreferenceFlow initialPreferences={wizardPreferences} onSubmit={handlePreferenceSubmit} compact />
          </div>
        ) : null}

        {loadingLocations ? (
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-[420px] animate-pulse rounded-[28px] border border-slate-200 bg-slate-100" />
            ))}
          </div>
        ) : locations.length === 0 && customLocations.length === 0 ? (
          <div className="mt-8 rounded-[28px] border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
            {locationsError || "No locations available yet."}
          </div>
        ) : (
          <>
            {!activePreferences ? (
              <section className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {allLocations.map((location) => (
                  <div key={location.id} className="h-full">
                    <LocationCard
                      location={location}
                      guests={defaultPreferences.guests}
                      totalBudget={defaultPreferences.totalBudget}
                      budgetPerPerson={defaultPreferences.budgetPerPerson}
                      isFavorite={favorites.includes(location.id)}
                      isComparing={compareIds.includes(location.id)}
                      isBestValue={false}
                      onToggleFavorite={toggleFavorite}
                      onToggleCompare={toggleCompare}
                    />
                  </div>
                ))}
              </section>
            ) : (
              <RecommendationResults
                recommendations={displayedRecommendations}
                onToggleFavorite={toggleFavorite}
                onToggleCompare={toggleCompare}
                favoriteIds={favorites}
                compareIds={compareIds}
                guests={activePreferences.guests}
                budgetPerPerson={activePreferences.budgetPerPerson}
                totalBudget={activePreferences.totalBudget}
              />
            )}
            <CompareDrawer
              locations={compareLocations}
              onRemove={(id) => setCompareIds((current) => current.filter((item) => item !== id))}
            />
          </>
        )}

        <AnimatePresence />
      </section>

      <StickyCTABar recommendation={(displayedRecommendations[0] ?? null) as Recommendation | null} isVisible={!!displayedRecommendations.length} />
    </main>
  );
}
