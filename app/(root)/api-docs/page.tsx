import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "API Docs | Portfolio Viewer",
    description: "High-level architecture and service map for Portfolio Viewer.",
};

const SECTIONS = [
    {
        title: "Web App",
        points: [
            "Next.js App Router handles UI and server routes.",
            "Authenticated sections use Better Auth session checks.",
        ],
    },
    {
        title: "Data Layer",
        points: [
            "MongoDB stores users, watchlists, and alert records.",
            "Mongoose manages database connections and models.",
        ],
    },
    {
        title: "Market Data",
        points: [
            "Symbol search, quotes, and market news are fetched from configured providers.",
            "Chart-heavy views are rendered through TradingView widgets.",
        ],
    },
    {
        title: "Background Jobs",
        points: [
            "Inngest handles scheduled workflows and event-driven tasks.",
            "Email and alert jobs run outside normal page requests.",
        ],
    },
];

export default function ApiDocsPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 pb-20">
            <section className="pt-16 pb-10 space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold text-white">Architecture Overview</h1>
                <p className="text-lg text-gray-400">
                    Quick reference for how Portfolio Viewer is structured in this repository.
                </p>
            </section>

            <section className="grid gap-4">
                {SECTIONS.map((section) => (
                    <article key={section.title} className="bg-gray-900/60 border border-gray-800 rounded-xl p-6">
                        <h2 className="text-xl font-semibold text-white mb-3">{section.title}</h2>
                        <ul className="space-y-2 text-gray-400 list-disc list-inside">
                            {section.points.map((point) => (
                                <li key={point}>{point}</li>
                            ))}
                        </ul>
                    </article>
                ))}
            </section>
        </div>
    );
}
