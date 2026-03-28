"use client";

import { useEffect, useState } from "react";

interface Location {
  id: string;
  name: string;
  city: string;
  address: string;
  capacity: number;
  minimumGuests: number;
  pricePerPerson: number;
  featured: boolean;
  contactEmail?: string;
  contactPhone?: string;
}

export function AdminLocationsManager() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Location>>({});

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await fetch("/api/admin/locations");
      if (!response.ok) throw new Error("Failed to fetch locations");
      const data = await response.json();
      setLocations(data.data.locations);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (location: Location) => {
    setEditingId(location.id);
    setEditData(location);
  };

  const handleSave = async (id: string) => {
    try {
      const response = await fetch("/api/admin/locations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...editData })
      });
      if (!response.ok) throw new Error("Failed to update location");
      setEditingId(null);
      await fetchLocations();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const response = await fetch(`/api/admin/locations?id=${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete location");
      await fetchLocations();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const toggleFeatured = async (id: string, currentFeatured: boolean) => {
    try {
      const response = await fetch("/api/admin/locations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, featured: !currentFeatured })
      });
      if (!response.ok) throw new Error("Failed to update featured status");
      await fetchLocations();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    }
  };

  if (loading) return <div className="py-8 text-center text-slate-500">Loading locations...</div>;
  if (error) return <div className="py-8 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-slate-200 bg-white p-6">
        <h2 className="mb-6 text-2xl font-bold text-slate-950">Locations ({locations.length})</h2>

        {locations.length === 0 ? (
          <div className="text-center py-8 text-slate-500">No locations found</div>
        ) : (
          <div className="space-y-4">
            {locations.map((location) => (
              <div
                key={location.id}
                className="rounded-[20px] border border-slate-200 bg-slate-50 p-5 hover:bg-slate-100"
              >
                {editingId === location.id ? (
                  <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <input
                        type="text"
                        value={editData.name || ""}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        placeholder="Name"
                        className="rounded-[12px] border border-slate-300 bg-white px-4 py-2 text-sm"
                      />
                      <input
                        type="text"
                        value={editData.city || ""}
                        onChange={(e) => setEditData({ ...editData, city: e.target.value })}
                        placeholder="City"
                        className="rounded-[12px] border border-slate-300 bg-white px-4 py-2 text-sm"
                      />
                      <input
                        type="text"
                        value={editData.address || ""}
                        onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                        placeholder="Address"
                        className="rounded-[12px] border border-slate-300 bg-white px-4 py-2 text-sm sm:col-span-2"
                      />
                      <input
                        type="number"
                        value={editData.capacity || 0}
                        onChange={(e) => setEditData({ ...editData, capacity: parseInt(e.target.value) })}
                        placeholder="Capacity"
                        className="rounded-[12px] border border-slate-300 bg-white px-4 py-2 text-sm"
                      />
                      <input
                        type="number"
                        value={editData.pricePerPerson || 0}
                        onChange={(e) => setEditData({ ...editData, pricePerPerson: parseFloat(e.target.value) })}
                        placeholder="Price per Person"
                        className="rounded-[12px] border border-slate-300 bg-white px-4 py-2 text-sm"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSave(location.id)}
                        className="rounded-[12px] bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="rounded-[12px] bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-950"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="mb-3 flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-slate-950">{location.name}</h3>
                        <p className="text-sm text-slate-600">{location.address}, {location.city}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleFeatured(location.id, location.featured)}
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            location.featured
                              ? "bg-amber-100 text-amber-800"
                              : "bg-slate-200 text-slate-700"
                          }`}
                        >
                          {location.featured ? "⭐ Featured" : "Featured"}
                        </button>
                      </div>
                    </div>
                    <div className="mb-4 grid gap-2 text-sm text-slate-700 sm:grid-cols-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.1em] text-slate-500">Capacity</p>
                        <p className="font-semibold">{location.capacity} guests</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.1em] text-slate-500">Price</p>
                        <p className="font-semibold">€{location.pricePerPerson}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.1em] text-slate-500">Min. Guests</p>
                        <p className="font-semibold">{location.minimumGuests}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(location)}
                        className="rounded-[12px] bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-slate-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(location.id)}
                        className="rounded-[12px] bg-red-100 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
