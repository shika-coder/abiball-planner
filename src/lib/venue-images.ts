/**
 * Venue Image Repository
 *
 * Maps venue names/types to available images
 * Provides fallback images for new venues
 */

export const venueImages: Record<string, string[]> = {
  // Existing venues - using their actual images
  "cch-congress-center-hamburg": [
    "/images/cch-congress-center-hamburg/main.jpg",
    "/images/cch-congress-center-hamburg/hall.jpg",
    "/images/cch-congress-center-hamburg/stage.png",
    "/images/cch-congress-center-hamburg/auditorium.png",
  ],
  "stage-theater-im-hafen": [
    "/images/stage-theater-im-hafen/main.jpg",
  ],
  "cruise-center-altona": [
    "/images/cruise-center-altona/main.jpg",
  ],
  "schuppen-52": [
    "/images/schuppen-52/main.jpg",
  ],
  "edelfettwerk": [
    "/images/edelfettwerk/main.jpg",
  ],
  "fischauktionshalle-hamburg": [
    "/images/fischauktionshalle-hamburg/main.jpg",
  ],

  // Generic SVG images (fallbacks)
  "generic-modern": [
    "/images/alster-loft-1.svg",
    "/images/alster-loft-2.svg",
  ],
  "generic-industrial": [
    "/images/kaiserspeicher-hall-1.svg",
    "/images/kaiserspeicher-hall-2.svg",
  ],
  "generic-waterfront": [
    "/images/fleetgarten-1.svg",
    "/images/fleetgarten-2.svg",
  ],
  "generic-luxury": [
    "/images/elbkuppel-1.svg",
    "/images/elbkuppel-2.svg",
  ],
};

/**
 * Get images for a venue
 * Falls back to generic images based on style
 */
export function getVenueImages(venueId: string, styleTag?: string): string[] {
  // Try specific venue
  if (venueImages[venueId]) {
    return venueImages[venueId];
  }

  // Fall back to style-based images
  if (styleTag) {
    const styleKey = `generic-${styleTag.toLowerCase()}`;
    if (venueImages[styleKey]) {
      return venueImages[styleKey];
    }
  }

  // Ultimate fallback - modern style
  return venueImages["generic-modern"] || ["/images/alster-loft-1.svg"];
}

/**
 * Get a single image for a venue
 */
export function getVenueImage(venueId: string, styleTag?: string): string {
  const images = getVenueImages(venueId, styleTag);
  return images[0] || "/images/alster-loft-1.svg";
}

/**
 * Get random image from available images
 */
export function getRandomImage(): string {
  const allImages = Object.values(venueImages).flat();
  return allImages[Math.floor(Math.random() * allImages.length)] || "/images/alster-loft-1.svg";
}
