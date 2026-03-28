"use client";

import { useEffect, useState } from "react";

interface Analytics {
  summary: {
    totalBookings: number;
    bookingsThisMonth: number;
    totalGuests: number;
    totalLocations: number;
    featuredLocations: number;
  };
  bookingsByStatus: Array<{ status: string; count: number }>;
  topLocations: Array<{
    locationId: string;
    name: string;
    city: string;
    bookingCount: number;
  }>;
}

export function AdminAnalytics() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch("/api/admin/analytics");
        if (!response.ok) throw new Error("Failed to fetch analytics");
        const data = await response.json();
        setAnalytics(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return <div className="text-center py-8 text-slate-500">Loading analytics...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  if (!analytics) {
    return <div className="text-center py-8 text-slate-500">No data available</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Total Bookings</p>
          <p className="mt-3 text-4xl font-bold text-slate-950">{analytics.summary.totalBookings}</p>
        </div>
        <div className="rounded-[28px] border border-slate-200 bg-white p-6">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-400">This Month</p>
          <p className="mt-3 text-4xl font-bold text-slate-950">{analytics.summary.bookingsThisMonth}</p>
        </div>
        <div className="rounded-[28px] border border-slate-200 bg-white p-6">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Total Guests</p>
          <p className="mt-3 text-4xl font-bold text-slate-950">{analytics.summary.totalGuests}</p>
        </div>
        <div className="rounded-[28px] border border-slate-200 bg-white p-6">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Locations</p>
          <p className="mt-3 text-4xl font-bold text-slate-950">{analytics.summary.totalLocations}</p>
        </div>
        <div className="rounded-[28px] border border-slate-200 bg-white p-6">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Featured</p>
          <p className="mt-3 text-4xl font-bold text-slate-950">{analytics.summary.featuredLocations}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6">
          <h3 className="text-xl font-bold text-slate-950">Bookings by Status</h3>
          <div className="mt-4 space-y-2">
            {analytics.bookingsByStatus.map((item) => (
              <div key={item.status} className="flex items-center justify-between">
                <span className="text-sm text-slate-600 capitalize">{item.status}</span>
                <span className="font-semibold text-slate-950">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6">
          <h3 className="text-xl font-bold text-slate-950">Top Locations</h3>
          <div className="mt-4 space-y-3">
            {analytics.topLocations.map((location) => (
              <div key={location.locationId} className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-950">{location.name}</p>
                  <p className="text-xs text-slate-500">{location.city}</p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-950">
                  {location.bookingCount}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
