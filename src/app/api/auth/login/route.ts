import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth-utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "E-Mail und Passwort erforderlich" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json(
        { error: "Benutzername oder Passwort falsch" },
        { status: 401 }
      );
    }

    const passwordValid = await verifyPassword(password, user.password);

    if (!passwordValid) {
      return NextResponse.json(
        { error: "Benutzername oder Passwort falsch" },
        { status: 401 }
      );
    }

    const response = NextResponse.json(
      {
        message: "Erfolgreich angemeldet",
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      },
      { status: 200 }
    );

    response.cookies.set("userId", user.id, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
      path: "/"
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Fehler beim Anmelden" },
      { status: 500 }
    );
  }
}
