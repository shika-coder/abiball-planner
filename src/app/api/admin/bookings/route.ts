import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminAuth, successResponse, errorResponse } from "@/lib/admin-helpers";

export async function GET(request: NextRequest) {
  const adminAuth = await requireAdminAuth(request);
  if (adminAuth instanceof NextResponse) return adminAuth;

  try {
    const status = request.nextUrl.searchParams.get("status");

    const bookings = await prisma.booking.findMany({
      where: status ? { status } : undefined,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            school: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return successResponse({
      count: bookings.length,
      bookings
    });
  } catch (error) {
    console.error("Fetch bookings error:", error);
    return errorResponse("Failed to fetch bookings", 500);
  }
}

export async function PATCH(request: NextRequest) {
  const adminAuth = await requireAdminAuth(request);
  if (adminAuth instanceof NextResponse) return adminAuth;

  try {
    const body = await request.json() as {
      id: string;
      status?: string;
      notes?: string;
    };

    if (!body.id) {
      return errorResponse("Booking ID is required", 400);
    }

    const booking = await prisma.booking.update({
      where: { id: body.id },
      data: {
        ...(body.status && { status: body.status }),
        ...(body.notes !== undefined && { notes: body.notes })
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return successResponse({ booking });
  } catch (error) {
    console.error("Update booking error:", error);
    return errorResponse("Failed to update booking", 500);
  }
}

export async function DELETE(request: NextRequest) {
  const adminAuth = await requireAdminAuth(request);
  if (adminAuth instanceof NextResponse) return adminAuth;

  try {
    const { searchParams } = request.nextUrl;
    const id = searchParams.get("id");

    if (!id) {
      return errorResponse("Booking ID is required", 400);
    }

    await prisma.booking.delete({
      where: { id }
    });

    return successResponse({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Delete booking error:", error);
    return errorResponse("Failed to delete booking", 500);
  }
}
