import { Router } from "express";

import {
  protect,
  authorize,
} from "../middleware/authMiddleware.js";

const router = Router();

router.get(
  "/dashboard",
  protect,
  authorize("owner"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Owner dashboard access",
    });
  }
);

export default router;