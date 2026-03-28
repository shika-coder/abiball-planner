"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

import { locationFeatures } from "@/data/locations";
import type { Location, LocationStyle } from "@/types/location";

const storageKey = "abiball.customLocations";

const emptyDraft = {
  id: "",
  name: "",
  city: "Hamburg",
  district: "",
  featured: false,
  placementLabel: "Beliebt",
  urgencyLabel: "Beliebt bei Abschlussklassen",
  venueType: "Event Hall",
  featuredBadge: "Custom",
  address: "",
  capacity: 300,
  minimumGuests: 150,
  pricePerPerson: 79,
  description: "",
  idealFor: "",
  website: "https://example.com/location",
  bookingLink: "https://example.com/location/book",
  contactEmail: "booking@example.com",
  contactPhone: "+49 40 000 00 00",
  imageA: "/images/custom-venue-1.svg",
  imageB: "/images/custom-venue-2.svg"
  ,
  styleTags: ["Modern"]
};

export function AdminLab() {
  const [draft, setDraft] = useState(emptyDraft);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    "Indoor",
    "Catering included"
  ]);
  const [selectedStyles, setSelectedStyles] = useState<LocationStyle[]>(["Modern"]);
  const styleOptions: LocationStyle[] = ["Modern", "Industrial", "Luxury"];
  const [customLocations, setCustomLocations] = useState<Location[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      setCustomLocations(JSON.parse(raw) as Location[]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(customLocations));
  }, [customLocations]);

  const formattedJson = useMemo(() => JSON.stringify(customLocations, null, 2), [customLocations]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const id =
      draft.id.trim() ||
      draft.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    const entry: Location = {
      id,
      name: draft.name,
      city: draft.city,
      district: draft.district,
      featured: draft.featured,
      placementLabel: draft.placementLabel,
      urgencyLabel: draft.urgencyLabel,
      venueType: draft.venueType,
      featuredBadge: draft.featuredBadge,
      address: draft.address,
      capacity: draft.capacity,
      minimumGuests: draft.minimumGuests,
      pricePerPerson: draft.pricePerPerson,
      description: draft.description,
      images: [draft.imageA, draft.imageB],
      features: selectedFeatures as Location["features"],
      idealFor: draft.idealFor || "Custom location imported via Admin Lab.",
      website: draft.website,
      bookingLink: draft.bookingLink,
      contactEmail: draft.contactEmail,
      contactPhone: draft.contactPhone,
      includedServices: ["custom venue import", "manual contact review"]
      ,
      styleTags: selectedStyles as Location["styleTags"]
    };

    setCustomLocations((current) => [entry, ...current.filter((item) => item.id !== id)]);
    setDraft(emptyDraft);
  }

  function toggleFeature(feature: string) {
    setSelectedFeatures((current) =>
      current.includes(feature) ? current.filter((item) => item !== feature) : [...current, feature]
    );
  }

  function toggleStyle(style: LocationStyle) {
    setSelectedStyles((current) =>
      current.includes(style) ? current.filter((item) => item !== style) : [...current, style]
    );
  }

  function removeLocation(id: string) {
    setCustomLocations((current) => current.filter((entry) => entry.id !== id));
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <form
        onSubmit={handleSubmit}
        className="surface rounded-[30px] border border-white/70 p-6 shadow-soft"
      >
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Admin Lab</p>
        <h2 className="headline mt-2 text-4xl text-slate-900">Location lokal ergänzen</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {[
            ["name", "Name"],
            ["district", "Stadtteil"],
            ["placementLabel", "Placement Label"],
            ["urgencyLabel", "Urgency Label"],
            ["venueType", "Venue-Typ"],
            ["featuredBadge", "Badge"],
            ["address", "Adresse"],
            ["contactEmail", "Kontakt E-Mail"],
            ["contactPhone", "Kontakt Telefon"],
            ["website", "Website"],
            ["bookingLink", "Buchungslink"]
          ].map(([key, label]) => (
            <label key={key} className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">{label}</span>
              <input
                required={key === "name" || key === "district" || key === "address"}
                value={draft[key as keyof typeof emptyDraft] as string}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, [key]: event.target.value }))
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
              />
            </label>
          ))}
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Featured</span>
            <select
              value={draft.featured ? "true" : "false"}
              onChange={(event) =>
                setDraft((current) => ({ ...current, featured: event.target.value === "true" }))
              }
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
            >
              <option value="false">Nein</option>
              <option value="true">Ja</option>
            </select>
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Kapazität</span>
            <input
              type="number"
              value={draft.capacity}
              onChange={(event) =>
                setDraft((current) => ({ ...current, capacity: Number(event.target.value) }))
              }
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Mindestgäste</span>
            <input
              type="number"
              value={draft.minimumGuests}
              onChange={(event) =>
                setDraft((current) => ({ ...current, minimumGuests: Number(event.target.value) }))
              }
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Preis pro Person</span>
            <input
              type="number"
              value={draft.pricePerPerson}
              onChange={(event) =>
                setDraft((current) => ({ ...current, pricePerPerson: Number(event.target.value) }))
              }
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
            />
          </label>
          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-semibold text-slate-700">Beschreibung</span>
            <textarea
              rows={5}
              value={draft.description}
              onChange={(event) =>
                setDraft((current) => ({ ...current, description: event.target.value }))
              }
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
            />
          </label>
          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-semibold text-slate-700">Ideal für</span>
            <textarea
              rows={3}
              value={draft.idealFor}
              onChange={(event) =>
                setDraft((current) => ({ ...current, idealFor: event.target.value }))
              }
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
            />
          </label>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {locationFeatures.map((feature) => (
            <button
              key={feature}
              type="button"
              onClick={() => toggleFeature(feature)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                selectedFeatures.includes(feature)
                  ? "bg-wine text-white"
                  : "border border-slate-300 text-slate-700"
              }`}
            >
              {feature}
            </button>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {styleOptions.map((style) => (
            <button
              key={style}
              type="button"
              onClick={() => toggleStyle(style)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                selectedStyles.includes(style)
                  ? "bg-slate-950 text-white"
                  : "border border-slate-300 text-slate-700"
              }`}
            >
              {style}
            </button>
          ))}
        </div>
        <button
          type="submit"
          className="mt-6 rounded-full bg-pine px-5 py-3 text-sm font-semibold text-white"
        >
          Location speichern
        </button>
      </form>
      <div className="space-y-6">
        <div className="surface rounded-[30px] border border-white/70 p-6 shadow-soft">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Preview</p>
          <h3 className="headline mt-2 text-3xl text-slate-900">Persistiert im Browser</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Dieses MVP nutzt Mock-Daten plus lokale Erweiterungen via <code>localStorage</code>.
            Für ein echtes Admin-System kann dieselbe Struktur direkt in PostgreSQL oder Prisma
            überführt werden.
          </p>
          <div className="mt-5 space-y-3">
            {customLocations.length === 0 ? (
              <p className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-600">
                Noch keine zusätzlichen Locations gespeichert.
              </p>
            ) : (
              customLocations.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between gap-4 rounded-2xl bg-slate-950 px-4 py-4 text-white"
                >
                  <div>
                    <p className="font-semibold">{entry.name}</p>
                    <p className="text-sm text-white/70">{entry.address}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeLocation(entry.id)}
                    className="rounded-full border border-white/20 px-3 py-1 text-xs"
                  >
                    Löschen
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="surface rounded-[30px] border border-white/70 p-6 shadow-soft">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">JSON Export</p>
          <pre className="mt-4 overflow-x-auto rounded-[24px] bg-slate-950 p-5 text-xs text-emerald-200">
            {formattedJson || "[]"}
          </pre>
        </div>
      </div>
    </div>
  );
}
