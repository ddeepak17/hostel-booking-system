import "dotenv/config";
import mongoose from "mongoose";

import connectDatabase from "../config/db.js";
import User from "../models/User.js";

async function seedSuperAdmin() {
  try {
    const name =
      process.env.SUPER_ADMIN_NAME;

    const email =
      process.env.SUPER_ADMIN_EMAIL;

    const password =
      process.env.SUPER_ADMIN_PASSWORD;

    if (!name || !email || !password) {
      throw new Error(
        "SUPER_ADMIN_NAME, SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD are required"
      );
    }

    await connectDatabase();

    const normalizedEmail =
      email.toLowerCase().trim();

    let admin = await User.findOne({
      email: normalizedEmail,
    });

    if (admin) {
      admin.name = name;
      admin.role = "superAdmin";
      admin.isActive = true;
      admin.password = password;

      await admin.save();

      console.log(
        "Existing user promoted/updated as Super Admin"
      );
    } else {
      admin = await User.create({
        name,
        email: normalizedEmail,
        password,
        role: "superAdmin",
        isActive: true,
      });

      console.log(
        "Super Admin created successfully"
      );
    }
  } catch (error) {
    console.error(
      "Super Admin seed failed:",
      error.message
    );

    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
}

seedSuperAdmin();