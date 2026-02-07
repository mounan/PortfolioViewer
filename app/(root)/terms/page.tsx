import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms | Portfolio Viewer",
    description: "Basic terms for using Portfolio Viewer.",
};

const RULES = [
    "Use the application lawfully and do not attempt abusive traffic patterns.",
    "Keep your account credentials private.",
    "Market data is provided for informational use only.",
    "You are responsible for your own investment decisions.",
];

export default function TermsPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 pb-20">
            <section className="pt-16 pb-10 space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold text-white">Terms of Service</h1>
                <p className="text-lg text-gray-400">Last updated: February 2026</p>
            </section>

            <section className="bg-gray-900/60 border border-gray-800 rounded-xl p-6 mb-6">
                <h2 className="text-xl font-semibold text-white mb-3">Important Disclaimer</h2>
                <p className="text-gray-400 leading-relaxed">
                    Portfolio Viewer is an analysis and tracking tool. It does not provide financial advice.
                </p>
            </section>

            <section className="bg-gray-900/60 border border-gray-800 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-white mb-3">Usage Rules</h2>
                <ul className="space-y-2 text-gray-400 list-disc list-inside">
                    {RULES.map((rule) => (
                        <li key={rule}>{rule}</li>
                    ))}
                </ul>
            </section>
        </div>
    );
}
