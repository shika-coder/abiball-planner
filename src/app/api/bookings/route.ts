import { NextResponse } from "next/server";

import { locations } from "@/data/locations";
import { saveBookingRequest, readBookingRequests } from "@/lib/booking-store";
import type { BookingRequest } from "@/types/booking";

export async function GET() {
  const requests = await readBookingRequests();

  return NextResponse.json({ count: requests.length, requests });
}

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<BookingRequest>;
  const location = locations.find((entry) => entry.id === body.locationId);

  if (
    !location ||
    !body.name?.trim() ||
    !body.email?.trim() ||
    !body.schoolName?.trim() ||
    !body.preferredDate?.trim() ||
    !body.guests ||
    body.guests < 1
  ) {
    return NextResponse.json({ message: "Ungültige Buchungsanfrage" }, { status: 400 });
  }

  const bookingRequest: BookingRequest = {
    id: `lead_${Date.now()}`,
    locationId: location.id,
    locationName: location.name,
    name: body.name.trim(),
    email: body.email.trim(),
    schoolName: body.schoolName.trim(),
    guests: body.guests,
    preferredDate: body.preferredDate.trim(),
    createdAt: new Date().toISOString()
  };

  await saveBookingRequest(bookingRequest);

  return NextResponse.json({ message: "Anfrage gespeichert", request: bookingRequest }, { status: 201 });
}
