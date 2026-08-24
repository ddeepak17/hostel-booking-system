import Booking from "../models/Booking.js";
import Bed from "../models/Bed.js";

function populateOwnerBooking(
  query
) {
  return query
    .populate(
      "customer",
      "name email phone avatar"
    )
    .populate(
      "property",
      "name address"
    )
    .populate(
      "room",
      "roomNumber roomType monthlyRent securityDeposit"
    )
    .populate(
      "bed",
      "bedNumber status"
    );
}

async function transitionFailure(
  req,
  res,
  action
) {
  const booking =
    await Booking.findOne({
      _id:
        req.params.bookingId,
      owner:
        req.user._id,
    });

  if (!booking) {
    return res.status(404).json({
      success: false,
      message:
        "Booking not found",
    });
  }

  return res.status(409).json({
    success: false,
    message:
      `A ${booking.status} booking cannot be ${action}`,
  });
}

export async function getOwnerBookings(
  req,
  res
) {
  try {
    const filter = {
      owner: req.user._id,
    };

    if (req.query.status) {
      filter.status =
        req.query.status;
    }

    const bookings =
      await populateOwnerBooking(
        Booking.find(
          filter
        ).sort({
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
    console.error(
      "Get owner bookings error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to retrieve bookings",
    });
  }
}

export async function getOwnerBooking(
  req,
  res
) {
  try {
    const booking =
      await populateOwnerBooking(
        Booking.findOne({
          _id:
            req.params.bookingId,
          owner:
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
  } catch {
    return res.status(400).json({
      success: false,
      message:
        "Unable to retrieve booking",
    });
  }
}

export async function approveBooking(
  req,
  res
) {
  let occupiedBedId = null;
  let transitionComplete = false;

  try {
    const booking =
      await Booking.findOne(
        {
          _id:
            req.params.bookingId,

          owner:
            req.user._id,

          status:
            "pending",

          isActiveBooking:
            true,
        }
      );

    if (!booking) {
      return transitionFailure(
        req,
        res,
        "approved"
      );
    }

    const bed =
      await Bed.findOneAndUpdate(
        {
          _id:
            booking.bed,

          status:
            "reserved",

          isActive:
            true,
        },
        {
          $set: {
            status:
              "occupied",
          },
        },
        {
          new: true,
        }
      );

    if (!bed) {
      return res.status(409).json({
        success: false,
        message:
          "The bed state did not match this booking. No changes were applied.",
      });
    }

    occupiedBedId = bed._id;

    const approvedBooking =
      await Booking.findOneAndUpdate(
        {
          _id: booking._id,
          owner: req.user._id,
          status: "pending",
          isActiveBooking: true,
        },
        {
          $set: {
            status: "approved",
            approvedAt: new Date(),
            ownerNote:
              req.body?.note || "",
          },
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!approvedBooking) {
      await Bed.updateOne(
        {
          _id: occupiedBedId,
          status: "occupied",
        },
        {
          $set: {
            status: "reserved",
          },
        }
      );

      occupiedBedId = null;

      return transitionFailure(
        req,
        res,
        "approved"
      );
    }

    transitionComplete = true;

    const populatedBooking =
      await populateOwnerBooking(
        Booking.findById(
          approvedBooking._id
        )
      );

    return res.status(200).json({
      success: true,
      message:
        "Booking approved",
      booking:
        populatedBooking,
    });
  } catch (error) {
    if (
      occupiedBedId &&
      !transitionComplete
    ) {
      try {
        await Bed.updateOne(
          {
            _id: occupiedBedId,
            status: "occupied",
          },
          {
            $set: {
              status: "reserved",
            },
          }
        );
      } catch (rollbackError) {
        console.error(
          "Booking approval rollback failed:",
          rollbackError
        );
      }
    }

    console.error(
      "Approve booking error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to approve booking",
    });
  }
}

export async function rejectBooking(
  req,
  res
) {
  let previousBooking = null;
  let transitionComplete = false;

  try {
    previousBooking =
      await Booking.findOneAndUpdate(
        {
          _id:
            req.params.bookingId,

          owner:
            req.user._id,

          status:
            "pending",

          isActiveBooking:
            true,
        },
        {
          $set: {
            status:
              "rejected",

            isActiveBooking:
              false,

            rejectedAt:
              new Date(),

            ownerNote:
              req.body?.note ||
              "",
          },
        },
        {
          new: false,
          runValidators: true,
        }
      );

    if (!previousBooking) {
      return transitionFailure(
        req,
        res,
        "rejected"
      );
    }

    const bedResult =
      await Bed.updateOne(
        {
          _id:
            previousBooking.bed,
          status:
            "reserved",
          isActive:
            true,
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
          owner:
            req.user._id,
          status:
            "rejected",
          isActiveBooking:
            false,
        },
        {
          $set: {
            status: previousBooking.status,
            isActiveBooking:
              previousBooking.isActiveBooking,
            rejectedAt:
              previousBooking.rejectedAt,
            ownerNote:
              previousBooking.ownerNote,
          },
        }
      );

      previousBooking = null;

      return res.status(409).json({
        success: false,
        message:
          "The bed state did not match this booking. No changes were applied.",
      });
    }

    transitionComplete = true;

    const populatedBooking =
      await populateOwnerBooking(
        Booking.findById(
          previousBooking._id
        )
      );

    return res.status(200).json({
      success: true,
      message:
        "Booking rejected",
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
            _id: previousBooking._id,
            owner: req.user._id,
            status: "rejected",
            isActiveBooking: false,
          },
          {
            $set: {
              status: previousBooking.status,
              isActiveBooking:
                previousBooking.isActiveBooking,
              rejectedAt:
                previousBooking.rejectedAt,
              ownerNote:
                previousBooking.ownerNote,
            },
          }
        );
      } catch (rollbackError) {
        console.error(
          "Booking rejection rollback failed:",
          rollbackError
        );
      }
    }

    console.error(
      "Reject booking error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to reject booking",
    });
  }
}

export async function completeBooking(
  req,
  res
) {
  let previousBooking = null;
  let transitionComplete = false;

  try {
    previousBooking =
      await Booking.findOneAndUpdate(
        {
          _id:
            req.params.bookingId,

          owner:
            req.user._id,

          status:
            "approved",

          isActiveBooking:
            true,
        },
        {
          $set: {
            status:
              "completed",

            isActiveBooking:
              false,

            completedAt:
              new Date(),
          },
        },
        {
          new: false,
          runValidators: true,
        }
      );

    if (!previousBooking) {
      return transitionFailure(
        req,
        res,
        "completed"
      );
    }

    const bedResult =
      await Bed.updateOne(
        {
          _id:
            previousBooking.bed,
          status:
            "occupied",
          isActive:
            true,
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
          owner:
            req.user._id,
          status:
            "completed",
          isActiveBooking:
            false,
        },
        {
          $set: {
            status: previousBooking.status,
            isActiveBooking:
              previousBooking.isActiveBooking,
            completedAt:
              previousBooking.completedAt,
          },
        }
      );

      previousBooking = null;

      return res.status(409).json({
        success: false,
        message:
          "The bed state did not match this booking. No changes were applied.",
      });
    }

    transitionComplete = true;

    const populatedBooking =
      await populateOwnerBooking(
        Booking.findById(
          previousBooking._id
        )
      );

    return res.status(200).json({
      success: true,
      message:
        "Booking completed",
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
            _id: previousBooking._id,
            owner: req.user._id,
            status: "completed",
            isActiveBooking: false,
          },
          {
            $set: {
              status: previousBooking.status,
              isActiveBooking:
                previousBooking.isActiveBooking,
              completedAt:
                previousBooking.completedAt,
            },
          }
        );
      } catch (rollbackError) {
        console.error(
          "Booking completion rollback failed:",
          rollbackError
        );
      }
    }

    console.error(
      "Complete booking error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to complete booking",
    });
  }
}

export async function getCurrentTenants(
  req,
  res
) {
  try {
    const tenants =
      await populateOwnerBooking(
        Booking.find({
          owner:
            req.user._id,

          status:
            "approved",

          isActiveBooking:
            true,
        }).sort({
          approvedAt: -1,
        })
      );

    return res.status(200).json({
      success: true,
      count:
        tenants.length,
      tenants,
    });
  } catch (error) {
    console.error(
      "Get tenants error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to retrieve tenants",
    });
  }
}
