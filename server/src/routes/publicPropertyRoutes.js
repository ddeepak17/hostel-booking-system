import { Router } from "express";

import {
 getPublicProperties,
 getPublicProperty,
} from "../controllers/publicPropertyController.js";


const router = Router();


router.get(
 "/",
 getPublicProperties
);


router.get(
 "/:propertyId",
 getPublicProperty
);


export default router;