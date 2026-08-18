import Bed from "../models/Bed.js";

import {
  getOwnedRoom,
  getOwnedBed,
} from "../utils/propertyOwnership.js";

export async function createBed(
  req,
  res
) {
  try {
    const room =
      await getOwnedRoom(
        req.params.roomId,
        req.user._id
      );

    if (
      !room ||
      !room.isActive
    ) {
      return res.status(404).json({
        success: false,
        message:
          "Active room not found",
      });
    }

    const activeBedCount =
      await Bed.countDocuments({
        room: room._id,
        isActive: true,
      });

    if (
      activeBedCount >=
      room.capacity
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Room has reached its bed capacity",
      });
    }

    const bed =
      await Bed.create({
        room: room._id,
        bedNumber:
          req.body.bedNumber,
      });

    return res.status(201).json({
      success: true,
      bed,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "Bed number already exists in this room",
      });
    }

    return res.status(400).json({
      success: false,
      message:
        error.message ||
        "Unable to create bed",
    });
  }
}

export async function getBeds(
  req,
  res
) {
  const room =
    await getOwnedRoom(
      req.params.roomId,
      req.user._id
    );

  if (!room) {
    return res.status(404).json({
      success: false,
      message: "Room not found",
    });
  }

  const beds =
    await Bed.find({
      room: room._id,
    }).sort({
      bedNumber: 1,
    });

  return res.status(200).json({
    success: true,
    beds,
  });
}

export async function updateBed(
  req,
  res
) {
  try {
    const bed =
      await getOwnedBed(
        req.params.bedId,
        req.user._id
      );

    if (!bed) {
      return res.status(404).json({
        success: false,
        message: "Bed not found",
      });
    }

    if (
      Object.hasOwn(
        req.body,
        "bedNumber"
      )
    ) {
      bed.bedNumber =
        req.body.bedNumber;
    }

    if (
      Object.hasOwn(
        req.body,
        "status"
      )
    ) {
      const allowedManualStatuses =
        [
          "available",
          "unavailable",
        ];

      if (
        !allowedManualStatuses.includes(
          req.body.status
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Owners can manually set beds only to available or unavailable",
        });
      }

      bed.status =
        req.body.status;
    }

    await bed.save();

    return res.status(200).json({
      success: true,
      bed,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "Bed number already exists",
      });
    }

    return res.status(400).json({
      success: false,
      message:
        "Unable to update bed",
    });
  }
}

export async function deactivateBed(
  req,
  res
) {
  const bed =
    await getOwnedBed(
      req.params.bedId,
      req.user._id
    );

  if (!bed) {
    return res.status(404).json({
      success: false,
      message: "Bed not found",
    });
  }

  bed.isActive = false;
  bed.status = "unavailable";

  await bed.save();

  return res.status(200).json({
    success: true,
    message:
      "Bed deactivated",
  });
}