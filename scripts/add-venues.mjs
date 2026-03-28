#!/usr/bin/env node

/**
 * Add Venues to Locations
 *
 * Syncs discovered venues and adds them to src/data/locations.ts
 * Usage: node scripts/add-venues.mjs
 */

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mock venues from scraper (matching venue-scraper.ts)
const newVenuesToAdd = [
  {
    id: "hamburg-speicherstadt-event-space",
    name: "Speicherstadt Event Space",
    city: "Hamburg",
    district: "Speicherstadt",
    featured: false,
    placementLabel: "Neu",
    urgencyLabel: "Neu hinzugefügt",
    venueType: "Event Hall",
    featuredBadge: "Neu",
    address: "Kehrwiederstraße 12, 20457 Hamburg",
    capacity: 400,
    minimumGuests: 120,
    pricePerPerson: 75,
    description:
      "Modern event space in Speicherstadt with capacity for 400 guests. Features include Dance floor, Stage / DJ equipment.",
    images: ["/images/alster-loft-1.svg", "/images/alster-loft-2.svg"],
    features: ["Indoor", "Dance floor", "Stage / DJ equipment"],
    idealFor: "Events and celebrations for medium groups",
    website: "https://speicherstadt-events.de",
    bookingLink: "https://speicherstadt-events.de",
    contactEmail: "",
    contactPhone: "+49 40 1234567",
    includedServices: ["Event space", "Flexible setup"],
    styleTags: ["Modern"],
  },
  {
    id: "hamburg-elbphilharmonie-plaza-events",
    name: "Elbphilharmonie Plaza Events",
    city: "Hamburg",
    district: "HafenCity",
    featured: false,
    placementLabel: "Neu",
    urgencyLabel: "Neu hinzugefügt",
    venueType: "Event Hall",
    featuredBadge: "Neu",
    address: "Platz der Deutschen Einheit 1, 20457 Hamburg",
    capacity: 500,
    minimumGuests: 150,
    pricePerPerson: 95,
    description:
      "Premium venue at Hamburg's iconic Elbphilharmonie with river views and modern facilities.",
    images: ["/images/fleetgarten-1.svg", "/images/fleetgarten-2.svg"],
    features: ["Indoor", "Waterfront", "Stage / DJ equipment"],
    idealFor: "Events and celebrations for medium to large groups",
    website: "https://elbphilharmonie.de/events",
    bookingLink: "https://elbphilharmonie.de/events",
    contactEmail: "",
    contactPhone: "+49 40 3876 6666",
    includedServices: ["Event space", "Waterfront views"],
    styleTags: ["Luxury", "Modern"],
  },
  {
    id: "hamburg-ballinstadt-auswanderermuseum-events",
    name: "Ballinstadt Auswanderermuseum Events",
    city: "Hamburg",
    district: "Veddel",
    featured: false,
    placementLabel: "Neu",
    urgencyLabel: "Neu hinzugefügt",
    venueType: "Historic Venue",
    featuredBadge: "Neu",
    address: "Veddeler Bogen 2, 20457 Hamburg",
    capacity: 350,
    minimumGuests: 105,
    pricePerPerson: 68,
    description:
      "Historic venue with immigration heritage and unique atmosphere. Perfect for distinctive events.",
    images: ["/images/alster-loft-1.svg"],
    features: ["Indoor", "Outdoor"],
    idealFor: "Events and celebrations for medium groups",
    website: "https://ballinstadt.de",
    bookingLink: "https://ballinstadt.de",
    contactEmail: "",
    contactPhone: "+49 40 3197 916 0",
    includedServices: ["Event space", "Historic setting"],
    styleTags: ["Luxury"],
  },
  {
    id: "hamburg-miniatur-wunderland-event-hall",
    name: "Miniatur Wunderland Event Hall",
    city: "Hamburg",
    district: "Speicherstadt",
    featured: false,
    placementLabel: "Neu",
    urgencyLabel: "Neu hinzugefügt",
    venueType: "Theme Venue",
    featuredBadge: "Neu",
    address: "Kehrwieder 4/Block D, 20457 Hamburg",
    capacity: 300,
    minimumGuests: 90,
    pricePerPerson: 72,
    description:
      "Theme park venue with unique event space and attractions. Memorable experience for any celebration.",
    images: ["/images/kaiserspeicher-hall-1.svg"],
    features: ["Indoor", "Stage / DJ equipment"],
    idealFor: "Events and celebrations for intimate to medium groups",
    website: "https://miniatur-wunderland.de/events",
    bookingLink: "https://miniatur-wunderland.de/events",
    contactEmail: "",
    contactPhone: "+49 40 300 68 0",
    includedServices: ["Event space", "Theme attractions"],
    styleTags: ["Modern", "Luxury"],
  },
  {
    id: "hamburg-kunsthalle-hamburg-events",
    name: "Kunsthalle Hamburg Events",
    city: "Hamburg",
    district: "Altstadt",
    featured: false,
    placementLabel: "Neu",
    urgencyLabel: "Neu hinzugefügt",
    venueType: "Cultural Venue",
    featuredBadge: "Neu",
    address: "Glockengießerwall 5, 20095 Hamburg",
    capacity: 450,
    minimumGuests: 135,
    pricePerPerson: 88,
    description:
      "Cultural venue with sophisticated atmosphere and art installations. Perfect for elegant celebrations.",
    images: ["/images/fleetgarten-1.svg"],
    features: ["Indoor"],
    idealFor: "Events and celebrations for medium to large groups",
    website: "https://kunsthalle-hamburg.de",
    bookingLink: "https://kunsthalle-hamburg.de",
    contactEmail: "",
    contactPhone: "+49 40 4 28 54 200",
    includedServices: ["Event space", "Art exhibitions"],
    styleTags: ["Luxury", "Modern"],
  },
  {
    id: "hamburg-hafen-2-event-center",
    name: "Hafen 2 Event Center",
    city: "Hamburg",
    district: "HafenCity",
    featured: false,
    placementLabel: "Neu",
    urgencyLabel: "Neu hinzugefügt",
    venueType: "Event Center",
    featuredBadge: "Neu",
    address: "Überseestraße 10, 20457 Hamburg",
    capacity: 600,
    minimumGuests: 180,
    pricePerPerson: 82,
    description:
      "Large modern venue with harbor views and flexible layout. Ideal for big events and celebrations.",
    images: ["/images/kaiserspeicher-hall-2.svg"],
    features: ["Indoor", "Waterfront", "Stage / DJ equipment"],
    idealFor: "Events and celebrations for large groups",
    website: "https://hafen2-events.de",
    bookingLink: "https://hafen2-events.de",
    contactEmail: "",
    contactPhone: "+49 40 3080 1234",
    includedServices: ["Event space", "Harbor views"],
    styleTags: ["Modern", "Industrial"],
  },
  {
    id: "hamburg-rotherbaum-campus-events",
    name: "Rotherbaum Campus Events",
    city: "Hamburg",
    district: "Harvestehude",
    featured: false,
    placementLabel: "Neu",
    urgencyLabel: "Neu hinzugefügt",
    venueType: "University Venue",
    featuredBadge: "Neu",
    address: "Von-Melle-Park 5, 20146 Hamburg",
    capacity: 400,
    minimumGuests: 120,
    pricePerPerson: 65,
    description:
      "University venue with modern facilities and academic setting. Great for events in an intellectual atmosphere.",
    images: ["/images/alster-loft-1.svg"],
    features: ["Indoor"],
    idealFor: "Events and celebrations for medium groups",
    website: "https://uni-hamburg.de/events",
    bookingLink: "https://uni-hamburg.de/events",
    contactEmail: "",
    contactPhone: "+49 40 42838 0",
    includedServices: ["Event space", "Academic setting"],
    styleTags: ["Modern"],
  },
];

async function addVenues() {
  try {
    const locationsPath = path.join(
      __dirname,
      "../src/data/locations.ts"
    );

    const content = await fs.readFile(locationsPath, "utf-8");

    // Find the end of the locations array
    const lastBracketIndex = content.lastIndexOf("]");

    if (lastBracketIndex === -1) {
      console.error("❌ Could not find locations array closing bracket");
      process.exit(1);
    }

    // Format new venues as TypeScript code
    const venuesCode = newVenuesToAdd
      .map(
        (venue) =>
          `  {
    id: "${venue.id}",
    name: "${venue.name}",
    city: "${venue.city}",
    district: "${venue.district}",
    featured: ${venue.featured},
    placementLabel: "${venue.placementLabel}",
    urgencyLabel: "${venue.urgencyLabel}",
    venueType: "${venue.venueType}",
    featuredBadge: "${venue.featuredBadge}",
    address: "${venue.address}",
    capacity: ${venue.capacity},
    minimumGuests: ${venue.minimumGuests},
    pricePerPerson: ${venue.pricePerPerson},
    description: "${venue.description}",
    images: [${venue.images.map((img) => `"${img}"`).join(", ")}],
    features: [${venue.features.map((f) => `"${f}"`).join(", ")}],
    idealFor: "${venue.idealFor}",
    website: "${venue.website}",
    bookingLink: "${venue.bookingLink}",
    contactEmail: "${venue.contactEmail}",
    contactPhone: "${venue.contactPhone}",
    includedServices: [${venue.includedServices.map((s) => `"${s}"`).join(", ")}],
    styleTags: [${venue.styleTags.map((t) => `"${t}"`).join(", ")}],
  }`
      )
      .join(",\n");

    // Insert before closing bracket
    const newContent =
      content.slice(0, lastBracketIndex) +
      ",\n" +
      venuesCode +
      "\n" +
      content.slice(lastBracketIndex);

    await fs.writeFile(locationsPath, newContent);

    console.log("✅ Successfully added " + newVenuesToAdd.length + " venues!");
    console.log(
      "\n📝 New venues added to src/data/locations.ts:"
    );
    newVenuesToAdd.forEach((v) => {
      console.log(`  • ${v.name} (${v.capacity} capacity, €${v.pricePerPerson}pp)`);
    });
  } catch (error) {
    console.error("❌ Error adding venues:", error);
    process.exit(1);
  }
}

addVenues();
