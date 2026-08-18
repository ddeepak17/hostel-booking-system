import mongoose from "mongoose";

const buildingSchema =
  new mongoose.Schema(
    {
      property: {
        type:
          mongoose.Schema.Types
            .ObjectId,
        ref: "Property",
        required: true,
        index: true,
      },

      name: {
        type: String,
        required: true,
        trim: true,
      },

      code: {
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

buildingSchema.index(
  {
    property: 1,
    name: 1,
  },
  {
    unique: true,
  }
);

const Building =
  mongoose.model(
    "Building",
    buildingSchema
  );

export default Building;