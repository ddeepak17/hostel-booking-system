import User from "../models/User.js";

function formatOwner(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
  };
}

export async function createOwner(
  req,
  res
) {
  try {
    const {
      name,
      email,
      password,
      phone,
    } = req.body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email and password are required",
      });
    }

    const normalizedEmail =
      email.toLowerCase().trim();

    const existingUser =
      await User.findOne({
        email: normalizedEmail,
      });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          "An account with this email already exists",
      });
    }

    const owner =
      await User.create({
        name,
        email: normalizedEmail,
        password,
        phone,
        role: "owner",
        createdBy: req.user._id,
      });

    return res.status(201).json({
      success: true,
      message:
        "Property Owner created successfully",
      owner: formatOwner(owner),
    });
  } catch (error) {
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

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "An account with this email already exists",
      });
    }

    console.error(
      "Create owner error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to create Property Owner",
    });
  }
}

export async function getOwners(
  req,
  res
) {
  try {
    const owners =
      await User.find({
        role: "owner",
      })
        .select(
          "name email phone role isActive createdBy createdAt"
        )
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,
      count: owners.length,
      owners,
    });
  } catch (error) {
    console.error(
      "Get owners error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to retrieve Property Owners",
    });
  }
}
