import express from "express";

import {
  getRoomBeds,
} from "../controllers/publicBedController.js";


const router = express.Router();


router.get(
  "/room/:roomId/beds",
  getRoomBeds
);


export default router;