import { NextResponse } from "next/server";

import { locations, supportedCities } from "@/data/locations";

export async function GET() {
  return NextResponse.json({
    cities: supportedCities,
    count: locations.length,
    locations
  });
}
