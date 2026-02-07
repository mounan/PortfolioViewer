import { formatMoney } from "@/lib/utils";

type HeatmapTile = {
    item: PortfolioValuationItem;
    x: number;
    y: number;
    w: number;
    h: number;
};

type HoldingsHeatmapProps = {
    items: PortfolioValuationItem[];
    baseCurrency: string;
};

const colorFromChange = (changePercent: number | null) => {
    if (changePercent === null) return "rgba(75, 85, 99, 0.45)";
    if (changePercent > 0) {
        const alpha = Math.min(0.25 + Math.abs(changePercent) / 20, 0.85);
        return `rgba(22, 163, 74, ${alpha})`;
    }
    if (changePercent < 0) {
        const alpha = Math.min(0.25 + Math.abs(changePercent) / 20, 0.85);
        return `rgba(220, 38, 38, ${alpha})`;
    }
    return "rgba(75, 85, 99, 0.45)";
};

function buildTreemap(
    entries: PortfolioValuationItem[],
    x: number,
    y: number,
    w: number,
    h: number
): HeatmapTile[] {
    if (entries.length === 0 || w <= 0 || h <= 0) return [];
    if (entries.length === 1) return [{ item: entries[0], x, y, w, h }];

    const total = entries.reduce((sum, item) => sum + (item.marketValueBase ?? 0), 0);
    if (total <= 0) return [];

    let running = 0;
    let splitIndex = 0;
    for (let i = 0; i < entries.length; i++) {
        running += entries[i].marketValueBase ?? 0;
        splitIndex = i;
        if (running >= total / 2) break;
    }

    const first = entries.slice(0, splitIndex + 1);
    const second = entries.slice(splitIndex + 1);
    const firstWeight = first.reduce((sum, item) => sum + (item.marketValueBase ?? 0), 0);
    const ratio = firstWeight / total;

    if (w >= h) {
        const w1 = w * ratio;
        return [
            ...buildTreemap(first, x, y, w1, h),
            ...buildTreemap(second, x + w1, y, w - w1, h),
        ];
    }

    const h1 = h * ratio;
    return [
        ...buildTreemap(first, x, y, w, h1),
        ...buildTreemap(second, x, y + h1, w, h - h1),
    ];
}

export default function HoldingsHeatmap({ items, baseCurrency }: HoldingsHeatmapProps) {
    const weightedItems = items
        .filter((item) => (item.marketValueBase ?? 0) > 0)
        .sort((a, b) => (b.marketValueBase ?? 0) - (a.marketValueBase ?? 0));

    if (weightedItems.length === 0) {
        return (
            <section className="bg-gray-900/60 border border-gray-800 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-white mb-2">My Holdings Heatmap</h2>
                <p className="text-sm text-gray-400">
                    Heatmap will appear after holdings have both price data and FX conversion to {baseCurrency}.
                </p>
            </section>
        );
    }

    const total = weightedItems.reduce((sum, item) => sum + (item.marketValueBase ?? 0), 0);
    const tiles = buildTreemap(weightedItems, 0, 0, 100, 100);

    return (
        <section className="bg-gray-900/60 border border-gray-800 rounded-xl p-4 md:p-6 space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">My Holdings Heatmap</h2>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="inline-flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded bg-green-500/70" />
                        Up
                    </span>
                    <span className="inline-flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded bg-red-500/70" />
                        Down
                    </span>
                </div>
            </div>

            <div className="relative w-full h-[420px] rounded-lg overflow-hidden bg-gray-950 border border-gray-800">
                {tiles.map((tile) => {
                    const weight = ((tile.item.marketValueBase ?? 0) / total) * 100;
                    const showDetail = tile.w > 16 && tile.h > 16;
                    const showSubText = tile.w > 22 && tile.h > 22;

                    return (
                        <div
                            key={tile.item.holdingId}
                            className="absolute border border-black/30 p-2 md:p-3 overflow-hidden"
                            style={{
                                left: `${tile.x}%`,
                                top: `${tile.y}%`,
                                width: `${tile.w}%`,
                                height: `${tile.h}%`,
                                background: colorFromChange(tile.item.changePercent),
                            }}
                            title={`${tile.item.symbol} | ${weight.toFixed(2)}% | ${renderValue(tile.item.marketValueBase, baseCurrency)}`}
                        >
                            <div className="flex flex-col h-full justify-between">
                                <div>
                                    <p className="text-sm md:text-base font-semibold text-white">
                                        {tile.item.symbol}
                                    </p>
                                    {showSubText && (
                                        <p className="text-[11px] text-white/80">
                                            {tile.item.exchange}
                                        </p>
                                    )}
                                </div>
                                {showDetail && (
                                    <div className="text-[11px] text-white/90 space-y-0.5">
                                        <p>{weight.toFixed(2)}%</p>
                                        <p>{renderValue(tile.item.marketValueBase, baseCurrency)}</p>
                                        <p>{renderChange(tile.item.changePercent)}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

function renderValue(value: number | null, currency: string) {
    if (value === null) return "--";
    return formatMoney(value, currency);
}

function renderChange(changePercent: number | null) {
    if (changePercent === null) return "N/A";
    const sign = changePercent > 0 ? "+" : "";
    return `${sign}${changePercent.toFixed(2)}%`;
}
