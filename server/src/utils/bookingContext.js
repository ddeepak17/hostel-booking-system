import Bed from "../models/Bed.js";

export async function getBookableBedContext(
  bedId
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

  const room = bed?.room;

  const floor =
    room?.floor;

  const building =
    floor?.building;

  const property =
    building?.property;

  if (
    !bed ||
    !room ||
    !floor ||
    !building ||
    !property
  ) {
    return null;
  }

  if (
    !bed.isActive ||
    !room.isActive ||
    !floor.isActive ||
    !building.isActive ||
    !property.isActive ||
    property.status !== "published"
  ) {
    return null;
  }

  return {
    bed,
    room,
    floor,
    building,
    property,
  };
}