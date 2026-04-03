import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/admin-helpers";

export async function GET(request: NextRequest) {
  const adminAuth = await requireAdminAuth(request);
  if (adminAuth instanceof NextResponse) return adminAuth;

  const threads = await prisma.supportThread.findMany({
    include: {
      user: { select: { name: true, email: true } },
      messages: { orderBy: { createdAt: "asc" } }
    },
    orderBy: { updatedAt: "desc" }
  });

  const unreadUserMessageIds = threads.flatMap((thread) =>
    thread.messages
      .filter((message) => message.senderRole === "user" && message.status !== "seen")
      .map((message) => message.id)
  );

  let responseThreads = threads;
  if (unreadUserMessageIds.length > 0) {
    await prisma.supportMessage.updateMany({
      where: { id: { in: unreadUserMessageIds } },
      data: {
        status: "seen",
        seenAt: new Date(),
        deliveredAt: new Date()
      }
    });
    const seenIds = new Set(unreadUserMessageIds);
    responseThreads = threads.map((thread) => ({
        ...thread,
        messages: thread.messages.map((message) =>
          seenIds.has(message.id)
            ? { ...message, status: "seen", seenAt: new Date(), deliveredAt: new Date() }
            : message
        )
      }));
  }

  return NextResponse.json({ success: true, data: { threads: responseThreads } });
}

export async function POST(request: NextRequest) {
  const adminAuth = await requireAdminAuth(request);
  if (adminAuth instanceof NextResponse) return adminAuth;
  const { threadId, body } = await request.json();
  if (!threadId || !body) return NextResponse.json({ error: "Thread and message required" }, { status: 400 });

  await prisma.supportMessage.create({
    data: {
      threadId,
      senderRole: "admin",
      body,
      status: "sent",
      deliveredAt: new Date()
    }
  });
  await prisma.supportThread.update({ where: { id: threadId }, data: { status: "pending" } });

  const updatedThread = await prisma.supportThread.findUnique({
    where: { id: threadId },
    include: {
      user: { select: { name: true, email: true } },
      messages: { orderBy: { createdAt: "asc" } }
    }
  });

  return NextResponse.json({ thread: updatedThread });
}
