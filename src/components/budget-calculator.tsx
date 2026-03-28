"use client";

import { useMemo, useState } from "react";

import { DEFAULT_BUDGET_PER_PERSON, DEFAULT_GUESTS, DEFAULT_TOTAL_BUDGET } from "@/lib/defaults";
import { euro } from "@/lib/utils";
import type { Location } from "@/types/location";

export function BudgetCalculator({ location }: { location: Location }) {
  const [guests, setGuests] = useState<number>(Math.max(location.minimumGuests, DEFAULT_GUESTS));
  const [budgetPerPerson, setBudgetPerPerson] = useState<number>(DEFAULT_BUDGET_PER_PERSON);
  const [totalBudget, setTotalBudget] = useState<number>(DEFAULT_TOTAL_BUDGET);

  const calculatedTotal = guests * budgetPerPerson;
  const status = useMemo(
    () => ({
      overBudget: totalBudget > 0 ? calculatedTotal > totalBudget : false,
      overCapacity: guests > location.capacity,
      belowMinimum: guests < location.minimumGuests
    }),
    [calculatedTotal, guests, location.capacity, location.minimumGuests, totalBudget]
  );

  return (
    <section className="glass-panel rounded-[30px] p-6">
      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Rechner</p>
      <h2 className="headline mt-2 text-4xl text-slate-900">Budget-Check in Echtzeit</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-700">Gäste</span>
          <input
            type="number"
            min={location.minimumGuests}
            max={1200}
            value={guests}
            onChange={(event) => setGuests(Number(event.target.value))}
            className="w-full rounded-2xl border border-slate-200/70 bg-white/85 px-4 py-3 shadow-sm transition duration-300 focus:border-blue-400"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-700">Budget pro Person</span>
          <input
            type="number"
            min={0}
            value={budgetPerPerson}
            onChange={(event) => setBudgetPerPerson(Number(event.target.value))}
            className="w-full rounded-2xl border border-slate-200/70 bg-white/85 px-4 py-3 shadow-sm transition duration-300 focus:border-blue-400"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-700">Gesamtbudget</span>
          <input
            type="number"
            min={0}
            value={totalBudget}
            onChange={(event) => setTotalBudget(Number(event.target.value))}
            className="w-full rounded-2xl border border-slate-200/70 bg-white/85 px-4 py-3 shadow-sm transition duration-300 focus:border-blue-400"
          />
        </label>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-[24px] bg-[linear-gradient(135deg,#2563eb,#7c3aed)] px-5 py-5 text-white shadow-lg">
          <p className="text-sm text-white/70">Gesamtkosten</p>
          <p className="headline mt-2 text-4xl">{euro.format(calculatedTotal)}</p>
        </div>
        <div className="rounded-[24px] bg-slate-950 px-5 py-5 text-white shadow-lg">
          <p className="text-sm text-white/70">Kosten pro Schüler:in</p>
          <p className="headline mt-2 text-4xl">
            {euro.format(Math.round(calculatedTotal / Math.max(guests, 1)))}
          </p>
        </div>
        <div className="rounded-[24px] border border-slate-200/70 bg-white/80 px-5 py-5 text-slate-950">
          <p className="text-sm text-slate-500">Kapazität</p>
          <p className="headline mt-2 text-4xl">{location.capacity}</p>
        </div>
      </div>
      <div className="mt-6 space-y-3 text-sm">
        {status.overBudget ? (
          <p className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-rose-700">
            Achtung: Die kalkulierten Kosten überschreiten euer gesetztes Budget.
          </p>
        ) : (
          <p className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-emerald-700">
            Die aktuelle Kalkulation liegt innerhalb eures Budgets.
          </p>
        )}
        {status.overCapacity ? (
          <p className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-amber-700">
            Die Gästezahl ist höher als die maximale Kapazität dieser Location.
          </p>
        ) : null}
        {status.belowMinimum ? (
          <p className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-sky-700">
            Die Location arbeitet normalerweise erst ab {location.minimumGuests} Gästen.
          </p>
        ) : null}
      </div>
    </section>
  );
}
