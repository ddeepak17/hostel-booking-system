import Bed from "../models/Bed.js";


export async function getRoomBeds(req, res) {

  try {

    const beds = await Bed.find({
      room: req.params.roomId,
      isActive: true,
    });


    res.status(200).json({
      success: true,
      beds,
    });


  } catch(error) {

    console.error(error);

    res.status(500).json({
      success:false,
      message:"Unable to fetch beds",
    });

  }

}