'use server';

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/database/mongoose";
import { Holding } from "@/database/models/holding.model";
import { getAuth } from "@/lib/better-auth/auth";

const HOLDINGS_PATH = "/holdings";

function normalizeText(value: string) {
    return value.trim();
}

function normalizeSymbol(value: string) {
    return normalizeText(value).toUpperCase();
}

function normalizeCurrency(value: string) {
    return normalizeText(value).toUpperCase();
}

async function getCurrentUserIdOrThrow() {
    const auth = await getAuth();
    const requestHeaders = await headers();
    const session = await auth.api.getSession({ headers: requestHeaders });

    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    return session.user.id;
}

function assertHoldingValues(input: {
    symbol: string;
    exchange: string;
    company: string;
    quantity: number;
    avgCost: number;
    currency: string;
}) {
    if (!input.symbol || !input.exchange || !input.company || !input.currency) {
        throw new Error("Missing required holding fields");
    }
    if (!Number.isFinite(input.quantity) || input.quantity <= 0) {
        throw new Error("Quantity must be greater than 0");
    }
    if (!Number.isFinite(input.avgCost) || input.avgCost < 0) {
        throw new Error("Average cost must be 0 or greater");
    }
    if (input.currency.length !== 3) {
        throw new Error("Currency must be a 3-letter code");
    }
}

export async function getUserHoldings() {
    try {
        const userId = await getCurrentUserIdOrThrow();
        await connectToDatabase();

        const holdings = await Holding.find({ userId }).sort({ updatedAt: -1 }).lean();
        return JSON.parse(JSON.stringify(holdings)) as HoldingRecord[];
    } catch (error) {
        console.error("Error fetching holdings:", error);
        return [];
    }
}

export async function createHolding(input: HoldingCreateInput) {
    const userId = await getCurrentUserIdOrThrow();
    const normalized = {
        symbol: normalizeSymbol(input.symbol),
        exchange: normalizeSymbol(input.exchange),
        company: normalizeText(input.company || input.symbol),
        quantity: Number(input.quantity),
        avgCost: Number(input.avgCost),
        currency: normalizeCurrency(input.currency),
    };
    assertHoldingValues(normalized);

    await connectToDatabase();

    const existing = await Holding.findOne({
        userId,
        symbol: normalized.symbol,
        exchange: normalized.exchange,
    });

    let saved: HoldingRecord | null = null;
    if (existing) {
        const nextQuantity = existing.quantity + normalized.quantity;
        const nextAvgCost =
            (existing.quantity * existing.avgCost + normalized.quantity * normalized.avgCost) / nextQuantity;

        existing.quantity = nextQuantity;
        existing.avgCost = nextAvgCost;
        existing.company = normalized.company;
        existing.currency = existing.currency || normalized.currency;

        saved = (await existing.save()).toObject() as HoldingRecord;
    } else {
        saved = (await Holding.create({
            userId,
            ...normalized,
        })).toObject() as HoldingRecord;
    }

    revalidatePath(HOLDINGS_PATH);
    return JSON.parse(JSON.stringify(saved)) as HoldingRecord;
}

export async function updateHolding(input: HoldingUpdateInput) {
    const userId = await getCurrentUserIdOrThrow();

    const patch: Partial<HoldingUpdateInput> = {};
    if (input.company !== undefined) patch.company = normalizeText(input.company);
    if (input.quantity !== undefined) patch.quantity = Number(input.quantity);
    if (input.avgCost !== undefined) patch.avgCost = Number(input.avgCost);
    if (input.currency !== undefined) patch.currency = normalizeCurrency(input.currency);

    if (patch.quantity !== undefined && (!Number.isFinite(patch.quantity) || patch.quantity <= 0)) {
        throw new Error("Quantity must be greater than 0");
    }
    if (patch.avgCost !== undefined && (!Number.isFinite(patch.avgCost) || patch.avgCost < 0)) {
        throw new Error("Average cost must be 0 or greater");
    }
    if (patch.currency !== undefined && patch.currency.length !== 3) {
        throw new Error("Currency must be a 3-letter code");
    }

    await connectToDatabase();

    const updated = await Holding.findOneAndUpdate(
        { _id: input.id, userId },
        { $set: patch },
        { new: true }
    ).lean();

    if (!updated) {
        throw new Error("Holding not found");
    }

    revalidatePath(HOLDINGS_PATH);
    return JSON.parse(JSON.stringify(updated)) as HoldingRecord;
}

export async function deleteHolding(id: string) {
    const userId = await getCurrentUserIdOrThrow();
    await connectToDatabase();

    await Holding.findOneAndDelete({ _id: id, userId });
    revalidatePath(HOLDINGS_PATH);

    return { success: true };
}
