import { Router } from "express";

import {
  protect,
  authorize,
} from "../middleware/authMiddleware.js";

import {
  createOwner,
  getOwners,
} from "../controllers/adminUserController.js";

const router = Router();

router.use(
  protect,
  authorize("superAdmin")
);

router.get(
  "/dashboard",
  (req, res) => {
    res.status(200).json({
      success: true,
      message:
        "Super Admin dashboard access",
    });
  }
);

router
  .route("/owners")
  .get(getOwners)
  .post(createOwner);

export default router;