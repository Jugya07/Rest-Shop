require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");

mongoose
  .connect(process.env.MONGOURI)
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
