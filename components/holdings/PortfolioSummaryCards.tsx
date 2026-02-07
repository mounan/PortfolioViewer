import { formatMoney } from "@/lib/utils";

interface PortfolioSummaryCardsProps {
    summary: PortfolioValuationSummary;
}

const valueColor = (value: number) => {
    if (value > 0) return "text-green-400";
    if (value < 0) return "text-red-400";
    return "text-gray-300";
};

export default function PortfolioSummaryCards({ summary }: PortfolioSummaryCardsProps) {
    return (
        <section className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-5">
                    <p className="text-sm text-gray-400 mb-2">Total Market Value ({summary.baseCurrency})</p>
                    <p className="text-2xl font-semibold text-white">
                        {formatMoney(summary.totalMarketValueBase, summary.baseCurrency)}
                    </p>
                </div>
                <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-5">
                    <p className="text-sm text-gray-400 mb-2">Total Cost ({summary.baseCurrency})</p>
                    <p className="text-2xl font-semibold text-white">
                        {formatMoney(summary.totalCostBase, summary.baseCurrency)}
                    </p>
                </div>
                <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-5">
                    <p className="text-sm text-gray-400 mb-2">Unrealized P/L ({summary.baseCurrency})</p>
                    <p className={`text-2xl font-semibold ${valueColor(summary.totalUnrealizedPnlBase)}`}>
                        {formatMoney(summary.totalUnrealizedPnlBase, summary.baseCurrency)}
                    </p>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
                <span className="px-2 py-1 rounded bg-gray-800 border border-gray-700">
                    Holdings: {summary.totalHoldings}
                </span>
                <span className="px-2 py-1 rounded bg-gray-800 border border-gray-700">
                    Priced: {summary.pricedHoldings}
                </span>
                {summary.missingPriceSymbols.length > 0 && (
                    <span className="px-2 py-1 rounded bg-yellow-500/10 text-yellow-300 border border-yellow-500/30">
                        Missing prices: {summary.missingPriceSymbols.join(", ")}
                    </span>
                )}
                {summary.missingFxCurrencies.length > 0 && (
                    <span className="px-2 py-1 rounded bg-yellow-500/10 text-yellow-300 border border-yellow-500/30">
                        Missing FX: {summary.missingFxCurrencies.join(", ")}
                    </span>
                )}
            </div>
        </section>
    );
}
