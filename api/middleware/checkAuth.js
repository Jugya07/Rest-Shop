require("dotenv").config();

const jwt = require("jsonwebtoken");
const Utils = require("../utils");
const CatchAsync = require("./catchAsync");

const checkAuth = CatchAsync(async (req, _res, next) => {
  if (!req.headers.authorization) {
    return next(Utils.Response.error("Auth Failed", 400));
  }
  const token = req.headers.authorization.split(" ")[1];
  const decoded = await jwt.verify(token, process.env.JWT_KEY);
  req.userData = decoded;
  next();
});

module.exports = checkAuth;
