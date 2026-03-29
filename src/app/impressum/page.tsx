import { Navbar } from "@/components/navbar";

export const metadata = {
  title: "Impressum - Abiball Planer",
  description: "Legal information for Abiball Planer"
};

export default function ImpressumPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="text-4xl font-bold mb-6">Impressum (Legal Notice)</h1>
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold mt-8 mb-4">Angaben gemäß § 5 TMG</h2>
          
          <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 mb-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Abiball Planer</h3>
            <p className="text-slate-600 mb-2">
              [Your Company Name]<br />
              [Your Street Address]<br />
              [Your Postal Code and City]
            </p>
            <p className="text-slate-600 mb-2">
              <strong>Phone:</strong> [Your Phone Number]<br />
              <strong>Email:</strong> [Your Email Address]
            </p>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-2">Vertreter</h3>
          <p className="text-slate-600">
            [Your Name]<br />
            [Your Position]
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-2">Haftung für Inhalte</h3>
          <p className="text-slate-600">
            Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. 
            Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte 
            können wir jedoch keine Gewähr übernehmen.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-2">Haftung für Links</h3>
          <p className="text-slate-600">
            Unser Angebot enthält Links zu externen Websites. 
            Für deren Inhalte sind die jeweiligen Betreiber verantwortlich.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-2">Urheberrecht</h3>
          <p className="text-slate-600">
            Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten 
            unterliegen dem deutschen Urheberrecht.
          </p>

          <div className="mt-8 text-sm text-slate-500 border-t border-slate-200 pt-6">
            <p>
              Hinweis: Diese Seite enthält Platzhalterdaten. 
              Bitte aktualisieren Sie diese mit Ihren tatsächlichen Kontaktdaten.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
