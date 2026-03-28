import Link from "next/link";

import { ComparisonView } from "@/components/comparison/comparison-view";

export default function ComparePage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-8 sm:px-8 lg:px-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Shortlist</p>
          <h1 className="headline mt-2 text-5xl text-slate-950 sm:text-6xl">Locations im Vergleich</h1>
        </div>
        <Link href="/" className="secondary-button rounded-full px-4 py-2.5 text-sm font-semibold transition duration-300">
          Zur Startseite
        </Link>
      </div>
      <ComparisonView />
    </main>
  );
}
