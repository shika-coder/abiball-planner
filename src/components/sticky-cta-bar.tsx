"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { BookingRequestButton } from "@/components/booking-request-button";
import type { Recommendation } from "@/types/recommendation";
import { euro } from "@/lib/utils";

type Props = {
  recommendation: Recommendation | null;
  isVisible: boolean;
};

export function StickyCTABar({ recommendation, isVisible }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !recommendation || !isVisible) return null;

  const { location } = recommendation;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur-md shadow-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mx-auto max-w-7xl px-5 py-4 sm:px-8 lg:px-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              {location.images[0] && (
                <img
                  src={location.images[0]}
                  alt={location.name}
                  className="h-16 w-16 rounded-lg object-cover"
                />
              )}
              <div>
                <p className="text-xs uppercase tracking-[0.15em] font-semibold text-blue-600">
                  Top Empfehlung
                </p>
                <h3 className="text-lg font-bold text-slate-950">{location.name}</h3>
                <p className="text-sm text-slate-600">
                  {euro.format(location.pricePerPerson)} pro Person
                </p>
              </div>
            </div>
            <BookingRequestButton
              location={location}
              label="Jetzt anfragen"
              className="primary-button px-8 py-3 text-sm font-bold rounded-full shadow-lg hover:shadow-xl whitespace-nowrap transition-all duration-300"
            />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
