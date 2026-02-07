import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "About | Portfolio Viewer",
    description: "Overview of Portfolio Viewer and what it helps you track.",
};

export default function AboutPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 pb-20">
            <section className="pt-16 pb-10 space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold text-white">About Portfolio Viewer</h1>
                <p className="text-lg text-gray-400 leading-relaxed">
                    Portfolio Viewer is a stock tracking dashboard focused on practical daily use: watchlists, alerts,
                    quote checks, and market widgets in one place.
                </p>
            </section>

            <section className="grid md:grid-cols-3 gap-4">
                <FeatureCard title="Track" description="Monitor market prices and watchlist performance in real time." />
                <FeatureCard title="Review" description="Open symbol pages with charts, technicals, and company data." />
                <FeatureCard title="Manage" description="Maintain custom watchlists and alerts tied to your account." />
            </section>
        </div>
    );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
    return (
        <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-2">{title}</h2>
            <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
        </div>
    );
}
