import "dotenv/config";
import app from "./src/app.js";
import connectDatabase from "./src/config/db.js";

const port = process.env.PORT || 5000;

async function startServer() {
  await connectDatabase();

  app.listen(port, () => {
    console.log(
      `Server running on port ${port}`
    );
  });
}

startServer();