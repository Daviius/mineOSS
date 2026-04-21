import { Router } from "express";
import { body } from "express-validator";
import { getPackages, upgradePackage } from "../controllers/packageController";
import { authMiddleware } from "../middleware/auth";
import { validateRequest } from "../middleware/validate";

const router = Router();

router.get("/", getPackages);
router.post(
  "/upgrade",
  authMiddleware,
  [
    body("packageType").isIn(["PREMIUM", "PRO", "ELITE"]),
    body("durationDays").optional().isInt({ min: 1, max: 365 })
  ],
  validateRequest,
  upgradePackage
);

export default router;
