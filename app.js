const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Routes = require("./api/routes");
const app = express();

//Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Hello, Welcome to our API");
});

//Routes
app.use("/products", Routes.Product);
app.use("/orders", Routes.Order);
app.use("/users", Routes.User);

//ErrorHandlers
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
