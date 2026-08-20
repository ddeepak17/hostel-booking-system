import Room from "../models/Room.js";


export async function getPropertyRooms(req, res) {

  try {

    const rooms = await Room.find({
      isActive: true,
    })
      .populate({
        path: "floor",
        populate: {
          path: "building",
          populate: {
            path: "property",
          },
        },
      });


    const filteredRooms = rooms.filter(
      (room) =>
        room.floor?.building?.property?._id.toString() ===
        req.params.propertyId
    );


    res.status(200).json({
      success: true,
      rooms: filteredRooms,
    });


  } catch(error) {

    console.error(error);


    res.status(500).json({
      success: false,
      message: "Unable to fetch rooms",
    });

  }

}