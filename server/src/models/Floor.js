import mongoose from "mongoose";

const floorSchema =
  new mongoose.Schema(
    {
      building: {
        type:
          mongoose.Schema.Types
            .ObjectId,
        ref: "Building",
        required: true,
        index: true,
      },

      floorNumber: {
        type: Number,
        required: true,
      },

      name: {
        type: String,
        default: "",
        trim: true,
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

floorSchema.index(
  {
    building: 1,
    floorNumber: 1,
  },
  {
    unique: true,
  }
);

const Floor =
  mongoose.model(
    "Floor",
    floorSchema
  );

export default Floor;