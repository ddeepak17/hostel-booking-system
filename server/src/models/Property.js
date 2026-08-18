import mongoose from "mongoose";

const imageSchema =
  new mongoose.Schema(
    {
      url: {
        type: String,
        required: true,
      },

      publicId: {
        type: String,
        default: "",
      },

      alt: {
        type: String,
        default: "",
      },
    },
    {
      _id: false,
    }
  );

const locationSchema =
  new mongoose.Schema(
    {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },

      coordinates: {
        type: [Number],
        required: true,
        validate: {
          validator(value) {
            return (
              value.length === 2 &&
              value.every(
                (number) =>
                  Number.isFinite(
                    number
                  )
              )
            );
          },

          message:
            "Location must contain longitude and latitude",
        },
      },
    },
    {
      _id: false,
    }
  );

const propertySchema =
  new mongoose.Schema(
    {
      owner: {
        type:
          mongoose.Schema.Types
            .ObjectId,
        ref: "User",
        required: true,
        index: true,
      },

      name: {
        type: String,
        required: [
          true,
          "Property name is required",
        ],
        trim: true,
        maxlength: 120,
      },

      description: {
        type: String,
        trim: true,
        maxlength: 3000,
        default: "",
      },

      address: {
        line1: {
          type: String,
          required: true,
          trim: true,
        },

        line2: {
          type: String,
          default: "",
          trim: true,
        },

        city: {
          type: String,
          required: true,
          trim: true,
        },

        state: {
          type: String,
          required: true,
          trim: true,
        },

        postalCode: {
          type: String,
          required: true,
          trim: true,
        },

        country: {
          type: String,
          required: true,
          trim: true,
        },
      },

      location: {
        type: locationSchema,
        default: undefined,
      },

      amenities: {
        type: [String],
        default: [],
      },

      images: {
        type: [imageSchema],
        default: [],
      },

      status: {
        type: String,
        enum: [
          "draft",
          "published",
          "inactive",
        ],
        default: "draft",
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

propertySchema.index({
  owner: 1,
  status: 1,
});

propertySchema.index({
  "address.city": 1,
  status: 1,
});

propertySchema.index({
  location: "2dsphere",
});

const Property =
  mongoose.model(
    "Property",
    propertySchema
  );

export default Property;