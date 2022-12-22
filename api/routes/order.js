const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/checkAuth");

const Controllers = require("../Controllers/order");

router.get("/", checkAuth, Controllers.order_get_controller);

router.post("/", checkAuth, Controllers.order_post_controller);

router.get(
  "/:orderID",
  checkAuth,
  Controllers.order_get_description_controller
);

router.delete("/:orderID", checkAuth, Controllers.order_delete_controller);
module.exports = router;
