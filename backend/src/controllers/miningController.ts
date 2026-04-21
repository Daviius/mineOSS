import { NextFunction, Response } from "express";
import { ClientSession, startSession } from "mongoose";
import { AuthRequest } from "../middleware/auth";
import { MiningRecord } from "../models/MiningRecord";
import { User } from "../models/User";
import { ApiError } from "../utils/errors";
import { canClaimNow, getDailyReward } from "../utils/mining";

export const claimDailyMining = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let session: ClientSession | null = null;

  try {
    session = await startSession();

    await session.withTransaction(async () => {
      const user = await User.findById(req.userId).session(session);
      if (!user) {
        throw new ApiError(404, "User not found");
      }

      if (!canClaimNow(user.lastClaimTime)) {
        throw new ApiError(429, "Claim is available every 24 hours");
      }

      const reward = getDailyReward(user.package);
      user.balance += reward;
      user.totalMined += reward;
      user.lastClaimTime = new Date();
      await user.save({ session });

      await MiningRecord.create(
        [
          {
            userId: user._id,
            amount: reward,
            timestamp: new Date()
          }
        ],
        { session }
      );

      res.json({
        message: "Claim successful",
        reward,
        balance: user.balance,
        totalMined: user.totalMined,
        nextClaimAt: new Date(user.lastClaimTime.getTime() + 24 * 60 * 60 * 1000)
      });
    });
  } catch (error) {
    next(error);
  } finally {
    if (session) await session.endSession();
  }
};

export const getMiningHistory = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const records = await MiningRecord.find({ userId: req.userId }).sort({ timestamp: -1 }).limit(100).lean();
    res.json({ records });
  } catch (error) {
    next(error);
  }
};
