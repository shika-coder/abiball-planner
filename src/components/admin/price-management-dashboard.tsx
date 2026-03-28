import { useEffect, useState } from "react";
import { useAdminAuth } from "@/lib/use-admin-auth";

interface PriceStatus {
  id: string;
  name: string;
  pricePerPerson: number;
  daysSinceVerified: number | null;
  isStale: boolean;
}

export default function PriceManagementDashboard() {
  const { admin, loading } = useAdminAuth();
  const [prices, setPrices] = useState<PriceStatus[]>([]);
  const [pricesLoading, setPricesLoading] = useState(true);
  const [selectedVenue, setSelectedVenue] = useState<string | null>(null);
  const [newPrice, setNewPrice] = useState<string>("");
  const [reason, setReason] = useState("manual verification");

  useEffect(() => {
    if (!loading && admin) {
      fetchPrices();
    }
  }, [loading, admin]);

  async function fetchPrices() {
    try {
      const res = await fetch("/api/admin/prices");
      const data = await res.json();
      setPrices(data.data?.prices || []);
    } catch (error) {
      console.error("Failed to fetch prices:", error);
    } finally {
      setPricesLoading(false);
    }
  }

  async function handleVerify(venueId: string) {
    try {
      const res = await fetch("/api/admin/prices", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locationId: venueId,
          verifiedBy: admin?.email,
        }),
      });

      if (res.ok) {
        fetchPrices();
        alert("Price verified successfully");
      }
    } catch (error) {
      console.error("Failed to verify price:", error);
    }
  }

  async function handleUpdatePrice(venueId: string) {
    if (!newPrice) return;

    try {
      const res = await fetch("/api/admin/prices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locationId: venueId,
          newPrice: parseFloat(newPrice),
          reason,
          verifiedBy: admin?.email,
        }),
      });

      if (res.ok) {
        fetchPrices();
        setSelectedVenue(null);
        setNewPrice("");
        alert("Price updated successfully");
      }
    } catch (error) {
      console.error("Failed to update price:", error);
    }
  }

  if (!admin || loading || pricesLoading) {
    return <div className="p-4">Loading...</div>;
  }

  const staleCount = prices.filter((p) => p.isStale).length;

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Price Management</h2>

      {staleCount > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-800">
          ⚠️ {staleCount} venue{staleCount > 1 ? "s" : ""} need price verification
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-3 text-left">Venue</th>
              <th className="border p-3 text-left">Price</th>
              <th className="border p-3 text-left">Last Verified</th>
              <th className="border p-3 text-left">Status</th>
              <th className="border p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {prices.map((venue) => (
              <tr
                key={venue.id}
                className={venue.isStale ? "bg-orange-50" : "bg-white"}
              >
                <td className="border p-3">{venue.name}</td>
                <td className="border p-3">€{venue.pricePerPerson}</td>
                <td className="border p-3">
                  {venue.daysSinceVerified === null
                    ? "Never"
                    : `${venue.daysSinceVerified} days ago`}
                </td>
                <td className="border p-3">
                  {venue.isStale ? (
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-sm">
                      Stale
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                      Current
                    </span>
                  )}
                </td>
                <td className="border p-3">
                  <button
                    onClick={() => handleVerify(venue.id)}
                    className="mr-2 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                  >
                    Verify
                  </button>
                  <button
                    onClick={() => setSelectedVenue(venue.id)}
                    className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedVenue && (
        <div className="mt-6 p-4 bg-gray-50 rounded border border-gray-200">
          <h3 className="font-bold mb-4">
            Update Price: {prices.find((p) => p.id === selectedVenue)?.name}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                New Price (€)
              </label>
              <input
                type="number"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                placeholder="Enter new price"
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Reason for Change
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option>manual verification</option>
                <option>website verified</option>
                <option>phone contact</option>
                <option>email quote</option>
                <option>market adjustment</option>
                <option>seasonal change</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleUpdatePrice(selectedVenue)}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Update
              </button>
              <button
                onClick={() => setSelectedVenue(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
