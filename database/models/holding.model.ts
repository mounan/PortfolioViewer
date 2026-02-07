import { Schema, model, models, type Document, type Model } from "mongoose";

export interface HoldingDocument extends Document {
    userId: string;
    symbol: string;
    exchange: string;
    company: string;
    quantity: number;
    avgCost: number;
    currency: string;
    createdAt: Date;
    updatedAt: Date;
}

const HoldingSchema = new Schema<HoldingDocument>(
    {
        userId: { type: String, required: true, index: true },
        symbol: { type: String, required: true, uppercase: true, trim: true },
        exchange: { type: String, required: true, uppercase: true, trim: true },
        company: { type: String, required: true, trim: true },
        quantity: { type: Number, required: true, min: 0.0000001 },
        avgCost: { type: Number, required: true, min: 0 },
        currency: { type: String, required: true, uppercase: true, trim: true, minlength: 3, maxlength: 3 },
    },
    { timestamps: true }
);

// One aggregated position per user + symbol + exchange.
HoldingSchema.index({ userId: 1, symbol: 1, exchange: 1 }, { unique: true });

export const Holding: Model<HoldingDocument> =
    (models?.Holding as Model<HoldingDocument>) || model<HoldingDocument>("Holding", HoldingSchema);
