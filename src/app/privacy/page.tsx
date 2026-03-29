import { Navbar } from "@/components/navbar";
import Link from "next/link";

export const metadata = {
  title: "Datenschutz - Abiball Planer",
  description: "Privacy Policy for Abiball Planer"
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 px-5 sm:px-8 lg:px-10 pb-20">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12">
            <h1 className="text-5xl font-bold text-slate-900 mb-4">Datenschutzerklärung</h1>
            <p className="text-slate-600">
              Zuletzt aktualisiert: März 2026
            </p>
          </div>

          <div className="space-y-8">
            <section className="rounded-2xl border border-slate-200 bg-white p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Verantwortlicher</h2>
              <p className="text-slate-600 mb-4">
                <strong>Abiball Planer</strong><br />
                [Deine Adresse]<br />
                [Deine Stadt]
              </p>
              <p className="text-slate-600">
                E-Mail: <a href="mailto:info@abiball-planer.de" className="text-blue-600 hover:underline">info@abiball-planer.de</a>
              </p>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Erhobene Daten</h2>
              <p className="text-slate-600 mb-4">
                Wir erheben und verarbeiten folgende personenbezogene Daten:
              </p>
              <ul className="space-y-2 text-slate-600">
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 mt-1">•</span>
                  <span><strong>Name und E-Mail-Adresse</strong> (bei Buchungsanfragen)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 mt-1">•</span>
                  <span><strong>Schulname</strong> (bei Buchungsanfragen)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 mt-1">•</span>
                  <span><strong>Gästezahl und Budget</strong> (Suchfilter)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 mt-1">•</span>
                  <span><strong>Bevorzugte Veranstaltungsdatum</strong></span>
                </li>
              </ul>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Verwendung der Daten</h2>
              <p className="text-slate-600">
                Ihre Daten werden ausschließlich zur Verarbeitung Ihrer Buchungsanfrage verwendet. 
                Wir geben Ihre Daten nicht an Dritte weiter, außer an die von Ihnen gewählte Venue, 
                um Ihre Buchungsanfrage zu bearbeiten.
              </p>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Datenschutzrechte</h2>
              <p className="text-slate-600 mb-4">
                Sie haben das Recht auf:
              </p>
              <ul className="space-y-2 text-slate-600">
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 mt-1">•</span>
                  <span><strong>Auskunft</strong> über Ihre personenbezogenen Daten</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 mt-1">•</span>
                  <span><strong>Berichtigung</strong> unrichtiger Daten</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 mt-1">•</span>
                  <span><strong>Löschung</strong> Ihrer Daten</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 mt-1">•</span>
                  <span><strong>Widerspruch</strong> gegen die Verarbeitung</span>
                </li>
              </ul>
            </section>

            <section className="rounded-2xl border border-blue-200 bg-blue-50 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Kontakt zum Datenschutz</h2>
              <p className="text-slate-600 mb-4">
                Bei Fragen zum Datenschutz oder um Ihre Rechte auszuüben, kontaktieren Sie uns bitte unter:
              </p>
              <p className="text-slate-600">
                <strong>E-Mail:</strong> <a href="mailto:datenschutz@abiball-planer.de" className="text-blue-600 hover:underline">datenschutz@abiball-planer.de</a>
              </p>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
