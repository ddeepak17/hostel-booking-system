import Property from "../models/Property.js";
import Building from "../models/Building.js";
import Floor from "../models/Floor.js";
import Room from "../models/Room.js";
import Bed from "../models/Bed.js";

function sameId(first, second) {
  return (
    first?.toString() ===
    second?.toString()
  );
}

export async function getOwnedProperty(
  propertyId,
  ownerId
) {
  return Property.findOne({
    _id: propertyId,
    owner: ownerId,
  });
}

export async function getOwnedBuilding(
  buildingId,
  ownerId
) {
  const building =
    await Building.findById(
      buildingId
    ).populate("property");

  if (
    !building ||
    !building.property ||
    !sameId(
      building.property.owner,
      ownerId
    )
  ) {
    return null;
  }

  return building;
}

export async function getOwnedFloor(
  floorId,
  ownerId
) {
  const floor =
    await Floor.findById(
      floorId
    ).populate({
      path: "building",
      populate: {
        path: "property",
      },
    });

  const property =
    floor?.building?.property;

  if (
    !floor ||
    !property ||
    !sameId(
      property.owner,
      ownerId
    )
  ) {
    return null;
  }

  return floor;
}

export async function getOwnedRoom(
  roomId,
  ownerId
) {
  const room =
    await Room.findById(
      roomId
    ).populate({
      path: "floor",
      populate: {
        path: "building",
        populate: {
          path: "property",
        },
      },
    });

  const property =
    room?.floor?.building
      ?.property;

  if (
    !room ||
    !property ||
    !sameId(
      property.owner,
      ownerId
    )
  ) {
    return null;
  }

  return room;
}

export async function getOwnedBed(
  bedId,
  ownerId
) {
  const bed =
    await Bed.findById(
      bedId
    ).populate({
      path: "room",
      populate: {
        path: "floor",
        populate: {
          path: "building",
          populate: {
            path: "property",
          },
        },
      },
    });

  const property =
    bed?.room?.floor?.building
      ?.property;

  if (
    !bed ||
    !property ||
    !sameId(
      property.owner,
      ownerId
    )
  ) {
    return null;
  }

  return bed;
}