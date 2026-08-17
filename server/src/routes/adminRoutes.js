import { Router } from "express";

import {
  protect,
  authorize,
} from "../middleware/authMiddleware.js";

const router = Router();

router.get(
  "/dashboard",
  protect,
  authorize("superAdmin"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message:
        "Super Admin dashboard access",
    });
  }
);

export default router;