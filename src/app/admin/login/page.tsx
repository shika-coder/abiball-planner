"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
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
        body: JSON.stringify({ username, password })
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
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.12),_transparent_40%),linear-gradient(180deg,#f8fafc_0%,#ffffff_100%)] px-4 pb-10 pt-24 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-3xl items-center justify-center">
        <div className="w-full max-w-md rounded-[34px] border border-slate-200 bg-white p-8 shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
          <div className="mb-8 text-center">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Admin Access</p>
            <h1 className="mt-3 text-3xl font-bold text-slate-950">Login</h1>
            <p className="mt-3 text-sm text-slate-600">Use your admin credentials to manage conversations and venues.</p>
          </div>

          {error && (
            <div className="mb-6 rounded-[16px] border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-800">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="username" className="mb-2 block text-sm font-semibold text-slate-950">
                Username or email
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                required
                autoComplete="username"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 placeholder-slate-500 outline-none transition focus:border-slate-400 focus:bg-white focus:shadow-sm"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-950">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 placeholder-slate-500 outline-none transition focus:border-slate-400 focus:bg-white focus:shadow-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-slate-950 px-6 py-3 font-semibold text-white shadow-sm transition-all duration-300 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
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
