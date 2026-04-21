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
    body("toWalletAddress").isString().matches(/^0x[a-fA-F0-9]{40}$/),
    body("amount").isFloat({ gt: 0 })
  ],
  validateRequest,
  transferToken
);

router.get("/transactions", authMiddleware, getTransactions);

export default router;
