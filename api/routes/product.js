const express = require("express");
const router = express.Router();
const multer = require("multer");
const checkAuth = require("../middleware/checkAuth");
const Controllers = require("../Controllers/product");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype == "image/png" || file.mimetype == "image/jpeg") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 3,
  },
  fileFilter: fileFilter,
});

router.get("/", Controllers.product_get_controller);

router.post(
  "/",
  checkAuth,
  upload.single("productImage"),
  Controllers.product_post_controller
);

router.get("/:productID", Controllers.product_get_description_controller);

router.patch("/:productID", checkAuth, Controllers.product_update_controller);

router.delete("/:productID", checkAuth, Controllers.product_delete_controller);

module.exports = router;
