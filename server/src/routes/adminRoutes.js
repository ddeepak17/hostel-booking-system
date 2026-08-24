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
  createOwner,
  getOwners,
} from "../controllers/adminUserController.js";

import {
  getAdminOverview,
  getAdminUsers,
  updateAdminUserStatus,
  getAdminProperties,
  getAdminBookings,
} from "../controllers/adminPlatformController.js";


const router =
  Router();


router.param(
  "userId",
  validateObjectIdParam
);


router.use(
  protect,
  authorize(
    "superAdmin"
  )
);


router.get(
  "/dashboard",
  getAdminOverview
);


router
  .route(
    "/owners"
  )
  .get(
    getOwners
  )
  .post(
    createOwner
  );


router.get(
  "/users",
  getAdminUsers
);


router.patch(
  "/users/:userId/status",
  updateAdminUserStatus
);


router.get(
  "/properties",
  getAdminProperties
);


router.get(
  "/bookings",
  getAdminBookings
);


export default router;
