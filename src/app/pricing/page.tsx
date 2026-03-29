import { Navbar } from "@/components/navbar";
import Link from "next/link";

export const metadata = {
  title: "Pricing - Abiball Planer",
  description: "Pricing information for Abiball Planer"
};

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 px-5 sm:px-8 lg:px-10 pb-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12">
            <h1 className="text-5xl font-bold text-slate-900 mb-4">Kostenlos & einfach</h1>
            <p className="text-xl text-slate-600">
              Abiball Planer ist vollständig kostenlos. Keine versteckten Gebühren, keine Registrierung erforderlich.
            </p>
          </div>

          <div className="mb-16 grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-blue-50 to-blue-100/50 p-8">
              <div className="text-4xl mb-4">🆓</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Kostenlos</h3>
              <p className="text-slate-600">
                Vergleiche Locations, filtere nach Budget und Gästezahl – alles ohne Kosten.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-purple-50 to-purple-100/50 p-8">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Schnell</h3>
              <p className="text-slate-600">
                Finde die perfekte Location in wenigen Minuten statt Stunden recherchieren.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-green-50 to-green-100/50 p-8">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Präzise</h3>
              <p className="text-slate-600">
                Intelligente Empfehlungen basierend auf eurer Gästezahl und eurem Budget.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-orange-50 to-orange-100/50 p-8">
              <div className="text-4xl mb-4">📞</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Direkt</h3>
              <p className="text-slate-600">
                Kontaktiere Venues direkt über die Plattform – ohne Umschweife.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 p-8 md:p-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Warum kostenlos?</h2>
            <p className="text-lg text-slate-700 mb-6">
              Wir glauben, dass die Planung eures Abiballs nicht kompliziert oder teuer sein sollte. 
              Unsere Mission ist es, euch die beste Erfahrung zu bieten – komplett kostenlos.
            </p>
            <p className="text-slate-600 mb-8">
              Abiball Planer wird durch Partnerschaften mit Venues finanziert, nicht durch Gebühren von euch.
            </p>
            <Link
              href="/app"
              className="inline-block rounded-full bg-blue-600 px-8 py-3 font-semibold text-white hover:bg-blue-700 transition duration-300"
            >
              Jetzt kostenlos starten →
            </Link>
          </div>

          <div className="mt-16 rounded-2xl border border-slate-200 bg-white p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Häufig gestellte Fragen</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Muss ich mich registrieren?</h3>
                <p className="text-slate-600">
                  Nein! Du kannst die Plattform vollständig ohne Registrierung nutzen.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Gibt es versteckte Gebühren?</h3>
                <p className="text-slate-600">
                  Nein. Abiball Planer ist zu 100% kostenlos für alle Nutzer.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Wie verdient ihr Geld?</h3>
                <p className="text-slate-600">
                  Wir arbeiten mit Venues zusammen, die uns unterstützen. Das ermöglicht uns, dir einen kostenlosen Service anzubieten.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
