"use client";

import { useEffect, useState } from "react";

interface Booking {
  id: string;
  name: string;
  email: string;
  schoolName: string;
  status: string;
  notes?: string;
  guests: number;
  preferredDate: string;
  createdAt: string;
  locationId: string;
  user?: {
    id: string;
    name: string;
    email: string;
    school: string;
  };
}

export function AdminBookingsManager() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState({ status: "", notes: "" });

  const fetchBookings = async () => {
    try {
      const url = statusFilter === "all" 
        ? "/api/admin/bookings"
        : `/api/admin/bookings?status=${statusFilter}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch bookings");
      const data = await response.json();
      setBookings(data.data.bookings);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleEdit = (booking: Booking) => {
    setEditingId(booking.id);
    setEditData({ status: booking.status, notes: booking.notes || "" });
  };

  const handleSave = async (id: string) => {
    try {
      const response = await fetch("/api/admin/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...editData })
      });
      if (!response.ok) throw new Error("Failed to update booking");
      setEditingId(null);
      await fetchBookings();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const response = await fetch(`/api/admin/bookings?id=${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete booking");
      await fetchBookings();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  };

  if (loading) return <div className="py-8 text-center text-slate-500">Loading bookings...</div>;
  if (error) return <div className="py-8 text-center text-red-500">Error: {error}</div>;

  const statuses = ["all", "pending", "confirmed", "contacted", "completed", "rejected"];

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-slate-200 bg-white p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-950">Bookings ({bookings.length})</h2>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-[18px] border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-950"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-8 text-slate-500">No bookings found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Name</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">School</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Guests</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Notes</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-950">{booking.name}</p>
                      <p className="text-xs text-slate-500">{booking.email}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{booking.schoolName}</td>
                    <td className="px-4 py-3">
                      {editingId === booking.id ? (
                        <select
                          value={editData.status}
                          onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                          className="rounded-[8px] border border-slate-200 bg-white px-2 py-1 text-xs"
                        >
                          {["pending", "confirmed", "contacted", "completed", "rejected"].map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      ) : (
                        <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                          {booking.status}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">{booking.guests}</td>
                    <td className="px-4 py-3">
                      {editingId === booking.id ? (
                        <input
                          type="text"
                          value={editData.notes}
                          onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                          placeholder="Notes..."
                          className="w-full rounded-[8px] border border-slate-200 bg-white px-2 py-1 text-xs"
                        />
                      ) : (
                        <span className="text-xs text-slate-600">{booking.notes || "-"}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {editingId === booking.id ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSave(booking.id)}
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
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(booking)}
                            className="rounded-[8px] bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-950 hover:bg-slate-200"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(booking.id)}
                            className="rounded-[8px] bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 hover:bg-red-200"
                          >
                            Delete
                          </button>
                        </div>
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
