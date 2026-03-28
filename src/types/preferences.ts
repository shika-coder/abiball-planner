export type PreferenceFeature =
  | "Waterfront"
  | "Modern"
  | "Industrial"
  | "Luxury"
  | "Outdoor"
  | "Stage/Dancefloor";

export type Preferences = {
  city: string;
  guests: number;
  budgetPerPerson: number;
  totalBudget: number;
  features: PreferenceFeature[];
};
