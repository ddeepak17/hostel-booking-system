import mongoose from "mongoose";

const bookingSchema =
  new mongoose.Schema(
    {
      customer: {
        type:
          mongoose.Schema.Types
            .ObjectId,
        ref: "User",
        required: true,
        index: true,
      },

      owner: {
        type:
          mongoose.Schema.Types
            .ObjectId,
        ref: "User",
        required: true,
        index: true,
      },

      property: {
        type:
          mongoose.Schema.Types
            .ObjectId,
        ref: "Property",
        required: true,
        index: true,
      },

      room: {
        type:
          mongoose.Schema.Types
            .ObjectId,
        ref: "Room",
        required: true,
      },

      bed: {
        type:
          mongoose.Schema.Types
            .ObjectId,
        ref: "Bed",
        required: true,
      },

      monthlyRentAtBooking: {
        type: Number,
        required: true,
        min: 0,
      },

      securityDepositAtBooking: {
        type: Number,
        required: true,
        min: 0,
      },

      checkInDate: {
        type: Date,
        required: true,
      },

      status: {
        type: String,
        enum: [
          "pending",
          "approved",
          "rejected",
          "cancelled",
          "completed",
        ],
        default: "pending",
        index: true,
      },

      customerNote: {
        type: String,
        trim: true,
        maxlength: 1000,
        default: "",
      },

      ownerNote: {
        type: String,
        trim: true,
        maxlength: 1000,
        default: "",
      },

      cancellationReason: {
        type: String,
        trim: true,
        maxlength: 1000,
        default: "",
      },

      isActiveBooking: {
        type: Boolean,
        default: true,
        index: true,
      },

      approvedAt: {
        type: Date,
        default: null,
      },

      rejectedAt: {
        type: Date,
        default: null,
      },

      cancelledAt: {
        type: Date,
        default: null,
      },

      completedAt: {
        type: Date,
        default: null,
      },
    },
    {
      timestamps: true,
    }
  );

bookingSchema.index(
  {
    bed: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      isActiveBooking: true,
    },
  }
);

bookingSchema.index({
  customer: 1,
  createdAt: -1,
});

bookingSchema.index({
  owner: 1,
  status: 1,
  createdAt: -1,
});

const Booking =
  mongoose.model(
    "Booking",
    bookingSchema
  );

export default Booking;