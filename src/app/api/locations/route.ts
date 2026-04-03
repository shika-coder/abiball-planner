import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSupportedCities, parseJsonArray } from "@/lib/venue-store";
import type { Location, LocationFeature, LocationStyle } from "@/types/location";

type DbLocation = Awaited<ReturnType<typeof prisma.location.findFirst>>;

function toLocation(location: DbLocation): Location | null {
  if (!location) return null;

  return {
    ...location,
    features: parseJsonArray(location.features) as LocationFeature[],
    includedServices: parseJsonArray(location.includedServices),
    styleTags: parseJsonArray(location.styleTags) as LocationStyle[],
    images: parseJsonArray(location.images)
  };
}

export async function GET() {
  try {
    console.log("[api/locations] fetching all locations from Prisma");
    const locations = await prisma.location.findMany({
      orderBy: [{ featured: "desc" }, { name: "asc" }]
    });
    const normalizedLocations = locations.map((location) => toLocation(location)).filter(Boolean) as Location[];
    console.log(`[api/locations] returned ${normalizedLocations.length} locations`);
    return NextResponse.json({
      cities: await getSupportedCities(),
      count: normalizedLocations.length,
      locations: normalizedLocations
    });
  } catch (error) {
    console.error("Failed to load locations", error);
    return NextResponse.json(
      {
        cities: [],
        count: 0,
        locations: [],
        error: "Failed to load locations"
      },
      { status: 500 }
    );
  }
}
