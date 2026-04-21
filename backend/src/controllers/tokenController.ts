import crypto from "node:crypto";
import { NextFunction, Response } from "express";
import { ClientSession, startSession } from "mongoose";
import { AuthRequest } from "../middleware/auth";
import { Transaction } from "../models/Transaction";
import { User } from "../models/User";
import { TRANSFER_FEE_RATE } from "../config/constants";
import { ApiError } from "../utils/errors";

export const transferToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let session: ClientSession | null = null;

  try {
    const { toWalletAddress, amount } = req.body as { toWalletAddress: string; amount: number };
    const normalizedToWallet = toWalletAddress.toLowerCase();

    session = await startSession();

    await session.withTransaction(async () => {
      const fromUser = await User.findById(req.userId).session(session);
      const toUser = await User.findOne({ walletAddress: normalizedToWallet }).session(session);

      if (!fromUser || !toUser) {
        throw new ApiError(404, "Sender or recipient not found");
      }
      if (fromUser._id.equals(toUser._id)) {
        throw new ApiError(400, "Cannot transfer to yourself");
      }

      const fee = Number((amount * TRANSFER_FEE_RATE).toFixed(8));
      const totalDeduction = amount + fee;

      if (fromUser.balance < totalDeduction) {
        throw new ApiError(400, "Insufficient balance");
      }

      fromUser.balance -= totalDeduction;
      toUser.balance += amount;

      await fromUser.save({ session });
      await toUser.save({ session });

      const mockTxHash = `0x${crypto.randomBytes(32).toString("hex")}`;

      const [transaction] = await Transaction.create(
        [
          {
            fromUserId: fromUser._id,
            toUserId: toUser._id,
            amount,
            fee,
            status: "success",
            txHash: mockTxHash
          }
        ],
        { session }
      );

      res.json({
        message: "Transfer successful",
        transaction
      });
    });
  } catch (error) {
    next(error);
  } finally {
    if (session) await session.endSession();
  }
};

export const getTransactions = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const transactions = await Transaction.find({
      $or: [{ fromUserId: req.userId }, { toUserId: req.userId }]
    })
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    res.json({ transactions });
  } catch (error) {
    next(error);
  }
};
