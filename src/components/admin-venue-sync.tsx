"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface SyncStatus {
  running: boolean;
  progress: number;
  message: string;
}

export function AdminVenueSyncDashboard() {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    running: false,
    progress: 0,
    message: "Ready to sync venues",
  });
  const [lastResult, setLastResult] = useState<any>(null);

  const handleSync = async (dryRun: boolean = false) => {
    setSyncStatus({
      running: true,
      progress: 50,
      message: dryRun ? "Running sync in test mode..." : "Syncing venues...",
    });

    try {
      const response = await fetch("/api/admin/venues/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dryRun }),
      });

      const result = await response.json();
      setLastResult(result);

      setSyncStatus({
        running: false,
        progress: 100,
        message: result.message || "Sync completed",
      });
    } catch (error) {
      setSyncStatus({
        running: false,
        progress: 0,
        message: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] font-bold text-slate-600 mb-4">
          Venue Database
        </p>
        <h2 className="text-2xl font-bold text-slate-950 mb-2">Automatic Venue Sync</h2>
        <p className="text-slate-600">
          Fetch and add new event venues from public sources. The system automatically deduplicates
          and enriches data.
        </p>
      </div>

      {/* Status Card */}
      <motion.div
        className="rounded-2xl border border-slate-200 bg-slate-50 p-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-slate-900">Sync Progress</span>
              <span className="text-sm text-slate-600">{syncStatus.progress}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <motion.div
                className="bg-blue-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${syncStatus.progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          <p className={`text-sm ${syncStatus.running ? "text-blue-600" : "text-slate-600"}`}>
            {syncStatus.message}
          </p>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => handleSync(false)}
          disabled={syncStatus.running}
          className="flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition duration-300"
        >
          {syncStatus.running ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
              />
              Syncing...
            </>
          ) : (
            <>
              🔄 Run Sync Now
            </>
          )}
        </button>

        <button
          onClick={() => handleSync(true)}
          disabled={syncStatus.running}
          className="flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold border-2 border-slate-300 text-slate-900 hover:border-slate-400 disabled:opacity-50 transition duration-300"
        >
          🧪 Test (Dry Run)
        </button>
      </div>

      {/* Last Result */}
      {lastResult && (
        <motion.div
          className="rounded-2xl border border-slate-200 bg-white p-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Last Sync Result</h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-xs text-slate-600 mb-1">Total Fetched</p>
              <p className="text-2xl font-bold text-slate-900">{lastResult.totalFetched}</p>
            </div>

            <div className="rounded-lg bg-blue-50 p-4">
              <p className="text-xs text-slate-600 mb-1">New Venues</p>
              <p className="text-2xl font-bold text-blue-600">{lastResult.newVenuesFound}</p>
            </div>

            <div className="rounded-lg bg-amber-50 p-4">
              <p className="text-xs text-slate-600 mb-1">Duplicates Skipped</p>
              <p className="text-2xl font-bold text-amber-600">{lastResult.duplicatesSkipped}</p>
            </div>

            <div className="rounded-lg bg-green-50 p-4">
              <p className="text-xs text-slate-600 mb-1">Enriched</p>
              <p className="text-2xl font-bold text-green-600">
                {lastResult.enrichedVenues?.length || 0}
              </p>
            </div>
          </div>

          {lastResult.dryRun && (
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 mb-6">
              <p className="text-sm text-amber-800">
                ⚠️ Dry run mode - no venues were actually added
              </p>
            </div>
          )}

          {lastResult.enrichedVenues && lastResult.enrichedVenues.length > 0 && (
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">New Venues Found:</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {lastResult.enrichedVenues.slice(0, 10).map((venue: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-lg bg-slate-50 p-3"
                  >
                    <div>
                      <p className="font-medium text-slate-900">{venue.name}</p>
                      <p className="text-xs text-slate-600">{venue.district}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-900">{venue.capacity}</p>
                      <p className="text-xs text-slate-600">€{venue.pricePerPerson}pp</p>
                    </div>
                  </div>
                ))}

                {lastResult.enrichedVenues.length > 10 && (
                  <p className="text-xs text-slate-600 pt-2">
                    +{lastResult.enrichedVenues.length - 10} more venues...
                  </p>
                )}
              </div>
            </div>
          )}

          {lastResult.errors && lastResult.errors.length > 0 && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-4 mt-4">
              <p className="text-sm font-semibold text-red-900 mb-2">Errors:</p>
              {lastResult.errors.map((err: string, idx: number) => (
                <p key={idx} className="text-sm text-red-800">
                  • {err}
                </p>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Info Section */}
      <motion.div
        className="rounded-2xl border border-blue-200 bg-blue-50 p-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="font-semibold text-blue-900 mb-3">How It Works</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>✓ Fetches venues from public event directories</li>
          <li>✓ Removes duplicates using intelligent matching</li>
          <li>✓ Enriches with auto-generated descriptions and features</li>
          <li>✓ Estimates pricing based on venue type and capacity</li>
          <li>✓ Ensures minimum capacity of 300 guests</li>
          <li>✓ Can be scheduled to run daily</li>
        </ul>
      </motion.div>

      {/* Scheduling Info */}
      <motion.div
        className="rounded-2xl border border-slate-200 bg-slate-50 p-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="font-semibold text-slate-900 mb-2">Automatic Scheduling</h3>
        <p className="text-sm text-slate-600 mb-3">
          This sync process is typically run once per day automatically via a scheduled job. Manually
          trigger above for testing or emergency updates.
        </p>
        <code className="text-xs bg-slate-900 text-slate-100 px-3 py-2 rounded-lg block font-mono">
          0 2 * * * (Runs daily at 2 AM)
        </code>
      </motion.div>
    </div>
  );
}
