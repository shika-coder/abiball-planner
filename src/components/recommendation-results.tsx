"use client";

import { motion } from "framer-motion";

import { TopRecommendations } from "@/components/top-recommendations";
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

export function RecommendationResults({
  recommendations,
  onToggleFavorite,
  onToggleCompare,
  favoriteIds,
  compareIds,
  guests,
  budgetPerPerson,
  totalBudget
}: Props) {
  return (
    <>
      <TopRecommendations
        recommendations={recommendations}
        onToggleFavorite={onToggleFavorite}
        onToggleCompare={onToggleCompare}
        favoriteIds={favoriteIds}
        compareIds={compareIds}
        guests={guests}
        totalBudget={totalBudget}
        budgetPerPerson={budgetPerPerson}
      />
    </>
  );
}
