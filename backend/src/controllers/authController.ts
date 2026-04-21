import bcrypt from "bcryptjs";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { ApiError } from "../utils/errors";
import { AuthRequest } from "../middleware/auth";

const createToken = (userId: string) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new ApiError(500, "JWT secret is not configured");
  }

  const expiresIn = (process.env.JWT_EXPIRES_IN || "7d") as jwt.SignOptions["expiresIn"];
  return jwt.sign({ sub: userId }, secret, { expiresIn });
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { walletAddress, username, password } = req.body;

    const existing = await User.findOne({
      $or: [{ walletAddress: walletAddress.toLowerCase() }, { username }]
    }).lean();

    if (existing) {
      throw new ApiError(409, "Wallet address or username already exists");
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({
      walletAddress: walletAddress.toLowerCase(),
      username,
      passwordHash
    });

    const token = createToken(user._id.toString());

    res.status(201).json({
      token,
      user: {
        id: user._id,
        walletAddress: user.walletAddress,
        username: user.username,
        balance: user.balance,
        package: user.package,
        totalMined: user.totalMined,
        lastClaimTime: user.lastClaimTime
      }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { walletAddress, password } = req.body;

    const user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new ApiError(401, "Invalid credentials");
    }

    const token = createToken(user._id.toString());

    res.json({
      token,
      user: {
        id: user._id,
        walletAddress: user.walletAddress,
        username: user.username,
        balance: user.balance,
        package: user.package,
        totalMined: user.totalMined,
        lastClaimTime: user.lastClaimTime
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.userId).select("-passwordHash");
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    res.json({ user });
  } catch (error) {
    next(error);
  }
};

export const getBalance = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.userId).select("balance package totalMined");
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};
