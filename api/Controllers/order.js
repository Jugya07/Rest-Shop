const mongoose = require("mongoose");
const Utils = require("../utils");
const Models = require("../models");
const Middlewares = require("../middlewares");

exports.order_get = Middlewares.CatchAsync(async (_req, res) => {
  const orders = await Models.Order.find();
  if (orders.length === 0) {
    return next(Utils.Response.error("No Orders yet created!", 400));
  }
  const result = {
    count: orders.length,
    orders: orders.map((doc) => {
      return {
        _id: doc._id,
        product: doc.product,
        quantity: doc.quantity,
        req: {
          type: "GET",
          url: `${process.env.BASE_URL}/orders/` + doc._id,
        },
      };
    }),
  };
  return res.json(Utils.Response.success(result));
});

exports.order_post = Middlewares.CatchAsync(async (req, res) => {
  const { productID, quantity } = req.body;
  const product = await Models.Product.findById(productID);
  if (!product) {
    return next(Utils.Response.error("No Product with the id!", 400));
  }
  const order = await Models.Order.create({
    _id: mongoose.Types.ObjectId(),
    quantity,
    product: productID,
  });
  return res.json(Utils.Response.success({ createdOrder: order }));
});

exports.order_get_description = Middlewares.CatchAsync(async (req, res) => {
  const { orderID } = req.params;
  const order = await Models.Order.findById({ _id: orderID });
  if (!order) {
    return next(Utils.Response.error("No order with the id!", 400));
  }
  return res.json({
    order,
    req: {
      type: "GET",
      url: `${process.env.BASE_URL}/orders/`,
    },
  });
});

exports.order_delete = Middlewares.CatchAsync(async (req, res) => {
  const { orderID } = req.params;
  await Models.Order.deleteOne({ _id: orderID });
  return res.json(Utils.Response.success("Order deleted"));
});
