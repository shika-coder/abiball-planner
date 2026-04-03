"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { getLocations } from "@/lib/location-api";

export function LandingPage() {
  const [featuredLocations, setFeaturedLocations] = useState<any[]>([]);
  const [session, setSession] = useState<{ loggedIn: boolean } | null>(null);

  useEffect(() => {
    getLocations()
      .then((locations) => setFeaturedLocations(locations.slice(0, 3)))
      .catch(() => setFeaturedLocations([]));
    fetch("/api/auth/session")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setSession(data ? { loggedIn: true } : { loggedIn: false }))
      .catch(() => setSession({ loggedIn: false }));
  }, []);
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
    viewport: { once: true, margin: "-100px" },
  };

  const staggerContainer = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    transition: { staggerChildren: 0.1 },
    viewport: { once: true, margin: "-100px" },
  };

  const scrollToHowItWorks = () => {
    const element = document.getElementById("how-it-works");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const fallbackVenueImage = "/images/custom-venue-1.svg";

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-purple-50/30 -z-10" />
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl -z-10"
          animate={{
            y: [0, 50, 0],
            x: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div>
              <span className="inline-block px-4 py-2 rounded-full bg-blue-100/80 text-blue-700 text-sm font-semibold">
                🎉 Abiball in Hamburg
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-950 leading-tight">
              Finde die perfekte Abiball Location{" "}
              <span className="text-blue-600">in Minuten</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Vergleiche die besten Locations in Hamburg für 300–1000 Gäste –
              schnell, einfach und kostenlos
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Link href="/app">
                <button className="primary-button px-8 py-4 text-lg font-semibold rounded-xl transition duration-300 hover:scale-105 active:scale-95 w-full sm:w-auto">
                  Jetzt planen starten
                </button>
              </Link>
              <button 
                onClick={scrollToHowItWorks}
                className="px-8 py-4 text-lg font-semibold rounded-xl border-2 border-slate-300 text-slate-900 hover:border-slate-400 transition duration-300 hover:scale-105 active:scale-95 w-full sm:w-auto"
              >
                So funktioniert&apos;s
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto max-w-5xl rounded-[32px] border border-slate-200 bg-slate-950 px-8 py-10 text-white">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl space-y-3">
              <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Support</p>
              <h2 className="text-3xl font-bold">Chat with us like WhatsApp 💬</h2>
              <p className="text-slate-300">Quick support for venues, planning, and booking questions. Logged-in users can message directly.</p>
            </div>
            <Link href={session?.loggedIn ? "/contact" : "/login"} className="inline-flex rounded-full bg-white px-6 py-3 font-semibold text-slate-950">
              {session?.loggedIn ? "Open Chat" : "Login to contact us"}
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-16"
            {...fadeInUp}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-950 mb-4">
              So funktioniert&apos;s
            </h2>
            <p className="text-xl text-slate-600">
              3 einfache Schritte zum perfekten Abiball
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-100px" }}
          >
            {[
              {
                icon: "📋",
                title: "Präferenzen eingeben",
                description: "Gäste, Budget und Wünsche – alles in 2 Minuten",
              },
              {
                icon: "✨",
                title: "Passende Locations erhalten",
                description: "Intelligente Vorschläge basierend auf euren Anforderungen",
              },
              {
                icon: "📞",
                title: "Anfrage senden & buchen",
                description: "Direkt Kontakt aufnehmen und Abiball planen",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                className="text-center space-y-4"
                variants={fadeInUp}
              >
                <div className="text-6xl">{step.icon}</div>
                <h3 className="text-xl font-semibold text-slate-900">
                  {step.title}
                </h3>
                <p className="text-slate-600">{step.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-16"
            {...fadeInUp}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-950 mb-4">
              Warum Abiball Planer?
            </h2>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-100px" }}
          >
            {[
              {
                icon: "⏱️",
                title: "Spare Stunden an Recherche",
                description: "Alle Hamburger Locations übersichtlich auf einen Blick",
              },
              {
                icon: "💰",
                title: "Vergleiche Preise auf einen Blick",
                description: "Transparente Preisberechnung und Kostenvergleich",
              },
              {
                icon: "👥",
                title: "Perfekt für große Abibälle",
                description: "Spezialisiert auf 300–1000 Gäste Events",
              },
            ].map((benefit, index) => (
              <motion.div
                key={index}
                className="p-8 bg-white rounded-2xl shadow-sm hover:shadow-md transition duration-300"
                variants={fadeInUp}
              >
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-slate-600">{benefit.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Locations Preview */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-16"
            {...fadeInUp}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-950 mb-4">
              Beliebte Locations in Hamburg
            </h2>
            <p className="text-xl text-slate-600">
              Handverlesene Venues für dein perfektes Event
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8 mb-12"
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-100px" }}
          >
            {(featuredLocations.length > 0 ? featuredLocations : []).map((venue, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl overflow-hidden hover:shadow-lg transition duration-300 border border-slate-200"
                variants={fadeInUp}
              >
                <div className="relative h-48 w-full">
                  <Image
                    src={venue.images?.[0] || fallbackVenueImage}
                    alt={venue.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="p-8 space-y-4">
                  <h3 className="text-xl font-semibold text-slate-900">
                    {venue.name}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p className="text-slate-600">
                      <strong>Kapazität:</strong> {venue.capacity}
                    </p>
                    <p className="text-slate-600">
                      <strong>Preis:</strong> €{venue.pricePerPerson} p.P.
                    </p>
                    <p className="text-slate-600">
                      <strong>Style:</strong> {Array.isArray(venue.styleTags) ? venue.styleTags.join(", ") : venue.venueType}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
            {featuredLocations.length === 0 && (
              <div className="col-span-3 rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
                No venues available yet.
              </div>
            )}
          </motion.div>

          <motion.div
            className="text-center"
            {...fadeInUp}
          >
            <Link href="/app">
              <button className="text-lg font-semibold text-blue-600 hover:text-blue-700 transition duration-300">
                Alle Locations ansehen →
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center space-y-12"
            {...fadeInUp}
          >
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-950 mb-4">
                Bereits von vielen genutzt
              </h2>
              <p className="text-xl text-slate-600">
                Vertraut von Abschlussklassen in Hamburg
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {[
                { stat: "20+", label: "Schulen und Klassen" },
                { stat: "5000+", label: "Glückliche Gäste" },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="text-center p-8 bg-white rounded-2xl"
                  variants={fadeInUp}
                >
                  <div className="text-5xl font-bold text-blue-600 mb-2">
                    {item.stat}
                  </div>
                  <p className="text-lg text-slate-600">{item.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <motion.div
            className="text-center space-y-8"
            {...fadeInUp}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-950">
              Unsere Vision
            </h2>

            <p className="text-lg text-slate-600 leading-relaxed">
              Wir machen die Planung von Abibällen einfacher, transparenter und
              digital. Unser Ziel ist es, Schülern den Zugang zu den besten
              Locations zu erleichtern und gleichzeitig Veranstaltern neue
              Kunden zu bringen.
            </p>

            <p className="text-lg text-slate-600 leading-relaxed">
              Mit Abiball Planer spart ihr Zeit bei der Recherche, habt
              Transparenz bei den Preisen und könnt euer Event zu euren
              Bedingungen planen.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            className="space-y-8"
            {...fadeInUp}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-950">
              Starte jetzt deine Abiball-Planung
            </h2>

            <p className="text-xl text-slate-600">
              Keine Registrierung nötig – einfach Location vergleichen und buchen
            </p>

            <Link href="/app">
              <button className="primary-button px-10 py-5 text-xl font-semibold rounded-xl transition duration-300 hover:scale-105 active:scale-95 mt-8">
                Abiball planen
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-white border-t border-slate-200">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-slate-900 mb-4">
                Abiball Planer
              </h3>
              <p className="text-sm text-slate-600">
                Die einfachste Lösung für deine Abiball-Planung in Hamburg
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Produkt</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/app" className="text-slate-600 hover:text-slate-900">
                    Locations vergleichen
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-slate-600 hover:text-slate-900">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Unternehmen</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/contact" className="text-slate-600 hover:text-slate-900">
                    Kontakt
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-slate-600 hover:text-slate-900">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/privacy" className="text-slate-600 hover:text-slate-900">
                    Datenschutz
                  </Link>
                </li>
                <li>
                  <Link href="/impressum" className="text-slate-600 hover:text-slate-900">
                    Impressum
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-8 text-center text-sm text-slate-600">
            <p>© 2026 Abiball Planer. Alle Rechte vorbehalten.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
