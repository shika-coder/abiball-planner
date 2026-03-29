"use client";

import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/lib/use-admin-auth";
import { useState } from "react";
import Link from "next/link";
import { AdminBookingsManager } from "@/components/admin-bookings-manager";
import { AdminLocationsManager } from "@/components/admin-locations-manager";
import { AdminSocialProofManager } from "@/components/admin-social-proof-manager";
import { AdminAnalytics } from "@/components/admin-analytics";
import { AdminVenueSyncDashboard } from "@/components/admin-venue-sync";
import PriceManagementDashboard from "@/components/admin/price-management-dashboard";

type Section = "analytics" | "bookings" | "locations" | "social-proof" | "prices" | "venues";

export function AdminDashboard() {
  const router = useRouter();
  const { admin, loading, logout } = useAdminAuth();
  const [activeSection, setActiveSection] = useState<Section>("analytics");

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-slate-500">Loading...</p>
        </div>
      </main>
    );
  }

  if (!admin) {
    router.push("/admin/login");
    return null;
  }

  const sections: { id: Section; label: string; icon: string }[] = [
    { id: "analytics", label: "Analytics", icon: "📊" },
    { id: "bookings", label: "Bookings", icon: "📋" },
    { id: "locations", label: "Locations", icon: "🏢" },
    { id: "venues", label: "Venues", icon: "🌐" },
    { id: "prices", label: "Prices", icon: "💰" },
    { id: "social-proof", label: "Social Proof", icon: "⭐" }
  ];

  return (
    <main className="mx-auto max-w-7xl px-6 py-8 sm:px-8 lg:px-10">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Admin Panel</p>
          <h1 className="mt-2 text-4xl font-bold text-slate-950">Dashboard</h1>
          <p className="mt-2 text-sm text-slate-600">Welcome, {admin.name}</p>
        </div>
        <button
          onClick={logout}
          className="rounded-full bg-slate-950 px-6 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-slate-800"
        >
          Logout
        </button>
      </div>

      <nav className="mb-8 flex flex-wrap gap-2 rounded-[28px] border border-slate-200 bg-white/80 p-1">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`flex items-center gap-2 rounded-[24px] px-4 py-2.5 text-sm font-semibold transition-all duration-300 ${
              activeSection === section.id
                ? "bg-slate-950 text-white"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <span>{section.icon}</span>
            {section.label}
          </button>
        ))}
      </nav>

      <div className="animate-fade-in">
        {activeSection === "analytics" && <AdminAnalytics />}
        {activeSection === "bookings" && <AdminBookingsManager />}
        {activeSection === "locations" && <AdminLocationsManager />}
        {activeSection === "venues" && <AdminVenueSyncDashboard />}
        {activeSection === "prices" && <PriceManagementDashboard />}
        {activeSection === "social-proof" && <AdminSocialProofManager />}
      </div>
    </main>
  );
}
