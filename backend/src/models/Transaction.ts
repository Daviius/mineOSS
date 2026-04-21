import mongoose, { Document, Schema, Types } from "mongoose";

export interface ITransaction extends Document {
  fromUserId: Types.ObjectId;
  toUserId: Types.ObjectId;
  amount: number;
  fee: number;
  status: "pending" | "success" | "failed";
  txHash: string;
}

const transactionSchema = new Schema<ITransaction>(
  {
    fromUserId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    toUserId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    amount: { type: Number, required: true, min: 0 },
    fee: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ["pending", "success", "failed"], default: "success" },
    txHash: { type: String, required: true, index: true }
  },
  { timestamps: true }
);

export const Transaction = mongoose.model<ITransaction>("Transaction", transactionSchema);
