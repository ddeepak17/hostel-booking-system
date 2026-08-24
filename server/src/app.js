import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import {
  rateLimit,
} from "express-rate-limit";

import authRoutes from "./routes/authRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import ownerRoutes from "./routes/ownerRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import publicPropertyRoutes from "./routes/publicPropertyRoutes.js";
import publicRoomRoutes from "./routes/publicRoomRoutes.js";
import publicBedRoutes from "./routes/publicBedRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";


const app =
  express();


app.set(
  "trust proxy",
  1
);


app.use(
  helmet()
);


app.use(
  cors({
    origin:
      process.env.CLIENT_URL,

    methods: [
      "GET",
      "POST",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);


app.use(
  express.json({
    limit:
      "1mb",
  })
);


if (
  process.env.NODE_ENV ===
  "development"
) {
  app.use(
    morgan(
      "dev"
    )
  );
}


const apiLimiter =
  rateLimit({
    windowMs:
      15 * 60 * 1000,

    limit:
      500,

    standardHeaders:
      true,

    legacyHeaders:
      false,

    message: {
      success:
        false,

      message:
        "Too many requests. Please try again later.",
    },
  });


const authLimiter =
  rateLimit({
    windowMs:
      15 * 60 * 1000,

    limit:
      40,

    standardHeaders:
      true,

    legacyHeaders:
      false,

    message: {
      success:
        false,

      message:
        "Too many authentication attempts. Please try again later.",
    },
  });


app.get(
  "/api/health",
  (
    req,
    res
  ) => {
    res.status(
      200
    ).json({
      success:
        true,

      message:
        "API is running",
    });
  }
);


app.use(
  "/api",
  apiLimiter
);


app.use(
  "/api/auth",
  authLimiter,
  authRoutes
);


app.use(
  "/api/customer",
  customerRoutes
);


app.use(
  "/api/owner",
  ownerRoutes
);


app.use(
  "/api/admin",
  adminRoutes
);


app.use(
  "/api/properties",
  publicPropertyRoutes
);


app.use(
  "/api/rooms",
  publicRoomRoutes
);


app.use(
  "/api/beds",
  publicBedRoutes
);


app.use(
  "/api/reviews",
  reviewRoutes
);


app.use(
  (
    req,
    res
  ) => {
    return res
      .status(
        404
      )
      .json({
        success:
          false,

        message:
          "API endpoint not found",
      });
  }
);


app.use(
  (
    error,
    req,
    res,
    next
  ) => {
    void req;
    void next;

    console.error(
      "Unhandled server error:",
      error
    );


    return res
      .status(
        500
      )
      .json({
        success:
          false,

        message:
          "Internal server error",
      });
  }
);


export default app;