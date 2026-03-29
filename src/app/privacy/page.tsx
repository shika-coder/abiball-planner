import { Navbar } from "@/components/navbar";

export const metadata = {
  title: "Datenschutz - Abiball Planer",
  description: "Privacy Policy for Abiball Planer"
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="text-4xl font-bold mb-6">Datenschutz (Privacy Policy)</h1>
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold mt-8 mb-4">Datenschutzerklärung</h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-2">1. Verantwortlicher</h3>
          <p className="text-slate-600">
            Abiball Planer<br />
            [Your Company Address]
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-2">2. Erhobene Daten</h3>
          <p className="text-slate-600">
            Wir erheben und verarbeiten folgende personenbezogene Daten:
          </p>
          <ul className="list-disc pl-6 text-slate-600 space-y-1">
            <li>Name und E-Mail-Adresse (bei Buchungsanfragen)</li>
            <li>Schulname (bei Buchungsanfragen)</li>
            <li>Gästezahl und Budget (Suchfilter)</li>
            <li>Bevorzugte Veranstaltungsdatum</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-2">3. Verwendung der Daten</h3>
          <p className="text-slate-600">
            Ihre Daten werden ausschließlich zur Verarbeitung Ihrer Buchungsanfrage verwendet.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-2">4. Datenschutzrechte</h3>
          <p className="text-slate-600">
            Sie haben das Recht auf Auskunft, Berichtigung, Löschung und Widerspruch gegen die Verarbeitung Ihrer personenbezogenen Daten.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-2">5. Kontakt</h3>
          <p className="text-slate-600">
            Bei Fragen zum Datenschutz kontaktieren Sie uns bitte unter [your contact email].
          </p>
        </div>
      </main>
    </>
  );
}
