require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");

const Routes = require("./api/routes");
const Middlewares = require("./api/middlewares");
const Utils = require("./api/utils");

const app = express();

//Middlewares
app
  .use(cors())
  .use(helmet())
  .use(morgan("dev"))
  .use("/uploads", express.static("uploads"))
  .use(express.json())
  .use(express.urlencoded({ extended: true }));

//checkRoute
app.get("/", (_req, res) => {
  return res.json(Utils.Response.success("Welcome to the API"));
});

//Routes
app.use("/products", Routes.Product);
app.use("/orders", Routes.Order);
app.use("/users", Routes.User);

//Mongoose
mongoose.set("strictQuery", false);
mongoose.connect(
  process.env.MONGOURI,
  { serverSelectionTimeoutMS: 5000 },
  (err) => {
    if (err) {
      console.log(err);
      process.exit(1);
    } else {
      console.log("DB Connected");
    }
  }
);

// Error Handlers
app.use(Middlewares.Error.errorLogger).use(Middlewares.Error.errorHandler);

app.listen(process.env.PORT || 4000, () => {
  console.log("Server is running");
});
