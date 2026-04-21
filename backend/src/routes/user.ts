import { Router } from "express";
import { getBalance, getProfile } from "../controllers/authController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.get("/profile", authMiddleware, getProfile);
router.get("/balance", authMiddleware, getBalance);

export default router;
