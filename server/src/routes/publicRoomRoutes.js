import {Router} from "express";

import {
getPropertyRooms,
} from "../controllers/publicRoomController.js";


const router=Router();


router.get(
"/property/:propertyId/rooms",
getPropertyRooms
);


export default router;