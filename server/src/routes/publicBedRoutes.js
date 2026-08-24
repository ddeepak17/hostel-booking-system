import express from "express";

import {
  getRoomBeds,
} from "../controllers/publicBedController.js";

import {
  validateObjectIdParam,
} from "../middleware/validateObjectId.js";


const router = express.Router();


router.param(
  "roomId",
  validateObjectIdParam
);


router.get(
  "/room/:roomId/beds",
  getRoomBeds
);


export default router;
