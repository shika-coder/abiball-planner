import { Navbar } from "@/components/navbar";
import Link from "next/link";

export const metadata = {
  title: "Impressum - Abiball Planer",
  description: "Legal information for Abiball Planer"
};

export default function ImpressumPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 px-5 sm:px-8 lg:px-10 pb-20">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12">
            <h1 className="text-5xl font-bold text-slate-900 mb-4">Impressum</h1>
            <p className="text-slate-600">
              Angaben gemäß § 5 TMG (Telemediengesetz)
            </p>
          </div>

          <div className="space-y-8">
            <section className="rounded-2xl border border-slate-200 bg-white p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Angaben zum Angebot</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Betreiber</h3>
                  <p className="text-slate-600">
                    <strong>Abiball Planer</strong><br />
                    [Dein Name oder Unternehmensname]
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Adresse</h3>
                  <p className="text-slate-600">
                    [Deine Straße]<br />
                    [Deine PLZ] [Deine Stadt]<br />
                    Deutschland
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Kontakt</h3>
                  <p className="text-slate-600">
                    <strong>E-Mail:</strong> <a href="mailto:info@abiball-planer.de" className="text-blue-600 hover:underline">info@abiball-planer.de</a><br />
                    <strong>Telefon:</strong> [Deine Telefonnummer]
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Vertreter</h2>
              <p className="text-slate-600">
                [Dein Name]<br />
                [Deine Position/Rolle]
              </p>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Haftung für Inhalte</h2>
              <p className="text-slate-600">
                Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. 
                Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte 
                können wir jedoch keine Gewähr übernehmen. Als Diensteanbieter sind wir gemäß 
                § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den 
                allgemeinen Gesetzen verantwortlich.
              </p>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Haftung für Links</h2>
              <p className="text-slate-600">
                Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte 
                wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch 
                keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der 
                jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
              </p>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Urheberrecht</h2>
              <p className="text-slate-600">
                Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten 
                unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, 
                Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes 
                bedürfen der schriftlichen Zustimmung des Autors oder Erstellers.
              </p>
            </section>

            <section className="rounded-2xl border border-blue-200 bg-blue-50 p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">⚠️ Hinweis</h2>
              <p className="text-slate-600 text-sm">
                Diese Seite enthält Platzhalterdaten. 
                Bitte aktualisieren Sie alle Angaben mit Ihren tatsächlichen Kontaktdaten und Informationen,
                bevor Sie die Website öffentlich machen.
              </p>
            </section>

            <div className="flex gap-4 mt-12">
              <Link
                href="/privacy"
                className="text-blue-600 hover:underline text-sm"
              >
                ← Datenschutz
              </Link>
              <Link
                href="/"
                className="text-blue-600 hover:underline text-sm"
              >
                Startseite →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
