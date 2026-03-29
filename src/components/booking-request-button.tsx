"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

import { DEFAULT_GUESTS } from "@/lib/defaults";
import type { Location } from "@/types/location";

type Props = {
  location: Location;
  initialGuests?: number;
  label?: string;
  className?: string;
};

const emptyState = {
  name: "",
  email: "",
  schoolName: "",
  guests: DEFAULT_GUESTS,
  preferredDate: ""
};

export function BookingRequestButton({
  location,
  initialGuests = DEFAULT_GUESTS,
  label = "Jetzt Abiball anfragen",
  className
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState({
    ...emptyState,
    guests: initialGuests
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  function closeDialog() {
    setIsOpen(false);
    setIsSubmitting(false);
    setError(null);
    setForm({ ...emptyState, guests: initialGuests });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          locationId: location.id,
          name: form.name,
          email: form.email,
          schoolName: form.schoolName,
          guests: form.guests,
          preferredDate: form.preferredDate
        })
      });

      if (!response.ok) {
        setError("Die Anfrage konnte gerade nicht gespeichert werden.");
        return;
      }

      setIsSuccess(true);
      setForm({
        ...emptyState,
        guests: initialGuests
      });
    } catch {
      setError("Die Anfrage konnte gerade nicht gespeichert werden.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDialog}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={`booking-request-${location.id}`}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 border-b border-slate-200 bg-white rounded-t-3xl px-6 py-4 sm:px-8">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">Anfrage</p>
                      <h2 id={`booking-request-${location.id}`} className="mt-1 text-2xl font-bold text-slate-900">
                        {location.name}
                      </h2>
                    </div>
                    <button
                      onClick={closeDialog}
                      className="shrink-0 text-2xl text-slate-400 hover:text-slate-600"
                    >
                      ×
                    </button>
                  </div>
                </div>

                <div className="px-6 py-6 sm:px-8">
                  {isSuccess ? (
                    <div className="space-y-4">
                      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
                        <p className="text-sm font-semibold uppercase tracking-widest text-emerald-700">✓ Erfolgreich</p>
                        <h3 className="mt-2 text-xl font-bold text-slate-900">Anfrage erhalten!</h3>
                        <p className="mt-2 text-slate-700">
                          Vielen Dank! Das Venue-Team wird sich innerhalb von 24 Stunden mit euch in Verbindung setzen.
                        </p>
                      </div>
                      <button
                        onClick={closeDialog}
                        className="w-full rounded-full bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
                      >
                        Schließen
                      </button>
                    </div>
                  ) : (
                    <form className="space-y-4" onSubmit={handleSubmit}>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <label className="space-y-1">
                          <span className="block text-sm font-semibold text-slate-700">Name</span>
                          <input
                            required
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                          />
                        </label>
                        <label className="space-y-1">
                          <span className="block text-sm font-semibold text-slate-700">E-Mail</span>
                          <input
                            required
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                          />
                        </label>
                      </div>

                      <label className="space-y-1">
                        <span className="block text-sm font-semibold text-slate-700">Schule</span>
                        <input
                          required
                          value={form.schoolName}
                          onChange={(e) => setForm({ ...form, schoolName: e.target.value })}
                          className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                      </label>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <label className="space-y-1">
                          <span className="block text-sm font-semibold text-slate-700">Anzahl Gäste</span>
                          <input
                            required
                            type="number"
                            min={location.minimumGuests}
                            max={location.capacity}
                            value={form.guests}
                            onChange={(e) => setForm({ ...form, guests: Number(e.target.value) })}
                            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                          />
                        </label>
                        <label className="space-y-1">
                          <span className="block text-sm font-semibold text-slate-700">Termin</span>
                          <input
                            required
                            type="date"
                            value={form.preferredDate}
                            onChange={(e) => setForm({ ...form, preferredDate: e.target.value })}
                            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                          />
                        </label>
                      </div>

                                            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm">
                        <p className="font-semibold text-slate-900">Kapazität: {location.minimumGuests} - {location.capacity} Gäste</p>
                        <p className="mt-2 text-slate-700 flex items-center gap-2">
                          <span className="text-lg">✓</span> Kostenlos & unverbindlich
                        </p>
                        <p className="text-slate-700 flex items-center gap-2">
                          <span className="text-lg">✓</span> Antwort innerhalb von 24h
                        </p>
                      </div>

                      {error && (
                        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                          {error}
                        </div>
                      )}

                      <div className="flex gap-3 pt-2">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="flex-1 rounded-full bg-gradient-to-r from-blue-600 to-purple-700 px-6 py-3 font-bold text-white shadow-lg hover:shadow-xl disabled:opacity-50 transition-all duration-300"
                        >
                          {isSubmitting ? "Wird verarbeitet..." : "Kostenloses Angebot erhalten"}
                        </button>
                        <button
                          type="button"
                          onClick={closeDialog}
                          className="flex-1 rounded-full border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          Abbrechen
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setIsSuccess(false);
          setError(null);
          setIsOpen(true);
        }}
        className={className ?? "primary-button rounded-full px-4 py-2.5 text-sm font-semibold transition duration-300 active:scale-[0.98]"}
      >
        {label}
      </button>

      {mounted && typeof document !== "undefined" ? createPortal(modalContent, document.body) : null}
    </>
  );
}
