"use client";

import { useEffect, useState } from "react";

interface SocialProofMetric {
  id: string;
  locationId: string;
  schoolsBooked: number;
  isPopularWithSchools: boolean;
  isQuicklyBooked: boolean;
  updatedAt: string;
}

interface Location {
  id: string;
  name: string;
  city: string;
}

export function AdminSocialProofManager() {
  const [metrics, setMetrics] = useState<SocialProofMetric[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<SocialProofMetric>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [metricsRes, locationsRes] = await Promise.all([
          fetch("/api/admin/social-proof"),
          fetch("/api/admin/locations")
        ]);

        if (!metricsRes.ok || !locationsRes.ok) throw new Error("Failed to fetch data");

        const metricsData = await metricsRes.json();
        const locationsData = await locationsRes.json();

        setMetrics(metricsData.data.metrics || []);
        setLocations(locationsData.data.locations || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEdit = (metric: SocialProofMetric) => {
    setEditingId(metric.locationId);
    setEditData(metric);
  };

  const handleSave = async (locationId: string) => {
    try {
      const response = await fetch("/api/admin/social-proof", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locationId,
          schoolsBooked: editData.schoolsBooked,
          isPopularWithSchools: editData.isPopularWithSchools,
          isQuicklyBooked: editData.isQuicklyBooked
        })
      });

      if (!response.ok) throw new Error("Failed to update metric");
      setEditingId(null);

      const data = await response.json();
      const updated = data.data.metric;

      setMetrics((prev) =>
        prev.map((m) => (m.locationId === locationId ? { ...m, ...updated } : m))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    }
  };

  if (loading) return <div className="py-8 text-center text-slate-500">Loading...</div>;
  if (error) return <div className="py-8 text-center text-red-500">Error: {error}</div>;

  const getLocationName = (locationId: string) => {
    const loc = locations.find((l) => l.id === locationId);
    return loc ? `${loc.name} (${loc.city})` : locationId;
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-slate-200 bg-white p-6">
        <h2 className="mb-6 text-2xl font-bold text-slate-950">
          Social Proof Metrics ({metrics.length})
        </h2>

        {metrics.length === 0 ? (
          <div className="text-center py-8 text-slate-500">No metrics found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Location</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Schools Booked</th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-700">Popular</th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-700">Quick Booked</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {metrics.map((metric) => (
                  <tr key={metric.locationId} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-950">{getLocationName(metric.locationId)}</p>
                    </td>
                    <td className="px-4 py-3">
                      {editingId === metric.locationId ? (
                        <input
                          type="number"
                          value={editData.schoolsBooked || 0}
                          onChange={(e) =>
                            setEditData({ ...editData, schoolsBooked: parseInt(e.target.value) })
                          }
                          className="rounded-[8px] border border-slate-200 bg-white px-2 py-1 w-20 text-xs"
                        />
                      ) : (
                        <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                          {metric.schoolsBooked}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {editingId === metric.locationId ? (
                        <input
                          type="checkbox"
                          checked={editData.isPopularWithSchools || false}
                          onChange={(e) =>
                            setEditData({ ...editData, isPopularWithSchools: e.target.checked })
                          }
                          className="h-4 w-4 rounded"
                        />
                      ) : (
                        <span className="text-2xl">
                          {metric.isPopularWithSchools ? "✅" : "⭕"}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {editingId === metric.locationId ? (
                        <input
                          type="checkbox"
                          checked={editData.isQuicklyBooked || false}
                          onChange={(e) =>
                            setEditData({ ...editData, isQuicklyBooked: e.target.checked })
                          }
                          className="h-4 w-4 rounded"
                        />
                      ) : (
                        <span className="text-2xl">
                          {metric.isQuicklyBooked ? "✅" : "⭕"}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {editingId === metric.locationId ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSave(metric.locationId)}
                            className="rounded-[8px] bg-slate-950 px-3 py-1 text-xs font-semibold text-white"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="rounded-[8px] bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-950"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEdit(metric)}
                          className="rounded-[8px] bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-950 hover:bg-slate-200"
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
