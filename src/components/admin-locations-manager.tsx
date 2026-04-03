"use client";

import Image from "next/image";
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

type CreateLocation = Partial<Location> & {
  images: string[];
};

async function resizeImageFile(file: File, maxWidth = 1600, quality = 0.82): Promise<string> {
  const imageBitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxWidth / imageBitmap.width);
  const width = Math.round(imageBitmap.width * scale);
  const height = Math.round(imageBitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Could not create image canvas");
  }

  context.drawImage(imageBitmap, 0, 0, width, height);

  return canvas.toDataURL("image/webp", quality);
}

export function AdminLocationsManager() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Location>>({});
  const [createData, setCreateData] = useState<CreateLocation>({ featured: false, images: [] });
  const [uploadingImages, setUploadingImages] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

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

  const broadcastLocationUpdate = () => {
    if (typeof BroadcastChannel !== "undefined") {
      new BroadcastChannel("locations-updated").postMessage({ type: "updated" });
    }
  };

  const validateCreateForm = () => {
    if (!createData.name?.trim()) return "Name is required.";
    if (!createData.city?.trim()) return "City is required.";
    if (!createData.address?.trim()) return "Address is required.";
    if (!createData.capacity || createData.capacity <= 0) return "Capacity must be greater than 0.";
    if (createData.pricePerPerson == null || Number.isNaN(createData.pricePerPerson) || createData.pricePerPerson < 0) {
      return "Price must be a valid number.";
    }
    return null;
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

  const handleCreate = async () => {
    const validationError = validateCreateForm();
    if (validationError) {
      setFormError(validationError);
      setSuccessMessage(null);
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError(null);
      setSuccessMessage(null);
      const response = await fetch("/api/admin/locations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createData)
      });
      if (!response.ok) throw new Error("Failed to create location");
      setCreateData({ featured: false, images: [] });
      await fetchLocations();
      broadcastLocationUpdate();
      setSuccessMessage("Location created successfully.");
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Create failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const response = await fetch(`/api/admin/locations?id=${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete location");
      await fetchLocations();
      broadcastLocationUpdate();
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
      broadcastLocationUpdate();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    }
  };

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadingImages(true);
    setError(null);

    try {
      const resizedImages = await Promise.all(
        Array.from(files).map(async (file) => {
          if (!file.type.startsWith("image/")) {
            throw new Error(`Unsupported file type: ${file.name}`);
          }
          return resizeImageFile(file);
        })
      );

      setCreateData((current) => ({
        ...current,
        images: [...(current.images || []), ...resizedImages]
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Image upload failed");
    } finally {
      setUploadingImages(false);
    }
  };

  if (loading) return <div className="py-8 text-center text-slate-500">Loading locations...</div>;
  if (error) return <div className="py-8 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-slate-200 bg-white p-6">
        <div className="mb-8 rounded-[24px] border border-slate-200 bg-slate-50 p-5">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-slate-950">Create location</h3>
            <p className="text-sm text-slate-500">Add the details required for the app and recommendations engine.</p>
          </div>

          {formError ? <div className="mb-4 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">{formError}</div> : null}
          {successMessage ? <div className="mb-4 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{successMessage}</div> : null}

          <div className="grid gap-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Name *</span>
                <input
                  className="w-full rounded-[14px] border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
                  placeholder="Venue name"
                  value={createData.name || ""}
                  onChange={(e) => setCreateData({ ...createData, name: e.target.value })}
                />
              </label>
              <label className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">City *</span>
                <input
                  className="w-full rounded-[14px] border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
                  placeholder="Hamburg"
                  value={createData.city || ""}
                  onChange={(e) => setCreateData({ ...createData, city: e.target.value })}
                />
              </label>
              <label className="sm:col-span-2 space-y-2">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Address *</span>
                <input
                  className="w-full rounded-[14px] border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
                  placeholder="Street, ZIP, city"
                  value={createData.address || ""}
                  onChange={(e) => setCreateData({ ...createData, address: e.target.value })}
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <label className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Capacity *</span>
                <input
                  className="w-full rounded-[14px] border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
                  placeholder="e.g. 500"
                  type="number"
                  min={1}
                  value={createData.capacity || 0}
                  onChange={(e) => setCreateData({ ...createData, capacity: Number(e.target.value) })}
                />
              </label>
              <label className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Price per person *</span>
                <input
                  className="w-full rounded-[14px] border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
                  placeholder="e.g. 89"
                  type="number"
                  min={0}
                  step="0.01"
                  value={createData.pricePerPerson || 0}
                  onChange={(e) => setCreateData({ ...createData, pricePerPerson: Number(e.target.value) })}
                />
              </label>
              <label className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Featured</span>
                <div className="flex h-[52px] items-center rounded-[14px] border border-slate-300 bg-white px-4">
                  <input
                    type="checkbox"
                    checked={!!createData.featured}
                    onChange={(e) => setCreateData({ ...createData, featured: e.target.checked })}
                    className="h-4 w-4 rounded border-slate-300"
                  />
                  <span className="ml-3 text-sm text-slate-700">Show on top</span>
                </div>
              </label>
            </div>

            <div className="grid gap-4">
              <label className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Images</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleImageUpload(e.target.files)}
                  className="block w-full rounded-[14px] border border-slate-300 bg-white px-4 py-3 text-sm"
                />
                <p className="text-xs text-slate-500">
                  Uploaded images are resized in the browser before saving.
                </p>
              </label>
              {createData.images?.length ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {createData.images.map((src, index) => (
                    <div key={`${index}-${src.slice(0, 20)}`} className="relative h-24 overflow-hidden rounded-[16px] border border-slate-200 bg-white">
                      <Image src={src} alt={`Upload preview ${index + 1}`} fill className="object-cover" unoptimized />
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            <button
              onClick={handleCreate}
              disabled={uploadingImages || isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-[14px] bg-slate-950 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Saving...
                </>
              ) : uploadingImages ? (
                "Processing images..."
              ) : (
                "Create location"
              )}
            </button>
          </div>
        </div>
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
