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
    <main className="min-h-screen pt-20 px-5 sm:px-8 lg:px-10 pb-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-md">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Anmelden</h1>
          <p className="mt-2 text-slate-600">Melde dich an um dein Profil zu sehen</p>
        </div>

        {success && (
          <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
            Konto erfolgreich erstellt! Melde dich jetzt an.
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="block text-sm font-semibold text-slate-700 mb-1">E-Mail</span>
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              placeholder="deine@email.de"
            />
          </label>

          <label className="block">
            <span className="block text-sm font-semibold text-slate-700 mb-1">Passwort</span>
            <input
              required
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              placeholder="Dein Passwort"
            />
          </label>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {loading ? "Wird angemeldet..." : "Anmelden"}
          </button>
        </form>

        <p className="mt-6 text-center text-slate-600">
          Du hast noch kein Konto?{" "}
          <Link href="/signup" className="font-semibold text-blue-600 hover:text-blue-700">
            Jetzt registrieren
          </Link>
        </p>
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
