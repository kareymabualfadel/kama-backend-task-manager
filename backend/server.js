require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 3000;

(async () => {
  await connectDB(process.env.MONGO_URI);

  app.listen(PORT, "127.0.0.1", () => {
    console.log(`Express server running on http://192.168.28.158:${PORT}`);
  });
})();
