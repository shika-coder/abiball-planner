import { NextResponse } from "next/server";

import { locations } from "@/data/locations";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const location = locations.find((entry) => entry.id === id);

  if (!location) {
    return NextResponse.json({ message: "Location not found" }, { status: 404 });
  }

  return NextResponse.json(location);
}
