import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth-utils";
import { createAdminSession, ADMIN_SESSION_COOKIE } from "@/lib/admin-auth";
import { successResponse, errorResponse } from "@/lib/admin-helpers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { email: string; password: string };

    if (!body.email || !body.password) {
      return errorResponse("Email and password are required", 400);
    }

    const admin = await prisma.admin.findUnique({
      where: { email: body.email }
    });

    if (!admin) {
      return errorResponse("Invalid credentials", 401);
    }

    const passwordValid = await verifyPassword(body.password, admin.password);

    if (!passwordValid) {
      return errorResponse("Invalid credentials", 401);
    }

    const sessionToken = await createAdminSession(admin.id);

    const response = successResponse({
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    });

    response.cookies.set({
      name: ADMIN_SESSION_COOKIE,
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return errorResponse("Internal server error", 500);
  }
}
