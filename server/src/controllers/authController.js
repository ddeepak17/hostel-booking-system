import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";


function formatUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    avatar: user.avatar,
    isActive:
      user.isActive,
  };
}


export async function register(
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
      typeof name !==
        "string" ||
      !name.trim() ||
      typeof email !==
        "string" ||
      !email.trim() ||
      typeof password !==
        "string" ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email and password are required",
      });
    }


    const existingUser =
      await User.findOne({
        email:
          email
            .toLowerCase()
            .trim(),
      });


    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          "An account with this email already exists",
      });
    }


    const user =
      await User.create({
        name,
        email,
        password,
        phone,
      });


    const token =
      generateToken(
        user._id
      );


    return res.status(201).json({
      success: true,
      message:
        "Account created successfully",
      token,
      user:
        formatUser(
          user
        ),
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
          (item) =>
            item.message
        );


      return res.status(400).json({
        success: false,
        message:
          messages[0],
      });
    }


    if (
      error.code === 11000
    ) {
      return res.status(409).json({
        success: false,
        message:
          "An account with this email already exists",
      });
    }


    console.error(
      "Register error:",
      error
    );


    return res.status(500).json({
      success: false,
      message:
        "Unable to create account",
    });
  }
}


export async function login(
  req,
  res
) {
  try {
    const {
      email,
      password,
    } = req.body;


    if (
      typeof email !==
        "string" ||
      !email.trim() ||
      typeof password !==
        "string" ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required",
      });
    }


    const user =
      await User.findOne({
        email:
          email
            .toLowerCase()
            .trim(),
      })
        .select(
          "+password"
        );


    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password",
      });
    }


    const passwordMatches =
      await user.comparePassword(
        password
      );


    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password",
      });
    }


    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message:
          "This account has been disabled",
      });
    }


    const token =
      generateToken(
        user._id
      );


    return res.status(200).json({
      success: true,
      message:
        "Login successful",
      token,
      user:
        formatUser(
          user
        ),
    });
  } catch (error) {
    console.error(
      "Login error:",
      error
    );


    return res.status(500).json({
      success: false,
      message:
        "Unable to log in",
    });
  }
}


export async function getMe(
  req,
  res
) {
  return res.status(200).json({
    success: true,
    user:
      formatUser(
        req.user
      ),
  });
}


export async function updateMe(
  req,
  res
) {
  try {
    const allowedFields =
      [
        "name",
        "phone",
        "avatar",
      ];


    for (
      const field
      of allowedFields
    ) {
      if (
        Object.hasOwn(
          req.body,
          field
        )
      ) {
        req.user[field] =
          req.body[field];
      }
    }


    await req.user.save();


    return res.status(200).json({
      success: true,
      message:
        "Profile updated",
      user:
        formatUser(
          req.user
        ),
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
          (item) =>
            item.message
        );


      return res.status(400).json({
        success: false,
        message:
          messages[0],
      });
    }


    console.error(
      "Update profile error:",
      error
    );


    return res.status(500).json({
      success: false,
      message:
        "Unable to update profile",
    });
  }
}
