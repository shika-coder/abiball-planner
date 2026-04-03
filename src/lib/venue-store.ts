import { prisma } from "@/lib/prisma";

export function parseJsonArray(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export function serializeArray(value: unknown): string {
  if (Array.isArray(value)) return JSON.stringify(value);
  if (typeof value === "string" && value.trim()) return JSON.stringify([value]);
  return JSON.stringify([]);
}

export async function getSupportedCities() {
  const cities = await prisma.location.findMany({
    select: { city: true },
    distinct: ["city"],
    orderBy: { city: "asc" }
  });

  return cities.map((item) => item.city);
}

