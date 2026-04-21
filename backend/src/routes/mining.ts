import { Router } from "express";
import { claimDailyMining, getMiningHistory } from "../controllers/miningController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.post("/claim", authMiddleware, claimDailyMining);
router.get("/history", authMiddleware, getMiningHistory);

export default router;
