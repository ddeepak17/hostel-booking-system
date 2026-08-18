import mongoose from "mongoose";

const bedSchema =
  new mongoose.Schema(
    {
      room: {
        type:
          mongoose.Schema.Types
            .ObjectId,
        ref: "Room",
        required: true,
        index: true,
      },

      bedNumber: {
        type: String,
        required: true,
        trim: true,
      },

      status: {
        type: String,
        enum: [
          "available",
          "reserved",
          "occupied",
          "unavailable",
        ],
        default: "available",
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

bedSchema.index(
  {
    room: 1,
    bedNumber: 1,
  },
  {
    unique: true,
  }
);

const Bed =
  mongoose.model(
    "Bed",
    bedSchema
  );

export default Bed;