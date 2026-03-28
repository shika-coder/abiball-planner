import { NextRequest, NextResponse } from "next/server";
import { prisma } from "./prisma";

export const ADMIN_SESSION_COOKIE = "admin_session_token";

export async function createAdminSession(adminId: string): Promise<string> {
  const token = Buffer.from(`${adminId}:${Date.now()}`).toString("base64");
  return token;
}

export async function validateAdminSession(token: string | undefined): Promise<string | null> {
  if (!token) return null;

  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const [adminId] = decoded.split(":");
    
    // Verify admin exists
    const admin = await prisma.admin.findUnique({
      where: { id: adminId }
    });

    return admin ? adminId : null;
  } catch {
    return null;
  }
}

export async function getAdminFromRequest(request: NextRequest): Promise<string | null> {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  return validateAdminSession(token);
}

export function isAdminRoute(pathname: string): boolean {
  return pathname.startsWith("/admin") || pathname.startsWith("/api/admin");
}

/**
 * Middleware for API endpoints - throws error if not admin
 */
export async function requireAdminAuth(request: NextRequest): Promise<void> {
  const admin = await getAdminFromRequest(request);
  
  if (!admin) {
    throw new Error("Unauthorized: Admin session required");
  }
}
