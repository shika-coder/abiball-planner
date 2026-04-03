"use client";

import type { Location } from "@/types/location";

export async function getLocations(): Promise<Location[]> {
  const response = await fetch("/api/locations", { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to load locations (${response.status})`);
  }

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    throw new Error("Unexpected response format");
  }

  try {
    const data = (await response.json()) as { locations?: Location[] };
    return (data.locations || []).filter(Boolean);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to parse locations response");
  }
}
