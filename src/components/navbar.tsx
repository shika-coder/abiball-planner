"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function Navbar() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const cookies = document.cookie;
    const match = cookies.match(/userId=([^;]+)/);
    setUserId(match ? match[1] : null);
  }, []);

  const handleLogout = () => {
    document.cookie = "userId=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    setUserId(null);
    router.push("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 border-b border-slate-200/50 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold text-slate-900">
            Abiball Planer
          </Link>

          <div className="flex items-center gap-6">
            <Link
              href="/app"
              className="text-sm font-semibold text-slate-700 hover:text-slate-900 transition duration-300"
            >
              Planen
            </Link>
            {userId ? (
              <>
                <Link
                  href="/profile"
                  className="text-sm font-semibold text-slate-700 hover:text-slate-900 transition duration-300"
                >
                  Profil
                </Link>
                <Link
                  href="/contact"
                  className="text-sm font-semibold text-slate-700 hover:text-slate-900 transition duration-300"
                >
                  Team Kontakt
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm font-semibold rounded-full bg-red-600 text-white px-4 py-2 hover:bg-red-700 transition duration-300"
                >
                  Abmelden
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/contact"
                  className="text-sm font-semibold text-slate-700 hover:text-slate-900 transition duration-300"
                >
                  Team Kontakt
                </Link>
                <Link
                  href="/login"
                  className="text-sm font-semibold text-slate-700 hover:text-slate-900 transition duration-300"
                >
                  Anmelden
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
