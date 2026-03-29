"use client";

import { motion } from "framer-motion";

import { LocationCard } from "@/components/location-card";
import type { Recommendation } from "@/types/recommendation";

type Props = {
  recommendations: Recommendation[];
  onToggleFavorite: (id: string) => void;
  onToggleCompare: (id: string) => void;
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
  favoriteIds,
  compareIds,
  guests,
  totalBudget,
  budgetPerPerson
}: Props) {
  if (recommendations.length === 0) {
    return (
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="text-center py-12"
        >
          <p className="text-lg text-slate-500 mb-4">
            Leider keine Locations gefunden, die euren Anforderungen entsprechen.
          </p>
          <p className="text-sm text-slate-400">
            Versucht bitte die Filter anzupassen oder das Budget zu erhöhen.
          </p>
        </motion.div>
      </section>
    );
  }

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
        <h2 className="headline text-4xl font-bold text-slate-950 mb-2">Alle verfügbaren Empfehlungen</h2>
        <p className="text-lg text-slate-600">
          {recommendations.length} passende Locations basierend auf eurer Gästezahl und Budget
        </p>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
        {recommendations.map((recommendation, index) => (
          <motion.div
            key={recommendation.location.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.06 }}
            className="relative"
          >
            {/* Highlight badge for top 3 */}
            {getBadgeLabel(index) && (
              <div className="absolute -top-4 left-6 z-10">
                <div className="inline-block bg-gradient-to-r from-blue-600 to-purple-700 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg">
                  {getBadgeLabel(index)}
                </div>
              </div>
            )}

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
              />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
