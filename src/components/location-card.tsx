"use client";

import Image from "next/image";
import Link from "next/link";

import { BookingRequestButton } from "@/components/booking-request-button";
import { SocialProofBadge } from "@/components/social-proof-badge";
import { euro, getBudgetStatus, getCostPerStudent, getValueScore } from "@/lib/utils";
import type { Location } from "@/types/location";

type Props = {
  location: Location;
  guests: number;
  totalBudget: number;
  budgetPerPerson: number;
  isFavorite: boolean;
  isComparing: boolean;
  isBestValue: boolean;
  matchScore?: number;
  matchTag?: string;
  hasCapacity?: boolean;
  onToggleFavorite: (id: string) => void;
  onToggleCompare: (id: string) => void;
};

export function LocationCard({
  location,
  guests,
  totalBudget,
  budgetPerPerson,
  isFavorite,
  isComparing,
  isBestValue,
  matchScore,
  matchTag,
  hasCapacity,
  onToggleFavorite,
  onToggleCompare
}: Props) {
  const status = getBudgetStatus(location, guests, totalBudget, budgetPerPerson);
  const valueScore = getValueScore(location);
  const heroImage = location.images.find((image) => typeof image === "string" && image.trim().length > 0) || "/images/custom-venue-1.svg";

  return (
    <article className="glass-panel group animate-rise overflow-hidden rounded-[34px] transition duration-500 hover:-translate-y-2 hover:scale-[1.01] hover:shadow-[0_30px_90px_rgba(15,23,42,0.16)] flex flex-col h-full">
      <div className="relative h-72 overflow-hidden shrink-0">
        <Image
          src={heroImage}
          alt={location.name}
          fill
          sizes="(max-width: 1280px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/35 to-transparent" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(37,99,235,0.12),transparent_36%,rgba(168,85,247,0.14))]" />
        <div className="absolute left-4 top-4 flex flex-wrap gap-1.5">
          <span
            className={`rounded-full px-2.5 py-1 text-[10px] font-bold backdrop-blur ${
              location.featured ? "bg-white/85 text-slate-950" : "bg-white/70 text-slate-900"
            }`}
          >
            {location.placementLabel}
          </span>
          <span className="rounded-full bg-black/25 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur">
            {location.venueType}
          </span>
          {isBestValue ? (
            <span className="rounded-full bg-emerald-400 px-2.5 py-1 text-[10px] font-bold text-emerald-950">
              Best Value
            </span>
          ) : null}
        </div>
        {matchScore !== undefined ? (
          <div className="absolute right-4 top-4 flex flex-col items-end gap-1 text-right text-white">
            <p className="text-xs font-bold">{matchScore}% Match</p>
            <span className="rounded-full border border-white/50 bg-white/10 px-2 py-0.5 text-[9px] uppercase tracking-[0.15em] font-bold">
              {matchTag ?? "Top Match"}
            </span>
          </div>
        ) : null}
        <div className="absolute inset-x-0 bottom-0 p-4 text-white">
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-[0.3em] text-white/70 truncate">{location.district}</p>
              <h3 className="headline text-xl sm:text-2xl font-bold leading-tight line-clamp-2">{location.name}</h3>
            </div>
            <p className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-xs backdrop-blur shrink-0">
              {euro.format(location.pricePerPerson)} p.P.
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col h-full space-y-4 p-6 lg:p-7">
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 line-clamp-1">
            {location.idealFor}
          </p>
          <span className="shrink-0 rounded-full border border-rose-100 bg-rose-50 px-2.5 py-1 text-[10px] font-bold text-rose-700">
            {location.urgencyLabel}
          </span>
        </div>
        
        <p className="text-sm leading-6 text-slate-600 line-clamp-3 flex-shrink-0">
          {location.description}
        </p>
        
        <div className="flex flex-wrap gap-1.5">
          {location.features.slice(0, 3).map((feature) => (
            <span
              key={feature}
              className="rounded-lg border border-slate-200/70 bg-white/80 px-2 py-1 text-[11px] font-semibold text-slate-700 whitespace-nowrap"
            >
              {feature}
            </span>
          ))}
          {location.features.length > 3 && (
            <span className="rounded-lg border border-slate-200/70 bg-white/80 px-2 py-1 text-[11px] font-semibold text-slate-600">
              +{location.features.length - 3}
            </span>
          )}
        </div>
        
        <div className="grid gap-2 rounded-2xl border border-slate-200/70 bg-white/70 p-3 text-xs text-slate-700 grid-cols-2 flex-grow">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Kapazität</p>
            <p className="mt-1 font-semibold">{location.minimumGuests}-{location.capacity} Gäste</p>
            {hasCapacity === false && (
              <p className="mt-1 text-[10px] text-amber-600 font-bold">⚠️ Zu kleine Kapazität</p>
            )}
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Geschätzt</p>
            <p className="mt-1 font-semibold">{euro.format(status.estimatedTotal)}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Pro Schüler:in</p>
            <p className="mt-1 font-semibold">{euro.format(getCostPerStudent(location, guests))}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Kontakt</p>
            <p className="mt-1 font-semibold">{location.contactPhone}</p>
          </div>
        </div>
        
        <div className="rounded-2xl border border-blue-100 bg-[linear-gradient(135deg,rgba(239,246,255,0.92),rgba(245,243,255,0.92))] p-3">
          <div className="space-y-2 text-xs text-slate-700">
            <div className="flex items-center justify-between gap-2">
              <p className="uppercase tracking-[0.15em] text-blue-700 font-bold text-[10px]">Social Proof</p>
              <p className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-slate-700">
                Score {valueScore}
              </p>
            </div>
            <SocialProofBadge location={location} />
          </div>
        </div>
        
        <div className="space-y-1.5 text-xs flex-grow">
          {status.overBudget ? (
            <p className="rounded-lg border border-rose-100 bg-rose-50 px-3 py-2 text-rose-700 font-medium">
              Über Budget
            </p>
          ) : (
            <p className="rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2 text-emerald-700 font-medium">
              Im Budget ✓
            </p>
          )}
          {status.overCapacity ? (
            <p className="rounded-lg border border-amber-100 bg-amber-50 px-3 py-2 text-amber-700 font-medium text-[10px]">
              Kapazität überschritten
            </p>
          ) : null}
        </div>
        
        <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-200/50">
          <BookingRequestButton
            location={location}
            initialGuests={guests}
            label="Jetzt anfragen"
            className="primary-button rounded-lg px-3 py-2 text-xs font-bold transition duration-300 active:scale-[0.98] w-full"
          />
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => onToggleFavorite(location.id)}
              className="secondary-button rounded-lg px-2 py-1.5 text-[11px] font-semibold transition duration-300 active:scale-[0.98] flex-1"
              title={isFavorite ? "Favorit gespeichert" : "Zu Favoriten"}
            >
              {isFavorite ? "❤️" : "♡"}
            </button>
            <button
              type="button"
              onClick={() => onToggleCompare(location.id)}
              className="secondary-button rounded-lg px-2 py-1.5 text-[11px] font-semibold transition duration-300 active:scale-[0.98] flex-1"
              title={isComparing ? "Im Vergleich" : "Vergleichen"}
            >
              ⚖️
            </button>
            <Link
              href={`/locations/${location.id}`}
              className="secondary-button rounded-lg px-2 py-1.5 text-[11px] font-semibold transition duration-300 flex-1 text-center"
              title="Details ansehen"
            >
              →
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
