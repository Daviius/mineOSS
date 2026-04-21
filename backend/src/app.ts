import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import { connectDatabase } from "./config/database";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import miningRoutes from "./routes/mining";
import tokenRoutes from "./routes/token";
import packageRoutes from "./routes/packages";
import leaderboardRoutes from "./routes/leaderboard";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

dotenv.config({ quiet: true });

export const app = express();

app.use(helmet());
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:3000")
  .split(",")
  .map((entry) => entry.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Origin not allowed by CORS"));
    }
  })
);
app.use(express.json());
app.use(morgan("combined"));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: Number(process.env.RATE_LIMIT_MAX || 100),
    standardHeaders: true,
    legacyHeaders: false
  })
);

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/mining", miningRoutes);
app.use("/api/token", tokenRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = Number(process.env.PORT || 4000);

if (process.env.NODE_ENV !== "test") {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error("MONGODB_URI is required");
  }

  connectDatabase(mongoUri)
    .then(() => {
      app.listen(PORT, () => {
        console.log(`FreeMine backend listening on port ${PORT}`);
      });
    })
    .catch((error) => {
      console.error("Database connection failed", error);
      process.exit(1);
    });
}
