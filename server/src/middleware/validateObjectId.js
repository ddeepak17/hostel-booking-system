import mongoose from "mongoose";


export function validateObjectIdParam(
  req,
  res,
  next,
  value,
  name
) {
  void req;

  if (
    !mongoose.isObjectIdOrHexString(
      value
    )
  ) {
    return res.status(400).json({
      success: false,
      message:
        `Invalid ${name} identifier`,
    });
  }

  next();
}
