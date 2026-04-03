import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/auth-utils";
import { createAdminSession, ADMIN_SESSION_COOKIE } from "@/lib/admin-auth";
import { successResponse, errorResponse } from "@/lib/admin-helpers";

function safeEqual(a: string, b: string) {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  return aBuf.length === bBuf.length && crypto.timingSafeEqual(aBuf, bBuf);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { email?: string; username?: string; password: string };
    const adminUsername = process.env.ADMIN_USERNAME || "admin";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin";
    const adminEmail = process.env.ADMIN_EMAIL || "admin@abiball-planer.local";
    const loginId = (body.username || body.email || "").trim().toLowerCase();

    if (!loginId || !body.password) {
      return errorResponse("Username/email and password are required", 400);
    }

    const envLoginMatches = safeEqual(loginId, adminUsername.toLowerCase()) && safeEqual(body.password, adminPassword);
    if (envLoginMatches) {
      const hashedPassword = await hashPassword(adminPassword);
      const admin = await prisma.admin.upsert({
        where: { email: adminEmail },
        update: { name: "Admin", role: "admin" },
        create: {
          email: adminEmail,
          name: "Admin",
          password: hashedPassword,
          role: "admin"
        }
      });

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
    }

    const admin = await prisma.admin.findFirst({
      where: {
        OR: [{ email: loginId }, { name: body.username?.trim() || "" }]
      }
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
