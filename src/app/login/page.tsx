"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/navbar";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      setSuccess(true);
    }
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Fehler beim Anmelden");
        return;
      }

      router.push("/profile");
    } catch (err) {
      setError("Fehler beim Anmelden");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),_transparent_35%),linear-gradient(180deg,#f8fafc_0%,#ffffff_100%)] px-4 pb-10 pt-24 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-3xl items-center justify-center">
        <div className="w-full max-w-md rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
          <div className="mb-8 text-center">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">User Access</p>
            <h1 className="mt-3 text-3xl font-bold text-slate-950">Anmelden</h1>
            <p className="mt-3 text-sm text-slate-600">Melde dich an, um deine Chats und Profilinfos zu sehen.</p>
          </div>

          {success && (
            <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
              Konto erfolgreich erstellt. Du kannst dich jetzt anmelden.
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-slate-700">E-Mail</span>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white focus:shadow-sm"
                placeholder="deine@email.de"
                autoComplete="email"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-slate-700">Passwort</span>
              <input
                required
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white focus:shadow-sm"
                placeholder="Dein Passwort"
                autoComplete="current-password"
              />
            </label>

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-slate-950 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Wird angemeldet..." : "Anmelden"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Du hast noch kein Konto?{" "}
            <Link href="/signup" className="font-semibold text-slate-950 hover:underline">
              Jetzt registrieren
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default function Login() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div className="pt-24 text-center">Wird geladen...</div>}>
        <LoginContent />
      </Suspense>
    </>
  );
}
