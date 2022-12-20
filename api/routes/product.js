const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.status(200).json({
    message: "handling GET req to /products",
  });
});

router.post("/", (req, res, next) => {
  const product = {
    name: req.body.name,
    price: req.body.price,
  };
  res.status(201).json({
    message: "handling POST req to /products",
    product: product,
  });
});

router.get("/:productID", (req, res, next) => {
  const id = req.params.productID;
  if (id == 12345) {
    res.status(200).json({
      message: "Found the product",
      id: id,
    });
  } else {
    res.status(200).json({
      message: "Not found",
    });
  }
});

router.patch("/:productID", (req, res, next) => {
  const id = req.params.productID;
  res.status(200).json({
    message: `updated product with id ${id}`,
  });
});

router.delete("/:productID", (req, res, next) => {
  const id = req.params.productID;
  res.status(200).json({
    message: `deleted product with id ${id}`,
  });
});

module.exports = router;
