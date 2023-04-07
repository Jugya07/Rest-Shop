const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Models = require("../models");
const Utils = require("../utils");
const Middlewares = require("../middleware");

exports.user_signup = Middlewares.CatchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || typeof email !== "string") {
    return next(Utils.Response.error("Email should of type string", 400));
  }

  let user = await Models.User.findOne({ email });
  if (user) {
    return next(Utils.Response.error("User already exists", 409));
  }

  const hash = await bcrypt.hash(password, 10);

  user = await Models.User.create({
    email,
    password: hash,
  });

  return res.json(Utils.Response.success(user));
});

exports.user_login = Middlewares.CatchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || typeof email !== "string") {
    return next(Utils.Response.error("Email should of type string", 400));
  }

  const user = await Models.User.findOne({ email });
  if (!user) {
    return next(Utils.Response.error("No registered email found", 400));
  } else {
    const result = await bcrypt.compare(password, user.password);
    if (result) {
      const token = jwt.sign(
        { email: user.email, userID: user._id },
        process.env.JWT_KEY,
        {
          expiresIn: "1h",
        }
      );
      return res.json(Utils.Response.success({ token }, 200));
    } else {
      return next(Utils.Response.error("Password is incorrect", 400));
    }
  }
});

exports.user_delete = Middlewares.CatchAsync(async (req, res, next) => {
  const { userID } = req.params;
  const user = await Models.User.findOneAndDelete({ _id: userID });

  if (user) {
    return res.json(Utils.Response.success("User deleted successfully"));
  } else {
    return next(Utils.Response.error("No Such User exists", 400));
  }
});
