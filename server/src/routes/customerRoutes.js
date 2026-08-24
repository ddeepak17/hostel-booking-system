import { Router } from "express";

import {
  protect,
  authorize,
} from "../middleware/authMiddleware.js";

import {
  validateObjectIdParam,
} from "../middleware/validateObjectId.js";

import {
  createBooking,
  getMyBookings,
  getMyBooking,
  cancelMyBooking,
} from "../controllers/bookingController.js";

const router = Router();

router.param(
  "bookingId",
  validateObjectIdParam
);

router.use(
  protect,
  authorize("customer")
);

router.get(
  "/dashboard",
  (req, res) => {
    res.status(200).json({
      success: true,
      message:
        "Customer dashboard access",
    });
  }
);

router
  .route("/bookings")
  .get(getMyBookings)
  .post(createBooking);

router.get(
  "/bookings/:bookingId",
  getMyBooking
);

router.patch(
  "/bookings/:bookingId/cancel",
  cancelMyBooking
);

export default router;
