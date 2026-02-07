import { getFxRate, getHoldingsMarketSnapshots } from "@/lib/actions/finnhub.actions";

type BuildPortfolioOptions = {
    baseCurrency?: string;
};

const round2 = (value: number) => Math.round(value * 100) / 100;

export async function buildPortfolioValuation(
    holdings: HoldingRecord[],
    options: BuildPortfolioOptions = {}
): Promise<PortfolioValuationResult> {
    const baseCurrency = (options.baseCurrency || "JPY").toUpperCase();

    if (!holdings || holdings.length === 0) {
        return {
            baseCurrency,
            items: [],
            summary: {
                baseCurrency,
                totalHoldings: 0,
                pricedHoldings: 0,
                totalMarketValueBase: 0,
                totalCostBase: 0,
                totalUnrealizedPnlBase: 0,
                missingFxCurrencies: [],
                missingPriceSymbols: [],
            },
        };
    }

    const symbols = holdings.map((holding) => holding.symbol);
    const snapshots = await getHoldingsMarketSnapshots(symbols);
    const snapshotMap = new Map(snapshots.map((snapshot) => [snapshot.symbol.toUpperCase(), snapshot]));

    const uniqueCurrencies = [...new Set(holdings.map((holding) => holding.currency.toUpperCase()))];
    const fxRateEntries = await Promise.all(
        uniqueCurrencies.map(async (currency) => {
            const rate = await getFxRate(currency, baseCurrency);
            return [currency, rate] as const;
        })
    );
    const fxRates = new Map<string, number | null>(fxRateEntries);

    const items: PortfolioValuationItem[] = holdings.map((holding) => {
        const symbolKey = holding.symbol.toUpperCase();
        const holdingCurrency = holding.currency.toUpperCase();
        const snapshot = snapshotMap.get(symbolKey);

        const currentPrice = snapshot?.price ?? null;
        const afterHoursPrice = snapshot?.afterHoursPrice ?? null;
        const changePercent = snapshot?.changePercent ?? null;
        const fxRateToBase = fxRates.get(holdingCurrency) ?? null;

        const quantity = holding.quantity;
        const avgCost = holding.avgCost;
        const costValueLocal = quantity * avgCost;
        const marketValueLocal = currentPrice !== null ? quantity * currentPrice : null;
        const unrealizedPnlLocal =
            marketValueLocal !== null ? marketValueLocal - costValueLocal : null;

        const costValueBase = fxRateToBase !== null ? costValueLocal * fxRateToBase : null;
        const marketValueBase =
            marketValueLocal !== null && fxRateToBase !== null ? marketValueLocal * fxRateToBase : null;
        const unrealizedPnlBase =
            marketValueBase !== null && costValueBase !== null ? marketValueBase - costValueBase : null;

        return {
            holdingId: holding._id,
            symbol: holding.symbol,
            exchange: holding.exchange,
            company: holding.company,
            quantity,
            avgCost,
            currency: holdingCurrency,
            currentPrice,
            afterHoursPrice,
            changePercent,
            fxRateToBase,
            marketValueLocal: marketValueLocal !== null ? round2(marketValueLocal) : null,
            costValueLocal: round2(costValueLocal),
            unrealizedPnlLocal: unrealizedPnlLocal !== null ? round2(unrealizedPnlLocal) : null,
            marketValueBase: marketValueBase !== null ? round2(marketValueBase) : null,
            costValueBase: costValueBase !== null ? round2(costValueBase) : null,
            unrealizedPnlBase: unrealizedPnlBase !== null ? round2(unrealizedPnlBase) : null,
        };
    });

    const totalMarketValueBase = round2(
        items.reduce((sum, item) => sum + (item.marketValueBase ?? 0), 0)
    );
    const totalCostBase = round2(
        items.reduce((sum, item) => sum + (item.costValueBase ?? 0), 0)
    );
    const totalUnrealizedPnlBase = round2(totalMarketValueBase - totalCostBase);

    const missingFxCurrencies = [...new Set(items.filter((item) => item.fxRateToBase === null).map((item) => item.currency))];
    const missingPriceSymbols = [...new Set(items.filter((item) => item.currentPrice === null).map((item) => item.symbol))];
    const pricedHoldings = items.filter((item) => item.currentPrice !== null).length;

    return {
        baseCurrency,
        items,
        summary: {
            baseCurrency,
            totalHoldings: items.length,
            pricedHoldings,
            totalMarketValueBase,
            totalCostBase,
            totalUnrealizedPnlBase,
            missingFxCurrencies,
            missingPriceSymbols,
        },
    };
}
