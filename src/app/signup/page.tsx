"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";

export default function SignUp() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    school: "",
    city: ""
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Fehler beim Registrieren");
        return;
      }

      router.push("/login?registered=true");
    } catch (err) {
      setError("Fehler beim Registrieren");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 px-5 sm:px-8 lg:px-10 pb-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Konto erstellen</h1>
            <p className="mt-2 text-slate-600">Melde dich an um Locations zu erkunden</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="block text-sm font-semibold text-slate-700 mb-1">Name</span>
              <input
                required
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="Dein Name"
              />
            </label>

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
                placeholder="Mindestens 8 Zeichen"
              />
            </label>

            <label className="block">
              <span className="block text-sm font-semibold text-slate-700 mb-1">Schule</span>
              <input
                required
                type="text"
                value={form.school}
                onChange={(e) => setForm({ ...form, school: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="Deine Schule"
              />
            </label>

            <label className="block">
              <span className="block text-sm font-semibold text-slate-700 mb-1">Stadt</span>
              <input
                required
                type="text"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="Hamburg"
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
              {loading ? "Wird registriert..." : "Konto erstellen"}
            </button>
          </form>

          <p className="mt-6 text-center text-slate-600">
            Du hast bereits ein Konto?{" "}
            <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-700">
              Jetzt anmelden
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}
