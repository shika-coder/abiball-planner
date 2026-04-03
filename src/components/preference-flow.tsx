"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

import type { Preferences, PreferenceFeature } from "@/types/preferences";

const preferenceOptions: PreferenceFeature[] = [
  "Waterfront",
  "Modern",
  "Industrial",
  "Luxury",
  "Outdoor",
  "Stage/Dancefloor"
];

type Props = {
  initialPreferences: Preferences;
  onSubmit: (preferences: Preferences) => void;
  compact?: boolean;
};

export function PreferenceFlow({ initialPreferences, onSubmit, compact = false }: Props) {
  const [values, setValues] = useState(initialPreferences);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedFeatures = useMemo(() => new Set(values.features), [values.features]);

  useEffect(() => {
    setValues(initialPreferences);
  }, [initialPreferences]);

  function toggleFeature(feature: PreferenceFeature) {
    setValues((current) => {
      const nextFeatures = current.features.includes(feature)
        ? current.features.filter((item) => item !== feature)
        : [...current.features, feature];

      return { ...current, features: nextFeatures };
    });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    // Simulate processing time for loading animation
    setTimeout(() => {
      onSubmit(values);
      setIsSubmitting(false);
    }, 600);
  }

  return (
    <section
      className={
        compact
          ? "rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm"
          : "fixed inset-0 z-50 flex items-center justify-center bg-white/20 px-8 py-12 backdrop-blur-sm"
      }
    >
      <motion.form
        onSubmit={handleSubmit}
        className={
          compact
            ? "space-y-6"
            : "w-full max-w-4xl mx-8 space-y-8 rounded-[36px] border border-white/20 bg-gradient-to-br from-white via-slate-50/90 to-blue-50/50 p-12 shadow-[0_50px_150px_rgba(15,23,42,0.15)]"
        }
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {/* Header */}
        <div className="space-y-2">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <p className="text-xs uppercase tracking-[0.35em] text-blue-600 font-bold">Schritt 1 von 1</p>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="headline text-4xl font-bold text-slate-950"
          >
            Findet eure Traumlocation
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base text-slate-600"
          >
            Erzählt uns von eurer Party – wir zeigen euch die perfekten Matches
          </motion.p>
        </div>

        {/* Input Grid */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="grid gap-6 md:grid-cols-3"
        >
          {/* Stadt */}
          <label className="group space-y-2">
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-slate-600">Stadt</span>
            <input
              value={values.city}
              onChange={(event) => setValues((current) => ({ ...current, city: event.target.value }))}
              className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-900 transition duration-200 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </label>

          {/* Gäste */}
          <label className="group space-y-2">
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-slate-600">Gäste (300–1000)</span>
            <input
              type="number"
              min={300}
              max={1000}
              value={values.guests === 0 ? "" : values.guests}
              onChange={(event) =>
                setValues((current) => ({ ...current, guests: event.target.value ? Number(event.target.value) : 0 }))
              }
              onBlur={(event) => {
                const num = Number(event.target.value);
                if (num > 0 && (num < 300 || num > 1000)) {
                  setValues((current) => ({ ...current, guests: Math.max(300, Math.min(1000, num)) }));
                }
              }}
              className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-900 transition duration-200 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </label>

          {/* Budget pro Person */}
          <label className="group space-y-2">
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-slate-600">€ Pro Person</span>
            <input
              type="number"
              min={0}
              value={values.budgetPerPerson === 0 ? "" : values.budgetPerPerson}
              onChange={(event) =>
                setValues((current) => ({ ...current, budgetPerPerson: event.target.value ? Number(event.target.value) : 0 }))
              }
              className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-900 transition duration-200 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </label>
        </motion.div>

        {/* Gesamtbudget */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <label className="space-y-2">
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-slate-600">Gesamtbudget (optional)</span>
            <input
              type="number"
              min={0}
              value={values.totalBudget === 0 ? "" : values.totalBudget}
              onChange={(event) =>
                setValues((current) => ({ ...current, totalBudget: event.target.value ? Number(event.target.value) : 0 }))
              }
              className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-900 transition duration-200 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </label>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="space-y-4"
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-600 mb-4">Wunschliste (optional)</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {preferenceOptions.map((feature, index) => (
                <motion.button
                  key={feature}
                  type="button"
                  onClick={() => toggleFeature(feature)}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className={`group rounded-2xl px-5 py-3 text-xs font-bold transition duration-200 transform hover:scale-105 ${
                    selectedFeatures.has(feature)
                      ? "bg-slate-950 text-white shadow-lg ring-2 ring-slate-950/30"
                      : "bg-white border-2 border-slate-200 text-slate-700 hover:border-slate-300 hover:shadow-md"
                  }`}
                >
                  <span className="text-lg mr-1">
                    {feature === "Waterfront" && "💧"}
                    {feature === "Modern" && "🏢"}
                    {feature === "Industrial" && "🏭"}
                    {feature === "Luxury" && "✨"}
                    {feature === "Outdoor" && "🌳"}
                    {feature === "Stage/Dancefloor" && "🎤"}
                  </span>
                  {feature}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="flex flex-col gap-3 pt-8"
        >
          <button
            type="submit"
            disabled={isSubmitting}
            className="primary-button rounded-2xl px-8 py-3 text-base font-bold transition duration-300 shadow-lg hover:shadow-xl disabled:opacity-75 flex items-center justify-center gap-2 w-full hover:scale-[1.02] active:scale-95"
          >
            {isSubmitting ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                />
                <span>Suche läuft...</span>
              </>
            ) : (
              <>
                <span>🔍</span>
                <span>Beste Locations anzeigen</span>
              </>
            )}
          </button>
          <p className="text-xs text-slate-500 text-center px-2">
            Wir zeigen euch alle verfügbaren Locations, gerrankt nach euren Anforderungen
          </p>
        </motion.div>
      </motion.form>
    </section>
  );
}
