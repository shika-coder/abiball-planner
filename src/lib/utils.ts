import { Location } from "@/types/location";
import type { BookingRequest } from "@/types/booking";

export const euro = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0
});

export function getEstimatedTotal(location: Location, guests: number) {
  return guests * location.pricePerPerson;
}

export function getCostPerStudent(location: Location, guests: number) {
  return Math.round(getEstimatedTotal(location, guests) / Math.max(guests, 1));
}

export function getCommission(location: Location, guests: number) {
  return Math.round(getEstimatedTotal(location, guests) * 0.1);
}

export function getLeadValue(location: Location, guests: number) {
  const multiplier = Math.min(
    5,
    Math.max(2, 2 + location.features.length * 0.18 + (location.featured ? 0.45 : 0) + location.capacity / 1200)
  );

  return Math.round(guests * multiplier);
}

export function getValueScore(location: Location) {
  const priceScore = Math.max(0, 140 - location.pricePerPerson) * 0.42;
  const capacityScore = Math.min(location.capacity, 1000) * 0.035;
  const featureScore = location.features.length * 6;
  const featuredScore = location.featured ? 10 : 0;

  return Math.round(priceScore + capacityScore + featureScore + featuredScore);
}

export function getBudgetStatus(
  location: Location,
  guests: number,
  totalBudget: number,
  budgetPerPerson: number
) {
  const estimatedTotal = getEstimatedTotal(location, guests);
  const effectiveBudget = totalBudget || guests * budgetPerPerson;

  return {
    estimatedTotal,
    overCapacity: guests > location.capacity,
    belowMinimum: guests < location.minimumGuests,
    overBudget: effectiveBudget > 0 ? estimatedTotal > effectiveBudget : false
  };
}

export function getBestValueLocation(locations: Location[], guests?: number) {
  return [...locations]
    .sort((left, right) => {
      const leftFeatured = left.featured ? 1 : 0;
      const rightFeatured = right.featured ? 1 : 0;
      const leftFits = guests ? left.capacity >= guests : true;
      const rightFits = guests ? right.capacity >= guests : true;
      const leftValue = getValueScore(left);
      const rightValue = getValueScore(right);

      if (leftFits !== rightFits) {
        return leftFits ? -1 : 1;
      }

      if (leftFeatured !== rightFeatured) {
        return rightFeatured - leftFeatured;
      }

      if (leftValue !== rightValue) {
        return rightValue - leftValue;
      }

      if (left.pricePerPerson !== right.pricePerPerson) {
        return left.pricePerPerson - right.pricePerPerson;
      }

      return right.capacity - left.capacity;
    })[0];
}

export function rankLocations(locations: Location[], guests?: number) {
  return [...locations].sort((left, right) => {
    const leftFeatured = left.featured ? 1 : 0;
    const rightFeatured = right.featured ? 1 : 0;
    const leftFits = guests ? left.capacity >= guests : true;
    const rightFits = guests ? right.capacity >= guests : true;
    const leftValue = getValueScore(left);
    const rightValue = getValueScore(right);

    if (leftFits !== rightFits) {
      return leftFits ? -1 : 1;
    }

    if (leftFeatured !== rightFeatured) {
      return rightFeatured - leftFeatured;
    }

    if (leftValue !== rightValue) {
      return rightValue - leftValue;
    }

    if (left.pricePerPerson !== right.pricePerPerson) {
      return left.pricePerPerson - right.pricePerPerson;
    }

    return right.capacity - left.capacity;
  });
}

export function getBookingRevenueSnapshot(location: Location, booking: BookingRequest) {
  const estimatedTotal = getEstimatedTotal(location, booking.guests);

  return {
    leadValue: getLeadValue(location, booking.guests),
    commission: getCommission(location, booking.guests),
    estimatedTotal
  };
}

export function slugToTitle(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
