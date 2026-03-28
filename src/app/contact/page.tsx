import { Navbar } from "@/components/navbar";

export default function Contact() {
  return (
    <>
      <Navbar />
      <main className="pt-24 px-5 sm:px-8 lg:px-10 pb-20">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold text-slate-900">Team Kontakt</h1>
          <p className="mt-4 text-slate-600">Kontaktiere uns für Fragen oder Unterstützung.</p>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-8">
              <h2 className="text-xl font-bold text-slate-900">📧 E-Mail</h2>
              <p className="mt-4 text-slate-600">Schreib uns für allgemeine Fragen und Anfragen.</p>
              <a
                href="mailto:info@abiball-planer.de"
                className="mt-6 inline-block rounded-full bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                E-Mail senden
              </a>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-8">
              <h2 className="text-xl font-bold text-slate-900">📱 Telefon</h2>
              <p className="mt-4 text-slate-600">Rufe uns an für schnelle Unterstützung.</p>
              <a
                href="tel:+49401234567"
                className="mt-6 inline-block rounded-full bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Anrufen
              </a>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-8">
              <h2 className="text-xl font-bold text-slate-900">💬 Chat Support</h2>
              <p className="mt-4 text-slate-600">Chatte direkt mit unserem Support-Team.</p>
              <button className="mt-6 rounded-full bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                Chat starten
              </button>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-8">
              <h2 className="text-xl font-bold text-slate-900">🕒 Öffnungszeiten</h2>
              <p className="mt-4 space-y-2 text-slate-600">
                <span className="block">Mo-Fr: 09:00 - 18:00</span>
                <span className="block">Sa-So: 10:00 - 16:00</span>
              </p>
            </div>
          </div>

          <div className="mt-12 rounded-2xl border border-blue-200 bg-blue-50 p-8">
            <h2 className="text-2xl font-bold text-slate-900">Nachricht senden</h2>
            <form className="mt-6 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  type="text"
                  placeholder="Dein Name"
                  className="rounded-lg border border-slate-300 px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <input
                  type="email"
                  placeholder="Deine E-Mail"
                  className="rounded-lg border border-slate-300 px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <textarea
                placeholder="Deine Nachricht..."
                rows={5}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              ></textarea>
              <button
                type="submit"
                className="rounded-full bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
              >
                Nachricht senden
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
