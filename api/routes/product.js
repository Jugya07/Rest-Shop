const express = require("express");
const checkAuth = require("../middleware/checkAuth");
const Controllers = require("../controllers");
const Utils = require("../utils");
const router = express.Router();

router.get("/", Controllers.Product.product_get);
router.post(
  "/",
  checkAuth,
  Utils.Multer.upload.single("productImg"),
  Controllers.Product.product_post
);
router.get("/:productID", Controllers.Product.product_get_description);
router.patch("/:productID", checkAuth, Controllers.Product.product_update);
router.delete("/:productID", checkAuth, Controllers.Product.product_delete);

module.exports = router;
