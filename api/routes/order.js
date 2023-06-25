const express = require("express");
const Middlewares = require("../middlewares");
const Controllers = require("../controllers");
const router = express.Router();

router.get("/", Middlewares.CheckAuth, Controllers.Order.order_get);
router.post("/", Middlewares.CheckAuth, Controllers.Order.order_post);
router.get(
  "/:orderID",
  Middlewares.IdChecker("orderID"),
  Middlewares.CheckAuth,
  Controllers.Order.order_get_description
);
router.delete(
  "/:orderID",
  Middlewares.IdChecker("orderID"),
  Middlewares.CheckAuth,
  Controllers.Order.order_delete
);

module.exports = router;
