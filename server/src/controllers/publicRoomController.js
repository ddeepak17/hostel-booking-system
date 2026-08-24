import Building from "../models/Building.js";
import Floor from "../models/Floor.js";
import Property from "../models/Property.js";
import Room from "../models/Room.js";


export async function getPropertyRooms(
  req,
  res
) {
  try {
    const property =
      await Property.findOne({
        _id:
          req.params.propertyId,
        status:
          "published",
        isActive:
          true,
      }).select(
        "_id"
      );


    if (!property) {
      return res.status(404).json({
        success: false,
        message:
          "Property not found",
      });
    }


    const buildingIds =
      await Building.find({
        property:
          property._id,
        isActive:
          true,
      }).distinct(
        "_id"
      );


    const floorIds =
      await Floor.find({
        building: {
          $in:
            buildingIds,
        },
        isActive:
          true,
      }).distinct(
        "_id"
      );


    const rooms =
      await Room.find({
        floor: {
          $in:
            floorIds,
        },
        isActive:
          true,
      }).sort({
        roomNumber:
          1,
      });


    return res.status(200).json({
      success: true,
      rooms,
    });
  } catch (error) {
    console.error(
      "Public rooms error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch rooms",
    });
  }
}
