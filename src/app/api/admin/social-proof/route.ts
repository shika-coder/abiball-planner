import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminAuth, successResponse, errorResponse } from "@/lib/admin-helpers";

export async function GET(request: NextRequest) {
  const adminAuth = await requireAdminAuth(request);
  if (adminAuth instanceof NextResponse) return adminAuth;

  try {
    const locationId = request.nextUrl.searchParams.get("locationId");

    if (locationId) {
      const metric = await prisma.socialProofMetric.findUnique({
        where: { locationId }
      });
      return successResponse({ metric: metric || null });
    }

    const metrics = await prisma.socialProofMetric.findMany();
    return successResponse({
      count: metrics.length,
      metrics
    });
  } catch (error) {
    console.error("Fetch social proof error:", error);
    return errorResponse("Failed to fetch social proof metrics", 500);
  }
}

export async function POST(request: NextRequest) {
  const adminAuth = await requireAdminAuth(request);
  if (adminAuth instanceof NextResponse) return adminAuth;

  try {
    const data = await request.json() as {
      locationId: string;
      schoolsBooked?: number;
      isPopularWithSchools?: boolean;
      isQuicklyBooked?: boolean;
    };

    if (!data.locationId) {
      return errorResponse("locationId is required", 400);
    }

    // Check if location exists
    const location = await prisma.location.findUnique({
      where: { id: data.locationId }
    });

    if (!location) {
      return errorResponse("Location not found", 404);
    }

    const metric = await prisma.socialProofMetric.upsert({
      where: { locationId: data.locationId },
      update: {
        schoolsBooked: data.schoolsBooked ?? undefined,
        isPopularWithSchools: data.isPopularWithSchools ?? undefined,
        isQuicklyBooked: data.isQuicklyBooked ?? undefined
      },
      create: {
        locationId: data.locationId,
        schoolsBooked: data.schoolsBooked || 0,
        isPopularWithSchools: data.isPopularWithSchools || false,
        isQuicklyBooked: data.isQuicklyBooked || false
      }
    });

    return successResponse({ metric }, 201);
  } catch (error) {
    console.error("Update social proof error:", error);
    return errorResponse("Failed to update social proof metrics", 500);
  }
}

export async function PATCH(request: NextRequest) {
  const adminAuth = await requireAdminAuth(request);
  if (adminAuth instanceof NextResponse) return adminAuth;

  try {
    const data = await request.json() as {
      locationId: string;
      schoolsBooked?: number;
      isPopularWithSchools?: boolean;
      isQuicklyBooked?: boolean;
    };

    if (!data.locationId) {
      return errorResponse("locationId is required", 400);
    }

    const updateData: Record<string, any> = {};
    if (data.schoolsBooked !== undefined) updateData.schoolsBooked = data.schoolsBooked;
    if (data.isPopularWithSchools !== undefined) updateData.isPopularWithSchools = data.isPopularWithSchools;
    if (data.isQuicklyBooked !== undefined) updateData.isQuicklyBooked = data.isQuicklyBooked;

    const metric = await prisma.socialProofMetric.update({
      where: { locationId: data.locationId },
      data: updateData
    });

    return successResponse({ metric });
  } catch (error) {
    console.error("Patch social proof error:", error);
    return errorResponse("Failed to update social proof metrics", 500);
  }
}
