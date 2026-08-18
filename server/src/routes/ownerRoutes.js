import { Router } from "express";

import {
  protect,
  authorize,
} from "../middleware/authMiddleware.js";

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

const router = Router();

router.use(
  protect,
  authorize("owner")
);

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

// Properties

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

// Buildings

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

// Floors

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

// Rooms

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

// Beds

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

export default router;