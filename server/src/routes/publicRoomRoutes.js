import {
  Router,
} from "express";

import {
  getPropertyRooms,
} from "../controllers/publicRoomController.js";

import {
  validateObjectIdParam,
} from "../middleware/validateObjectId.js";


const router =
  Router();


router.param(
  "propertyId",
  validateObjectIdParam
);


router.get(
  "/property/:propertyId/rooms",
  getPropertyRooms
);


export default router;
