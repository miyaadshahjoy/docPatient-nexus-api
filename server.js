const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({
  path: "./config.env",
});

// console.log(process.env);

const dbUri = process.env.DB_URI.replace("<PASSWORD>", process.env.DB_PASSWORD);
mongoose.connect(dbUri).then(() => {
  console.log("Database Connected Successfully 🤩🤩");
});

const app = require("./app");

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
