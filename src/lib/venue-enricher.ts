/**
 * Venue Enricher
 *
 * Enriches raw venue data with:
 * - Generated descriptions
 * - Estimated prices
 * - Auto-assigned features
 * - Style tags
 * - Images (from repository or random)
 */

import type { Location, LocationFeature, LocationStyle } from "@/types/location";
import type { RawVenue } from "./venue-scraper";
import { generateVenueId } from "./venue-deduplicator";
import { getVenueImages, getRandomImage } from "./venue-images";

/**
 * Generate description based on venue characteristics
 */
function generateDescription(venue: RawVenue, features: LocationFeature[]): string {
  const templates = [
    `Modern event space in ${extractDistrict(venue.address)} with capacity for ${venue.estimatedCapacity} guests. ${features.length > 0 ? `Features include ${features.slice(0, 2).join(", ")}.` : ""}`,
    `Spacious venue in ${extractDistrict(venue.address)} perfect for events up to ${venue.estimatedCapacity} people. Professional setup with flexible room arrangements.`,
    `Event hall in ${extractDistrict(venue.address)} accommodating ${venue.estimatedCapacity} guests. ${features.length > 0 ? "Equipped with " + features.slice(0, 2).join(", ") : "Professional event facilities available"}`,
    `Premium event location in ${extractDistrict(venue.address)} with capacity for ${venue.estimatedCapacity} guests. Ideal for celebrations and corporate events.`,
  ];

  return templates[Math.floor(Math.random() * templates.length)];
}

/**
 * Extract district from address
 */
function extractDistrict(address: string): string {
  // Try to find Hamburg district
  const districts = [
    "Altstadt",
    "Neustadt",
    "St. Pauli",
    "Eimsbüttel",
    "Harvestehude",
    "Uhlenhorst",
    "Barmbek",
    "Winterhude",
    "Eppendorf",
    "Alsterdorf",
    "Hoheluft",
    "Stellingen",
    "Bahrenfeld",
    "Othmarschen",
    "Groß Flottbek",
    "Blankenese",
    "Altona",
    "Veddel",
    "Rothenburgsort",
    "Harburg",
    "Speicherstadt",
  ];

  for (const district of districts) {
    if (address.includes(district)) {
      return district;
    }
  }

  return "Hamburg";
}

/**
 * Assign features based on venue characteristics and keywords
 */
function assignFeatures(venue: RawVenue): LocationFeature[] {
  const features: LocationFeature[] = ["Indoor"];

  const description = (venue.description || "").toLowerCase();
  const name = (venue.name || "").toLowerCase();
  const combined = `${description} ${name}`;

  // Check for keywords and assign features
  if (
    combined.includes("outdoor") ||
    combined.includes("garten") ||
    combined.includes("terrasse")
  ) {
    features.push("Outdoor");
  }

  if (
    combined.includes("stage") ||
    combined.includes("bühne") ||
    combined.includes("dj") ||
    combined.includes("tanzfläche")
  ) {
    features.push("Stage / DJ equipment");
    features.push("Dance floor");
  }

  if (
    combined.includes("water") ||
    combined.includes("wasser") ||
    combined.includes("hafen") ||
    combined.includes("elbe") ||
    combined.includes("kanal")
  ) {
    features.push("Waterfront");
  }

  if (
    combined.includes("parking") ||
    combined.includes("parkplatz") ||
    combined.includes("park")
  ) {
    features.push("Parking");
  }

  if (
    combined.includes("catering") ||
    combined.includes("essen") ||
    combined.includes("verpflegung")
  ) {
    features.push("Catering included");
  }

  if (
    combined.includes("breakout") ||
    combined.includes("nebenraum") ||
    combined.includes("breakout rooms")
  ) {
    features.push("Breakout rooms");
  }

  // Add late-night if suitable for parties
  if (combined.includes("party") || combined.includes("feier")) {
    features.push("Late-night license");
  }

  // Remove duplicates
  return [...new Set(features)];
}

/**
 * Assign style tags based on venue type and keywords
 */
function assignStyleTags(venue: RawVenue): LocationStyle[] {
  const styles: LocationStyle[] = [];

  const description = (venue.description || "").toLowerCase();
  const name = (venue.name || "").toLowerCase();
  const combined = `${description} ${name}`;

  if (
    combined.includes("modern") ||
    combined.includes("contemporary") ||
    combined.includes("contemporary") ||
    combined.includes("sleek")
  ) {
    styles.push("Modern");
  }

  if (
    combined.includes("industrial") ||
    combined.includes("loft") ||
    combined.includes("warehouse") ||
    combined.includes("speicherstadt")
  ) {
    styles.push("Industrial");
  }

  if (
    combined.includes("luxury") ||
    combined.includes("premium") ||
    combined.includes("elegant") ||
    combined.includes("sophisticated") ||
    combined.includes("elbphilharmonie")
  ) {
    styles.push("Luxury");
  }

  // Default to Modern if nothing else matched
  if (styles.length === 0) {
    styles.push("Modern");
  }

  return [...new Set(styles)];
}

/**
 * Estimate price based on capacity and venue type
 * Range: 50–130€ per person
 */
function estimatePrice(venue: RawVenue, styleTag: LocationStyle): number {
  const capacity = venue.estimatedCapacity || 500;

  // Base price from capacity
  let basePrice = 70;

  if (capacity >= 800) basePrice = 80; // Larger venues are pricier
  if (capacity >= 1000) basePrice = 85;

  // Adjust by style
  const adjustments: Record<LocationStyle, number> = {
    Modern: 10,
    Industrial: 5,
    Luxury: 20,
  };

  let price = basePrice + (adjustments[styleTag] || 0);

  // Add some randomness (±10%)
  const variance = price * 0.1;
  price += (Math.random() - 0.5) * variance;

  // Clamp to reasonable range
  return Math.max(50, Math.min(130, Math.round(price)));
}

/**
 * Enriches a raw venue with generated data
 */
export function enrichVenue(venue: RawVenue, index: number): Location {
  const features = assignFeatures(venue);
  const styleTags = assignStyleTags(venue);
  const pricePerPerson = estimatePrice(venue, styleTags[0]);
  const capacity = venue.estimatedCapacity || 500;
  const venueId = generateVenueId(venue.name, venue.city);

  // Get images for this venue
  const images = getVenueImages(venueId, styleTags[0]);

  return {
    id: venueId,
    name: venue.name,
    city: venue.city,
    district: extractDistrict(venue.address),
    featured: false, // New venues not featured by default
    placementLabel: "Neu",
    urgencyLabel: "Neu hinzugefügt",
    venueType: "Event Hall",
    featuredBadge: "Neu",
    address: venue.address,
    capacity: capacity,
    minimumGuests: Math.floor(capacity * 0.3), // 30% of capacity
    pricePerPerson: pricePerPerson,
    description: generateDescription(venue, features),
    images: images.length > 0 ? images : [getRandomImage()],
    features: features,
    idealFor: `Events and celebrations for ${capacity <= 500 ? "intimate" : capacity <= 800 ? "medium" : "large"} groups`,
    website: venue.website || "",
    bookingLink: venue.website || "",
    contactEmail: "",
    contactPhone: venue.phone || "",
    includedServices: [
      features.includes("Catering included") ? "Catering" : "Event space",
      features.includes("Parking") ? "Parking available" : "Flexible setup",
    ],
    styleTags: styleTags,
  };
}

/**
 * Enriches multiple venues
 */
export function enrichVenues(venues: RawVenue[]): Location[] {
  return venues.map((venue, index) => enrichVenue(venue, index));
}
