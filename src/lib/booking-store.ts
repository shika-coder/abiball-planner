import { promises as fs } from "fs";
import path from "path";

import type { BookingRequest } from "@/types/booking";

const bookingsFile = path.join(process.cwd(), "data", "booking-requests.json");

async function ensureStore() {
  await fs.mkdir(path.dirname(bookingsFile), { recursive: true });

  try {
    await fs.access(bookingsFile);
  } catch {
    await fs.writeFile(bookingsFile, "[]\n", "utf8");
  }
}

export async function readBookingRequests() {
  await ensureStore();

  const raw = await fs.readFile(bookingsFile, "utf8");

  try {
    return JSON.parse(raw) as BookingRequest[];
  } catch {
    return [];
  }
}

export async function saveBookingRequest(request: BookingRequest) {
  const current = await readBookingRequests();
  const next = [request, ...current];

  await fs.writeFile(bookingsFile, `${JSON.stringify(next, null, 2)}\n`, "utf8");

  return request;
}
