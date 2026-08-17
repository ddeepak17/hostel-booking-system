import jwt from "jsonwebtoken";

function generateToken(userId) {
  if (!process.env.JWT_SECRET) {
    throw new Error(
      "JWT_SECRET environment variable is missing"
    );
  }

  return jwt.sign(
    {
      sub: userId.toString(),
    },
    process.env.JWT_SECRET,
    {
      expiresIn:
        process.env.JWT_EXPIRES_IN || "7d",
      algorithm: "HS256",
    }
  );
}

export default generateToken;