import { canClaimNow, getDailyReward } from "../utils/mining";

describe("mining utilities", () => {
  it("allows first claim when no last claim time", () => {
    expect(canClaimNow(undefined, new Date())).toBe(true);
  });

  it("rejects claim before 24 hours cooldown", () => {
    const now = new Date("2026-01-02T00:00:00.000Z");
    const lastClaim = new Date("2026-01-01T12:00:00.000Z");
    expect(canClaimNow(lastClaim, now)).toBe(false);
  });

  it("returns expected daily rewards by package", () => {
    expect(getDailyReward("FREE")).toBe(0.5);
    expect(getDailyReward("PREMIUM")).toBe(1);
    expect(getDailyReward("PRO")).toBe(2);
    expect(getDailyReward("ELITE")).toBe(5);
  });
});
