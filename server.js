const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const app = require("./app");

mongoose
  .connect(
    `mongodb+srv://Test123:${process.env.PASSWORD}@rest-shop.lgpmvnw.mongodb.net/?retryWrites=true&w=majority`
  )
  .then((con) => {
    console.log("DB connection successful");
  })
  .catch((err) => {
    throw err;
  });

mongoose.set("strictQuery", true);

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
