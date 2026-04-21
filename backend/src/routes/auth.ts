import { Router } from "express";
import { body } from "express-validator";
import { login, register } from "../controllers/authController";
import { validateRequest } from "../middleware/validate";

const router = Router();

router.post(
  "/register",
  [
    body("walletAddress").isString().isLength({ min: 42, max: 42 }).withMessage("walletAddress must be 42 chars"),
    body("username").isString().isLength({ min: 3, max: 32 }),
    body("password").isString().isLength({ min: 8 })
  ],
  validateRequest,
  register
);

router.post(
  "/login",
  [
    body("walletAddress").isString().isLength({ min: 42, max: 42 }),
    body("password").isString().isLength({ min: 8 })
  ],
  validateRequest,
  login
);

export default router;
