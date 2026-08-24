import {
  Router,
} from "express";

import {
  protect,
  authorize,
} from "../middleware/authMiddleware.js";

import {
  validateObjectIdParam,
} from "../middleware/validateObjectId.js";

import {
  getPropertyReviews,
  savePropertyReview,
} from "../controllers/reviewController.js";


const router =
  Router();


router.param(
  "propertyId",
  validateObjectIdParam
);


router.get(
  "/property/:propertyId",
  getPropertyReviews
);


router.post(
  "/property/:propertyId",
  protect,
  authorize(
    "customer"
  ),
  savePropertyReview
);


export default router;
