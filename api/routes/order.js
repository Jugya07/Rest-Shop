const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    message: "handling get req to /orders",
  });
});

router.post("/", (req, res, next) => {
  const order = {
    orderID: req.body.id,
    quantity: req.body.quantity,
  };
  res.status(201).json({
    message: "handling POST req to /order",
    order: order,
  });
});

router.delete("/:orderID", (req, res, next) => {
  const id = req.params.productID;
  res.status(200).json({
    message: `deleted order with id ${id}`,
  });
});

module.exports = router;
