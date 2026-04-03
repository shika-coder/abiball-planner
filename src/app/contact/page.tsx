"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Navbar } from "@/components/navbar";

type Message = {
  id: string;
  body: string;
  senderRole: string;
  createdAt: string;
  status?: string;
  optimistic?: boolean;
};

type Thread = {
  id: string;
  subject: string;
  status: string;
  messages: Message[];
};

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

async function safeJson<T>(response: Response): Promise<T | null> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

export default function Contact() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [thread, setThread] = useState<Thread | null>(null);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  async function loadThread(silent = false) {
    if (silent) setRefreshing(true);
    try {
      const authRes = await fetch("/api/auth/session");
      setLoggedIn(authRes.ok);

      const chatRes = await fetch("/api/chat");
      const data = chatRes.ok ? await safeJson<{ thread: Thread | null }>(chatRes) : null;
      setThread(data?.thread || null);
    } finally {
      if (silent) setRefreshing(false);
      else setLoading(false);
    }
  }

  useEffect(() => {
    loadThread();
    const timer = setInterval(() => loadThread(true), 4000);
    return () => clearInterval(timer);
  }, []);

  const messages = useMemo(() => thread?.messages || [], [thread]);
  const latestUserMessageId = useMemo(() => {
    const userMessages = messages.filter((message) => message.senderRole === "user");
    return userMessages[userMessages.length - 1]?.id ?? null;
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  async function sendMessage() {
    const text = draft.trim();
    if (!loggedIn || !text || sending) return;
    setSending(true);

    const isNewThread = !thread || thread.id === "pending";
    const response = await fetch("/api/chat", {
      method: isNewThread ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(isNewThread ? { body: text } : { threadId: thread.id, body: text })
    });

    if (response.ok) {
      setDraft("");
      const data = await safeJson<{ thread: Thread | null }>(response);
      setThread(data?.thread || null);
    } else {
      await loadThread(true);
    }

    setSending(false);
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.10),_transparent_35%),linear-gradient(180deg,#f8fafc_0%,#ffffff_100%)] px-4 pb-10 pt-24 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-3xl">
          <section className="flex w-full flex-col overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
            <header className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4 sm:px-6">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Support Chat</p>
                <h1 className="text-xl font-semibold text-slate-950">Chat with us like WhatsApp 💬</h1>
              </div>
              <div className="text-right text-xs text-slate-500">
                <p>{refreshing ? "Refreshing..." : "Online"}</p>
                <p>{thread ? thread.status : "New chat"}</p>
              </div>
            </header>

            {!loggedIn ? (
              <div className="flex flex-1 items-center justify-center p-8 text-center">
                <div className="max-w-sm space-y-4">
                  <p className="text-lg font-semibold text-slate-950">Login required</p>
                  <p className="text-sm text-slate-600">Only logged-in users can message the team.</p>
                </div>
              </div>
            ) : loading ? (
              <div className="flex flex-1 items-center justify-center p-8 text-slate-500">Loading conversation...</div>
            ) : (
              <>
                <div className="flex-1 space-y-3 overflow-y-auto bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_100%)] px-4 py-5 sm:px-6">
                  {messages.length === 0 ? (
                    <div className="mx-auto mt-6 max-w-md rounded-3xl border border-dashed border-slate-300 bg-white/80 px-6 py-10 text-center text-slate-500">
                      No messages yet. Start the conversation below.
                    </div>
                  ) : (
                    messages.map((message) => {
                      const isUser = message.senderRole === "user";
                      const isLatestUser = message.id === latestUserMessageId && isUser;
                      return (
                        <div key={message.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                          <div
                            className={`max-w-[82%] rounded-[24px] px-4 py-3 shadow-sm sm:max-w-[70%] ${
                              isUser
                                ? "rounded-br-md bg-blue-600 text-white"
                                : "rounded-bl-md border border-slate-200 bg-white text-slate-900"
                            }`}
                            >
                            <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.body}</p>
                            <div className={`mt-2 flex items-center gap-2 text-[11px] ${isUser ? "text-blue-100" : "text-slate-400"}`}>
                              <span>{formatTime(message.createdAt)}</span>
                              {isLatestUser && message.status && (
                                <span>{message.status === "seen" ? "Seen" : message.status === "delivered" ? "Delivered" : "Sent"}</span>
                              )}
                              {message.optimistic && <span>Sending...</span>}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={bottomRef} />
                </div>

                <footer className="border-t border-slate-200 bg-white px-4 py-4 sm:px-6">
                  <div className="flex items-end gap-3">
                    <textarea
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      placeholder="Type a message..."
                      rows={1}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                      className="min-h-[52px] flex-1 resize-none rounded-full border border-slate-200 bg-slate-50 px-5 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:shadow-md"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={sending || !draft.trim()}
                      className="inline-flex h-[52px] min-w-[52px] items-center justify-center rounded-full bg-slate-950 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {sending ? "..." : "➤"}
                    </button>
                  </div>
                </footer>
              </>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
