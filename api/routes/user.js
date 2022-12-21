const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../Models/user");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

router.post("/signup", (req, res, next) => {
  User.findOne({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user) {
        return res.status(409).json({
          message: "User already exists",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err,
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
            });
            user
              .save()
              .then((result) => {
                console.log(result);
                res.status(201).json({
                  message: "user created",
                });
              })
              .catch((err) => {
                console.log(err);
                res.status(500).json(err);
              });
          }
        });
      }
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

router.post("/login", (req, res, next) => {
  User.findOne({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user) {
        bcrypt.compare(req.body.password, user.password, (err, match) => {
          if (err) {
            return res.status(500).json({
              message: "Auth failed",
            });
          }
          if (match) {
            const token = jwt.sign(
              { email: user.email, userID: user._id },
              process.env.JWT_KEY,
              {
                expiresIn: "1h",
              }
            );
            res.status(200).json({
              message: "Auth Successfull",
              token: token,
            });
          } else {
            return res.status(500).json({
              message: "Auth failed",
            });
          }
        });
      } else {
        res.status(500).json({
          message: "Auth failed",
        });
      }
    })

    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.delete("/:userID", (req, res, next) => {
  const id = req.params.userID;
  User.deleteOne({ _id: id })
    .exec()
    .then((result) => {
      if (result.deletedCount == 0) {
        return res.status(400).json({
          message: "No such user",
        });
      }
      res.status(200).json({
        message: "user deleted successfully",
      });
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

module.exports = router;
