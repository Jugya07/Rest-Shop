const express = require("express");

const Middlewares = require("../middlewares");
const Controllers = require("../controllers");
const Utils = require("../utils");

const router = express.Router();

router.get("/", Controllers.Product.product_get);
router.post(
  "/",
  Middlewares.CheckAuth,
  Utils.Multer.upload.single("productImg"),
  Controllers.Product.product_post
);
router.get("/:productID", Controllers.Product.product_get_description);
router.patch(
  "/:productID",
  Middlewares.CheckAuth,
  Controllers.Product.product_update
);
router.delete(
  "/:productID",
  Middlewares.CheckAuth,
  Controllers.Product.product_delete
);

module.exports = router;
