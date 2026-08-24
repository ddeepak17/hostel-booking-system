import { Router } from "express";

import {
  protect,
  authorize,
} from "../middleware/authMiddleware.js";

import {
  validateObjectIdParam,
} from "../middleware/validateObjectId.js";

import {
  createProperty,
  getMyProperties,
  getMyProperty,
  updateProperty,
  deactivateProperty,
} from "../controllers/propertyController.js";

import {
  createBuilding,
  getBuildings,
  updateBuilding,
  deactivateBuilding,
} from "../controllers/buildingController.js";

import {
  createFloor,
  getFloors,
  updateFloor,
  deactivateFloor,
} from "../controllers/floorController.js";

import {
  createRoom,
  getRooms,
  updateRoom,
  deactivateRoom,
} from "../controllers/roomController.js";

import {
  createBed,
  getBeds,
  updateBed,
  deactivateBed,
} from "../controllers/bedController.js";

import {
  getOwnerBookings,
  getOwnerBooking,
  approveBooking,
  rejectBooking,
  completeBooking,
  getCurrentTenants,
} from "../controllers/ownerBookingController.js";

const router = Router();

for (const parameter of [
  "propertyId",
  "buildingId",
  "floorId",
  "roomId",
  "bedId",
  "bookingId",
]) {
  router.param(
    parameter,
    validateObjectIdParam
  );
}

/*
  Every route below this point requires:

  1. A valid authenticated user
  2. role === "owner"
*/

router.use(
  protect,
  authorize("owner")
);

// Dashboard

router.get(
  "/dashboard",
  (req, res) => {
    res.status(200).json({
      success: true,
      message:
        "Owner dashboard access",
    });
  }
);

// --------------------------------
// Properties
// --------------------------------

router
  .route("/properties")
  .get(getMyProperties)
  .post(createProperty);

router
  .route(
    "/properties/:propertyId"
  )
  .get(getMyProperty)
  .patch(updateProperty)
  .delete(deactivateProperty);

// --------------------------------
// Buildings
// --------------------------------

router
  .route(
    "/properties/:propertyId/buildings"
  )
  .get(getBuildings)
  .post(createBuilding);

router
  .route(
    "/buildings/:buildingId"
  )
  .patch(updateBuilding)
  .delete(deactivateBuilding);

// --------------------------------
// Floors
// --------------------------------

router
  .route(
    "/buildings/:buildingId/floors"
  )
  .get(getFloors)
  .post(createFloor);

router
  .route("/floors/:floorId")
  .patch(updateFloor)
  .delete(deactivateFloor);

// --------------------------------
// Rooms
// --------------------------------

router
  .route(
    "/floors/:floorId/rooms"
  )
  .get(getRooms)
  .post(createRoom);

router
  .route("/rooms/:roomId")
  .patch(updateRoom)
  .delete(deactivateRoom);

// --------------------------------
// Beds
// --------------------------------

router
  .route(
    "/rooms/:roomId/beds"
  )
  .get(getBeds)
  .post(createBed);

router
  .route("/beds/:bedId")
  .patch(updateBed)
  .delete(deactivateBed);

// --------------------------------
// Bookings
// --------------------------------

router.get(
  "/bookings",
  getOwnerBookings
);

router.get(
  "/bookings/:bookingId",
  getOwnerBooking
);

router.patch(
  "/bookings/:bookingId/approve",
  approveBooking
);

router.patch(
  "/bookings/:bookingId/reject",
  rejectBooking
);

router.patch(
  "/bookings/:bookingId/complete",
  completeBooking
);

// --------------------------------
// Current Tenants
// --------------------------------

router.get(
  "/tenants",
  getCurrentTenants
);

export default router;
