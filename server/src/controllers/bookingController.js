import Booking from "../models/Booking.js";
import Bed from "../models/Bed.js";

import {
  getBookableBedContext,
} from "../utils/bookingContext.js";

function populateBooking(query) {
  return query
    .populate(
      "property",
      "name address images status"
    )
    .populate(
      "room",
      "roomNumber roomType capacity monthlyRent securityDeposit"
    )
    .populate(
      "bed",
      "bedNumber status"
    );
}

function handleBookingError(
  res,
  error,
  fallbackMessage
) {
  if (
    error.name ===
    "ValidationError"
  ) {
    const messages =
      Object.values(
        error.errors
      ).map(
        (item) => item.message
      );

    return res.status(400).json({
      success: false,
      message: messages[0],
    });
  }

  if (error.name === "CastError") {
    return res.status(400).json({
      success: false,
      message:
        "Invalid booking or bed identifier",
    });
  }

  if (error.code === 11000) {
    return res.status(409).json({
      success: false,
      message:
        "This bed already has an active booking",
    });
  }

  console.error(
    fallbackMessage,
    error
  );

  return res.status(500).json({
    success: false,
    message: fallbackMessage,
  });
}

export async function createBooking(
  req,
  res
) {
  let reservedBedId = null;

  try {
    const {
      bedId,
      checkInDate,
      customerNote,
    } = req.body;

    if (!bedId || !checkInDate) {
      return res.status(400).json({
        success: false,
        message:
          "Bed and check-in date are required",
      });
    }

    const parsedCheckInDate =
      new Date(checkInDate);

    if (
      Number.isNaN(
        parsedCheckInDate.getTime()
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Check-in date is invalid",
      });
    }

    const today = new Date();
    today.setHours(
      0,
      0,
      0,
      0
    );

    if (
      parsedCheckInDate < today
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Check-in date cannot be in the past",
      });
    }

    const context =
      await getBookableBedContext(
        bedId
      );

    if (!context) {
      return res.status(404).json({
        success: false,
        message:
          "Bookable bed not found",
      });
    }

    const {
      bed,
      room,
      property,
    } = context;

    if (
      bed.status !==
      "available"
    ) {
      return res.status(409).json({
        success: false,
        message:
          "This bed is not available",
      });
    }

    /*
      Atomically claim the bed.

      Only a bed whose current status
      is exactly "available" can change
      to "reserved".
    */

    const reservedBed =
      await Bed.findOneAndUpdate(
        {
          _id: bed._id,
          status: "available",
          isActive: true,
        },
        {
          $set: {
            status: "reserved",
          },
        },
        {
          new: true,
        }
      );

    if (!reservedBed) {
      return res.status(409).json({
        success: false,
        message:
          "This bed was just reserved by another customer",
      });
    }

    reservedBedId =
      reservedBed._id;

    const booking =
      await Booking.create({
        customer:
          req.user._id,

        owner:
          property.owner,

        property:
          property._id,

        room:
          room._id,

        bed:
          reservedBed._id,

        monthlyRentAtBooking:
          room.monthlyRent,

        securityDepositAtBooking:
          room.securityDeposit,

        checkInDate:
          parsedCheckInDate,

        customerNote:
          customerNote || "",

        status:
          "pending",

        isActiveBooking:
          true,
      });

    const populatedBooking =
      await populateBooking(
        Booking.findById(
          booking._id
        )
      );

    return res.status(201).json({
      success: true,
      message:
        "Booking request submitted",
      booking:
        populatedBooking,
    });
  } catch (error) {
    /*
      If the bed was reserved but
      booking creation failed,
      release the bed.
    */

    if (reservedBedId) {
      await Bed.updateOne(
        {
          _id:
            reservedBedId,
          status:
            "reserved",
        },
        {
          $set: {
            status:
              "available",
          },
        }
      );
    }

    return handleBookingError(
      res,
      error,
      "Unable to create booking"
    );
  }
}

export async function getMyBookings(
  req,
  res
) {
  try {
    const bookings =
      await populateBooking(
        Booking.find({
          customer:
            req.user._id,
        }).sort({
          createdAt: -1,
        })
      );

    return res.status(200).json({
      success: true,
      count:
        bookings.length,
      bookings,
    });
  } catch (error) {
    return handleBookingError(
      res,
      error,
      "Unable to retrieve bookings"
    );
  }
}

export async function getMyBooking(
  req,
  res
) {
  try {
    const booking =
      await populateBooking(
        Booking.findOne({
          _id:
            req.params.bookingId,
          customer:
            req.user._id,
        })
      );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message:
          "Booking not found",
      });
    }

    return res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    return handleBookingError(
      res,
      error,
      "Unable to retrieve booking"
    );
  }
}

export async function cancelMyBooking(
  req,
  res
) {
  let previousBooking =
    null;

  let transitionComplete =
    false;

  try {
    previousBooking =
      await Booking.findOneAndUpdate(
        {
          _id:
            req.params.bookingId,

          customer:
            req.user._id,

          status: {
            $in: [
              "pending",
              "approved",
            ],
          },

          isActiveBooking:
            true,
        },
        {
          $set: {
            status:
              "cancelled",

            isActiveBooking:
              false,

            cancelledAt:
              new Date(),

            cancellationReason:
              req.body?.reason ||
              "",
          },
        },
        {
          new: false,
          runValidators: true,
        }
      );

    if (!previousBooking) {
      const existing =
        await Booking.findOne({
          _id:
            req.params.bookingId,
          customer:
            req.user._id,
        });

      if (!existing) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Booking not found",
          });
      }

      return res.status(409).json({
        success: false,
        message:
          `A ${existing.status} booking cannot be cancelled`,
      });
    }

    const expectedBedStatus =
      previousBooking.status ===
      "pending"
        ? "reserved"
        : "occupied";

    const bedResult =
      await Bed.updateOne(
        {
          _id:
            previousBooking.bed,

          status:
            expectedBedStatus,
        },
        {
          $set: {
            status:
              "available",
          },
        }
      );

    if (
      bedResult.matchedCount !==
      1
    ) {
      await Booking.updateOne(
        {
          _id:
            previousBooking._id,
          customer:
            req.user._id,
          status:
            "cancelled",
          isActiveBooking:
            false,
        },
        {
          $set: {
            status:
              previousBooking.status,
            isActiveBooking:
              true,
            cancelledAt:
              previousBooking.cancelledAt,
            cancellationReason:
              previousBooking.cancellationReason,
          },
        }
      );

      previousBooking =
        null;

      return res.status(409).json({
        success: false,
        message:
          "The bed state did not match this booking. No changes were applied.",
      });
    }

    transitionComplete =
      true;

    const populatedBooking =
      await populateBooking(
        Booking.findById(
          previousBooking._id
        )
      );

    return res.status(200).json({
      success: true,
      message:
        "Booking cancelled",
      booking:
        populatedBooking,
    });
  } catch (error) {
    if (
      previousBooking &&
      !transitionComplete
    ) {
      try {
        await Booking.updateOne(
          {
            _id:
              previousBooking._id,
            customer:
              req.user._id,
            status:
              "cancelled",
            isActiveBooking:
              false,
          },
          {
            $set: {
              status:
                previousBooking.status,
              isActiveBooking:
                true,
              cancelledAt:
                previousBooking.cancelledAt,
              cancellationReason:
                previousBooking.cancellationReason,
            },
          }
        );
      } catch (rollbackError) {
        console.error(
          "Booking cancellation rollback failed:",
          rollbackError
        );
      }
    }

    return handleBookingError(
      res,
      error,
      "Unable to cancel booking"
    );
  }
}
