import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE } from "@/lib/admin-auth";
import { successResponse } from "@/lib/admin-helpers";

export async function POST(request: NextRequest) {
  const response = successResponse({ message: "Logged out successfully" });

  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: "",
    httpOnly: true,
    maxAge: 0
  });

  return response;
}
