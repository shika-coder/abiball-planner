import type { Location } from "@/types/location";

export type Recommendation = {
  location: Location;
  score: number;
  matchPercent: number;
  matchTag: string;
  withinBudget?: boolean;
  hasCapacity?: boolean;
};
