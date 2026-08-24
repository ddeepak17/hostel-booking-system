import Building from "../models/Building.js";

import {
  getOwnedProperty,
  getOwnedBuilding,
} from "../utils/propertyOwnership.js";
import {
  sendControllerError,
} from "../utils/controllerError.js";

export async function createBuilding(
  req,
  res
) {
  try {
    const property =
      await getOwnedProperty(
        req.params.propertyId,
        req.user._id
      );

    if (
      !property ||
      !property.isActive
    ) {
      return res.status(404).json({
        success: false,
        message:
          "Active property not found",
      });
    }

    const building =
      await Building.create({
        property: property._id,
        name: req.body.name,
        code: req.body.code,
      });

    return res.status(201).json({
      success: true,
      building,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "Building name already exists for this property",
      });
    }

    return sendControllerError(
      res,
      error,
      "Unable to create building"
    );
  }
}

export async function getBuildings(
  req,
  res
) {
  try {
    const property =
      await getOwnedProperty(
        req.params.propertyId,
        req.user._id
      );

    if (!property) {
      return res.status(404).json({
        success: false,
        message:
          "Property not found",
      });
    }

    const buildings =
      await Building.find({
        property: property._id,
      }).sort({
        name: 1,
      });

    return res.status(200).json({
      success: true,
      buildings,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        "Unable to retrieve buildings",
    });
  }
}

export async function updateBuilding(
  req,
  res
) {
  try {
    const building =
      await getOwnedBuilding(
        req.params.buildingId,
        req.user._id
      );

    if (!building) {
      return res.status(404).json({
        success: false,
        message:
          "Building not found",
      });
    }

    for (const field of [
      "name",
      "code",
      "isActive",
    ]) {
      if (
        Object.hasOwn(
          req.body,
          field
        )
      ) {
        building[field] =
          req.body[field];
      }
    }

    await building.save();

    return res.status(200).json({
      success: true,
      building,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "Building name already exists",
      });
    }

    return res.status(400).json({
      success: false,
      message:
        "Unable to update building",
    });
  }
}

export async function deactivateBuilding(
  req,
  res
) {
  const building =
    await getOwnedBuilding(
      req.params.buildingId,
      req.user._id
    );

  if (!building) {
    return res.status(404).json({
      success: false,
      message:
        "Building not found",
    });
  }

  building.isActive = false;
  await building.save();

  return res.status(200).json({
    success: true,
    message:
      "Building deactivated",
  });
}
