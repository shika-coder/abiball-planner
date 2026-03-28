"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import { BookingRequestButton } from "@/components/booking-request-button";
import { euro, getBudgetStatus, getCostPerStudent, getEstimatedTotal, getValueScore } from "@/lib/utils";
import type { Location } from "@/types/location";

type Props = {
  location: Location | null;
  guests: number;
  budgetPerPerson: number;
  totalBudget: number;
  isFavorite: boolean;
  isComparing: boolean;
  onClose: () => void;
  onToggleFavorite: (id: string) => void;
  onToggleCompare: (id: string) => void;
};

export function QuickViewModal({
  location,
  guests,
  budgetPerPerson,
  totalBudget,
  isFavorite,
  isComparing,
  onClose,
  onToggleFavorite,
  onToggleCompare
}: Props) {
  useEffect(() => {
    if (!location) {
      return;
    }

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [location]);

  useEffect(() => {
    if (!location) {
      return;
    }

    function handleKeydown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeydown);

    return () => window.removeEventListener("keydown", handleKeydown);
  }, [location, onClose]);

  if (!location) {
    return null;
  }

  const status = getBudgetStatus(location, guests, totalBudget, budgetPerPerson);
  const valueScore = getValueScore(location);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 py-6 backdrop-blur-md sm:px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`quick-view-${location.id}`}
        className="glass-panel flex max-h-[80vh] w-full max-w-[900px] flex-col overflow-hidden rounded-[28px] shadow-[0_32px_100px_rgba(15,23,42,0.28)]"
        initial={{ opacity: 0, scale: 0.97, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 24 }}
        transition={{ duration: 0.24, ease: "easeOut" }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4 border-b border-slate-200/70 px-5 py-4 sm:px-7">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Quick View</p>
            <h2 id={`quick-view-${location.id}`} className="headline break-words text-2xl text-slate-950 sm:text-3xl">
              {location.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="secondary-button shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition duration-300"
          >
            Schließen
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-7 sm:py-6">
          <div className="grid gap-6 lg:grid-cols-[0.98fr_1.02fr]">
            <div className="grid auto-rows-[150px] gap-3 sm:grid-cols-2 lg:sticky lg:top-0 lg:self-start">
              {location.images.slice(0, 4).map((image, index) => (
                <div
                  key={image}
                  className={`relative overflow-hidden rounded-[24px] ${
                    index === 0 ? "sm:col-span-2 sm:row-span-2 sm:min-h-[320px]" : ""
                  }`}
                >
                  <Image
                    src={image}
                    alt={location.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 to-transparent" />
                </div>
              ))}
            </div>

            <div className="min-w-0 space-y-5 break-words [overflow-wrap:anywhere]">
              <div className="flex flex-wrap gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    location.featured ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {location.placementLabel}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  {location.venueType}
                </span>
                <span className="rounded-full bg-[linear-gradient(135deg,#2563eb,#7c3aed)] px-3 py-1 text-xs font-semibold text-white">
                  {location.district}
                </span>
                <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
                  {location.urgencyLabel}
                </span>
              </div>

              <p className="text-base leading-7 text-slate-600">{location.description}</p>

              <div className="grid gap-3 rounded-[24px] border border-slate-200/70 bg-white/80 p-4 text-sm text-slate-700 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Kapazität</p>
                  <p className="mt-1 font-semibold">
                    {location.minimumGuests}-{location.capacity} Gäste
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Preis pro Person</p>
                  <p className="mt-1 font-semibold">{euro.format(location.pricePerPerson)}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Gesamtkosten</p>
                  <p className="mt-1 font-semibold">{euro.format(getEstimatedTotal(location, guests))}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Pro Schüler:in</p>
                  <p className="mt-1 font-semibold">{euro.format(getCostPerStudent(location, guests))}</p>
                </div>
              </div>

              <p className="rounded-[24px] bg-slate-950 px-5 py-4 text-sm leading-7 text-white">
                {location.idealFor}
              </p>

              <div className="rounded-[24px] border border-blue-100 bg-[linear-gradient(135deg,rgba(239,246,255,0.92),rgba(245,243,255,0.92))] p-4 text-sm text-slate-700">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-semibold text-slate-950">Schnelle Conversion-Ansprache</p>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                    Value Score {valueScore}
                  </span>
                </div>
                <p className="mt-2 leading-6">
                  Stark für große Abschlussklassen, klar in der Kalkulation und mit hoher Sichtbarkeit im Listing.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {location.features.map((feature) => (
                  <span
                    key={feature}
                    className="rounded-full border border-slate-200/70 bg-white/85 px-3 py-2 text-xs font-semibold text-slate-700"
                  >
                    {feature}
                  </span>
                ))}
              </div>

              <div className="space-y-2 text-sm">
                {status.overBudget ? (
                  <p className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-rose-700">
                    Die geschätzten Kosten liegen über eurem gesetzten Budget.
                  </p>
                ) : (
                  <p className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-emerald-700">
                    Die aktuelle Kalkulation liegt innerhalb eures Budgets.
                  </p>
                )}
                {status.overCapacity ? (
                  <p className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-amber-700">
                    Eure Gästezahl überschreitet die maximale Kapazität dieser Location.
                  </p>
                ) : null}
                {status.belowMinimum ? (
                  <p className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-sky-700">
                    Unter {location.minimumGuests} Gästen ist diese Location meist nicht wirtschaftlich.
                  </p>
                ) : null}
              </div>

              <div className="grid gap-4 rounded-[24px] border border-slate-200/70 bg-white/70 p-4 text-sm text-slate-700 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Adresse</p>
                  <p className="mt-1 leading-6">{location.address}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Kontakt</p>
                  <p className="mt-1 leading-6">
                    {location.contactEmail}
                    <br />
                    {location.contactPhone}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pb-1">
                <BookingRequestButton
                  location={location}
                  initialGuests={guests}
                  label="Jetzt anfragen"
                  className="primary-button rounded-full px-4 py-2.5 text-sm font-semibold transition duration-300 active:scale-[0.98]"
                />
                <button
                  type="button"
                  onClick={() => onToggleFavorite(location.id)}
                  className="secondary-button rounded-full px-4 py-2.5 text-sm font-semibold transition duration-300 active:scale-[0.98]"
                >
                  {isFavorite ? "Favorit gespeichert" : "Zu Favoriten"}
                </button>
                <button
                  type="button"
                  onClick={() => onToggleCompare(location.id)}
                  className="secondary-button rounded-full px-4 py-2.5 text-sm font-semibold transition duration-300 active:scale-[0.98]"
                >
                  {isComparing ? "Im Vergleich" : "Vergleichen"}
                </button>
                <Link
                  href={`/locations/${location.id}`}
                  className="secondary-button rounded-full px-4 py-2.5 text-sm font-semibold transition duration-300"
                >
                  Angebot prüfen
                </Link>
                <a
                  href={location.website}
                  target="_blank"
                  rel="noreferrer"
                  className="primary-button rounded-full px-4 py-2.5 text-sm font-semibold transition duration-300"
                >
                  Website
                </a>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
