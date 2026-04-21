import mongoose, { Document, Schema, Types } from "mongoose";

export interface IMiningRecord extends Document {
  userId: Types.ObjectId;
  amount: number;
  timestamp: Date;
}

const miningRecordSchema = new Schema<IMiningRecord>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  amount: { type: Number, required: true, min: 0 },
  timestamp: { type: Date, default: Date.now }
});

export const MiningRecord = mongoose.model<IMiningRecord>("MiningRecord", miningRecordSchema);
