"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Login failed");
      }

      router.push("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-[34px] border border-slate-200 bg-white/80 p-8 shadow-lg backdrop-blur">
          <div className="mb-8 text-center">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Admin Access</p>
            <h1 className="mt-3 text-3xl font-bold text-slate-950">Login</h1>
          </div>

          {error && (
            <div className="mb-6 rounded-[16px] bg-red-100 p-4 text-sm font-semibold text-red-800">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-950 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                className="w-full rounded-[16px] border border-slate-300 bg-white px-4 py-3 text-slate-950 placeholder-slate-500 focus:border-slate-950 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-950 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full rounded-[16px] border border-slate-300 bg-white px-4 py-3 text-slate-950 placeholder-slate-500 focus:border-slate-950 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-[16px] bg-slate-950 px-6 py-3 font-semibold text-white transition-all duration-300 hover:bg-slate-800 disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Back to{" "}
            <Link href="/" className="font-semibold text-slate-950 hover:underline">
              Home
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
