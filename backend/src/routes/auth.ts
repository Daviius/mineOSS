import { Router } from "express";
import { body } from "express-validator";
import { login, register } from "../controllers/authController";
import { validateRequest } from "../middleware/validate";

const router = Router();

router.post(
  "/register",
  [
    body("walletAddress")
      .isString()
      .matches(/^0x[a-fA-F0-9]{40}$/)
      .withMessage("walletAddress must be a valid EVM address"),
    body("username").isString().isLength({ min: 3, max: 32 }),
    body("password").isString().isLength({ min: 8 })
  ],
  validateRequest,
  register
);

router.post(
  "/login",
  [
    body("walletAddress").isString().matches(/^0x[a-fA-F0-9]{40}$/),
    body("password").isString().isLength({ min: 8 })
  ],
  validateRequest,
  login
);

export default router;
