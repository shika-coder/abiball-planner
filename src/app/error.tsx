"use client";

import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 text-center">
      <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Error</p>
      <h1 className="headline mt-4 text-6xl text-slate-950">Etwas ist schiefgelaufen</h1>
      <p className="mt-4 text-base leading-7 text-slate-600">
        {error.message || "Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es später erneut."}
      </p>
      <div className="mt-8 flex flex-wrap gap-4 justify-center">
        <button
          onClick={() => reset()}
          className="rounded-full bg-wine px-5 py-3 text-sm font-semibold text-white transition duration-300 hover:opacity-90"
        >
          Erneut versuchen
        </button>
        <Link href="/" className="rounded-full bg-slate-200 px-5 py-3 text-sm font-semibold text-slate-900 transition duration-300 hover:bg-slate-300">
          Zur Startseite
        </Link>
      </div>
    </main>
  );
}
