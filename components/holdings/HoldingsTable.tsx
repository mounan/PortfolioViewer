"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteHolding } from "@/lib/actions/holdings.actions";
import { formatMoney } from "@/lib/utils";
import HoldingFormDialog from "@/components/holdings/HoldingFormDialog";

type HoldingsTableProps = {
    items: PortfolioValuationItem[];
    baseCurrency: string;
};

const renderValue = (value: number | null, currency: string) => {
    if (value === null) return "--";
    return formatMoney(value, currency);
};

const renderPercent = (value: number | null) => {
    if (value === null) return "--";
    const color = value > 0 ? "text-green-400" : value < 0 ? "text-red-400" : "text-gray-300";
    const sign = value > 0 ? "+" : "";
    return <span className={color}>{`${sign}${value.toFixed(2)}%`}</span>;
};

export default function HoldingsTable({ items, baseCurrency }: HoldingsTableProps) {
    const router = useRouter();

    const handleDelete = async (holdingId: string) => {
        const confirmed = window.confirm("Delete this holding?");
        if (!confirmed) return;

        try {
            await deleteHolding(holdingId);
            toast.success("Holding deleted");
            router.refresh();
        } catch (error) {
            console.error("Delete holding failed:", error);
            toast.error("Failed to delete holding");
        }
    };

    if (items.length === 0) {
        return (
            <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-8 text-center text-gray-400">
                No holdings yet. Add your first position to start tracking portfolio value.
            </div>
        );
    }

    return (
        <div className="overflow-x-auto bg-gray-900/40 border border-gray-800 rounded-xl">
            <table className="w-full text-left text-sm min-w-[980px]">
                <thead className="bg-gray-800/80 text-gray-400">
                    <tr>
                        <th className="px-4 py-3 font-medium">Symbol</th>
                        <th className="px-4 py-3 font-medium">Exchange</th>
                        <th className="px-4 py-3 font-medium">Quantity</th>
                        <th className="px-4 py-3 font-medium">Avg Cost</th>
                        <th className="px-4 py-3 font-medium">Last Price</th>
                        <th className="px-4 py-3 font-medium">After Hours</th>
                        <th className="px-4 py-3 font-medium">Change</th>
                        <th className="px-4 py-3 font-medium">Market Value ({baseCurrency})</th>
                        <th className="px-4 py-3 font-medium">Unrealized P/L ({baseCurrency})</th>
                        <th className="px-4 py-3 font-medium text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                    {items.map((item) => (
                        <tr key={item.holdingId} className="hover:bg-gray-800/40">
                            <td className="px-4 py-3">
                                <div className="font-semibold text-gray-100">{item.symbol}</div>
                                <div className="text-xs text-gray-500">{item.company}</div>
                            </td>
                            <td className="px-4 py-3 text-gray-300">{item.exchange}</td>
                            <td className="px-4 py-3 text-gray-300">{item.quantity}</td>
                            <td className="px-4 py-3 text-gray-300">
                                {formatMoney(item.avgCost, item.currency)}
                            </td>
                            <td className="px-4 py-3 text-gray-300">
                                {renderValue(item.currentPrice, item.currency)}
                            </td>
                            <td className="px-4 py-3 text-gray-300">
                                {renderValue(item.afterHoursPrice, item.currency)}
                            </td>
                            <td className="px-4 py-3">{renderPercent(item.changePercent)}</td>
                            <td className="px-4 py-3 text-gray-200">
                                {renderValue(item.marketValueBase, baseCurrency)}
                            </td>
                            <td className="px-4 py-3">
                                {item.unrealizedPnlBase === null ? (
                                    <span className="text-gray-400">--</span>
                                ) : (
                                    <span className={item.unrealizedPnlBase >= 0 ? "text-green-400" : "text-red-400"}>
                                        {formatMoney(item.unrealizedPnlBase, baseCurrency)}
                                    </span>
                                )}
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex items-center justify-end gap-2">
                                    <HoldingFormDialog
                                        mode="edit"
                                        holding={item}
                                        onSaved={() => router.refresh()}
                                        trigger={
                                            <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                        }
                                    />
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-gray-300 hover:text-red-400"
                                        onClick={() => handleDelete(item.holdingId)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
