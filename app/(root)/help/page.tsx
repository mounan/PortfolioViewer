import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Help | Portfolio Viewer",
    description: "Quick answers for common Portfolio Viewer workflows.",
};

const FAQS = [
    {
        question: "How do I add a stock to my watchlist?",
        answer: "Use Search to find a symbol, open its detail page, then click the watchlist action button.",
    },
    {
        question: "Why are alerts delayed?",
        answer: "Alert checks run as scheduled background jobs. Delivery time depends on job intervals and provider response time.",
    },
    {
        question: "Where does market data come from?",
        answer: "Quotes and news are pulled from the configured market data providers in this project.",
    },
    {
        question: "Can I export or migrate this project?",
        answer: "Yes. The app is self-hostable and your deployment settings can be moved to your own infrastructure.",
    },
];

export default function HelpPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 pb-20">
            <section className="pt-16 pb-10 space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold text-white">Help Center</h1>
                <p className="text-lg text-gray-400">Common setup and usage questions.</p>
            </section>

            <section className="space-y-4">
                {FAQS.map((faq) => (
                    <article key={faq.question} className="bg-gray-900/60 border border-gray-800 rounded-xl p-6">
                        <h2 className="text-lg font-semibold text-white mb-2">{faq.question}</h2>
                        <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
                    </article>
                ))}
            </section>
        </div>
    );
}
