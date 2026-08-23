import Review from "../models/Review.js";
import Property from "../models/Property.js";
import Booking from "../models/Booking.js";


export async function getPropertyReviews(
  req,
  res
) {
  try {
    const reviews =
      await Review.find({
        property:
          req.params.propertyId,
      })
        .populate(
          "customer",
          "name avatar"
        )
        .sort({
          createdAt: -1,
        });


    const averageRating =
      reviews.length
        ? reviews.reduce(
            (
              total,
              review
            ) =>
              total +
              review.rating,
            0
          ) /
          reviews.length

        : 0;


    return res.status(200).json({
      success: true,
      count:
        reviews.length,

      averageRating:
        Number(
          averageRating.toFixed(
            1
          )
        ),

      reviews,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        "Unable to retrieve reviews",
    });
  }
}


export async function savePropertyReview(
  req,
  res
) {
  try {
    const {
      rating,
      comment,
    } = req.body;


    if (
      !Number.isFinite(
        Number(
          rating
        )
      ) ||
      Number(
        rating
      ) < 1 ||
      Number(
        rating
      ) > 5
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Rating must be between 1 and 5",
      });
    }


    const property =
      await Property.findById(
        req.params.propertyId
      );


    if (!property) {
      return res.status(404).json({
        success: false,
        message:
          "Property not found",
      });
    }


    const completedBooking =
      await Booking.findOne({
        customer:
          req.user._id,

        property:
          property._id,

        status:
          "completed",
      });


    if (!completedBooking) {
      return res.status(403).json({
        success: false,
        message:
          "You can review a property only after completing a stay",
      });
    }


    const review =
      await Review.findOneAndUpdate(
        {
          property:
            property._id,

          customer:
            req.user._id,
        },

        {
          $set: {
            rating:
              Number(
                rating
              ),

            comment:
              comment || "",
          },
        },

        {
          new:
            true,

          upsert:
            true,

          runValidators:
            true,

          setDefaultsOnInsert:
            true,
        }
      );


    await review.populate(
      "customer",
      "name avatar"
    );


    return res.status(200).json({
      success: true,
      message:
        "Review saved",
      review,
    });
  } catch (error) {
    console.error(
      "Save review error:",
      error
    );


    return res.status(400).json({
      success: false,
      message:
        error.message ||
        "Unable to save review",
    });
  }
}