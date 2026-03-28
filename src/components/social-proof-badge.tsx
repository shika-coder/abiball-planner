"use client";

import type { Location } from "@/types/location";

type Props = {
  location: Location;
};

export function SocialProofBadge({ location }: Props) {
  // Use real data from location, with sensible defaults
  const schoolCount = location.schoolsBooked ?? 0;
  const isPopular = location.isPopularWithSchools ?? false;
  const isQuicklyBooked = location.isQuicklyBooked ?? false;

  // Don't show anything if no real data yet
  if (schoolCount === 0 && !isPopular && !isQuicklyBooked) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      {isPopular && (
        <div className="inline-flex items-center gap-1 rounded-lg bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 w-fit">
          <span className="text-lg">⭐</span> Beliebt bei Abschlussklassen
        </div>
      )}
      {isQuicklyBooked && (
        <div className="inline-flex items-center gap-1 rounded-lg bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700 w-fit">
          <span className="text-lg">⚡</span> Schnell ausgebucht
        </div>
      )}
      {schoolCount > 0 && (
        <p className="text-xs text-slate-500 font-medium">
          {schoolCount} Schulen haben diese Location gewählt
        </p>
      )}
    </div>
  );
}
