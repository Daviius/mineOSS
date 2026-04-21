import { CLAIM_COOLDOWN_MS, PACKAGE_CONFIG, PackageType } from "../config/constants";

export const canClaimNow = (lastClaimTime?: Date | null, now: Date = new Date()): boolean => {
  if (!lastClaimTime) return true;
  return now.getTime() - lastClaimTime.getTime() >= CLAIM_COOLDOWN_MS;
};

export const getDailyReward = (packageType: PackageType): number => PACKAGE_CONFIG[packageType].dailyRate;
