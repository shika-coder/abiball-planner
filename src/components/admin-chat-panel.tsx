"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Thread = {
  id: string;
  subject: string;
  status: string;
  updatedAt: string;
  user: { name: string; email: string };
  messages: { id: string; body: string; senderRole: string; createdAt: string; status?: string; optimistic?: boolean }[];
};

type FetchedThread = Omit<Thread, "messages"> & {
  messages: Thread["messages"];
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

export function AdminChatPanel() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  async function loadThreads(silent = false) {
    if (silent) setRefreshing(true);
    try {
      const res = await fetch("/api/admin/chat");
      const data = await safeJson<{ data: { threads: FetchedThread[] } }>(res);
      if (!data) return;
      const fetchedThreads: FetchedThread[] = data.data.threads || [];
      setThreads(fetchedThreads);
      setActiveThreadId((current) =>
        current && fetchedThreads.some((thread) => thread.id === current)
          ? current
          : fetchedThreads[0]?.id ?? null
      );
    } finally {
      if (silent) setRefreshing(false);
      else setLoading(false);
    }
  }

  useEffect(() => {
    loadThreads();
    const timer = setInterval(() => loadThreads(true), 4000);
    return () => clearInterval(timer);
  }, []);

  const activeThread = useMemo(
    () => threads.find((thread) => thread.id === activeThreadId) ?? null,
    [activeThreadId, threads]
  );
  const latestUserMessageId = useMemo(() => {
    const userMessages = activeThread?.messages.filter((message) => message.senderRole === "user") || [];
    return userMessages[userMessages.length - 1]?.id ?? null;
  }, [activeThread]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeThread?.messages.length]);

  async function sendReply() {
    const text = reply.trim();
    if (!activeThreadId || !text || sending) return;
    setSending(true);
    const response = await fetch("/api/admin/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ threadId: activeThreadId, body: text })
    });
    setReply("");
    if (response.ok) {
      const data = await safeJson<{ thread: FetchedThread | null }>(response);
      if (data?.thread) {
        setThreads((current) => current.map((thread) => (thread.id === data.thread?.id ? data.thread! : thread)));
      } else {
        await loadThreads(true);
      }
    } else {
      await loadThreads(true);
    }
    setSending(false);
  }

  if (loading) {
    return <div className="rounded-[28px] border border-slate-200 bg-white p-6 text-slate-500">Loading chat threads...</div>;
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[320px_1fr]">
      <aside className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-950">Conversations</h2>
          <span className="text-xs text-slate-500">{refreshing ? "Refreshing" : `${threads.length} threads`}</span>
        </div>
        {threads.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-500">
            No conversations yet.
          </div>
        ) : (
          <div className="space-y-2">
            {threads.map((thread) => (
              <button
                key={thread.id}
                onClick={() => setActiveThreadId(thread.id)}
                className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                  activeThreadId === thread.id ? "border-slate-950 bg-slate-50" : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-slate-900">{thread.user.name}</p>
                  <span className="text-[11px] uppercase tracking-[0.14em] text-slate-500">{thread.status}</span>
                </div>
                <p className="mt-1 text-sm text-slate-600">{thread.subject}</p>
                <p className="mt-2 text-xs text-slate-400">{formatTime(thread.updatedAt)}</p>
              </button>
            ))}
          </div>
        )}
      </aside>

      <section className="flex min-h-[70vh] flex-col overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
        {!activeThread ? (
          <div className="flex flex-1 items-center justify-center px-6 text-center text-slate-500">
            Select a conversation to view messages.
          </div>
        ) : (
          <>
            <header className="border-b border-slate-200 px-5 py-4 sm:px-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Support thread</p>
                  <h3 className="text-xl font-semibold text-slate-950">{activeThread.user.name}</h3>
                  <p className="text-sm text-slate-500">{activeThread.user.email}</p>
                </div>
                <div className="text-right text-xs text-slate-500">
                  <p>{activeThread.status}</p>
                  <p>{refreshing ? "Refreshing..." : "Live inbox"}</p>
                </div>
              </div>
            </header>

            <div className="flex-1 space-y-3 overflow-y-auto bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_100%)] px-4 py-5 sm:px-6">
              {activeThread.messages.length === 0 ? (
                <div className="mx-auto mt-6 max-w-md rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center text-slate-500">
                  No messages yet.
                </div>
              ) : (
                activeThread.messages.map((message) => {
                  const isAdmin = message.senderRole === "admin";
                  const isLatestUser = message.id === latestUserMessageId && !isAdmin;
                  return (
                    <div key={message.id} className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[82%] rounded-[24px] px-4 py-3 shadow-sm sm:max-w-[70%] ${
                          isAdmin
                            ? "rounded-br-md bg-slate-950 text-white"
                            : "rounded-bl-md border border-slate-200 bg-white text-slate-900"
                        }`}
                        >
                        <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.body}</p>
                        <div className={`mt-2 flex items-center gap-2 text-[11px] ${isAdmin ? "text-slate-300" : "text-slate-400"}`}>
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
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Write a reply..."
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendReply();
                    }
                  }}
                  className="min-h-[52px] flex-1 resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                />
                <button
                  onClick={sendReply}
                  disabled={sending || !reply.trim()}
                  className="inline-flex h-[52px] items-center justify-center rounded-full bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {sending ? "Sending..." : "Send"}
                </button>
              </div>
            </footer>
          </>
        )}
      </section>
    </div>
  );
}
