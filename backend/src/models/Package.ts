import mongoose, { Document, Schema, Types } from "mongoose";
import { PackageType } from "../config/constants";

export interface IPackage extends Document {
  userId: Types.ObjectId;
  packageType: Exclude<PackageType, "FREE">;
  purchaseDate: Date;
  expiryDate: Date;
  status: "active" | "expired" | "cancelled";
}

const packageSchema = new Schema<IPackage>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  packageType: { type: String, enum: ["PREMIUM", "PRO", "ELITE"], required: true },
  purchaseDate: { type: Date, required: true },
  expiryDate: { type: Date, required: true },
  status: { type: String, enum: ["active", "expired", "cancelled"], default: "active" }
});

export const Package = mongoose.model<IPackage>("Package", packageSchema);
