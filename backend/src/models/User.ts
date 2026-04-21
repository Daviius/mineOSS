import mongoose, { Document, Schema } from "mongoose";
import { PackageType } from "../config/constants";

export interface IUser extends Document {
  walletAddress: string;
  username: string;
  passwordHash: string;
  balance: number;
  package: PackageType;
  lastClaimTime?: Date;
  totalMined: number;
}

const userSchema = new Schema<IUser>(
  {
    walletAddress: { type: String, required: true, unique: true, lowercase: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true },
    passwordHash: { type: String, required: true },
    balance: { type: Number, default: 0, min: 0 },
    package: { type: String, enum: ["FREE", "PREMIUM", "PRO", "ELITE"], default: "FREE" },
    lastClaimTime: { type: Date },
    totalMined: { type: Number, default: 0, min: 0 }
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);
