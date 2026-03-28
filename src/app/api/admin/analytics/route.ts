import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminAuth, successResponse, errorResponse } from "@/lib/admin-helpers";

export async function GET(request: NextRequest) {
  const adminAuth = await requireAdminAuth(request);
  if (typeof adminAuth !== "string") return adminAuth;

  try {
    const totalBookings = await prisma.booking.count();
    const bookingsByStatus = await prisma.booking.groupBy({
      by: ["status"],
      _count: true
    });

    const totalLocations = await prisma.location.count();
    const featuredLocations = await prisma.location.count({
      where: { featured: true }
    });

    const bookingsThisMonth = await prisma.booking.count({
      where: {
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }
    });

    const totalGuests = await prisma.booking.aggregate({
      _sum: { guests: true }
    });

    const locationsByCity = await prisma.booking.groupBy({
      by: ["locationId"],
      _count: true,
      orderBy: {
        _count: { locationId: "desc" }
      },
      take: 5
    });

    const topLocations = await Promise.all(
      locationsByCity.map(async (item) => {
        const location = await prisma.location.findUnique({
          where: { id: item.locationId },
          select: { name: true, city: true }
        });
        return {
          locationId: item.locationId,
          name: location?.name || "Unknown",
          city: location?.city || "Unknown",
          bookingCount: item._count
        };
      })
    );

    return successResponse({
      summary: {
        totalBookings,
        bookingsThisMonth,
        totalGuests: totalGuests._sum.guests || 0,
        totalLocations,
        featuredLocations
      },
      bookingsByStatus: bookingsByStatus.map((item) => ({
        status: item.status,
        count: item._count
      })),
      topLocations
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return errorResponse("Failed to fetch analytics", 500);
  }
}
