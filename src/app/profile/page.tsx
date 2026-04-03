"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import type { BookingRequest } from "@/types/booking";

export default function Profile() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"profile" | "requests" | "favorites" | "security">("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [requests, setRequests] = useState<BookingRequest[]>([]);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    school: "",
    city: "",
    phone: ""
  });

  const fetchProfile = useCallback(async () => {
    try {
      const response = await fetch("/api/profile");
      if (response.status === 401) {
        router.push("/login");
        return;
      }
      if (response.ok) {
        const data = await response.json();
        setProfile({
          name: data.name || "",
          email: data.email || "",
          school: data.school || "",
          city: data.city || "",
          phone: data.phone || ""
        });
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  const fetchRequests = useCallback(async () => {
    setRequestsLoading(true);
    try {
      const response = await fetch("/api/bookings");
      if (response.status === 401) {
        router.push("/login");
        return;
      }
      if (response.ok) {
        const data = await response.json();
        setRequests(data.requests || []);
      }
    } catch (error) {
      console.error("Error loading requests:", error);
    } finally {
      setRequestsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (activeTab === "requests") {
      fetchRequests();
    }
  }, [activeTab, fetchRequests]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile)
      });
      if (response.ok) {
        setIsEditing(false);
        alert("Profil gespeichert!");
      }
    } catch (error) {
      alert("Fehler beim Speichern");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="pt-24 px-5 sm:px-8 lg:px-10 pb-20">
          <p className="text-slate-600">Wird geladen...</p>
        </main>
      </>
    );
  }

  const tabs = [
    { id: "profile" as const, label: "Profil", icon: "👤" },
    { id: "requests" as const, label: "Anfragen", icon: "📋" },
    { id: "favorites" as const, label: "Favoriten", icon: "⭐" },
    { id: "security" as const, label: "Sicherheit", icon: "🔒" }
  ];

  return (
    <>
      <Navbar />
      <main className="pt-24 px-5 sm:px-8 lg:px-10 pb-20">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-900">Dein Profil</h1>
              <p className="mt-4 text-slate-600">Verwalte hier deine persönlichen Einstellungen und Anfragen.</p>
            </div>
            <Link
              href="/"
              className="secondary-button rounded-full px-5 py-3 font-semibold text-sm whitespace-nowrap"
            >
              ← Zu den Venues
            </Link>
          </div>

          {/* Tab Navigation */}
          <div className="mt-10 border-b border-slate-200">
            <div className="flex gap-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    if (tab.id !== "profile") {
                      setIsEditing(false);
                    }
                  }}
                  className={`whitespace-nowrap pb-4 px-1 text-base font-semibold transition-colors ${
                    activeTab === tab.id
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <>
              {isEditing ? (
                <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-8">
                  <h2 className="text-2xl font-bold text-slate-900">Profil bearbeiten</h2>
                  <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                    <input
                      required
                      type="text"
                      placeholder="Name"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                    <input
                      disabled
                      type="email"
                      placeholder="E-Mail"
                      value={profile.email}
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 bg-slate-100 cursor-not-allowed"
                    />
                    <input
                      required
                      type="text"
                      placeholder="Schule"
                      value={profile.school}
                      onChange={(e) => setProfile({ ...profile, school: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                    <input
                      required
                      type="text"
                      placeholder="Stadt"
                      value={profile.city}
                      onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                    <input
                      type="tel"
                      placeholder="Telefonnummer"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        className="flex-1 rounded-full bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
                      >
                        Speichern
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="flex-1 rounded-full border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        Abbrechen
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-8">
                  <h2 className="text-2xl font-bold text-slate-900">Persönliche Informationen</h2>
                  <div className="mt-6 space-y-3">
                    <p className="text-slate-700">
                      <span className="font-semibold">Name:</span> {profile.name || "—"}
                    </p>
                    <p className="text-slate-700">
                      <span className="font-semibold">E-Mail:</span> {profile.email || "—"}
                    </p>
                    <p className="text-slate-700">
                      <span className="font-semibold">Schule:</span> {profile.school || "—"}
                    </p>
                    <p className="text-slate-700">
                      <span className="font-semibold">Stadt:</span> {profile.city || "—"}
                    </p>
                    <p className="text-slate-700">
                      <span className="font-semibold">Telefon:</span> {profile.phone || "—"}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="mt-8 rounded-full bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
                  >
                    Bearbeiten
                  </button>
                </div>
              )}
            </>
          )}

          {/* Requests Tab */}
          {activeTab === "requests" && (
            <div className="mt-10">
              {requestsLoading ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
                  <p className="text-slate-600">Anfragen werden geladen...</p>
                </div>
              ) : requests.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
                  <p className="text-3xl mb-4">📭</p>
                  <h3 className="text-xl font-bold text-slate-900">Keine Anfragen</h3>
                  <p className="mt-2 text-slate-600">Du hast noch keine Anfragen zu Locations gestellt.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {requests.map((request) => (
                    <div
                      key={request.id}
                      className="rounded-2xl border border-slate-200 bg-white p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-slate-900">{request.locationName}</h3>
                          <p className="mt-2 text-sm text-slate-600">
                            <span className="font-semibold">Schule:</span> {request.schoolName}
                          </p>
                          <p className="mt-1 text-sm text-slate-600">
                            <span className="font-semibold">Gäste:</span> {request.guests}
                          </p>
                          <p className="mt-1 text-sm text-slate-600">
                            <span className="font-semibold">Gewünschtes Datum:</span>{" "}
                            {new Date(request.preferredDate).toLocaleDateString("de-DE", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric"
                            })}
                          </p>
                          <p className="mt-1 text-sm text-slate-600">
                            <span className="font-semibold">Anfrage ID:</span> {request.id}
                          </p>
                        </div>
                        <div className="flex flex-col items-start sm:items-end gap-3">
                          <div className="rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-green-700">
                            ✓ Gesendet
                          </div>
                          <p className="text-xs text-slate-500">
                            {new Date(request.createdAt).toLocaleDateString("de-DE", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Favorites Tab */}
          {activeTab === "favorites" && (
            <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-8 text-center">
              <p className="text-3xl mb-4">⭐</p>
              <h3 className="text-xl font-bold text-slate-900">Favoriten</h3>
              <p className="mt-2 text-slate-600">Diese Funktion wird bald freigeschaltet.</p>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-8 text-center">
              <p className="text-3xl mb-4">🔒</p>
              <h3 className="text-xl font-bold text-slate-900">Sicherheit</h3>
              <p className="mt-2 text-slate-600">Diese Funktion wird bald freigeschaltet.</p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
