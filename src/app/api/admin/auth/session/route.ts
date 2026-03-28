import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromRequest } from "@/lib/admin-auth";
import { successResponse, errorResponse } from "@/lib/admin-helpers";

export async function GET(request: NextRequest) {
  try {
    const adminId = await getAdminFromRequest(request);

    if (!adminId) {
      return errorResponse("Not authenticated", 401);
    }

    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    });

    if (!admin) {
      return errorResponse("Admin not found", 404);
    }

    return successResponse({ admin });
  } catch (error) {
    console.error("Session check error:", error);
    return errorResponse("Internal server error", 500);
  }
}
