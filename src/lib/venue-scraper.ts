/**
 * Venue Scraper
 *
 * Fetches new event venues from public sources.
 * Sources: Google Maps, event directories, listing websites
 *
 * Returns raw venue data for further processing (dedup, enrichment)
 */

export interface RawVenue {
  name: string;
  address: string;
  city: string;
  estimatedCapacity?: number;
  website?: string;
  phone?: string;
  description?: string;
  source: string; // "googlemaps", "eventdb", "web", etc.
}

/**
 * Fetches venues from a mock database of Hamburg event spaces
 * In production, this would call actual APIs (Google Maps, etc.)
 */
export async function scrapeVenuesFromMockSources(): Promise<RawVenue[]> {
  // Mock Hamburg venues that would normally come from APIs
  // In production, replace with actual API calls to:
  // - Google Places API
  // - Eventlokale.de
  // - My-Event-Hamburg.de
  // - Hochzeitslocation.de

  const mockVenues: RawVenue[] = [
    {
      name: "Speicherstadt Event Space",
      address: "Kehrwiederstraße 12, 20457 Hamburg",
      city: "Hamburg",
      estimatedCapacity: 400,
      website: "https://speicherstadt-events.de",
      phone: "+49 40 1234567",
      description: "Modern event hall in historic Speicherstadt with canal views",
      source: "eventdb",
    },
    {
      name: "Elbphilharmonie Plaza Events",
      address: "Platz der Deutschen Einheit 1, 20457 Hamburg",
      city: "Hamburg",
      estimatedCapacity: 500,
      website: "https://elbphilharmonie.de/events",
      phone: "+49 40 3876 6666",
      description: "Premium venue at Hamburg's iconic Elbphilharmonie with river views",
      source: "googlemaps",
    },
    {
      name: "Ballinstadt Auswanderermuseum Events",
      address: "Veddeler Bogen 2, 20457 Hamburg",
      city: "Hamburg",
      estimatedCapacity: 350,
      website: "https://ballinstadt.de",
      phone: "+49 40 3197 916 0",
      description: "Historic venue with immigration heritage, unique atmosphere",
      source: "eventdb",
    },
    {
      name: "Miniatur Wunderland Event Hall",
      address: "Kehrwieder 4/Block D, 20457 Hamburg",
      city: "Hamburg",
      estimatedCapacity: 300,
      website: "https://miniatur-wunderland.de/events",
      phone: "+49 40 300 68 0",
      description: "Theme park venue with unique event space and attractions",
      source: "web",
    },
    {
      name: "Kunsthalle Hamburg Events",
      address: "Glockengießerwall 5, 20095 Hamburg",
      city: "Hamburg",
      estimatedCapacity: 450,
      website: "https://kunsthalle-hamburg.de",
      phone: "+49 40 4 28 54 200",
      description: "Cultural venue with sophisticated atmosphere and art installations",
      source: "googlemaps",
    },
    {
      name: "Hanseatisches Kartographisches Institut",
      address: "Deichstraße 47, 20459 Hamburg",
      city: "Hamburg",
      estimatedCapacity: 350,
      website: "https://hki-hamburg.de",
      phone: "+49 40 3018 6900",
      description: "Historic building with industrial charm and flexible spaces",
      source: "eventdb",
    },
    {
      name: "Hafen 2 Event Center",
      address: "Überseestraße 10, 20457 Hamburg",
      city: "Hamburg",
      estimatedCapacity: 600,
      website: "https://hafen2-events.de",
      phone: "+49 40 3080 1234",
      description: "Large modern venue with harbor views and flexible layout",
      source: "eventdb",
    },
    {
      name: "Nacht der Museen - Messehallen",
      address: "Messeplaatz 1, 20357 Hamburg",
      city: "Hamburg",
      estimatedCapacity: 1000,
      website: "https://hamburg-messe.de",
      phone: "+49 40 3569 2501",
      description: "Large exhibition halls available for private events",
      source: "googlemaps",
    },
    {
      name: "Rotherbaum Campus Events",
      address: "Von-Melle-Park 5, 20146 Hamburg",
      city: "Hamburg",
      estimatedCapacity: 400,
      website: "https://uni-hamburg.de/events",
      phone: "+49 40 42838 0",
      description: "University venue with modern facilities and academic setting",
      source: "web",
    },
    {
      name: "Warburg Event Space",
      address: "Warburstraße 44, 20144 Hamburg",
      city: "Hamburg",
      estimatedCapacity: 350,
      website: "https://warburg-events.de",
      phone: "+49 40 4144 0",
      description: "Elegant historic building with grand hall and garden",
      source: "eventdb",
    },
  ];

  return mockVenues;
}

/**
 * Validates that a venue meets minimum requirements
 */
export function isVenueEligible(venue: RawVenue): boolean {
  // Must have capacity of at least 300
  const capacity = venue.estimatedCapacity || 300;
  if (capacity < 300) return false;

  // Must have a name
  if (!venue.name || venue.name.trim().length === 0) return false;

  // Must have an address
  if (!venue.address || venue.address.trim().length === 0) return false;

  return true;
}

/**
 * Main entry point for venue scraping
 */
export async function scrapeNewVenues(): Promise<RawVenue[]> {
  try {
    const venues = await scrapeVenuesFromMockSources();
    const eligible = venues.filter(isVenueEligible);

    console.log(
      `[Scraper] Found ${venues.length} venues, ${eligible.length} eligible (capacity >= 300)`
    );

    return eligible;
  } catch (error) {
    console.error("[Scraper] Error scraping venues:", error);
    return [];
  }
}
