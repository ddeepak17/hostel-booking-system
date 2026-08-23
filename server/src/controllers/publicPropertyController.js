import Property from "../models/Property.js";
import Room from "../models/Room.js";
import Bed from "../models/Bed.js";


function escapeRegex(
  value
) {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );
}


export async function getPublicProperties(
  req,
  res
) {
  try {
    const {
      q,
      city,
      amenity,
      roomType,
      minPrice,
      maxPrice,
      availability,
    } = req.query;


    const propertyQuery = {
      status:
        "published",
      isActive:
        true,
    };


    if (
      q &&
      q.trim()
    ) {
      const regex =
        new RegExp(
          escapeRegex(
            q.trim()
          ),
          "i"
        );


      propertyQuery.$or = [
        {
          name:
            regex,
        },
        {
          description:
            regex,
        },
        {
          "address.city":
            regex,
        },
        {
          "address.state":
            regex,
        },
      ];
    }


    if (
      city &&
      city.trim()
    ) {
      propertyQuery[
        "address.city"
      ] =
        new RegExp(
          escapeRegex(
            city.trim()
          ),
          "i"
        );
    }


    if (
      amenity &&
      amenity.trim()
    ) {
      propertyQuery.amenities =
        new RegExp(
          escapeRegex(
            amenity.trim()
          ),
          "i"
        );
    }


    const hasRoomFilters =
      Boolean(
        roomType ||
        minPrice ||
        maxPrice ||
        availability ===
          "true"
      );


    if (hasRoomFilters) {
      const roomQuery = {
        isActive:
          true,
      };


      if (roomType) {
        roomQuery.roomType =
          roomType;
      }


      if (
        minPrice ||
        maxPrice
      ) {
        roomQuery.monthlyRent =
          {};


        if (
          minPrice &&
          Number.isFinite(
            Number(
              minPrice
            )
          )
        ) {
          roomQuery.monthlyRent.$gte =
            Number(
              minPrice
            );
        }


        if (
          maxPrice &&
          Number.isFinite(
            Number(
              maxPrice
            )
          )
        ) {
          roomQuery.monthlyRent.$lte =
            Number(
              maxPrice
            );
        }
      }


      let rooms =
        await Room.find(
          roomQuery
        )
          .select(
            "_id floor"
          )
          .populate({
            path:
              "floor",

            match: {
              isActive:
                true,
            },

            select:
              "building isActive",

            populate: {
              path:
                "building",

              match: {
                isActive:
                  true,
              },

              select:
                "property isActive",

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


      rooms =
        rooms.filter(
          (room) =>
            room.floor
              ?.building
              ?.property
        );


      if (
        availability ===
        "true"
      ) {
        const roomIds =
          rooms.map(
            (room) =>
              room._id
          );


        const availableBeds =
          await Bed.find({
            room: {
              $in:
                roomIds,
            },

            isActive:
              true,

            status:
              "available",
          })
            .select(
              "room"
            );


        const availableRoomIds =
          new Set(
            availableBeds.map(
              (bed) =>
                String(
                  bed.room
                )
            )
          );


        rooms =
          rooms.filter(
            (room) =>
              availableRoomIds.has(
                String(
                  room._id
                )
              )
          );
      }


      const propertyIds =
        [
          ...new Set(
            rooms.map(
              (room) =>
                String(
                  room.floor
                    .building
                    .property
                    ._id
                )
            )
          ),
        ];


      propertyQuery._id = {
        $in:
          propertyIds,
      };
    }


    const properties =
      await Property.find(
        propertyQuery
      )
        .select(
          "name description address amenities images location"
        )
        .sort({
          createdAt: -1,
        });


    return res.status(200).json({
      success: true,
      count:
        properties.length,
      properties,
    });
  } catch (error) {
    console.error(
      "Public properties error:",
      error
    );


    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch properties",
    });
  }
}


export async function getPublicProperty(
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
      })
        .populate(
          "owner",
          "name"
        );


    if (!property) {
      return res.status(404).json({
        success: false,
        message:
          "Property not found",
      });
    }


    return res.status(200).json({
      success: true,
      property,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch property",
    });
  }
}