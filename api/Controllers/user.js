const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Models = require("../models");
const Utils = require("../utils");

exports.user_signup = (req, res, _next) => {
  Models.User.findOne({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user) {
        return res.json(Utils.Response.error("User already exists", 409));
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.json(Utils.Response.error(err));
          } else {
            const user = new Models.User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
            });
            user.save().then((result) => {
              return res.json(Utils.Response.success("User created", 201));
            });
          }
        });
      }
    })
    .catch((err) => {
      return res.json(Utils.Response.error(err));
    });
};

exports.user_login = (req, res, _next) => {
  Models.User.findOne({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user) {
        bcrypt.compare(req.body.password, user.password, (err, match) => {
          if (err) {
            return res.json(Utils.Response.error("Auth Failed"));
          }
          if (match) {
            const token = jwt.sign(
              { email: user.email, userID: user._id },
              process.env.JWT_KEY,
              {
                expiresIn: "1h",
              }
            );
            return res.json(Utils.Response.success({ token: token }, 200));
          } else {
            return res.json(Utils.Response.error("Auth failed"));
          }
        });
      } else {
        return res.json(Utils.Response.error("Auth failed"));
      }
    })

    .catch((err) => {
      return res.json(Utils.Response.error(err));
    });
};

exports.user_delete = (req, res, _next) => {
  const id = req.params.userID;
  Models.User.deleteOne({ _id: id })
    .exec()
    .then((result) => {
      if (result.deletedCount == 0) {
        return res.json(Utils.Response.error("No such error", 400));
      }
      return res.json(Utils.Response.success("User deleted successfully"));
    })
    .catch((err) => {
      return res.json(Utils.Response.error(err));
    });
};
