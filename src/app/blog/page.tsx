import { Navbar } from "@/components/navbar";

export const metadata = {
  title: "Blog - Abiball Planer",
  description: "Blog posts and tips for planning your Abiball"
};

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="text-4xl font-bold mb-6">Blog</h1>
        <div className="prose prose-slate max-w-none">
          <p className="text-slate-600 mb-8">
            Stay tuned for helpful articles and tips about planning your Abiball celebration.
          </p>
          <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-700 mb-2">Coming Soon</h2>
            <p className="text-slate-600">
              We&apos;re working on great content to help you plan the perfect Abiball event.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
