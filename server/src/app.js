import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import authRoutes from "./routes/authRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import ownerRoutes from "./routes/ownerRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import publicPropertyRoutes from "./routes/publicPropertyRoutes.js";
import publicRoomRoutes from "./routes/publicRoomRoutes.js";
import publicBedRoutes from "./routes/publicBedRoutes.js";

const app = express();

// Global middleware
app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
  })
);

app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running",
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/owner", ownerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/properties", publicPropertyRoutes);
app.use("/api/rooms", publicRoomRoutes);
app.use("/api/beds", publicBedRoutes);

export default app;