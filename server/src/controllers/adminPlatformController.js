import User from "../models/User.js";
import Property from "../models/Property.js";
import Booking from "../models/Booking.js";


const BOOKING_STATUSES = [
  "pending",
  "approved",
  "rejected",
  "cancelled",
  "completed",
];


export async function getAdminOverview(
  req,
  res
) {
  try {
    const [
      totalCustomers,
      totalOwners,
      totalProperties,
      totalBookings,
      pendingBookings,
      activeTenants,
      activeRentResult,
    ] =
      await Promise.all([
        User.countDocuments({
          role: "customer",
        }),

        User.countDocuments({
          role: "owner",
        }),

        Property.countDocuments(),

        Booking.countDocuments(),

        Booking.countDocuments({
          status: "pending",
        }),

        Booking.countDocuments({
          status: "approved",
          isActiveBooking: true,
        }),

        Booking.aggregate([
          {
            $match: {
              status: "approved",
              isActiveBooking: true,
            },
          },
          {
            $group: {
              _id: null,
              total: {
                $sum:
                  "$monthlyRentAtBooking",
              },
            },
          },
        ]),
      ]);


    return res.status(200).json({
      success: true,

      overview: {
        totalCustomers,
        totalOwners,
        totalUsers:
          totalCustomers +
          totalOwners,

        totalProperties,
        totalBookings,
        pendingBookings,
        activeTenants,

        activeMonthlyRent:
          activeRentResult[0]
            ?.total || 0,
      },
    });
  } catch (error) {
    console.error(
      "Admin overview error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load admin overview",
    });
  }
}


export async function getAdminUsers(
  req,
  res
) {
  try {
    const filter = {
      role: {
        $ne: "superAdmin",
      },
    };

    if (
      ["customer", "owner"].includes(
        req.query.role
      )
    ) {
      filter.role =
        req.query.role;
    }


    const users =
      await User.find(
        filter
      )
        .select(
          "name email phone role avatar isActive createdAt"
        )
        .sort({
          createdAt: -1,
        });


    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error(
      "Admin users error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to retrieve users",
    });
  }
}


export async function updateAdminUserStatus(
  req,
  res
) {
  try {
    if (
      typeof req.body.isActive !==
      "boolean"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "isActive must be true or false",
      });
    }


    const user =
      await User.findById(
        req.params.userId
      );


    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found",
      });
    }


    if (
      user.role === "superAdmin"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Super Admin accounts cannot be modified here",
      });
    }


    user.isActive =
      req.body.isActive;

    await user.save();


    return res.status(200).json({
      success: true,
      message:
        user.isActive
          ? "User activated"
          : "User disabled",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isActive:
          user.isActive,
      },
    });
  } catch (error) {
    console.error(
      "Admin user status error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to update user",
    });
  }
}


export async function getAdminProperties(
  req,
  res
) {
  try {
    const properties =
      await Property.find()
        .populate(
          "owner",
          "name email isActive"
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
      "Admin properties error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to retrieve properties",
    });
  }
}


export async function getAdminBookings(
  req,
  res
) {
  try {
    const filter = {};


    if (
      req.query.status &&
      BOOKING_STATUSES.includes(
        req.query.status
      )
    ) {
      filter.status =
        req.query.status;
    }


    const bookings =
      await Booking.find(
        filter
      )
        .populate(
          "customer",
          "name email phone"
        )
        .populate(
          "owner",
          "name email"
        )
        .populate(
          "property",
          "name address status"
        )
        .populate(
          "room",
          "roomNumber roomType monthlyRent"
        )
        .populate(
          "bed",
          "bedNumber status"
        )
        .sort({
          createdAt: -1,
        });


    return res.status(200).json({
      success: true,
      count:
        bookings.length,
      bookings,
    });
  } catch (error) {
    console.error(
      "Admin bookings error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to retrieve bookings",
    });
  }
}