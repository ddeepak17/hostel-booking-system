import "dotenv/config";
import app from "./src/app.js";
import connectDatabase from "./src/config/db.js";

const port = process.env.PORT || 5001;

async function startServer() {
  await connectDatabase();

  app.listen(port, "0.0.0.0", () => {
    console.log(`Server running on port ${port}`);
  });
}

startServer();