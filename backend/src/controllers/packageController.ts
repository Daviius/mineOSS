import { NextFunction, Response } from "express";
import { ClientSession, startSession } from "mongoose";
import { PACKAGE_CONFIG, PackageType } from "../config/constants";
import { AuthRequest } from "../middleware/auth";
import { Package } from "../models/Package";
import { User } from "../models/User";
import { ApiError } from "../utils/errors";

const upgradablePackageTypes: PackageType[] = ["PREMIUM", "PRO", "ELITE"];

export const getPackages = async (_req: AuthRequest, res: Response) => {
  const packages = upgradablePackageTypes.map((type) => ({
    type,
    ...PACKAGE_CONFIG[type]
  }));

  res.json({ packages });
};

export const upgradePackage = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let session: ClientSession | null = null;

  try {
    const { packageType, durationDays = 30 } = req.body as { packageType: PackageType; durationDays?: number };

    if (!upgradablePackageTypes.includes(packageType)) {
      throw new ApiError(400, "Invalid package type");
    }

    const purchaseDate = new Date();
    const expiryDate = new Date(purchaseDate.getTime() + durationDays * 24 * 60 * 60 * 1000);

    session = await startSession();

    await session.withTransaction(async () => {
      const user = await User.findById(req.userId).session(session);
      if (!user) throw new ApiError(404, "User not found");

      user.package = packageType;
      await user.save({ session });

      const [pkg] = await Package.create(
        [
          {
            userId: user._id,
            packageType,
            purchaseDate,
            expiryDate,
            status: "active"
          }
        ],
        { session }
      );

      res.json({
        message: "Package upgraded successfully",
        package: pkg,
        currentDailyRate: PACKAGE_CONFIG[packageType].dailyRate
      });
    });
  } catch (error) {
    next(error);
  } finally {
    if (session) await session.endSession();
  }
};
