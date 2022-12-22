const mongoose = require("mongoose");
const app = require("./app");
const dotenv = require("dotenv");
dotenv.config();

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

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
