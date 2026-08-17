import { Router } from "express";

import {
  protect,
  authorize,
} from "../middleware/authMiddleware.js";

const router = Router();

router.get(
  "/dashboard",
  protect,
  authorize("customer"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Customer dashboard access",
    });
  }
);

export default router;