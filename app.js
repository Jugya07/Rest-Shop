require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const Routes = require("./api/routes");
const Middlewares = require("./api/middleware");

const app = express();

//Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//checkRoute
app.get("/", (_req, res) => {
  res.send("Hello, Welcome to our API");
});

//Routes
app.use("/products", Routes.Product);
app.use("/orders", Routes.Order);
app.use("/users", Routes.User);

// Mongoose
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
app.use(Middlewares.Error.errorLogger);
app.use(Middlewares.Error.errorHandler);

module.exports = app;
