import mongoose from "mongoose";


const reviewSchema =
  new mongoose.Schema(
    {
      property: {
        type:
          mongoose.Schema.Types
            .ObjectId,

        ref:
          "Property",

        required:
          true,

        index:
          true,
      },


      customer: {
        type:
          mongoose.Schema.Types
            .ObjectId,

        ref:
          "User",

        required:
          true,

        index:
          true,
      },


      rating: {
        type:
          Number,

        required:
          true,

        min:
          1,

        max:
          5,
      },


      comment: {
        type:
          String,

        trim:
          true,

        maxlength:
          1000,

        default:
          "",
      },
    },
    {
      timestamps:
        true,
    }
  );


reviewSchema.index(
  {
    property:
      1,

    customer:
      1,
  },
  {
    unique:
      true,
  }
);


const Review =
  mongoose.model(
    "Review",
    reviewSchema
  );


export default Review;