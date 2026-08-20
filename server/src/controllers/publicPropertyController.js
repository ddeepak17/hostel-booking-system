import Property from "../models/Property.js";


export async function getPublicProperties(req, res) {
  try {

    const properties = await Property.find({
      status: "published",
      isActive: true,
    })
      .select(
        "name description address amenities images location"
      )
      .sort({
        createdAt: -1,
      });


    res.status(200).json({
      success: true,
      properties,
    });


  } catch(error) {

    res.status(500).json({
      success:false,
      message:"Unable to fetch properties",
    });

  }
}



export async function getPublicProperty(req,res){

  try{

    const property =
      await Property.findOne({
        _id:req.params.propertyId,
        status:"published",
        isActive:true,
      })
      .populate(
        "owner",
        "name"
      );


    if(!property){

      return res.status(404).json({
        success:false,
        message:"Property not found",
      });

    }


    res.status(200).json({
      success:true,
      property,
    });



  }catch(error){

    res.status(500).json({
      success:false,
      message:"Unable to fetch property",
    });

  }

}