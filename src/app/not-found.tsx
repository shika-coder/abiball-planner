import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 text-center">
      <p className="text-xs uppercase tracking-[0.35em] text-slate-400">404</p>
      <h1 className="headline mt-4 text-6xl text-slate-950">Location nicht gefunden</h1>
      <p className="mt-4 text-base leading-7 text-slate-600">
        Der Link ist nicht mehr aktuell oder die Location wurde im Mock-Datensatz noch nicht
        angelegt.
      </p>
      <Link href="/" className="mt-8 rounded-full bg-wine px-5 py-3 text-sm font-semibold text-white">
        Zur Startseite
      </Link>
    </main>
  );
}
