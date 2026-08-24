import "dotenv/config";
import app from "./src/app.js";
import connectDatabase from "./src/config/db.js";

const port = process.env.PORT || 5001;


function validateEnvironment() {
  const requiredVariables = [
    "MONGODB_URI",
    "JWT_SECRET",
    "CLIENT_URL",
  ];

  const missingVariables =
    requiredVariables.filter(
      (name) =>
        !process.env[name]
          ?.trim()
    );

  if (missingVariables.length) {
    throw new Error(
      `Missing required environment variables: ${missingVariables.join(
        ", "
      )}`
    );
  }

  if (
    process.env.NODE_ENV ===
      "production" &&
    process.env.JWT_SECRET.length <
      32
  ) {
    throw new Error(
      "JWT_SECRET must be at least 32 characters in production"
    );
  }
}

async function startServer() {
  try {
    validateEnvironment();

    await connectDatabase();

    app.listen(port, "0.0.0.0", () => {
      console.log(
        `Server running on port ${port}`
      );
    });
  } catch (error) {
    console.error(
      "Server startup failed:",
      error.message
    );

    process.exitCode = 1;
  }
}

startServer();
