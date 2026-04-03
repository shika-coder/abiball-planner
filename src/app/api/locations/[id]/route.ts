import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseJsonArray } from "@/lib/venue-store";

export async function GET(_: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const location = await prisma.location.findUnique({ where: { id } });
  if (!location) {
    return NextResponse.json({ error: "Venue not found" }, { status: 404 });
  }
  return NextResponse.json({
    ...location,
    features: parseJsonArray(location.features),
    includedServices: parseJsonArray(location.includedServices),
    styleTags: parseJsonArray(location.styleTags),
    images: parseJsonArray(location.images)
  });
}
