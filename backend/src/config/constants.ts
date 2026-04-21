export type PackageType = "FREE" | "PREMIUM" | "PRO" | "ELITE";

export const PACKAGE_CONFIG: Record<PackageType, { dailyRate: number; multiplier: number; priceUSDT: number }> = {
  FREE: { dailyRate: 0.5, multiplier: 1, priceUSDT: 0 },
  PREMIUM: { dailyRate: 1, multiplier: 2, priceUSDT: 9.99 },
  PRO: { dailyRate: 2, multiplier: 4, priceUSDT: 29.99 },
  ELITE: { dailyRate: 5, multiplier: 10, priceUSDT: 99.99 }
};

export const CLAIM_COOLDOWN_MS = 24 * 60 * 60 * 1000;
export const TRANSFER_FEE_RATE = 0.02;
