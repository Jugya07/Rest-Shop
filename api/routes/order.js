const express = require("express");
const checkAuth = require("../middleware/checkAuth");
const Controllers = require("../controllers");
const router = express.Router();

router.get("/", checkAuth, Controllers.Order.order_get);
router.post("/", checkAuth, Controllers.Order.order_post);
router.get("/:orderID", checkAuth, Controllers.Order.order_get_description);
router.delete("/:orderID", checkAuth, Controllers.Order.order_delete);

module.exports = router;
