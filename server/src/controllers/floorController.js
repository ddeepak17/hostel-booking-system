import Floor from "../models/Floor.js";

import {
  getOwnedBuilding,
  getOwnedFloor,
} from "../utils/propertyOwnership.js";

export async function createFloor(
  req,
  res
) {
  try {
    const building =
      await getOwnedBuilding(
        req.params.buildingId,
        req.user._id
      );

    if (
      !building ||
      !building.isActive
    ) {
      return res.status(404).json({
        success: false,
        message:
          "Active building not found",
      });
    }

    const floor =
      await Floor.create({
        building: building._id,
        floorNumber:
          req.body.floorNumber,
        name: req.body.name,
      });

    return res.status(201).json({
      success: true,
      floor,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "Floor already exists in this building",
      });
    }

    return res.status(400).json({
      success: false,
      message:
        error.message ||
        "Unable to create floor",
    });
  }
}

export async function getFloors(
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

  const floors =
    await Floor.find({
      building: building._id,
    }).sort({
      floorNumber: 1,
    });

  return res.status(200).json({
    success: true,
    floors,
  });
}

export async function updateFloor(
  req,
  res
) {
  try {
    const floor =
      await getOwnedFloor(
        req.params.floorId,
        req.user._id
      );

    if (!floor) {
      return res.status(404).json({
        success: false,
        message:
          "Floor not found",
      });
    }

    if (
      Object.hasOwn(
        req.body,
        "floorNumber"
      )
    ) {
      floor.floorNumber =
        req.body.floorNumber;
    }

    if (
      Object.hasOwn(
        req.body,
        "name"
      )
    ) {
      floor.name =
        req.body.name;
    }

    if (
      Object.hasOwn(
        req.body,
        "isActive"
      )
    ) {
      floor.isActive =
        req.body.isActive;
    }

    await floor.save();

    return res.status(200).json({
      success: true,
      floor,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "Floor already exists",
      });
    }

    return res.status(400).json({
      success: false,
      message:
        "Unable to update floor",
    });
  }
}

export async function deactivateFloor(
  req,
  res
) {
  const floor =
    await getOwnedFloor(
      req.params.floorId,
      req.user._id
    );

  if (!floor) {
    return res.status(404).json({
      success: false,
      message:
        "Floor not found",
    });
  }

  floor.isActive = false;
  await floor.save();

  return res.status(200).json({
    success: true,
    message:
      "Floor deactivated",
  });
}