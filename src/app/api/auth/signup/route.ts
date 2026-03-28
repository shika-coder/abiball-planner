import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth-utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, school, city } = body;

    if (!email || !password || !name || !school || !city) {
      return NextResponse.json(
        { error: "Alle Felder sind erforderlich" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "E-Mail existiert bereits" },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        school,
        city
      }
    });

    return NextResponse.json(
      {
        message: "Konto erfolgreich erstellt",
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Fehler beim Erstellen des Kontos" },
      { status: 500 }
    );
  }
}
