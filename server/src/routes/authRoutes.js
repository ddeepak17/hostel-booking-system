import {
  Router,
} from "express";

import {
  register,
  login,
  getMe,
  updateMe,
} from "../controllers/authController.js";

import {
  protect,
} from "../middleware/authMiddleware.js";


const router =
  Router();


router.post(
  "/register",
  register
);


router.post(
  "/login",
  login
);


router
  .route(
    "/me"
  )
  .get(
    protect,
    getMe
  )
  .patch(
    protect,
    updateMe
  );


export default router;