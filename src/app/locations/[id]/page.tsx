import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BookingRequestButton } from "@/components/booking-request-button";
import { BudgetCalculator } from "@/components/budget-calculator";
import { locations } from "@/data/locations";
import { euro, getEstimatedTotal, getValueScore } from "@/lib/utils";

export function generateStaticParams() {
  return locations.map((location) => ({ id: location.id }));
}

export default async function LocationDetail({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const location = locations.find((entry) => entry.id === id);

  if (!location) {
    notFound();
  }

  const valueScore = getValueScore(location);

  return (
    <main className="mx-auto max-w-7xl px-6 py-8 sm:px-8 lg:px-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <Link href="/" className="secondary-button rounded-full px-4 py-2.5 text-sm font-semibold transition duration-300">
          Zur Suche
        </Link>
        <div className="flex flex-wrap gap-3">
          <BookingRequestButton
            location={location}
            initialGuests={450}
            label="Jetzt anfragen"
            className="primary-button rounded-full px-4 py-2.5 text-sm font-semibold transition duration-300"
          />
          <a
            href={location.website}
            target="_blank"
            rel="noreferrer"
            className="secondary-button rounded-full px-4 py-2.5 text-sm font-semibold transition duration-300"
          >
            Verfügbarkeit prüfen
          </a>
        </div>
      </div>

      <section className="glass-panel overflow-hidden rounded-[38px]">
        <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="grid gap-2 p-2 sm:grid-cols-2">
            {location.images.map((image, index) => (
              <div
                key={image}
                className={`relative overflow-hidden rounded-[28px] ${index === 0 ? "sm:col-span-2 h-[420px]" : "h-[240px]"}`}
              >
                <Image
                  src={image}
                  alt={location.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 to-transparent" />
              </div>
            ))}
          </div>
          <div className="min-w-0 p-8 [overflow-wrap:anywhere]">
            <div className="flex flex-wrap gap-2">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  location.featured ? "bg-slate-950 text-white" : "bg-white/80 text-slate-700"
                }`}
              >
                {location.placementLabel}
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                {location.venueType}
              </span>
              <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
                {location.urgencyLabel}
              </span>
            </div>
            <p className="mt-4 text-xs uppercase tracking-[0.35em] text-sky-700">{location.district}</p>
            <h1 className="headline mt-3 text-4xl text-slate-950 sm:text-5xl">{location.name}</h1>
            <p className="mt-4 text-base leading-8 text-slate-600">{location.description}</p>
            <p className="mt-5 rounded-[24px] bg-slate-950 px-5 py-4 text-sm leading-6 text-white">
              {location.idealFor}
            </p>
            <div className="mt-5 rounded-[24px] border border-blue-100 bg-[linear-gradient(135deg,rgba(239,246,255,0.92),rgba(245,243,255,0.92))] p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-blue-700">Bestes Setup für Conversion</p>
                  <p className="mt-2 text-base font-semibold text-slate-950">Beliebt bei Abschlussklassen</p>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                  Value Score {valueScore}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-700">
                Für große Jahrgänge mit klarer Preisstruktur, starker Technik und hoher Sichtbarkeit im Recommendation-Flow.
              </p>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[24px] border border-slate-200/70 bg-white/80 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Preis pro Person</p>
                <p className="headline mt-2 text-4xl text-slate-950">
                  {euro.format(location.pricePerPerson)}
                </p>
              </div>
              <div className="rounded-[24px] bg-slate-950 p-4 text-white shadow-lg">
                <p className="text-xs uppercase tracking-[0.22em] text-white/50">Kapazität</p>
                <p className="headline mt-2 text-4xl">
                  {location.minimumGuests}-{location.capacity}
                </p>
              </div>
              <div className="rounded-[24px] bg-[linear-gradient(135deg,#2563eb,#7c3aed)] p-4 text-white shadow-lg">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Beispiel bei 450 Gästen</p>
                <p className="headline mt-2 text-4xl">
                  {euro.format(getEstimatedTotal(location, 450))}
                </p>
              </div>
              <div className="rounded-[24px] border border-slate-200/70 bg-white/80 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Format</p>
                <p className="headline mt-2 text-4xl text-slate-950">{location.venueType}</p>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <BookingRequestButton
                location={location}
                initialGuests={450}
                label="Angebot erhalten"
                className="primary-button rounded-full px-5 py-3 text-sm font-semibold transition duration-300"
              />
              <a
                href={location.website}
                target="_blank"
                rel="noreferrer"
                className="secondary-button rounded-full px-5 py-3 text-sm font-semibold transition duration-300"
              >
                Venue-Website
              </a>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {location.features.map((feature) => (
                <span key={feature} className="rounded-full border border-slate-200/70 bg-white/85 px-4 py-2 text-sm font-semibold">
                  {feature}
                </span>
              ))}
            </div>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Adresse</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">{location.address}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Kontakt</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {location.contactEmail}
                  <br />
                  {location.contactPhone}
                </p>
              </div>
            </div>
            <div className="mt-8">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Inklusive</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                {location.includedServices.map((service) => (
                  <li key={service} className="rounded-2xl border border-slate-200/70 bg-white/85 px-4 py-3">
                    {service}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-8">
        <BudgetCalculator location={location} />
      </div>
    </main>
  );
}
