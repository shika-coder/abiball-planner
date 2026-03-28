"use client";

import { motion } from "framer-motion";

import { TopRecommendations } from "@/components/top-recommendations";
import type { Recommendation } from "@/types/recommendation";

type Props = {
  recommendations: Recommendation[];
  onChangeFilters: () => void;
  onToggleFavorite: (id: string) => void;
  onToggleCompare: (id: string) => void;
  onQuickView: (id: string) => void;
  favoriteIds: string[];
  compareIds: string[];
  guests: number;
  totalBudget: number;
  budgetPerPerson: number;
};

export function RecommendationResults({
  recommendations,
  onChangeFilters,
  onToggleFavorite,
  onToggleCompare,
  onQuickView,
  favoriteIds,
  compareIds,
  guests,
  budgetPerPerson,
  totalBudget
}: Props) {
  return (
    <>
      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10 pb-24">
        <motion.div
          className="glass-panel mb-8 rounded-[32px] p-6 shadow-[0_30px_90px_rgba(15,23,42,0.25)]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.36 }}
        >
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="max-w-2xl space-y-2">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Schnelle Auswahl</p>
              <h2 className="headline text-2xl text-slate-950">Vorschläge gefunden!</h2>
              <p className="text-sm text-slate-600">
                {recommendations.length} passende Locations gefunden – lasst euch inspirieren und fragt jetzt an
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onChangeFilters}
              className="secondary-button rounded-full px-5 py-2.5 text-sm font-semibold transition duration-300"
            >
              Einstellungen ändern
            </button>
            <p className="text-xs text-slate-500">Keine passenden Locations dabei? Passt eure Anforderungen an.</p>
          </div>
        </motion.div>
      </section>

      <TopRecommendations
        recommendations={recommendations}
        onToggleFavorite={onToggleFavorite}
        onToggleCompare={onToggleCompare}
        onQuickView={onQuickView}
        favoriteIds={favoriteIds}
        compareIds={compareIds}
        guests={guests}
        totalBudget={totalBudget}
        budgetPerPerson={budgetPerPerson}
      />
    </>
  );
}
