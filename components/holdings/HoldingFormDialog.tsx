"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createHolding, updateHolding } from "@/lib/actions/holdings.actions";

type HoldingFormDialogProps = {
    mode?: "create" | "edit";
    holding?: PortfolioValuationItem;
    trigger: React.ReactNode;
    onSaved?: () => void;
};

export default function HoldingFormDialog({
    mode = "create",
    holding,
    trigger,
    onSaved,
}: HoldingFormDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [symbol, setSymbol] = useState("");
    const [exchange, setExchange] = useState("");
    const [company, setCompany] = useState("");
    const [quantity, setQuantity] = useState("1");
    const [avgCost, setAvgCost] = useState("0");
    const [currency, setCurrency] = useState("JPY");

    const isEdit = mode === "edit";
    const dialogTitle = useMemo(
        () => (isEdit ? "Edit Holding" : "Add Holding"),
        [isEdit]
    );

    useEffect(() => {
        if (isEdit && holding) {
            setSymbol(holding.symbol);
            setExchange(holding.exchange);
            setCompany(holding.company);
            setQuantity(String(holding.quantity));
            setAvgCost(String(holding.avgCost));
            setCurrency(holding.currency);
            return;
        }
        if (!isEdit) {
            setSymbol("");
            setExchange("");
            setCompany("");
            setQuantity("1");
            setAvgCost("0");
            setCurrency("JPY");
        }
    }, [holding, isEdit, open]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);

        try {
            if (isEdit && holding) {
                await updateHolding({
                    id: holding.holdingId,
                    company,
                    quantity: Number(quantity),
                    avgCost: Number(avgCost),
                    currency,
                });
                toast.success("Holding updated");
            } else {
                await createHolding({
                    symbol,
                    exchange,
                    company: company || symbol,
                    quantity: Number(quantity),
                    avgCost: Number(avgCost),
                    currency,
                });
                toast.success("Holding added");
            }

            setOpen(false);
            onSaved?.();
        } catch (error) {
            console.error("Holding save failed:", error);
            toast.error(error instanceof Error ? error.message : "Failed to save holding");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-700 text-white">
                <DialogHeader>
                    <DialogTitle>{dialogTitle}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="holding-symbol">Symbol</Label>
                        <Input
                            id="holding-symbol"
                            value={symbol}
                            onChange={(e) => setSymbol(e.target.value)}
                            placeholder="AAPL"
                            disabled={isEdit}
                            required
                            className="form-input"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="holding-exchange">Exchange</Label>
                        <Input
                            id="holding-exchange"
                            value={exchange}
                            onChange={(e) => setExchange(e.target.value)}
                            placeholder="NASDAQ"
                            disabled={isEdit}
                            required
                            className="form-input"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="holding-company">Company</Label>
                        <Input
                            id="holding-company"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            placeholder="Apple Inc."
                            required
                            className="form-input"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="holding-quantity">Quantity</Label>
                            <Input
                                id="holding-quantity"
                                type="number"
                                min="0.0000001"
                                step="any"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                required
                                className="form-input"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="holding-avg-cost">Avg Cost</Label>
                            <Input
                                id="holding-avg-cost"
                                type="number"
                                min="0"
                                step="any"
                                value={avgCost}
                                onChange={(e) => setAvgCost(e.target.value)}
                                required
                                className="form-input"
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="holding-currency">Currency</Label>
                        <Input
                            id="holding-currency"
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value.toUpperCase())}
                            placeholder="JPY"
                            maxLength={3}
                            required
                            className="form-input"
                        />
                    </div>

                    <Button type="submit" disabled={loading} className="yellow-btn w-full">
                        {loading ? "Saving..." : isEdit ? "Save Changes" : "Add Holding"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
