import { Router } from "express";
import { body } from "express-validator";
import { getTransactions, transferToken } from "../controllers/tokenController";
import { authMiddleware } from "../middleware/auth";
import { validateRequest } from "../middleware/validate";

const router = Router();

router.post(
  "/transfer",
  authMiddleware,
  [
    body("toWalletAddress").isString().isLength({ min: 42, max: 42 }),
    body("amount").isFloat({ gt: 0 })
  ],
  validateRequest,
  transferToken
);

router.get("/transactions", authMiddleware, getTransactions);

export default router;
