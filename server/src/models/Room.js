import mongoose from "mongoose";

const roomSchema =
  new mongoose.Schema(
    {
      floor: {
        type:
          mongoose.Schema.Types
            .ObjectId,
        ref: "Floor",
        required: true,
        index: true,
      },

      roomNumber: {
        type: String,
        required: true,
        trim: true,
      },

      roomType: {
        type: String,
        enum: [
          "single",
          "double",
          "triple",
          "shared",
          "dormitory",
        ],
        required: true,
      },

      capacity: {
        type: Number,
        required: true,
        min: 1,
      },

      monthlyRent: {
        type: Number,
        required: true,
        min: 0,
      },

      securityDeposit: {
        type: Number,
        default: 0,
        min: 0,
      },

      amenities: {
        type: [String],
        default: [],
      },

      isActive: {
        type: Boolean,
        default: true,
      },
    },
    {
      timestamps: true,
    }
  );

roomSchema.index(
  {
    floor: 1,
    roomNumber: 1,
  },
  {
    unique: true,
  }
);

const Room =
  mongoose.model(
    "Room",
    roomSchema
  );

export default Room;