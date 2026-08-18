import Room from "../models/Room.js";
import Bed from "../models/Bed.js";

import {
  getOwnedFloor,
  getOwnedRoom,
} from "../utils/propertyOwnership.js";

export async function createRoom(
  req,
  res
) {
  try {
    const floor =
      await getOwnedFloor(
        req.params.floorId,
        req.user._id
      );

    if (
      !floor ||
      !floor.isActive
    ) {
      return res.status(404).json({
        success: false,
        message:
          "Active floor not found",
      });
    }

    const room =
      await Room.create({
        floor: floor._id,
        roomNumber:
          req.body.roomNumber,
        roomType:
          req.body.roomType,
        capacity:
          req.body.capacity,
        monthlyRent:
          req.body.monthlyRent,
        securityDeposit:
          req.body.securityDeposit,
        amenities:
          req.body.amenities,
      });

    return res.status(201).json({
      success: true,
      room,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "Room number already exists on this floor",
      });
    }

    return res.status(400).json({
      success: false,
      message:
        error.message ||
        "Unable to create room",
    });
  }
}

export async function getRooms(
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

  const rooms =
    await Room.find({
      floor: floor._id,
    }).sort({
      roomNumber: 1,
    });

  return res.status(200).json({
    success: true,
    rooms,
  });
}

export async function updateRoom(
  req,
  res
) {
  try {
    const room =
      await getOwnedRoom(
        req.params.roomId,
        req.user._id
      );

    if (!room) {
      return res.status(404).json({
        success: false,
        message:
          "Room not found",
      });
    }

    if (
      Object.hasOwn(
        req.body,
        "capacity"
      )
    ) {
      const activeBedCount =
        await Bed.countDocuments({
          room: room._id,
          isActive: true,
        });

      if (
        Number(
          req.body.capacity
        ) < activeBedCount
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Room capacity cannot be lower than the number of active beds",
        });
      }

      room.capacity =
        req.body.capacity;
    }

    const allowedFields = [
      "roomNumber",
      "roomType",
      "monthlyRent",
      "securityDeposit",
      "amenities",
      "isActive",
    ];

    for (const field of allowedFields) {
      if (
        Object.hasOwn(
          req.body,
          field
        )
      ) {
        room[field] =
          req.body[field];
      }
    }

    await room.save();

    return res.status(200).json({
      success: true,
      room,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "Room number already exists",
      });
    }

    return res.status(400).json({
      success: false,
      message:
        error.message ||
        "Unable to update room",
    });
  }
}

export async function deactivateRoom(
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
      message:
        "Room not found",
    });
  }

  room.isActive = false;
  await room.save();

  return res.status(200).json({
    success: true,
    message:
      "Room deactivated",
  });
}