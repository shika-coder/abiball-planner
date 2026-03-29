import { Navbar } from "@/components/navbar";
import Link from "next/link";

export const metadata = {
  title: "Pricing - Abiball Planer",
  description: "Pricing information for Abiball Planer"
};

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="text-4xl font-bold mb-6">Pricing</h1>
        <div className="prose prose-slate max-w-none">
          <p className="text-slate-600 mb-4">
            Our Abiball Planer service is completely free to use. 
            There are no hidden fees or charges.
          </p>
          <h2 className="text-2xl font-semibold mt-8 mb-4">Features</h2>
          <ul className="space-y-2 text-slate-600">
            <li>✓ Compare multiple event venues</li>
            <li>✓ Filter by budget and guest count</li>
            <li>✓ Request bookings directly</li>
            <li>✓ Access venue details and images</li>
            <li>✓ Save favorite venues</li>
          </ul>
          <p className="mt-8 text-slate-600">
            Contact us at{" "}
            <Link href="/contact" className="text-blue-600 hover:underline">
              contact page
            </Link>{" "}
            for more information.
          </p>
        </div>
      </main>
    </>
  );
}
