import { Router } from "express";

import {
  getPublicProperties,
  getPublicProperty,
} from "../controllers/publicPropertyController.js";

import {
  validateObjectIdParam,
} from "../middleware/validateObjectId.js";


const router = Router();


router.param(
  "propertyId",
  validateObjectIdParam
);


router.get(
  "/",
  getPublicProperties
);


router.get(
  "/:propertyId",
  getPublicProperty
);


export default router;
