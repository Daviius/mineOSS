import { Router } from "express";
import { getTopMiners } from "../controllers/leaderboardController";

const router = Router();

router.get("/miners", getTopMiners);

export default router;
