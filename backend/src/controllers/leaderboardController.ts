import { NextFunction, Request, Response } from "express";
import { User } from "../models/User";

export const getTopMiners = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const topMiners = await User.find()
      .sort({ totalMined: -1 })
      .limit(100)
      .select("username walletAddress totalMined package")
      .lean();

    res.json({ topMiners, updatedAt: new Date().toISOString() });
  } catch (error) {
    next(error);
  }
};
