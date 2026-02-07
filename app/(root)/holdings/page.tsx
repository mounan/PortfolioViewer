import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getUserHoldings } from "@/lib/actions/holdings.actions";
import { buildPortfolioValuation } from "@/lib/services/portfolio/compute";
import PortfolioSummaryCards from "@/components/holdings/PortfolioSummaryCards";
import HoldingsTable from "@/components/holdings/HoldingsTable";
import HoldingFormDialog from "@/components/holdings/HoldingFormDialog";
import HoldingsHeatmap from "@/components/holdings/HoldingsHeatmap";

export const metadata: Metadata = {
    title: "Portfolio | Portfolio Viewer",
    description: "Track holdings, valuation, and unrealized P/L in your base currency.",
};

const BASE_CURRENCY = "JPY";

export default async function HoldingsPage() {
    const holdings = await getUserHoldings();
    const valuation = await buildPortfolioValuation(holdings, { baseCurrency: BASE_CURRENCY });

    return (
        <div className="min-h-screen bg-black text-gray-100 p-6 md:p-8 space-y-6">
            <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
                        Portfolio
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Manage holdings and monitor valuation in {valuation.baseCurrency}.
                    </p>
                </div>

                <HoldingFormDialog
                    mode="create"
                    trigger={
                        <Button className="search-btn">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Holding
                        </Button>
                    }
                />
            </header>

            <PortfolioSummaryCards summary={valuation.summary} />
            <HoldingsHeatmap items={valuation.items} baseCurrency={valuation.baseCurrency} />
            <HoldingsTable items={valuation.items} baseCurrency={valuation.baseCurrency} />
        </div>
    );
}
