"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import type { Location } from "@/types/location";

type Props = {
  locations: Location[];
  onRemove: (id: string) => void;
};

export function CompareDrawer({ locations, onRemove }: Props) {
  if (locations.length === 0) {
    return null;
  }

  return (
    <motion.div
      className="glass-panel fixed bottom-6 right-6 z-20 w-72 rounded-[20px] p-4"
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
    >
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Vergleich aktiv</p>
          <h3 className="headline text-lg text-slate-900">{locations.length} im Vergleich</h3>
        </div>
      </div>

      <div className="mb-4 space-y-2 max-h-40 overflow-y-auto">
        {locations.map((location) => (
          <div
            key={location.id}
            className="flex items-center justify-between rounded-lg bg-slate-100 px-3 py-2 text-sm"
          >
            <span className="font-medium text-slate-900">{location.name}</span>
            <button
              type="button"
              onClick={() => onRemove(location.id)}
              className="text-slate-500 transition duration-200 hover:text-slate-900"
              aria-label="Remove from comparison"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path d="M3.207 3.207a1 1 0 0 1 1.414 0L8 6.586l3.379-3.379a1 1 0 1 1 1.414 1.414L9.414 8l3.379 3.379a1 1 0 1 1-1.414 1.414L8 9.414l-3.379 3.379a1 1 0 0 1-1.414-1.414L6.586 8 3.207 4.621a1 1 0 0 1 0-1.414Z" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <Link
        href="/compare"
        className="primary-button block w-full rounded-full px-3 py-2.5 text-center text-sm font-semibold transition duration-300"
      >
        Zum Vergleich
      </Link>
    </motion.div>
  );
}
