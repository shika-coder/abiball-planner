import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

async function requireUser(request: NextRequest) {
  const userId = request.cookies.get("userId")?.value;
  if (!userId) return null;
  return prisma.user.findUnique({ where: { id: userId } });
}

export async function GET(request: NextRequest) {
  const user = await requireUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const thread = await prisma.supportThread.findFirst({
    where: { userId: user.id },
    include: { messages: { orderBy: { createdAt: "asc" } } },
    orderBy: { updatedAt: "desc" }
  });

  let responseThread = thread;
  if (thread) {
    const unreadAdminMessages = thread.messages.filter((message) => message.senderRole === "admin" && message.status !== "seen");
    if (unreadAdminMessages.length > 0) {
      await prisma.supportMessage.updateMany({
        where: {
          id: { in: unreadAdminMessages.map((message) => message.id) }
        },
        data: {
          status: "seen",
          seenAt: new Date(),
          deliveredAt: new Date()
        }
      });
      responseThread = {
        ...thread,
        messages: thread.messages.map((message) =>
          message.senderRole === "admin" && message.status !== "seen"
            ? { ...message, status: "seen", seenAt: new Date(), deliveredAt: new Date() }
            : message
        )
      };
    }
  }

  return NextResponse.json({ thread: responseThread });
}

export async function POST(request: NextRequest) {
  const user = await requireUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { body } = await request.json();
  if (!body) return NextResponse.json({ error: "Message required" }, { status: 400 });

  const thread = await prisma.supportThread.create({
    data: {
      userId: user.id,
      subject: "Support conversation",
      messages: {
        create: {
          senderId: user.id,
          senderRole: "user",
          body,
          status: "sent",
          deliveredAt: new Date()
        }
      }
    },
    include: { messages: { orderBy: { createdAt: "asc" } } }
  });

  return NextResponse.json({ thread }, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const user = await requireUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { threadId, body } = await request.json();
  if (!threadId || !body) return NextResponse.json({ error: "Thread and message required" }, { status: 400 });

  await prisma.supportMessage.create({
    data: {
      threadId,
      senderId: user.id,
      senderRole: "user",
      body,
      status: "sent",
      deliveredAt: new Date()
    }
  });
  const updatedThread = await prisma.supportThread.findUnique({
    where: { id: threadId },
    include: {
      messages: { orderBy: { createdAt: "asc" } }
    }
  });

  return NextResponse.json({ thread: updatedThread });
}

export async function PATCH(request: NextRequest) {
  const user = await requireUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { threadId, body } = await request.json();
  if (!threadId || !body) {
    return NextResponse.json({ error: "Thread and message required" }, { status: 400 });
  }

  const thread = await prisma.supportThread.findFirst({
    where: { id: threadId, userId: user.id }
  });

  if (!thread) {
    return NextResponse.json({ error: "Thread not found" }, { status: 404 });
  }

  await prisma.supportMessage.create({
    data: {
      threadId,
      senderId: user.id,
      senderRole: "user",
      body,
      status: "sent",
      deliveredAt: new Date()
    }
  });
  await prisma.supportThread.update({ where: { id: threadId }, data: { status: "open" } });

  return NextResponse.json({ success: true });
}
