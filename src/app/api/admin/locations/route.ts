import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminAuth, successResponse, errorResponse } from "@/lib/admin-helpers";

export async function GET(request: NextRequest) {
  const adminAuth = await requireAdminAuth(request);
  if (adminAuth instanceof NextResponse) return adminAuth;

  try {
    const locations = await prisma.location.findMany({
      orderBy: { name: "asc" }
    });

    return successResponse({
      count: locations.length,
      locations
    });
  } catch (error) {
    console.error("Fetch locations error:", error);
    return errorResponse("Failed to fetch locations", 500);
  }
}

export async function POST(request: NextRequest) {
  const adminAuth = await requireAdminAuth(request);
  if (adminAuth instanceof NextResponse) return adminAuth;

  try {
    const body = await request.json() as Record<string, any>;

    if (!body.name || !body.city) {
      return errorResponse("Name and city are required", 400);
    }

    const location = await prisma.location.create({
      data: {
        name: body.name,
        city: body.city,
        district: body.district || "",
        address: body.address || "",
        capacity: body.capacity || 0,
        minimumGuests: body.minimumGuests || 0,
        pricePerPerson: body.pricePerPerson || 0,
        venueType: body.venueType || "",
        placementLabel: body.placementLabel || "Standard",
        urgencyLabel: body.urgencyLabel || "Normal",
        featuredBadge: body.featuredBadge || "",
        description: body.description || "",
        idealFor: body.idealFor || "",
        website: body.website || "",
        bookingLink: body.bookingLink || "",
        contactEmail: body.contactEmail || "",
        contactPhone: body.contactPhone || "",
        features: JSON.stringify(body.features || []),
        includedServices: JSON.stringify(body.includedServices || []),
        styleTags: JSON.stringify(body.styleTags || []),
        images: JSON.stringify(body.images || []),
        featured: body.featured || false
      }
    });

    return successResponse({ location }, 201);
  } catch (error) {
    console.error("Create location error:", error);
    return errorResponse("Failed to create location", 500);
  }
}

export async function PATCH(request: NextRequest) {
  const adminAuth = await requireAdminAuth(request);
  if (adminAuth instanceof NextResponse) return adminAuth;

  try {
    const body = await request.json() as Record<string, any>;

    if (!body.id) {
      return errorResponse("Location ID is required", 400);
    }

    const updateData: Record<string, any> = {};
    const jsonFields = ["features", "includedServices", "styleTags", "images"];

    Object.entries(body).forEach(([key, value]) => {
      if (key !== "id") {
        if (jsonFields.includes(key) && typeof value === "object") {
          updateData[key] = JSON.stringify(value);
        } else {
          updateData[key] = value;
        }
      }
    });

    const location = await prisma.location.update({
      where: { id: body.id },
      data: updateData
    });

    return successResponse({ location });
  } catch (error) {
    console.error("Update location error:", error);
    return errorResponse("Failed to update location", 500);
  }
}

export async function DELETE(request: NextRequest) {
  const adminAuth = await requireAdminAuth(request);
  if (adminAuth instanceof NextResponse) return adminAuth;

  try {
    const { searchParams } = request.nextUrl;
    const id = searchParams.get("id");

    if (!id) {
      return errorResponse("Location ID is required", 400);
    }

    await prisma.location.delete({
      where: { id }
    });

    return successResponse({ message: "Location deleted successfully" });
  } catch (error) {
    console.error("Delete location error:", error);
    return errorResponse("Failed to delete location", 500);
  }
}
