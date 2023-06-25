require("dotenv").config();

const express = require("express");
const Controllers = require("../controllers");
const Middlewares = require("../middlewares");
const router = express.Router();

router.post("/signup", Controllers.User.user_signup);
router.post("/login", Controllers.User.user_login);
router.delete(
  "/:userID",
  Middlewares.IdChecker("userID"),
  Controllers.User.user_delete
);

module.exports = router;
