import { Navbar } from "@/components/navbar";

export const metadata = {
  title: "Blog - Abiball Planer",
  description: "Blog posts and tips for planning your Abiball"
};

const blogPosts = [
  {
    id: 1,
    title: "10 Tipps für die perfekte Abiball-Location",
    category: "Planung",
    date: "Demnächst",
    image: "📍"
  },
  {
    id: 2,
    title: "Budget-Tipps: Wie viel sollte ein Abiball kosten?",
    category: "Budget",
    date: "Demnächst",
    image: "💰"
  },
  {
    id: 3,
    title: "Checkliste: Was muss ich vor der Location-Buchung beachten?",
    category: "Checkliste",
    date: "Demnächst",
    image: "✅"
  }
];

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 px-5 sm:px-8 lg:px-10 pb-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12">
            <h1 className="text-5xl font-bold text-slate-900 mb-4">Abiball Blog</h1>
            <p className="text-xl text-slate-600">
              Tipps, Tricks und Inspirationen für die perfekte Abiball-Planung.
            </p>
          </div>

          <div className="grid gap-8 mb-16">
            {blogPosts.map((post) => (
              <div
                key={post.id}
                className="rounded-2xl border border-slate-200 bg-white p-8 hover:shadow-lg transition duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{post.image}</div>
                  <div className="flex-1">
                    <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-2">
                      {post.category}
                    </span>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{post.title}</h3>
                    <p className="text-sm text-slate-500">{post.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 p-8 md:p-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Newsletter</h2>
            <p className="text-slate-600 mb-6">
              Abonniert unseren Newsletter und erhaltet regelmäßig neue Tipps und Updates zur Abiball-Planung.
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Deine E-Mail..."
                className="flex-1 rounded-full border border-slate-300 px-6 py-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <button
                type="submit"
                className="rounded-full bg-blue-600 px-8 py-3 font-semibold text-white hover:bg-blue-700 transition duration-300"
              >
                Abonnieren
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
