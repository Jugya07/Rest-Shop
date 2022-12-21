const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

mongoose.connect(
  `mongodb+srv://Test123:${process.env.PASSWORD}@rest-shop.lgpmvnw.mongodb.net/?retryWrites=true&w=majority`
);
mongoose.set("strictQuery", true);

const productRoutes = require("./api/routes/product");
const orderRoutes = require("./api/routes/order");
const userRoutes = require("./api/routes/user");

app.get("/", (req, res) => {
  res.send("Hello, Welcome to our API");
});

app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type, Accept,Authorisation"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,PATCH");
    return res.status(200).json({});
  }
  next();
});

app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/users", userRoutes);

app.use((req, res, next) => {
  const error = new Error("Path not found");
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  res.json({
    error: {
      message: error.message,
      status: error.status,
    },
  });
});

module.exports = app;
