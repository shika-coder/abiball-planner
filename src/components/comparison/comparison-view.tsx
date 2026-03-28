"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { locations as baseLocations } from "@/data/locations";
import { DEFAULT_GUESTS } from "@/lib/defaults";
import { euro, getBestValueLocation, getBudgetStatus, getCostPerStudent, getEstimatedTotal } from "@/lib/utils";
import type { Location } from "@/types/location";

const compareKey = "abiball.compare";
const customKey = "abiball.customLocations";

export function ComparisonView() {
  const [guests, setGuests] = useState(DEFAULT_GUESTS);
  const [ids, setIds] = useState<string[]>([]);
  const [customLocations, setCustomLocations] = useState<Location[]>([]);

  useEffect(() => {
    setIds(JSON.parse(localStorage.getItem(compareKey) || "[]") as string[]);
    setCustomLocations(JSON.parse(localStorage.getItem(customKey) || "[]") as Location[]);
  }, []);

  const locations = useMemo(() => [...customLocations, ...baseLocations], [customLocations]);
  const selected = useMemo(() => locations.filter((location) => ids.includes(location.id)), [ids, locations]);
  const bestValue = getBestValueLocation(selected, guests);

  if (selected.length === 0) {
    return (
      <section className="glass-panel rounded-[34px] p-10 text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Vergleich</p>
        <h2 className="headline mt-4 text-5xl text-slate-950">Noch keine Shortlist</h2>
        <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-600">
          Fügt auf der Startseite zwei oder drei Locations zum Vergleich hinzu. Die Auswahl wird
          im Browser gespeichert und hier als Matrix dargestellt.
        </p>
        <Link href="/" className="primary-button mt-8 inline-flex rounded-full px-5 py-3 text-sm font-semibold transition duration-300">
          Zur Startseite
        </Link>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      <div className="glass-panel rounded-[34px] p-6">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Matrix</p>
          <h2 className="headline mt-2 text-5xl text-slate-950">Direkter Venue-Vergleich</h2>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        {selected.map((location) => (
          <article
            key={location.id}
            className={`glass-panel overflow-hidden rounded-[32px] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(15,23,42,0.14)] ${
              bestValue?.id === location.id ? "ring-2 ring-blue-300/70" : ""
            }`}
          >
            <div className="relative h-72">
              <Image src={location.images[0]} alt={location.name} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">{location.district}</p>
                <h3 className="headline mt-2 text-4xl">{location.name}</h3>
              </div>
            </div>
            <div className="space-y-4 p-6">
              {bestValue?.id === location.id ? (
                <p className="rounded-full bg-[linear-gradient(135deg,#2563eb,#7c3aed)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white">
                  Best Value
                </p>
              ) : null}
              <div className="grid gap-3 rounded-[24px] border border-slate-200/70 bg-white/80 p-4 text-sm text-slate-700">
                <div className="flex items-center justify-between gap-4">
                  <span>Kapazität</span>
                  <strong>{location.capacity}</strong>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>Preis pro Person</span>
                  <strong>{euro.format(location.pricePerPerson)}</strong>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>Gesamtpreis</span>
                  <strong>{euro.format(getEstimatedTotal(location, guests))}</strong>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>Kosten pro Schüler:in</span>
                  <strong>{euro.format(getCostPerStudent(location, guests))}</strong>
                </div>
              </div>
              {getBudgetStatus(location, guests, 0, location.pricePerPerson).overCapacity ? (
                <p className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                  Kapazität überschritten bei {guests} Gästen.
                </p>
              ) : null}
              <div className="flex flex-wrap gap-2">
                {location.features.map((feature) => (
                  <span
                    key={feature}
                    className="rounded-full border border-slate-200/70 bg-white/85 px-3 py-1.5 text-xs font-semibold text-slate-700"
                  >
                    {feature}
                  </span>
                ))}
              </div>
              <p className="text-base leading-7 text-slate-600">{location.idealFor}</p>
              <Link
                href={`/locations/${location.id}`}
                className="secondary-button inline-flex rounded-full px-4 py-2.5 text-sm font-semibold transition duration-300"
              >
                Mehr ansehen
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
