"use client";

import { motion } from "framer-motion";
import { useState } from "react";

import { LocationCard } from "@/components/location-card";
import type { Recommendation } from "@/types/recommendation";

type Props = {
  recommendations: Recommendation[];
  onToggleFavorite: (id: string) => void;
  onToggleCompare: (id: string) => void;
  onQuickView: (id: string) => void;
  favoriteIds: string[];
  compareIds: string[];
  guests: number;
  totalBudget: number;
  budgetPerPerson: number;
};

export function TopRecommendations({
  recommendations,
  onToggleFavorite,
  onToggleCompare,
  onQuickView,
  favoriteIds,
  compareIds,
  guests,
  totalBudget,
  budgetPerPerson
}: Props) {
  const [showAll, setShowAll] = useState(false);

  if (recommendations.length === 0) return null;

  const topThree = recommendations.slice(0, 3);
  const remaining = recommendations.slice(3);

  const getBadgeLabel = (index: number) => {
    if (index === 0) return "Top Match";
    if (index === 1) return "Best Value";
    if (index === 2) return "Premium";
    return null;
  };

  return (
    <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-12"
      >
        <p className="text-xs uppercase tracking-[0.35em] text-slate-400 mb-3">Speziell für euch ausgewählt</p>
        <h2 className="headline text-4xl font-bold text-slate-950 mb-2">Unsere Top-Empfehlungen für dich</h2>
        <p className="text-lg text-slate-600">
          Basierend auf eurer Gästezahl und Budget – die 3 besten Optionen zum Anfragen
        </p>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-3 mb-12">
        {topThree.map((recommendation, index) => (
          <motion.div
            key={recommendation.location.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            className="relative"
          >
            {/* Highlight badge */}
            {getBadgeLabel(index) && (
              <div className="absolute -top-4 left-6 z-10">
                <div className="inline-block bg-gradient-to-r from-blue-600 to-purple-700 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg">
                  {getBadgeLabel(index)}
                </div>
              </div>
            )}

            {/* Card wrapper with elevated styling for top 3 */}
            <div className="h-full rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 ring-1 ring-white/40">
              <LocationCard
                location={recommendation.location}
                guests={guests}
                totalBudget={totalBudget}
                budgetPerPerson={budgetPerPerson}
                isFavorite={favoriteIds.includes(recommendation.location.id)}
                isComparing={compareIds.includes(recommendation.location.id)}
                isBestValue={false}
                matchScore={recommendation.matchPercent}
                matchTag={recommendation.matchTag}
                hasCapacity={recommendation.hasCapacity}
                onToggleFavorite={onToggleFavorite}
                onToggleCompare={onToggleCompare}
                onQuickView={onQuickView}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Show all button */}
      {remaining.length > 0 && !showAll && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex justify-center"
        >
          <button
            onClick={() => setShowAll(true)}
            className="primary-button px-8 py-3 text-sm font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {remaining.length} weitere Locations ansehen
          </button>
        </motion.div>
      )}

      {/* All recommendations */}
      {showAll && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-12 pt-12 border-t border-slate-200"
        >
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400 mb-8">Weitere Optionen</p>
          <div className="grid gap-7 xl:grid-cols-2">
            {remaining.map((recommendation, index) => (
              <motion.div
                key={recommendation.location.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: (topThree.length + index) * 0.04 }}
                className="h-full"
              >
                <LocationCard
                  location={recommendation.location}
                  guests={guests}
                  totalBudget={totalBudget}
                  budgetPerPerson={budgetPerPerson}
                  isFavorite={favoriteIds.includes(recommendation.location.id)}
                  isComparing={compareIds.includes(recommendation.location.id)}
                  isBestValue={false}
                  matchScore={recommendation.matchPercent}
                  matchTag={recommendation.matchTag}
                  hasCapacity={recommendation.hasCapacity}
                  onToggleFavorite={onToggleFavorite}
                  onToggleCompare={onToggleCompare}
                  onQuickView={onQuickView}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </section>
  );
}
