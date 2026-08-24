import Bed from "../models/Bed.js";
import Room from "../models/Room.js";


export async function getRoomBeds(
  req,
  res
) {
  try {
    const room =
      await Room.findOne({
        _id:
          req.params.roomId,
        isActive:
          true,
      }).populate({
        path:
          "floor",
        match: {
          isActive:
            true,
        },
        populate: {
          path:
            "building",
          match: {
            isActive:
              true,
          },
          populate: {
            path:
              "property",
            match: {
              isActive:
                true,
              status:
                "published",
            },
            select:
              "_id",
          },
        },
      });


    if (
      !room?.floor
        ?.building
        ?.property
    ) {
      return res.status(404).json({
        success: false,
        message:
          "Room not found",
      });
    }


    const beds =
      await Bed.find({
        room:
          room._id,
        isActive:
          true,
      }).sort({
        bedNumber:
          1,
      });


    return res.status(200).json({
      success: true,
      beds,
    });
  } catch (error) {
    console.error(
      "Public beds error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch beds",
    });
  }
}
